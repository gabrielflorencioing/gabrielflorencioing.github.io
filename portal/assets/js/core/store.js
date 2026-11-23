/* Students Hub · AppState centralizado, persistência em localStorage, backup/restore e perfis demo */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const KEY = 'gabriel_florencio_students_hub_v1';
  const APP_ID = 'gabriel_florencio_students_hub';
  const VERSION = 1;
  const U = SH.util;

  let state = null;
  let persistent = true;
  const listeners = new Set();

  /* ---------- Esquema ---------- */
  const blankState = () => ({
    app: APP_ID,
    version: VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    session: { userId: null },
    users: {},
  });

  const blankProgress = () => ({
    xp: 0,
    readings: {},      // unitId -> { attempts: [...], bestScore, firstCompletedAt }
    topicStats: {},    // topicId -> { ok, total, lastWrongAt }
    activityDays: [],  // ['AAAA-MM-DD', ...] alimenta sequência e constância
    games: {},         // Etapa 2
    lastActiveAt: null,
  });

  function normalizeUser(u) {
    return Object.assign({
      id: U.uid('usr'),
      role: 'student',
      name: '',
      email: '',
      passwordHash: '',
      level: 'A1',
      goal: 'conversation',
      location: 'brasil',
      createdAt: new Date().toISOString(),
      demo: false,
      prefs: { audioPace: 'natural', fontScale: 1, highlightChunks: true },
      progress: blankProgress(),
      notebook: [],      // Etapa 4: caderno de dúvidas
      tasks: [],         // Etapa 4: checklist
      events: [],        // Etapa 4: agenda
      savedLexicon: [],  // Etapa 3: "Salvar no Meu Caderno"
      teacherNotes: '',  // Etapa 5: visível apenas ao professor
    }, u, {
      prefs: Object.assign({ audioPace: 'natural', fontScale: 1, highlightChunks: true }, u.prefs || {}),
      progress: Object.assign(blankProgress(), u.progress || {}),
    });
  }

  /* ---------- Persistência ---------- */
  function save() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      persistent = true;
    } catch (e) {
      persistent = false;
    }
    listeners.forEach((fn) => fn(state));
  }

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { persistent = false; }
    let parsed = null;
    if (raw) {
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    }
    state = isValidState(parsed) ? parsed : blankState();
    Object.keys(state.users).forEach((id) => { state.users[id] = normalizeUser(state.users[id]); });
    ensureDemoUsers();
    if (state.session.userId && !state.users[state.session.userId]) state.session.userId = null;
    save();
    return state;
  }

  function isValidState(s) {
    return !!(s && s.app === APP_ID && s.users && typeof s.users === 'object' && s.session);
  }

  /* ---------- Usuários e sessão ---------- */
  const getUser = (id) => (state && state.users[id]) || null;
  const currentUser = () => (state ? getUser(state.session.userId) : null);
  const allUsers = () => Object.values(state.users);
  const students = () => allUsers().filter((u) => u.role === 'student');
  const findByEmail = (email) =>
    allUsers().find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase()) || null;

  function setSession(userId) {
    state.session.userId = userId;
    save();
  }

  async function createStudent({ name, email, password, level, goal, location }) {
    const user = normalizeUser({
      id: U.uid('usr'),
      role: 'student',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await U.hashPassword(password, email.trim()),
      level, goal, location,
    });
    state.users[user.id] = user;
    save();
    return user;
  }

  async function authenticate(email, password) {
    const user = findByEmail(email);
    if (!user) return { ok: false, reason: 'email' };
    if (user.demo && user.passwordHash === 'demo') {
      return password === DEMO_PASSWORD ? { ok: true, user } : { ok: false, reason: 'password' };
    }
    const hash = await U.hashPassword(password, user.email);
    if (hash !== user.passwordHash) return { ok: false, reason: 'password' };
    return { ok: true, user };
  }

  function updateUser(id, mutator) {
    const u = getUser(id);
    if (!u) return null;
    mutator(u);
    save();
    return u;
  }

  /* ---------- Progresso ---------- */
  function markActivity(user, when = new Date()) {
    const key = U.dayKey(when);
    const days = user.progress.activityDays;
    if (!days.includes(key)) {
      days.push(key);
      days.sort();
    }
    const iso = when.toISOString();
    if (!user.progress.lastActiveAt || iso > user.progress.lastActiveAt) user.progress.lastActiveAt = iso;
  }

  /** Sequência de dias: conta dias consecutivos terminando hoje (ou ontem, se ainda não estudou hoje) */
  function streak(user) {
    const set = new Set(user.progress.activityDays);
    const d = new Date();
    if (!set.has(U.dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(U.dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  const xpForAttempt = (correct, isFirst) => (isFirst ? correct * 10 + 15 : correct * 5);

  /**
   * Registra uma avaliação de leitura e atualiza XP, tópicos e atividade.
   * @param {object} user
   * @param {object} unit  unidade de SH.content
   * @param {number[]} chosen  índices escolhidos pelo aluno, na ordem das questões
   * @param {Date} [when]
   */
  function applyReadingAttempt(user, unit, chosen, when = new Date()) {
    const rec = user.progress.readings[unit.id] || { attempts: [], bestScore: 0, firstCompletedAt: null };
    const isFirst = rec.attempts.length === 0;
    const answers = unit.questions.map((q, i) => ({
      qid: q.id, chosen: chosen[i], correct: q.answer, ok: chosen[i] === q.answer, cat: q.cat,
    }));
    const score = answers.filter((a) => a.ok).length;
    const attempt = {
      id: U.uid('att'),
      unitId: unit.id,
      date: when.toISOString(),
      score,
      total: unit.questions.length,
      xp: xpForAttempt(score, isFirst),
      first: isFirst,
      answers,
    };
    rec.attempts.push(attempt);
    rec.bestScore = Math.max(rec.bestScore, score);
    if (!rec.firstCompletedAt) rec.firstCompletedAt = attempt.date;
    user.progress.readings[unit.id] = rec;
    user.progress.xp += attempt.xp;
    answers.forEach((a) => {
      const t = user.progress.topicStats[a.cat] || { ok: 0, total: 0, lastWrongAt: null };
      t.total += 1;
      if (a.ok) t.ok += 1; else t.lastWrongAt = attempt.date;
      user.progress.topicStats[a.cat] = t;
    });
    markActivity(user, when);
    return attempt;
  }

  function recordReading(userId, unit, chosen) {
    let attempt = null;
    updateUser(userId, (u) => { attempt = applyReadingAttempt(u, unit, chosen); });
    return attempt;
  }

  /** Visão consolidada para dashboards */
  function summary(user) {
    const p = user.progress;
    const recs = Object.values(p.readings);
    const attempts = recs.flatMap((r) => r.attempts);
    const totalQ = attempts.reduce((s, a) => s + a.total, 0);
    const totalOk = attempts.reduce((s, a) => s + a.score, 0);
    const topics = Object.entries(p.topicStats).map(([id, t]) => ({
      id, ...SH.content.topic(id), ok: t.ok, total: t.total, rate: t.total ? t.ok / t.total : 0, lastWrongAt: t.lastWrongAt,
    }));
    return {
      xp: p.xp,
      streak: streak(user),
      unitsDone: recs.filter((r) => r.attempts.length).length,
      attempts: attempts.sort((a, b) => (a.date < b.date ? 1 : -1)),
      accuracy: totalQ ? Math.round((totalOk / totalQ) * 100) : null,
      lastActiveAt: p.lastActiveAt,
      strengths: topics.filter((t) => t.total >= 2 && t.rate >= 0.8).sort((a, b) => b.rate - a.rate || b.total - a.total),
      attention: topics.filter((t) => t.total >= 2 && t.rate < 0.7).sort((a, b) => a.rate - b.rate || b.total - a.total),
    };
  }

  /* ---------- Backup ---------- */
  function exportJSON() {
    return JSON.stringify(Object.assign({}, state, { exportedAt: new Date().toISOString() }), null, 2);
  }

  /** Valida um backup e devolve um resumo, sem aplicar */
  function inspectBackup(obj) {
    if (!isValidState(obj)) return { ok: false, message: 'Este arquivo não é um backup válido do Students Hub.' };
    const users = Object.values(obj.users);
    if (!users.every((u) => u && typeof u.name === 'string' && typeof u.email === 'string')) {
      return { ok: false, message: 'O backup tem contas com dados incompletos e não pode ser restaurado.' };
    }
    return {
      ok: true,
      exportedAt: obj.exportedAt || obj.updatedAt,
      students: users.filter((u) => u.role === 'student').length,
      teachers: users.filter((u) => u.role === 'teacher').length,
    };
  }

  function importBackup(obj) {
    const check = inspectBackup(obj);
    if (!check.ok) return check;
    const currentId = state.session.userId;
    const next = JSON.parse(JSON.stringify(obj));
    delete next.exportedAt;
    Object.keys(next.users).forEach((id) => { next.users[id] = normalizeUser(next.users[id]); });
    next.session = { userId: next.users[currentId] ? currentId : null };
    state = next;
    ensureDemoUsers();
    save();
    return { ok: true, keptSession: !!state.session.userId };
  }

  /* ---------- Perfis de demonstração ---------- */
  const DEMO_PASSWORD = 'demo1234';
  const DEMO = {
    teacher: {
      id: 'demo-teacher', role: 'teacher', demo: true,
      name: 'Gabriel Florencio', email: 'gabriel@demo.studentshub.app',
      level: 'B2', goal: 'teaching', location: 'brasil', createdDaysAgo: 60,
    },
    julia: {
      id: 'demo-julia', role: 'student', demo: true,
      name: 'Julia Martins', email: 'julia@demo.studentshub.app',
      level: 'A2', goal: 'work-travel', location: 'brasil', createdDaysAgo: 22,
      history: [
        { unit: 'a1-routines-tuesday', daysAgo: 9, wrong: ['q7', 'q9'] },
        { unit: 'a2-memories-lisbon', daysAgo: 3, wrong: ['q3', 'q4', 'q5', 'q6'] },
      ],
      extraDays: [20, 19, 15, 14, 8, 2, 1],
    },
    renan: {
      id: 'demo-renan', role: 'student', demo: true,
      name: 'Renan Albuquerque', email: 'renan@demo.studentshub.app',
      level: 'B1', goal: 'career', location: 'brasil', createdDaysAgo: 48,
      history: [
        { unit: 'a1-routines-tuesday', daysAgo: 38, wrong: [] },
        { unit: 'a2-memories-lisbon', daysAgo: 30, wrong: ['q8'] },
        { unit: 'b1-work-polite-emails', daysAgo: 9, wrong: ['q3', 'q4', 'q5'] },
        { unit: 'b2-opinions-abroad', daysAgo: 1, wrong: ['q2', 'q3', 'q4'] },
      ],
      extraDays: [44, 41, 37, 33, 29, 26, 22, 19, 15, 14, 13, 12, 11, 10, 8, 7, 6, 5, 4, 3, 2, 0],
    },
  };

  function buildDemoUser(spec, hash) {
    const user = normalizeUser({
      id: spec.id, role: spec.role, demo: true, name: spec.name, email: spec.email,
      passwordHash: hash, level: spec.level, goal: spec.goal, location: spec.location,
      createdAt: U.daysAgoDate(spec.createdDaysAgo, 10).toISOString(),
    });
    (spec.extraDays || []).forEach((d) => markActivity(user, U.daysAgoDate(d, d === 0 ? Math.min(new Date().getHours(), 8) : 20, 10)));
    (spec.history || []).forEach((h) => {
      const unit = SH.content.unit(h.unit);
      if (!unit) return;
      const chosen = unit.questions.map((q) => (h.wrong.includes(q.id) ? (q.answer + 1) % q.options.length : q.answer));
      applyReadingAttempt(user, unit, chosen, U.daysAgoDate(h.daysAgo, 19, 30));
    });
    return user;
  }

  /** Garante que as 3 contas demo existam (sem sobrescrever o progresso já feito nelas) */
  function ensureDemoUsers() {
    Object.values(DEMO).forEach((spec) => {
      if (!state.users[spec.id]) state.users[spec.id] = buildDemoUser(spec, 'demo');
    });
  }

  /** Recria do zero as contas demo (útil para reapresentar o portal) */
  function resetDemoUsers() {
    Object.values(DEMO).forEach((spec) => { state.users[spec.id] = buildDemoUser(spec, 'demo'); });
    save();
  }

  SH.store = {
    KEY, DEMO_PASSWORD,
    load, save,
    get state() { return state; },
    get persistent() { return persistent; },
    onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    getUser, currentUser, allUsers, students, findByEmail, setSession,
    createStudent, authenticate, updateUser,
    recordReading, summary, streak, markActivity,
    exportJSON, inspectBackup, importBackup, resetDemoUsers,
    demoIds: { teacher: DEMO.teacher.id, julia: DEMO.julia.id, renan: DEMO.renan.id },
  };
})(window.SH);

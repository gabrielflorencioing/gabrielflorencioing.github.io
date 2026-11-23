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

  async function createStudent({ name, email, password, level, goal, location, createdBy = 'self' }) {
    const user = normalizeUser({
      id: U.uid('usr'),
      role: 'student',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await U.hashPassword(password, email.trim()),
      passwordIssuedAt: new Date().toISOString(),
      mustChangePassword: createdBy === 'teacher',
      createdBy,
      level, goal, location,
    });
    state.users[user.id] = user;
    save();
    return user;
  }

  /** Define uma nova senha. mustChange = true quando o professor gera uma senha temporária. */
  async function setPassword(id, password, mustChange = false) {
    const u = getUser(id);
    if (!u) return null;
    const hash = await U.hashPassword(password, u.email);
    return updateUser(id, (x) => {
      x.passwordHash = hash;
      x.passwordIssuedAt = new Date().toISOString();
      x.mustChangePassword = mustChange;
    });
  }

  function removeStudent(id) {
    const u = getUser(id);
    if (!u || u.role !== 'student') return false;
    delete state.users[id];
    if (state.session.userId === id) state.session.userId = null;
    save();
    return true;
  }

  /* ---------- Link de acesso individual (leva a conta para o aparelho do aluno) ---------- */
  const b64urlEncode = (str) => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64urlDecode = (str) => decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4))));

  function buildInvite(id) {
    const u = getUser(id);
    if (!u) return null;
    const data = {
      v: 1, app: APP_ID, id: u.id, name: u.name, email: u.email, passwordHash: u.passwordHash,
      passwordIssuedAt: u.passwordIssuedAt, mustChangePassword: !!u.mustChangePassword,
      level: u.level, goal: u.goal, location: u.location, createdAt: u.createdAt,
    };
    return b64urlEncode(JSON.stringify(data));
  }

  function parseInvite(token) {
    try {
      const d = JSON.parse(b64urlDecode(token));
      if (d.app !== APP_ID || !d.email || !d.name || !d.passwordHash) return null;
      return d;
    } catch (e) { return null; }
  }

  /** Cria a conta no aparelho do aluno, ou atualiza a senha se o convite for mais recente. */
  function acceptInvite(d) {
    const existing = findByEmail(d.email);
    if (existing) {
      if (existing.role !== 'student') return { ok: false, message: 'Este e-mail pertence a outra conta neste aparelho.' };
      if ((d.passwordIssuedAt || '') > (existing.passwordIssuedAt || '')) {
        updateUser(existing.id, (x) => {
          x.passwordHash = d.passwordHash; x.passwordIssuedAt = d.passwordIssuedAt; x.mustChangePassword = d.mustChangePassword;
        });
        return { ok: true, user: existing, status: 'updated' };
      }
      return { ok: true, user: existing, status: 'exists' };
    }
    const user = normalizeUser({
      id: state.users[d.id] ? U.uid('usr') : d.id,
      role: 'student', name: d.name, email: d.email, passwordHash: d.passwordHash,
      passwordIssuedAt: d.passwordIssuedAt, mustChangePassword: d.mustChangePassword, createdBy: 'teacher',
      level: d.level, goal: d.goal, location: d.location, createdAt: d.createdAt,
    });
    state.users[user.id] = user;
    save();
    return { ok: true, user, status: 'created' };
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

  /**
   * Registra uma partida de jogo.
   * @param {{score:number,total:number,maxCombo:number,items:{cat:string,ok:boolean}[]}} r
   */
  function applyGameResult(user, gameId, r, when = new Date()) {
    const g = user.progress.games[gameId] || { plays: 0, bestScore: 0, bestTotal: r.total, totalXp: 0, history: [] };
    const xp = r.score * 8 + Math.max(0, r.maxCombo - 1) * 3;
    const entry = { id: U.uid('gm'), date: when.toISOString(), score: r.score, total: r.total, maxCombo: r.maxCombo, xp };
    g.plays += 1;
    g.history.push(entry);
    if (r.score / r.total >= g.bestScore / (g.bestTotal || r.total)) { g.bestScore = r.score; g.bestTotal = r.total; }
    g.totalXp += xp;
    g.lastPlayed = entry.date;
    user.progress.games[gameId] = g;
    user.progress.xp += xp;
    (r.items || []).forEach((a) => {
      const t = user.progress.topicStats[a.cat] || { ok: 0, total: 0, lastWrongAt: null };
      t.total += 1;
      if (a.ok) t.ok += 1; else t.lastWrongAt = entry.date;
      user.progress.topicStats[a.cat] = t;
    });
    markActivity(user, when);
    return entry;
  }

  function recordGame(userId, gameId, result) {
    let entry = null;
    updateUser(userId, (u) => { entry = applyGameResult(u, gameId, result); });
    return entry;
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
      games: [
        { game: 'context-challenge', daysAgo: 2, score: 6, total: 10, maxCombo: 3,
          wrong: ['prepositions', 'prepositions', 'prepositions', 'past-simple'], right: ['verb-choice', 'verb-choice', 'verb-choice', 'prepositions', 'prepositions', 'verb-choice'] },
      ],
      notes: [
        { daysAgo: 2, title: 'IN ou ON no transporte?', topic: 'Preposições', shared: true,
          body: 'Fiquei em dúvida: por que é "on the train" mas "in a taxi"? E no Uber, qual eu uso?' },
        { daysAgo: 6, title: 'Chunk que gostei', topic: 'Chunks', shared: false,
          body: '"I\'m running late" serve para avisar que estou atrasada. Usei hoje com minha chefe por mensagem.' },
      ],
      tasks: [
        { title: 'Reler "The Day I Missed My Train in Lisbon" e refazer a avaliação', priority: 'high', done: false },
        { title: 'Ouvir o Word Bank da unidade A2 em velocidade pausada', priority: 'medium', done: true },
        { title: 'Escrever 5 frases sobre minha última viagem no Past Simple', priority: 'medium', done: false },
      ],
      events: [
        { inDays: 2, time: '19:00', type: 'class', title: 'Aula com o Gabriel', note: 'Levar dúvida sobre preposições de transporte.' },
        { inDays: 5, time: '09:00', type: 'deadline', title: 'Entregar frases de viagem no Past Simple', note: '' },
      ],
      lexicon: ['lx-t3', 'lx-f2'],
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
      games: [
        { game: 'chunk-builder', daysAgo: 12, score: 4, total: 6, maxCombo: 2, wrong: ['conditionals', 'question-formation'], right: ['word-order', 'modals-politeness', 'frequency-adverbs', 'past-continuous'] },
        { game: 'chunk-builder', daysAgo: 4, score: 5, total: 6, maxCombo: 4, wrong: ['conditionals'], right: ['word-order', 'modals-politeness', 'frequency-adverbs', 'question-formation', 'past-continuous'] },
        { game: 'context-challenge', daysAgo: 6, score: 9, total: 10, maxCombo: 7, wrong: ['verb-choice'], right: ['prepositions', 'prepositions', 'prepositions', 'prepositions', 'prepositions', 'verb-choice', 'verb-choice', 'verb-choice', 'past-simple'] },
        { game: 'collocation-match', daysAgo: 3, score: 10, total: 12, maxCombo: 6, wrong: ['collocations', 'collocations'], right: Array(10).fill('collocations') },
      ],
      notes: [
        { daysAgo: 1, title: '"If I would have known" está errado?', topic: 'Condicionais', shared: true,
          body: 'No texto do Thiago aparece "If I had known... I would have relaxed". Ouço muita gente dizer "if I would have known" em calls. Posso usar?' },
        { daysAgo: 3, title: 'reach out to x contact', topic: 'Phrasal Verbs', shared: true,
          body: 'Qual a diferença de tom entre "reach out to" e "contact" num e-mail para cliente?' },
        { daysAgo: 8, title: 'Frase pronta para reunião', topic: 'Modais de polidez', shared: false,
          body: '"Would it be possible to push the deadline to Friday?" Usei com o time de Toronto e funcionou muito bem.' },
      ],
      tasks: [
        { title: 'Escrever um e-mail de follow-up usando follow up on e keep you posted', priority: 'high', done: false },
        { title: 'Revisar o mapa mental de tempos verbais (parte de hipóteses)', priority: 'high', done: false },
        { title: 'Jogar Collocation Match até fazer 12 de 12', priority: 'low', done: false },
        { title: 'Refazer a avaliação da unidade B1', priority: 'medium', done: true },
      ],
      events: [
        { inDays: 1, time: '08:30', type: 'class', title: 'Aula com o Gabriel', note: 'Simulação de reunião com o cliente.' },
        { inDays: 3, time: '14:00', type: 'reminder', title: 'Call real com o time de Toronto', note: 'Usar I see your point e just to clarify.' },
        { inDays: 6, time: '18:00', type: 'deadline', title: 'Enviar texto de opinião sobre trabalho remoto', note: '' },
      ],
      lexicon: ['lx-w1', 'lx-w3', 'lx-w4', 'lx-c2'],
      teacherNotes: 'Muito bom em compreensão e com repertório corporativo crescente. Trava em condicionais sob pressão: trabalhar hipóteses com cenários reais do trabalho dele.',
    },
  };

  function buildDemoUser(spec, hash) {
    const user = normalizeUser({
      id: spec.id, role: spec.role, demo: true, name: spec.name, email: spec.email,
      passwordHash: hash, level: spec.level, goal: spec.goal, location: spec.location,
      createdAt: U.daysAgoDate(spec.createdDaysAgo, 10).toISOString(),
    });
    (spec.extraDays || []).forEach((d) => markActivity(user, U.daysAgoDate(d, d === 0 ? Math.min(new Date().getHours(), 8) : 20, 10)));
    (spec.games || []).forEach((g) => {
      const items = g.right.map((cat) => ({ cat, ok: true })).concat(g.wrong.map((cat) => ({ cat, ok: false })));
      applyGameResult(user, g.game, { score: g.score, total: g.total, maxCombo: g.maxCombo, items }, U.daysAgoDate(g.daysAgo, 20, 15));
    });
    (spec.notes || []).forEach((n) => {
      const iso = U.daysAgoDate(n.daysAgo, 21).toISOString();
      user.notebook.push({ id: U.uid('nt'), title: n.title, topic: n.topic, body: n.body, shared: n.shared, createdAt: iso, updatedAt: iso });
    });
    (spec.tasks || []).forEach((t, i) => {
      user.tasks.push({ id: U.uid('tk'), title: t.title, priority: t.priority, done: t.done,
        createdAt: U.daysAgoDate(5 - i, 10).toISOString(), doneAt: t.done ? U.daysAgoDate(1, 18).toISOString() : null });
    });
    (spec.events || []).forEach((e) => {
      user.events.push({ id: U.uid('ev'), title: e.title, date: U.dayKey(U.daysAgoDate(-e.inDays)), time: e.time, type: e.type, note: e.note });
    });
    user.savedLexicon = (spec.lexicon || []).slice();
    user.teacherNotes = spec.teacherNotes || '';
    (spec.history || []).forEach((h) => {
      const unit = SH.content.unit(h.unit);
      if (!unit) return;
      const chosen = unit.questions.map((q) => (h.wrong.includes(q.id) ? (q.answer + 1) % q.options.length : q.answer));
      applyReadingAttempt(user, unit, chosen, U.daysAgoDate(h.daysAgo, 19, 30));
    });
    return user;
  }

  /** Garante que as 3 contas demo existam (sem sobrescrever o progresso já feito nelas) */
  const DEMO_VERSION = 2;
  function ensureDemoUsers() {
    const outdated = state.demoVersion !== DEMO_VERSION;
    Object.values(DEMO).forEach((spec) => {
      if (!state.users[spec.id] || outdated) state.users[spec.id] = buildDemoUser(spec, 'demo');
    });
    state.demoVersion = DEMO_VERSION;
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
    createStudent, authenticate, updateUser, setPassword, removeStudent, buildInvite, parseInvite, acceptInvite,
    recordReading, recordGame, summary, streak, markActivity,
    exportJSON, inspectBackup, importBackup, resetDemoUsers,
    demoIds: { teacher: DEMO.teacher.id, julia: DEMO.julia.id, renan: DEMO.renan.id },
  };
})(window.SH);

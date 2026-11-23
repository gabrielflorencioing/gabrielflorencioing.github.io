/* Students Hub · Camada de dados: modo local (localStorage) ou nuvem (Supabase)
 * Todas as telas usam SH.backend para login, cadastro e gestão de alunos.
 * No modo nuvem, o estado em memória (SH.store) é sincronizado com o banco.
 */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const cfg = window.SH_CONFIG || {};
  const cloud = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase && window.supabase.createClient);
  const DIRTY_KEY = 'gabriel_florencio_students_hub_v1_unsynced';

  let sb = null;
  const sync = { timer: null, retry: null, lastData: {}, lastNotes: {}, lastRefresh: 0, suppress: false, status: 'idle', busy: null };

  const client = () => {
    if (!sb) {
      sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'gabriel_florencio_students_hub_auth' },
      });
    }
    return sb;
  };

  /* ---------- Indicador de sincronização ---------- */
  const STATUS = {
    saving: ['Salvando...', 'is-saving'],
    saved: ['Salvo na nuvem', 'is-saved'],
    error: ['Sem conexão: tentando de novo', 'is-error'],
    idle: ['Conectado à nuvem', 'is-saved'],
  };
  function setStatus(st) {
    sync.status = st;
    const el = document.getElementById('sync-status');
    if (!el) return;
    el.className = 'sync ' + STATUS[st][1];
    el.querySelector('.sync__txt').textContent = STATUS[st][0];
  }

  const markDirty = (id) => { try { localStorage.setItem(DIRTY_KEY, id); } catch (e) { /* sem armazenamento */ } };
  const clearDirty = () => { try { localStorage.removeItem(DIRTY_KEY); } catch (e) { /* idem */ } };
  const dirtyUser = () => { try { return localStorage.getItem(DIRTY_KEY); } catch (e) { return null; } };

  /* ---------- Conversão entre linhas do banco e o modelo do portal ---------- */
  const dataOf = (u) => ({ progress: u.progress, notebook: u.notebook, tasks: u.tasks, events: u.events, savedLexicon: u.savedLexicon, prefs: u.prefs });

  function toUser(p, row, notes) {
    const d = (row && row.data) || {};
    return {
      id: p.id, role: p.role, name: p.name, email: p.email, level: p.level, goal: p.goal, location: p.location,
      createdBy: p.created_by, mustChangePassword: !!p.must_change_password, createdAt: p.created_at,
      passwordHash: '', demo: false,
      prefs: d.prefs, progress: d.progress,
      notebook: d.notebook || [], tasks: d.tasks || [], events: d.events || [], savedLexicon: d.savedLexicon || [],
      teacherNotes: notes || '',
    };
  }

  function friendly(error) {
    const msg = String((error && error.message) || error || '');
    if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
    if (/email not confirmed/i.test(msg)) return 'Confirme o seu e-mail pelo link que o Supabase enviou antes de entrar.';
    if (/already registered|already been registered|already exists/i.test(msg)) return 'Já existe uma conta com este e-mail.';
    if (/rate limit|too many/i.test(msg)) return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
    if (/password/i.test(msg) && /6|short|weak/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (/fetch|network|failed to/i.test(msg)) return 'Sem conexão com o servidor. Verifique sua internet.';
    return msg || 'Algo deu errado. Tente de novo.';
  }

  /* ---------- Carregar dados do servidor ---------- */
  async function hydrate(userId) {
    const c = client();
    const me = await c.from('profiles').select('*').eq('id', userId).single();
    if (me.error) throw me.error;
    let profiles = [me.data];
    let rows;
    let notes = [];
    if (me.data.role === 'teacher') {
      const [p, d, n] = await Promise.all([
        c.from('profiles').select('*'),
        c.from('student_data').select('*'),
        c.from('teacher_notes').select('*'),
      ]);
      if (p.error || d.error || n.error) throw (p.error || d.error || n.error);
      profiles = p.data; rows = d.data; notes = n.data;
    } else {
      const d = await c.from('student_data').select('*').eq('user_id', userId);
      if (d.error) throw d.error;
      rows = d.data;
    }
    const rowBy = Object.fromEntries(rows.map((r) => [r.user_id, r]));
    const noteBy = Object.fromEntries(notes.map((n) => [n.student_id, n.notes]));
    const users = profiles.map((p) => toUser(p, rowBy[p.id], noteBy[p.id]));
    sync.suppress = true;
    SH.store.hydrate(users, userId);
    sync.suppress = false;
    SH.store.allUsers().forEach((u) => {
      sync.lastData[u.id] = JSON.stringify(dataOf(u));
      sync.lastNotes[u.id] = u.teacherNotes || '';
    });
    sync.lastRefresh = Date.now();
    return SH.store.currentUser();
  }

  /* ---------- Enviar alterações ---------- */
  function schedule() {
    if (!cloud || sync.suppress || !SH.store.currentUser()) return;
    markDirty(SH.store.currentUser().id);
    setStatus('saving');
    clearTimeout(sync.timer);
    sync.timer = setTimeout(push, 700);
  }

  async function push() {
    clearTimeout(sync.timer);
    clearTimeout(sync.retry);
    const u = SH.store.currentUser();
    if (!cloud || !u) return;
    if (sync.busy) { await sync.busy; }
    sync.busy = (async () => {
      try {
        const c = client();
        const json = JSON.stringify(dataOf(u));
        if (json !== sync.lastData[u.id]) {
          const r = await c.from('student_data').upsert({ user_id: u.id, data: JSON.parse(json), updated_at: new Date().toISOString() });
          if (r.error) throw r.error;
          sync.lastData[u.id] = json;
        }
        if (u.role === 'teacher') {
          for (const s of SH.store.students()) {
            const text = s.teacherNotes || '';
            if (text !== (sync.lastNotes[s.id] || '')) {
              const r = await c.from('teacher_notes').upsert({ student_id: s.id, notes: text, updated_at: new Date().toISOString() });
              if (r.error) throw r.error;
              sync.lastNotes[s.id] = text;
            }
          }
        }
        clearDirty();
        setStatus('saved');
      } catch (e) {
        setStatus('error');
        sync.retry = setTimeout(push, 6000);
      }
    })();
    await sync.busy;
    sync.busy = null;
  }

  window.addEventListener('online', () => { if (cloud && sync.status === 'error') push(); });
  window.addEventListener('beforeunload', () => { if (cloud && sync.status === 'saving') push(); });

  /* =========================================================
   * API PÚBLICA
   * ========================================================= */
  const api = {
    cloud,
    allowSelfSignup: cfg.allowSelfSignup !== false,

    /** Restaura a sessão (nuvem) antes de desenhar a primeira tela */
    async init() {
      SH.store.onChange(schedule);
      if (!cloud) return SH.store.currentUser();
      try {
        const { data } = await client().auth.getSession();
        const session = data && data.session;
        if (!session) { SH.store.clearUsers(); return null; }
        // Se ficou algo sem enviar (ex.: fechou offline), envia antes de baixar do servidor
        if (dirtyUser() === session.user.id && SH.store.getUser(session.user.id)) {
          SH.store.setSession(session.user.id);
          await push();
        }
        await hydrate(session.user.id);
        setStatus('saved');
        return SH.store.currentUser();
      } catch (e) {
        // Sem internet: segue com a cópia local da última sessão
        const cached = SH.store.currentUser();
        if (cached) setTimeout(() => setStatus('error'), 300);
        return cached;
      }
    },

    async login(email, password) {
      if (!cloud) return SH.store.authenticate(email, password).then((r) => { if (r.ok) SH.store.setSession(r.user.id); return r; });
      const { data, error } = await client().auth.signInWithPassword({ email: email.trim(), password });
      if (error) return { ok: false, reason: /credentials/i.test(error.message) ? 'credentials' : 'other', message: friendly(error) };
      try { await hydrate(data.user.id); } catch (e) { return { ok: false, reason: 'other', message: friendly(e) }; }
      return { ok: true, user: SH.store.currentUser() };
    },

    async signup({ name, email, password, level, goal, location }) {
      if (!cloud) {
        if (SH.store.findByEmail(email)) return { ok: false, reason: 'exists', message: 'Já existe uma conta com este e-mail. Use a aba Entrar.' };
        const user = await SH.store.createStudent({ name, email, password, level, goal, location });
        SH.store.setSession(user.id);
        return { ok: true, user };
      }
      const { data, error } = await client().auth.signUp({ email: email.trim(), password, options: { data: { name, level, goal, location } } });
      if (error) return { ok: false, reason: /registered|exists/i.test(error.message) ? 'exists' : 'other', message: friendly(error) };
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { ok: false, reason: 'exists', message: 'Já existe uma conta com este e-mail. Use a aba Entrar.' };
      }
      if (!data.session) return { ok: true, needsConfirm: true };
      await hydrate(data.user.id);
      return { ok: true, user: SH.store.currentUser() };
    },

    async logout() {
      if (cloud) {
        await push().catch(() => {});
        try { await client().auth.signOut(); } catch (e) { /* segue mesmo offline */ }
        sync.lastData = {}; sync.lastNotes = {};
        SH.store.clearUsers();
        clearDirty();
      } else {
        SH.store.setSession(null);
      }
    },

    async changeOwnPassword(password) {
      const u = SH.store.currentUser();
      if (!cloud) { await SH.store.setPassword(u.id, password, false); return { ok: true }; }
      const r = await client().auth.updateUser({ password });
      if (r.error) return { ok: false, message: friendly(r.error) };
      const p = await client().from('profiles').update({ must_change_password: false }).eq('id', u.id);
      if (p.error) return { ok: false, message: friendly(p.error) };
      sync.suppress = true;
      SH.store.updateUser(u.id, (x) => { x.mustChangePassword = false; });
      sync.suppress = false;
      return { ok: true };
    },

    /* ----- Ações do professor ----- */
    async createStudent({ name, email, password, level, goal, location, mustChange }) {
      if (!cloud) {
        if (SH.store.findByEmail(email)) return { ok: false, reason: 'exists', message: 'Já existe uma conta com este e-mail.' };
        const user = await SH.store.createStudent({ name, email, password, level, goal, location, createdBy: 'teacher' });
        if (!mustChange) SH.store.updateUser(user.id, (x) => { x.mustChangePassword = false; });
        return { ok: true, user };
      }
      // Cliente temporário: cria a conta do aluno sem encerrar a sessão do professor
      const temp = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'sh-temp-' + Date.now() },
      });
      const { data, error } = await temp.auth.signUp({
        email: email.trim(), password,
        options: { data: { name, level, goal, location, created_by: 'teacher', must_change_password: !!mustChange } },
      });
      if (error) return { ok: false, reason: /registered|exists/i.test(error.message) ? 'exists' : 'other', message: friendly(error) };
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { ok: false, reason: 'exists', message: 'Já existe uma conta com este e-mail.' };
      }
      if (data.session) { try { await temp.auth.signOut(); } catch (e) { /* sessão temporária */ } }
      await api.refreshClass(true);
      return { ok: true, user: SH.store.getUser(data.user.id), needsConfirm: !data.session };
    },

    async resetStudentPassword(id, password) {
      if (!cloud) { await SH.store.setPassword(id, password, true); return { ok: true }; }
      const r = await client().rpc('teacher_reset_password', { student: id, new_password: password });
      if (r.error) return { ok: false, message: friendly(r.error) };
      sync.suppress = true;
      SH.store.updateUser(id, (x) => { x.mustChangePassword = true; x.passwordIssuedAt = new Date().toISOString(); });
      sync.suppress = false;
      return { ok: true };
    },

    async removeStudent(id) {
      if (!cloud) return { ok: SH.store.removeStudent(id) };
      const r = await client().rpc('teacher_delete_student', { student: id });
      if (r.error) return { ok: false, message: friendly(r.error) };
      sync.suppress = true;
      SH.store.removeStudent(id);
      sync.suppress = false;
      return { ok: true };
    },

    /** Atualiza a turma (professor). Retorna true se buscou dados novos. */
    async refreshClass(force = false) {
      const u = SH.store.currentUser();
      if (!cloud || !u || u.role !== 'teacher') return false;
      if (!force && Date.now() - sync.lastRefresh < 20000) return false;
      try {
        await push();
        await hydrate(u.id);
        return true;
      } catch (e) {
        setStatus('error');
        return false;
      }
    },

    /** Endereço de acesso que o professor envia ao aluno */
    accessLink(id) {
      const base = location.href.split('#')[0];
      return cloud ? base : base + '#/convite/' + SH.store.buildInvite(id);
    },

    statusHTML() {
      if (!cloud) return '';
      const [txt, cls] = STATUS[sync.status === 'idle' ? 'idle' : sync.status];
      return `<span id="sync-status" class="sync ${cls}" role="status"><span class="sync__dot" aria-hidden="true"></span><span class="sync__txt">${txt}</span></span>`;
    },
  };

  SH.backend = api;
})(window.SH);

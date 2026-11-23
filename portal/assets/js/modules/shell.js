/* Students Hub · Estrutura do app: navegação lateral, barra superior, menu do usuário e backup */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;

  /** Itens de navegação. stage = etapa em que o módulo é entregue. */
  const NAV = [
    { route: 'home', label: 'Início', icon: 'home', stage: 1 },
    { route: 'reading', label: 'Trilhas de Leitura', icon: 'book', stage: 1, num: 1 },
    { route: 'games', label: 'Arena de Jogos', icon: 'game', stage: 2, num: 2 },
    { route: 'maps', label: 'Mapas Mentais', icon: 'map', stage: 3, num: 3 },
    { route: 'lexicon', label: 'Léxico da Vida Real', icon: 'lexicon', stage: 3, num: 4 },
    { route: 'profile', label: 'Perfil Cognitivo', icon: 'profile', stage: 4, num: 5 },
    { route: 'agenda', label: 'Agenda e Caderno', icon: 'calendar', stage: 4, num: 6 },
    { route: 'teacher', label: 'Central do Professor', icon: 'teacher', stage: 5, num: 7, teacherOnly: true },
  ];
  const AVAILABLE_STAGE = 5;
  let escHandler = null;

  function navItems(user) {
    return NAV.filter((n) => !n.teacherOnly || user.role === 'teacher');
  }

  function render(root, user) {
    root.innerHTML = `
      <div class="shell">
        <a class="skip-link" href="#main">Pular para o conteúdo</a>
        <aside class="sidebar" id="sidebar" aria-label="Navegação principal">
          <div class="sidebar__top">
            <a class="brandmark" href="#/home" aria-label="Students Hub, ir para o início">
              <span class="brandmark__logo" aria-hidden="true">G</span>
              <span><strong>Students Hub</strong><small>Gabriel Florencio</small></span>
            </a>
            <button class="icon-btn sidebar__close" data-action="close-nav" aria-label="Fechar menu">${SH.icon('close')}</button>
          </div>
          <nav class="nav">
            <p class="nav__label">Seu espaço</p>
            <ul>
              ${navItems(user).map((n) => `
                <li>
                  <a class="nav__link ${n.teacherOnly ? 'nav__link--teacher' : ''}" href="#/${n.route}" data-route="${n.route}">
                    ${SH.icon(n.icon)}
                    <span class="nav__text">${n.label}${n.stage > AVAILABLE_STAGE ? '<small class="nav__soon">Em breve</small>' : ''}</span>
                  </a>
                </li>`).join('')}
            </ul>
          </nav>
          <div class="sidebar__foot">
            <div class="mini-profile">
              <span class="avatar avatar--${avatarKey(user)}" aria-hidden="true">${esc(SH.util.initials(user.name))}</span>
              <span class="mini-profile__txt">
                <strong>${esc(user.name)}</strong>
                <small>${user.role === 'teacher' ? 'Professor · Mentor' : 'Aluno · ' + esc(user.level)}</small>
              </span>
            </div>
          </div>
        </aside>
        <div class="scrim" data-action="close-nav" hidden></div>

        <div class="main-col">
          <header class="topbar">
            <button class="icon-btn topbar__menu" data-action="open-nav" aria-label="Abrir menu" aria-controls="sidebar" aria-expanded="false">${SH.icon('menu')}</button>
            <div class="topbar__title" id="topbar-title"></div>
            <div class="topbar__right">
              ${user.role === 'student' ? `
              <div class="pill pill--xp" title="XP acumulado">${SH.icon('star')}<span id="top-xp">${user.progress.xp}</span><span class="pill__unit">XP</span></div>
              <div class="pill pill--streak" title="Sequência de dias estudando">${SH.icon('flame')}<span id="top-streak">${SH.store.streak(user)}</span><span class="pill__unit">dias</span></div>` : `
              <div class="pill pill--teacher">${SH.icon('teacher')}<span>Modo professor</span></div>`}
              <div class="usermenu">
                <button class="usermenu__btn" data-action="toggle-user" aria-haspopup="menu" aria-expanded="false" aria-controls="usermenu-panel">
                  <span class="avatar avatar--sm avatar--${avatarKey(user)}" aria-hidden="true">${esc(SH.util.initials(user.name))}</span>
                  <span class="sr-only">Menu do usuário</span>
                </button>
                <div class="usermenu__panel" id="usermenu-panel" role="menu" hidden>
                  <div class="usermenu__who">
                    <strong>${esc(user.name)}</strong>
                    <small>${esc(user.email)}</small>
                  </div>
                  <button role="menuitem" class="usermenu__item" data-action="export">${SH.icon('download')}<span>Exportar Dados (JSON)</span></button>
                  <button role="menuitem" class="usermenu__item" data-action="import">${SH.icon('upload')}<span>Importar Backup</span></button>
                  ${user.demo ? `<button role="menuitem" class="usermenu__item" data-action="reset-demo">${SH.icon('refresh')}<span>Restaurar perfis demo</span></button>` : ''}
                  <hr>
                  <button role="menuitem" class="usermenu__item usermenu__item--danger" data-action="logout">${SH.icon('logout')}<span>Sair</span></button>
                </div>
              </div>
            </div>
          </header>
          ${SH.store.persistent ? '' : '<div class="banner banner--warn" role="status">Seu navegador bloqueou o armazenamento local. O progresso desta sessão não será salvo: use "Exportar Dados" antes de fechar.</div>'}
          <main id="main" class="main" tabindex="-1"></main>
        </div>
        <input type="file" id="import-file" accept="application/json,.json" hidden>
      </div>`;

    bind(root);
  }

  const avatarKey = (u) => (u.id === SH.store.demoIds.teacher || u.role === 'teacher' ? 'teacher' : u.id === SH.store.demoIds.renan ? 'renan' : 'julia');

  function bind(root) {
    const sidebar = root.querySelector('#sidebar');
    const scrim = root.querySelector('.scrim');
    const menuBtn = root.querySelector('[data-action="open-nav"]');
    const userBtn = root.querySelector('[data-action="toggle-user"]');
    const panel = root.querySelector('#usermenu-panel');
    const fileInput = root.querySelector('#import-file');

    const openNav = () => {
      sidebar.classList.add('is-open'); scrim.hidden = false; menuBtn.setAttribute('aria-expanded', 'true');
      const firstLink = sidebar.querySelector('.nav__link'); if (firstLink) firstLink.focus();
    };
    const closeNav = () => { sidebar.classList.remove('is-open'); scrim.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); };
    const closeUser = () => { panel.hidden = true; userBtn.setAttribute('aria-expanded', 'false'); };

    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-action]');
      if (!a) {
        if (!e.target.closest('.usermenu')) closeUser();
        if (e.target.closest('.nav__link')) closeNav();
        return;
      }
      const act = a.dataset.action;
      if (act === 'open-nav') openNav();
      if (act === 'close-nav') closeNav();
      if (act === 'toggle-user') {
        const open = panel.hidden;
        panel.hidden = !open;
        userBtn.setAttribute('aria-expanded', String(open));
        if (open) panel.querySelector('.usermenu__item').focus();
      }
      if (act === 'export') { closeUser(); exportData(); }
      if (act === 'import') { closeUser(); fileInput.value = ''; fileInput.click(); }
      if (act === 'reset-demo') { closeUser(); confirmResetDemo(); }
      if (act === 'logout') { closeUser(); logout(); }
    });

    if (escHandler) document.removeEventListener('keydown', escHandler);
    escHandler = (e) => { if (e.key === 'Escape') { closeUser(); closeNav(); } };
    document.addEventListener('keydown', escHandler);

    fileInput.addEventListener('change', () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) readBackup(f);
    });
  }

  function setActive(route, title) {
    document.querySelectorAll('.nav__link').forEach((l) => {
      const on = l.dataset.route === route;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
    const t = document.getElementById('topbar-title');
    if (t) t.textContent = title || '';
  }

  function refreshStats() {
    const u = SH.store.currentUser();
    if (!u || u.role !== 'student') return;
    const xp = document.getElementById('top-xp');
    const st = document.getElementById('top-streak');
    if (xp) xp.textContent = u.progress.xp;
    if (st) st.textContent = SH.store.streak(u);
  }

  /* ---------- Backup ---------- */
  function exportData() {
    const name = 'students-hub-backup-' + SH.util.dayKey() + '.json';
    SH.util.download(name, SH.store.exportJSON());
    SH.util.toast('Backup exportado: ' + name, 'ok');
  }

  function readBackup(file) {
    if (file.size > 15 * 1024 * 1024) { SH.util.toast('Arquivo muito grande para ser um backup do portal.', 'err'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      let obj;
      try { obj = JSON.parse(reader.result); } catch (e) {
        SH.util.toast('Não foi possível ler o arquivo: ele não é um JSON válido.', 'err'); return;
      }
      const info = SH.store.inspectBackup(obj);
      if (!info.ok) { SH.util.toast(info.message, 'err'); return; }
      SH.util.modal({
        title: 'Restaurar backup',
        html: `
          <p>Encontramos um backup válido do Students Hub.</p>
          <ul class="kv">
            <li><span>Gerado em</span><strong>${esc(SH.util.fmtDateTime(info.exportedAt))}</strong></li>
            <li><span>Contas de aluno</span><strong>${info.students}</strong></li>
            <li><span>Contas de professor</span><strong>${info.teachers}</strong></li>
          </ul>
          <p class="note note--warn">${SH.icon('alert')}<span>Os dados atuais deste navegador serão substituídos pelo conteúdo do backup. Se quiser, exporte os dados atuais antes.</span></p>`,
        actions: [
          { label: 'Exportar atuais primeiro', variant: 'ghost', onClick: () => { exportData(); return false; } },
          { label: 'Cancelar', variant: 'ghost' },
          {
            label: 'Substituir e restaurar', variant: 'primary',
            onClick: () => {
              const res = SH.store.importBackup(obj);
              if (!res.ok) { SH.util.toast(res.message, 'err'); return; }
              SH.util.toast('Backup restaurado com sucesso.', 'ok');
              SH.app.boot();
            },
          },
        ],
      });
    };
    reader.onerror = () => SH.util.toast('Não foi possível ler o arquivo selecionado.', 'err');
    reader.readAsText(file);
  }

  function confirmResetDemo() {
    SH.util.modal({
      title: 'Restaurar perfis demo',
      html: '<p>As três contas de demonstração voltam ao histórico original. Contas criadas por alunos reais não são alteradas.</p>',
      actions: [
        { label: 'Cancelar', variant: 'ghost' },
        { label: 'Restaurar demo', variant: 'primary', onClick: () => { SH.store.resetDemoUsers(); SH.util.toast('Perfis demo restaurados.', 'ok'); SH.app.boot(); } },
      ],
    });
  }

  function logout() {
    SH.speech.stop();
    SH.store.setSession(null);
    location.hash = '';
    SH.app.boot();
  }

  SH.shell = { render, setActive, refreshStats, NAV, AVAILABLE_STAGE };
})(window.SH);

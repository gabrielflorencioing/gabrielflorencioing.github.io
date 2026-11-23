/* Students Hub · Inicialização e roteamento por hash */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  SH.labels = {
    GOALS: {
      'work-travel': 'Trabalho e viagens',
      career: 'Fluência profissional e reuniões',
      travel: 'Viagens',
      abroad: 'Morar e se adaptar no exterior',
      conversation: 'Conversação do dia a dia',
      exams: 'Provas e certificações',
      academic: 'Estudos acadêmicos',
      teaching: 'Mentoria e acompanhamento',
    },
    LOCATIONS: { brasil: 'Mora no Brasil', exterior: 'Mora no exterior' },
  };

  const root = () => document.getElementById('app');
  let leaveHooks = [];
  let shellUserId = null;

  function runLeaveHooks() {
    leaveHooks.forEach((fn) => { try { fn(); } catch (e) { /* ignora */ } });
    leaveHooks = [];
  }

  function parse() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    return { route: parts[0] || 'home', parts };
  }

  function route() {
    const user = SH.store.currentUser();
    if (!user) { boot(); return; }
    if (shellUserId !== user.id || !document.getElementById('main')) {
      SH.shell.render(root(), user);
      shellUserId = user.id;
    }
    runLeaveHooks();
    SH.speech.stop();
    const main = document.getElementById('main');
    const { route: r, parts } = parse();
    document.title = 'Students Hub · Portal do Aluno | Gabriel Florencio';

    if (r === 'home') SH.home.render(main);
    else if (r === 'reading') {
      if (!parts[1]) SH.reading.renderList(main);
      else SH.reading.renderUnit(main, parts[1], parts[2] || 'read', parts[3]);
    } else if (r === 'games') {
      if (parts[1]) SH.games.renderGame(main, parts[1]); else SH.games.renderList(main);
    } else if (r === 'maps') SH.maps.renderList(main, parts[1]);
    else if (r === 'lexicon') SH.lexicon.render(main);
    else if (r === 'profile') SH.profile.render(main);
    else if (r === 'agenda') SH.agenda.render(main, parts[1]);
    else if (r === 'teacher') {
      if (user.role !== 'teacher') { location.replace('#/home'); return; }
      if (parts[1]) SH.teacher.renderDossier(main, parts[1]); else SH.teacher.renderOverview(main);
    } else notFound(main);

    if (!(r === 'reading' && parts[3])) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  function notFound(main) {
    SH.shell.setActive('', 'Página não encontrada');
    main.innerHTML = `
      <div class="page"><div class="card empty">
        <h1 class="page-title">Não encontramos esta página.</h1>
        <p class="muted">O endereço pode ter mudado. Volte ao início para continuar.</p>
        <a class="btn btn--primary" href="#/home">Ir para o início</a>
      </div></div>`;
  }

  function boot() {
    runLeaveHooks();
    shellUserId = null;
    const user = SH.store.currentUser();
    if (!user) {
      SH.auth.render(root());
      window.scrollTo(0, 0);
      return;
    }
    route();
  }

  function enter() {
    shellUserId = null;
    if (!location.hash || location.hash === '#' || location.hash === '#/') location.hash = '#/home';
    else route();
  }

  window.addEventListener('hashchange', () => { if (SH.store.currentUser()) route(); });

  SH.app = {
    boot, enter, notFound,
    onLeave: (fn) => leaveHooks.push(fn),
  };

  document.addEventListener('DOMContentLoaded', () => {
    SH.store.load();
    boot();
  });
})(window.SH);

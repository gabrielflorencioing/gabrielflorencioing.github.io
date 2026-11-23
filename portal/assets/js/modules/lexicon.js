/* Students Hub · Módulo 4: Léxico Funcional da Vida Real */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const ui = { q: '', theme: 'all', onlySaved: false };

  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function filtered(user) {
    const q = norm(ui.q.trim());
    return C().LEXICON.filter((it) =>
      (ui.theme === 'all' || it.theme === ui.theme) &&
      (!ui.onlySaved || user.savedLexicon.includes(it.id)) &&
      (!q || norm(it.en + ' ' + it.pt + ' ' + it.ex.join(' ')).includes(q)));
  }

  function card(it, saved) {
    const reg = C().REGISTERS[it.reg];
    return `
      <li class="lex-card">
        <div class="lex-card__top">
          <span class="reg ${reg.cls}">${reg.label}</span>
          <button class="icon-btn icon-btn--soft" data-say="${esc(it.en)}" aria-pressed="false" aria-label="Ouvir: ${esc(it.en)}">${SH.icon('sound')}</button>
        </div>
        <h3 class="lex-card__en" lang="en">${esc(it.en)}</h3>
        <p class="lex-card__pt">${esc(it.pt)}</p>
        <ul class="lex-card__ex">${it.ex.map((x) => `
          <li><p lang="en">${esc(x)}</p><button class="icon-btn icon-btn--sm" data-say="${esc(x)}" aria-pressed="false" aria-label="Ouvir a frase">${SH.icon('sound')}</button></li>`).join('')}
        </ul>
        <button class="btn btn--sm ${saved ? 'btn--saved' : 'btn--soft'}" data-save="${it.id}" aria-pressed="${saved}">
          ${SH.icon(saved ? 'check' : 'bookmark')}${saved ? 'Salvo no Meu Caderno' : 'Salvar no Meu Caderno'}</button>
      </li>`;
  }

  function render(main) {
    SH.shell.setActive('lexicon', 'Léxico da Vida Real');
    const u = SH.store.currentUser();
    main.innerHTML = `
      <div class="page">
        <header class="page-head"><div>
          <p class="eyebrow">Módulo 4 · Real-Life Lexicon</p>
          <h1 class="page-title">Léxico Funcional da Vida Real</h1>
          <p class="lead">Chunks prontos para situações que você vive de verdade. Ouça, veja o registro de formalidade e salve no seu caderno para revisar depois.</p>
        </div></header>
        <div class="lex-tools card">
          <label class="search">
            ${SH.icon('search')}<span class="sr-only">Buscar expressão</span>
            <input type="search" id="lex-q" placeholder="Buscar em inglês ou português (ex.: check, conta, reunião)" value="${esc(ui.q)}" autocomplete="off">
          </label>
          <div class="filters" role="group" aria-label="Filtrar por tema">
            <button class="chip-btn ${ui.theme === 'all' ? 'is-active' : ''}" data-theme="all" aria-pressed="${ui.theme === 'all'}">Todos os temas</button>
            ${C().LEX_THEMES.map((t) => `<button class="chip-btn ${ui.theme === t.id ? 'is-active' : ''}" data-theme="${t.id}" aria-pressed="${ui.theme === t.id}">${esc(t.title)}</button>`).join('')}
          </div>
          <label class="switch"><input type="checkbox" id="lex-saved" ${ui.onlySaved ? 'checked' : ''}><span class="switch__track" aria-hidden="true"></span><span>Mostrar só os salvos (<span id="saved-count">${u.savedLexicon.length}</span>)</span></label>
        </div>
        <div id="lex-results"></div>
      </div>`;

    const page = main.firstElementChild;
    const results = page.querySelector('#lex-results');

    function draw() {
      const user = SH.store.currentUser();
      const list = filtered(user);
      const themes = C().LEX_THEMES.filter((t) => list.some((i) => i.theme === t.id));
      results.innerHTML = list.length ? themes.map((t) => `
        <section class="lex-theme">
          <header class="axis__head"><span class="axis__n" aria-hidden="true">${C().LEX_THEMES.indexOf(t) + 1}</span><div><h2 class="axis__title">${esc(t.title)}</h2><p class="axis__focus">${esc(t.desc)}</p></div></header>
          <ul class="lex-grid">${list.filter((i) => i.theme === t.id).map((i) => card(i, user.savedLexicon.includes(i.id))).join('')}</ul>
        </section>`).join('') : `<div class="card empty"><p><strong>Nenhuma expressão encontrada.</strong></p><p class="muted">Tente outra palavra ou limpe os filtros.</p></div>`;
      page.querySelector('#saved-count').textContent = user.savedLexicon.length;
    }

    page.querySelector('#lex-q').addEventListener('input', (e) => { ui.q = e.target.value; draw(); });
    page.querySelector('#lex-saved').addEventListener('change', (e) => { ui.onlySaved = e.target.checked; draw(); });
    page.addEventListener('click', (e) => {
      const th = e.target.closest('[data-theme]');
      if (th) {
        ui.theme = th.dataset.theme;
        page.querySelectorAll('[data-theme]').forEach((b) => { const on = b === th; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
        draw(); return;
      }
      const say = e.target.closest('[data-say]');
      if (say) { SH.speech.speak(say.dataset.say, { btn: say }); return; }
      const sv = e.target.closest('[data-save]');
      if (sv) {
        const id = sv.dataset.save;
        let added = false;
        SH.store.updateUser(u.id, (x) => {
          if (x.savedLexicon.includes(id)) x.savedLexicon = x.savedLexicon.filter((y) => y !== id);
          else { x.savedLexicon.push(id); added = true; }
        });
        SH.util.toast(added ? 'Salvo no seu caderno. Veja em Agenda e Caderno.' : 'Removido do seu caderno.', added ? 'ok' : 'info', 2400);
        draw();
      }
    });
    draw();
  }

  SH.lexicon = { render };
})(window.SH);

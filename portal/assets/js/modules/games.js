/* Students Hub · Módulo 2: Arena de Gamificação (Learn by Playing) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const user = () => SH.store.currentUser();
  const isTeacher = () => user().role === 'teacher';

  /* Dicas gerais por tópico, usadas no card "Grammar & Logic Hint" do Context Challenge */
  const CAT_HINTS = {
    'prepositions': 'Pense do amplo ao exato: IN para meses, anos e cidades; ON para dias, datas e superfícies; AT para horários e pontos exatos. Para tempo: FOR mede a duração, SINCE marca o começo.',
    'verb-choice': 'MAKE cria ou decide (make a decision, make a plan). DO executa tarefas e favores (do the dishes, do me a favor). TELL pede a pessoa logo depois (tell me); SAY não pede (say that...).',
    'past-simple': 'Se a frase traz um momento terminado (last night, yesterday, in 2020), o inglês usa Past Simple. Present Perfect só funciona sem momento definido.',
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  function piecesHTML(pieces, hideText = false) {
    return `<div class="pieces">${pieces.map(([role, text]) => `
      <span class="piece ${C().ROLES[role].cls}"><small>${C().ROLES[role].label}</small>${hideText ? '' : `<strong lang="en">${esc(text)}</strong>`}</span>`).join('<span class="piece__arrow" aria-hidden="true">›</span>')}</div>`;
  }

  /* =========================================================
   * LISTA DA ARENA
   * ========================================================= */
  function renderList(main) {
    SH.shell.setActive('games', 'Arena de Jogos');
    const g = user().progress.games || {};
    const plays = Object.values(g).reduce((s, x) => s + x.plays, 0);
    const xp = Object.values(g).reduce((s, x) => s + x.totalXp, 0);
    const bestCombo = Object.values(g).flatMap((x) => x.history).reduce((m, h) => Math.max(m, h.maxCombo), 0);

    main.innerHTML = `
      <div class="page">
        <header class="page-head">
          <div>
            <p class="eyebrow">Módulo 2 · Learn by Playing</p>
            <h1 class="page-title">Arena de Gamificação</h1>
            <p class="lead">Três jogos curtos para transformar chunks e estruturas em reflexo. Cada acerto seguido aumenta o combo, e cada partida soma XP e alimenta o seu diagnóstico.</p>
          </div>
        </header>
        ${isTeacher() ? `<p class="note">${SH.icon('info')}<span>Modo professor: você pode jogar para conhecer as mecânicas, mas as partidas não são registradas.</span></p>` : `
        <section class="stats" aria-label="Seus números na Arena">
          <div class="stat"><span class="stat__icon stat__icon--lil">${SH.icon('game')}</span><span class="stat__num" data-count="${plays}">0</span><span class="stat__lbl">partidas jogadas</span></div>
          <div class="stat"><span class="stat__icon stat__icon--yel">${SH.icon('star')}</span><span class="stat__num" data-count="${xp}">0</span><span class="stat__lbl">XP conquistado na Arena</span></div>
          <div class="stat"><span class="stat__icon stat__icon--coral">${SH.icon('flame')}</span><span class="stat__num" data-count="${bestCombo}">0</span><span class="stat__lbl">melhor combo</span></div>
        </section>`}
        <div class="unit-grid">
          ${C().GAMES.map((game) => {
            const rec = g[game.id];
            return `
            <a class="unit-card" href="#/games/${game.id}">
              <div class="unit-card__art">${SH.illus(game.illus)}</div>
              <div class="unit-card__body">
                <div class="unit-card__tags"><span class="tag tag--q">${esc(game.tag)}</span>
                  ${!isTeacher() && rec ? `<span class="status status--ok">Recorde ${rec.bestScore}/${rec.bestTotal}</span>` : ''}</div>
                <h3 class="unit-card__title">${esc(game.title)}</h3>
                <p class="unit-card__sub">${esc(game.desc)}</p>
                <ul class="meta"><li>${SH.icon('target')}${game.rounds} desafios</li><li>${SH.icon('layers')}${esc(game.skill)}</li>
                  ${!isTeacher() && rec ? `<li>${SH.icon('refresh')}${rec.plays} ${rec.plays === 1 ? 'partida' : 'partidas'}</li>` : ''}</ul>
              </div>
            </a>`;
          }).join('')}
        </div>
      </div>`;
    main.querySelectorAll('[data-count]').forEach((el) => SH.util.countUp(el, Number(el.dataset.count)));
  }

  /* =========================================================
   * TELA DE JOGO (estrutura comum)
   * ========================================================= */
  function renderGame(main, gameId) {
    const game = C().game(gameId);
    if (!game) { SH.app.notFound(main); return; }
    SH.shell.setActive('games', 'Arena de Jogos');
    document.title = game.title + ' · Students Hub';
    const st = { game, i: 0, score: 0, combo: 0, maxCombo: 0, items: [], total: game.rounds };

    main.innerHTML = `
      <div class="page page--game">
        <nav class="crumbs" aria-label="Você está em"><a href="#/games">${SH.icon('arrowLeft')}Arena de Jogos</a><span aria-hidden="true">/</span><span>${esc(game.title)}</span></nav>
        <section class="game">
          <header class="game__head">
            <div class="game__title"><h1 class="section-title">${esc(game.title)}</h1><p class="muted small">${esc(game.desc)}</p></div>
            <div class="hud" aria-live="polite">
              <span class="hud__item"><small>Desafio</small><strong id="hud-round">1/${st.total}</strong></span>
              <span class="hud__item"><small>Acertos</small><strong id="hud-score">0</strong></span>
              <span class="hud__item hud__item--combo" id="hud-combo-wrap"><small>Combo</small><strong id="hud-combo">x0</strong></span>
            </div>
          </header>
          <span class="bar"><span class="bar__fill" id="game-bar" style="--w:0%"></span></span>
          <div id="game-stage" class="game__stage"></div>
          <div class="game__hint" id="game-hint" hidden></div>
        </section>
      </div>`;

    const api = {
      stage: main.querySelector('#game-stage'),
      hintBox: main.querySelector('#game-hint'),
      hit(cat) {
        st.score++; st.combo++; st.maxCombo = Math.max(st.maxCombo, st.combo); st.items.push({ cat, ok: true });
        const w = main.querySelector('#hud-combo-wrap'); w.classList.remove('is-bump'); void w.offsetWidth; w.classList.add('is-bump');
        api.sync();
      },
      miss(cat) { st.combo = 0; st.items.push({ cat, ok: false }); api.sync(); },
      sync(progressDone) {
        main.querySelector('#hud-score').textContent = st.score;
        main.querySelector('#hud-combo').textContent = 'x' + st.combo;
        const done = progressDone != null ? progressDone : st.items.length;
        main.querySelector('#hud-round').textContent = Math.min(done + 1, st.total) + '/' + st.total;
        main.querySelector('#game-bar').style.setProperty('--w', (done / st.total) * 100 + '%');
      },
      hint(html) {
        const box = api.hintBox;
        if (!box.hidden && box.dataset.key === html.length + '') { box.hidden = true; return; }
        box.dataset.key = html.length + '';
        box.innerHTML = `<div class="hint-card"><div class="hint-card__head"><span>${SH.icon('info')}Grammar & Logic Hint</span>
          <button class="icon-btn icon-btn--sm" data-close-hint aria-label="Fechar dica">${SH.icon('close')}</button></div>${html}</div>`;
        box.hidden = false;
        box.scrollIntoView({ behavior: SH.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
        box.querySelector('[data-close-hint]').addEventListener('click', () => { box.hidden = true; });
      },
      closeHint() { api.hintBox.hidden = true; },
      finish(review) { finish(main, st, review); },
      st,
    };

    if (gameId === 'chunk-builder') playChunkBuilder(api);
    else if (gameId === 'context-challenge') playContext(api);
    else playCollocations(api);
  }

  /* ---------- Jogo 1: Chunk Builder ---------- */
  function playChunkBuilder(api) {
    const rounds = C().CHUNK_BUILDER;
    const review = [];
    let r, pool, line;

    function start() {
      r = rounds[api.st.i];
      let order = shuffle(r.blocks.map((_, k) => k));
      if (order.every((v, k) => v === k)) order = order.reverse();
      pool = order;
      line = [];
      api.closeHint();
      draw();
    }

    function draw(result) {
      api.stage.innerHTML = `
        <div class="situation"><span class="situation__lbl">Situação</span><p>${esc(r.situation)}</p></div>
        <div class="build-line ${result ? 'is-' + result.state : ''}" aria-label="Sua frase">
          ${line.length ? line.map((k, pos) => `<button class="block block--placed ${result ? (result.wrongPos.includes(pos) ? 'is-wrong' : 'is-right') : ''}" data-line="${pos}" ${result ? 'disabled' : ''} lang="en">${esc(r.blocks[k])}</button>`).join('')
            : '<span class="build-line__empty">Toque nos blocos abaixo na ordem natural da frase.</span>'}
        </div>
        <div class="pool" aria-label="Blocos disponíveis">
          ${pool.length ? pool.map((k) => `<button class="block" data-pool="${k}" ${result ? 'disabled' : ''} lang="en">${esc(r.blocks[k])}</button>`).join('') : `<span class="pool__done">${result ? '' : 'Todos os blocos posicionados. Confira e verifique a ordem.'}</span>`}
        </div>
        ${result ? feedback(result) : `
        <div class="game__actions">
          <button class="btn btn--ghost btn--sm" data-act="hint">${SH.icon('info')}Grammar & Logic Hint</button>
          <button class="btn btn--ghost btn--sm" data-act="reset" ${line.length ? '' : 'disabled'}>Recomeçar frase</button>
          <button class="btn btn--primary" data-act="check" ${pool.length ? 'disabled' : ''}>Verificar ordem</button>
        </div>`}`;
    }

    function feedback(res) {
      const ok = res.state === 'ok';
      return `
        <div class="feedback feedback--${ok ? 'ok' : 'err'}" role="status">
          <p class="feedback__title">${SH.icon(ok ? 'check' : 'compass')}${ok ? 'Ordem natural. Excelente!' : 'Quase lá: veja a ordem que o falante nativo usa.'}</p>
          ${ok ? '' : `<p class="feedback__correct" lang="en">${esc(r.blocks.join(' '))}</p>`}
          ${!ok && res.firstWrong != null ? `<p>O bloco <strong lang="en">"${esc(r.blocks[line[res.firstWrong]])}"</strong> não fica na posição ${res.firstWrong + 1}.</p>` : ''}
          ${piecesHTML(r.hint)}
          <p>${esc(r.explain)}</p>
          <div class="game__actions"><button class="btn btn--primary" data-act="next">${api.st.i + 1 < rounds.length ? 'Próximo desafio' : 'Ver resultado'} ${SH.icon('arrowRight')}</button></div>
        </div>`;
    }

    api.stage.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      if (b.dataset.pool != null) { const k = Number(b.dataset.pool); pool = pool.filter((x) => x !== k); line.push(k); draw(); return; }
      if (b.dataset.line != null) { const k = line[Number(b.dataset.line)]; line.splice(Number(b.dataset.line), 1); pool.push(k); draw(); return; }
      const act = b.dataset.act;
      if (act === 'reset') { pool = pool.concat(line); line = []; draw(); }
      if (act === 'hint') api.hint(`<p>Monte a frase seguindo esta lógica de funções:</p>${piecesHTML(r.hint, true)}<p class="muted small">Em inglês a ordem é mais fixa que em português: sujeito e verbo aparecem cedo, e tempo ou lugar costumam fechar a frase.</p>`);
      if (act === 'check') {
        const wrongPos = line.map((k, pos) => (k === pos ? -1 : pos)).filter((x) => x >= 0);
        const ok = wrongPos.length === 0;
        if (ok) api.hit(r.cat); else api.miss(r.cat);
        review.push({ ok, prompt: r.situation, answer: r.blocks.join(' '), given: line.map((k) => r.blocks[k]).join(' '), explain: r.explain });
        api.closeHint();
        draw({ state: ok ? 'ok' : 'err', wrongPos, firstWrong: wrongPos[0] });
      }
      if (act === 'next') {
        api.st.i++;
        if (api.st.i >= rounds.length) api.finish(review); else start();
      }
    });
    start();
  }

  /* ---------- Jogo 2: Context & Preposition Challenge ---------- */
  function playContext(api) {
    const items = shuffle(C().CONTEXT_CHALLENGE);
    const review = [];
    let timerOn = false, timer = null, left = 0;
    SH.app.onLeave(() => clearInterval(timer));

    function sentenceHTML(it, fill, cls = '') {
      const [a, b] = it.sentence.split('___');
      return `<p class="gap-sentence" lang="en">${esc(a)}<span class="gap ${cls}">${fill ? esc(fill) : '&nbsp;?&nbsp;'}</span>${esc(b)}</p>`;
    }

    function start() {
      const it = items[api.st.i];
      api.closeHint();
      api.stage.innerHTML = `
        <div class="ctx-top">
          <label class="switch"><input type="checkbox" data-act="timer" ${timerOn ? 'checked' : ''}><span class="switch__track" aria-hidden="true"></span><span>Cronômetro suave (20s)</span></label>
          ${timerOn ? '<span class="bar bar--timer"><span class="bar__fill" id="timer-bar" style="--w:100%"></span></span>' : ''}
        </div>
        ${sentenceHTML(it)}
        <div class="choice-row">${it.options.map((o, k) => `<button class="choice" data-opt="${k}" lang="en">${esc(o)}</button>`).join('')}</div>
        <div class="game__actions"><button class="btn btn--ghost btn--sm" data-act="hint">${SH.icon('info')}Grammar & Logic Hint</button></div>
        <div id="ctx-feedback"></div>`;
      clearInterval(timer);
      if (timerOn) {
        left = 200;
        timer = setInterval(() => {
          left--;
          const bar = document.getElementById('timer-bar');
          if (bar) bar.style.setProperty('--w', (left / 200) * 100 + '%');
          if (left <= 0) { clearInterval(timer); answer(-1); }
        }, 100);
      }
    }

    function answer(k) {
      clearInterval(timer);
      const it = items[api.st.i];
      const ok = k === it.answer;
      if (ok) api.hit(it.cat); else api.miss(it.cat);
      review.push({ ok, prompt: it.sentence, answer: it.options[it.answer], given: k >= 0 ? it.options[k] : 'tempo esgotado', explain: it.rule });
      api.closeHint();
      api.stage.querySelectorAll('.choice').forEach((b, idx) => {
        b.disabled = true;
        if (idx === it.answer) b.classList.add('is-right');
        else if (idx === k) b.classList.add('is-wrong');
      });
      api.stage.querySelector('.gap-sentence').outerHTML = sentenceHTML(it, it.options[it.answer], ok ? 'gap--ok' : 'gap--fixed');
      api.stage.querySelector('#ctx-feedback').innerHTML = `
        <div class="feedback feedback--${ok ? 'ok' : 'err'}" role="status">
          <p class="feedback__title">${SH.icon(ok ? 'check' : 'compass')}${ok ? 'Na mosca!' : k < 0 ? 'O tempo acabou, sem problema: veja a lógica.' : 'Boa tentativa. A forma natural é "' + esc(it.options[it.answer]) + '".'}</p>
          ${piecesHTML(it.hint)}
          <p>${esc(it.rule)}</p>
          <div class="game__actions"><button class="btn btn--primary" data-act="next">${api.st.i + 1 < items.length ? 'Próxima frase' : 'Ver resultado'} ${SH.icon('arrowRight')}</button></div>
        </div>`;
      api.stage.querySelector('[data-act="next"]').focus({ preventScroll: true });
    }

    api.stage.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      if (b.dataset.opt != null) { answer(Number(b.dataset.opt)); return; }
      if (b.dataset.act === 'hint') {
        const it = items[api.st.i];
        api.hint(`<p>${esc(CAT_HINTS[it.cat] || '')}</p>`);
      }
      if (b.dataset.act === 'next') {
        api.st.i++;
        if (api.st.i >= items.length) api.finish(review); else start();
      }
    });
    api.stage.addEventListener('change', (e) => {
      if (e.target.dataset.act === 'timer') { timerOn = e.target.checked; start(); }
    });
    start();
  }

  /* ---------- Jogo 3: Collocation Match ---------- */
  function playCollocations(api) {
    const rounds = C().COLLOCATION_ROUNDS;
    const review = [];
    let ri = 0, selLeft = null, selRight = null, matched = new Set(), missed = new Set(), unlocked = [], lefts, rights;

    function startRound() {
      const round = rounds[ri];
      lefts = shuffle(round.pairs); rights = shuffle(round.pairs);
      matched = new Set(); missed = new Set(); unlocked = []; selLeft = selRight = null;
      api.closeHint();
      draw();
    }

    function draw(msg) {
      const round = rounds[ri];
      api.stage.innerHTML = `
        <p class="situation situation--plain"><span class="situation__lbl">Rodada ${ri + 1} de ${rounds.length}</span>Toque em um verbo e depois na expressão que combina com ele.</p>
        <div class="match">
          <div class="match__col" aria-label="Verbos">${lefts.map((p) => `<button class="node ${matched.has(p.id) ? 'is-matched' : ''} ${selLeft === p.id ? 'is-selected' : ''}" data-left="${p.id}" ${matched.has(p.id) ? 'disabled' : ''} lang="en">${esc(p.left)}</button>`).join('')}</div>
          <div class="match__col" aria-label="Expressões">${rights.map((p) => `<button class="node node--right ${matched.has(p.id) ? 'is-matched' : ''} ${selRight === p.id ? 'is-selected' : ''}" data-right="${p.id}" ${matched.has(p.id) ? 'disabled' : ''} lang="en">${esc(p.right)}</button>`).join('')}</div>
        </div>
        <div id="match-msg" aria-live="polite">${msg || ''}</div>
        <div class="game__actions"><button class="btn btn--ghost btn--sm" data-act="hint">${SH.icon('info')}Grammar & Logic Hint</button></div>
        ${unlocked.length ? `<div class="unlocked"><h3 class="card__title">Frases desbloqueadas</h3><ul>${unlocked.map((p) => `
          <li class="unlocked__item"><strong lang="en">${esc(p.left)} ${esc(p.right)}</strong><span class="muted">${esc(p.pt)}</span>
          <span class="unlocked__ex"><em lang="en">${esc(p.example)}</em><button class="icon-btn icon-btn--sm" data-say="${esc(p.example)}" aria-label="Ouvir a frase">${SH.icon('sound')}</button></span></li>`).join('')}</ul></div>` : ''}
        ${matched.size === round.pairs.length ? `<div class="game__actions"><button class="btn btn--primary" data-act="next">${ri + 1 < rounds.length ? 'Próxima rodada' : 'Ver resultado'} ${SH.icon('arrowRight')}</button></div>` : ''}`;
    }

    function tryMatch() {
      if (!selLeft || !selRight) return;
      const round = rounds[ri];
      const l = round.pairs.find((p) => p.id === selLeft);
      const r = round.pairs.find((p) => p.id === selRight);
      if (selLeft === selRight) {
        matched.add(l.id);
        unlocked.unshift(l);
        const firstTry = !missed.has(l.id);
        if (firstTry) api.hit('collocations'); else { api.st.combo = 0; api.sync(); }
        review.push({ ok: firstTry, prompt: l.left + ' + ...', answer: l.left + ' ' + l.right, given: firstTry ? l.left + ' ' + l.right : 'acertou depois de tentar outra combinação', explain: l.pt + ': ' + l.example });
        selLeft = selRight = null;
        draw(`<p class="feedback-inline feedback-inline--ok">${SH.icon('check')}<span><strong lang="en">${esc(l.left)} ${esc(l.right)}</strong> desbloqueada. Combo x${api.st.combo}.</span></p>`);
      } else {
        if (!missed.has(l.id)) { missed.add(l.id); api.st.items.push({ cat: 'collocations', ok: false }); }
        api.st.combo = 0; api.sync(api.st.score + missed.size);
        selLeft = selRight = null;
        draw(`<p class="feedback-inline feedback-inline--err">${SH.icon('compass')}<span><strong lang="en">${esc(l.left)} ${esc(r.right)}</strong> não é uma combinação natural. ${esc(round.wrongTip)}</span></p>`);
        const nodes = api.stage.querySelectorAll(`[data-left="${l.id}"], [data-right="${r.id}"]`);
        nodes.forEach((n) => n.classList.add('is-shake'));
      }
    }

    api.stage.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      if (b.dataset.say) { SH.speech.speak(b.dataset.say, { btn: b }); return; }
      if (b.dataset.left) { selLeft = selLeft === b.dataset.left ? null : b.dataset.left; draw(); tryMatch(); return; }
      if (b.dataset.right) { selRight = selRight === b.dataset.right ? null : b.dataset.right; draw(); tryMatch(); return; }
      if (b.dataset.act === 'hint') {
        const pending = rounds[ri].pairs.filter((p) => !matched.has(p.id));
        api.hint(`<p>Pense no significado em português e procure o bloco inteiro em inglês:</p>
          <ul class="hint-list">${pending.map((p) => `<li><span class="piece r-verb"><small>Verbo</small><strong lang="en">${esc(p.left)}</strong></span><span class="muted">significa algo como</span><strong>${esc(p.pt)}</strong></li>`).join('')}</ul>`);
      }
      if (b.dataset.act === 'next') {
        ri++;
        if (ri >= rounds.length) api.finish(review); else startRound();
      }
    });
    startRound();
  }

  /* =========================================================
   * RESULTADO
   * ========================================================= */
  function finish(main, st, review) {
    // Collocation Match pode ter mais itens registrados que pares: o total é sempre o número de desafios
    const score = st.score;
    const total = st.total;
    let entry = null;
    if (!isTeacher()) {
      entry = SH.store.recordGame(user().id, st.game.id, { score, total, maxCombo: st.maxCombo, items: st.items });
      SH.shell.refreshStats();
    }
    main.querySelector('#game-bar').style.setProperty('--w', '100%');
    main.querySelector('#game-hint').hidden = true;
    const rate = score / total;
    const msg = rate === 1 ? 'Partida perfeita!' : rate >= 0.8 ? 'Excelente partida!' : rate >= 0.5 ? 'Boa evolução!' : 'Cada rodada é treino de verdade.';
    main.querySelector('#game-stage').innerHTML = `
      <div class="game-end">
        <div class="game-end__top">
          <div class="result__num result__num--static"><strong>${score}</strong><span>/${total}</span></div>
          <div>
            <h2 class="result__title">${msg}</h2>
            <p class="muted">Melhor combo da partida: x${st.maxCombo}. ${rate < 0.8 ? 'Releia as explicações abaixo e jogue de novo: a repetição espaçada é o que fixa os chunks.' : 'Essas estruturas já estão virando automáticas para você.'}</p>
            ${entry ? `<span class="xp-badge is-pop">${SH.icon('star')}+${entry.xp} XP</span>` : '<p class="note">' + SH.icon('info') + '<span>Modo professor: partida não registrada.</span></p>'}
          </div>
        </div>
        <ol class="review__list">${review.map((it, k) => `
          <li class="rv-card ${it.ok ? 'rv-card--ok' : 'rv-card--err'}">
            <div class="rv-card__head"><span class="rv-card__status">${SH.icon(it.ok ? 'check' : 'x')}<span>${it.ok ? 'Acertou' : 'Para revisar'}</span></span><span class="q-card__num">Desafio ${k + 1}</span></div>
            <p class="q-card__prompt">${esc(it.prompt)}</p>
            <div class="rv-answers">
              ${it.ok ? '' : `<p class="rv-ans rv-ans--err"><span class="rv-ans__lbl">Sua resposta</span><span lang="en">${esc(it.given)}</span></p>`}
              <p class="rv-ans rv-ans--ok"><span class="rv-ans__lbl">Forma natural</span><span lang="en">${esc(it.answer)}</span></p>
            </div>
            <div class="explain"><span class="explain__lbl">${SH.icon('info')}Por que é assim</span><p>${esc(it.explain)}</p></div>
          </li>`).join('')}</ol>
        <div class="result__actions">
          <a class="btn btn--ghost" href="#/games">${SH.icon('arrowLeft')}Voltar à Arena</a>
          <button class="btn btn--primary" data-act="again">${SH.icon('refresh')}Jogar de novo</button>
        </div>
      </div>`;
    main.querySelector('[data-act="again"]').addEventListener('click', () => renderGame(main, st.game.id));
    main.querySelector('.game').scrollIntoView({ behavior: SH.util.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  SH.games = { renderList, renderGame };
})(window.SH);

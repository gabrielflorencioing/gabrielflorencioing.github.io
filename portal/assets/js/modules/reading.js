/* Students Hub · Módulo 1: Trilhas de Leitura Guiada & Compreensão Lexical */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const FONT_STEPS = [0.92, 1, 1.12, 1.26];

  /* Estado em memória da sessão (rascunho das respostas e filtros) */
  const ui = {
    levelFilter: null,
    drafts: {},          // unitId -> number[]
    previewResult: null, // tentativa do professor (não salva)
    reviewFilter: 'all',
  };

  const user = () => SH.store.currentUser();
  const isTeacher = () => user().role === 'teacher';
  const recFor = (unitId) => user().progress.readings[unitId] || null;

  /* =========================================================
   * LISTA DE TRILHAS
   * ========================================================= */
  function renderList(main) {
    SH.shell.setActive('reading', 'Trilhas de Leitura');
    const u = user();
    if (ui.levelFilter === null) ui.levelFilter = 'all';
    const levels = Object.values(C().LEVELS);
    const units = C().UNITS.filter((x) => ui.levelFilter === 'all' || x.level === ui.levelFilter);
    const doneCount = C().UNITS.filter((x) => recFor(x.id) && recFor(x.id).attempts.length).length;

    main.innerHTML = `
      <div class="page">
        <header class="page-head">
          <div>
            <p class="eyebrow">Módulo 1 · Students Hub</p>
            <h1 class="page-title">Trilhas de Leitura Guiada</h1>
            <p class="lead">Textos autênticos com os chunks que o inglês falado realmente usa. Leia, explore o Word Bank e finalize com uma avaliação de 10 questões com correção comentada.</p>
          </div>
          ${isTeacher() ? '' : `<div class="progress-box" aria-label="Progresso geral nas trilhas">
            <span class="progress-box__num">${doneCount}<small>/${C().UNITS.length}</small></span>
            <span class="progress-box__lbl">leituras concluídas</span>
            <span class="bar"><span class="bar__fill" style="--w:${Math.round((doneCount / C().UNITS.length) * 100)}%"></span></span>
          </div>`}
        </header>

        <div class="filters" role="group" aria-label="Filtrar por nível">
          <button class="chip-btn ${ui.levelFilter === 'all' ? 'is-active' : ''}" data-level="all" aria-pressed="${ui.levelFilter === 'all'}">Todos os níveis</button>
          ${levels.map((l) => `<button class="chip-btn ${ui.levelFilter === l.code ? 'is-active' : ''}" data-level="${l.code}" aria-pressed="${ui.levelFilter === l.code}">
            ${l.name}${!isTeacher() && u.level === l.code ? '<span class="chip-btn__tag">seu nível</span>' : ''}</button>`).join('')}
        </div>

        ${C().AXES.map((axis) => {
          const list = units.filter((x) => x.axis === axis.id);
          if (!list.length && ui.levelFilter !== 'all') return '';
          return `
          <section class="axis">
            <header class="axis__head">
              <span class="axis__n" aria-hidden="true">${axis.n}</span>
              <div><h2 class="axis__title">${esc(axis.title)}</h2><p class="axis__focus">${esc(axis.focus)}</p></div>
            </header>
            ${list.length ? `<div class="unit-grid">${list.map(unitCard).join('')}</div>` : `
              <div class="axis__soon">${SH.icon('layers')}<span>Novas unidades deste eixo estão em produção e entram na trilha nas próximas atualizações.</span></div>`}
          </section>`;
        }).join('')}
        ${units.length ? '' : '<div class="empty card"><p>Nenhuma unidade publicada para este nível ainda.</p></div>'}
      </div>`;

    main.querySelectorAll('[data-level]').forEach((b) => b.addEventListener('click', () => {
      ui.levelFilter = b.dataset.level;
      renderList(main);
    }));
  }

  function unitCard(unit) {
    const rec = recFor(unit.id);
    const done = rec && rec.attempts.length;
    const best = done ? rec.bestScore : 0;
    const status = !done ? { cls: 'new', txt: 'Não iniciada' } : best >= 8 ? { cls: 'ok', txt: 'Concluída · ' + best + '/10' } : { cls: 'mid', txt: 'Revisar · ' + best + '/10' };
    return `
      <a class="unit-card" href="#/reading/${unit.id}">
        <div class="unit-card__art">${SH.illus(unit.illus)}</div>
        <div class="unit-card__body">
          <div class="unit-card__tags"><span class="lvl lvl--${unit.level}">${C().LEVELS[unit.level].name}</span>
          ${isTeacher() ? '' : `<span class="status status--${status.cls}">${status.txt}</span>`}</div>
          <h3 class="unit-card__title">${esc(unit.title)}</h3>
          <p class="unit-card__sub">${esc(unit.subtitle)}</p>
          <ul class="meta">
            <li>${SH.icon('text')}${unit.wordCount} palavras</li>
            <li>${SH.icon('clock')}${unit.minutes} min</li>
            <li>${SH.icon('lexicon')}${unit.wordBank.length} chunks</li>
          </ul>
          ${done ? `<span class="bar bar--thin" aria-label="Melhor nota ${best} de 10"><span class="bar__fill" style="--w:${best * 10}%"></span></span>` : ''}
        </div>
      </a>`;
  }

  /* =========================================================
   * UNIDADE
   * ========================================================= */
  function renderUnit(main, unitId, tab = 'read', extra) {
    const unit = C().unit(unitId);
    if (!unit) { SH.app.notFound(main); return; }
    SH.shell.setActive('reading', 'Trilhas de Leitura');
    document.title = unit.title + ' · Students Hub';
    const axis = C().axis(unit.axis);
    const rec = recFor(unit.id);

    const tabs = [
      { id: 'read', label: 'Leitura', n: 1 },
      { id: 'words', label: 'Word Bank', n: 2 },
      { id: 'quiz', label: 'Avaliação', n: 3, done: rec && rec.attempts.length },
    ];
    const activeTab = tab === 'result' ? 'quiz' : tab;

    main.innerHTML = `
      <div class="page page--unit">
        <nav class="crumbs" aria-label="Você está em">
          <a href="#/reading">${SH.icon('arrowLeft')}Trilhas de Leitura</a>
          <span aria-hidden="true">/</span><span>${C().LEVELS[unit.level].name}</span>
        </nav>

        <header class="unit-hero">
          <div class="unit-hero__art">${SH.illus(unit.illus)}</div>
          <div class="unit-hero__txt">
            <div class="unit-card__tags">
              <span class="lvl lvl--${unit.level}">${C().LEVELS[unit.level].name}</span>
              <span class="tag">Eixo ${axis.n} · ${esc(axis.title)}</span>
            </div>
            <h1 class="page-title">${esc(unit.title)}</h1>
            <p class="lead">${esc(unit.subtitle)}</p>
            <ul class="focus-list" aria-label="Foco da unidade">${unit.focus.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
            <ul class="meta meta--lg">
              <li>${SH.icon('text')}${unit.wordCount} palavras</li>
              <li>${SH.icon('clock')}cerca de ${unit.minutes} min</li>
              <li>${SH.icon('lexicon')}${unit.wordBank.length} chunks</li>
              <li>${SH.icon('target')}${unit.questions.length} questões</li>
            </ul>
          </div>
        </header>

        <div class="steps" role="tablist" aria-label="Etapas da unidade">
          ${tabs.map((t) => `
            <a class="steps__item ${activeTab === t.id ? 'is-active' : ''}" role="tab" aria-selected="${activeTab === t.id}"
               href="#/reading/${unit.id}${t.id === 'read' ? '' : '/' + t.id}">
              <span class="steps__n">${t.done ? SH.icon('check') : t.n}</span><span>${t.label}</span>
            </a>`).join('')}
        </div>

        <div class="unit-body" id="unit-body" role="tabpanel"></div>
      </div>`;

    const body = main.querySelector('#unit-body');
    if (tab === 'read') renderRead(body, unit);
    else if (tab === 'words') renderWords(body, unit);
    else if (tab === 'quiz') renderQuiz(body, unit);
    else if (tab === 'result') renderResult(body, unit, extra);
    else renderRead(body, unit);
  }

  /* ---------- 1. Leitura ---------- */
  function paragraphHTML(p, wbMap) {
    const out = [];
    let last = 0;
    const re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
    let m;
    while ((m = re.exec(p))) {
      out.push(esc(p.slice(last, m.index)));
      out.push(`<button type="button" class="chunk" data-wb="${esc(m[2])}" aria-label="${esc(m[1])}: ver significado">${esc(m[1])}</button>`);
      last = re.lastIndex;
    }
    out.push(esc(p.slice(last)));
    return out.join('');
  }

  function renderRead(body, unit) {
    const u = user();
    const wbMap = Object.fromEntries(unit.wordBank.map((w) => [w.id, w]));
    const scale = u.prefs.fontScale || 1;
    const hl = u.prefs.highlightChunks !== false;
    body.innerHTML = `
      <div class="reader">
        <div class="reader__bar" role="toolbar" aria-label="Ferramentas de leitura">
          <div class="reader__group">
            <button class="tool-btn" data-act="font-down" aria-label="Diminuir fonte">${SH.icon('minus')}<span>A</span></button>
            <button class="tool-btn" data-act="font-up" aria-label="Aumentar fonte">${SH.icon('plus')}<span>A</span></button>
          </div>
          <label class="switch">
            <input type="checkbox" data-act="toggle-hl" ${hl ? 'checked' : ''}>
            <span class="switch__track" aria-hidden="true"></span><span>Destacar chunks</span>
          </label>
          <button class="btn btn--soft btn--sm" data-act="listen" aria-pressed="false">${SH.icon('sound')}<span class="when-idle">Ouvir o texto</span><span class="when-speaking">Parar áudio</span></button>
        </div>
        <p class="reader__tip">${SH.icon('info')}<span>Toque em qualquer trecho destacado para ver o significado natural e ouvir a pronúncia.</span></p>
        <article class="article ${hl ? '' : 'article--plain'}" style="--read-scale:${scale}" lang="en">
          <h2 class="article__title">${esc(unit.title)}</h2>
          ${unit.paragraphs.map((p, i) => `<p data-p="${i}">${paragraphHTML(p, wbMap)}</p>`).join('')}
        </article>
        <div class="next-cta">
          <p>Terminou a leitura? Agora fixe os chunks antes da avaliação.</p>
          <a class="btn btn--primary" href="#/reading/${unit.id}/words">Ir para o Word Bank ${SH.icon('arrowRight')}</a>
        </div>
      </div>
      <div class="chunk-sheet" id="chunk-sheet" role="dialog" aria-modal="false" aria-labelledby="cs-title" hidden></div>`;

    const article = body.querySelector('.article');
    const sheet = body.querySelector('#chunk-sheet');

    body.addEventListener('click', (e) => {
      const chunk = e.target.closest('.chunk');
      if (chunk) { openSheet(sheet, wbMap[chunk.dataset.wb], chunk); return; }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      const a = act.dataset.act;
      if (a === 'font-up' || a === 'font-down') {
        let i = FONT_STEPS.indexOf(u.prefs.fontScale || 1);
        if (i < 0) i = 1;
        i = Math.max(0, Math.min(FONT_STEPS.length - 1, i + (a === 'font-up' ? 1 : -1)));
        SH.store.updateUser(u.id, (x) => { x.prefs.fontScale = FONT_STEPS[i]; });
        article.style.setProperty('--read-scale', FONT_STEPS[i]);
      }
      if (a === 'listen') {
        const paras = article.querySelectorAll('p[data-p]');
        SH.speech.speakQueue(unit.plainParagraphs, {
          btn: act,
          onPart: (i) => paras.forEach((p, k) => p.classList.toggle('is-reading', k === i)),
        });
      }
      if (a === 'sheet-close') closeSheet(sheet);
      if (a === 'sheet-audio') SH.speech.speak(act.dataset.text, { btn: act });
    });
    body.querySelector('[data-act="toggle-hl"]').addEventListener('change', (e) => {
      SH.store.updateUser(u.id, (x) => { x.prefs.highlightChunks = e.target.checked; });
      article.classList.toggle('article--plain', !e.target.checked);
    });
    const onIdle = () => article.querySelectorAll('.is-reading').forEach((p) => p.classList.remove('is-reading'));
    document.addEventListener('sh:speech-idle', onIdle);
    SH.app.onLeave(() => document.removeEventListener('sh:speech-idle', onIdle));

    // Vindo do Word Bank com "Ver no texto"
    if (ui.flashChunk) {
      const target = article.querySelector(`.chunk[data-wb="${ui.flashChunk}"]`);
      ui.flashChunk = null;
      if (target) setTimeout(() => {
        target.scrollIntoView({ behavior: SH.util.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
        target.classList.add('is-flash');
        setTimeout(() => target.classList.remove('is-flash'), 2200);
      }, 120);
    }
  }

  function openSheet(sheet, w, origin) {
    if (!w) return;
    sheet.innerHTML = `
      <div class="chunk-sheet__inner">
        <div class="chunk-sheet__head">
          <h3 id="cs-title" class="chunk-sheet__en" lang="en">${esc(w.en)}</h3>
          <button class="icon-btn" data-act="sheet-close" aria-label="Fechar">${SH.icon('close')}</button>
        </div>
        <p class="pron"><span class="pron__lbl">Pronúncia</span>${esc(w.pron)}</p>
        <p class="chunk-sheet__pt">${esc(w.pt)}</p>
        <p class="chunk-sheet__ex" lang="en">${esc(w.example)}</p>
        <div class="chunk-sheet__actions">
          <button class="btn btn--soft btn--sm" data-act="sheet-audio" data-text="${esc(w.en)}" aria-pressed="false">${SH.icon('sound')}Ouvir o chunk</button>
          <button class="btn btn--ghost btn--sm" data-act="sheet-audio" data-text="${esc(w.example)}" aria-pressed="false">${SH.icon('sound')}Ouvir o exemplo</button>
        </div>
      </div>`;
    sheet.hidden = false;
    sheet._origin = origin;
    document.querySelectorAll('.chunk.is-open').forEach((c) => c.classList.remove('is-open'));
    origin.classList.add('is-open');
    requestAnimationFrame(() => sheet.classList.add('is-in'));
    sheet.querySelector('[data-act="sheet-close"]').focus({ preventScroll: true });
    const onKey = (e) => { if (e.key === 'Escape') { closeSheet(sheet); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
  }

  function closeSheet(sheet) {
    sheet.classList.remove('is-in');
    SH.speech.stop();
    const origin = sheet._origin;
    setTimeout(() => { sheet.hidden = true; }, 200);
    if (origin) { origin.classList.remove('is-open'); origin.focus({ preventScroll: true }); }
  }

  /* ---------- 2. Word Bank ---------- */
  function renderWords(body, unit) {
    const u = user();
    const slow = u.prefs.audioPace === 'slow';
    body.innerHTML = `
      <div class="wb">
        <div class="wb__head">
          <div>
            <h2 class="section-title">Word Bank Lexical</h2>
            <p class="muted">${unit.wordBank.length} chunks retirados do texto. Aprenda cada um como um bloco único, do jeito que o falante nativo armazena na memória.</p>
          </div>
          <div class="seg seg--sm" role="group" aria-label="Velocidade do áudio">
            <button class="seg__btn ${slow ? '' : 'is-active'}" data-pace="natural" aria-pressed="${!slow}">${SH.icon('rabbit')}Natural</button>
            <button class="seg__btn ${slow ? 'is-active' : ''}" data-pace="slow" aria-pressed="${slow}">${SH.icon('turtle')}Pausada</button>
          </div>
        </div>
        <div class="legend">
          <span class="legend__title">Como ler as dicas de pronúncia</span>
          <span><strong>MAIÚSCULAS</strong> marcam a sílaba mais forte</span>
          <span><strong>dh</strong> e <strong>th</strong>: ponta da língua entre os dentes</span>
          <span><strong>â</strong>: som neutro e curto, como o "a" de "cama" falado rápido</span>
          <span><strong>r</strong> no início: sai leve, como o "rr" de "carro"</span>
        </div>
        <ol class="wb-grid">
          ${unit.wordBank.map((w, i) => `
            <li class="wb-card">
              <div class="wb-card__top">
                <span class="wb-card__n">${String(i + 1).padStart(2, '0')}</span>
                <button class="icon-btn icon-btn--soft" data-say="${esc(w.en)}" aria-pressed="false" aria-label="Ouvir: ${esc(w.en)}">${SH.icon('sound')}</button>
              </div>
              <h3 class="wb-card__en" lang="en">${esc(w.en)}</h3>
              <p class="pron"><span class="pron__lbl">Pronúncia</span>${esc(w.pron)}</p>
              <p class="wb-card__pt"><span class="sr-only">Equivalente natural: </span>${esc(w.pt)}</p>
              <div class="wb-card__ex">
                <p lang="en">${esc(w.example)}</p>
                <button class="icon-btn icon-btn--sm" data-say="${esc(w.example)}" aria-pressed="false" aria-label="Ouvir a frase de exemplo">${SH.icon('sound')}</button>
              </div>
              <button class="link link--sm" data-find="${esc(w.id)}">${SH.icon('eye')}Ver no texto</button>
            </li>`).join('')}
        </ol>
        <div class="next-cta">
          <p>Chunks revisados. Hora de mostrar o que você entendeu.</p>
          <a class="btn btn--primary" href="#/reading/${unit.id}/quiz">Começar a avaliação ${SH.icon('arrowRight')}</a>
        </div>
      </div>`;

    body.addEventListener('click', (e) => {
      const say = e.target.closest('[data-say]');
      if (say) { SH.speech.speak(say.dataset.say, { btn: say }); return; }
      const find = e.target.closest('[data-find]');
      if (find) { ui.flashChunk = find.dataset.find; location.hash = '#/reading/' + unit.id; return; }
      const pace = e.target.closest('[data-pace]');
      if (pace) {
        SH.store.updateUser(u.id, (x) => { x.prefs.audioPace = pace.dataset.pace; });
        body.querySelectorAll('[data-pace]').forEach((b) => {
          const on = b === pace; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on));
        });
      }
    });
  }

  /* ---------- 3. Avaliação ---------- */
  function renderQuiz(body, unit) {
    const rec = recFor(unit.id);
    const draft = ui.drafts[unit.id] || (ui.drafts[unit.id] = Array(unit.questions.length).fill(null));
    const answered = () => draft.filter((x) => x !== null).length;
    const total = unit.questions.length;

    body.innerHTML = `
      <div class="quiz">
        <div class="quiz__intro card">
          <div>
            <h2 class="section-title">Avaliação diagnóstica</h2>
            <p class="muted">${total} questões que misturam interpretação, chunks em contexto, estruturas do texto e equivalência natural. Responda com calma: você pode voltar ao texto quando quiser.</p>
          </div>
          <ul class="kv kv--inline">
            <li><span>Primeira tentativa</span><strong>10 XP por acerto + 15 de bônus</strong></li>
            <li><span>Novas tentativas</span><strong>5 XP por acerto</strong></li>
          </ul>
          ${isTeacher() ? `<p class="note">${SH.icon('info')}<span>Modo professor: você vê a correção completa, mas o resultado não é registrado em nenhum perfil.</span></p>` : ''}
          ${rec && rec.attempts.length ? `
            <div class="history">
              <span class="history__lbl">Suas tentativas</span>
              <ul>${rec.attempts.slice().reverse().map((a) => `
                <li><a href="#/reading/${unit.id}/result/${a.id}" class="history__item">
                  <span class="score ${a.score >= 8 ? 'score--ok' : a.score >= 6 ? 'score--mid' : 'score--low'}">${a.score}/${a.total}</span>
                  <span>${SH.util.fmtDateTime(a.date)}</span><span class="history__see">Ver correção</span></a></li>`).join('')}
              </ul>
            </div>` : ''}
        </div>

        <div class="quiz__progress" aria-live="polite">
          <span class="quiz__count"><strong id="q-count">${answered()}</strong> de ${total} respondidas</span>
          <span class="bar"><span class="bar__fill" id="q-bar" style="--w:${(answered() / total) * 100}%"></span></span>
        </div>

        <form class="questions" id="quiz-form" novalidate>
          ${unit.questions.map((q, qi) => `
            <fieldset class="q-card ${draft[qi] !== null ? 'is-answered' : ''}" id="q-${qi}">
              <legend class="q-card__legend">
                <span class="q-card__num">Questão ${qi + 1}</span>
                <span class="tag tag--q">${C().QTYPES[q.type]}</span>
              </legend>
              <p class="q-card__prompt">${esc(q.prompt)}</p>
              <div class="options">
                ${q.options.map((o, oi) => `
                  <label class="option">
                    <input type="radio" name="q${qi}" value="${oi}" ${draft[qi] === oi ? 'checked' : ''}>
                    <span class="option__letter" aria-hidden="true">${LETTERS[oi]}</span>
                    <span class="option__txt">${esc(o)}</span>
                  </label>`).join('')}
              </div>
            </fieldset>`).join('')}

          <div class="quiz__submit">
            <p class="muted" id="submit-hint">${answered() === total ? 'Tudo respondido. Pode finalizar quando quiser.' : 'Responda todas as questões para liberar a correção.'}</p>
            <div class="quiz__btns">
              <button type="button" class="btn btn--ghost" data-act="clear">Limpar respostas</button>
              <button type="submit" class="btn btn--primary btn--lg" id="submit-btn" ${answered() === total ? '' : 'disabled'}>Finalizar e Corrigir Atividade</button>
            </div>
          </div>
        </form>
      </div>`;

    const form = body.querySelector('#quiz-form');
    const submit = body.querySelector('#submit-btn');
    const sync = () => {
      const n = answered();
      body.querySelector('#q-count').textContent = n;
      body.querySelector('#q-bar').style.setProperty('--w', (n / total) * 100 + '%');
      submit.disabled = n !== total;
      body.querySelector('#submit-hint').textContent = n === total
        ? 'Tudo respondido. Pode finalizar quando quiser.'
        : 'Faltam ' + (total - n) + (total - n === 1 ? ' questão' : ' questões') + ' para liberar a correção.';
    };

    form.addEventListener('change', (e) => {
      const input = e.target;
      if (input.type !== 'radio') return;
      const qi = Number(input.name.slice(1));
      draft[qi] = Number(input.value);
      input.closest('.q-card').classList.add('is-answered');
      sync();
    });
    body.querySelector('[data-act="clear"]').addEventListener('click', () => {
      ui.drafts[unit.id] = Array(total).fill(null);
      renderQuiz(body, unit);
      body.querySelector('#q-0').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (answered() !== total) {
        const firstEmpty = draft.findIndex((x) => x === null);
        body.querySelector('#q-' + firstEmpty).scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const chosen = draft.slice();
      ui.drafts[unit.id] = null;
      if (isTeacher()) {
        ui.previewResult = buildPreview(unit, chosen);
        location.hash = '#/reading/' + unit.id + '/result/preview';
      } else {
        const attempt = SH.store.recordReading(user().id, unit, chosen);
        SH.shell.refreshStats();
        ui.reviewFilter = 'all';
        ui.justFinished = attempt.id;
        location.hash = '#/reading/' + unit.id + '/result/' + attempt.id;
      }
    });
  }

  function buildPreview(unit, chosen) {
    const answers = unit.questions.map((q, i) => ({ qid: q.id, chosen: chosen[i], correct: q.answer, ok: chosen[i] === q.answer, cat: q.cat }));
    const score = answers.filter((a) => a.ok).length;
    return { id: 'preview', unitId: unit.id, date: new Date().toISOString(), score, total: unit.questions.length, xp: 0, first: false, answers, preview: true };
  }

  /* ---------- Correção analítica ---------- */
  function scoreMessage(score, total) {
    const r = score / total;
    if (r === 1) return { title: 'Leitura impecável!', text: 'Você acertou tudo. Os chunks e as estruturas deste texto já fazem parte do seu repertório.' };
    if (r >= 0.8) return { title: 'Excelente resultado!', text: 'Você domina a maior parte do texto. Os poucos ajustes abaixo vão deixar seu inglês ainda mais natural.' };
    if (r >= 0.6) return { title: 'Boa base construída!', text: 'Você já entende a história e muitos dos chunks. Leia as explicações com calma: elas mostram exatamente onde investir.' };
    return { title: 'Você deu um passo importante.', text: 'Errar faz parte do processo de aprender. Cada explicação abaixo é uma pista do próximo avanço. Volte ao texto e tente de novo quando quiser.' };
  }

  function ring(score, total) {
    const r = 52, c = 2 * Math.PI * r, pct = score / total;
    return `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="${r}" class="ring__bg"/>
      <circle cx="60" cy="60" r="${r}" class="ring__fg" style="--c:${c};--o:${c * (1 - pct)}" stroke-dasharray="${c}" stroke-dashoffset="${c}"/>
    </svg>`;
  }

  function renderResult(body, unit, attemptId) {
    let attempt = null;
    if (attemptId === 'preview') attempt = ui.previewResult && ui.previewResult.unitId === unit.id ? ui.previewResult : null;
    else {
      const rec = recFor(unit.id);
      attempt = rec ? rec.attempts.find((a) => a.id === attemptId) : null;
    }
    if (!attempt) { location.hash = '#/reading/' + unit.id + '/quiz'; return; }

    const fresh = ui.justFinished === attempt.id;
    ui.justFinished = null;
    const msg = scoreMessage(attempt.score, attempt.total);
    const byCat = {};
    attempt.answers.forEach((a) => {
      const t = byCat[a.cat] || (byCat[a.cat] = { ok: 0, total: 0 });
      t.total++; if (a.ok) t.ok++;
    });
    const mastered = Object.entries(byCat).filter(([, t]) => t.ok === t.total);
    const review = Object.entries(byCat).filter(([, t]) => t.ok < t.total);
    const idx = C().UNITS.indexOf(unit);
    const nextU = C().UNITS[idx + 1];
    const filter = ui.reviewFilter;

    body.innerHTML = `
      <div class="result">
        <section class="result__top card ${fresh ? 'is-fresh' : ''}">
          <div class="result__score">
            ${ring(attempt.score, attempt.total)}
            <div class="result__num"><strong>${attempt.score}</strong><span>/${attempt.total}</span></div>
          </div>
          <div class="result__msg">
            <p class="eyebrow">${attempt.preview ? 'Pré-visualização do professor' : 'Avaliação corrigida · ' + SH.util.fmtDateTime(attempt.date)}</p>
            <h2 class="result__title">${msg.title}</h2>
            <p>${msg.text}</p>
            ${attempt.preview ? '' : `<span class="xp-badge ${fresh ? 'is-pop' : ''}">${SH.icon('star')}+${attempt.xp} XP ${attempt.first ? '<small>primeira tentativa</small>' : '<small>nova tentativa</small>'}</span>`}
          </div>
        </section>

        <div class="grid-2">
          <section class="card card--ok">
            <h3 class="card__title">Você dominou neste texto</h3>
            ${mastered.length ? `<ul class="chips">${mastered.map(([id, t]) => `<li class="chip chip--ok">${SH.icon('check')}${esc(C().topic(id).label)} <small>${t.ok}/${t.total}</small></li>`).join('')}</ul>`
              : '<p class="muted">Ainda não houve um tópico com 100% de acerto, mas cada acerto abaixo já é repertório seu.</p>'}
          </section>
          <section class="card card--attn">
            <h3 class="card__title">Vale revisar com carinho</h3>
            ${review.length ? `<ul class="chips">${review.map(([id, t]) => `<li class="chip chip--attn">${esc(C().topic(id).label)} <small>${t.ok}/${t.total}</small></li>`).join('')}</ul>
              ${attempt.preview ? '' : '<p class="muted small">Esses tópicos foram registrados no seu perfil e vão orientar suas próximas práticas e a aula com o Gabriel.</p>'}`
              : '<p class="muted">Nada para revisar nesta unidade. Excelente trabalho.</p>'}
          </section>
        </div>

        <section class="review">
          <div class="review__head">
            <h3 class="section-title">Correção questão por questão</h3>
            <div class="seg seg--sm" role="group" aria-label="Filtrar correção">
              <button class="seg__btn ${filter === 'all' ? 'is-active' : ''}" data-filter="all" aria-pressed="${filter === 'all'}">Todas (${attempt.total})</button>
              <button class="seg__btn ${filter === 'wrong' ? 'is-active' : ''}" data-filter="wrong" aria-pressed="${filter === 'wrong'}">Para revisar (${attempt.total - attempt.score})</button>
              <button class="seg__btn ${filter === 'right' ? 'is-active' : ''}" data-filter="right" aria-pressed="${filter === 'right'}">Acertos (${attempt.score})</button>
            </div>
          </div>
          <ol class="review__list">
            ${unit.questions.map((q, i) => {
              const a = attempt.answers[i];
              if (!a) return '';
              const hide = (filter === 'wrong' && a.ok) || (filter === 'right' && !a.ok);
              return `
              <li class="rv-card ${a.ok ? 'rv-card--ok' : 'rv-card--err'}" ${hide ? 'hidden' : ''}>
                <div class="rv-card__head">
                  <span class="rv-card__status">${SH.icon(a.ok ? 'check' : 'x')}<span>${a.ok ? 'Acertou' : 'Para revisar'}</span></span>
                  <span class="q-card__num">Questão ${i + 1}</span>
                  <span class="tag tag--q">${esc(C().topic(q.cat).label)}</span>
                </div>
                <p class="q-card__prompt">${esc(q.prompt)}</p>
                <div class="rv-answers">
                  <p class="rv-ans ${a.ok ? 'rv-ans--ok' : 'rv-ans--err'}"><span class="rv-ans__lbl">Você marcou</span><span><strong>${LETTERS[a.chosen]}.</strong> ${esc(q.options[a.chosen])}</span></p>
                  ${a.ok ? '' : `<p class="rv-ans rv-ans--ok"><span class="rv-ans__lbl">Resposta natural</span><span><strong>${LETTERS[q.answer]}.</strong> ${esc(q.options[q.answer])}</span></p>`}
                </div>
                <div class="explain"><span class="explain__lbl">${SH.icon('info')}Por que é assim</span><p>${esc(q.explain)}</p></div>
              </li>`;
            }).join('')}
          </ol>
        </section>

        <div class="result__actions">
          <a class="btn btn--ghost" href="#/reading/${unit.id}">${SH.icon('book')}Reler o texto</a>
          <a class="btn btn--ghost" href="#/reading/${unit.id}/quiz" data-act="retry">${SH.icon('refresh')}Refazer avaliação</a>
          ${nextU ? `<a class="btn btn--primary" href="#/reading/${nextU.id}">Próxima unidade ${SH.icon('arrowRight')}</a>` : `<a class="btn btn--primary" href="#/reading">Voltar às trilhas ${SH.icon('arrowRight')}</a>`}
        </div>
      </div>`;

    body.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      ui.reviewFilter = b.dataset.filter;
      body.querySelectorAll('[data-filter]').forEach((x) => {
        const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on));
      });
      body.querySelectorAll('.rv-card').forEach((card) => {
        const ok = card.classList.contains('rv-card--ok');
        card.hidden = (ui.reviewFilter === 'wrong' && ok) || (ui.reviewFilter === 'right' && !ok);
      });
    }));
    body.querySelector('[data-act="retry"]').addEventListener('click', () => { ui.drafts[unit.id] = null; ui.reviewFilter = 'all'; });

    if (fresh) {
      const top = document.querySelector('.steps');
      if (top) top.scrollIntoView({ behavior: SH.util.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (attempt.score >= 8) SH.util.toast('+' + attempt.xp + ' XP. Resultado registrado no seu perfil.', 'ok');
      else SH.util.toast('+' + attempt.xp + ' XP. Seus pontos de atenção foram atualizados.', 'info');
    }
    requestAnimationFrame(() => body.querySelector('.ring__fg') && body.querySelector('.ring__fg').classList.add('is-drawn'));
  }

  SH.reading = { renderList, renderUnit };
})(window.SH);

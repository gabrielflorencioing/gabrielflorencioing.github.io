/* Students Hub · Módulo 7: Central de Inteligência do Professor (exclusivo Gabriel Florencio) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const U = SH.util;
  const LETTERS = ['A', 'B', 'C', 'D'];

  const idleDays = (s) => (s.progress.lastActiveAt ? U.daysBetweenKeys(U.dayKey(new Date(s.progress.lastActiveAt)), U.dayKey()) : null);
  const avatarCls = (s) => (s.id === SH.store.demoIds.renan ? 'renan' : s.id === SH.store.demoIds.julia ? 'julia' : 'lil');

  /* =========================================================
   * VISÃO GERAL DA TURMA
   * ========================================================= */
  function renderOverview(main) {
    SH.shell.setActive('teacher', 'Central do Professor');
    const studs = SH.store.students().map((s) => ({ s, sum: SH.store.summary(s), idle: idleDays(s) }))
      .sort((a, b) => (b.idle == null ? 999 : b.idle) - (a.idle == null ? 999 : a.idle) || a.s.name.localeCompare(b.s.name));
    const withAcc = studs.filter((r) => r.sum.accuracy != null);
    const avg = withAcc.length ? Math.round(withAcc.reduce((t, r) => t + r.sum.accuracy, 0) / withAcc.length) : null;
    const inactive = studs.filter((r) => r.idle == null || r.idle > 5).length;
    const shared = studs.reduce((t, r) => t + r.s.notebook.filter((n) => n.shared).length, 0);
    const total = C().UNITS.length;

    main.innerHTML = `
      <div class="page">
        <header class="page-head"><div>
          <p class="eyebrow">Módulo 7 · Exclusivo Gabriel Florencio</p>
          <h1 class="page-title">Central de Inteligência do Professor</h1>
          <p class="lead">Visão panorâmica da turma. Selecione um aluno para abrir o dossiê completo, o mapa de fragilidades e a pauta sugerida para a próxima aula.</p>
        </div></header>
        <section class="stats" aria-label="Indicadores da turma">
          <div class="stat"><span class="stat__icon stat__icon--lil">${SH.icon('users')}</span><span class="stat__num">${studs.length}</span><span class="stat__lbl">alunos cadastrados</span></div>
          <div class="stat"><span class="stat__icon stat__icon--mint">${SH.icon('target')}</span><span class="stat__num">${avg == null ? '<small>sem dados</small>' : avg + '<small>%</small>'}</span><span class="stat__lbl">acerto médio em leitura</span></div>
          <div class="stat"><span class="stat__icon stat__icon--coral">${SH.icon('alert')}</span><span class="stat__num">${inactive}</span><span class="stat__lbl">há mais de 5 dias sem praticar</span></div>
          <div class="stat"><span class="stat__icon stat__icon--yel">${SH.icon('book')}</span><span class="stat__num">${shared}</span><span class="stat__lbl">dúvidas compartilhadas</span></div>
        </section>
        <section class="card">
          <div class="card__head"><h2 class="card__title">Alunos</h2><span class="muted small">Ordenados por tempo sem praticar</span></div>
          ${studs.length ? `<ul class="students">${studs.map(({ s, sum, idle }) => `
            <li><a class="student student--link" href="#/teacher/${s.id}">
              <span class="avatar avatar--${avatarCls(s)}" aria-hidden="true">${esc(U.initials(s.name))}</span>
              <div class="student__main">
                <strong>${esc(s.name)}</strong>
                <small>${esc(SH.labels.GOALS[s.goal] || '')} · ${esc(SH.labels.LOCATIONS[s.location] || '')}</small>
                <span class="student__progress"><span class="bar bar--thin"><span class="bar__fill" style="--w:${(sum.unitsDone / total) * 100}%"></span></span><small>${sum.unitsDone}/${total} leituras</small></span>
                ${sum.attention.length ? `<span class="chip chip--attn">Atenção: ${esc(sum.attention[0].label)}</span>` : sum.attempts.length ? '<span class="chip chip--ok">Sem pontos críticos</span>' : '<span class="chip">Ainda sem avaliações</span>'}
              </div>
              <div class="student__meta">
                <span class="lvl lvl--${s.level}">${s.level}</span>
                <span class="student__kv"><strong>${sum.xp}</strong><small>XP</small></span>
                <span class="student__kv"><strong>${sum.accuracy == null ? '–' : sum.accuracy + '%'}</strong><small>acerto</small></span>
                <span class="student__kv ${idle == null || idle > 5 ? 'is-alert' : ''}"><strong>${idle == null ? 'nunca' : idle === 0 ? 'hoje' : idle + 'd'}</strong><small>${idle == null || idle > 5 ? 'inativo' : 'último estudo'}</small></span>
                <span class="student__go">${SH.icon('arrowRight')}</span>
              </div>
            </a></li>`).join('')}</ul>` : '<div class="empty"><p>Nenhum aluno cadastrado neste navegador ainda.</p></div>'}
        </section>
      </div>`;
  }

  /* =========================================================
   * PAUTA AUTOMÁTICA DA PRÓXIMA AULA
   * ========================================================= */
  function lessonPlan(s) {
    const sum = SH.store.summary(s);
    const steps = [];
    const strength = sum.strengths[0];
    const lastAttempt = sum.attempts[0];
    steps.push({
      title: 'Abertura com validação (5 min)',
      text: (strength ? 'Celebre o domínio em ' + strength.label + ' (' + strength.ok + ' de ' + strength.total + ' acertos). ' : '') +
        (lastAttempt ? 'Comente a última leitura, "' + C().unit(lastAttempt.unitId).title + '", começando pelo que foi acertado (' + lastAttempt.score + '/10).' : 'Pergunte como foi a semana de estudos e o que ficou mais fácil.'),
    });
    const doubts = s.notebook.filter((n) => n.shared).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 2);
    doubts.forEach((n) => steps.push({ title: 'Responder dúvida do caderno', text: n.title + ' (' + (n.topic || 'Geral') + ', ' + U.relDays(n.createdAt) + '). Peça que o aluno explique o que entendeu antes de responder.' }));
    sum.attention.slice(0, 2).forEach((t) => steps.push({
      title: 'Intervenção: ' + t.label + ' (10 a 15 min)',
      text: (C().INTERVENTIONS[t.id] || 'Retomar o tópico com exemplos da vida real do aluno.') + ' Evidência: ' + t.ok + ' de ' + t.total + ' acertos' + (t.lastWrongAt ? ', último erro ' + U.relDays(t.lastWrongAt) : '') + '.',
    }));
    const home = sum.attention[0] ? C().PRACTICE[sum.attention[0].id] || {} : {};
    steps.push({
      title: 'Tarefa para casa',
      text: home.game || home.map
        ? 'Indicar ' + [home.map ? 'o mapa mental "' + C().map(home.map).title + '"' : '', home.game ? 'o jogo ' + C().game(home.game).title : ''].filter(Boolean).join(' e ') + ', e combinar uma frase real para usar na semana.'
        : 'Escolher a próxima leitura guiada do nível ' + s.level + ' e registrar 3 chunks novos no caderno.',
    });
    return steps;
  }

  /* =========================================================
   * DOSSIÊ INDIVIDUAL
   * ========================================================= */
  function renderDossier(main, id) {
    const s = SH.store.getUser(id);
    if (!s || s.role !== 'student') { location.replace('#/teacher'); return; }
    SH.shell.setActive('teacher', 'Central do Professor');
    const sum = SH.store.summary(s);
    const idle = idleDays(s);
    const ar = SH.diagnosis.areas(s);
    const topics = Object.entries(s.progress.topicStats).map(([tid, t]) => ({ id: tid, label: C().topic(tid).label, ...t, err: t.total ? (t.total - t.ok) / t.total : 0 }))
      .filter((t) => t.total).sort((a, b) => b.err - a.err || b.total - a.total);
    const plan = lessonPlan(s);
    const shared = s.notebook.filter((n) => n.shared).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const nowKey = U.dayKey() + ' ' + new Date().toTimeString().slice(0, 5);
    const nextClass = s.events.filter((e) => e.date + ' ' + e.time >= nowKey && e.type === 'class').sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1))[0];

    main.innerHTML = `
      <div class="page">
        <nav class="crumbs" aria-label="Você está em"><a href="#/teacher">${SH.icon('arrowLeft')}Central do Professor</a><span aria-hidden="true">/</span><span>Dossiê</span></nav>
        <header class="profile-head card">
          <span class="avatar avatar--lg avatar--${avatarCls(s)}" aria-hidden="true">${esc(U.initials(s.name))}</span>
          <div class="profile-head__txt">
            <p class="eyebrow">Dossiê individual</p>
            <h1 class="page-title">${esc(s.name)}</h1>
            <p class="muted">${esc(s.email)} · Nível ${s.level} · ${esc(SH.labels.GOALS[s.goal] || '')} · ${esc(SH.labels.LOCATIONS[s.location] || '')}</p>
            ${nextClass ? `<p class="chip chip--ok">${SH.icon('calendar')}Próxima aula: ${U.fmtDate(U.keyToDate(nextClass.date))}, ${esc(nextClass.time)}</p>` : ''}
          </div>
          <div class="profile-head__kpis">
            <span><strong>${sum.xp}</strong><small>XP</small></span>
            <span><strong>${sum.accuracy == null ? '–' : sum.accuracy + '%'}</strong><small>acerto</small></span>
            <span class="${idle == null || idle > 5 ? 'is-alert' : ''}"><strong>${idle == null ? 'nunca' : idle === 0 ? 'hoje' : idle + 'd'}</strong><small>${idle == null || idle > 5 ? 'inativo' : 'sem praticar'}</small></span>
          </div>
        </header>

        <section class="card plan">
          <div class="card__head"><h2 class="card__title">${SH.icon('spark')}Sugestão automática para a próxima aula</h2>
            <button class="btn btn--soft btn--sm" data-copy>${SH.icon('layers')}Copiar pauta</button></div>
          <p class="muted small">Gerada a partir dos erros recentes, dos pontos fortes e das dúvidas compartilhadas no caderno.</p>
          <ol class="plan__list">${plan.map((p, i) => `<li><span class="plan__n">${i + 1}</span><div><strong>${esc(p.title)}</strong><p>${esc(p.text)}</p></div></li>`).join('')}</ol>
        </section>

        <div class="grid-2">
          <section class="card">
            <h2 class="card__title">Indicadores por área</h2>
            ${SH.diagnosis.areaBars(ar)}
          </section>
          <section class="card">
            <h2 class="card__title">Mapa de fragilidades</h2>
            ${topics.length ? `<ul class="frag">${topics.map((t) => `
              <li><div class="area-bars__top"><strong>${esc(t.label)}</strong><span>${Math.round(t.err * 100)}% de erro</span></div>
              <span class="bar bar--frag"><span class="bar__fill" style="--w:${Math.max(4, Math.round(t.err * 100))}%"></span></span>
              <small class="muted">${t.total - t.ok} erro(s) em ${t.total} questões${t.lastWrongAt ? ' · último erro ' + U.relDays(t.lastWrongAt) : ''}</small></li>`).join('')}</ul>`
              : '<p class="muted">Ainda não há respostas registradas.</p>'}
          </section>
        </div>

        <section class="card">
          <h2 class="card__title">Histórico de leituras e questões erradas</h2>
          ${sum.attempts.length ? `<ul class="dossier-reads">${sum.attempts.map((a) => {
            const unit = C().unit(a.unitId);
            const wrong = a.answers.map((x, i) => ({ x, q: unit.questions[i] })).filter((w) => !w.x.ok);
            return `<li class="dossier-read">
              <div class="dossier-read__head"><span class="lvl lvl--${unit.level}">${unit.level}</span><strong>${esc(unit.title)}</strong>
                <span class="score ${a.score >= 8 ? 'score--ok' : a.score >= 6 ? 'score--mid' : 'score--low'}">${a.score}/${a.total}</span><small class="muted">${U.fmtDateTime(a.date)}</small></div>
              ${wrong.length ? `<ul class="wrong-list">${wrong.map((w) => `<li><span class="tag tag--q">${esc(C().topic(w.q.cat).label)}</span>
                <span class="wrong-list__q">${esc(w.q.prompt)}</span>
                <span class="wrong-list__a"><span class="t-err">Marcou ${LETTERS[w.x.chosen]}: ${esc(w.q.options[w.x.chosen])}</span><span class="t-ok">Correta ${LETTERS[w.q.answer]}: ${esc(w.q.options[w.q.answer])}</span></span></li>`).join('')}</ul>`
                : '<p class="muted small">Gabaritou esta avaliação.</p>'}
            </li>`;
          }).join('')}</ul>` : '<p class="muted">Nenhuma leitura concluída ainda.</p>'}
        </section>

        <div class="grid-2">
          <section class="card">
            <h2 class="card__title">Desempenho nos jogos</h2>
            ${Object.keys(s.progress.games || {}).length ? `<ul class="game-perf">${C().GAMES.filter((g) => s.progress.games[g.id]).map((g) => {
              const r = s.progress.games[g.id];
              const avg = Math.round(r.history.reduce((t, h) => t + h.score / h.total, 0) / r.history.length * 100);
              const combo = r.history.reduce((m, h) => Math.max(m, h.maxCombo), 0);
              return `<li><strong>${esc(g.title)}</strong><span class="game-perf__kv"><span>${r.plays} partida(s)</span><span>recorde ${r.bestScore}/${r.bestTotal}</span><span>média ${avg}%</span><span>combo x${combo}</span></span>
                <small class="muted">Última partida ${U.relDays(r.lastPlayed)}</small></li>`;
            }).join('')}</ul>` : '<p class="muted">O aluno ainda não jogou na Arena.</p>'}
          </section>
          <section class="card">
            <h2 class="card__title">Dúvidas compartilhadas no caderno</h2>
            ${shared.length ? `<ul class="notes notes--compact">${shared.map((n) => `<li class="note-card is-shared">
              <div class="note-card__head"><span class="tag">${esc(n.topic || 'Geral')}</span><small class="muted">${U.relDays(n.createdAt)}</small></div>
              <h3 class="note-card__title">${esc(n.title)}</h3><p class="note-card__body">${esc(n.body)}</p></li>`).join('')}</ul>`
              : '<p class="muted">Nenhuma dúvida compartilhada no momento.</p>'}
          </section>
        </div>

        <section class="card">
          <div class="card__head"><h2 class="card__title">${SH.icon('lock')}Notas privadas do professor</h2><span class="muted small" id="tn-status">Visível apenas para você</span></div>
          <label class="sr-only" for="tn">Notas privadas sobre ${esc(s.name)}</label>
          <textarea id="tn" class="teacher-notes" rows="6" placeholder="Observações pedagógicas, combinados e percepções sobre o aluno.">${esc(s.teacherNotes || '')}</textarea>
        </section>
      </div>`;

    let t = null;
    main.querySelector('#tn').addEventListener('input', (e) => {
      const val = e.target.value;
      main.querySelector('#tn-status').textContent = 'Salvando...';
      clearTimeout(t);
      t = setTimeout(() => {
        SH.store.updateUser(s.id, (x) => { x.teacherNotes = val; });
        const st = document.getElementById('tn-status');
        if (st) st.textContent = 'Salvo às ' + new Date().toTimeString().slice(0, 5);
      }, 500);
    });
    SH.app.onLeave(() => { clearTimeout(t); const el = document.getElementById('tn'); if (el) SH.store.updateUser(s.id, (x) => { x.teacherNotes = el.value; }); });
    main.querySelector('[data-copy]').addEventListener('click', () => {
      const text = 'Pauta da próxima aula: ' + s.name + '\n\n' + plan.map((p, i) => (i + 1) + '. ' + p.title + '\n' + p.text).join('\n\n');
      const done = () => U.toast('Pauta copiada para a área de transferência.', 'ok');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
      else fallbackCopy(text, done);
    });
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { U.toast('Não foi possível copiar automaticamente.', 'err'); }
    ta.remove();
  }

  SH.teacher = { renderOverview, renderDossier, lessonPlan };
})(window.SH);

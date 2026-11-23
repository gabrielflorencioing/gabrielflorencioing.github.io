/* Students Hub · Módulo 5: Perfil Cognitivo do Aluno & Diagnóstico de Evolução
 * Exporta SH.diagnosis, usado também pelo Início e pela Central do Professor.
 */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;

  /* =========================================================
   * DIAGNÓSTICO (lógica compartilhada)
   * ========================================================= */
  function areas(user) {
    const stats = Object.entries(user.progress.topicStats);
    const bySkill = (skill) => {
      const list = stats.filter(([id]) => C().topic(id).skill === skill);
      const total = list.reduce((s, [, t]) => s + t.total, 0);
      const ok = list.reduce((s, [, t]) => s + t.ok, 0);
      return { value: total ? Math.round((ok / total) * 100) : null, detail: total ? ok + ' de ' + total + ' acertos' : 'Sem dados ainda' };
    };
    const set = new Set(user.progress.activityDays);
    let active = 0;
    for (let i = 0; i < 14; i++) { const d = new Date(); d.setDate(d.getDate() - i); if (set.has(SH.util.dayKey(d))) active++; }
    return [
      { id: 'reading', label: 'Leitura e Compreensão', color: '#2E9E6B', ...bySkill('reading') },
      { id: 'lexical', label: 'Vocabulário e Chunks', color: '#6246EA', ...bySkill('lexical') },
      { id: 'grammar', label: 'Estruturas e Gramática', color: '#D9822B', ...bySkill('grammar') },
      { id: 'constancy', label: 'Constância de Estudo', color: '#C2417A', value: Math.min(100, Math.round((active / 10) * 100)), detail: active + ' de 14 dias com estudo (meta: 10)' },
    ];
  }

  /** Atalhos de prática para um tópico: mapa mental, jogo e a leitura em que o erro apareceu */
  function practiceLinks(user, topicId) {
    const p = C().PRACTICE[topicId] || {};
    const links = [];
    if (p.map) links.push({ href: '#/maps/' + p.map, label: 'Mapa mental', icon: 'map' });
    if (p.game) links.push({ href: '#/games/' + p.game, label: 'Jogo', icon: 'game' });
    const attempts = Object.values(user.progress.readings).flatMap((r) => r.attempts).sort((a, b) => (a.date < b.date ? 1 : -1));
    const hit = attempts.find((a) => a.answers.some((x) => x.cat === topicId && !x.ok));
    if (hit) links.push({ href: '#/reading/' + hit.unitId + '/result/' + hit.id, label: 'Revisar correção', icon: 'book' });
    return links;
  }

  function achievements(user) {
    const list = [];
    const sum = SH.store.summary(user);
    Object.entries(user.progress.readings).forEach(([id, r]) => {
      const u = C().unit(id);
      if (!u || !r.attempts.length) return;
      list.push(r.bestScore === 10
        ? { icon: 'star', title: 'Gabaritou "' + u.title + '"', text: '10 de 10 na avaliação. Domínio completo do texto.' }
        : { icon: 'check', title: 'Concluiu "' + u.title + '"', text: 'Melhor resultado: ' + r.bestScore + ' de 10, nível ' + u.level + '.' });
    });
    Object.entries(user.progress.games || {}).forEach(([id, g]) => {
      const game = C().game(id);
      if (!game) return;
      const combo = g.history.reduce((m, h) => Math.max(m, h.maxCombo), 0);
      list.push({ icon: 'game', title: game.title + ': recorde de ' + g.bestScore + '/' + g.bestTotal, text: g.plays + (g.plays === 1 ? ' partida' : ' partidas') + ', melhor combo x' + combo + '.' });
    });
    sum.strengths.slice(0, 4).forEach((t) => list.push({ icon: 'target', title: 'Domínio em ' + t.label, text: t.ok + ' de ' + t.total + ' acertos neste tópico.' }));
    if (sum.streak >= 3) list.push({ icon: 'flame', title: sum.streak + ' dias seguidos de estudo', text: 'Constância é o que transforma conteúdo em fluência.' });
    if (user.savedLexicon.length) list.push({ icon: 'bookmark', title: user.savedLexicon.length + ' chunks salvos no caderno', text: 'Seu repertório pessoal para revisão está crescendo.' });
    return list;
  }

  /* =========================================================
   * GRÁFICO RADAR (SVG)
   * ========================================================= */
  function radar(list) {
    const cx = 200, cy = 150, R = 105;
    const pts = list.map((a, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / list.length;
      const v = (a.value || 0) / 100;
      return { x: cx + Math.cos(ang) * R * v, y: cy + Math.sin(ang) * R * v, lx: cx + Math.cos(ang) * (R + 14), ly: cy + Math.sin(ang) * (R + 18), anchor: Math.abs(Math.cos(ang)) < 0.1 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end', ax: cx + Math.cos(ang) * R, ay: cy + Math.sin(ang) * R, a };
    });
    const ring = (f) => pts.map((p) => `${cx + (p.ax - cx) * f},${cy + (p.ay - cy) * f}`).join(' ');
    const shortLbl = ['Leitura', 'Vocabulário', 'Estruturas', 'Constância'];
    return `<svg class="radar" viewBox="0 0 400 300" role="img" aria-label="Gráfico de evolução: ${list.map((a) => a.label + ' ' + (a.value == null ? 'sem dados' : a.value + '%')).join(', ')}">
      ${[0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${ring(f)}" fill="none" stroke="#E6E2F2" stroke-width="1.5"/>`).join('')}
      ${pts.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.ax}" y2="${p.ay}" stroke="#E6E2F2" stroke-width="1.5"/>`).join('')}
      <polygon class="radar__shape" points="${pts.map((p) => p.x + ',' + p.y).join(' ')}" fill="rgba(98,70,234,.18)" stroke="#6246EA" stroke-width="3" stroke-linejoin="round"/>
      ${pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="5.5" fill="${p.a.color}" stroke="#fff" stroke-width="2"/>`).join('')}
      ${pts.map((p, i) => `<text x="${p.lx}" y="${p.ly + 4}" text-anchor="${p.anchor}" font-family="Nunito, Arial, sans-serif" font-size="15" font-weight="800" fill="#2A1252">${shortLbl[i]}</text>`).join('')}
    </svg>`;
  }

  function areaBars(list) {
    return `<ul class="area-bars">${list.map((a) => `
      <li>
        <div class="area-bars__top"><strong>${esc(a.label)}</strong><span>${a.value == null ? 'sem dados' : a.value + '%'}</span></div>
        <span class="bar"><span class="bar__fill" style="--w:${a.value || 0}%;background:${a.color}"></span></span>
        <small class="muted">${esc(a.detail)}</small>
      </li>`).join('')}</ul>`;
  }

  /* =========================================================
   * TELA DO PERFIL
   * ========================================================= */
  function render(main) {
    const user = SH.store.currentUser();
    if (user.role === 'teacher') { location.replace('#/teacher'); return; }
    SH.shell.setActive('profile', 'Perfil Cognitivo');
    const sum = SH.store.summary(user);
    const ar = areas(user);
    const ach = achievements(user);
    const history = [
      ...sum.attempts.map((a) => ({ date: a.date, title: C().unit(a.unitId).title, kind: 'Leitura', score: a.score + '/' + a.total, xp: a.xp, href: '#/reading/' + a.unitId + '/result/' + a.id })),
      ...Object.entries(user.progress.games || {}).flatMap(([id, g]) => g.history.map((h) => ({ date: h.date, title: C().game(id).title, kind: 'Jogo', score: h.score + '/' + h.total, xp: h.xp, href: '#/games/' + id }))),
    ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

    main.innerHTML = `
      <div class="page">
        <header class="profile-head card">
          <span class="avatar avatar--lg" aria-hidden="true">${esc(SH.util.initials(user.name))}</span>
          <div class="profile-head__txt">
            <p class="eyebrow">Módulo 5 · Perfil Cognitivo</p>
            <h1 class="page-title">${esc(user.name)}</h1>
            <p class="muted">Nível ${esc(user.level)} · ${esc(SH.labels.GOALS[user.goal] || '')} · ${esc(SH.labels.LOCATIONS[user.location] || '')} · no Students Hub desde ${SH.util.fmtDate(user.createdAt)}</p>
          </div>
          <div class="profile-head__kpis">
            <span><strong>${sum.xp}</strong><small>XP</small></span>
            <span><strong>${sum.streak}</strong><small>dias seguidos</small></span>
            <span><strong>${sum.accuracy == null ? '–' : sum.accuracy + '%'}</strong><small>acerto em leitura</small></span>
          </div>
        </header>

        <section class="card">
          <div class="card__head"><h2 class="card__title">Indicadores de evolução</h2><span class="muted small">Atualizados a cada leitura e partida</span></div>
          <div class="evo">${radar(ar)}${areaBars(ar)}</div>
        </section>

        <div class="grid-2">
          <section class="card card--ok">
            <h2 class="card__title">O que você já conquistou</h2>
            ${ach.length ? `<ul class="feed">${ach.map((a) => `<li class="feed__item"><span class="feed__icon feed__icon--ok">${SH.icon(a.icon)}</span><span><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></span></li>`).join('')}</ul>`
              : '<div class="empty"><p><strong>Sua primeira conquista está a uma atividade de distância.</strong></p><p class="muted">Faça uma leitura guiada ou uma partida na Arena.</p></div>'}
          </section>
          <section class="card card--attn">
            <h2 class="card__title">Pontos de atenção e próximos passos</h2>
            ${sum.attention.length ? `<ul class="attn-list">${sum.attention.slice(0, 5).map((t) => `
              <li class="attn">
                <div class="attn__top"><strong>${esc(t.label)}</strong><span class="score score--${t.rate >= 0.5 ? 'mid' : 'low'}">${t.ok}/${t.total}</span></div>
                <span class="bar bar--thin"><span class="bar__fill" style="--w:${Math.round(t.rate * 100)}%;background:var(--attn-line)"></span></span>
                <div class="attn__links"><span class="muted small">Praticar agora:</span>${practiceLinks(user, t.id).map((l) => `<a class="btn btn--soft btn--sm" href="${l.href}">${SH.icon(l.icon)}${l.label}</a>`).join('')}</div>
              </li>`).join('')}</ul>`
              : `<div class="empty"><p><strong>Nenhum ponto de atenção no momento.</strong></p><p class="muted">${sum.attempts.length ? 'Seus resultados estão consistentes. Siga no seu ritmo.' : 'Os pontos de atenção aparecem depois das primeiras atividades.'}</p></div>`}
          </section>
        </div>

        <section class="card">
          <div class="card__head"><h2 class="card__title">Histórico recente</h2></div>
          ${history.length ? `<ul class="activity">${history.map((h) => `
            <li class="activity__item">
              <span class="tag ${h.kind === 'Jogo' ? 'tag--q' : ''}">${h.kind}</span>
              <span class="activity__main"><a href="${h.href}">${esc(h.title)}</a><small>${SH.util.fmtDateTime(h.date)}</small></span>
              <span class="score score--ok">${h.score}</span><span class="activity__xp">+${h.xp} XP</span>
            </li>`).join('')}</ul>` : '<p class="muted">Seu histórico aparece aqui depois da primeira atividade.</p>'}
        </section>
      </div>`;
  }

  SH.diagnosis = { areas, practiceLinks, achievements, radar, areaBars };
  SH.profile = { render };
})(window.SH);

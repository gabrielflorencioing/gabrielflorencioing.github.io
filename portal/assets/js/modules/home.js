/* Students Hub · Início: painel do aluno (validação positiva primeiro) e visão rápida do professor */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2'];
  const ATTN_TIPS = [
    'Um ajuste fino aqui destrava muita coisa.',
    'Uma revisão curta já faz diferença.',
    'Ótimo tema para levar à próxima aula.',
  ];

  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  /** Próxima unidade sugerida: primeiro o nível do aluno, depois os vizinhos; se tudo feito, a de menor nota */
  function nextUnit(user) {
    const units = SH.content.UNITS;
    const done = (u) => user.progress.readings[u.id] && user.progress.readings[u.id].attempts.length;
    const li = LEVEL_ORDER.indexOf(user.level);
    const weakAtLevel = units.find((u) => u.level === user.level && done(u) && user.progress.readings[u.id].bestScore < 7);
    const pendingAtLevel = units.find((u) => u.level === user.level && !done(u));
    if (!pendingAtLevel && weakAtLevel) return { unit: weakAtLevel, review: true, consolidate: true };
    const pending = units.filter((u) => !done(u))
      .sort((a, b) => Math.abs(LEVEL_ORDER.indexOf(a.level) - li) - Math.abs(LEVEL_ORDER.indexOf(b.level) - li)
        || LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
    if (pending.length) return { unit: pending[0], review: false };
    const worst = units.slice().sort((a, b) => user.progress.readings[a.id].bestScore - user.progress.readings[b.id].bestScore)[0];
    return { unit: worst, review: true };
  }

  /** Unidade mais recente em que o aluno errou um tópico */
  function unitForTopic(user, topicId) {
    const attempts = Object.values(user.progress.readings).flatMap((r) => r.attempts)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const hit = attempts.find((a) => a.answers.some((x) => x.cat === topicId && !x.ok));
    return hit ? SH.content.unit(hit.unitId) : null;
  }

  function achievements(user, sum) {
    const list = [];
    Object.entries(user.progress.readings).forEach(([id, r]) => {
      const u = SH.content.unit(id);
      if (!u || !r.attempts.length) return;
      if (r.bestScore === 10) list.push({ icon: 'star', title: 'Gabaritou "' + u.title + '"', text: '10 de 10 na avaliação diagnóstica. Domínio completo do texto.' });
      else list.push({ icon: 'check', title: 'Concluiu "' + u.title + '"', text: 'Melhor resultado: ' + r.bestScore + ' de 10, nível ' + u.level + '.' });
    });
    sum.strengths.slice(0, 3).forEach((t) => list.push({
      icon: 'target', title: 'Domínio em ' + t.label,
      text: t.ok + ' de ' + t.total + ' acertos nas questões deste tópico.',
    }));
    if (sum.streak >= 3) list.push({ icon: 'flame', title: sum.streak + ' dias seguidos de estudo', text: 'Constância é o que transforma conteúdo em fluência.' });
    return list;
  }

  function weekStrip(user) {
    const set = new Set(user.progress.activityDays);
    const names = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push({ label: i === 0 ? 'hoje' : names[d.getDay()], on: set.has(SH.util.dayKey(d)), today: i === 0 });
    }
    return `<ol class="week" aria-label="Dias com estudo nos últimos 7 dias">
      ${days.map((d) => `<li class="week__day ${d.on ? 'is-on' : ''} ${d.today ? 'is-today' : ''}">
        <span class="week__dot" aria-hidden="true">${d.on ? SH.icon('check') : ''}</span>
        <span class="week__lbl">${d.label}</span><span class="sr-only">${d.on ? ': estudou' : ': sem estudo'}</span></li>`).join('')}
    </ol>`;
  }

  function renderStudent(main, user) {
    const sum = SH.store.summary(user);
    const nx = nextUnit(user);
    const ach = achievements(user, sum);
    const goal = SH.labels.GOALS[user.goal] || '';
    const total = SH.content.UNITS.length;

    main.innerHTML = `
      <div class="page">
        <section class="hero-card">
          <div class="hero-card__txt">
            <p class="eyebrow">${greeting()}, ${esc(SH.util.firstName(user.name))}</p>
            <h1 class="page-title">${sum.unitsDone ? 'Olha o quanto você já construiu.' : 'Vamos dar o primeiro passo juntos?'}</h1>
            <p class="lead">Nível ${esc(user.level)} · foco em ${esc(goal.toLowerCase())}. ${nx.consolidate ? 'Antes de subir de nível, vale consolidar esta leitura do seu nível atual.' : nx.review ? 'Você concluiu todas as leituras disponíveis: que tal elevar sua melhor nota?' : 'Sua próxima leitura já está separada.'}</p>
            <a class="btn btn--primary" href="#/reading/${nx.unit.id}">
              ${nx.review ? 'Revisar' : 'Começar'}: ${esc(nx.unit.title)} ${SH.icon('arrowRight')}
            </a>
          </div>
          <div class="hero-card__art">${SH.illus(nx.unit.illus)}</div>
        </section>

        <section class="stats" aria-label="Seus números">
          <div class="stat"><span class="stat__icon stat__icon--yel">${SH.icon('star')}</span><span class="stat__num" data-count="${sum.xp}">0</span><span class="stat__lbl">XP acumulado</span></div>
          <div class="stat"><span class="stat__icon stat__icon--coral">${SH.icon('flame')}</span><span class="stat__num" data-count="${sum.streak}">0</span><span class="stat__lbl">${sum.streak === 1 ? 'dia seguido' : 'dias seguidos'}</span></div>
          <div class="stat"><span class="stat__icon stat__icon--mint">${SH.icon('book')}</span><span class="stat__num"><span data-count="${sum.unitsDone}">0</span><small>/${total}</small></span><span class="stat__lbl">leituras concluídas</span></div>
          <div class="stat"><span class="stat__icon stat__icon--lil">${SH.icon('target')}</span><span class="stat__num">${sum.accuracy == null ? '<small>sem dados</small>' : `<span data-count="${sum.accuracy}">0</span><small>%</small>`}</span><span class="stat__lbl">taxa média de acerto</span></div>
        </section>

        <section class="card">
          <div class="card__head"><h2 class="card__title">Sua constância nesta semana</h2><span class="muted">${user.progress.lastActiveAt ? 'Último estudo: ' + SH.util.relDays(user.progress.lastActiveAt) : 'Nenhum estudo registrado ainda'}</span></div>
          ${weekStrip(user)}
        </section>

        <div class="grid-2">
          <section class="card card--ok">
            <div class="card__head"><h2 class="card__title">O que você já conquistou</h2></div>
            ${ach.length ? `<ul class="feed">${ach.slice(0, 5).map((a) => `
              <li class="feed__item"><span class="feed__icon feed__icon--ok">${SH.icon(a.icon)}</span>
              <span><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></span></li>`).join('')}</ul>` : `
              <div class="empty"><p><strong>Sua primeira conquista está a uma leitura de distância.</strong></p>
              <p class="muted">Cada texto concluído, cada acerto e cada dia de estudo aparece aqui.</p></div>`}
          </section>

          <section class="card card--attn">
            <div class="card__head"><h2 class="card__title">Pontos de atenção e próximos passos</h2></div>
            ${sum.attention.length ? `<ul class="feed">${sum.attention.slice(0, 3).map((t, i) => {
              const u = unitForTopic(user, t.id);
              return `<li class="feed__item feed__item--action">
                <span class="feed__icon feed__icon--attn">${SH.icon('compass')}</span>
                <span><strong>${esc(t.label)}</strong><small>Em construção: ${t.ok} de ${t.total} acertos até agora. ${ATTN_TIPS[i % ATTN_TIPS.length]}</small></span>
                ${u ? `<a class="btn btn--sm btn--soft" href="#/reading/${u.id}/quiz">Praticar agora</a>` : ''}
              </li>`;
            }).join('')}</ul>
            <p class="muted small">Na Etapa 4, cada ponto de atenção também abre o mapa mental e o jogo correspondentes.</p>` : `
              <div class="empty"><p><strong>Nenhum ponto de atenção no momento.</strong></p>
              <p class="muted">${sum.attempts.length ? 'Seus resultados estão consistentes. Continue no seu ritmo.' : 'Depois da primeira avaliação, este painel mostra com carinho onde vale focar.'}</p></div>`}
          </section>
        </div>

        <section class="card">
          <div class="card__head"><h2 class="card__title">Atividade recente</h2><a class="link" href="#/reading">Ver todas as trilhas</a></div>
          ${sum.attempts.length ? `<ul class="activity">${sum.attempts.slice(0, 5).map((a) => {
            const u = SH.content.unit(a.unitId);
            return `<li class="activity__item">
              <span class="lvl lvl--${u.level}">${u.level}</span>
              <span class="activity__main"><a href="#/reading/${u.id}/quiz">${esc(u.title)}</a><small>${SH.util.fmtDateTime(a.date)}${a.first ? '' : ' · nova tentativa'}</small></span>
              <span class="score ${a.score >= 8 ? 'score--ok' : a.score >= 6 ? 'score--mid' : 'score--low'}">${a.score}/${a.total}</span>
              <span class="activity__xp">+${a.xp} XP</span>
            </li>`;
          }).join('')}</ul>` : '<div class="empty"><p class="muted">Suas avaliações vão aparecer aqui, com nota e XP.</p></div>'}
        </section>
      </div>`;

    main.querySelectorAll('[data-count]').forEach((el) => SH.util.countUp(el, Number(el.dataset.count)));
  }

  function renderTeacher(main, user) {
    const studs = SH.store.students();
    const rows = studs.map((s) => {
      const sum = SH.store.summary(s);
      const idle = s.progress.lastActiveAt ? SH.util.daysBetweenKeys(SH.util.dayKey(new Date(s.progress.lastActiveAt)), SH.util.dayKey()) : null;
      return { s, sum, idle };
    }).sort((a, b) => (b.idle == null ? 999 : b.idle) - (a.idle == null ? 999 : a.idle));
    const withAcc = rows.filter((r) => r.sum.accuracy != null);
    const avg = withAcc.length ? Math.round(withAcc.reduce((t, r) => t + r.sum.accuracy, 0) / withAcc.length) : null;
    const inactive = rows.filter((r) => r.idle == null || r.idle > 5).length;

    main.innerHTML = `
      <div class="page">
        <section class="hero-card hero-card--teacher">
          <div class="hero-card__txt">
            <p class="eyebrow">${greeting()}, ${esc(SH.util.firstName(user.name))}</p>
            <h1 class="page-title">Sua turma em um olhar.</h1>
            <p class="lead">Resumo rápido de quem está avançando e de quem precisa de um empurrão. O dossiê completo, o cruzamento de erros e o gerador de pauta chegam na Central do Professor.</p>
          </div>
          <div class="hero-card__art">${SH.illus('meeting')}</div>
        </section>

        <section class="stats" aria-label="Indicadores da turma">
          <div class="stat"><span class="stat__icon stat__icon--lil">${SH.icon('users')}</span><span class="stat__num" data-count="${studs.length}">0</span><span class="stat__lbl">alunos cadastrados</span></div>
          <div class="stat"><span class="stat__icon stat__icon--mint">${SH.icon('target')}</span><span class="stat__num">${avg == null ? '<small>sem dados</small>' : `<span data-count="${avg}">0</span><small>%</small>`}</span><span class="stat__lbl">acerto médio da turma</span></div>
          <div class="stat"><span class="stat__icon stat__icon--coral">${SH.icon('alert')}</span><span class="stat__num" data-count="${inactive}">0</span><span class="stat__lbl">há mais de 5 dias sem praticar</span></div>
        </section>

        <section class="card">
          <div class="card__head"><h2 class="card__title">Alunos</h2><span class="muted">${studs.length} ${studs.length === 1 ? 'conta' : 'contas'} neste navegador</span></div>
          <ul class="students">
            ${rows.map(({ s, sum, idle }) => `
              <li class="student">
                <span class="avatar avatar--${s.id === SH.store.demoIds.renan ? 'renan' : 'julia'}" aria-hidden="true">${esc(SH.util.initials(s.name))}</span>
                <div class="student__main">
                  <strong>${esc(s.name)}</strong>
                  <small>${esc(SH.labels.GOALS[s.goal] || '')} · ${esc(SH.labels.LOCATIONS[s.location] || '')}</small>
                  ${sum.attention.length ? `<span class="chip chip--attn">Atenção: ${esc(sum.attention[0].label)}</span>` : sum.attempts.length ? '<span class="chip chip--ok">Sem pontos críticos</span>' : '<span class="chip">Ainda sem avaliações</span>'}
                </div>
                <div class="student__meta">
                  <span class="lvl lvl--${s.level}">${s.level}</span>
                  <span class="student__kv"><strong>${sum.xp}</strong><small>XP</small></span>
                  <span class="student__kv"><strong>${sum.accuracy == null ? '–' : sum.accuracy + '%'}</strong><small>acerto</small></span>
                  <span class="student__kv ${idle == null || idle > 5 ? 'is-alert' : ''}">
                    <strong>${idle == null ? 'nunca' : idle === 0 ? 'hoje' : idle + 'd'}</strong><small>${idle == null || idle > 5 ? 'inativo' : 'último estudo'}</small>
                  </span>
                </div>
              </li>`).join('')}
          </ul>
        </section>
      </div>`;
    main.querySelectorAll('[data-count]').forEach((el) => SH.util.countUp(el, Number(el.dataset.count)));
  }

  SH.home = {
    render(main) {
      const user = SH.store.currentUser();
      SH.shell.setActive('home', 'Início');
      if (user.role === 'teacher') renderTeacher(main, user); else renderStudent(main, user);
    },
    nextUnit,
  };
})(window.SH);

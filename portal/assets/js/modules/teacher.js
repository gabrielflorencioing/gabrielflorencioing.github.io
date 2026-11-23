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
        </div>
        <button class="btn btn--primary" data-register>${SH.icon('plus')}Cadastrar aluno</button></header>
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
    main.querySelector('[data-register]').addEventListener('click', () => registerModal(main));
  }

  /* =========================================================
   * CADASTRO DE ALUNO E CREDENCIAIS INDIVIDUAIS
   * ========================================================= */

  function registerModal(main) {
    const goals = Object.entries(SH.labels.GOALS).filter(([k]) => k !== 'teaching');
    const m = U.modal({
      title: 'Cadastrar novo aluno',
      html: `
        <p class="muted">Defina o login e a senha individuais. Depois do cadastro você recebe a mensagem pronta ${SH.backend.cloud ? 'com o endereço do portal' : 'e o link de acesso'} para enviar ao aluno.</p>
        <form class="form form--tight" id="rg-form" novalidate>
          <div class="field" data-field="rg-name"><label for="rg-name">Nome completo</label><input id="rg-name" autocomplete="off" maxlength="80"><p class="field__error" role="alert"></p></div>
          <div class="field" data-field="rg-email"><label for="rg-email">E-mail (login do aluno)</label><input id="rg-email" type="email" inputmode="email" autocomplete="off"><p class="field__error" role="alert"></p></div>
          <div class="field" data-field="rg-pass"><label for="rg-pass">Senha inicial</label>
            <div class="pass-row"><input id="rg-pass" type="text" autocomplete="off" value="${U.generatePassword()}" spellcheck="false"><button type="button" class="btn btn--ghost btn--sm" data-gen>${SH.icon('refresh')}Gerar outra</button></div>
            <p class="field__hint">Mínimo de 6 caracteres. Você pode digitar uma senha própria.</p><p class="field__error" role="alert"></p></div>
          <div class="form__row">
            <div class="field"><label for="rg-level">Nível</label><select id="rg-level">${Object.values(C().LEVELS).map((l) => `<option value="${l.code}">${l.name}</option>`).join('')}</select></div>
            <div class="field"><label for="rg-loc">Onde mora</label><select id="rg-loc">${Object.entries(SH.labels.LOCATIONS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="rg-goal">Objetivo principal</label><select id="rg-goal">${goals.map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
          <label class="switch"><input type="checkbox" id="rg-change" checked><span class="switch__track" aria-hidden="true"></span><span>Pedir ao aluno para criar a própria senha no primeiro acesso</span></label>
        </form>`,
      actions: [
        { label: 'Cancelar', variant: 'ghost' },
        {
          label: 'Cadastrar aluno', variant: 'primary',
          onClick: (close) => {
            const f = m.el.querySelector('#rg-form');
            const val = (id) => f.querySelector('#' + id).value.trim();
            const err = (id, msg) => {
              const w = f.querySelector(`[data-field="${id}"]`);
              w.classList.toggle('has-error', !!msg); w.querySelector('.field__error').textContent = msg || '';
            };
            ['rg-name', 'rg-email', 'rg-pass'].forEach((id) => err(id, ''));
            const name = val('rg-name'), email = val('rg-email'), password = val('rg-pass');
            let bad = false;
            if (name.split(/\s+/).filter(Boolean).length < 2) { err('rg-name', 'Digite nome e sobrenome.'); bad = true; }
            if (!U.isEmail(email)) { err('rg-email', 'Digite um e-mail válido.'); bad = true; }
            else if (SH.store.findByEmail(email)) { err('rg-email', 'Já existe uma conta com este e-mail.'); bad = true; }
            const submit = m.el.querySelector('.modal__foot .btn--primary');
            if (password.length < 6) { err('rg-pass', 'A senha precisa ter pelo menos 6 caracteres.'); bad = true; }
            if (bad) return false;
            const mustChange = f.querySelector('#rg-change').checked;
            submit.disabled = true; submit.textContent = 'Cadastrando...';
            SH.backend.createStudent({
              name, email, password, mustChange,
              level: val('rg-level'), goal: val('rg-goal'), location: val('rg-loc'),
            }).catch(() => ({ ok: false, message: 'Sem conexão com o servidor. Verifique sua internet.' })).then((res) => {
              submit.disabled = false; submit.textContent = 'Cadastrar aluno';
              if (!res.ok) { err(res.reason === 'exists' ? 'rg-email' : 'rg-pass', res.message); return; }
              close();
              renderOverview(main);
              if (res.user) setTimeout(() => showAccess(res.user.id, password, 'Aluno cadastrado', res.needsConfirm), 260);
            });
            return false;
          },
        },
      ],
    });
    m.el.querySelector('[data-gen]').addEventListener('click', () => { m.el.querySelector('#rg-pass').value = U.generatePassword(); });
    m.el.querySelector('#rg-form').addEventListener('input', (e) => {
      const w = e.target.closest('[data-field]');
      if (w) { w.classList.remove('has-error'); w.querySelector('.field__error').textContent = ''; }
    });
    setTimeout(() => m.el.querySelector('#rg-name').focus(), 60);
  }

  /** Mostra as credenciais e o link de acesso individual, com mensagem pronta para enviar */
  function showAccess(id, password, title = 'Acesso do aluno', needsConfirm = false) {
    const s = SH.store.getUser(id);
    const cloud = SH.backend.cloud;
    const link = SH.backend.accessLink(id);
    const msg = 'Olá, ' + U.firstName(s.name) + '! Seu acesso ao Students Hub, o portal do aluno da Mentoria Gabriel Florencio, está pronto.\n\n' +
      (needsConfirm ? '0. Antes de tudo, confirme seu e-mail pelo link que você vai receber.\n' : '') +
      '1. Abra o portal no seu celular ou computador: ' + link + '\n' +
      '2. Entre com o e-mail: ' + s.email + '\n' +
      (password ? '3. Senha: ' + password + '\n' : '3. Use a senha que combinamos.\n') +
      (s.mustChangePassword ? '\nNo primeiro acesso, você vai criar uma senha só sua.' : '') + '\n\nBons estudos!';
    const copy = (text, ok) => {
      const done = () => U.toast(ok, 'ok');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
      else fallbackCopy(text, done);
    };
    const m = U.modal({
      title,
      html: `
        <ul class="kv cred">
          <li><span>Aluno</span><strong>${esc(s.name)}</strong></li>
          <li><span>Login (e-mail)</span><strong>${esc(s.email)}</strong></li>
          <li><span>Senha</span><strong class="cred__pass">${password ? esc(password) : 'não exibida (já definida)'}</strong></li>
        </ul>
        <div class="field"><label for="acc-link">${cloud ? 'Endereço do portal' : 'Link de acesso individual'}</label><input id="acc-link" readonly value="${esc(link)}"></div>
        <p class="note">${SH.icon('info')}<span>${cloud
          ? 'O aluno entra pelo endereço do portal, em qualquer aparelho, com o e-mail e a senha acima. Tudo o que ele fizer aparece no seu painel.'
          : 'Envie o link ao aluno. Ao abri-lo, a conta dele é ativada no aparelho e ele entra com o e-mail e a senha acima.'} ${password ? 'Anote a senha agora: por segurança ela fica guardada apenas de forma criptografada e não aparece de novo.' : ''}</span></p>
        ${needsConfirm ? `<p class="note note--warn">${SH.icon('alert')}<span>A confirmação de e-mail está ativa no Supabase: o aluno precisa clicar no e-mail de confirmação antes do primeiro login. Para dispensar isso, desative "Confirm email" em Authentication, Providers, Email.</span></p>` : ''}
        ${!cloud && location.protocol === 'file:' ? `<p class="note note--warn">${SH.icon('alert')}<span>O portal está aberto como arquivo no seu computador, então este link só funciona aqui. Publique a pasta do portal online (GitHub Pages, Netlify ou Vercel) para o link abrir no aparelho do aluno.</span></p>` : ''}
        <a class="btn btn--ghost btn--sm wa-link" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>`,
      actions: [
        { label: 'Copiar link', variant: 'ghost', onClick: () => { copy(link, 'Link copiado.'); return false; } },
        { label: 'Copiar mensagem para o aluno', variant: 'primary', onClick: () => { copy(msg, 'Mensagem com login, senha e link copiada.'); return false; } },
      ],
    });
    m.el.querySelector('#acc-link').addEventListener('focus', (e) => e.target.select());
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
          <div class="card__head"><h2 class="card__title">${SH.icon('user')}Acesso do aluno</h2><span class="muted small">${s.createdBy === 'teacher' ? 'Cadastrado pelo professor' : s.demo ? 'Conta de demonstração' : 'Cadastro feito pelo aluno'}</span></div>
          <ul class="kv">
            <li><span>Login (e-mail)</span><strong>${esc(s.email)}</strong></li>
            <li><span>Senha</span><strong>${s.mustChangePassword ? 'Temporária, aguardando o aluno criar a dele' : s.passwordIssuedAt ? 'Definida em ' + U.fmtDate(s.passwordIssuedAt) : 'Definida'}</strong></li>
          </ul>
          <div class="access-actions">
            <button class="btn btn--soft btn--sm" data-acc="link">${SH.icon('arrowRight')}${SH.backend.cloud ? 'Ver dados de acesso' : 'Gerar link de acesso'}</button>
            <button class="btn btn--soft btn--sm" data-acc="reset">${SH.icon('refresh')}Redefinir senha</button>
            <button class="btn btn--ghost btn--sm btn--danger" data-acc="remove">${SH.icon('close')}Remover aluno</button>
          </div>
        </section>

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
    main.querySelectorAll('[data-acc]').forEach((b) => b.addEventListener('click', () => {
      const act = b.dataset.acc;
      if (act === 'link') showAccess(s.id, null);
      if (act === 'reset') {
        const pw = U.generatePassword();
        U.modal({
          title: 'Redefinir senha',
          html: `<p>Uma nova senha temporária será criada para <strong>${esc(s.name)}</strong>. A senha atual deixa de funcionar e o aluno cria uma senha pessoal no próximo acesso.</p>`,
          actions: [
            { label: 'Cancelar', variant: 'ghost' },
            { label: 'Gerar nova senha', variant: 'primary', onClick: (close) => {
              SH.backend.resetStudentPassword(s.id, pw).catch(() => ({ ok: false, message: 'Sem conexão com o servidor.' })).then((r) => {
                if (!r.ok) { U.toast(r.message, 'err'); return; }
                close(); renderDossier(main, s.id); setTimeout(() => showAccess(s.id, pw, 'Nova senha gerada'), 260);
              });
              return false;
            } },
          ],
        });
      }
      if (act === 'remove') {
        U.modal({
          title: 'Remover aluno',
          html: `<p>A conta de <strong>${esc(s.name)}</strong> e todo o histórico dela serão apagados deste navegador. Isso não pode ser desfeito.</p><p class="note note--warn">${SH.icon('alert')}<span>Se quiser guardar o histórico, use "Exportar Dados (JSON)" no menu antes de remover.</span></p>`,
          actions: [
            { label: 'Cancelar', variant: 'ghost' },
            { label: 'Remover definitivamente', variant: 'danger', onClick: (close) => {
              SH.backend.removeStudent(s.id).catch(() => ({ ok: false, message: 'Sem conexão com o servidor.' })).then((r) => {
                if (!r.ok) { U.toast(r.message || 'Não foi possível remover.', 'err'); return; }
                close(); U.toast('Aluno removido.', 'info'); location.hash = '#/teacher';
              });
              return false;
            } },
          ],
        });
      }
    }));
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

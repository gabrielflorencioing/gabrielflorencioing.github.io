/* Students Hub · Módulo 6: Agenda, Tarefas e Caderno de Aula */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const U = SH.util;

  const EVENT_TYPES = {
    class: { label: 'Aula com o Gabriel', cls: 'ev--class' },
    deadline: { label: 'Prazo de tarefa', cls: 'ev--deadline' },
    reminder: { label: 'Lembrete', cls: 'ev--reminder' },
  };
  const PRIORITIES = { high: 'Alta', medium: 'Média', low: 'Baixa' };
  const WEEK = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const ui = { month: null, taskFilter: 'open', selDay: null };

  const user = () => SH.store.currentUser();
  const save = (fn) => SH.store.updateUser(user().id, fn);

  function render(main, tab = 'calendar') {
    SH.shell.setActive('agenda', 'Agenda e Caderno');
    const tabs = [['calendar', 'Agenda', 'calendar'], ['tasks', 'Tarefas', 'check'], ['notes', 'Caderno', 'book']];
    if (!tabs.some((t) => t[0] === tab)) tab = 'calendar';
    main.innerHTML = `
      <div class="page">
        <header class="page-head"><div>
          <p class="eyebrow">Módulo 6 · Organização autônoma</p>
          <h1 class="page-title">Agenda, Tarefas e Caderno</h1>
          <p class="lead">Planeje a semana, acompanhe seu plano de ação e registre dúvidas e descobertas para levar à aula.</p>
        </div></header>
        <div class="steps steps--static" role="tablist" aria-label="Ferramentas">
          ${tabs.map(([id, label, icon]) => `<a class="steps__item ${tab === id ? 'is-active' : ''}" role="tab" aria-selected="${tab === id}" href="#/agenda/${id}">${SH.icon(icon)}<span>${label}</span></a>`).join('')}
        </div>
        <div id="agenda-body"></div>
      </div>`;
    const body = main.querySelector('#agenda-body');
    if (tab === 'tasks') renderTasks(body);
    else if (tab === 'notes') renderNotes(body);
    else renderCalendar(body);
  }

  /* ---------- Agenda ---------- */
  function renderCalendar(body) {
    const u = user();
    const now = new Date();
    if (!ui.month) ui.month = new Date(now.getFullYear(), now.getMonth(), 1);
    const m = ui.month;
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const byDay = {};
    u.events.forEach((e) => { (byDay[e.date] = byDay[e.date] || []).push(e); });
    const today = U.dayKey();
    const sorted = u.events.slice().sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
    const upcoming = sorted.filter((e) => e.date >= today);
    const past = sorted.filter((e) => e.date < today).reverse();
    const shown = ui.selDay ? sorted.filter((e) => e.date === ui.selDay) : upcoming;

    const evItem = (e) => `
      <li class="ev ${EVENT_TYPES[e.type].cls}">
        <span class="ev__date"><strong>${Number(e.date.slice(8))}</strong><small>${MONTHS[Number(e.date.slice(5, 7)) - 1].slice(0, 3).toLowerCase()}</small></span>
        <span class="ev__main"><strong>${esc(e.title)}</strong><small>${EVENT_TYPES[e.type].label} · ${esc(e.time)}${e.note ? ' · ' + esc(e.note) : ''}</small></span>
        <button class="icon-btn icon-btn--sm" data-del-ev="${e.id}" aria-label="Excluir compromisso ${esc(e.title)}">${SH.icon('close')}</button>
      </li>`;

    body.innerHTML = `
      <div class="agenda-grid">
        <section class="card">
          <div class="cal__head">
            <button class="icon-btn" data-month="-1" aria-label="Mês anterior">${SH.icon('arrowLeft')}</button>
            <h2 class="card__title">${MONTHS[m.getMonth()]} ${m.getFullYear()}</h2>
            <button class="icon-btn" data-month="1" aria-label="Próximo mês">${SH.icon('arrowRight')}</button>
          </div>
          <div class="cal" role="grid" aria-label="Calendário">
            ${WEEK.map((w) => `<span class="cal__wd" role="columnheader">${w}</span>`).join('')}
            ${Array(first.getDay()).fill('<span class="cal__pad"></span>').join('')}
            ${Array.from({ length: days }, (_, i) => {
              const key = U.dayKey(new Date(m.getFullYear(), m.getMonth(), i + 1));
              const evs = byDay[key] || [];
              return `<button class="cal__day ${key === today ? 'is-today' : ''} ${ui.selDay === key ? 'is-sel' : ''}" data-day="${key}" aria-label="${i + 1} de ${MONTHS[m.getMonth()]}${evs.length ? ', ' + evs.length + ' compromisso(s)' : ''}">
                <span>${i + 1}</span><span class="cal__dots">${evs.slice(0, 3).map((e) => `<i class="${EVENT_TYPES[e.type].cls}"></i>`).join('')}</span></button>`;
            }).join('')}
          </div>
          <ul class="legend-row">${Object.values(EVENT_TYPES).map((t) => `<li><i class="${t.cls}"></i>${t.label}</li>`).join('')}</ul>
        </section>

        <section class="card">
          <h2 class="card__title">Novo compromisso</h2>
          <form class="form form--tight" id="ev-form" novalidate>
            <div class="field"><label for="ev-title">Título</label><input id="ev-title" name="title" required maxlength="80" placeholder="Ex.: Aula sobre condicionais"></div>
            <div class="form__row">
              <div class="field"><label for="ev-date">Data</label><input id="ev-date" name="date" type="date" required value="${ui.selDay || today}"></div>
              <div class="field"><label for="ev-time">Horário</label><input id="ev-time" name="time" type="time" required value="19:00"></div>
            </div>
            <div class="field"><label for="ev-type">Tipo</label><select id="ev-type" name="type">${Object.entries(EVENT_TYPES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('')}</select></div>
            <div class="field"><label for="ev-note">Observação (opcional)</label><input id="ev-note" name="note" maxlength="120" placeholder="Ex.: levar dúvidas do caderno"></div>
            <p class="field__error" id="ev-err" role="alert"></p>
            <button class="btn btn--primary" type="submit">${SH.icon('plus')}Adicionar à agenda</button>
          </form>
        </section>
      </div>

      <section class="card">
        <div class="card__head"><h2 class="card__title">${ui.selDay ? 'Compromissos em ' + U.fmtDate(U.keyToDate(ui.selDay)) : 'Próximos compromissos'}</h2>
          ${ui.selDay ? '<button class="link" data-clear-day>Ver todos os próximos</button>' : ''}</div>
        ${shown.length ? `<ul class="ev-list">${shown.map(evItem).join('')}</ul>` : '<p class="muted">Nada marcado por aqui. Use o formulário para planejar sua semana.</p>'}
        ${!ui.selDay && past.length ? `<details class="past"><summary>Compromissos anteriores (${past.length})</summary><ul class="ev-list">${past.map(evItem).join('')}</ul></details>` : ''}
      </section>`;

    body.querySelector('#ev-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const title = f.title.value.trim();
      if (!title || !f.date.value || !f.time.value) { body.querySelector('#ev-err').textContent = 'Preencha título, data e horário.'; return; }
      save((x) => x.events.push({ id: U.uid('ev'), title, date: f.date.value, time: f.time.value, type: f.type.value, note: f.note.value.trim() }));
      U.toast('Compromisso adicionado.', 'ok', 2200);
      const d = U.keyToDate(f.date.value);
      ui.month = new Date(d.getFullYear(), d.getMonth(), 1);
      renderCalendar(body);
    });
    body.onclick = (e) => {
      const t = e.target.closest('[data-month],[data-day],[data-del-ev],[data-clear-day]');
      if (!t) return;
      if (t.dataset.month) ui.month = new Date(m.getFullYear(), m.getMonth() + Number(t.dataset.month), 1);
      if (t.dataset.day) ui.selDay = ui.selDay === t.dataset.day ? null : t.dataset.day;
      if (t.hasAttribute('data-clear-day')) ui.selDay = null;
      if (t.dataset.delEv) save((x) => { x.events = x.events.filter((ev) => ev.id !== t.dataset.delEv); });
      renderCalendar(body);
    };
  }

  /* ---------- Tarefas ---------- */
  function renderTasks(body) {
    const u = user();
    const done = u.tasks.filter((t) => t.done).length;
    const order = { high: 0, medium: 1, low: 2 };
    const list = u.tasks
      .filter((t) => ui.taskFilter === 'all' || (ui.taskFilter === 'done' ? t.done : !t.done))
      .sort((a, b) => a.done - b.done || order[a.priority] - order[b.priority]);
    body.innerHTML = `
      <section class="card">
        <div class="card__head"><h2 class="card__title">Action Plan</h2><span class="muted">${done} de ${u.tasks.length} concluídas</span></div>
        <span class="bar"><span class="bar__fill" style="--w:${u.tasks.length ? (done / u.tasks.length) * 100 : 0}%"></span></span>
        <form class="task-form" id="task-form" novalidate>
          <label class="sr-only" for="task-title">Nova tarefa</label>
          <input id="task-title" name="title" maxlength="120" placeholder="Nova tarefa de estudo (ex.: ouvir o Word Bank da B1)">
          <label class="sr-only" for="task-pri">Prioridade</label>
          <select id="task-pri" name="priority">${Object.entries(PRIORITIES).map(([k, v]) => `<option value="${k}" ${k === 'medium' ? 'selected' : ''}>Prioridade ${v.toLowerCase()}</option>`).join('')}</select>
          <button class="btn btn--primary" type="submit">${SH.icon('plus')}Adicionar</button>
        </form>
        <div class="seg seg--sm seg--fit" role="group" aria-label="Filtrar tarefas">
          ${[['open', 'Abertas'], ['done', 'Concluídas'], ['all', 'Todas']].map(([k, v]) => `<button class="seg__btn ${ui.taskFilter === k ? 'is-active' : ''}" data-filter="${k}" aria-pressed="${ui.taskFilter === k}">${v}</button>`).join('')}
        </div>
        ${list.length ? `<ul class="tasks">${list.map((t) => `
          <li class="task ${t.done ? 'is-done' : ''}">
            <label class="task__check"><input type="checkbox" data-toggle="${t.id}" ${t.done ? 'checked' : ''}><span class="task__box" aria-hidden="true">${SH.icon('check')}</span><span class="task__title">${esc(t.title)}</span></label>
            <span class="pri pri--${t.priority}">${PRIORITIES[t.priority]}</span>
            <button class="icon-btn icon-btn--sm" data-del="${t.id}" aria-label="Excluir tarefa">${SH.icon('close')}</button>
          </li>`).join('')}</ul>` : `<p class="muted empty-line">${ui.taskFilter === 'done' ? 'Nenhuma tarefa concluída ainda. A primeira está logo ali.' : ui.taskFilter === 'open' ? 'Tudo em dia. Que tal adicionar o próximo passo?' : 'Nenhuma tarefa criada.'}</p>`}
      </section>`;

    body.querySelector('#task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = e.target.title.value.trim();
      if (!title) { e.target.title.focus(); return; }
      save((x) => x.tasks.push({ id: U.uid('tk'), title, priority: e.target.priority.value, done: false, createdAt: new Date().toISOString(), doneAt: null }));
      ui.taskFilter = ui.taskFilter === 'done' ? 'open' : ui.taskFilter;
      renderTasks(body);
      body.querySelector('#task-title').focus();
    });
    body.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => { ui.taskFilter = b.dataset.filter; renderTasks(body); }));
    body.querySelectorAll('[data-toggle]').forEach((c) => c.addEventListener('change', () => {
      save((x) => { const t = x.tasks.find((y) => y.id === c.dataset.toggle); t.done = c.checked; t.doneAt = c.checked ? new Date().toISOString() : null; });
      if (c.checked) U.toast('Tarefa concluída. Mais um passo dado!', 'ok', 2200);
      setTimeout(() => renderTasks(body), 250);
    }));
    body.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
      save((x) => { x.tasks = x.tasks.filter((y) => y.id !== b.dataset.del); });
      renderTasks(body);
    }));
  }

  /* ---------- Caderno ---------- */
  function renderNotes(body) {
    const u = user();
    const teacher = u.role === 'teacher';
    const notes = u.notebook.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const saved = u.savedLexicon.map((id) => C().lexItem(id)).filter(Boolean);
    const topics = Array.from(new Set(Object.values(C().TOPICS).map((t) => t.label)));
    body.innerHTML = `
      <div class="agenda-grid">
        <section class="card">
          <h2 class="card__title">Nova anotação</h2>
          <form class="form form--tight" id="note-form" novalidate>
            <div class="field"><label for="nt-title">Título</label><input id="nt-title" name="title" maxlength="90" required placeholder="Ex.: Quando uso since?"></div>
            <div class="field"><label for="nt-topic">Tópico</label><input id="nt-topic" name="topic" list="nt-topics" maxlength="60" placeholder="Escolha ou escreva"><datalist id="nt-topics">${topics.map((t) => `<option value="${esc(t)}">`).join('')}</datalist></div>
            <div class="field"><label for="nt-body">Dúvida ou descoberta</label><textarea id="nt-body" name="body" rows="5" maxlength="1200" required placeholder="Escreva com suas palavras. Pode misturar português e inglês."></textarea></div>
            ${teacher ? '' : '<label class="switch"><input type="checkbox" name="shared" checked><span class="switch__track" aria-hidden="true"></span><span>Compartilhar com o Professor Gabriel</span></label>'}
            <p class="field__error" id="nt-err" role="alert"></p>
            <button class="btn btn--primary" type="submit">${SH.icon('plus')}Salvar anotação</button>
          </form>
        </section>
        <section class="card">
          <div class="card__head"><h2 class="card__title">Chunks salvos do Léxico</h2><a class="link" href="#/lexicon">Ver Léxico</a></div>
          ${saved.length ? `<ul class="saved-list">${saved.map((it) => `
            <li><span class="saved-list__txt"><strong lang="en">${esc(it.en)}</strong><small>${esc(it.pt)}</small></span>
              <button class="icon-btn icon-btn--sm icon-btn--soft" data-say="${esc(it.en)}" aria-label="Ouvir">${SH.icon('sound')}</button>
              <button class="icon-btn icon-btn--sm" data-unsave="${it.id}" aria-label="Remover do caderno">${SH.icon('close')}</button></li>`).join('')}</ul>`
            : '<p class="muted">Use o botão "Salvar no Meu Caderno" no Léxico para montar seu repertório de revisão.</p>'}
        </section>
      </div>
      <section class="card">
        <div class="card__head"><h2 class="card__title">Minhas anotações</h2><span class="muted">${notes.filter((n) => n.shared).length} compartilhada(s) com o professor</span></div>
        ${notes.length ? `<ul class="notes">${notes.map((n) => `
          <li class="note-card ${n.shared ? 'is-shared' : ''}">
            <div class="note-card__head"><span class="tag">${esc(n.topic || 'Geral')}</span><small class="muted">${U.fmtDateTime(n.createdAt)}</small></div>
            <h3 class="note-card__title">${esc(n.title)}</h3>
            <p class="note-card__body">${esc(n.body)}</p>
            <div class="note-card__foot">
              ${teacher ? '' : `<label class="switch switch--sm"><input type="checkbox" data-share="${n.id}" ${n.shared ? 'checked' : ''}><span class="switch__track" aria-hidden="true"></span><span>${n.shared ? 'Compartilhada com o Gabriel' : 'Privada'}</span></label>`}
              <button class="link link--sm link--danger" data-del-note="${n.id}">Excluir</button>
            </div>
          </li>`).join('')}</ul>` : '<p class="muted">Nenhuma anotação ainda. Dúvidas registradas viram pauta da sua próxima aula.</p>'}
      </section>`;

    body.querySelector('#note-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const title = f.title.value.trim(), text = f.body.value.trim();
      if (!title || !text) { body.querySelector('#nt-err').textContent = 'Preencha o título e a anotação.'; return; }
      const iso = new Date().toISOString();
      save((x) => x.notebook.push({ id: U.uid('nt'), title, topic: f.topic.value.trim(), body: text, shared: !teacher && f.shared.checked, createdAt: iso, updatedAt: iso }));
      U.toast(!teacher && f.shared.checked ? 'Anotação salva e compartilhada com o professor.' : 'Anotação salva.', 'ok');
      renderNotes(body);
    });
    body.onclick = (e) => {
      const say = e.target.closest('[data-say]');
      if (say) { SH.speech.speak(say.dataset.say, { btn: say }); return; }
      const un = e.target.closest('[data-unsave]');
      const del = e.target.closest('[data-del-note]');
      if (!un && !del) return;
      if (un) save((x) => { x.savedLexicon = x.savedLexicon.filter((y) => y !== un.dataset.unsave); });
      if (del) save((x) => { x.notebook = x.notebook.filter((y) => y.id !== del.dataset.delNote); });
      renderNotes(body);
    };
    body.querySelectorAll('[data-share]').forEach((c) => c.addEventListener('change', () => {
      save((x) => { const n = x.notebook.find((y) => y.id === c.dataset.share); n.shared = c.checked; n.updatedAt = new Date().toISOString(); });
      U.toast(c.checked ? 'Compartilhada com o Professor Gabriel.' : 'Anotação agora é privada.', 'info', 2200);
      renderNotes(body);
    }));
  }

  SH.agenda = { render };
})(window.SH);

/* Students Hub · Tela de autenticação: login, criação de conta e acesso demo em 1 clique */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;

  const DEMO_CARDS = [
    { key: 'teacher', role: 'Professor · Admin', tag: 'Visão de todos os alunos', desc: 'Acompanhamento pedagógico, histórico da turma e Central do Professor.' },
    { key: 'julia', role: 'Aluna · Nível A2', tag: 'Trabalho e viagens', desc: 'Histórico parcial com pontos de atenção em preposições e Past Simple.' },
    { key: 'renan', role: 'Aluno · Nível B1', tag: 'Fluência profissional', desc: 'Sequência ativa de estudos, atenção em Phrasal Verbs e condicionais.' },
  ];

  function render(root, { mode = 'login', email = '', notice = '' } = {}) {
    document.title = 'Entrar · Students Hub | Gabriel Florencio';
    const demoUsers = SH.store.demoIds;
    root.innerHTML = `
      <div class="auth">
        <section class="auth__brand" aria-label="Sobre o Students Hub">
          <div class="auth__brand-inner">
            <div class="brandmark brandmark--light">
              <span class="brandmark__logo" aria-hidden="true">G</span>
              <span><strong>Students Hub</strong><small>Portal do Aluno · Gabriel Florencio</small></span>
            </div>
            <h1 class="auth__title">Inglês da vida real, organizado para a sua cabeça.</h1>
            <p class="auth__lead">Leituras guiadas, chunks de alta frequência e um acompanhamento que celebra o que você já conquistou antes de mostrar o próximo passo.</p>
            <div class="auth__illus">${SH.illus('welcome')}</div>
            <ul class="auth__pillars">
              <li><strong>Abordagem Lexical</strong><span>Blocos reais de linguagem, do jeito que o inglês é falado.</span></li>
              <li><strong>Neuropsicopedagogia aplicada</strong><span>Autonomia, reforço positivo e telas sem sobrecarga.</span></li>
              <li><strong>Escuta individualizada</strong><span>Seu histórico guia cada aula com o Gabriel.</span></li>
            </ul>
          </div>
        </section>

        <section class="auth__panel">
          <div class="auth__card">
            <div class="seg" role="tablist" aria-label="Acesso">
              <button class="seg__btn ${mode === 'login' ? 'is-active' : ''}" role="tab" aria-selected="${mode === 'login'}" data-mode="login">Entrar</button>
              <button class="seg__btn ${mode === 'signup' ? 'is-active' : ''}" role="tab" aria-selected="${mode === 'signup'}" data-mode="signup">Criar conta de aluno</button>
            </div>
            ${notice ? `<p class="note note--ok">${SH.icon('check')}<span>${notice}</span></p>` : ''}
            <div class="auth__form-host">${mode === 'login' ? loginForm(email) : signupForm()}</div>
          </div>

          <div class="auth__demo">
            <div class="auth__demo-head">
              <h2>Acesso rápido de demonstração</h2>
              <p>Um clique para explorar o portal com perfis reais pré-populados.</p>
            </div>
            <div class="demo-grid">
              ${DEMO_CARDS.map((c) => {
                const u = SH.store.getUser(demoUsers[c.key]);
                return `
                <button class="demo-card demo-card--${c.key}" data-demo="${c.key}">
                  <span class="avatar avatar--${c.key}" aria-hidden="true">${esc(SH.util.initials(u.name))}</span>
                  <span class="demo-card__body">
                    <span class="demo-card__name">${esc(u.name)}</span>
                    <span class="demo-card__role">${c.role}</span>
                    <span class="demo-card__desc">${c.desc}</span>
                  </span>
                  <span class="demo-card__go">${SH.icon('arrowRight')}</span>
                </button>`;
              }).join('')}
            </div>
            <p class="auth__fineprint">Contas demo também aceitam login manual com a senha <code>${SH.store.DEMO_PASSWORD}</code>. Seus dados ficam salvos neste navegador e podem ser exportados a qualquer momento.</p>
          </div>
        </section>
      </div>`;

    root.querySelectorAll('[data-mode]').forEach((b) =>
      b.addEventListener('click', () => render(root, { mode: b.dataset.mode })));

    root.querySelectorAll('[data-demo]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = demoUsers[b.dataset.demo];
        SH.store.setSession(id);
        SH.app.enter();
      }));

    const form = root.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (mode === 'login') onLogin(form); else onSignup(form);
    });
    if (notice) setTimeout(() => root.querySelector('.auth__card').scrollIntoView({ block: 'start' }), 50);
    const first = email ? form.querySelector('#login-pass') : form.querySelector('input');
    if (first && window.innerWidth > 900) first.focus();
  }

  const field = (id, label, input, hint = '') => `
    <div class="field" data-field="${id}">
      <label for="${id}">${label}</label>
      ${input}
      ${hint ? `<p class="field__hint">${hint}</p>` : ''}
      <p class="field__error" id="${id}-err" role="alert"></p>
    </div>`;

  function loginForm(email = '') {
    return `
      <form class="form" novalidate>
        <h2 class="form__title">Bem-vindo de volta</h2>
        <p class="form__sub">Entre com o e-mail e a senha da sua conta.</p>
        ${field('login-email', 'E-mail', `<input id="login-email" name="email" type="email" autocomplete="email" inputmode="email" aria-describedby="login-email-err" required value="${esc(email)}">`)}
        ${field('login-pass', 'Senha', '<input id="login-pass" name="password" type="password" autocomplete="current-password" aria-describedby="login-pass-err" required>')}
        <button class="btn btn--primary btn--block" type="submit">Entrar no portal</button>
      </form>`;
  }

  function signupForm() {
    const goals = Object.entries(SH.labels.GOALS).filter(([k]) => k !== 'teaching');
    return `
      <form class="form" novalidate>
        <h2 class="form__title">Crie sua conta de aluno</h2>
        <p class="form__sub">Leva um minuto. Essas respostas ajudam o Gabriel a personalizar sua trilha.</p>
        ${field('su-name', 'Nome completo', '<input id="su-name" name="name" type="text" autocomplete="name" aria-describedby="su-name-err" required>')}
        ${field('su-email', 'E-mail', '<input id="su-email" name="email" type="email" autocomplete="email" inputmode="email" aria-describedby="su-email-err" required>')}
        ${field('su-pass', 'Senha', '<input id="su-pass" name="password" type="password" autocomplete="new-password" minlength="6" aria-describedby="su-pass-err" required>', 'Mínimo de 6 caracteres.')}
        <div class="form__row">
          ${field('su-level', 'Nível atual estimado', `<select id="su-level" name="level">
              ${Object.values(SH.content.LEVELS).map((l) => `<option value="${l.code}">${l.name}</option>`).join('')}
            </select>`)}
          ${field('su-location', 'Onde você está hoje', `<select id="su-location" name="location">
              ${Object.entries(SH.labels.LOCATIONS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
            </select>`)}
        </div>
        ${field('su-goal', 'Objetivo principal', `<select id="su-goal" name="goal">
            ${goals.map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
          </select>`)}
        <details class="level-help">
          <summary>Não sei meu nível: como escolher?</summary>
          <ul>
            <li><strong>A1 Foundation:</strong> você entende frases curtas e se apresenta com apoio.</li>
            <li><strong>A2 Elementary:</strong> conversa sobre rotina, compras e viagens simples.</li>
            <li><strong>B1 Intermediate:</strong> participa de reuniões e conversas conhecidas, com alguma hesitação.</li>
            <li><strong>B2 Upper-Intermediate:</strong> argumenta, opina e entende conversas rápidas na maior parte do tempo.</li>
          </ul>
        </details>
        <button class="btn btn--primary btn--block" type="submit">Criar conta e começar</button>
      </form>`;
  }

  function setError(form, id, msg) {
    const wrap = form.querySelector(`[data-field="${id}"]`);
    if (!wrap) return;
    wrap.classList.toggle('has-error', !!msg);
    wrap.querySelector('.field__error').textContent = msg || '';
    const input = wrap.querySelector('input, select');
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  async function onLogin(form) {
    const email = form.email.value.trim();
    const password = form.password.value;
    setError(form, 'login-email', '');
    setError(form, 'login-pass', '');
    if (!SH.util.isEmail(email)) return setError(form, 'login-email', 'Digite um e-mail válido.');
    if (!password) return setError(form, 'login-pass', 'Digite sua senha.');
    const res = await SH.store.authenticate(email, password);
    if (!res.ok) {
      if (res.reason === 'email') return setError(form, 'login-email', 'Não encontramos uma conta com este e-mail neste navegador.');
      return setError(form, 'login-pass', 'Senha incorreta. Confira e tente de novo.');
    }
    SH.store.setSession(res.user.id);
    SH.app.enter();
  }

  async function onSignup(form) {
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      level: form.level.value,
      goal: form.goal.value,
      location: form.location.value,
    };
    ['su-name', 'su-email', 'su-pass'].forEach((id) => setError(form, id, ''));
    let bad = false;
    if (data.name.split(/\s+/).filter(Boolean).length < 2) { setError(form, 'su-name', 'Digite nome e sobrenome.'); bad = true; }
    if (!SH.util.isEmail(data.email)) { setError(form, 'su-email', 'Digite um e-mail válido.'); bad = true; }
    else if (SH.store.findByEmail(data.email)) { setError(form, 'su-email', 'Já existe uma conta com este e-mail. Use a aba Entrar.'); bad = true; }
    if (data.password.length < 6) { setError(form, 'su-pass', 'A senha precisa ter pelo menos 6 caracteres.'); bad = true; }
    if (bad) {
      const firstErr = form.querySelector('.has-error input');
      if (firstErr) firstErr.focus();
      return;
    }
    const user = await SH.store.createStudent(data);
    SH.store.setSession(user.id);
    SH.app.enter();
    SH.util.toast('Conta criada. Bem-vinda(o) ao Students Hub, ' + SH.util.firstName(user.name) + '!', 'ok');
  }

  /** Pede ao aluno que troque a senha temporária criada pelo professor */
  function promptNewPassword(user) {
    const m = SH.util.modal({
      title: 'Crie a sua senha pessoal',
      html: `
        <p>Olá, ${esc(SH.util.firstName(user.name))}! Você entrou com a senha temporária enviada pelo Gabriel. Para proteger seu acesso, escolha uma senha só sua.</p>
        <form class="form form--tight" id="np-form" novalidate>
          <div class="field" data-field="np1"><label for="np1">Nova senha</label><input id="np1" type="password" autocomplete="new-password" minlength="6"><p class="field__hint">Mínimo de 6 caracteres.</p><p class="field__error" role="alert"></p></div>
          <div class="field" data-field="np2"><label for="np2">Repita a nova senha</label><input id="np2" type="password" autocomplete="new-password"><p class="field__error" role="alert"></p></div>
        </form>`,
      actions: [
        { label: 'Fazer isso depois', variant: 'ghost' },
        {
          label: 'Salvar nova senha', variant: 'primary',
          onClick: (close) => {
            const form = m.el.querySelector('#np-form');
            const a = form.querySelector('#np1').value, b = form.querySelector('#np2').value;
            setError(form, 'np1', ''); setError(form, 'np2', '');
            if (a.length < 6) { setError(form, 'np1', 'A senha precisa ter pelo menos 6 caracteres.'); return false; }
            if (a !== b) { setError(form, 'np2', 'As senhas não são iguais.'); return false; }
            SH.store.setPassword(user.id, a, false).then(() => { close(); SH.util.toast('Senha pessoal criada com sucesso.', 'ok'); });
            return false;
          },
        },
      ],
    });
  }

  SH.auth = { render, promptNewPassword };
})(window.SH);

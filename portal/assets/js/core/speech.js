/* Students Hub · Síntese de voz nativa (Web Speech API) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let voices = [];
  let activeBtn = null;

  const PREFERRED = [
    'Google US English', 'Samantha', 'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)', 'Alex', 'Karen', 'Daniel',
    'Google UK English Female', 'Microsoft Zira - English (United States)',
  ];

  function loadVoices() {
    if (!supported) return;
    voices = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  }
  if (supported) {
    loadVoices();
    speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  function pickVoice() {
    if (!voices.length) loadVoices();
    for (const name of PREFERRED) {
      const v = voices.find((x) => x.name === name);
      if (v) return v;
    }
    return voices.find((v) => /en[-_]US/i.test(v.lang)) || voices[0] || null;
  }

  function clearActive() {
    if (activeBtn) {
      activeBtn.classList.remove('is-speaking');
      activeBtn.setAttribute('aria-pressed', 'false');
      activeBtn = null;
    }
    document.dispatchEvent(new Event('sh:speech-idle'));
  }

  function stop() {
    if (supported) speechSynthesis.cancel();
    clearActive();
  }

  /**
   * Fala um texto em inglês. Se o mesmo botão for clicado de novo durante a fala, interrompe.
   * @param {string} text
   * @param {{btn?: HTMLElement, rate?: number}} opts
   */
  function speak(text, opts = {}) {
    if (!supported) {
      SH.util.toast('Seu navegador não oferece síntese de voz. Tente Chrome, Edge ou Safari atualizados.', 'warn');
      return;
    }
    const btn = opts.btn || null;
    if (btn && btn === activeBtn) { stop(); return; }
    stop();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\.\.\./g, ','));
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'en-US';
    u.rate = opts.rate || SH.speech.rate();
    u.pitch = 1;
    if (btn) {
      activeBtn = btn;
      btn.classList.add('is-speaking');
      btn.setAttribute('aria-pressed', 'true');
    }
    u.onend = u.onerror = () => { if (activeBtn === btn) clearActive(); };
    speechSynthesis.speak(u);
  }

  /** Lê vários trechos em sequência (evita o corte de falas longas em alguns navegadores) */
  function speakQueue(texts, opts = {}) {
    if (!supported) { speak(''); return; }
    const btn = opts.btn || null;
    if (btn && btn === activeBtn) { stop(); return; }
    stop();
    if (btn) {
      activeBtn = btn;
      btn.classList.add('is-speaking');
      btn.setAttribute('aria-pressed', 'true');
    }
    const v = pickVoice();
    texts.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'en-US';
      u.rate = opts.rate || SH.speech.rate();
      if (opts.onPart) u.onstart = () => opts.onPart(i);
      if (i === texts.length - 1) u.onend = () => { if (activeBtn === btn) clearActive(); if (opts.onDone) opts.onDone(); };
      u.onerror = () => { if (activeBtn === btn) clearActive(); if (opts.onDone) opts.onDone(); };
      speechSynthesis.speak(u);
    });
  }

  SH.speech = {
    supported,
    speak,
    speakQueue,
    stop,
    /** Velocidade conforme preferência do usuário: natural ou pausada */
    rate() {
      const u = SH.store && SH.store.currentUser();
      return u && u.prefs && u.prefs.audioPace === 'slow' ? 0.72 : 0.95;
    },
  };

  window.addEventListener('hashchange', stop);
})(window.SH);

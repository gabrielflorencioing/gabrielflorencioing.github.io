/* Students Hub · utilitários compartilhados (escape, datas, hash, toasts, modais, download) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

  const uid = (prefix = 'id') =>
    prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

  const pad = (n) => String(n).padStart(2, '0');

  /** Chave de data local no formato AAAA-MM-DD */
  const dayKey = (d = new Date()) => {
    const x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
  };

  const keyToDate = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const daysBetweenKeys = (a, b) => Math.round((keyToDate(b) - keyToDate(a)) / 86400000);

  const daysAgoDate = (n, hour = 19, minute = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  };
  const fmtDateTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return fmtDate(iso) + ', ' + pad(d.getHours()) + 'h' + pad(d.getMinutes());
  };

  const relDays = (iso) => {
    if (!iso) return 'sem registro';
    const diff = daysBetweenKeys(dayKey(new Date(iso)), dayKey());
    if (diff <= 0) return 'hoje';
    if (diff === 1) return 'ontem';
    return 'há ' + diff + ' dias';
  };

  const initials = (name) =>
    String(name || '?')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || '?';

  const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || '';

  /** Hash de senha local (SHA-256 com sal). Proteção básica para dados guardados no navegador. */
  async function hashPassword(password, salt) {
    const input = 'sh-v1|' + String(salt).toLowerCase() + '|' + password;
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
        return 'sha256:' + Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* segue para o fallback */ }
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < input.length; i++) {
      const ch = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 'fnv:' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

  /* ---------- Toasts ---------- */
  function toast(message, type = 'info', ms = 3600) {
    let host = document.getElementById('toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = '<span class="toast__dot" aria-hidden="true"></span><span>' + esc(message) + '</span>';
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => {
      el.classList.remove('is-in');
      setTimeout(() => el.remove(), 300);
    }, ms);
  }

  /* ---------- Modal acessível ---------- */
  function modal({ title, html, actions = [], size = 'md', onClose } = {}) {
    const lastFocus = document.activeElement;
    const wrap = document.createElement('div');
    wrap.className = 'modal';
    wrap.innerHTML =
      '<div class="modal__backdrop" data-close></div>' +
      '<div class="modal__dialog modal__dialog--' + size + '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<header class="modal__head"><h2 id="modal-title" class="modal__title">' + esc(title) + '</h2>' +
      '<button class="icon-btn" data-close aria-label="Fechar">' + SH.icon('close') + '</button></header>' +
      '<div class="modal__body">' + (html || '') + '</div>' +
      (actions.length ? '<footer class="modal__foot"></footer>' : '') +
      '</div>';
    const foot = wrap.querySelector('.modal__foot');
    actions.forEach((a) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + (a.variant ? 'btn--' + a.variant : 'btn--ghost');
      b.textContent = a.label;
      b.addEventListener('click', () => {
        const keep = a.onClick && a.onClick(close) === false;
        if (!keep) close();
      });
      foot.appendChild(b);
    });
    function close() {
      wrap.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => wrap.remove(), 220);
      document.body.classList.remove('no-scroll');
      if (onClose) onClose();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = wrap.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    wrap.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => {
      wrap.classList.add('is-open');
      const target = wrap.querySelector('.modal__foot .btn--primary') || wrap.querySelector('.modal__dialog button');
      if (target) target.focus();
    });
    return { close, el: wrap };
  }

  function download(filename, text, mime = 'application/json') {
    const blob = new Blob([text], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 400);
  }

  const reducedMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Anima um número de 0 até o valor final */
  function countUp(el, to, ms = 900) {
    if (!el) return;
    if (reducedMotion()) { el.textContent = to; return; }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / ms);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  SH.util = {
    esc, uid, dayKey, keyToDate, daysBetweenKeys, daysAgoDate, fmtDate, fmtDateTime, relDays,
    initials, firstName, hashPassword, isEmail, toast, modal, download, reducedMotion, countUp,
  };
})(window.SH);

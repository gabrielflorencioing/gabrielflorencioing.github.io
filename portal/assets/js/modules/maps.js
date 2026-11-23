/* Students Hub · Módulo 3: Biblioteca de Mapas Mentais (SVG vetorial + download PNG/SVG) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';
  const { esc } = SH.util;
  const C = () => SH.content;
  const FONT = 'Nunito, Arial, Helvetica, sans-serif';
  const INK = '#2A1252';

  /* Geometria fixa: colunas simétricas, então nenhum nó invade o outro */
  const G = {
    W: 1700, top: 132,
    child: { w: 340, padX: 16, title: 17, line: 20, maxChars: 40 },
    head: { w: 240, h: 64 },
    center: { w: 250, h: 110 },
    gapChild: 14, gapBranch: 44,
  };
  G.childL = 40; G.headL = 430; G.centerX = G.W / 2 - G.center.w / 2;
  G.headR = G.W - G.headL - G.head.w; G.childR = G.W - G.childL - G.child.w;

  function wrap(text, max) {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    words.forEach((w) => {
      if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /** Gera o SVG completo e autossuficiente de um mapa (usado na tela e no download) */
  function buildSVG(map) {
    const sides = [map.branches.slice(0, 2), map.branches.slice(2, 4)];
    const layout = sides.map((branches) => {
      let y = 0;
      return branches.map((b) => {
        const kids = b.items.map(([t, d]) => {
          const lines = wrap(d, G.child.maxChars);
          const h = 20 + G.child.title + 10 + lines.length * G.child.line + 12;
          const node = { t, lines, y, h };
          y += h + G.gapChild;
          return node;
        });
        const start = kids[0].y;
        const end = kids[kids.length - 1].y + kids[kids.length - 1].h;
        const block = { b, kids, start, end, mid: (start + end) / 2 };
        y += G.gapBranch - G.gapChild;
        return block;
      });
    });
    const sideH = layout.map((bl) => bl[bl.length - 1].end);
    const bodyH = Math.max(...sideH);
    const H = G.top + bodyH + 70;
    const cy = G.top + bodyH / 2;
    // centraliza verticalmente o lado mais curto
    const offs = sideH.map((h) => G.top + (bodyH - h) / 2);

    let out = '';
    // conexões primeiro (ficam atrás dos nós)
    layout.forEach((blocks, side) => {
      const left = side === 0;
      blocks.forEach((bl) => {
        const hy = offs[side] + bl.mid;
        const cxEdge = left ? G.centerX : G.centerX + G.center.w;
        const hxIn = left ? G.headL + G.head.w : G.headR;
        const hxOut = left ? G.headL : G.headR + G.head.w;
        const mx = (cxEdge + hxIn) / 2;
        out += `<path d="M${cxEdge} ${cy} C${mx} ${cy}, ${mx} ${hy}, ${hxIn} ${hy}" fill="none" stroke="${bl.b.color}" stroke-width="4" stroke-linecap="round"/>`;
        bl.kids.forEach((k) => {
          const ky = offs[side] + k.y + k.h / 2;
          const kx = left ? G.childL + G.child.w : G.childR;
          const m2 = (hxOut + kx) / 2;
          out += `<path d="M${hxOut} ${hy} C${m2} ${hy}, ${m2} ${ky}, ${kx} ${ky}" fill="none" stroke="${bl.b.color}" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>`;
        });
      });
    });
    // nós
    layout.forEach((blocks, side) => {
      const left = side === 0;
      blocks.forEach((bl) => {
        const hy = offs[side] + bl.mid;
        const hx = left ? G.headL : G.headR;
        const label = wrap(bl.b.label, 18);
        out += `<rect x="${hx}" y="${hy - G.head.h / 2}" width="${G.head.w}" height="${G.head.h}" rx="18" fill="${bl.b.color}"/>`;
        label.forEach((ln, i) => {
          const ty = hy + 7 + (i - (label.length - 1) / 2) * 22;
          out += `<text x="${hx + G.head.w / 2}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="800" fill="#fff">${esc(ln)}</text>`;
        });
        bl.kids.forEach((k) => {
          const x = left ? G.childL : G.childR;
          const y = offs[side] + k.y;
          out += `<rect x="${x}" y="${y}" width="${G.child.w}" height="${k.h}" rx="14" fill="#fff" stroke="${bl.b.color}" stroke-width="2"/>`;
          out += `<rect x="${x}" y="${y}" width="8" height="${k.h}" rx="4" fill="${bl.b.color}"/>`;
          out += `<text x="${x + G.child.padX + 8}" y="${y + 20 + G.child.title - 4}" font-family="${FONT}" font-size="${G.child.title}" font-weight="800" fill="${INK}">${esc(k.t)}</text>`;
          k.lines.forEach((ln, i) => {
            out += `<text x="${x + G.child.padX + 8}" y="${y + 20 + G.child.title + 10 + (i + 1) * G.child.line - 5}" font-family="${FONT}" font-size="14.5" fill="#463D62">${esc(ln)}</text>`;
          });
        });
      });
    });
    // centro
    out += `<rect x="${G.centerX}" y="${cy - G.center.h / 2}" width="${G.center.w}" height="${G.center.h}" rx="28" fill="${INK}"/>`;
    out += `<text x="${G.W / 2}" y="${cy - 6}" text-anchor="middle" font-family="${FONT}" font-size="25" font-weight="800" fill="#FFD25C">${esc(map.center[0])}</text>`;
    out += `<text x="${G.W / 2}" y="${cy + 24}" text-anchor="middle" font-family="${FONT}" font-size="17" font-weight="700" fill="#fff">${esc(map.center[1])}</text>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G.W} ${H}" width="${G.W}" height="${H}" role="img" aria-label="Mapa mental: ${esc(map.title)}" class="mindmap">
      <rect width="${G.W}" height="${H}" fill="#FAF9FE"/>
      <text x="40" y="58" font-family="${FONT}" font-size="34" font-weight="800" fill="${INK}">${esc(map.title)}</text>
      <text x="40" y="92" font-family="${FONT}" font-size="17" fill="#655E7E">${esc(map.subtitle)}</text>
      ${out}
      <text x="${G.W - 40}" y="${H - 24}" text-anchor="end" font-family="${FONT}" font-size="14" font-weight="700" fill="#9A93B5">Students Hub · Mentoria Gabriel Florencio</text>
    </svg>`;
  }

  /* ---------- Download ---------- */
  function downloadSVG(map) {
    SH.util.download('mapa-mental-' + map.id + '.svg', buildSVG(map), 'image/svg+xml');
    SH.util.toast('Mapa baixado em SVG.', 'ok');
  }

  function downloadPNG(map, btn) {
    const svg = buildSVG(map);
    const m = svg.match(/viewBox="0 0 (\d+) (\d+(?:\.\d+)?)"/);
    const w = Number(m[1]), h = Math.ceil(Number(m[2]));
    const scale = 2;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    if (btn) btn.disabled = true;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * scale; canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (btn) btn.disabled = false;
        if (!blob) { SH.util.toast('Não foi possível gerar o PNG neste navegador. Use o download em SVG.', 'err'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'mapa-mental-' + map.id + '.png';
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        SH.util.toast('Mapa baixado em PNG (' + w * scale + ' x ' + h * scale + ' px).', 'ok');
      }, 'image/png');
    };
    img.onerror = () => { if (btn) btn.disabled = false; URL.revokeObjectURL(url); SH.util.toast('Falha ao converter o mapa. Tente o download em SVG.', 'err'); };
    img.src = url;
  }

  /* ---------- Telas ---------- */
  function openMap(map) {
    history.replaceState(null, '', '#/maps/' + map.id);
    const m = SH.util.modal({
      title: map.title,
      size: 'xl',
      html: `<p class="muted">${esc(map.subtitle)}</p><div class="mindmap-view" tabindex="0" aria-label="Mapa ampliado, role para ver tudo">${buildSVG(map)}</div>`,
      actions: [
        { label: 'Baixar SVG', variant: 'ghost', onClick: () => { downloadSVG(map); return false; } },
        { label: 'Baixar Mapa Mental (PNG Alta Resolução)', variant: 'primary', onClick: () => { downloadPNG(map); return false; } },
      ],
      onClose: () => history.replaceState(null, '', '#/maps'),
    });
    return m;
  }

  function renderList(main, openId) {
    SH.shell.setActive('maps', 'Mapas Mentais');
    main.innerHTML = `
      <div class="page">
        <header class="page-head"><div>
          <p class="eyebrow">Módulo 3 · Interativos e baixáveis</p>
          <h1 class="page-title">Biblioteca de Mapas Mentais</h1>
          <p class="lead">A lógica do inglês organizada em uma imagem só. Amplie para estudar e baixe em PNG de alta resolução para imprimir ou salvar no celular.</p>
        </div></header>
        <div class="map-grid">
          ${C().MAPS.map((map) => `
            <article class="map-card">
              <button class="map-card__thumb" data-open="${map.id}" aria-label="Ampliar o mapa ${esc(map.title)}">${buildSVG(map)}</button>
              <div class="map-card__body">
                <h2 class="unit-card__title">${esc(map.title)}</h2>
                <p class="unit-card__sub">${esc(map.subtitle)}</p>
                <ul class="chips">${map.branches.map((b) => `<li class="chip" style="border-color:${b.color}55"><span class="dot" style="background:${b.color}"></span>${esc(b.label)}</li>`).join('')}</ul>
                <div class="map-card__actions">
                  <button class="btn btn--ghost btn--sm" data-open="${map.id}">${SH.icon('eye')}Ampliar</button>
                  <button class="btn btn--primary btn--sm" data-png="${map.id}">${SH.icon('download')}Baixar PNG</button>
                </div>
              </div>
            </article>`).join('')}
        </div>
      </div>`;
    main.firstElementChild.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]');
      if (o) { openMap(C().map(o.dataset.open)); return; }
      const p = e.target.closest('[data-png]');
      if (p) downloadPNG(C().map(p.dataset.png), p);
    });
    if (openId && C().map(openId)) openMap(C().map(openId));
  }

  SH.maps = { renderList, buildSVG };
})(window.SH);

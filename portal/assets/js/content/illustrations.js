/* Students Hub · Ícones de interface e ilustrações autorais em SVG (line-art em tinta + formas geométricas) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const INK = '#2A1252';

  /* ---------------- Ícones de interface (24x24, traço) ---------------- */
  const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z"/><path d="M12 6.5v13"/>',
    game: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.5" cy="13.8" r=".9" fill="currentColor"/>',
    map: '<circle cx="12" cy="12" r="2.6"/><circle cx="4.5" cy="6" r="1.8"/><circle cx="19.5" cy="6" r="1.8"/><circle cx="4.5" cy="18" r="1.8"/><circle cx="19.5" cy="18" r="1.8"/><path d="M9.8 10.4 6 7.2M14.2 10.4 18 7.2M9.8 13.6 6 16.8M14.2 13.6 18 16.8"/>',
    lexicon: '<path d="M4 5.5h11a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9l-4 3v-3H4z" transform="translate(1 -1)"/><path d="M9 10h7M9 13h4"/>',
    profile: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h3"/>',
    teacher: '<path d="M12 3 21 7.5 12 12 3 7.5Z"/><path d="M6.5 9.5V15c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2V9.5"/><path d="M21 7.5V13"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 19.5h14"/>',
    logout: '<path d="M14 4.5h4.5v15H14M10 8l-4 4 4 4M6 12h10"/>',
    check: '<path d="M5 12.5 10 17.5 19 7"/>',
    x: '<path d="M7 7l10 10M17 7 7 17"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.7-5.4 3.8-8.4.9 1.7 2 2.6 3 2.9-.3-2.3.4-4.6 2.4-6.4.4 3.6 4.3 6 4.3 11 0 4.1-3 7-7 7Z"/>',
    star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8Z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    text: '<path d="M5 6h14M5 10h14M5 14h10M5 18h7"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.9-3.8 3.9-6 7.5-6s6.6 2.2 7.5 6"/>',
    users: '<circle cx="9" cy="8.5" r="3.4"/><path d="M2.5 19.5c.8-3.4 3.4-5.4 6.5-5.4s5.7 2 6.5 5.4"/><path d="M15.5 5.3a3.3 3.3 0 0 1 0 6.4M18 14.3c1.8.7 3 2.4 3.5 5.2"/>',
    alert: '<path d="M12 4 21.5 20h-19Z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".8" fill="currentColor"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.9" r=".8" fill="currentColor"/>',
    minus: '<path d="M6 12h12"/>',
    plus: '<path d="M12 6v12M6 12h12"/>',
    bookmark: '<path d="M6.5 4h11v16L12 16l-5.5 4Z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
    layers: '<path d="m12 4 8.5 4.5L12 13 3.5 8.5Z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5"/>',
    turtle: '<path d="M4 15c0-4 3.6-7 8-7s8 3 8 7Z"/><path d="M20 13.5h1.5M7 15l-1 3M17 15l1 3"/>',
    rabbit: '<path d="M9 11c-3 0-5 2-5 4.5S6 20 10 20h6c2.5 0 4-1.5 4-3.5S18 13 15.5 13"/><path d="M13 11.5 11 4.5c2 0 3.5 2.5 3.5 6M15 12l.5-6.5c1.6.6 2 3.6.6 7"/>',
  };

  SH.icon = function (name, cls = '') {
    return '<svg class="ico ' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  };

  /* ---------------- Ilustrações temáticas ---------------- */
  const S = 'stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  const S2 = 'stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';

  function wrap(label, inner, vb = '0 0 480 260') {
    return '<svg class="illus" viewBox="' + vb + '" role="img" aria-label="' + SH.util.esc(label) + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>';
  }

  const ILLUS = {
    /* Rotina matinal: janela com sol, despertador às 6:15, caneca de café, planta */
    routine: () => wrap('Ilustração de rotina matinal: janela com o sol nascendo, despertador marcando 6h15 e uma caneca de café fumegante',
      '<rect width="480" height="260" rx="28" fill="#EEF0FA"/>' +
      '<circle cx="410" cy="48" r="70" fill="#E3E8F7"/>' +
      '<rect x="44" y="34" width="156" height="134" rx="12" fill="#FFF6DA" ' + S + '/>' +
      '<circle cx="150" cy="84" r="25" fill="#FFD25C"/>' +
      '<path d="M150 46v-6M182 58l5-4M188 84h6M118 58l-5-4" ' + S2 + ' fill="none"/>' +
      '<path d="M47 150c20-22 40-26 66-10 22-18 48-20 84 6v19H47Z" fill="#9BE7C4"/>' +
      '<path d="M122 34v134M44 101h156" ' + S + ' fill="none"/>' +
      '<rect x="44" y="34" width="156" height="134" rx="12" fill="none" ' + S + '/>' +
      '<path d="M28 214h424" ' + S + '/>' +
      '<path d="M236 128c-6-14 2-26 16-26M288 128c6-14-2-26-16-26" ' + S + ' fill="none"/>' +
      '<path d="M240 196l-9 17M286 196l9 17" ' + S + '/>' +
      '<circle cx="263" cy="162" r="40" fill="#fff" ' + S + '/>' +
      '<path d="M263 128v6M263 190v6M229 162h6M291 162h6" ' + S2 + '/>' +
      '<path d="M263 162l5 22M263 162h24" ' + S + '/>' +
      '<circle cx="263" cy="162" r="3.5" fill="' + INK + '"/>' +
      '<path d="M342 150h56v44a14 14 0 0 1-14 14h-28a14 14 0 0 1-14-14Z" fill="#B9A8FF" ' + S + '/>' +
      '<path d="M398 160h7a13 13 0 0 1 0 26h-7" fill="none" ' + S + '/>' +
      '<path d="M360 136c-8-9 0-18 0-26M380 136c-8-9 0-18 0-26" fill="none" ' + S2 + ' opacity=".7"/>' +
      '<path d="M420 214v-22h28v22" fill="#FF9B85" ' + S + '/>' +
      '<path d="M434 192c-2-18-14-24-20-30M434 192c2-16 10-26 18-30M434 192v-34" fill="none" ' + S2 + '/>'
    ),

    /* Viagem: plataforma, trem partindo, relógio da estação às 9:43, mochila */
    trip: () => wrap('Ilustração de estação de trem: relógio marcando 9h43, trem partindo da plataforma e uma mochila de viagem deixada para trás',
      '<rect width="480" height="260" rx="28" fill="#EAF6F0"/>' +
      '<circle cx="60" cy="230" r="90" fill="#D6F0E3"/>' +
      '<path d="M92 104v110" ' + S + '/>' +
      '<circle cx="92" cy="70" r="34" fill="#fff" ' + S + '/>' +
      '<path d="M92 41v5M92 94v5M63 70h5M116 70h5" ' + S2 + '/>' +
      '<path d="M92 70 78 64M92 70 68 75" ' + S + '/>' +
      '<circle cx="92" cy="70" r="3.5" fill="' + INK + '"/>' +
      '<rect x="232" y="44" width="150" height="160" rx="30" fill="#fff" ' + S + '/>' +
      '<rect x="252" y="66" width="110" height="58" rx="12" fill="#D8DFEF" ' + S2 + '/>' +
      '<path d="M307 66v58" ' + S2 + '/>' +
      '<circle cx="262" cy="166" r="9" fill="#FFD25C" ' + S2 + '/>' +
      '<circle cx="352" cy="166" r="9" fill="#FFD25C" ' + S2 + '/>' +
      '<path d="M286 166h42M290 186h34" ' + S2 + '/>' +
      '<path d="M24 214h432" ' + S + '/>' +
      '<path d="M252 214l-20 32M362 214l20 32M244 228h126" ' + S2 + '/>' +
      '<path d="M400 90h46M408 116h34M398 142h52" ' + S2 + ' opacity=".55"/>' +
      '<rect x="138" y="150" width="56" height="64" rx="15" fill="#FF9B85" ' + S + '/>' +
      '<path d="M148 150v-8a18 18 0 0 1 36 0v8" fill="none" ' + S + '/>' +
      '<path d="M138 172h56M160 172v12h12v-12" fill="none" ' + S2 + '/>'
    ),

    /* Trabalho: notebook com e-mail, balões de fala educados, calendário */
    meeting: () => wrap('Ilustração de comunicação profissional: notebook com um e-mail aberto, balões de conversa com as frases Could you e Sure, e um calendário de reuniões',
      '<rect width="480" height="260" rx="28" fill="#F1EEFC"/>' +
      '<circle cx="250" cy="130" r="96" fill="#E6E0FB"/>' +
      '<rect x="158" y="56" width="180" height="118" rx="10" fill="#fff" ' + S + '/>' +
      '<path d="M176 78h56M176 98h140M176 114h124M176 130h132" ' + S2 + ' opacity=".8"/>' +
      '<rect x="270" y="146" width="50" height="16" rx="8" fill="#6246EA"/>' +
      '<path d="M134 174h228l-16 20H150Z" fill="#fff" ' + S + '/>' +
      '<path d="M28 214h424" ' + S + '/>' +
      '<rect x="22" y="34" width="122" height="50" rx="18" fill="#FFF4D1" ' + S + '/>' +
      '<path d="M60 84l-6 16 18-16" fill="#FFF4D1" ' + S + '/>' +
      '<text x="83" y="65" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="17" font-weight="800" fill="' + INK + '">Could you...?</text>' +
      '<rect x="356" y="44" width="94" height="46" rx="18" fill="#DDF5EA" ' + S + '/>' +
      '<path d="M412 90l6 16-20-16" fill="#DDF5EA" ' + S + '/>' +
      '<text x="403" y="73" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="17" font-weight="800" fill="' + INK + '">Sure!</text>' +
      '<rect x="372" y="138" width="78" height="66" rx="10" fill="#fff" ' + S + '/>' +
      '<path d="M372 158h78M392 130v14M430 130v14" ' + S2 + '/>' +
      '<circle cx="392" cy="176" r="4" fill="' + INK + '"/><circle cx="411" cy="176" r="4" fill="#FF9B85"/><circle cx="430" cy="176" r="4" fill="' + INK + '"/>' +
      '<circle cx="392" cy="192" r="4" fill="' + INK + '"/><circle cx="411" cy="192" r="4" fill="' + INK + '"/>' +
      '<path d="M40 214v-40h46v40" fill="#FFD25C" ' + S + '/>' +
      '<path d="M48 186h30M48 198h22" ' + S2 + '/>'
    ),

    /* Vida no exterior: rota de avião Recife > Dublin, nuvem de chuva, malas e placa de direções */
    abroad: () => wrap('Ilustração de mudança para o exterior: rota tracejada de avião saindo de Recife até Dublin, nuvem de chuva, duas malas e uma placa apontando para Dublin e Lisboa',
      '<rect width="480" height="260" rx="28" fill="#EEF3FA"/>' +
      '<circle cx="420" cy="230" r="100" fill="#E1E9F6"/>' +
      '<path d="M66 176C120 64 272 20 352 70" fill="none" ' + S2 + ' stroke-dasharray="2 10"/>' +
      '<circle cx="66" cy="176" r="8" fill="#FFD25C" ' + S2 + '/>' +
      '<text x="66" y="204" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="1.5" fill="' + INK + '">RECIFE</text>' +
      '<g transform="translate(352 70) rotate(28)">' +
      '<path d="M-22 0h40a6 6 0 0 1 0 6h-40Z" fill="#fff" ' + S2 + '/>' +
      '<path d="M-2 0-12-18h8L10 0M-2 6l-10 16h8L10 6M-20 0l-6-9h6l6 9" fill="#fff" ' + S2 + '/>' +
      '</g>' +
      '<path d="M372 66a20 20 0 0 1 38-8 16 16 0 1 1 6 31h-46a12 12 0 0 1 2-23Z" fill="#fff" ' + S + '/>' +
      '<path d="M384 104l-4 10M402 104l-4 10M420 104l-4 10" ' + S2 + '/>' +
      '<rect x="120" y="150" width="62" height="64" rx="10" fill="#FF9B85" ' + S + '/>' +
      '<path d="M140 150v-10h22v10M120 176h62" fill="none" ' + S2 + '/>' +
      '<rect x="190" y="168" width="48" height="46" rx="9" fill="#B9A8FF" ' + S + '/>' +
      '<path d="M204 168v-8h20v8" fill="none" ' + S2 + '/>' +
      '<path d="M28 214h424" ' + S + '/>' +
      '<path d="M352 214v-84" ' + S + '/>' +
      '<path d="M352 136h70l12 12-12 12h-70Z" fill="#fff" ' + S2 + '/>' +
      '<path d="M352 168h-60l-12 12 12 12h60Z" fill="#FFD25C" ' + S2 + '/>' +
      '<text x="390" y="153" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="1.2" fill="' + INK + '">DUBLIN</text>' +
      '<text x="318" y="185" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="1.2" fill="' + INK + '">LISBON</text>'
    ),

    /* Tela de login: livro aberto com chunks reais saindo das páginas */
    welcome: () => wrap('Ilustração de boas-vindas: livro aberto de onde saem balões com chunks reais do inglês falado',
      '<circle cx="240" cy="150" r="104" fill="rgba(255,255,255,.12)"/>' +
      '<path d="M240 196c-30-18-74-22-122-14V96c48-8 92-4 122 14Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M240 196c30-18 74-22 122-14V96c-48-8-92-4-122 14Z" fill="#F4F1FF" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M240 110v86" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<path d="M140 120c30-4 60-2 84 8M140 138c30-4 60-2 84 8M140 156c30-4 60-2 84 8M256 128c24-10 54-12 84-8M256 146c24-10 54-12 84-8M256 164c24-10 54-12 84-8" stroke="#B9A8FF" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<g font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="15">' +
      '<rect x="34" y="40" width="132" height="34" rx="17" fill="#FFD25C"/><text x="100" y="62" text-anchor="middle" fill="' + INK + '">catch up with</text>' +
      '<rect x="190" y="14" width="112" height="34" rx="17" fill="#9BE7C4"/><text x="246" y="36" text-anchor="middle" fill="' + INK + '">on my way</text>' +
      '<rect x="320" y="50" width="128" height="34" rx="17" fill="#FF9B85"/><text x="384" y="72" text-anchor="middle" fill="' + INK + '">to be honest</text>' +
      '</g>' +
      '<path d="M150 74l40 30M246 48v40M360 84l-34 22" stroke="#fff" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round" opacity=".7"/>',
      '0 0 480 230'),

    /* Jogo Chunk Builder: blocos de frase sendo encaixados em ordem sobre uma base */
    builder: () => wrap('Ilustração do Chunk Builder: blocos com pedaços de frase em inglês sendo empilhados na ordem certa',
      '<rect width="480" height="260" rx="28" fill="#FFF6DD"/>' +
      '<circle cx="400" cy="60" r="80" fill="#FFEDB8"/>' +
      '<path d="M28 214h424" ' + S + '/>' +
      '<g font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="16" fill="' + INK + '" text-anchor="middle">' +
      '<rect x="60" y="164" width="150" height="50" rx="12" fill="#B9A8FF" ' + S + '/><text x="135" y="195">Could you</text>' +
      '<rect x="210" y="164" width="130" height="50" rx="12" fill="#9BE7C4" ' + S + '/><text x="275" y="195">send me</text>' +
      '<rect x="120" y="114" width="150" height="50" rx="12" fill="#fff" ' + S + '/><text x="195" y="145">the report</text>' +
      '<rect x="292" y="40" width="130" height="50" rx="12" fill="#FF9B85" ' + S + ' transform="rotate(10 357 65)"/><text x="357" y="71" transform="rotate(10 357 65)">by Friday?</text>' +
      '</g>' +
      '<path d="M300 112c10-12 22-18 34-16" fill="none" ' + S2 + ' stroke-dasharray="3 7"/>' +
      '<path d="M296 104l4 9 9-3" fill="none" ' + S2 + '/>'
    ),

    /* Jogo Context & Preposition: alvo com relógio e calendário (tempo e lugar) */
    target: () => wrap('Ilustração do Context and Preposition Challenge: alvo central atingido, com relógio e marcador de lugar ao redor',
      '<rect width="480" height="260" rx="28" fill="#EAF6F0"/>' +
      '<circle cx="240" cy="128" r="84" fill="#fff" ' + S + '/>' +
      '<circle cx="240" cy="128" r="56" fill="#D6F0E3" ' + S2 + '/>' +
      '<circle cx="240" cy="128" r="28" fill="#FFD25C" ' + S2 + '/>' +
      '<circle cx="240" cy="128" r="6" fill="' + INK + '"/>' +
      '<path d="M240 128l92-70" ' + S + '/><path d="M322 52l18-6-4 18" fill="#FF9B85" ' + S2 + '/>' +
      '<circle cx="86" cy="82" r="34" fill="#fff" ' + S + '/><path d="M86 62v20l14 8" fill="none" ' + S + '/>' +
      '<text x="86" y="140" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="18" fill="' + INK + '">AT 7:30</text>' +
      '<path d="M398 150c0-20 14-34 30-34s30 14 30 34c0 24-30 52-30 52s-30-28-30-52Z" fill="#B9A8FF" ' + S + ' transform="translate(-30 -16)"/>' +
      '<circle cx="398" cy="134" r="9" fill="#fff" ' + S2 + '/>' +
      '<text x="398" y="214" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="18" fill="' + INK + '">IN Dublin</text>' +
      '<text x="86" y="214" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="18" fill="' + INK + '">ON Monday</text>'
    ),

    /* Jogo Collocation Match: duas colunas de nós ligadas por conexões */
    match: () => wrap('Ilustração do Collocation Match: duas colunas de cartões, verbos à esquerda e expressões à direita, ligados por linhas curvas',
      '<rect width="480" height="260" rx="28" fill="#F1EEFC"/>' +
      '<g font-family="Nunito, Arial, sans-serif" font-weight="800" font-size="16" fill="' + INK + '" text-anchor="middle">' +
      '<rect x="40" y="36" width="120" height="44" rx="22" fill="#fff" ' + S2 + '/><text x="100" y="64">make</text>' +
      '<rect x="40" y="108" width="120" height="44" rx="22" fill="#fff" ' + S2 + '/><text x="100" y="136">take</text>' +
      '<rect x="40" y="180" width="120" height="44" rx="22" fill="#fff" ' + S2 + '/><text x="100" y="208">run out of</text>' +
      '<rect x="320" y="36" width="120" height="44" rx="22" fill="#FFD25C" ' + S2 + '/><text x="380" y="64">a look</text>' +
      '<rect x="320" y="108" width="120" height="44" rx="22" fill="#9BE7C4" ' + S2 + '/><text x="380" y="136">an effort</text>' +
      '<rect x="320" y="180" width="120" height="44" rx="22" fill="#FF9B85" ' + S2 + '/><text x="380" y="208">time</text>' +
      '</g>' +
      '<path d="M160 58C240 58 240 130 320 130" fill="none" ' + S + '/>' +
      '<path d="M160 130C240 130 240 58 320 58" fill="none" ' + S + '/>' +
      '<path d="M160 202h160" fill="none" ' + S2 + ' stroke-dasharray="3 8"/>' +
      '<circle cx="240" cy="94" r="14" fill="#6246EA"/><path d="M233 94l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    ),

    /* Módulos em construção: planta-baixa com compasso */
    blueprint: () => wrap('Ilustração de planta em construção: folha quadriculada com régua, compasso e blocos geométricos sendo encaixados',
      '<rect width="480" height="260" rx="28" fill="#F3F1FA"/>' +
      '<rect x="60" y="40" width="240" height="170" rx="14" fill="#fff" ' + S + '/>' +
      '<path d="M100 40v170M140 40v170M180 40v170M220 40v170M260 40v170M60 80h240M60 120h240M60 160h240" stroke="#E2DDF3" stroke-width="2"/>' +
      '<rect x="60" y="40" width="240" height="170" rx="14" fill="none" ' + S + '/>' +
      '<rect x="100" y="120" width="80" height="40" rx="6" fill="#B9A8FF" ' + S2 + '/>' +
      '<rect x="180" y="80" width="80" height="80" rx="6" fill="#FFD25C" ' + S2 + '/>' +
      '<circle cx="140" cy="90" r="22" fill="#9BE7C4" ' + S2 + '/>' +
      '<path d="M360 40l-34 160M360 40l34 160" ' + S + '/>' +
      '<circle cx="360" cy="40" r="9" fill="#fff" ' + S + '/>' +
      '<path d="M336 150a34 34 0 0 0 48 0" fill="none" ' + S2 + ' stroke-dasharray="4 7"/>' +
      '<path d="M28 226h424" ' + S + '/>'
    ),
  };

  SH.illus = (name) => (ILLUS[name] ? ILLUS[name]() : ILLUS.blueprint());
})(window.SH);

/* Students Hub · Módulos das próximas etapas (abas já preparadas na navegação) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const MODULES = {
    games: {
      num: 2, title: 'Arena de Gamificação', tag: 'Learn by Playing',
      lead: 'Quatro jogos com mecânicas diferentes para transformar chunks e estruturas em reflexo automático.',
      items: [
        ['Chunk Builder', 'Monte frases reais clicando nos blocos na ordem natural do inglês falado.'],
        ['Preposition & Time Sniper', 'in, on, at, for, since, make, do, say, tell: precisão em frases do cotidiano.'],
        ['Collocation Match', 'Conecte verbos e expressões que realmente combinam e desbloqueie exemplos reais.'],
        ['Real-Life Dialogue Repair', 'Encontre a fala traduzida ao pé da letra e troque pela versão natural.'],
      ],
      extra: 'XP, combos de acertos e um card "Grammar & Logic Hint" em cada partida.',
    },
    maps: {
      num: 3, title: 'Biblioteca de Mapas Mentais', tag: 'Interativos e baixáveis',
      lead: 'Seis mapas vetoriais de alta nitidez, com visualização ampliada e download em PNG para imprimir ou salvar no celular.',
      items: [
        ['The Real Logic of English Tenses', 'Linha do tempo e intenção de cada tempo verbal.'],
        ['Prepositions of Time & Place', 'Do amplo ao específico: IN, ON, AT.'],
        ['Everyday Modals', 'Can, could, should, must e might na vida real.'],
        ['Connectors & Discourse Markers', 'Como conectar ideias com fluidez.'],
        ['Question Formation Formula', 'A lógica universal das perguntas em inglês.'],
        ['High-Frequency Phrasal Verbs', 'Get, take, put e look organizados por verbo central.'],
      ],
    },
    lexicon: {
      num: 4, title: 'Léxico Funcional da Vida Real', tag: 'Real-Life Lexicon',
      lead: 'Mais de 65 chunks organizados em 8 situações reais, com registro de formalidade, áudio nativo e botão para salvar no seu caderno.',
      items: [
        ['Aeroporto, imigração e hotel', ''], ['Trabalho, reuniões e apresentações', ''],
        ['Restaurantes, cafés e delivery', ''], ['Saúde, farmácia e emergências', ''],
        ['Conversas informais e reações', ''], ['Problemas e reclamações', ''],
        ['Compras, pagamentos e serviços', ''], ['E-mails e mensagens profissionais', ''],
      ],
    },
    profile: {
      num: 5, title: 'Perfil Cognitivo e Diagnóstico', tag: 'Sua evolução em detalhe',
      lead: 'Um retrato honesto e encorajador do seu progresso, alimentado pelas leituras e avaliações que você já faz hoje.',
      items: [
        ['Indicadores de evolução', 'Leitura e compreensão, repertório lexical, estruturas e constância.'],
        ['O que você já conquistou', 'Validação positiva de estruturas dominadas e sequências de acertos.'],
        ['Pontos de atenção', 'Gerados pelos seus erros, com atalho direto para o mapa mental ou jogo certo.'],
      ],
      extra: 'Seus resultados do Módulo 1 já estão sendo registrados por tópico e vão aparecer aqui.',
    },
    agenda: {
      num: 6, title: 'Agenda, Tarefas e Caderno de Aula', tag: 'Organização autônoma',
      lead: 'Seu espaço para planejar a semana, acompanhar tarefas e anotar dúvidas para levar à aula.',
      items: [
        ['Calendário e compromissos', 'Aulas com o Gabriel, prazos e etiquetas de cor.'],
        ['Checklist de tarefas', 'Action plan com prioridade e filtro de concluídas.'],
        ['Caderno de dúvidas e insights', 'Anotações por data e tópico, com opção de compartilhar com o professor.'],
      ],
    },
    teacher: {
      num: 7, title: 'Central de Inteligência do Professor', tag: 'Exclusivo Gabriel Florencio',
      lead: 'Visão panorâmica da turma e dossiês individuais para preparar cada aula com precisão.',
      items: [
        ['Visão geral da turma', 'Níveis, XP, taxa de acerto e alerta de inatividade acima de 5 dias.'],
        ['Dossiê individual', 'Histórico de textos, questões erradas e desempenho nos jogos.'],
        ['Mapa de fragilidades', 'Os tópicos com maior índice de erro de cada aluno.'],
        ['Gerador de pauta', 'Cruza erros recentes e dúvidas do caderno para sugerir a próxima aula.'],
        ['Notas privadas', 'Observações pedagógicas visíveis apenas para você.'],
      ],
      extra: 'A prévia da turma já está disponível na tela Início.',
    },
  };

  function render(main, route) {
    const m = MODULES[route];
    if (!m) { SH.app.notFound(main); return; }
    SH.shell.setActive(route, m.title);
    main.innerHTML = `
      <div class="page">
        <section class="upcoming card">
          <div class="upcoming__art">${SH.illus('blueprint')}</div>
          <div class="upcoming__txt">
            <p class="eyebrow">Módulo ${m.num} · ${m.tag}</p>
            <h1 class="page-title">${m.title}</h1>
            <p class="lead">${m.lead}</p>
            <span class="status status--soon">${SH.icon('layers')}Em construção: chega numa próxima atualização do portal</span>
          </div>
        </section>
        <section class="card">
          <h2 class="card__title">O que vem neste módulo</h2>
          <ul class="upcoming__list">
            ${m.items.map(([t, d]) => `<li><span class="upcoming__dot" aria-hidden="true"></span><span><strong>${t}</strong>${d ? `<small>${d}</small>` : ''}</span></li>`).join('')}
          </ul>
          ${m.extra ? `<p class="note">${SH.icon('info')}<span>${m.extra}</span></p>` : ''}
        </section>
        <div class="next-cta">
          <p>Enquanto isso, continue construindo repertório nas leituras guiadas.</p>
          <a class="btn btn--primary" href="#/reading">Ir para as Trilhas de Leitura ${SH.icon('arrowRight')}</a>
        </div>
      </div>`;
  }

  SH.upcoming = { render };
})(window.SH);

/* Students Hub · Módulo 2: dados dos jogos da Arena (Learn by Playing) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  /* Papéis de cor usados no card "Grammar & Logic Hint" */
  const ROLES = {
    subject: { label: 'Sujeito', cls: 'r-subject' },
    aux: { label: 'Auxiliar / Modal', cls: 'r-aux' },
    verb: { label: 'Verbo / Chunk verbal', cls: 'r-verb' },
    object: { label: 'Complemento', cls: 'r-object' },
    time: { label: 'Tempo / Lugar', cls: 'r-time' },
    link: { label: 'Conector', cls: 'r-link' },
    qword: { label: 'Palavra interrogativa', cls: 'r-qword' },
  };

  /* ---------- Jogo 1: Chunk Builder ---------- */
  const CHUNK_BUILDER = [
    {
      id: 'cb1', cat: 'word-order',
      situation: 'Você encontra um amigo que não vê há muito tempo e diz que estava querendo colocar o papo em dia com ele.',
      blocks: ["I've been meaning to", 'catch up', 'with you', 'for ages'],
      hint: [['subject', "I've been meaning to"], ['verb', 'catch up'], ['object', 'with you'], ['time', 'for ages']],
      explain: 'Em inglês, a expressão de tempo (for ages) costuma fechar a frase. Em português dizemos "faz tempo que eu queria", mas o inglês começa pelo sujeito e pela intenção: I\'ve been meaning to.',
    },
    {
      id: 'cb2', cat: 'modals-politeness',
      situation: 'No trabalho, você pede com educação que um colega mande o relatório até sexta-feira.',
      blocks: ['Could you', 'send me', 'the report', 'by Friday?'],
      hint: [['aux', 'Could you'], ['verb', 'send me'], ['object', 'the report'], ['time', 'by Friday?']],
      explain: 'Pedidos educados abrem com o modal (Could you), seguem com o verbo base e só no fim trazem o prazo. By Friday significa "até sexta", o limite final.',
    },
    {
      id: 'cb3', cat: 'frequency-adverbs',
      situation: 'Você conta que, nos dias de semana, normalmente toma um café rápido antes do trabalho.',
      blocks: ['I usually', 'grab a coffee', 'before work', 'on weekdays'],
      hint: [['subject', 'I usually'], ['verb', 'grab a coffee'], ['time', 'before work'], ['time', 'on weekdays']],
      explain: 'O advérbio de frequência (usually) fica colado antes do verbo principal. As informações de tempo vão para o final, da mais próxima da ação (before work) para a mais geral (on weekdays).',
    },
    {
      id: 'cb4', cat: 'question-formation',
      situation: 'Você pergunta a uma pessoa há quanto tempo ela mora em Dublin.',
      blocks: ['How long', 'have you', 'been living', 'in Dublin?'],
      hint: [['qword', 'How long'], ['aux', 'have you'], ['verb', 'been living'], ['time', 'in Dublin?']],
      explain: 'Perguntas seguem a fórmula: palavra interrogativa + auxiliar + sujeito + verbo. O auxiliar (have) vem antes do sujeito (you). "How long you have been living" é a ordem de afirmação, não de pergunta.',
    },
    {
      id: 'cb5', cat: 'past-continuous',
      situation: 'Você explica que estava dirigindo quando o seu chefe ligou.',
      blocks: ['I was driving', 'when', 'my boss', 'called me'],
      hint: [['verb', 'I was driving'], ['link', 'when'], ['subject', 'my boss'], ['verb', 'called me']],
      explain: 'O cenário em andamento vem no Past Continuous (I was driving) e a ação que interrompe vem no Past Simple depois de when (my boss called me).',
    },
    {
      id: 'cb6', cat: 'conditionals',
      situation: 'Você diz que, se tivesse mais tempo, viajaria mais.',
      blocks: ['If I had', 'more time,', 'I would', 'travel more'],
      hint: [['link', 'If I had'], ['object', 'more time,'], ['aux', 'I would'], ['verb', 'travel more']],
      explain: 'No Second Conditional a condição imaginária vem com If + passado (If I had) e o resultado vem com would + verbo base (I would travel). O would nunca entra na parte do if.',
    },
  ];

  /* ---------- Jogo 2: Context & Preposition Challenge ---------- */
  const CONTEXT_CHALLENGE = [
    { id: 'cc1', cat: 'prepositions', sentence: 'My flight lands ___ 7:30 tomorrow morning.', options: ['in', 'on', 'at'], answer: 2,
      rule: 'Horários exatos usam AT: at 7:30, at noon, at midnight.', hint: [['subject', 'My flight'], ['verb', 'lands'], ['time', 'at + horário exato']] },
    { id: 'cc2', cat: 'prepositions', sentence: "I've lived in this city ___ 2019.", options: ['for', 'since', 'from'], answer: 1,
      rule: 'SINCE marca o ponto de início (since 2019, since Monday). FOR marca a duração (for six years).', hint: [['verb', "I've lived"], ['time', 'since + ponto de início']] },
    { id: 'cc3', cat: 'prepositions', sentence: "We've been waiting ___ forty minutes.", options: ['since', 'for', 'during'], answer: 1,
      rule: 'Duração, quantidade de tempo: FOR. For forty minutes, for two years, for ages.', hint: [['verb', "We've been waiting"], ['time', 'for + duração']] },
    { id: 'cc4', cat: 'verb-choice', sentence: 'Can you ___ me a favor?', options: ['make', 'do', 'give'], answer: 1,
      rule: 'É DO a favor. Em português dizemos "fazer um favor", mas o chunk fixo em inglês usa do.', hint: [['aux', 'Can you'], ['verb', 'do me'], ['object', 'a favor?']] },
    { id: 'cc5', cat: 'verb-choice', sentence: 'I need to ___ a decision by Monday.', options: ['make', 'do', 'take'], answer: 0,
      rule: 'MAKE combina com decisões e criações: make a decision, make a plan, make a mistake.', hint: [['subject', 'I'], ['verb', 'need to make'], ['object', 'a decision'], ['time', 'by Monday']] },
    { id: 'cc6', cat: 'verb-choice', sentence: 'She ___ me that the meeting was cancelled.', options: ['said', 'told', 'spoke'], answer: 1,
      rule: 'TELL pede a pessoa logo depois: tell me, tell him. SAY não leva a pessoa direto: she said that...', hint: [['subject', 'She'], ['verb', 'told me'], ['object', 'that...']] },
    { id: 'cc7', cat: 'verb-choice', sentence: 'He ___ he was too tired to go out.', options: ['told', 'said', 'talked'], answer: 1,
      rule: 'Sem pessoa depois do verbo, usamos SAY: he said (that) he was tired.', hint: [['subject', 'He'], ['verb', 'said'], ['object', '(that) he was tired']] },
    { id: 'cc8', cat: 'prepositions', sentence: "I'll see you ___ Monday, then.", options: ['in', 'on', 'at'], answer: 1,
      rule: 'Dias da semana e datas usam ON: on Monday, on May 5th, on my birthday.', hint: [['verb', "I'll see you"], ['time', 'on + dia']] },
    { id: 'cc9', cat: 'prepositions', sentence: 'My sister was born ___ August.', options: ['in', 'on', 'at'], answer: 0,
      rule: 'Meses, anos e estações usam IN: in August, in 1998, in the summer.', hint: [['subject', 'My sister'], ['verb', 'was born'], ['time', 'in + mês']] },
    { id: 'cc10', cat: 'past-simple', sentence: 'Last night I ___ a great documentary about Ireland.', options: ['watched', 'have watched', 'was watch'], answer: 0,
      rule: 'Com um momento terminado no passado (last night, yesterday, in 2020), usamos Past Simple, nunca Present Perfect.', hint: [['time', 'Last night'], ['subject', 'I'], ['verb', 'watched'], ['object', 'a documentary']] },
  ];

  /* ---------- Jogo 3: Collocation Match ---------- */
  const COLLOCATION_ROUNDS = [
    {
      id: 'round1',
      pairs: [
        { id: 'p1', left: 'make', right: 'an effort', pt: 'se esforçar', example: "I'm making an effort to speak English every day." },
        { id: 'p2', left: 'take', right: 'a look', pt: 'dar uma olhada', example: 'Could you take a look at my presentation?' },
        { id: 'p3', left: 'run out of', right: 'battery', pt: 'ficar sem bateria', example: "Sorry I didn't call, my phone ran out of battery." },
        { id: 'p4', left: 'pay', right: 'attention', pt: 'prestar atenção', example: 'Pay attention to how natives link the words.' },
        { id: 'p5', left: 'keep in', right: 'touch', pt: 'manter contato', example: "Let's keep in touch after the course." },
        { id: 'p6', left: 'break', right: 'the ice', pt: 'quebrar o gelo', example: 'A good question is the best way to break the ice.' },
      ],
      wrongTip: 'Collocations são combinações fixas. Em português "fazer" serve para quase tudo, mas em inglês cada verbo tem seus parceiros preferidos.',
    },
    {
      id: 'round2',
      pairs: [
        { id: 'p7', left: 'catch', right: 'a cold', pt: 'pegar um resfriado', example: 'Take a jacket or you will catch a cold.' },
        { id: 'p8', left: 'do', right: 'the dishes', pt: 'lavar a louça', example: "I'll do the dishes if you cook." },
        { id: 'p9', left: 'give someone', right: 'a hand', pt: 'dar uma mão, ajudar', example: 'Can you give me a hand with these boxes?' },
        { id: 'p10', left: 'save', right: 'money', pt: 'economizar dinheiro', example: "We're saving money for a trip to Portugal." },
        { id: 'p11', left: 'tell', right: 'the truth', pt: 'dizer a verdade', example: 'To be honest, he never tells the truth.' },
        { id: 'p12', left: 'hold on', right: 'a second', pt: 'esperar um instante', example: "Hold on a second, I'll check my calendar." },
      ],
      wrongTip: 'Atenção às traduções diretas: "lavar a louça" é do the dishes, e "pegar um resfriado" é catch a cold. Pense no bloco inteiro, não palavra por palavra.',
    },
  ];

  const GAMES = [
    {
      id: 'chunk-builder', title: 'Chunk Builder', tag: 'Arquitetura de frases reais', illus: 'builder',
      desc: 'Leia a situação em português e toque nos blocos na ordem natural do inglês falado.',
      skill: 'Ordem da frase e chunks', rounds: CHUNK_BUILDER.length,
    },
    {
      id: 'context-challenge', title: 'Context & Preposition Challenge', tag: 'Precisão no contexto', illus: 'target',
      desc: 'Complete situações reais com a preposição, o tempo verbal ou o verbo que costuma confundir brasileiros.',
      skill: 'Preposições, make/do, say/tell', rounds: CONTEXT_CHALLENGE.length,
    },
    {
      id: 'collocation-match', title: 'Collocation Match', tag: 'Conexão lexical', illus: 'match',
      desc: 'Conecte os verbos às expressões que realmente combinam e desbloqueie a frase de aplicação.',
      skill: 'Collocations de alta frequência', rounds: COLLOCATION_ROUNDS.reduce((s, r) => s + r.pairs.length, 0),
    },
  ];

  SH.content = SH.content || {};
  Object.assign(SH.content, {
    ROLES, GAMES, CHUNK_BUILDER, CONTEXT_CHALLENGE, COLLOCATION_ROUNDS,
    game: (id) => GAMES.find((g) => g.id === id) || null,
  });
})(window.SH);

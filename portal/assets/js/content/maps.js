/* Students Hub · Módulo 3: dados dos mapas mentais (renderizados em SVG por modules/maps.js) */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const MAPS = [
    {
      id: 'tenses', title: 'The Real Logic of English Tenses', subtitle: 'Linha do tempo e intenção: escolha o tempo pelo que você quer comunicar.',
      center: ['Tempo', '+ Intenção'],
      branches: [
        { label: 'Presente', color: '#2E9E6B', items: [
          ['Present Simple', 'Rotina e fatos: I work from home on Fridays.'],
          ['Present Continuous', 'Agora ou temporário: I\'m staying with friends this month.'],
          ['Present Perfect', 'Passado ligado ao agora: I\'ve lost my keys.'],
        ] },
        { label: 'Passado', color: '#D9822B', items: [
          ['Past Simple', 'Ação terminada, momento claro: I missed the train yesterday.'],
          ['Past Continuous', 'Cenário em andamento: I was driving when you called.'],
          ['Used to', 'Hábito antigo que acabou: I used to live in Recife.'],
        ] },
        { label: 'Futuro', color: '#6246EA', items: [
          ['Going to', 'Plano já decidido: I\'m going to study tonight.'],
          ['Will', 'Decisão na hora e promessas: I\'ll call you back.'],
          ['Present Continuous', 'Compromisso marcado: I\'m meeting Gabriel at six.'],
        ] },
        { label: 'Hipóteses', color: '#C2417A', items: [
          ['First Conditional', 'Possibilidade real: If it rains, I\'ll stay home.'],
          ['Second Conditional', 'Situação imaginária: If I had time, I\'d travel more.'],
          ['Unless', 'A menos que: I\'ll go unless it rains.'],
        ] },
      ],
    },
    {
      id: 'prepositions', title: 'Prepositions of Time & Place', subtitle: 'Do amplo ao específico: IN para o que é grande, ON para o que é médio, AT para o ponto exato.',
      center: ['IN · ON · AT', 'do amplo ao exato'],
      branches: [
        { label: 'IN · amplo', color: '#2E9E6B', items: [
          ['Tempo longo', 'Meses, anos e estações: in May, in 2025, in the summer.'],
          ['Lugares grandes', 'Cidades e países: in Dublin, in Brazil.'],
          ['Espaço fechado', 'Dentro de algo: in the car, in a taxi, in the kitchen.'],
        ] },
        { label: 'ON · médio', color: '#6246EA', items: [
          ['Dias e datas', 'on Monday, on May 5th, on my birthday.'],
          ['Superfícies', 'on the table, on the wall, on the screen.'],
          ['Transporte coletivo', 'on the bus, on the train, on a plane.'],
        ] },
        { label: 'AT · exato', color: '#D9822B', items: [
          ['Horários', 'at 7:30, at noon, at midnight.'],
          ['Pontos exatos', 'at the bus stop, at the door, at the corner.'],
          ['Lugares de atividade', 'at work, at school, at a party.'],
        ] },
        { label: 'Chunks fixos', color: '#C2417A', items: [
          ['Partes do dia', 'in the morning, in the afternoon, mas at night.'],
          ['Fim de semana', 'at the weekend (UK) e on the weekend (US).'],
          ['Em movimento', 'on my way, in a hurry, on time, in time.'],
        ] },
      ],
    },
    {
      id: 'modals', title: 'Everyday Modals', subtitle: 'Can, could, should, must e might na vida real: o modal muda a intenção da frase.',
      center: ['Modais', 'na vida real'],
      branches: [
        { label: 'Habilidade e pedidos', color: '#6246EA', items: [
          ['Can', 'Habilidade e pedido casual: Can you help me?'],
          ['Could', 'Pedido educado: Could you send me the file?'],
          ['Would you mind...?', 'Muito polido: Would you mind if I opened the window?'],
        ] },
        { label: 'Conselhos', color: '#2E9E6B', items: [
          ['Should', 'Recomendação: You should rest a little.'],
          ['Had better', 'Conselho com alerta: You\'d better leave now.'],
          ['Why don\'t you...?', 'Sugestão amigável: Why don\'t you call her?'],
        ] },
        { label: 'Obrigação', color: '#D9822B', items: [
          ['Must', 'Obrigação interna e forte: I must call my mom today.'],
          ['Have to', 'Regra externa: I have to wear a badge at work.'],
          ['Don\'t have to', 'Não é necessário: You don\'t have to pay.'],
        ] },
        { label: 'Possibilidade', color: '#C2417A', items: [
          ['Might', 'Talvez, pouca certeza: I might be a bit late.'],
          ['May', 'Possibilidade mais formal: It may rain later.'],
          ['Can\'t', 'Dedução negativa: That can\'t be true.'],
        ] },
      ],
    },
    {
      id: 'questions', title: 'Question Formation Formula', subtitle: 'A lógica universal das perguntas: palavra interrogativa + auxiliar + sujeito + verbo.',
      center: ['Q + Aux', '+ Sujeito + Verbo'],
      branches: [
        { label: 'Auxiliares', color: '#6246EA', items: [
          ['Do / Does', 'Presente: Do you work here? Does she live nearby?'],
          ['Did', 'Passado, verbo na base: Did you sleep well?'],
          ['Be', 'Com o verbo to be: Are you ready? Was it expensive?'],
        ] },
        { label: 'Wh-words', color: '#2E9E6B', items: [
          ['What / Where / When', 'Where do you live? When did you arrive?'],
          ['How long', 'Duração: How long have you lived here?'],
          ['Who (sujeito)', 'Sem auxiliar: Who called you?'],
        ] },
        { label: 'Com modais', color: '#D9822B', items: [
          ['Can', 'Can I ask you something?'],
          ['Would', 'Would you like a coffee?'],
          ['Should', 'Should I bring anything?'],
        ] },
        { label: 'Perguntas naturais', color: '#C2417A', items: [
          ['Indireta', 'Mais educada, sem inversão: Do you know where the station is?'],
          ['Tag question', 'Confirmar algo: It\'s cold today, isn\'t it?'],
          ['How come...?', 'Informal, sem inversão: How come you\'re here?'],
        ] },
      ],
    },
  ];

  SH.content = SH.content || {};
  SH.content.MAPS = MAPS;
  SH.content.map = (id) => MAPS.find((m) => m.id === id) || null;
})(window.SH);

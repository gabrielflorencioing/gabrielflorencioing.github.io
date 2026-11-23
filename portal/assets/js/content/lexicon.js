/* Students Hub · Módulo 4: Léxico Funcional da Vida Real */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  const REGISTERS = {
    formal: { label: 'Formal', cls: 'reg--formal' },
    informal: { label: 'Informal', cls: 'reg--informal' },
    neutral: { label: 'Neutro', cls: 'reg--neutral' },
  };

  const THEMES = [
    { id: 'travel', title: 'Viagens e Deslocamentos', desc: 'Aeroporto, hotel, imigração e transporte.' },
    { id: 'work', title: 'Trabalho e Reuniões', desc: 'Calls, e-mails, prazos e alinhamentos.' },
    { id: 'food', title: 'Restaurantes e Cafés', desc: 'Pedidos, restrições e a conta.' },
    { id: 'talk', title: 'Conversas e Opiniões', desc: 'Concordar, discordar e reagir com naturalidade.' },
  ];

  const ITEMS = [
    /* Viagens e Deslocamentos */
    { id: 'lx-t1', theme: 'travel', en: "I'd like to check in, please.", reg: 'neutral', pt: 'Eu gostaria de fazer o check-in, por favor.',
      ex: ["Hi, I'd like to check in, please. The reservation is under Florencio.", "I'd like to check in, please. Is my room ready yet?"] },
    { id: 'lx-t2', theme: 'travel', en: 'Is this seat taken?', reg: 'neutral', pt: 'Esse lugar está ocupado?',
      ex: ['Excuse me, is this seat taken? Can I sit here?', 'Is this seat taken, or are you saving it for someone?'] },
    { id: 'lx-t3', theme: 'travel', en: 'My flight got delayed.', reg: 'informal', pt: 'Meu voo atrasou.',
      ex: ["My flight got delayed, so I'll land around midnight.", 'Sorry I missed dinner, my flight got delayed by three hours.'] },
    { id: 'lx-t4', theme: 'travel', en: 'Could you tell me how to get to...?', reg: 'formal', pt: 'Você poderia me dizer como chego a...?',
      ex: ['Could you tell me how to get to the city center?', 'Could you tell me how to get to platform 4, please?'] },
    { id: 'lx-t5', theme: 'travel', en: "I'm here on vacation.", reg: 'neutral', pt: 'Estou aqui de férias.',
      ex: ["I'm here on vacation for two weeks, visiting friends.", "No, I'm not working. I'm here on vacation."] },
    { id: 'lx-t6', theme: 'travel', en: 'How much is a single to...?', reg: 'neutral', pt: 'Quanto custa uma passagem só de ida para...?',
      ex: ['How much is a single to Porto?', 'How much is a single to the airport, and how long does it take?'] },

    /* Trabalho e Reuniões */
    { id: 'lx-w1', theme: 'work', en: "Let's touch base next week.", reg: 'informal', pt: 'Vamos nos falar rapidinho semana que vem.',
      ex: ["Let's touch base next week to see how the project is going.", "I'm busy today, but let's touch base on Monday."] },
    { id: 'lx-w2', theme: 'work', en: 'Could you walk me through...?', reg: 'formal', pt: 'Você poderia me explicar passo a passo...?',
      ex: ['Could you walk me through the new process?', 'Could you walk me through these numbers before the meeting?'] },
    { id: 'lx-w3', theme: 'work', en: "I'll get back to you on that.", reg: 'neutral', pt: 'Eu te dou um retorno sobre isso.',
      ex: ["Good question. I'll get back to you on that by Friday.", "I'm not sure yet. I'll get back to you on that tomorrow."] },
    { id: 'lx-w4', theme: 'work', en: 'Just to clarify...', reg: 'formal', pt: 'Só para esclarecer...',
      ex: ['Just to clarify, the deadline is the 15th, right?', 'Just to clarify, are we presenting together or separately?'] },
    { id: 'lx-w5', theme: 'work', en: 'Can we push this to Thursday?', reg: 'informal', pt: 'Dá para passar isso para quinta?',
      ex: ["Something came up. Can we push this to Thursday?", 'Can we push this to Thursday? I need more time to prepare.'] },
    { id: 'lx-w6', theme: 'work', en: 'Thanks for flagging this.', reg: 'neutral', pt: 'Obrigado por avisar / por apontar isso.',
      ex: ["Thanks for flagging this. I'll fix it right away.", 'Thanks for flagging this, I had completely missed it.'] },

    /* Restaurantes e Cafés */
    { id: 'lx-f1', theme: 'food', en: 'Can I get a flat white, please?', reg: 'informal', pt: 'Me vê um flat white, por favor?',
      ex: ['Can I get a flat white, please? To go.', 'Hi! Can I get a flat white with oat milk, please?'] },
    { id: 'lx-f2', theme: 'food', en: 'Could we have the check, please?', reg: 'neutral', pt: 'Pode trazer a conta, por favor?',
      ex: ['Excuse me, could we have the check, please?', 'Everything was great. Could we have the check, please?'] },
    { id: 'lx-f3', theme: 'food', en: "I'm allergic to nuts.", reg: 'neutral', pt: 'Tenho alergia a castanhas.',
      ex: ["I'm allergic to nuts. Does this dessert have any?", "Just so you know, I'm allergic to nuts."] },
    { id: 'lx-f4', theme: 'food', en: 'What do you recommend?', reg: 'neutral', pt: 'O que você recomenda?',
      ex: ["It's my first time here. What do you recommend?", 'What do you recommend for someone who loves spicy food?'] },
    { id: 'lx-f5', theme: 'food', en: 'For here or to go?', reg: 'informal', pt: 'Para comer aqui ou para viagem?',
      ex: ['A cappuccino? Sure. For here or to go?', 'To go, please. I\'m running late.'] },
    { id: 'lx-f6', theme: 'food', en: 'Could we get a table for two?', reg: 'neutral', pt: 'Teria uma mesa para dois?',
      ex: ['Hi, could we get a table for two, please?', 'Could we get a table for two by the window?'] },

    /* Conversas e Opiniões */
    { id: 'lx-c1', theme: 'talk', en: 'To be honest...', reg: 'neutral', pt: 'Para ser sincero...',
      ex: ["To be honest, I didn't like the ending.", "To be honest, I'd rather stay home tonight."] },
    { id: 'lx-c2', theme: 'talk', en: 'I see what you mean, but...', reg: 'neutral', pt: 'Entendo o que você quer dizer, mas...',
      ex: ["I see what you mean, but it's too expensive for us.", 'I see what you mean, but I think we need more data.'] },
    { id: 'lx-c3', theme: 'talk', en: 'That makes sense.', reg: 'informal', pt: 'Faz sentido.',
      ex: ['Oh, that makes sense. Thanks for explaining.', "That makes sense. Let's do it your way."] },
    { id: 'lx-c4', theme: 'talk', en: "I couldn't agree more.", reg: 'neutral', pt: 'Concordo totalmente.',
      ex: ["Practice is everything? I couldn't agree more.", "I couldn't agree more. This plan is much better."] },
    { id: 'lx-c5', theme: 'talk', en: "It's not my cup of tea.", reg: 'informal', pt: 'Não é a minha praia.',
      ex: ["Horror movies? Sorry, they're not my cup of tea.", "Jazz is nice, but it's not really my cup of tea."] },
    { id: 'lx-c6', theme: 'talk', en: 'From my point of view...', reg: 'formal', pt: 'Do meu ponto de vista...',
      ex: ['From my point of view, remote work is more productive.', 'From my point of view, we should wait until next quarter.'] },
  ];

  SH.content = SH.content || {};
  Object.assign(SH.content, {
    REGISTERS, LEX_THEMES: THEMES, LEXICON: ITEMS,
    lexItem: (id) => ITEMS.find((i) => i.id === id) || null,
  });
})(window.SH);

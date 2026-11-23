/* Students Hub · Inteligência pedagógica: para onde cada tópico leva e intervenções sugeridas ao professor */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  /** Atalho de prática por tópico: mapa mental e/ou jogo correspondente */
  const PRACTICE = {
    'reading': { map: null, game: null },
    'chunks': { map: null, game: 'chunk-builder' },
    'collocations': { map: null, game: 'collocation-match' },
    'phrasal-verbs': { map: null, game: 'collocation-match' },
    'connectors': { map: 'tenses', game: 'chunk-builder' },
    'present-simple': { map: 'tenses', game: 'chunk-builder' },
    'frequency-adverbs': { map: 'tenses', game: 'chunk-builder' },
    'past-simple': { map: 'tenses', game: 'context-challenge' },
    'past-continuous': { map: 'tenses', game: 'chunk-builder' },
    'prepositions': { map: 'prepositions', game: 'context-challenge' },
    'modals-politeness': { map: 'modals', game: 'chunk-builder' },
    'conditionals': { map: 'tenses', game: 'chunk-builder' },
    'used-to': { map: 'tenses', game: null },
    'word-order': { map: 'questions', game: 'chunk-builder' },
    'question-formation': { map: 'questions', game: 'chunk-builder' },
    'verb-choice': { map: null, game: 'context-challenge' },
  };

  /** Intervenções práticas sugeridas para a próxima aula, por tópico */
  const INTERVENTIONS = {
    'reading': 'Leitura em voz alta de um parágrafo curto com pausas para o aluno resumir com as próprias palavras antes de qualquer correção.',
    'chunks': 'Montar com o aluno um "banco pessoal" de 5 chunks da vida dele e usá-los numa mini conversa simulada de 5 minutos.',
    'collocations': 'Jogo rápido de pares: você diz o verbo, o aluno completa com 2 collocations reais. Validar primeiro os acertos e depois corrigir os calques do português.',
    'phrasal-verbs': 'Trabalhar 3 phrasal verbs por vez dentro de uma história curta do trabalho dele (go over, follow up on, bring up), sem lista solta.',
    'connectors': 'Pedir que o aluno conte um episódio da semana usando at first, after that e in the end, e reformular juntos.',
    'present-simple': 'Entrevista sobre a rotina real do aluno, reforçando o -s de he/she/it com frases sobre pessoas próximas a ele.',
    'frequency-adverbs': 'Escala visual de always a never: o aluno posiciona os próprios hábitos e fala uma frase para cada um.',
    'past-simple': 'Storytelling do último fim de semana com foco em did + verbo base nas negativas e perguntas. Corrigir só depois do relato completo.',
    'past-continuous': 'Desenhar uma linha do tempo com o cenário (was doing) e a interrupção (when + Past Simple) usando uma situação real dele.',
    'prepositions': 'Revisar o mapa IN, ON, AT do amplo ao exato com exemplos da agenda real do aluno: horários, dias e lugares que ele frequenta.',
    'modals-politeness': 'Role-play de reunião: transformar 4 pedidos diretos do aluno em versões polidas com could, would it be possible e would you mind.',
    'conditionals': 'Conversa de "what if" com cenários reais da vida dele, separando possibilidade concreta (will) de imaginação (would).',
    'used-to': 'Comparar "antes e agora" da vida do aluno: 3 frases com used to e 3 com o presente.',
    'word-order': 'Montar frases com cartões de blocos (sujeito, verbo, complemento, tempo) a partir de situações que ele vive no trabalho.',
    'question-formation': 'Aplicar a fórmula Q + auxiliar + sujeito + verbo: o aluno entrevista você com 6 perguntas sobre um tema que ele escolher.',
    'verb-choice': 'Contraste rápido make x do e say x tell com frases do cotidiano dele, pedindo que explique a lógica antes da correção.',
  };

  SH.content = SH.content || {};
  SH.content.PRACTICE = PRACTICE;
  SH.content.INTERVENTIONS = INTERVENTIONS;
})(window.SH);

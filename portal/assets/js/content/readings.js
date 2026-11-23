/* Students Hub · Módulo 1: conteúdo das Trilhas de Leitura Guiada
 * Marcação nos parágrafos: [[texto exibido|id-do-word-bank]] destaca o chunk e liga ao Word Bank.
 */
window.SH = window.SH || {};

(function (SH) {
  'use strict';

  /* ---------- Taxonomia de níveis, eixos e tópicos ---------- */
  const LEVELS = {
    A1: { code: 'A1', name: 'A1 Foundation', short: 'Foundation' },
    A2: { code: 'A2', name: 'A2 Elementary', short: 'Elementary' },
    B1: { code: 'B1', name: 'B1 Intermediate', short: 'Intermediate' },
    B2: { code: 'B2', name: 'B2 Upper-Intermediate', short: 'Upper-Intermediate' },
  };

  const AXES = [
    { id: 'routines', n: 1, title: 'Daily Rhythms & Real Routines', focus: 'Present Simple, advérbios de frequência e chunks de rotina' },
    { id: 'memories', n: 2, title: 'Memories, Trips & Past Experiences', focus: 'Past Simple vs. Past Continuous e conectores narrativos' },
    { id: 'plans', n: 3, title: 'Plans, Decisions & Future Scenarios', focus: 'Going to, Will e Present Continuous para futuro' },
    { id: 'work', n: 4, title: 'Work, Meetings & Professional Communication', focus: 'Modais de polidez, e-mails e collocations corporativas' },
    { id: 'health', n: 5, title: 'Health, Food & Everyday Problem Solving', focus: 'Quantifiers, pedidos, sintomas e soluções práticas' },
    { id: 'opinions', n: 6, title: 'Opinions, Habits & Hypothetical Situations', focus: 'First & Second Conditionals e marcadores de discurso' },
  ];

  /** skill: reading | lexical | grammar  (alimenta o Perfil Cognitivo na Etapa 4) */
  const TOPICS = {
    'reading': { label: 'Interpretação de texto', skill: 'reading' },
    'chunks': { label: 'Chunks e expressões naturais', skill: 'lexical' },
    'collocations': { label: 'Collocations', skill: 'lexical' },
    'phrasal-verbs': { label: 'Phrasal Verbs', skill: 'lexical' },
    'connectors': { label: 'Conectores e marcadores de discurso', skill: 'lexical' },
    'present-simple': { label: 'Present Simple', skill: 'grammar' },
    'frequency-adverbs': { label: 'Advérbios de frequência', skill: 'grammar' },
    'past-simple': { label: 'Past Simple', skill: 'grammar' },
    'past-continuous': { label: 'Past Continuous', skill: 'grammar' },
    'prepositions': { label: 'Preposições', skill: 'grammar' },
    'modals-politeness': { label: 'Modais de polidez', skill: 'grammar' },
    'conditionals': { label: 'Condicionais', skill: 'grammar' },
    'used-to': { label: 'Used to (hábitos no passado)', skill: 'grammar' },
  };

  const QTYPES = {
    reading: 'Interpretação',
    chunk: 'Chunk em contexto',
    grammar: 'Estrutura no texto',
    meaning: 'Equivalência natural',
  };

  /* =====================================================================
   * UNIDADE 1 · A1 · Daily Rhythms & Real Routines
   * ===================================================================== */
  const U1 = {
    id: 'a1-routines-tuesday',
    level: 'A1',
    axis: 'routines',
    illus: 'routine',
    title: "Marina's Ordinary Tuesday",
    subtitle: 'Uma terça-feira comum em Curitiba, contada com hábitos pequenos e chunks de rotina que você usa todos os dias.',
    focus: ['Present Simple', 'Advérbios de frequência', 'Chunks de rotina'],
    paragraphs: [
      `My name is Marina, and I live in Curitiba, in the south of Brazil. I am 29 years old, and I work as a receptionist at a dental clinic. People often ask me about my routine, so here is a normal Tuesday in my life.`,
      `My alarm rings at 6:15, but I usually [[hit the snooze button|snooze]] one time. I am not an [[early bird|earlybird]]! At 6:25, I [[wake up|wakeup]] for real. I open the window, I check the weather, and I drink a big glass of water. Then I take a quick shower and [[get ready|getready]] for work. I never wear make-up on weekdays, because I don't have time.`,
      `I don't eat a big breakfast. I usually [[grab a coffee|grabcoffee]] and a piece of bread with cheese. My husband, Lucas, always makes the coffee. He wakes up before me, so it is ready when I go to the kitchen. That is my favorite part of the morning.`,
      `At 7:10, I leave home and [[catch the bus|catchbus]]. The bus stop is near my building, and the trip takes about forty minutes. [[On my way to work|onmyway]], I listen to podcasts in English. Sometimes I understand everything, and sometimes I understand only a few words, but I listen every day. It is a small habit, but it helps me a lot.`,
      `The clinic opens at 8:00. I answer the phone, I book appointments, and I talk to patients. Most patients are very nice, but some are nervous. I try to be calm and friendly with everybody. At 12:30, I [[have lunch|havelunch]] with my colleagues in a small restaurant next to the clinic. We usually talk about our weekend plans or about TV series.`,
      `In the afternoon, the clinic is busier. At 3:30, I [[take a break|takebreak]] for fifteen minutes. I drink tea, I check my messages, and I stretch my back. Then I work until 6:00.`,
      `I [[get home|gethome]] at about 7:00. On Tuesdays, I don't cook, because Lucas has a free evening and he loves cooking. We have dinner together, and after dinner we sometimes go for a walk around the neighborhood. On some Tuesdays, I [[hang out with|hangout]] my sister, Paula. She lives five minutes from me, and we often watch a movie at her place.`,
      `At around 10:00, I start to [[wind down|winddown]]. I turn off the TV, I put my phone on the table, and I read a book for twenty minutes. I rarely use my phone in bed, because it keeps me awake. I [[go to bed|gotobed]] at 10:45 [[most days|mostdays]].`,
      `My Tuesday is not exciting, but I like it. It is simple, organized, and full of small, happy moments.`,
    ],
    wordBank: [
      { id: 'snooze', en: 'hit the snooze button', pron: 'rít dhâ SNÚUZ bâ-tân', pt: 'apertar o "soneca" do despertador', example: 'I hit the snooze button three times this morning, so I skipped breakfast.' },
      { id: 'earlybird', en: 'early bird', pron: 'ÂR-li bârd', pt: 'pessoa matinal, que acorda cedo com disposição', example: 'My boss is an early bird. She answers emails at 6 a.m.' },
      { id: 'wakeup', en: 'wake up', pron: 'uêik ÂP', pt: 'acordar (abrir os olhos)', example: 'What time do you usually wake up on Sundays?' },
      { id: 'getready', en: 'get ready', pron: 'guét RÉ-di', pt: 'se arrumar, se aprontar', example: "Give me ten minutes to get ready and I'll meet you downstairs." },
      { id: 'grabcoffee', en: 'grab a coffee', pron: 'grééb â CÓ-fi', pt: 'tomar um café rápido, pegar um café', example: 'Do you want to grab a coffee after class?' },
      { id: 'catchbus', en: 'catch the bus', pron: 'kétch dhâ BÂS', pt: 'pegar o ônibus', example: "I need to leave now or I won't catch the last bus." },
      { id: 'onmyway', en: 'on my way to work', pron: 'ón mai UÊI tchu uârk', pt: 'a caminho do trabalho', example: 'I usually call my mom on my way to work.' },
      { id: 'havelunch', en: 'have lunch', pron: 'rév LÂNTCH', pt: 'almoçar', example: "Let's have lunch together on Friday." },
      { id: 'takebreak', en: 'take a break', pron: 'têik â BRÊIK', pt: 'fazer uma pausa, dar um tempo', example: "You look tired. Why don't you take a break?" },
      { id: 'gethome', en: 'get home', pron: 'guét RÔUM', pt: 'chegar em casa (sem "to" antes de home)', example: 'Text me when you get home, okay?' },
      { id: 'hangout', en: 'hang out with', pron: 'rêng ÁUT uidh', pt: 'sair com, passar um tempo com alguém', example: 'I hang out with my cousins almost every weekend.' },
      { id: 'winddown', en: 'wind down', pron: 'uáind DÁUN', pt: 'desacelerar, relaxar no fim do dia', example: 'Reading helps me wind down after a long day.' },
      { id: 'gotobed', en: 'go to bed', pron: 'gôu tchu BÉD', pt: 'ir dormir, ir para a cama', example: 'I try to go to bed before midnight.' },
      { id: 'mostdays', en: 'most days', pron: 'MÔUST dêiz', pt: 'na maioria dos dias, quase sempre', example: 'Most days I walk to work, but today I took a taxi.' },
    ],
    questions: [
      {
        id: 'q1', type: 'reading', cat: 'reading',
        prompt: 'Why does Marina usually get up at 6:25 and not at 6:15?',
        options: ['Because her husband wakes her up late.', 'Because she hits the snooze button once.', 'Because the bus leaves at 6:25.', 'Because the clinic opens later on Tuesdays.'],
        answer: 1,
        explain: 'O texto diz: "My alarm rings at 6:15, but I usually hit the snooze button one time." O despertador toca às 6:15, ela aperta o soneca uma vez e só acorda de verdade às 6:25.',
      },
      {
        id: 'q2', type: 'reading', cat: 'reading',
        prompt: 'Who makes the coffee in Marina\'s house?',
        options: ['Marina, before her shower.', 'Paula, her sister.', 'Lucas, her husband.', 'Nobody: she buys coffee at the clinic.'],
        answer: 2,
        explain: '"My husband, Lucas, always makes the coffee." O advérbio always mostra que é um hábito fixo dele, e por isso o café já está pronto quando ela chega à cozinha.',
      },
      {
        id: 'q3', type: 'meaning', cat: 'chunks',
        prompt: 'Marina says: "I am not an early bird!" What is the most natural meaning in Portuguese?',
        options: ['Eu não sou uma pessoa matinal.', 'Eu não sou um pássaro madrugador.', 'Eu não chego cedo ao trabalho.', 'Eu não gosto de passarinhos.'],
        answer: 0,
        explain: '"Early bird" é um chunk fixo para quem acorda cedo com disposição. A tradução palavra por palavra (pássaro madrugador) não funciona: o falante nativo pensa no bloco inteiro como "pessoa matinal".',
      },
      {
        id: 'q4', type: 'grammar', cat: 'frequency-adverbs',
        prompt: 'Complete: "I ___ use my phone in bed, because it keeps me awake."',
        options: ['always', 'usually', 'often', 'rarely'],
        answer: 3,
        explain: 'A segunda parte da frase dá o motivo: o celular a deixa acordada. Então ela quase nunca usa o celular na cama: rarely (raramente). Always, usually e often indicam frequência alta e contradizem o motivo.',
      },
      {
        id: 'q5', type: 'grammar', cat: 'present-simple',
        prompt: 'Complete with the form used in the text: "Lucas ___ cooking."',
        options: ['love', 'loves', 'is love', 'loving'],
        answer: 1,
        explain: 'No Present Simple, com he, she e it, o verbo ganha -s: he loves, she works, it opens. Repare no texto: "He wakes up before me", "She lives five minutes from me", "The clinic opens at 8:00".',
      },
      {
        id: 'q6', type: 'chunk', cat: 'chunks',
        prompt: 'Complete the chunk: "I usually ___ a coffee and a piece of bread with cheese."',
        options: ['catch', 'grab', 'take on', 'make up'],
        answer: 1,
        explain: '"Grab a coffee" é o chunk natural para tomar ou pegar um café rápido, sem cerimônia. Catch combina com transportes (catch the bus), e take on e make up têm outros significados.',
      },
      {
        id: 'q7', type: 'grammar', cat: 'prepositions',
        prompt: 'Complete: "I listen to podcasts ___ my way to work."',
        options: ['in', 'at', 'on', 'by'],
        answer: 2,
        explain: 'O chunk é fixo: on my way (to work, home, to school). Pense nele como um bloco pronto. Ao contrário do português "no meu caminho", em inglês usamos on, e não in.',
      },
      {
        id: 'q8', type: 'reading', cat: 'reading',
        prompt: 'What does Marina do during her afternoon break?',
        options: ['She drinks tea, checks her messages and stretches her back.', 'She calls Lucas and plans dinner.', 'She listens to podcasts in English.', 'She books appointments for patients.'],
        answer: 0,
        explain: '"At 3:30, I take a break for fifteen minutes. I drink tea, I check my messages, and I stretch my back." Os podcasts acontecem no ônibus, e marcar consultas faz parte do trabalho, não da pausa.',
      },
      {
        id: 'q9', type: 'grammar', cat: 'frequency-adverbs',
        prompt: 'Which sentence has the natural word order?',
        options: ['I wear never make-up on weekdays.', 'Never I wear make-up on weekdays.', 'I never wear make-up on weekdays.', 'I wear make-up never on weekdays.'],
        answer: 2,
        explain: 'Advérbios de frequência (always, usually, often, sometimes, rarely, never) ficam antes do verbo principal: I never wear, I usually grab, we often watch. Com o verbo to be, ficam depois: I am never late.',
      },
      {
        id: 'q10', type: 'meaning', cat: 'chunks',
        prompt: '"At around 10:00, I start to wind down." What does Marina mean?',
        options: ['She starts to clean the house.', 'She starts to relax and slow down before sleeping.', 'She starts to feel sick.', 'She starts to turn off all the lights in the street.'],
        answer: 1,
        explain: '"Wind down" significa desacelerar, relaxar aos poucos. O próprio texto confirma: ela desliga a TV, larga o celular e lê um livro. É a preparação para dormir.',
      },
    ],
  };

  /* =====================================================================
   * UNIDADE 2 · A2 · Memories, Trips & Past Experiences
   * ===================================================================== */
  const U2 = {
    id: 'a2-memories-lisbon',
    level: 'A2',
    axis: 'memories',
    illus: 'trip',
    title: 'The Day I Missed My Train in Lisbon',
    subtitle: 'Um relato de viagem real: um alarme esquecido, um trem perdido e um encontro inesperado num café em Lisboa.',
    focus: ['Past Simple', 'Past Continuous', 'Conectores narrativos'],
    paragraphs: [
      `Last year, I went to Portugal for the first time. I was there for ten days, and I visited Lisbon, Porto and a small town called Sintra. The trip was amazing, but one day did not go as planned, and it is now my favorite story to tell.`,
      `It was a Saturday morning in May. I was staying at a small hostel in the center of Lisbon, and I had a train ticket to Porto at 9:40. The night before, I [[stayed up late|stayuplate]] with some people from the hostel. We were talking, laughing and sharing travel stories until almost two in the morning. When I finally went to bed, I forgot to [[set my alarm|setalarm]].`,
      `I woke up at 9:05. For a second, I didn't understand where I was. Then I looked at my phone and panicked. I packed my bag [[in a hurry|hurry]], ran down the stairs and [[took a taxi|taxi]] to the station. While the taxi driver was looking for a shortcut, I was checking the time every thirty seconds. I [[was running late|runninglate]], and I knew it.`,
      `We arrived at the station at 9:43. I ran to the platform, but the train was already leaving. I [[missed the train|misstrain]] by three minutes. I stood there with my backpack, tired and frustrated, while other passengers were walking calmly around me.`,
      `[[At first|atfirst]], I wanted to cry. [[After that|afterthat]], I went to the ticket office. The woman at the counter was very kind. She explained that the next train was at 1:15, and that I needed to pay a small fee to change my ticket. I paid the fee, bought a coffee and a pastel de nata, and sat down in a small café near the station.`,
      `[[That's when|thatswhen]] something unexpected happened. While I was eating, an old man at the next table [[started a conversation with|startconv]] me. His name was Joaquim, and he was a retired history teacher. He noticed my Brazilian accent and asked me where I was from. We talked for almost two hours. He told me stories about the city, recommended places in Porto and even wrote a list of restaurants on a napkin. I still have that napkin today.`,
      `When I finally [[got on the train|getontrain]] at 1:15, I was [[in a very good mood|goodmood]]. I was not angry anymore. I realized that missing the train gave me one of the best moments of the trip.`,
      `[[In the end|intheend]], I learned two lessons. First, always set an alarm before a travel day. Second, sometimes the plan goes wrong for a good reason. Now, every time I am running late for something, I remember Joaquim and his napkin, and I try to stay calm.`,
    ],
    wordBank: [
      { id: 'stayuplate', en: 'stay up late', pron: 'stêi âp LÊIT', pt: 'ficar acordado até tarde', example: "I stayed up late watching a series, and now I'm exhausted." },
      { id: 'setalarm', en: 'set an alarm', pron: 'sét ân â-LÁRM', pt: 'colocar o despertador, programar o alarme', example: "Don't forget to set an alarm. Our flight is at 7." },
      { id: 'hurry', en: 'in a hurry', pron: 'in â RÂ-ri', pt: 'com pressa, às pressas', example: "Sorry, I can't talk now. I'm in a hurry." },
      { id: 'taxi', en: 'take a taxi', pron: 'têik â TÉK-si', pt: 'pegar um táxi', example: 'It was raining, so we took a taxi to the restaurant.' },
      { id: 'runninglate', en: 'be running late', pron: 'bi RÂ-ning lêit', pt: 'estar atrasado (ainda a caminho)', example: "I'm running late. I'll be there in fifteen minutes." },
      { id: 'misstrain', en: 'miss the train', pron: 'MIS dhâ trêin', pt: 'perder o trem', example: "If we don't leave now, we'll miss the train." },
      { id: 'atfirst', en: 'at first', pron: 'ét FÂRST', pt: 'no começo, a princípio (antes de algo mudar)', example: "At first I didn't like the city, but now I love it." },
      { id: 'afterthat', en: 'after that', pron: 'ÉF-târ dhét', pt: 'depois disso, em seguida', example: 'We had dinner. After that, we went for a walk on the beach.' },
      { id: 'thatswhen', en: "that's when", pron: 'DHÉTS uén', pt: 'foi aí que, foi nessa hora que', example: "I saw the price. That's when I decided to cancel." },
      { id: 'startconv', en: 'start a conversation with', pron: 'stárt â cón-vâr-SÊI-shân uidh', pt: 'puxar conversa com', example: "It's easy to start a conversation with people at a hostel." },
      { id: 'getontrain', en: 'get on the train', pron: 'guét ón dhâ TRÊIN', pt: 'entrar no trem, embarcar', example: "Get on the train at the front. It's less crowded." },
      { id: 'goodmood', en: 'in a good mood', pron: 'in â gud MÚUD', pt: 'de bom humor', example: "You're in a good mood today. What happened?" },
      { id: 'intheend', en: 'in the end', pron: 'in dhi ÉND', pt: 'no fim das contas, no final', example: 'We got lost three times, but in the end we found the hotel.' },
    ],
    questions: [
      {
        id: 'q1', type: 'reading', cat: 'reading',
        prompt: 'Why did the narrator wake up late?',
        options: ['The hostel was too noisy.', 'The taxi driver called him late.', 'He forgot to set his alarm after staying up late.', 'His phone was broken.'],
        answer: 2,
        explain: 'O texto conecta duas causas: ele ficou acordado até quase duas da manhã (stayed up late) e, ao deitar, "I forgot to set my alarm". Nenhum outro motivo aparece no relato.',
      },
      {
        id: 'q2', type: 'grammar', cat: 'past-continuous',
        prompt: 'Complete: "While the taxi driver ___ for a shortcut, I was checking the time."',
        options: ['looked', 'was looking', 'is looking', 'were looking'],
        answer: 1,
        explain: 'Duas ações em andamento ao mesmo tempo no passado pedem Past Continuous nas duas partes: was looking e was checking. While costuma anunciar essa ação em progresso. Com he, she ou the driver, usamos was, nunca were.',
      },
      {
        id: 'q3', type: 'grammar', cat: 'past-simple',
        prompt: 'Complete: "Last year, I ___ to Portugal for the first time."',
        options: ['go', 'goed', 'was go', 'went'],
        answer: 3,
        explain: 'Last year marca um momento terminado no passado, então usamos Past Simple. Go é irregular: go, went, gone. Formas como goed ou was go não existem em inglês.',
      },
      {
        id: 'q4', type: 'grammar', cat: 'past-simple',
        prompt: 'Which sentence is correct, as in the text?',
        options: ['One day did not go as planned.', 'One day did not went as planned.', 'One day not went as planned.', 'One day was not go as planned.'],
        answer: 0,
        explain: 'Na negativa do Past Simple, o passado fica no auxiliar did, e o verbo principal volta para a forma base: did not go, didn\'t understand, didn\'t eat. Por isso did not went está errado: o passado apareceria duas vezes.',
      },
      {
        id: 'q5', type: 'grammar', cat: 'prepositions',
        prompt: 'Complete: "When I finally got ___ the train at 1:15, I was in a very good mood."',
        options: ['on', 'in', 'at', 'into the'],
        answer: 0,
        explain: 'Para transportes coletivos e grandes, em que você pode ficar de pé e andar (train, bus, plane, ship), usamos on: get on the train. Para carro e táxi, usamos in: get in a taxi.',
      },
      {
        id: 'q6', type: 'grammar', cat: 'prepositions',
        prompt: 'Complete: "It was a Saturday morning ___ May."',
        options: ['on', 'in', 'at', 'of'],
        answer: 1,
        explain: 'Meses, anos e estações usam in: in May, in 2024, in the summer. Dias específicos usam on (on Saturday) e horários usam at (at 9:40). Pense do mais amplo para o mais específico: in, on, at.',
      },
      {
        id: 'q7', type: 'reading', cat: 'reading',
        prompt: 'Who was Joaquim?',
        options: ['The taxi driver.', 'A worker at the ticket office.', 'A retired history teacher he met at a café.', 'A friend from the hostel.'],
        answer: 2,
        explain: '"His name was Joaquim, and he was a retired history teacher." Ele estava na mesa ao lado, no café perto da estação, e puxou conversa ao perceber o sotaque brasileiro.',
      },
      {
        id: 'q8', type: 'chunk', cat: 'connectors',
        prompt: 'Complete: "___, I wanted to cry. After that, I went to the ticket office."',
        options: ['In the end', 'At first', "That's when", 'Since'],
        answer: 1,
        explain: 'At first mostra o primeiro sentimento, antes de a situação mudar. In the end indicaria a conclusão da história, e não o começo. Conectores narrativos organizam a ordem: at first, after that, that\'s when, in the end.',
      },
      {
        id: 'q9', type: 'meaning', cat: 'chunks',
        prompt: '"I was running late, and I knew it." What does it mean?',
        options: ['Eu estava correndo tarde da noite.', 'Eu estava atrasado.', 'Eu corria devagar.', 'Eu tinha saído cedo demais.'],
        answer: 1,
        explain: '"Be running late" é o chunk natural para "estar atrasado, ainda a caminho". Não tem relação com correr de verdade. É muito comum em mensagens: "Sorry, I\'m running late!"',
      },
      {
        id: 'q10', type: 'reading', cat: 'reading',
        prompt: 'What is the main idea of the last paragraph?',
        options: ['Trains in Portugal are always late.', 'He never wants to travel alone again.', 'Sometimes a plan goes wrong for a good reason.', 'Taxis are faster than trains.'],
        answer: 2,
        explain: 'A segunda lição do texto é a mensagem central: "sometimes the plan goes wrong for a good reason". Perder o trem levou ao encontro com Joaquim, um dos melhores momentos da viagem.',
      },
    ],
  };

  /* =====================================================================
   * UNIDADE 3 · B1 · Work, Meetings & Professional Communication
   * ===================================================================== */
  const U3 = {
    id: 'b1-work-polite-emails',
    level: 'B1',
    axis: 'work',
    illus: 'meeting',
    title: 'The Email That Taught Me About Tone',
    subtitle: 'Como uma analista brasileira descobriu que o problema não era a gramática, e sim o tom, ao trabalhar com um time em Toronto.',
    focus: ['Modais de polidez', 'Phrasal verbs de trabalho', 'Collocations corporativas'],
    paragraphs: [
      `When I started working with a team in Toronto, my English was good enough to understand everything in meetings. Grammar was not my problem. My problem was tone. I didn't know it yet, but I sounded rude.`,
      `I work as a project analyst for a logistics company in São Paulo. Two years ago, my company started a partnership with a Canadian client, and I became the main contact for their operations team. In my first week, I wrote an email to Daniel, their project manager. It said: "Send me the report today. I need it for the meeting." To me, it was a clear and efficient message. In Portuguese, with a "por favor" and a friendly emoji, it would sound totally normal.`,
      `Daniel replied with one short line: "Sure. Is everything OK?" I didn't understand his question until my manager, Patrícia, read the email and laughed. "Camila, you're not giving orders to your little brother," she said. Then she showed me how native speakers usually make requests at work.`,
      `[[Instead of|insteadof]] "Send me the report", she wrote: "[[Could you|couldyou]] send me the report [[by the end of the day|endofday]]? I'd like to [[go over|goover]] it before our meeting." Instead of "I need more time", she suggested: "[[Would it be possible to|possible]] [[push the deadline|pushdeadline]] to Friday?" And instead of "You are wrong", she taught me to say: "[[I see your point|seepoint]], but I'm not sure that works for us."`,
      `At first, these phrases felt too long and a little fake. Why use ten words when four are enough? But Patrícia explained something important. In professional English, indirect language is not weakness. It shows respect and keeps the relationship comfortable, especially when you are asking for something or disagreeing.`,
      `Over the next months, I collected these chunks in a notebook. I learned to [[set up a meeting|setupmeeting]] instead of "mark a meeting", to [[follow up on|followup]] an email instead of "charge an answer", and to [[bring up|bringup]] a problem instead of "put a problem on the table". When something was not clear, I started saying: "Just to make sure we're [[on the same page|samepage]]..." and people immediately relaxed.`,
      `The biggest change happened in a meeting last March. Our team was going to miss an important deadline, and I had to tell the client. A year before, I would have said: "We can't do it." This time, I said: "I'm afraid we're [[running behind schedule|behindschedule]] on this phase. [[Would you mind if|wouldyoumind]] we moved the delivery to next Wednesday? I'll [[keep you posted|keepposted]] every day." Daniel thanked me for the transparency, and the meeting ended in fifteen minutes.`,
      `Today, people in Toronto describe me as clear and easy to work with. My grammar is almost the same. What changed was my repertoire of real, polite chunks.`,
    ],
    wordBank: [
      { id: 'couldyou', en: 'Could you...?', pron: 'KÚD-iu', pt: 'Você poderia...? (pedido educado)', example: 'Could you share your screen, please?' },
      { id: 'endofday', en: 'by the end of the day', pron: 'bai dhi ÉND âv dhâ dêi', pt: 'até o fim do dia', example: "I'll send you the final version by the end of the day." },
      { id: 'goover', en: 'go over', pron: 'gôu ÔU-vâr', pt: 'revisar, repassar com atenção', example: "Let's go over the main points before the client arrives." },
      { id: 'possible', en: 'Would it be possible to...?', pron: 'uúd it bi PÓ-si-bâl tchu', pt: 'Seria possível...?', example: 'Would it be possible to reschedule our call to Thursday?' },
      { id: 'pushdeadline', en: 'push the deadline', pron: 'PÚSH dhâ DÉD-lain', pt: 'adiar o prazo, empurrar a entrega', example: 'The client agreed to push the deadline to next month.' },
      { id: 'seepoint', en: 'I see your point', pron: 'ai SÍ iór póint', pt: 'Entendo seu ponto de vista', example: 'I see your point, but the budget is already very tight.' },
      { id: 'insteadof', en: 'instead of', pron: 'in-STÉD âv', pt: 'em vez de, no lugar de', example: "Instead of sending another email, let's just call him." },
      { id: 'setupmeeting', en: 'set up a meeting', pron: 'sét ÂP â MÍ-ting', pt: 'marcar, organizar uma reunião', example: "I'll set up a meeting with the finance team for Monday." },
      { id: 'followup', en: 'follow up on', pron: 'FÓ-lou âp ón', pt: 'dar seguimento a, cobrar um retorno com educação', example: "I'm just following up on my email from last week." },
      { id: 'bringup', en: 'bring up', pron: 'bring ÂP', pt: 'mencionar, levantar um assunto', example: "Can I bring up something that isn't on the agenda?" },
      { id: 'samepage', en: 'on the same page', pron: 'ón dhâ sêim PÊIDJ', pt: 'alinhados, com o mesmo entendimento', example: "Let's review the plan to make sure everyone is on the same page." },
      { id: 'behindschedule', en: 'running behind schedule', pron: 'RÂ-ning bi-RÁIND SKÉ-djul', pt: 'atrasado em relação ao cronograma', example: 'The construction is running behind schedule because of the rain.' },
      { id: 'wouldyoumind', en: 'Would you mind if...?', pron: 'uúd iu MÁIND if', pt: 'Você se importaria se...?', example: 'Would you mind if I recorded this meeting?' },
      { id: 'keepposted', en: 'keep you posted', pron: 'KÍP iu PÔUS-tid', pt: 'te manter informado', example: "I don't have an answer yet, but I'll keep you posted." },
    ],
    questions: [
      {
        id: 'q1', type: 'reading', cat: 'reading',
        prompt: 'According to Camila, what was her real problem at the beginning?',
        options: ['Her grammar was weak.', 'She could not understand the meetings.', 'Her tone sounded rude.', 'She wrote very long emails.'],
        answer: 2,
        explain: 'Logo no início: "Grammar was not my problem. My problem was tone. I didn\'t know it yet, but I sounded rude." Ela entendia tudo; o que soava mal era a forma direta demais de pedir.',
      },
      {
        id: 'q2', type: 'grammar', cat: 'modals-politeness',
        prompt: 'Which is the most natural way to ask a colleague for a report?',
        options: ['You send me the report Friday.', 'Could you send me the report by Friday?', 'I want that you send me the report Friday.', 'Can you to send me the report on Friday?'],
        answer: 1,
        explain: 'Could you + verbo base é a estrutura padrão de pedido educado. "I want that you..." é calque do português e não existe. Depois de can ou could, nunca usamos to. E by Friday significa "até sexta", o prazo-limite.',
      },
      {
        id: 'q3', type: 'chunk', cat: 'phrasal-verbs',
        prompt: 'Complete: "I\'d like to ___ the numbers before the meeting."',
        options: ['go over', 'go on', 'look after', 'turn down'],
        answer: 0,
        explain: 'Go over = revisar com atenção. Go on significa continuar, look after significa cuidar de alguém, e turn down significa recusar. Phrasal verbs mudam de sentido com a partícula, por isso vale aprender cada um como um bloco.',
      },
      {
        id: 'q4', type: 'chunk', cat: 'phrasal-verbs',
        prompt: 'The client didn\'t reply. What do you write?',
        options: ['"I\'m just charging an answer about my email."', '"I\'m just following up on my email from Monday."', '"I\'m just following on my email from Monday."', '"I\'m just making up my email from Monday."'],
        answer: 1,
        explain: '"Follow up on" é o jeito profissional de retomar um assunto sem pressionar. "Charge an answer" é tradução literal de "cobrar resposta" e não faz sentido em inglês. Make up significa inventar ou fazer as pazes.',
      },
      {
        id: 'q5', type: 'chunk', cat: 'phrasal-verbs',
        prompt: 'Complete: "I need to ___ a problem with the budget in today\'s meeting."',
        options: ['bring on', 'take off', 'bring up', 'put down'],
        answer: 2,
        explain: 'Bring up = mencionar, levantar um assunto. No texto, Camila troca "put a problem on the table" por "bring up a problem". Take off significa decolar ou tirar uma peça de roupa; put down pode significar menosprezar alguém.',
      },
      {
        id: 'q6', type: 'chunk', cat: 'collocations',
        prompt: 'Complete: "Let\'s ___ a meeting for Thursday morning."',
        options: ['mark', 'set up', 'do', 'make up'],
        answer: 1,
        explain: '"Mark a meeting" é tradução de "marcar reunião" e soa estranho. As collocations naturais são set up a meeting, schedule a meeting ou arrange a meeting.',
      },
      {
        id: 'q7', type: 'grammar', cat: 'modals-politeness',
        prompt: 'Complete in the most polite form: "Would you mind if we ___ the delivery to Wednesday?"',
        options: ['moved', 'will move', 'moving', 'to move'],
        answer: 0,
        explain: 'Com "Would you mind if...", a forma mais polida usa o verbo no passado: moved. O passado aqui não indica tempo, ele cria distância e suaviza o pedido. No dia a dia você também ouvirá "if we move", mas will move e to move não funcionam.',
      },
      {
        id: 'q8', type: 'reading', cat: 'reading',
        prompt: 'Why did Daniel thank Camila in the meeting last March?',
        options: ['For finishing the project early.', 'For her transparency about the delay.', 'For sending the report on time.', 'For speaking perfect English.'],
        answer: 1,
        explain: '"Daniel thanked me for the transparency." Ela avisou do atraso com educação, propôs uma nova data e prometeu atualizações diárias. A comunicação clara foi o que gerou confiança.',
      },
      {
        id: 'q9', type: 'meaning', cat: 'chunks',
        prompt: '"Just to make sure we\'re on the same page..." When do people say this?',
        options: ['To confirm that everybody understands the same thing.', 'To ask someone to read the same page of a document.', 'To end a meeting quickly.', 'To complain about a colleague.'],
        answer: 0,
        explain: '"On the same page" significa estar alinhado, com o mesmo entendimento. É um chunk usado para confirmar acordos sem soar desconfiado. Não tem nada a ver com página física.',
      },
      {
        id: 'q10', type: 'grammar', cat: 'modals-politeness',
        prompt: 'Which is the best way to disagree politely in a meeting?',
        options: ['"You are wrong about this."', '"No. This is not correct."', '"I see your point, but I\'m not sure that works for us."', '"Your idea is bad for us."'],
        answer: 2,
        explain: 'Primeiro você valida o outro (I see your point) e depois apresenta a discordância de forma suavizada (I\'m not sure that works for us). É exatamente a técnica que Patrícia ensinou: linguagem indireta mostra respeito.',
      },
    ],
  };

  /* =====================================================================
   * UNIDADE 4 · B2 · Opinions, Habits & Hypothetical Situations
   * ===================================================================== */
  const U4 = {
    id: 'b2-opinions-abroad',
    level: 'B2',
    axis: 'opinions',
    illus: 'abroad',
    title: 'If I Could Talk to Myself in My First Year Abroad',
    subtitle: 'Seis anos depois de se mudar de Recife para Dublin, Thiago reflete sobre o que faria diferente, e sobre o que não mudaria.',
    focus: ['First & Second Conditionals', 'Marcadores de discurso', 'Used to'],
    paragraphs: [
      `Six years ago, I moved from Recife to Dublin with two suitcases, a student visa and a very optimistic idea of what life abroad would be like. People sometimes ask me what advice I would give to the version of myself who landed at Dublin Airport that rainy October morning. [[To be honest|tobehonest]], I think about this question more often than I'd like to admit.`,
      `[[First of all|firstofall]], [[if I could|ificould]] talk to that younger Thiago, I would tell him to stop comparing everything to Brazil. In my first year, I [[used to|usedto]] complain about everything: the weather, the food, the price of rent, the way people said "grand" when things were clearly not grand. Complaining felt like a way to connect with other Brazilians, but it kept me stuck. [[In hindsight|hindsight]], I spent too much energy missing home and too little energy discovering where I actually was.`,
      `Second, I would tell him that his English was better than he thought. I used to rehearse sentences in my head before ordering a coffee, and if a barista asked me an unexpected question, I would freeze. I was so afraid of making mistakes that I avoided conversations. If I had known that Irish people care much more about friendliness than grammar, I would have relaxed much earlier. [[As a matter of fact|matteroffact]], my English only improved when I started talking badly and often, instead of perfectly and rarely.`,
      `[[That being said|thatbeingsaid]], I don't regret everything. In my third month, I lost my part-time job at a restaurant, and for a few weeks I didn't know how I was going to pay rent. It was terrifying. [[On the other hand|otherhand]], it forced me to [[reach out to|reachout]] people, ask for help and accept it. A Polish colleague found me a new job, and an older Irish neighbour started inviting me for Sunday dinner. They are still two of my closest friends.`,
      `Nowadays, I try to apply the same logic to my future. If I get the promotion I applied for this year, I will probably stay in Ireland for at least five more years. If I don't get it, I will consider moving to Lisbon, where my partner has family. [[Either way|eitherway]], I know I will be fine. [[Unless|unless]] something completely unexpected happens, I don't plan to go back to Brazil permanently, [[although|although]] I visit every December.`,
      `If you are planning to move abroad, here is the advice I wish someone had given me. Expect to feel lost for a while, and don't take it as a sign that you made the wrong decision. [[Make the most of|makethemost]] the small wins: your first joke that makes a local laugh, your first phone call without panic, your first friend who doesn't speak Portuguese. [[All things considered|allthings]], moving abroad was the hardest and the best decision I have ever made. If I had to choose again, I would do it all over again. This time, though, I would complain a little less.`,
    ],
    wordBank: [
      { id: 'tobehonest', en: 'to be honest', pron: 'tchu bi Ó-nist', pt: 'para ser sincero, sinceramente', example: "To be honest, I didn't enjoy the movie that much." },
      { id: 'firstofall', en: 'first of all', pron: 'FÂRST âv ól', pt: 'antes de tudo, em primeiro lugar', example: 'First of all, thank you all for being here today.' },
      { id: 'ificould', en: 'If I could..., I would...', pron: 'if ai KÚD ... ai UÚD', pt: 'Se eu pudesse..., eu faria... (situação imaginária)', example: 'If I could live anywhere, I would choose a city by the sea.' },
      { id: 'usedto', en: 'used to', pron: 'IÚS-tchu', pt: 'costumava (hábito do passado que não existe mais)', example: 'I used to drink three coffees a day. Now I drink just one.' },
      { id: 'hindsight', en: 'in hindsight', pron: 'in RÁIND-sait', pt: 'olhando para trás, em retrospecto', example: 'In hindsight, I should have asked more questions in the interview.' },
      { id: 'matteroffact', en: 'as a matter of fact', pron: 'éz â MÉ-târ âv fékt', pt: 'na verdade, aliás (reforça ou corrige uma ideia)', example: "I don't mind the rain. As a matter of fact, I love it." },
      { id: 'thatbeingsaid', en: 'that being said', pron: 'DHÉT bí-ing séd', pt: 'dito isso, mesmo assim', example: 'The job pays well. That being said, the hours are very long.' },
      { id: 'otherhand', en: 'on the other hand', pron: 'ón dhi Â-dhâr rénd', pt: 'por outro lado', example: 'Living alone is expensive. On the other hand, you have total freedom.' },
      { id: 'reachout', en: 'reach out to', pron: 'rítch ÁUT tchu', pt: 'entrar em contato com, procurar alguém', example: 'Feel free to reach out to me if you have any questions.' },
      { id: 'eitherway', en: 'either way', pron: 'Í-dhâr uêi', pt: 'de qualquer forma, seja como for', example: "We can take the bus or walk. Either way, we'll be a bit late." },
      { id: 'unless', en: 'unless', pron: 'ân-LÉS', pt: 'a menos que, a não ser que', example: "I'll go to the beach tomorrow unless it rains." },
      { id: 'although', en: 'although', pron: 'ól-DHÔU', pt: 'embora, apesar de que', example: 'Although she was tired, she finished the report.' },
      { id: 'makethemost', en: 'make the most of', pron: 'mêik dhâ MÔUST âv', pt: 'aproveitar ao máximo', example: "We only have two days in Rome, so let's make the most of them." },
      { id: 'allthings', en: 'all things considered', pron: 'ól THINGZ cân-SÍ-dârd', pt: 'levando tudo em conta, no geral', example: 'All things considered, it was a great year for the team.' },
    ],
    questions: [
      {
        id: 'q1', type: 'reading', cat: 'reading',
        prompt: 'According to Thiago, when did his English really start to improve?',
        options: ['When he took a grammar course in Dublin.', 'When he stopped talking to other Brazilians.', 'When he got a promotion at work.', 'When he started talking often, even with mistakes.'],
        answer: 3,
        explain: '"My English only improved when I started talking badly and often, instead of perfectly and rarely." A mensagem é central na sua jornada também: frequência de uso vale mais do que perfeição.',
      },
      {
        id: 'q2', type: 'grammar', cat: 'conditionals',
        prompt: 'Complete: "If I ___ talk to my younger self, I would tell him to stop complaining."',
        options: ['can', 'will', 'could', 'would'],
        answer: 2,
        explain: 'É uma situação imaginária (ele não pode voltar no tempo), então usamos Second Conditional: If + passado, would + verbo. Could é o passado de can: If I could talk..., I would tell... Would não aparece na parte do if.',
      },
      {
        id: 'q3', type: 'grammar', cat: 'conditionals',
        prompt: 'Complete: "If I get the promotion, I ___ probably stay in Ireland."',
        options: ['would', 'will', 'would have', 'am'],
        answer: 1,
        explain: 'A promoção é uma possibilidade real e futura. Isso pede First Conditional: If + presente, will + verbo. Thiago realmente se candidatou, então não é hipótese imaginária. Would deixaria a situação distante e improvável.',
      },
      {
        id: 'q4', type: 'grammar', cat: 'conditionals',
        prompt: 'Complete: "___ something completely unexpected happens, I don\'t plan to go back to Brazil."',
        options: ['Although', 'Unless', 'Despite', 'If'],
        answer: 1,
        explain: 'Unless = "a menos que", equivale a if not. A frase significa: se nada inesperado acontecer, ele não volta. Com If, o sentido se inverteria. Although e despite expressam contraste, não condição.',
      },
      {
        id: 'q5', type: 'meaning', cat: 'conditionals',
        prompt: '"If I had to choose again, I would do it all over again." This sentence describes:',
        options: ['A real plan for next year.', 'An imaginary situation.', 'A habit in the past.', 'An obligation in the present.'],
        answer: 1,
        explain: 'If + passado (had to) com would indica Second Conditional: uma situação imaginada. Ele não vai escolher de novo, apenas imagina a escolha. O passado aqui marca distância da realidade, não tempo passado.',
      },
      {
        id: 'q6', type: 'chunk', cat: 'connectors',
        prompt: 'After talking about his mistakes, Thiago says: "___, I don\'t regret everything." Which marker fits best?',
        options: ['First of all', 'For example', 'That being said', 'As a result'],
        answer: 2,
        explain: 'That being said ("dito isso") introduz um contraponto ao que acabou de ser dito. First of all abre uma lista, for example dá um exemplo, e as a result indica consequência, o que não combina com a virada de ideia.',
      },
      {
        id: 'q7', type: 'meaning', cat: 'connectors',
        prompt: '"In hindsight, I spent too much energy missing home." What does "in hindsight" mean?',
        options: ['Olhando para trás, em retrospecto.', 'Na minha opinião atual sobre o futuro.', 'Naquele exato momento.', 'Por acaso, sem querer.'],
        answer: 0,
        explain: 'In hindsight é usado para avaliar algo do passado com o conhecimento de hoje. É um marcador de reflexão muito comum em conversas maduras, entrevistas e textos de opinião.',
      },
      {
        id: 'q8', type: 'grammar', cat: 'used-to',
        prompt: 'Complete: "In my first year, I ___ complain about everything." (a habit that doesn\'t exist anymore)',
        options: ['use to', 'used to', 'was used to', 'am used to'],
        answer: 1,
        explain: 'Used to + verbo base descreve hábitos passados que acabaram: I used to complain. Be used to significa "estar acostumado" e tem outro sentido. Use to aparece apenas depois de did na negativa e na pergunta: Did you use to...?',
      },
      {
        id: 'q9', type: 'chunk', cat: 'phrasal-verbs',
        prompt: 'Complete: "It forced me to ___ people, ask for help and accept it."',
        options: ['reach out to', 'reach up', 'get over', 'come across'],
        answer: 0,
        explain: 'Reach out to = procurar alguém, entrar em contato, pedir apoio. Get over significa superar e come across significa encontrar por acaso. Reach out é muito usado também em e-mails: "Feel free to reach out."',
      },
      {
        id: 'q10', type: 'reading', cat: 'reading',
        prompt: 'What is Thiago\'s main advice for people moving abroad?',
        options: ['Avoid other Brazilians to improve faster.', 'Go back home if the first year is difficult.', 'Study grammar before talking to locals.', 'Feeling lost is normal, so celebrate the small wins.'],
        answer: 3,
        explain: 'No último parágrafo: "Expect to feel lost for a while, and don\'t take it as a sign that you made the wrong decision. Make the most of the small wins." A mensagem é de acolhimento, não de cobrança.',
      },
    ],
  };

  const UNITS = [U1, U2, U3, U4];

  /* ---------- Derivados: contagem de palavras, tempo de leitura ---------- */
  const stripMarks = (p) => p.replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1');
  UNITS.forEach((u) => {
    u.plainParagraphs = u.paragraphs.map(stripMarks);
    u.wordCount = u.plainParagraphs.join(' ').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
    u.minutes = Math.max(2, Math.round(u.wordCount / ({ A1: 90, A2: 100, B1: 110, B2: 120 }[u.level] || 130)));
  });

  SH.content = SH.content || {};
  SH.content.LEVELS = LEVELS;
  SH.content.AXES = AXES;
  SH.content.TOPICS = TOPICS;
  SH.content.QTYPES = QTYPES;
  SH.content.UNITS = UNITS;
  SH.content.unit = (id) => UNITS.find((u) => u.id === id) || null;
  SH.content.axis = (id) => AXES.find((a) => a.id === id) || null;
  SH.content.topic = (id) => TOPICS[id] || { label: id, skill: 'grammar' };
})(window.SH);

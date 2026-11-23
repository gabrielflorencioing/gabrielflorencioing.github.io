# Students Hub · Portal do Aluno | Gabriel Florencio

Aplicação web estática (HTML, CSS e JavaScript puro, sem build). Abra `portal/index.html` no navegador ou publique a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Etapa 1 (entregue)
- Autenticação local: login, criação de conta de aluno e acesso demo em 1 clique (Gabriel, Julia A2, Renan B1). Senha das contas demo: `demo1234`.
- `AppState` persistido em `localStorage` na chave `gabriel_florencio_students_hub_v1`, com Exportar Dados (JSON) e Importar Backup no menu do usuário.
- Navegação responsiva com abas preparadas para os módulos 2 a 7.
- Módulo 1: 4 unidades completas (A1, A2, B1, B2) com texto longo, Word Bank com áudio (Web Speech API) e avaliação de 10 questões com correção analítica e registro de acertos e erros por tópico.

## Estrutura
```
portal/
  index.html
  assets/css/app.css
  assets/js/core/       util, speech (voz), store (estado, backup, demos)
  assets/js/content/    illustrations (SVG autorais), readings (unidades)
  assets/js/modules/    shell, auth, home, reading, upcoming
  assets/js/app.js      roteamento por hash
```

## Como adicionar uma nova unidade de leitura
Em `assets/js/content/readings.js`, crie um objeto no mesmo formato das unidades existentes e inclua-o em `UNITS`. Marque os chunks no texto com `[[texto exibido|id-do-word-bank]]`.

## Observação de segurança
Os dados ficam apenas no navegador de quem usa. As senhas são guardadas com hash, mas isso é uma proteção local básica: não há servidor nem sincronização entre dispositivos. Para uso comercial com vários alunos, o próximo passo natural é um backend com autenticação real.

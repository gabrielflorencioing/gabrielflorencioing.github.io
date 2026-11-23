# Students Hub · Portal do Aluno | Gabriel Florencio

Aplicação web estática, modular e sem etapa de build (HTML, CSS e JavaScript puro). Abra `portal/index.html` no navegador ou publique a pasta `portal/` em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger).

## Dependências e recursos

**Nenhum pacote npm é necessário.** Tudo que o portal usa já está integrado no código:

| Recurso | Tipo | Para que serve | Já integrado em |
|---|---|---|---|
| Google Fonts: Fredoka e Nunito | Fonte web (CDN) | Títulos e texto da identidade visual | `index.html` (`<link>`). Sem internet, cai para fontes do sistema |
| `localStorage` | API do navegador | Persistência do `AppState` na chave `gabriel_florencio_students_hub_v1` | `core/store.js` |
| Web Speech API (`speechSynthesis`) | API do navegador | Áudio dos chunks, exemplos e leitura do texto | `core/speech.js` |
| Canvas 2D (`<canvas>`, `toBlob`) | API do navegador | Converter mapas mentais SVG em PNG de alta resolução | `modules/maps.js` |
| `XMLSerializer`, `Blob`, `URL.createObjectURL` | API do navegador | Download de SVG, PNG e backup JSON | `core/util.js`, `modules/maps.js` |
| `FileReader` | API do navegador | Importar backup JSON | `modules/shell.js` |
| `crypto.subtle` (SHA-256) e `TextEncoder` | API do navegador | Hash local das senhas (com alternativa automática) | `core/util.js` |
| Clipboard API | API do navegador | Copiar a pauta sugerida da aula | `modules/teacher.js` (com alternativa) |
| `matchMedia` | API do navegador | Respeitar "reduzir movimento" do sistema | `core/util.js`, CSS |

Navegadores recomendados: Chrome, Edge, Safari ou Firefox atualizados. A qualidade das vozes depende do sistema (Chrome e Edge oferecem vozes naturais em inglês).

### Para rodar localmente (opcional)
O portal funciona abrindo o arquivo direto. Para um servidor local:
- Extensão **Live Server** no VS Code (recomendada em `.vscode/extensions.json`), ou
- `npx serve portal` ou `python3 -m http.server` dentro da pasta.

## Módulos
1. **Trilhas de Leitura Guiada:** 4 unidades (A1, A2, B1, B2) com texto longo, Word Bank com áudio e 10 questões com correção analítica.
2. **Arena de Gamificação:** Chunk Builder, Context & Preposition Challenge e Collocation Match, com XP, combo e Grammar & Logic Hint.
3. **Mapas Mentais:** 4 mapas em SVG com visualização ampliada e download em PNG (3400 px) ou SVG.
4. **Léxico da Vida Real:** 4 temas com 6 chunks cada, busca, filtro, registro, áudio e "Salvar no Meu Caderno".
5. **Perfil Cognitivo:** indicadores por área, gráfico radar, conquistas e pontos de atenção com atalhos de prática.
6. **Agenda, Tarefas e Caderno:** calendário, action plan com prioridades e anotações compartilháveis com o professor.
7. **Central do Professor:** visão da turma, dossiê individual, mapa de fragilidades, pauta automática e notas privadas.

## Cadastro de alunos pelo professor
Na **Central do Professor**, o botão **Cadastrar aluno** cria a conta com login (e-mail) e senha individuais. Em seguida o portal mostra:
- as credenciais e um **link de acesso individual** (`#/convite/...`);
- botões para copiar a mensagem pronta, copiar o link ou enviar pelo WhatsApp.

Ao abrir o link, a conta é ativada no aparelho do aluno e ele entra com o e-mail e a senha recebidos. No primeiro acesso, ele é convidado a criar uma senha pessoal. No dossiê do aluno, o professor pode gerar o link de novo, **redefinir a senha** (o novo link atualiza a senha no aparelho do aluno) ou **remover o aluno**.

Para o link funcionar em outro aparelho, o portal precisa estar publicado online (GitHub Pages, Netlify, Vercel). Aberto como arquivo local, o link só funciona no próprio computador.

Contas demo (1 clique ou senha `demo1234`): Gabriel Florencio (professor), Julia Martins (A2) e Renan Albuquerque (B1).

## Estrutura
```
portal/
  index.html
  assets/css/app.css
  assets/js/core/       util, speech, store (estado, backup, perfis demo)
  assets/js/content/    illustrations, readings, games, maps, lexicon, pedagogy
  assets/js/modules/    shell, auth, home, reading, profile, games, maps, lexicon, agenda, teacher
  assets/js/app.js      roteamento por hash
```

## Como adicionar conteúdo
- **Leitura:** novo objeto em `UNITS` (`content/readings.js`). Marque chunks com `[[texto|id-do-word-bank]]`.
- **Jogos:** novos itens em `CHUNK_BUILDER`, `CONTEXT_CHALLENGE` ou `COLLOCATION_ROUNDS` (`content/games.js`).
- **Mapas:** novo objeto em `MAPS` (`content/maps.js`) com 4 ramos de 3 itens; o layout é calculado sozinho.
- **Léxico:** novo tema em `THEMES` e itens em `ITEMS` (`content/lexicon.js`).
- **Novo tópico gramatical:** registre em `TOPICS` (`readings.js`), `PRACTICE` e `INTERVENTIONS` (`pedagogy.js`).

## Segurança
Os dados ficam apenas no navegador de quem usa. O hash de senha é uma proteção local básica: não há servidor nem sincronização entre aparelhos. Para uso comercial com muitos alunos, o próximo passo é um backend com autenticação real.

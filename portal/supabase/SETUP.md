# Students Hub na nuvem (Supabase): passo a passo

Com o Supabase ativo:
- Cada aluno entra com o próprio e-mail e senha em qualquer aparelho.
- O progresso, o caderno, as tarefas e a agenda ficam salvos na nuvem.
- Tudo aparece no seu painel de professor, atualizado sempre que você abre a Central.

Leva uns 15 minutos. O plano gratuito do Supabase atende bem uma turma de mentoria.

## 1. Criar o projeto
1. Crie uma conta em supabase.com e clique em **New project**.
2. Dê um nome (ex.: `students-hub`), escolha uma senha forte para o banco e a região **South America (São Paulo)**.
3. Aguarde o projeto ficar pronto (1 a 2 minutos).

## 2. Criar as tabelas e as regras de segurança
1. No menu lateral, abra **SQL Editor** e clique em **New query**.
2. Copie todo o conteúdo de `portal/supabase/schema.sql`, cole e clique em **Run**.
3. Deve aparecer "Success. No rows returned". Pode rodar de novo no futuro sem perder dados.

## 3. Ajustar o login por e-mail
Em **Authentication > Sign In / Providers > Email**:
- **Desative "Confirm email"**. Assim os alunos que você cadastra entram direto, sem precisar clicar em e-mail de confirmação. Se preferir manter a confirmação ativa, o portal avisa quando ela for necessária.
- Deixe **"Allow new users to sign up"** ativado. O painel do professor usa esse recurso para criar as contas dos alunos.

## 4. Ligar o portal ao projeto
1. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**.
2. Abra `portal/config.js` e preencha:
   ```js
   window.SH_CONFIG = {
     supabaseUrl: 'https://SEU-PROJETO.supabase.co',
     supabaseAnonKey: 'sua-chave-anon-public',
     allowSelfSignup: true,
   };
   ```
   A chave **anon** pode ficar no site: a proteção vem das regras do banco. **Nunca** use a chave `service_role` no portal.

## 5. Publicar o portal
Publique a pasta `portal/` em uma hospedagem estática. As opções abaixo são gratuitas:
- **GitHub Pages:** no repositório, Settings > Pages, branch principal, pasta raiz. O portal fica em `https://SEU-USUARIO.github.io/gabrielflorencio/portal/`.
- **Netlify** ou **Vercel:** arraste a pasta `portal/` ou conecte o repositório.

## 6. Criar a sua conta de professor
1. Abra o portal publicado, vá em **Criar conta de aluno** e cadastre-se com o seu e-mail.
2. No Supabase, em **SQL Editor**, rode (trocando pelo seu e-mail):
   ```sql
   update public.profiles set role = 'teacher' where email = 'seu-email@exemplo.com';
   ```
3. Atualize o portal: a **Central do Professor** aparece no menu.

## 7. Cadastrar alunos
Na Central do Professor, clique em **Cadastrar aluno** e defina o login e a senha. O portal gera a mensagem pronta para enviar por WhatsApp. No dossiê de cada aluno você também pode **redefinir a senha** ou **remover o aluno**.

Se quiser que **só você** cadastre alunos, mude `allowSelfSignup` para `false` no `config.js`: a aba "Criar conta de aluno" deixa de aparecer. Faça isso **depois** do passo 6.

## Segurança: o que cada pessoa pode ver
- **Aluno:** só o próprio perfil e os próprios dados. Não consegue ler suas notas privadas nem virar professor.
- **Professor:** vê todos os alunos e pode alterar o nível, mas não altera o progresso deles. Redefine senhas e remove alunos por funções protegidas no banco.
- **As notas privadas** ficam numa tabela que só professores acessam.

## Observações
- **Sem configuração:** se `config.js` ficar vazio, o portal funciona no modo local de antes, com dados só no navegador e perfis demo.
- **Sem internet:** o aluno continua usando o portal, e as alterações são enviadas quando a conexão volta. O indicador no topo mostra o estado.
- **Dois aparelhos ao mesmo tempo:** se o aluno estudar em dois aparelhos ao mesmo tempo, vale a última alteração salva.

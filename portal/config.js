/* Students Hub · Configuração
 *
 * Deixe supabaseUrl e supabaseAnonKey vazios para usar o portal no modo local
 * (dados apenas neste navegador).
 *
 * Para ativar a nuvem, preencha com os dados do seu projeto Supabase:
 * Project Settings > API > Project URL e a chave "anon public".
 * A chave anon é pública por natureza: a segurança vem das regras do banco
 * (supabase/schema.sql). Nunca coloque aqui a chave "service_role".
 */
window.SH_CONFIG = {
  supabaseUrl: 'https://inonzdzqqoqfdygsgznn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub256ZHpxcW9xZmR5Z3Nnem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjY3MjMsImV4cCI6MjExMTA0MjcyM30.-NR92_H9ILJ7Y251QbHerqDYP74MmlfoWBzsp_776aM',

  /* false esconde a aba "Criar conta de aluno": só o professor cadastra alunos */
  allowSelfSignup: false,
};

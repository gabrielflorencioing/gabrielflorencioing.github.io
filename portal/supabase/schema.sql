-- =====================================================================
-- Students Hub · Portal do Aluno | Gabriel Florencio
-- Esquema do banco no Supabase. Cole tudo no SQL Editor do projeto e
-- clique em "Run". Pode ser executado de novo sem perder dados.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- Perfil de cada conta (1 para 1 com auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher')),
  level text not null default 'A1' check (level in ('A1', 'A2', 'B1', 'B2')),
  goal text not null default 'conversation',
  location text not null default 'brasil' check (location in ('brasil', 'exterior')),
  created_by text not null default 'self' check (created_by in ('self', 'teacher')),
  must_change_password boolean not null default false,
  created_at timestamptz not null default now()
);

-- Progresso, caderno, tarefas, agenda e preferências do aluno (JSON)
create table if not exists public.student_data (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Notas privadas do professor sobre cada aluno (o aluno nunca lê)
create table if not exists public.teacher_notes (
  student_id uuid primary key references public.profiles (id) on delete cascade,
  notes text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------

create or replace function public.is_teacher()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

-- Cria o perfil automaticamente quando uma conta é criada.
-- O papel (role) NUNCA vem dos metadados: toda conta nova é aluno.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  creator text := case when meta ->> 'created_by' = 'teacher' then 'teacher' else 'self' end;
begin
  insert into public.profiles (id, email, name, level, goal, location, created_by, must_change_password)
  values (
    new.id,
    lower(new.email),
    left(coalesce(nullif(trim(meta ->> 'name'), ''), split_part(new.email, '@', 1)), 120),
    case when meta ->> 'level' in ('A1', 'A2', 'B1', 'B2') then meta ->> 'level' else 'A1' end,
    left(coalesce(nullif(meta ->> 'goal', ''), 'conversation'), 40),
    case when meta ->> 'location' in ('brasil', 'exterior') then meta ->> 'location' else 'brasil' end,
    creator,
    creator = 'teacher' and coalesce((meta ->> 'must_change_password')::boolean, true)
  )
  on conflict (id) do nothing;
  insert into public.student_data (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Protege campos sensíveis: pelo portal ninguém muda o próprio papel.
-- (Pelo SQL Editor, onde auth.uid() é nulo, o administrador pode.)
create or replace function public.protect_profile()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.role := old.role;
    new.id := old.id;
    new.created_at := old.created_at;
    if not public.is_teacher() then
      new.email := old.email;
      new.created_by := old.created_by;
      new.level := old.level;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile();

-- ---------------------------------------------------------------------
-- Ações exclusivas do professor
-- ---------------------------------------------------------------------

create or replace function public.teacher_reset_password(student uuid, new_password text)
returns void
language plpgsql security definer
set search_path = public, extensions
as $$
begin
  if not public.is_teacher() then
    raise exception 'Apenas o professor pode redefinir senhas.' using errcode = '42501';
  end if;
  if new_password is null or length(new_password) < 6 then
    raise exception 'A senha precisa ter pelo menos 6 caracteres.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = student and role = 'student') then
    raise exception 'Aluno não encontrado.' using errcode = 'P0002';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
         updated_at = now()
   where id = student;
  update public.profiles set must_change_password = true where id = student;
end;
$$;

create or replace function public.teacher_delete_student(student uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'Apenas o professor pode remover alunos.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = student and role = 'student') then
    raise exception 'Aluno não encontrado.' using errcode = 'P0002';
  end if;
  delete from auth.users where id = student;
end;
$$;

-- ---------------------------------------------------------------------
-- Segurança em nível de linha (RLS)
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.student_data enable row level security;
alter table public.teacher_notes enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_teacher());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_teacher())
  with check (id = auth.uid() or public.is_teacher());

drop policy if exists data_select on public.student_data;
create policy data_select on public.student_data
  for select to authenticated using (user_id = auth.uid() or public.is_teacher());

drop policy if exists data_insert on public.student_data;
create policy data_insert on public.student_data
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists data_update on public.student_data;
create policy data_update on public.student_data
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists notes_teacher on public.teacher_notes;
create policy notes_teacher on public.teacher_notes
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

-- ---------------------------------------------------------------------
-- Permissões
-- ---------------------------------------------------------------------

revoke all on public.profiles, public.student_data, public.teacher_notes from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.student_data to authenticated;
grant select, insert, update, delete on public.teacher_notes to authenticated;

revoke all on function public.teacher_reset_password(uuid, text) from public, anon;
revoke all on function public.teacher_delete_student(uuid) from public, anon;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.protect_profile() from public, anon, authenticated;
grant execute on function public.teacher_reset_password(uuid, text) to authenticated;
grant execute on function public.teacher_delete_student(uuid) to authenticated;
grant execute on function public.is_teacher() to authenticated;

-- ---------------------------------------------------------------------
-- DEPOIS DE CRIAR A SUA CONTA NO PORTAL, transforme-a em professor:
--   update public.profiles set role = 'teacher' where email = 'seu-email@exemplo.com';
-- ---------------------------------------------------------------------

-- Real dashboard data model for TissueScope.
-- Adapta a estrutura existente e adiciona tabelas de análises.

-- 1. Adicionar colunas na tabela profiles se não existirem
alter table public.profiles
  add column if not exists employee_code text,
  add column if not exists shift text,
  add column if not exists job_title text,
  add column if not exists department text,
  add column if not exists active boolean not null default true;

-- 2. Converter a coluna role de user_roles para usar valores padrão se precisar
-- (assumindo que user_roles.role é VARCHAR, vamos deixar assim por compatibilidade)

-- 3. Criar a tabela analysis_records
create table if not exists public.analysis_records (
  id uuid not null default gen_random_uuid() primary key,
  operator_user_id uuid not null references public.profiles (user_id) on delete cascade,
  reference_code text not null unique,
  tissue_type text not null,
  result text not null check (result in ('ok', 'fail')),
  failure_reason text,
  processing_time_ms integer not null check (processing_time_ms > 0),
  analyzed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 4. Criar índices para performance
create index if not exists idx_analysis_records_operator_user_id_analyzed_at
  on public.analysis_records (operator_user_id, analyzed_at desc);

create index if not exists idx_analysis_records_result
  on public.analysis_records (result);

-- 5. Habilitar RLS nas tabelas
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.analysis_records enable row level security;

-- 6. Remover policies antigas
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can view their own roles" on public.user_roles;

-- 7. Criar função auxiliar para verificar se um usuário é gestor (sem enum, apenas string)
create or replace function public.is_manager(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = 'gestor'
  )
$$;

-- 8. Novas policies para perfis (usuários podem ver o seu, gestores veem todos)
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id or (select public.is_manager(auth.uid())));

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 9. Novas policies para user_roles (similar)
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id or (select public.is_manager(auth.uid())));

-- 10. Policies para analysis_records
create policy "Users can view own analyses"
  on public.analysis_records
  for select
  to authenticated
  using (
    operator_user_id = (select auth.uid())
    or (select public.is_manager(auth.uid()))
  );

create policy "Users can insert own analyses"
  on public.analysis_records
  for insert
  to authenticated
  with check (
    operator_user_id = (select auth.uid())
    or (select public.is_manager(auth.uid()))
  );

-- Snapshot da estrutura criada em 30/09/2026. Não é uma migração pendente.
create table public.journals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.journals enable row level security;
revoke all on public.journals from anon, authenticated;
grant select, insert, update on public.journals to authenticated;
create policy journals_select_own on public.journals for select to authenticated using ((select auth.uid()) = user_id);
create policy journals_insert_own on public.journals for insert to authenticated with check ((select auth.uid()) = user_id);
create policy journals_update_own on public.journals for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

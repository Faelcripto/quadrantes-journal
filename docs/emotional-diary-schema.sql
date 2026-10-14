create table public.emotional_entries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 entry_date date not null,
 title text not null default '' check (char_length(title)<=120),
 body text not null check (char_length(btrim(body)) between 1 and 10000),
 emotion text not null check (emotion in ('Calmo','Impulsivo','Frustrado')),
 revision integer not null default 1 check (revision>0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index emotional_entries_owner_date_idx on public.emotional_entries (user_id,entry_date desc,created_at desc,id desc);
alter table public.emotional_entries enable row level security;
revoke all on public.emotional_entries from public, anon;
grant select,insert,update,delete on public.emotional_entries to authenticated;
create policy emotional_entries_select_own on public.emotional_entries for select to authenticated using ((select auth.uid())=user_id);
create policy emotional_entries_insert_own on public.emotional_entries for insert to authenticated with check ((select auth.uid())=user_id);
create policy emotional_entries_update_own on public.emotional_entries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy emotional_entries_delete_own on public.emotional_entries for delete to authenticated using ((select auth.uid())=user_id);

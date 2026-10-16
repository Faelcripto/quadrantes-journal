create table public.course_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check (char_length(lesson_id) between 1 and 100),
 completed_at timestamptz not null default now(),
 primary key (user_id,lesson_id)
);
alter table public.course_progress enable row level security;
revoke all on public.course_progress from public,anon;
grant select,insert,update,delete on public.course_progress to authenticated;
create policy course_progress_select_own on public.course_progress for select to authenticated using ((select auth.uid())=user_id);
create policy course_progress_insert_own on public.course_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy course_progress_update_own on public.course_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy course_progress_delete_own on public.course_progress for delete to authenticated using ((select auth.uid())=user_id);

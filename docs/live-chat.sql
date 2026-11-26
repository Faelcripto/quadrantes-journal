create table public.live_chat_names (
 member uuid primary key default auth.uid() references auth.users(id) on delete cascade,
 nickname text not null check (nickname = btrim(nickname) and nickname ~ '^[[:alnum:]][[:alnum:] _.-]{1,23}$')
);
create unique index live_chat_nickname_ci on public.live_chat_names(lower(nickname));
create table public.live_chat_events (
 id uuid primary key default gen_random_uuid(),
 member uuid not null default auth.uid() references auth.users(id) on delete cascade,
 nickname text not null,
 room text not null check (length(room) <= 64),
 kind text not null check (kind in ('text','money','rocket','bolt')),
 body text not null default '' check ((kind='text' and length(btrim(body)) between 1 and 400) or (kind<>'text' and body='')),
 created_at timestamptz not null default now()
);
create index live_chat_room_recent on public.live_chat_events(room, created_at desc);
create index live_chat_member_recent on public.live_chat_events(member, created_at desc);
alter table public.live_chat_names enable row level security;
alter table public.live_chat_events enable row level security;
revoke all on public.live_chat_names, public.live_chat_events from public, anon, authenticated;
grant select, insert(nickname), update(nickname) on public.live_chat_names to authenticated;
grant select, insert(room,kind,body) on public.live_chat_events to authenticated;
create policy chat_own_name on public.live_chat_names for all to authenticated using (member=(select auth.uid())) with check (member=(select auth.uid()));
create policy chat_members_read on public.live_chat_events for select to authenticated using (exists(select 1 from public.site_content s where s.key='live' and s.payload->>'liveStatus'='Ao vivo' and s.payload->>'endsAt'=room and (s.payload->>'endsAt')::timestamptz>now()));
create policy chat_members_send on public.live_chat_events for insert to authenticated with check (member=(select auth.uid()));
create function public.live_chat_before_send() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from public.site_content s where s.key='live' and s.payload->>'liveStatus'='Ao vivo' and s.payload->>'endsAt'=new.room and (s.payload->>'endsAt')::timestamptz>now()) then raise exception 'Live encerrada'; end if;
 perform pg_advisory_xact_lock(hashtextextended(new.member::text,0));
 select nickname into new.nickname from public.live_chat_names where member=new.member;
 if new.nickname is null then raise exception 'Escolha um apelido'; end if;
 if exists(select 1 from public.live_chat_events e where e.room=new.room and e.member=new.member and e.created_at>clock_timestamp()-interval '2 seconds') then raise exception 'Aguarde dois segundos'; end if;
 return new;
end $$;
create trigger live_chat_check before insert on public.live_chat_events for each row execute function public.live_chat_before_send();
alter publication supabase_realtime add table public.live_chat_events;

-- Repair migration: add missing RLS policies and triggers on cloud.
-- The initial migration created tables but policies/triggers were lost.

-- Triggers
drop trigger if exists set_parent_profiles_updated_at on public.parent_profiles;
create trigger set_parent_profiles_updated_at
before update on public.parent_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_child_profiles_updated_at on public.child_profiles;
create trigger set_child_profiles_updated_at
before update on public.child_profiles
for each row
execute function public.set_updated_at();

-- RLS policies: parent_profiles
drop policy if exists "parent_profiles_select_own" on public.parent_profiles;
create policy "parent_profiles_select_own"
on public.parent_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "parent_profiles_insert_own" on public.parent_profiles;
create policy "parent_profiles_insert_own"
on public.parent_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "parent_profiles_update_own" on public.parent_profiles;
create policy "parent_profiles_update_own"
on public.parent_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- RLS policies: child_profiles
drop policy if exists "child_profiles_select_own" on public.child_profiles;
create policy "child_profiles_select_own"
on public.child_profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.parent_profiles parent
    where parent.id = child_profiles.parent_id
      and parent.user_id = auth.uid()
  )
);

drop policy if exists "child_profiles_insert_own" on public.child_profiles;
create policy "child_profiles_insert_own"
on public.child_profiles
for insert
to authenticated
with check (
  exists (
    select 1
    from public.parent_profiles parent
    where parent.id = child_profiles.parent_id
      and parent.user_id = auth.uid()
  )
);

drop policy if exists "child_profiles_update_own" on public.child_profiles;
create policy "child_profiles_update_own"
on public.child_profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.parent_profiles parent
    where parent.id = child_profiles.parent_id
      and parent.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.parent_profiles parent
    where parent.id = child_profiles.parent_id
      and parent.user_id = auth.uid()
  )
);

-- RLS policies: game_sessions
drop policy if exists "game_sessions_select_own" on public.game_sessions;
create policy "game_sessions_select_own"
on public.game_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.child_profiles child
    join public.parent_profiles parent on parent.id = child.parent_id
    where child.id = game_sessions.child_id
      and parent.user_id = auth.uid()
  )
);

drop policy if exists "game_sessions_insert_own" on public.game_sessions;
create policy "game_sessions_insert_own"
on public.game_sessions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.child_profiles child
    join public.parent_profiles parent on parent.id = child.parent_id
    where child.id = game_sessions.child_id
      and parent.user_id = auth.uid()
  )
);

drop policy if exists "game_sessions_update_own" on public.game_sessions;
create policy "game_sessions_update_own"
on public.game_sessions
for update
to authenticated
using (
  exists (
    select 1
    from public.child_profiles child
    join public.parent_profiles parent on parent.id = child.parent_id
    where child.id = game_sessions.child_id
      and parent.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.child_profiles child
    join public.parent_profiles parent on parent.id = child.parent_id
    where child.id = game_sessions.child_id
      and parent.user_id = auth.uid()
  )
);

-- RLS policies: game_answers
drop policy if exists "game_answers_select_own" on public.game_answers;
create policy "game_answers_select_own"
on public.game_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.game_sessions session
    join public.child_profiles child on child.id = session.child_id
    join public.parent_profiles parent on parent.id = child.parent_id
    where session.id = game_answers.game_session_id
      and parent.user_id = auth.uid()
  )
);

drop policy if exists "game_answers_insert_own" on public.game_answers;
create policy "game_answers_insert_own"
on public.game_answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.game_sessions session
    join public.child_profiles child on child.id = session.child_id
    join public.parent_profiles parent on parent.id = child.parent_id
    where session.id = game_answers.game_session_id
      and parent.user_id = auth.uid()
  )
);

-- Ensure RLS is enabled
alter table public.parent_profiles enable row level security;
alter table public.child_profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_answers enable row level security;

-- Revoke excessive anon permissions
revoke delete on table public.parent_profiles from anon;
revoke insert on table public.parent_profiles from anon;
revoke update on table public.parent_profiles from anon;
revoke delete on table public.parent_profiles from authenticated;

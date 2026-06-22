-- Maki+ initial Supabase/PostgreSQL schema.
-- This MVP stores only the minimum data needed for guardian consent,
-- child profile personalization, game sessions and answer history.

create extension if not exists pgcrypto;

create table if not exists public.parent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  consent_accepted boolean not null default false,
  consent_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint parent_profiles_email_not_empty check (length(trim(email)) > 0),
  constraint parent_profiles_consent_date_required check (
    (consent_accepted = false and consent_accepted_at is null)
    or
    (consent_accepted = true and consent_accepted_at is not null)
  )
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parent_profiles(id) on delete cascade,
  name text not null,
  last_name text,
  age integer not null,
  gender text,
  avatar_animal text not null default 'rabbit',
  reinforcement_topics text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint child_profiles_name_not_empty check (length(trim(name)) > 0),
  constraint child_profiles_age_range check (age between 4 and 10),
  constraint child_profiles_gender_allowed check (
    gender is null or gender in ('girl', 'boy', 'prefer_not_to_say')
  ),
  constraint child_profiles_avatar_animal_allowed check (
    avatar_animal in ('panda', 'fox', 'owl', 'turtle', 'rabbit', 'bird', 'dog')
  ),
  constraint child_profiles_topics_not_empty check (cardinality(reinforcement_topics) >= 1),
  constraint child_profiles_topics_allowed check (
    reinforcement_topics <@ array['addition', 'subtraction', 'multiplication', 'division']::text[]
  )
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  mode text not null,
  game_type text not null,
  operation_type text,
  selected_number integer,
  total_questions integer not null,
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  score integer not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),

  constraint game_sessions_mode_allowed check (mode in ('practice', 'random')),
  constraint game_sessions_game_type_allowed check (game_type in ('treasure', 'match_pairs', 'password', 'maze')),
  constraint game_sessions_operation_allowed check (
    operation_type is null or operation_type in ('addition', 'subtraction', 'multiplication', 'division')
  ),
  constraint game_sessions_total_questions_positive check (total_questions > 0),
  constraint game_sessions_answers_non_negative check (correct_answers >= 0 and wrong_answers >= 0),
  constraint game_sessions_score_non_negative check (score >= 0),
  constraint game_sessions_selected_number_positive check (selected_number is null or selected_number > 0),
  constraint game_sessions_practice_requires_operation check (
    mode = 'random'
    or
    (mode = 'practice' and operation_type is not null and selected_number is not null)
  )
);

create table if not exists public.game_answers (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references public.game_sessions(id) on delete cascade,
  operation_type text not null,
  left_number integer not null,
  right_number integer not null,
  operator_symbol text not null,
  question_text text not null,
  correct_answer integer not null,
  selected_answer integer,
  is_correct boolean not null,
  created_at timestamptz not null default now(),

  constraint game_answers_operation_allowed check (
    operation_type in ('addition', 'subtraction', 'multiplication', 'division')
  ),
  constraint game_answers_operator_allowed check (operator_symbol in ('+', '-', 'x', '/')),
  constraint game_answers_question_not_empty check (length(trim(question_text)) > 0),
  constraint game_answers_numbers_non_negative check (left_number >= 0 and right_number >= 0)
);

create index if not exists parent_profiles_user_id_idx on public.parent_profiles(user_id);
create index if not exists child_profiles_parent_id_idx on public.child_profiles(parent_id);
create index if not exists game_sessions_child_id_idx on public.game_sessions(child_id);
create index if not exists game_sessions_created_at_idx on public.game_sessions(created_at desc);
create index if not exists game_answers_game_session_id_idx on public.game_answers(game_session_id);
create index if not exists game_answers_created_at_idx on public.game_answers(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

alter table public.parent_profiles enable row level security;
alter table public.child_profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_answers enable row level security;

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

-- No delete policies are defined in the MVP. Data deletion should be added as
-- an explicit guardian/account flow later, not as a casual app action.

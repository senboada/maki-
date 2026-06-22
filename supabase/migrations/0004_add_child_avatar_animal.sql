alter table public.child_profiles
add column if not exists avatar_animal text not null default 'rabbit';

alter table public.child_profiles
drop constraint if exists child_profiles_avatar_animal_allowed;

alter table public.child_profiles
add constraint child_profiles_avatar_animal_allowed check (
  avatar_animal in ('panda', 'fox', 'owl', 'turtle', 'rabbit', 'bird', 'dog')
);

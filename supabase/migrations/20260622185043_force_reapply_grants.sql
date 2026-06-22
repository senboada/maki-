-- Force reapply all grants for authenticated role.
-- Supabase may override grants on schema changes.

grant usage on schema public to authenticated;

-- parent_profiles
grant select on table public.parent_profiles to authenticated;
grant insert on table public.parent_profiles to authenticated;
grant update on table public.parent_profiles to authenticated;

-- child_profiles
grant select on table public.child_profiles to authenticated;
grant insert on table public.child_profiles to authenticated;
grant update on table public.child_profiles to authenticated;

-- game_sessions
grant select on table public.game_sessions to authenticated;
grant insert on table public.game_sessions to authenticated;
grant update on table public.game_sessions to authenticated;

-- game_answers
grant select on table public.game_answers to authenticated;
grant insert on table public.game_answers to authenticated;

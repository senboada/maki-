-- Fix grants: ensure authenticated role has proper table access.

grant usage on schema public to authenticated;

grant select, insert, update on table public.parent_profiles to authenticated;
grant select, insert, update on table public.child_profiles to authenticated;
grant select, insert, update on table public.game_sessions to authenticated;
grant select, insert on table public.game_answers to authenticated;

-- Revoke excessive permissions Supabase adds by default
revoke all on table public.parent_profiles from anon;
revoke all on table public.child_profiles from anon;
revoke all on table public.game_sessions from anon;
revoke all on table public.game_answers from anon;

revoke delete on table public.parent_profiles from authenticated;
revoke delete on table public.child_profiles from authenticated;
revoke delete on table public.game_sessions from authenticated;
revoke delete on table public.game_answers from authenticated;

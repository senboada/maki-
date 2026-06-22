-- RLS policies decide which rows an authenticated user can access, but the
-- authenticated role still needs table privileges to execute those actions.

grant usage on schema public to authenticated;

grant select, insert, update on table public.parent_profiles to authenticated;
grant select, insert, update on table public.child_profiles to authenticated;
grant select, insert, update on table public.game_sessions to authenticated;
grant select, insert on table public.game_answers to authenticated;

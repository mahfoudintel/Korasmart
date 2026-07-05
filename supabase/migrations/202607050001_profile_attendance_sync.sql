alter table players
  add column if not exists avatar_preset text;

with numbered_players as (
  select id, row_number() over (order by name) as row_index
  from players
)
update players
set avatar_preset = '/images/avatars/avatar-' || lpad((((numbered_players.row_index - 1) % 20) + 1)::text, 2, '0') || '.png'
from numbered_players
where players.id = numbered_players.id
  and players.avatar_preset is null;

drop policy if exists "players update own profile" on players;
create policy "players update own profile" on players for update using (
  auth_user_id = auth.uid()
) with check (
  auth_user_id = auth.uid()
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'attendance'
  ) then
    alter publication supabase_realtime add table public.attendance;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'players'
  ) then
    alter publication supabase_realtime add table public.players;
  end if;
end $$;

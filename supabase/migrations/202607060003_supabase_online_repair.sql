create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

alter table players
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists username text,
  add column if not exists must_change_password boolean not null default false,
  add column if not exists avatar_preset text,
  add column if not exists avatar_url text,
  add column if not exists position text not null default 'Member',
  add column if not exists skill int not null default 70,
  add column if not exists speed int not null default 70,
  add column if not exists stamina int not null default 70,
  add column if not exists passing int not null default 70,
  add column if not exists defense int not null default 70,
  add column if not exists shooting int not null default 70,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  role text not null,
  granted_by uuid references players(id) on delete set null,
  granted_at timestamptz not null default now()
);

alter table user_roles
  drop constraint if exists user_roles_role_check,
  add constraint user_roles_role_check check (role in ('superuser', 'admin', 'budgeting_booking_officer', 'player'));

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  field_name text not null default '',
  starts_at timestamptz not null default now()
);

alter table bookings
  add column if not exists external_id text,
  add column if not exists venue text,
  add column if not exists field_name text not null default '',
  add column if not exists starts_at timestamptz not null default now(),
  add column if not exists duration_minutes int not null default 60,
  add column if not exists sport text not null default 'Football',
  add column if not exists status text not null default 'upcoming',
  add column if not exists reservation_status text not null default 'closed',
  add column if not exists reservation_open_at timestamptz,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists match_report jsonb,
  add column if not exists external_provider text default 'KoraSmart';

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  played_at timestamptz not null default now(),
  field_name text not null default '',
  fluorescent_score int,
  orange_score int,
  comments text,
  photos jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  status text not null default 'playing',
  joined_at timestamptz not null default now()
);

alter table attendance
  add column if not exists match_id uuid references matches(id) on delete cascade,
  add column if not exists booking_id uuid references bookings(id) on delete cascade,
  add column if not exists player_id uuid references players(id) on delete cascade,
  add column if not exists status text not null default 'playing',
  add column if not exists joined_at timestamptz not null default now();

create table if not exists finance_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  amount numeric(10,2) not null,
  currency text not null default 'dh',
  booking_id uuid references bookings(id) on delete set null,
  reversed_transaction_id uuid references finance_transactions(id) on delete set null,
  note text not null,
  created_by uuid references players(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists players_auth_user_id_idx on players(auth_user_id);
create index if not exists players_username_idx on players(username);
create index if not exists players_name_idx on players(lower(name));
create index if not exists user_roles_player_idx on user_roles(player_id);
create index if not exists bookings_external_id_idx on bookings(external_id);
create index if not exists bookings_starts_at_idx on bookings(starts_at);
create index if not exists attendance_booking_player_idx on attendance(booking_id, player_id);
create index if not exists finance_transactions_booking_idx on finance_transactions(booking_id);

create or replace function reservation_open_at(starts_at timestamptz)
returns timestamptz
language sql
stable
as $$
  select ((date_trunc('day', starts_at at time zone 'Africa/Casablanca') - interval '1 day') + time '11:00') at time zone 'Africa/Casablanca';
$$;

create or replace function booking_attendance_is_open(booking_starts_at timestamptz, booking_duration_minutes int)
returns boolean
language sql
stable
as $$
  select now() >= reservation_open_at(booking_starts_at)
    and now() < booking_starts_at + make_interval(mins => booking_duration_minutes);
$$;

with seed_players(name, position, skill, speed, stamina, passing, defense, shooting) as (
  values
    ('Najib', 'Playmaker', 88, 82, 84, 91, 70, 79),
    ('Ahmed A', 'Finisher', 91, 78, 80, 77, 66, 94),
    ('Ahmed G', 'Winger', 83, 92, 86, 80, 62, 76),
    ('Nawfal', 'Anchor', 76, 70, 90, 78, 88, 67),
    ('Badr', 'Box to box', 81, 84, 92, 82, 79, 74),
    ('Said', 'Creator', 86, 79, 81, 90, 64, 73),
    ('Driss', 'Sweeper', 72, 76, 85, 75, 91, 60),
    ('Abdou', 'Striker', 80, 83, 76, 70, 58, 87),
    ('Bobker', 'Midfielder', 79, 77, 88, 86, 72, 71),
    ('Abdelhamid', 'Keeper', 74, 68, 75, 72, 95, 48),
    ('Ismail', 'Pressing forward', 77, 88, 91, 69, 71, 82),
    ('Mehdi', 'Utility', 73, 80, 83, 76, 74, 64),
    ('Elhachmi', 'Dribbler', 85, 90, 77, 74, 59, 75),
    ('Miloudi', 'Captain', 84, 75, 89, 92, 81, 70),
    ('Yassine', 'Attacker', 78, 86, 80, 72, 63, 81),
    ('Hicham', 'Defender', 75, 74, 87, 73, 89, 58)
)
update players p
set
  position = s.position,
  skill = s.skill,
  speed = s.speed,
  stamina = s.stamina,
  passing = s.passing,
  defense = s.defense,
  shooting = s.shooting,
  is_active = true,
  username = coalesce(p.username, lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '.', 'g')))
from seed_players s
where lower(p.name) = lower(s.name);

with seed_players(name, position, skill, speed, stamina, passing, defense, shooting) as (
  values
    ('Najib', 'Playmaker', 88, 82, 84, 91, 70, 79),
    ('Ahmed A', 'Finisher', 91, 78, 80, 77, 66, 94),
    ('Ahmed G', 'Winger', 83, 92, 86, 80, 62, 76),
    ('Nawfal', 'Anchor', 76, 70, 90, 78, 88, 67),
    ('Badr', 'Box to box', 81, 84, 92, 82, 79, 74),
    ('Said', 'Creator', 86, 79, 81, 90, 64, 73),
    ('Driss', 'Sweeper', 72, 76, 85, 75, 91, 60),
    ('Abdou', 'Striker', 80, 83, 76, 70, 58, 87),
    ('Bobker', 'Midfielder', 79, 77, 88, 86, 72, 71),
    ('Abdelhamid', 'Keeper', 74, 68, 75, 72, 95, 48),
    ('Ismail', 'Pressing forward', 77, 88, 91, 69, 71, 82),
    ('Mehdi', 'Utility', 73, 80, 83, 76, 74, 64),
    ('Elhachmi', 'Dribbler', 85, 90, 77, 74, 59, 75),
    ('Miloudi', 'Captain', 84, 75, 89, 92, 81, 70),
    ('Yassine', 'Attacker', 78, 86, 80, 72, 63, 81),
    ('Hicham', 'Defender', 75, 74, 87, 73, 89, 58)
)
insert into players (name, username, position, skill, speed, stamina, passing, defense, shooting, is_active)
select
  s.name,
  lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '.', 'g')),
  s.position,
  s.skill,
  s.speed,
  s.stamina,
  s.passing,
  s.defense,
  s.shooting,
  true
from seed_players s
where not exists (select 1 from players p where lower(p.name) = lower(s.name));

with numbered_players as (
  select id, row_number() over (order by created_at, name) as row_index
  from players
)
update players p
set avatar_preset = '/images/avatars/avatar-' || lpad((((np.row_index - 1) % 20) + 1)::text, 2, '0') || '.png'
from numbered_players np
where p.id = np.id
  and p.avatar_preset is null;

delete from user_roles
where player_id in (select id from players where name = 'Najib')
  and role <> 'superuser';

insert into user_roles (player_id, role)
select p.id, 'superuser'
from players p
where p.name = 'Najib'
  and not exists (select 1 from user_roles ur where ur.player_id = p.id and ur.role = 'superuser');

insert into user_roles (player_id, role)
select p.id, 'admin'
from players p
where p.name = 'Nawfal'
  and not exists (select 1 from user_roles ur where ur.player_id = p.id and ur.role = 'admin');

insert into user_roles (player_id, role)
select p.id, 'player'
from players p
where p.name not in ('Najib', 'Nawfal')
  and not exists (select 1 from user_roles ur where ur.player_id = p.id);

with seed_bookings(external_id, starts_at, venue, field_name, duration_minutes, sport, status, reservation_status, reservation_open_at, external_provider) as (
  values
    ('res-2026-06-29', '2026-06-29T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'past', 'completed', '2026-06-28T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-06', '2026-07-06T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'open', '2026-07-05T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-13', '2026-07-13T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-12T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-20', '2026-07-20T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-19T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-27', '2026-07-27T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-26T11:00:00+01:00'::timestamptz, 'KoraSmart seed')
)
update bookings b
set
  external_id = s.external_id,
  starts_at = s.starts_at,
  venue = s.venue,
  field_name = s.field_name,
  duration_minutes = s.duration_minutes,
  sport = s.sport,
  status = s.status,
  reservation_status = s.reservation_status,
  reservation_open_at = s.reservation_open_at,
  external_provider = s.external_provider
from seed_bookings s
where b.external_id = s.external_id
  or (b.external_id is null and b.starts_at = s.starts_at and coalesce(b.venue, '') = s.venue);

with seed_bookings(external_id, starts_at, venue, field_name, duration_minutes, sport, status, reservation_status, reservation_open_at, external_provider) as (
  values
    ('res-2026-06-29', '2026-06-29T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'past', 'completed', '2026-06-28T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-06', '2026-07-06T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'open', '2026-07-05T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-13', '2026-07-13T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-12T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-20', '2026-07-20T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-19T11:00:00+01:00'::timestamptz, 'KoraSmart seed'),
    ('res-2026-07-27', '2026-07-27T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-07-26T11:00:00+01:00'::timestamptz, 'KoraSmart seed')
)
insert into bookings (external_id, starts_at, venue, field_name, duration_minutes, sport, status, reservation_status, reservation_open_at, external_provider)
select s.external_id, s.starts_at, s.venue, s.field_name, s.duration_minutes, s.sport, s.status, s.reservation_status, s.reservation_open_at, s.external_provider
from seed_bookings s
where not exists (select 1 from bookings b where b.external_id = s.external_id);

alter table players enable row level security;
alter table user_roles enable row level security;
alter table bookings enable row level security;
alter table attendance enable row level security;
alter table finance_transactions enable row level security;

drop policy if exists "players can read roster" on players;
create policy "players can read roster" on players for select using (auth.uid() is not null);

drop policy if exists "players update own profile" on players;
create policy "players update own profile" on players for update using (
  auth_user_id = auth.uid()
) with check (
  auth_user_id = auth.uid()
);

drop policy if exists "admins manage players" on players;
create policy "admins manage players" on players for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin')
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin')
  )
);

drop policy if exists "players read own roles" on user_roles;
create policy "players read own roles" on user_roles for select using (
  exists (
    select 1 from players p
    where p.id = user_roles.player_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists "superusers manage roles" on user_roles;
create policy "superusers manage roles" on user_roles for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role = 'superuser'
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role = 'superuser'
  )
);

drop policy if exists "members read bookings" on bookings;
create policy "members read bookings" on bookings for select using (auth.uid() is not null);

drop policy if exists "officers manage bookings" on bookings;
create policy "officers manage bookings" on bookings for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
);

drop policy if exists "members read attendance" on attendance;
drop policy if exists "players read attendance" on attendance;
create policy "players read attendance" on attendance for select using (auth.uid() is not null);

drop policy if exists "players update attendance only when open" on attendance;
drop policy if exists "players insert own attendance when open" on attendance;
drop policy if exists "players update own attendance when open" on attendance;
drop policy if exists "players delete own attendance when open" on attendance;

create policy "players insert own attendance when open" on attendance for insert with check (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid() and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

create policy "players update own attendance when open" on attendance for update using (
  exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role = 'superuser'
  )
) with check (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid() and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

create policy "players delete own attendance when open" on attendance for delete using (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid() and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and (b.reservation_status = 'open' or booking_attendance_is_open(b.starts_at, b.duration_minutes))
  )
);

drop policy if exists "players read finance transactions" on finance_transactions;
create policy "players read finance transactions" on finance_transactions for select using (auth.uid() is not null);

drop policy if exists "officers manage finance transactions" on finance_transactions;
create policy "officers manage finance transactions" on finance_transactions for all using (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
) with check (
  exists (
    select 1 from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid() and ur.role in ('superuser', 'admin', 'budgeting_booking_officer')
  )
);

do $$
begin
  begin
    alter publication supabase_realtime add table public.attendance;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.players;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.bookings;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;
end $$;

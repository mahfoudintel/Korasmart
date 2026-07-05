create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null default 'Member',
  skill int not null default 70,
  speed int not null default 70,
  stamina int not null default 70,
  passing int not null default 70,
  defense int not null default 70,
  shooting int not null default 70,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
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

create unique index if not exists players_auth_user_id_key
  on players(auth_user_id)
  where auth_user_id is not null;

create unique index if not exists players_username_key
  on players(username)
  where username is not null;

update players
set username = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '.', 'g'))
where username is null;

with numbered_players as (
  select id, row_number() over (order by name) as row_index
  from players
)
update players
set avatar_preset = '/images/avatars/avatar-' || lpad((((numbered_players.row_index - 1) % 20) + 1)::text, 2, '0') || '.png'
from numbered_players
where players.id = numbered_players.id
  and players.avatar_preset is null;

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  role text not null,
  granted_by uuid references players(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (player_id, role)
);

alter table user_roles
  drop constraint if exists user_roles_role_check,
  add constraint user_roles_role_check check (role in ('superuser', 'admin', 'budgeting_booking_officer', 'player'));

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  field_name text not null default '',
  starts_at timestamptz not null default now(),
  venue text,
  duration_minutes int not null default 60,
  sport text not null default 'Football',
  status text not null default 'upcoming',
  reservation_status text not null default 'closed',
  reservation_open_at timestamptz,
  notification_sent_at timestamptz,
  match_report jsonb,
  external_provider text default 'Dabat Animations',
  external_id text unique
);

alter table bookings
  add column if not exists field_name text not null default '',
  add column if not exists starts_at timestamptz not null default now(),
  add column if not exists venue text,
  add column if not exists duration_minutes int not null default 60,
  add column if not exists sport text not null default 'Football',
  add column if not exists status text not null default 'upcoming',
  add column if not exists reservation_status text not null default 'closed',
  add column if not exists reservation_open_at timestamptz,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists match_report jsonb,
  add column if not exists external_provider text default 'Dabat Animations',
  add column if not exists external_id text;

create unique index if not exists bookings_external_id_key
  on bookings(external_id)
  where external_id is not null;

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
  match_id uuid references matches(id) on delete cascade,
  booking_id uuid references bookings(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  status text not null check (status in ('playing', 'waiting', 'maybe', 'out')),
  joined_at timestamptz not null default now(),
  unique (match_id, player_id)
);

alter table attendance
  add column if not exists match_id uuid references matches(id) on delete cascade,
  add column if not exists booking_id uuid references bookings(id) on delete cascade,
  add column if not exists player_id uuid references players(id) on delete cascade,
  add column if not exists joined_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'attendance_booking_player_key'
      and conrelid = 'attendance'::regclass
  ) then
    alter table attendance
      add constraint attendance_booking_player_key unique (booking_id, player_id);
  end if;
end $$;

create table if not exists finance_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('booking_cost', 'booking_cost_reversal', 'manual_adjustment')),
  amount numeric(10,2) not null,
  currency text not null default 'dh',
  booking_id uuid references bookings(id) on delete set null,
  reversed_transaction_id uuid references finance_transactions(id) on delete set null,
  note text not null,
  created_by uuid references players(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint booking_cost_negative check (type <> 'booking_cost' or amount < 0),
  constraint booking_reversal_positive check (type <> 'booking_cost_reversal' or amount > 0)
);

create unique index if not exists one_booking_cost_per_booking
  on finance_transactions (booking_id)
  where type = 'booking_cost' and booking_id is not null;

create unique index if not exists one_booking_cost_reversal
  on finance_transactions (reversed_transaction_id)
  where type = 'booking_cost_reversal' and reversed_transaction_id is not null;

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

drop policy if exists "admins manage roles" on user_roles;
drop policy if exists "superusers manage roles" on user_roles;
drop policy if exists "players read own roles" on user_roles;
create policy "players read own roles" on user_roles for select using (
  exists (
    select 1 from players p
    where p.id = user_roles.player_id and p.auth_user_id = auth.uid()
  )
);

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
create policy "members read attendance" on attendance for select using (
  auth.uid() is not null
);

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
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
  )
);

create policy "players update own attendance when open" on attendance for update using (
  exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from user_roles ur
    join players p on p.id = ur.player_id
    where p.auth_user_id = auth.uid()
      and ur.role = 'superuser'
  )
) with check (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
  )
);

create policy "players delete own attendance when open" on attendance for delete using (
  (
    exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
    or exists (
      select 1
      from user_roles ur
      join players p on p.id = ur.player_id
      where p.auth_user_id = auth.uid()
        and ur.role = 'superuser'
    )
  )
  and exists (
    select 1 from bookings b
    where b.id = attendance.booking_id
      and booking_attendance_is_open(b.starts_at, b.duration_minutes)
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

delete from user_roles
where player_id in (select id from players where name = 'Najib')
  and role <> 'superuser';

insert into user_roles (player_id, role)
select id, 'superuser'
from players
where name = 'Najib'
on conflict do nothing;

insert into user_roles (player_id, role)
select id, 'admin'
from players
where name = 'Nawfal'
on conflict do nothing;

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

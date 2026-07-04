create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  position text not null,
  avatar_url text,
  skill int not null default 70,
  speed int not null default 70,
  stamina int not null default 70,
  passing int not null default 70,
  defense int not null default 70,
  shooting int not null default 70,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  role text not null check (role in ('superuser', 'admin', 'budgeting_booking_officer', 'player')),
  granted_by uuid references players(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (player_id, role)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  played_at timestamptz not null,
  field_name text not null,
  fluorescent_score int,
  orange_score int,
  comments text,
  photos jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  name text not null check (name in ('fluorescent', 'orange')),
  chemistry_score numeric(5,2) default 0
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  status text not null check (status in ('playing', 'waiting', 'maybe', 'out')),
  joined_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  minute int
);

create table if not exists assists (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  goal_id uuid references goals(id) on delete set null
);

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  rater_id uuid references players(id) on delete set null,
  anonymous_rater_hash text,
  player_id uuid references players(id) on delete cascade,
  speed numeric(4,2) check (speed >= 0 and speed <= 10),
  shooting numeric(4,2) check (shooting >= 0 and shooting <= 10),
  passing_accuracy numeric(4,2) check (passing_accuracy >= 0 and passing_accuracy <= 10),
  dribbling numeric(4,2) check (dribbling >= 0 and dribbling <= 10),
  ball_control numeric(4,2) check (ball_control >= 0 and ball_control <= 10),
  stamina numeric(4,2) check (stamina >= 0 and stamina <= 10),
  constraint no_self_rating check (rater_id is null or rater_id <> player_id),
  constraint rater_identity_present check (rater_id is not null or anonymous_rater_hash is not null),
  unique (match_id, anonymous_rater_hash, player_id)
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete set null,
  label text not null,
  amount numeric(10,2) not null,
  paid_by uuid references players(id) on delete set null,
  spent_at date not null default current_date
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete set null,
  amount numeric(10,2) not null,
  paid_at date not null default current_date,
  note text
);

create table if not exists finance_snapshots (
  id uuid primary key default gen_random_uuid(),
  balance numeric(10,2) not null,
  currency text not null default 'dh',
  reserved_until date,
  note text,
  created_by uuid references players(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  field_name text not null,
  starts_at timestamptz not null,
  venue text,
  duration_minutes int not null default 60,
  sport text not null default 'Football',
  status text not null default 'upcoming',
  reservation_status text not null default 'closed' check (reservation_status in ('closed', 'open', 'completed')),
  reservation_open_at timestamptz,
  notification_sent_at timestamptz,
  match_report jsonb,
  external_provider text default 'Dabat Animations',
  external_id text unique
);

alter table attendance
  add column if not exists booking_id uuid references bookings(id) on delete cascade;

alter table attendance
  add constraint attendance_booking_player_key unique (booking_id, player_id);

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

create table if not exists app_notifications (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  notification_key text not null,
  title text not null,
  body text not null,
  href text not null default '/',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (player_id, notification_key)
);

create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('team', 'private', 'group')),
  created_by uuid references players(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists chat_participants (
  conversation_id uuid references chat_conversations(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, player_id)
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references chat_conversations(id) on delete cascade,
  sender_id uuid references players(id) on delete set null,
  body text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists bookings_starts_at_idx on bookings (starts_at);
create index if not exists bookings_open_at_idx on bookings (reservation_open_at);
create index if not exists attendance_booking_idx on attendance (booking_id);
create index if not exists finance_transactions_booking_idx on finance_transactions (booking_id);
create index if not exists app_notifications_player_idx on app_notifications (player_id, read_at);
create index if not exists chat_messages_conversation_idx on chat_messages (conversation_id, created_at);

create table if not exists mvp_votes (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  voter_id uuid references players(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  constraint no_self_mvp_vote check (voter_id <> player_id),
  unique (match_id, voter_id)
);

create table if not exists player_stats (
  player_id uuid primary key references players(id) on delete cascade,
  goals int not null default 0,
  assists int not null default 0,
  wins int not null default 0,
  mvps int not null default 0,
  win_percentage numeric(5,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists match_player_scores (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  submitted_by uuid references players(id) on delete set null,
  player_id uuid references players(id) on delete cascade,
  score numeric(3,1) not null check (score >= 1 and score <= 10),
  notes text,
  created_at timestamptz not null default now(),
  unique (match_id, submitted_by, player_id)
);

insert into players (name, position, skill, speed, stamina, passing, defense, shooting) values
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
on conflict do nothing;

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

insert into finance_snapshots (balance, currency, reserved_until, note) values
  (-170, 'dh', '2026-07-27', 'Nouvelle situation de la caisse a ce jour. Terrain reserve chaque semaine jusqu''au 27/07/2026');

insert into bookings (field_name, venue, starts_at, duration_minutes, sport, status, reservation_status, reservation_open_at, external_provider, external_id) values
  ('F6-10', 'LYCEE IBN ROCHD', '2026-06-29 20:00:00+01', 60, 'Football', 'upcoming', 'closed', reservation_open_at('2026-06-29 20:00:00+01'), 'Mes reservations', 'res-2026-06-29'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-06 20:00:00+01', 60, 'Football', 'upcoming', 'closed', reservation_open_at('2026-07-06 20:00:00+01'), 'Mes reservations', 'res-2026-07-06'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-13 20:00:00+01', 60, 'Football', 'upcoming', 'closed', reservation_open_at('2026-07-13 20:00:00+01'), 'Mes reservations', 'res-2026-07-13'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-20 20:00:00+01', 60, 'Football', 'upcoming', 'closed', reservation_open_at('2026-07-20 20:00:00+01'), 'Mes reservations', 'res-2026-07-20'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-27 20:00:00+01', 60, 'Football', 'upcoming', 'closed', reservation_open_at('2026-07-27 20:00:00+01'), 'Mes reservations', 'res-2026-07-27')
on conflict (external_id) do nothing;

alter table players enable row level security;
alter table user_roles enable row level security;
alter table bookings enable row level security;
alter table attendance enable row level security;
alter table finance_transactions enable row level security;
alter table app_notifications enable row level security;
alter table chat_conversations enable row level security;
alter table chat_participants enable row level security;
alter table chat_messages enable row level security;

drop policy if exists "players can read roster" on players;
create policy "players can read roster" on players for select using (auth.uid() is not null);

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

drop policy if exists "players update attendance only when open" on attendance;
create policy "players update attendance only when open" on attendance for all using (
  exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
) with check (
  exists (select 1 from players p where p.id = attendance.player_id and p.auth_user_id = auth.uid())
  and (
    attendance.booking_id is null
    or exists (
      select 1 from bookings b
      where b.id = attendance.booking_id
        and booking_attendance_is_open(b.starts_at, b.duration_minutes)
    )
  )
);

drop policy if exists "officers manage finance transactions" on finance_transactions;
drop policy if exists "players read finance transactions" on finance_transactions;
create policy "players read finance transactions" on finance_transactions for select using (auth.uid() is not null);

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

drop policy if exists "players read own notifications" on app_notifications;
create policy "players read own notifications" on app_notifications for select using (
  exists (select 1 from players p where p.id = app_notifications.player_id and p.auth_user_id = auth.uid())
);

drop policy if exists "participants read conversations" on chat_conversations;
create policy "participants read conversations" on chat_conversations for select using (
  exists (
    select 1 from chat_participants cp
    join players p on p.id = cp.player_id
    where cp.conversation_id = chat_conversations.id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists "participants read chat messages" on chat_messages;
create policy "participants read chat messages" on chat_messages for select using (
  exists (
    select 1 from chat_participants cp
    join players p on p.id = cp.player_id
    where cp.conversation_id = chat_messages.conversation_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists "participants send chat messages" on chat_messages;
create policy "participants send chat messages" on chat_messages for insert with check (
  exists (
    select 1 from chat_participants cp
    join players p on p.id = cp.player_id
    where cp.conversation_id = chat_messages.conversation_id
      and cp.player_id = chat_messages.sender_id
      and p.auth_user_id = auth.uid()
  )
);

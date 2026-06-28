create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  avatar_url text,
  skill int not null default 70,
  speed int not null default 70,
  stamina int not null default 70,
  passing int not null default 70,
  defense int not null default 70,
  shooting int not null default 70,
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  role text not null check (role in ('member', 'admin', 'finance', 'booking')),
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
  speed int check (speed between 1 and 5),
  shooting int check (shooting between 1 and 5),
  dribbling int check (dribbling between 1 and 5),
  ball_control int check (ball_control between 1 and 5),
  stamina int check (stamina between 1 and 5),
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
  status text not null default 'available',
  external_provider text default 'Dabat Animations',
  external_id text
);

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

insert into finance_snapshots (balance, currency, reserved_until, note) values
  (-170, 'dh', '2026-07-27', 'Nouvelle situation de la caisse a ce jour. Terrain reserve chaque semaine jusqu''au 27/07/2026');

insert into bookings (field_name, venue, starts_at, duration_minutes, sport, status, external_provider, external_id) values
  ('F6-10', 'LYCEE IBN ROCHD', '2026-06-29 20:00:00+01', 60, 'Football', 'upcoming', 'Mes reservations', 'res-2026-06-29'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-06 20:00:00+01', 60, 'Football', 'upcoming', 'Mes reservations', 'res-2026-07-06'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-13 20:00:00+01', 60, 'Football', 'upcoming', 'Mes reservations', 'res-2026-07-13'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-20 20:00:00+01', 60, 'Football', 'upcoming', 'Mes reservations', 'res-2026-07-20'),
  ('F6-10', 'LYCEE IBN ROCHD', '2026-07-27 20:00:00+01', 60, 'Football', 'upcoming', 'Mes reservations', 'res-2026-07-27');

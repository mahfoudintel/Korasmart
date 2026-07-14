-- Add confirmed August bookings from Rabat Animation / Mes reservations.
-- Each booking also receives the standard 80 DH finance deduction once.

with new_bookings(external_id, starts_at, venue, field_name, duration_minutes, sport, status, reservation_status, reservation_open_at, external_provider) as (
  values
    ('res-2026-08-03', '2026-08-03T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-08-02T11:00:00+01:00'::timestamptz, 'Rabat Animation'),
    ('res-2026-08-10', '2026-08-10T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-08-09T11:00:00+01:00'::timestamptz, 'Rabat Animation'),
    ('res-2026-08-17', '2026-08-17T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-08-16T11:00:00+01:00'::timestamptz, 'Rabat Animation'),
    ('res-2026-08-24', '2026-08-24T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-08-23T11:00:00+01:00'::timestamptz, 'Rabat Animation'),
    ('res-2026-08-31', '2026-08-31T20:00:00+01:00'::timestamptz, 'LYCEE IBN ROCHD', 'F6-10', 60, 'Football', 'upcoming', 'closed', '2026-08-30T11:00:00+01:00'::timestamptz, 'Rabat Animation')
),
upserted as (
  insert into public.bookings (
    external_id,
    starts_at,
    venue,
    field_name,
    duration_minutes,
    sport,
    status,
    reservation_status,
    reservation_open_at,
    external_provider
  )
  select
    external_id,
    starts_at,
    venue,
    field_name,
    duration_minutes,
    sport,
    status,
    reservation_status,
    reservation_open_at,
    external_provider
  from new_bookings
  on conflict (external_id) do update
  set
    starts_at = excluded.starts_at,
    venue = excluded.venue,
    field_name = excluded.field_name,
    duration_minutes = excluded.duration_minutes,
    sport = excluded.sport,
    status = excluded.status,
    reservation_status = excluded.reservation_status,
    reservation_open_at = excluded.reservation_open_at,
    external_provider = excluded.external_provider
  returning id, external_id, venue, starts_at
)
insert into public.finance_transactions (type, amount, booking_id, note)
select
  'booking_cost',
  -80,
  b.id,
  'Booking cost: ' || b.venue || ' ' || to_char(b.starts_at at time zone 'Africa/Casablanca', 'YYYY-MM-DD HH24:MI')
from public.bookings b
join new_bookings nb on nb.external_id = b.external_id
where not exists (
  select 1
  from public.finance_transactions ft
  where ft.booking_id = b.id
    and ft.type = 'booking_cost'
);

with contribution_payments(player_name, amount, paid_at, note) as (
  values
    ('Nawfal', 300, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Elhachmi', 300, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Said', 200, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Badr', 300, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Abdou', 200, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Abdelhamid', 200, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Ahmed G', 400, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Ismail', 300, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Najib', 100, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Ahmed A', 100, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14'),
    ('Driss', 100, '2026-07-14'::date, 'Contribution recue - situation caisse 2026-07-14')
)
insert into public.payments (player_id, amount, paid_at, note)
select
  p.id,
  cp.amount,
  cp.paid_at,
  cp.note
from contribution_payments cp
join public.players p on lower(p.name) = lower(cp.player_name)
where not exists (
  select 1
  from public.payments existing
  where existing.player_id = p.id
    and existing.amount = cp.amount
    and existing.paid_at = cp.paid_at
    and existing.note = cp.note
);

insert into public.finance_snapshots (balance, currency, reserved_until, note)
select
  -170,
  'dh',
  '2026-08-31'::date,
  'Nouvelle situation de la caisse a ce jour : -170 dh. Terrain reserve chaque semaine jusqu''au 31/08/2026.'
where not exists (
  select 1
  from public.finance_snapshots existing
  where existing.balance = -170
    and existing.currency = 'dh'
    and existing.reserved_until = '2026-08-31'::date
    and existing.note = 'Nouvelle situation de la caisse a ce jour : -170 dh. Terrain reserve chaque semaine jusqu''au 31/08/2026.'
);

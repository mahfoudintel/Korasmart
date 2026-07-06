alter table bookings
  add column if not exists external_id text;

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
where b.external_id = s.external_id;

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

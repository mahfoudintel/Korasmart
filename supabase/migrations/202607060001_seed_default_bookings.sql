alter table bookings
  add column if not exists external_id text;

alter table bookings
  drop constraint if exists bookings_external_id_key;

drop index if exists bookings_external_id_key;

create unique index bookings_external_id_key
  on bookings(external_id);

insert into bookings (
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
values
  (
    'res-2026-06-29',
    '2026-06-29T20:00:00+01:00',
    'LYCEE IBN ROCHD',
    'F6-10',
    60,
    'Football',
    'past',
    'completed',
    '2026-06-28T11:00:00+01:00',
    'KoraSmart seed'
  ),
  (
    'res-2026-07-06',
    '2026-07-06T20:00:00+01:00',
    'LYCEE IBN ROCHD',
    'F6-10',
    60,
    'Football',
    'upcoming',
    'open',
    '2026-07-05T11:00:00+01:00',
    'KoraSmart seed'
  ),
  (
    'res-2026-07-13',
    '2026-07-13T20:00:00+01:00',
    'LYCEE IBN ROCHD',
    'F6-10',
    60,
    'Football',
    'upcoming',
    'closed',
    '2026-07-12T11:00:00+01:00',
    'KoraSmart seed'
  ),
  (
    'res-2026-07-20',
    '2026-07-20T20:00:00+01:00',
    'LYCEE IBN ROCHD',
    'F6-10',
    60,
    'Football',
    'upcoming',
    'closed',
    '2026-07-19T11:00:00+01:00',
    'KoraSmart seed'
  ),
  (
    'res-2026-07-27',
    '2026-07-27T20:00:00+01:00',
    'LYCEE IBN ROCHD',
    'F6-10',
    60,
    'Football',
    'upcoming',
    'closed',
    '2026-07-26T11:00:00+01:00',
    'KoraSmart seed'
  )
on conflict (external_id) do update
set
  starts_at = excluded.starts_at,
  venue = excluded.venue,
  field_name = excluded.field_name,
  duration_minutes = excluded.duration_minutes,
  sport = excluded.sport,
  status = excluded.status,
  reservation_status = excluded.reservation_status,
  reservation_open_at = excluded.reservation_open_at;

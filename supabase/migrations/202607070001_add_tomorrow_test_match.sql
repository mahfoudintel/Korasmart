with test_booking as (
  select
    'res-2026-07-08-test'::text as external_id,
    '2026-07-08T20:00:00+01:00'::timestamptz as starts_at,
    'LYCEE IBN ROCHD'::text as venue,
    ''::text as field_name,
    60::integer as duration_minutes,
    'Football'::text as sport,
    'upcoming'::text as status,
    'open'::text as reservation_status,
    '2026-07-07T11:00:00+01:00'::timestamptz as reservation_open_at,
    'KoraSmart test'::text as external_provider
)
update public.bookings b
set
  starts_at = t.starts_at,
  venue = t.venue,
  field_name = t.field_name,
  duration_minutes = t.duration_minutes,
  sport = t.sport,
  status = t.status,
  reservation_status = t.reservation_status,
  reservation_open_at = t.reservation_open_at,
  external_provider = t.external_provider
from test_booking t
where b.external_id = t.external_id;

with test_booking as (
  select
    'res-2026-07-08-test'::text as external_id,
    '2026-07-08T20:00:00+01:00'::timestamptz as starts_at,
    'LYCEE IBN ROCHD'::text as venue,
    ''::text as field_name,
    60::integer as duration_minutes,
    'Football'::text as sport,
    'upcoming'::text as status,
    'open'::text as reservation_status,
    '2026-07-07T11:00:00+01:00'::timestamptz as reservation_open_at,
    'KoraSmart test'::text as external_provider
)
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
  t.external_id,
  t.starts_at,
  t.venue,
  t.field_name,
  t.duration_minutes,
  t.sport,
  t.status,
  t.reservation_status,
  t.reservation_open_at,
  t.external_provider
from test_booking t
where not exists (
  select 1
  from public.bookings b
  where b.external_id = t.external_id
);

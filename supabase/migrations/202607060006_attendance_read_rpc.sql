create or replace function public.korasmart_get_attendance()
returns table (
  booking_external_id text,
  player_name text,
  status text,
  joined_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.external_id as booking_external_id,
    p.name as player_name,
    a.status,
    a.joined_at
  from public.attendance a
  join public.bookings b on b.id = a.booking_id
  join public.players p on p.id = a.player_id
  where auth.uid() is not null
    and a.status in ('playing', 'waiting')
    and b.external_id is not null
  order by b.starts_at, a.joined_at;
$$;

grant execute on function public.korasmart_get_attendance() to authenticated;

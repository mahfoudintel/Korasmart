create or replace function public.korasmart_save_attendance(
  p_booking_external_id text,
  p_player_name text,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_player_id uuid;
  v_target_player_id uuid;
  v_booking_id uuid;
  v_is_superuser boolean;
  v_updated_count integer;
begin
  if auth.uid() is null then
    raise exception 'You must be logged in.';
  end if;

  if p_status not in ('playing', 'waiting') then
    raise exception 'Invalid attendance status.';
  end if;

  select id
  into v_actor_player_id
  from public.players
  where auth_user_id = auth.uid()
  limit 1;

  if v_actor_player_id is null then
    raise exception 'Logged-in user is not linked to a player.';
  end if;

  select id
  into v_target_player_id
  from public.players
  where lower(name) = lower(p_player_name)
    and is_active is not false
  limit 1;

  if v_target_player_id is null then
    raise exception 'Player was not found.';
  end if;

  select exists (
    select 1
    from public.user_roles
    where player_id = v_actor_player_id
      and role = 'superuser'
  )
  into v_is_superuser;

  if v_target_player_id <> v_actor_player_id and not v_is_superuser then
    raise exception 'Only a superuser can update another player attendance.';
  end if;

  select id
  into v_booking_id
  from public.bookings
  where external_id = p_booking_external_id
    and (
      reservation_status = 'open'
      or public.booking_attendance_is_open(starts_at, duration_minutes)
    )
  order by starts_at
  limit 1;

  if v_booking_id is null then
    raise exception 'This booking is not open for attendance.';
  end if;

  update public.attendance
  set
    status = p_status,
    joined_at = now()
  where booking_id = v_booking_id
    and player_id = v_target_player_id;

  get diagnostics v_updated_count = row_count;

  if v_updated_count = 0 then
    insert into public.attendance (booking_id, player_id, status, joined_at)
    values (v_booking_id, v_target_player_id, p_status, now());
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.korasmart_delete_attendance(
  p_booking_external_id text,
  p_player_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_player_id uuid;
  v_target_player_id uuid;
  v_booking_id uuid;
  v_is_superuser boolean;
begin
  if auth.uid() is null then
    raise exception 'You must be logged in.';
  end if;

  select id
  into v_actor_player_id
  from public.players
  where auth_user_id = auth.uid()
  limit 1;

  if v_actor_player_id is null then
    raise exception 'Logged-in user is not linked to a player.';
  end if;

  select id
  into v_target_player_id
  from public.players
  where lower(name) = lower(p_player_name)
    and is_active is not false
  limit 1;

  if v_target_player_id is null then
    raise exception 'Player was not found.';
  end if;

  select exists (
    select 1
    from public.user_roles
    where player_id = v_actor_player_id
      and role = 'superuser'
  )
  into v_is_superuser;

  if v_target_player_id <> v_actor_player_id and not v_is_superuser then
    raise exception 'Only a superuser can update another player attendance.';
  end if;

  select id
  into v_booking_id
  from public.bookings
  where external_id = p_booking_external_id
    and (
      reservation_status = 'open'
      or public.booking_attendance_is_open(starts_at, duration_minutes)
    )
  order by starts_at
  limit 1;

  if v_booking_id is null then
    raise exception 'This booking is not open for attendance.';
  end if;

  delete from public.attendance
  where booking_id = v_booking_id
    and player_id = v_target_player_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.korasmart_save_attendance(text, text, text) to authenticated;
grant execute on function public.korasmart_delete_attendance(text, text) to authenticated;

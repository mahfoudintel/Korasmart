-- Repair first-login password reset.
-- The previous profile lookup RPC linked auth users correctly, but it also
-- cleared must_change_password on every login. That prevented the reset screen
-- from appearing. This version preserves the flag and only updates identity
-- fields needed for linking.

create or replace function public.korasmart_get_my_profile()
returns table (
  id uuid,
  name text,
  username text,
  avatar_preset text,
  must_change_password boolean,
  role text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auth_user_id uuid;
  v_email text;
  v_email_username text;
  v_player_id uuid;
begin
  v_auth_user_id := auth.uid();

  if v_auth_user_id is null then
    return;
  end if;

  select lower(email)
  into v_email
  from auth.users
  where auth.users.id = v_auth_user_id
  limit 1;

  v_email_username := split_part(coalesce(v_email, ''), '@', 1);

  select p.id
  into v_player_id
  from public.players p
  where p.auth_user_id = v_auth_user_id
    or lower(p.username) = v_email_username
    or lower(regexp_replace(p.name, '[^a-zA-Z0-9]+', '.', 'g')) = v_email_username
    or lower(regexp_replace(p.name, '[^a-zA-Z0-9]+', '', 'g')) = replace(v_email_username, '.', '')
  order by
    case when p.auth_user_id = v_auth_user_id then 0 else 1 end,
    p.created_at
  limit 1;

  if v_player_id is null then
    return;
  end if;

  update public.players p
  set
    auth_user_id = v_auth_user_id,
    username = coalesce(nullif(p.username, ''), v_email_username),
    is_active = true
  where p.id = v_player_id;

  return query
  select
    p.id,
    p.name,
    p.username,
    p.avatar_preset,
    p.must_change_password,
    coalesce(
      (
        select ur.role
        from public.user_roles ur
        where ur.player_id = p.id
        order by
          case ur.role
            when 'superuser' then 1
            when 'admin' then 2
            when 'budgeting_booking_officer' then 3
            else 4
          end
        limit 1
      ),
      'player'
    ) as role
  from public.players p
  where p.id = v_player_id;
end;
$$;

grant execute on function public.korasmart_get_my_profile() to authenticated;

-- Current linked accounts should be prompted once. The app sets this back to
-- false immediately after the player saves a private password.
update public.players
set must_change_password = true
where auth_user_id is not null
  and username is not null
  and coalesce(must_change_password, false) = false;

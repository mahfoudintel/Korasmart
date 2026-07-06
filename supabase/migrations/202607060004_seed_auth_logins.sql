create extension if not exists "pgcrypto";

do $$
declare
  account record;
  v_auth_user_id uuid;
  v_identity_columns text;
  v_identity_values text;
begin
  for account in
    select *
    from (
      values
        ('Najib', 'najib', 'najib@korasmart.local'),
        ('Ahmed A', 'ahmed.a', 'ahmed.a@korasmart.local'),
        ('Ahmed G', 'ahmed.g', 'ahmed.g@korasmart.local'),
        ('Nawfal', 'nawfal', 'nawfal@korasmart.local'),
        ('Badr', 'badr', 'badr@korasmart.local'),
        ('Said', 'said', 'said@korasmart.local'),
        ('Driss', 'driss', 'driss@korasmart.local'),
        ('Abdou', 'abdou', 'abdou@korasmart.local'),
        ('Bobker', 'bobker', 'bobker@korasmart.local'),
        ('Abdelhamid', 'abdelhamid', 'abdelhamid@korasmart.local'),
        ('Ismail', 'ismail', 'ismail@korasmart.local'),
        ('Mehdi', 'mehdi', 'mehdi@korasmart.local'),
        ('Elhachmi', 'elhachmi', 'elhachmi@korasmart.local'),
        ('Miloudi', 'miloudi', 'miloudi@korasmart.local'),
        ('Yassine', 'yassine', 'yassine@korasmart.local'),
        ('Hicham', 'hicham', 'hicham@korasmart.local')
    ) as accounts(player_name, username, email)
  loop
    select id
    into v_auth_user_id
    from auth.users
    where lower(email) = lower(account.email)
    limit 1;

    if v_auth_user_id is null then
      v_auth_user_id := gen_random_uuid();

      insert into auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      )
      values (
        '00000000-0000-0000-0000-000000000000',
        v_auth_user_id,
        'authenticated',
        'authenticated',
        account.email,
        crypt('kora2026', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('player_name', account.player_name, 'username', account.username),
        now(),
        now()
      );
    else
      update auth.users
      set
        encrypted_password = crypt('kora2026', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('player_name', account.player_name, 'username', account.username),
        updated_at = now()
      where id = v_auth_user_id;
    end if;

    update players
    set
      auth_user_id = v_auth_user_id,
      username = account.username,
      must_change_password = false
    where lower(name) = lower(account.player_name);

    if to_regclass('auth.identities') is not null
      and not exists (
        select 1
        from auth.identities
        where user_id = v_auth_user_id
          and provider = 'email'
      )
    then
      v_identity_columns := 'id, user_id, provider, identity_data, created_at, updated_at';
      v_identity_values := format(
        '%L, %L::uuid, %L, %L::jsonb, now(), now()',
        v_auth_user_id::text,
        v_auth_user_id::text,
        'email',
        jsonb_build_object(
          'sub', v_auth_user_id::text,
          'email', account.email,
          'email_verified', true,
          'phone_verified', false
        )::text
      );

      if exists (
        select 1
        from information_schema.columns
        where table_schema = 'auth'
          and table_name = 'identities'
          and column_name = 'provider_id'
      ) then
        v_identity_columns := v_identity_columns || ', provider_id';
        v_identity_values := v_identity_values || format(', %L', v_auth_user_id::text);
      end if;

      if exists (
        select 1
        from information_schema.columns
        where table_schema = 'auth'
          and table_name = 'identities'
          and column_name = 'email'
      ) then
        v_identity_columns := v_identity_columns || ', email';
        v_identity_values := v_identity_values || format(', %L', account.email);
      end if;

      execute format(
        'insert into auth.identities (%s) values (%s)',
        v_identity_columns,
        v_identity_values
      );
    end if;
  end loop;
end $$;

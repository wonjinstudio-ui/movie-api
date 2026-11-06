update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"is_admin": true}'::jsonb
where id = '사용자_UUID'::uuid
returning id, email, raw_app_meta_data;

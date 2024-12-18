begin
  insert into public.User(user_id, full_name, first_name, last_name, email, username, phone_number, avatar_url)
  values(
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'email',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
create table
  public.user (
    user_id uuid not null default extensions.uuid_generate_v4 (),
    email character varying not null,
    phone_number text null,
    avatar_url text null default 'https://rskkvbpsgczyxsbbnemv.supabase.co/storage/v1/object/public/listing-photos/basic-default-pfp-pxi77qv5o0zuz8j3.jpg?t=2024-12-18T01%3A38%3A43.917Z'::text,
    user_type text null default 'roommate'::text,
    created_at timestamp without time zone null default current_timestamp,
    full_name text null,
    first_name text null,
    last_name text null,
    username text null,
    constraint User_pkey primary key (user_id),
    constraint User_email_key unique (email),
    constraint user_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade,
    constraint User_user_type_check check (
      (
        user_type = any (
          array[
            ('host'::character varying)::text,
            ('roommate'::character varying)::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create table
  public.matches (
    match_id bigint generated always as identity not null,
    listing_id uuid null,
    user_id uuid null,
    match_status character varying null,
    created_at timestamp without time zone null default current_timestamp,
    constraint matches_pkey primary key (match_id),
    constraint matches_listing_id_fkey foreign key (listing_id) references listings (listing_id) on delete cascade,
    constraint matches_user_id_fkey foreign key (user_id) references "user" (user_id) on delete cascade,
    constraint matches_match_status_check check (
      (
        (match_status)::text = any (
          (
            array[
              'pending'::character varying,
              'accepted'::character varying,
              'rejected'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;
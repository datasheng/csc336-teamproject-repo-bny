  create table
  public.ratings (
    rating_id bigint generated always as identity not null,
    reviewer_id uuid null,
    reviewee_id uuid null,
    reviewee_type character varying null,
    created_at timestamp without time zone null default current_timestamp,
    constraint ratings_pkey primary key (rating_id),
    constraint ratings_reviewee_id_fkey foreign key (reviewee_id) references "user" (user_id) on delete set null,
    constraint ratings_reviewer_id_fkey foreign key (reviewer_id) references "user" (user_id) on delete set null,
    constraint ratings_reviewee_type_check check (
      (
        (reviewee_type)::text = any (
          (
            array[
              'host'::character varying,
              'roommate'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

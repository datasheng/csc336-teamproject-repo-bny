

  create table
  public.contact_form_submissions (
    submission_id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    subject character varying not null,
    message text not null,
    status text null default 'pending'::text,
    created_at timestamp without time zone null default current_timestamp,
    updated_at timestamp without time zone null default current_timestamp,
    constraint contact_form_submissions_pkey primary key (submission_id),
    constraint contact_form_submissions_user_id_fkey foreign key (user_id) references "user" (user_id) on delete set null,
    constraint contact_form_submissions_status_check check (
      (
        status = any (
          array[
            ('pending'::character varying)::text,
            ('in_progress'::character varying)::text,
            ('resolved'::character varying)::text,
            ('closed'::character varying)::text
          ]
        )
      )
    )
  ) tablespace pg_default;
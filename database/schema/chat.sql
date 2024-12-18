create table
  public.chat (
    chat_id uuid not null default extensions.uuid_generate_v4 (),
    listing_id uuid null,
    host_id uuid null,
    roommate_id uuid null,
    host_matched boolean null default false,
    roommate_matched boolean null default false,
    created_at timestamp without time zone null default current_timestamp,
    updated_at timestamp without time zone null default current_timestamp,
    constraint chat_pkey primary key (chat_id),
    constraint chat_host_id_fkey foreign key (host_id) references "user" (user_id) on update cascade on delete cascade,
    constraint chat_listing_id_fkey foreign key (listing_id) references listings (listing_id) on delete cascade,
    constraint chat_roommate_id_fkey foreign key (roommate_id) references "user" (user_id) on delete cascade
  ) tablespace pg_default;
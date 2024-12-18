  create table
  public.listings (
    listing_id uuid not null default extensions.uuid_generate_v4 (),
    author_id uuid null,
    title character varying not null,
    rent bigint not null,
    description character varying null,
    address character varying null,
    max_roommates integer null,
    created_at timestamp without time zone null default current_timestamp,
    beds bigint null,
    baths bigint null,
    levels bigint null,
    sqft bigint null,
    listing_photo_id uuid null,
    status text null,
    constraint listings_pkey primary key (listing_id),
    constraint listings_author_id_fkey foreign key (author_id) references "user" (user_id) on delete cascade
  ) tablespace pg_default;
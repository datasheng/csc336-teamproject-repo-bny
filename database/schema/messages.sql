create table
  public.messages (
    message_id uuid not null default extensions.uuid_generate_v4 (),
    chat_id uuid null,
    sender_id uuid null,
    recipient_id uuid null,
    content text not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint messages_pkey primary key (message_id),
    constraint messages_chat_id_fkey foreign key (chat_id) references chat (chat_id) on delete cascade,
    constraint messages_recipient_id_fkey foreign key (recipient_id) references "user" (user_id) on delete set null,
    constraint messages_sender_id_fkey foreign key (sender_id) references "user" (user_id) on delete set null
  ) tablespace pg_default;
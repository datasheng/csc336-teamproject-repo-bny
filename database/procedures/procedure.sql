--This is a mock procedure that represents executing all of the sql commands in the schema, functions and triggers folder. This project is set up on Supabase (backend as a service) and the schema, functions and triggers are stored in the online database. 

-- Set search path
SET search_path TO public;

-- Load Schema Files
\echo 'Loading schema files...'
\i schema/tables/users.sql
\i schema/tables/listings.sql
\i schema/tables/matches.sql
\i schema/tables/chat.sql
\i schema/tables/messages.sql
\i schema/tables/ratings.sql

-- Load Functions
\echo 'Loading functions...'
\i schema/functions/handle_match_status.sql
\i schema/functions/update_user_profile.sql
\i schema/functions/create_chat.sql
\i schema/functions/submit_rating.sql

-- Load Triggers
\echo 'Loading triggers...'
\i schema/triggers/update_timestamp.sql
\i schema/triggers/notify_match.sql
\i schema/triggers/notify_message.sql

-- Verify Installation
DO $$
BEGIN
    -- Check if tables exist
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('user', 'listings', 'matches', 'chat', 'messages', 'ratings')
    ) THEN
        RAISE EXCEPTION 'Schema installation failed: Missing tables';
    END IF;

    -- Check if functions exist
    IF NOT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname IN (
            'handle_match_status',
            'update_user_profile',
            'create_chat',
            'submit_rating'
        )
    ) THEN
        RAISE EXCEPTION 'Function installation failed: Missing functions';
    END IF;

    RAISE NOTICE 'Installation completed successfully';
END $$;
-- Create a new user with a password
CREATE USER valorantengine WITH PASSWORD 'mypassword';

-- Optionally allow the user to create other databases (optional for devs)
ALTER USER valorantengine CREATEDB;

-- Create a new database owned by the new user
CREATE DATABASE esport OWNER valorantengine;

-- Connect to the new database (required for granting schema/table-level privileges)
\connect esport

-- Grant basic privileges on the public schema
GRANT ALL ON SCHEMA public TO valorantengine;

-- Ensure the user can use existing and future tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO valorantengine;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO valorantengine;

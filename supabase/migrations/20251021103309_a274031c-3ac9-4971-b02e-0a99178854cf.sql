-- Remove demo credential columns from projects table
-- These credentials were publicly exposed via RLS policy
ALTER TABLE public.projects 
DROP COLUMN IF EXISTS demo_username,
DROP COLUMN IF EXISTS demo_password;
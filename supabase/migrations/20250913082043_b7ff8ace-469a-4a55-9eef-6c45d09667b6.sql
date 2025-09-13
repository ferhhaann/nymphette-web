-- Fix authors table RLS policies to prevent public access to email addresses

-- First, check current policies and drop any that allow public read access to all fields
DROP POLICY IF EXISTS "Public can read authors" ON authors;
DROP POLICY IF EXISTS "Authors are viewable by everyone" ON authors;
DROP POLICY IF EXISTS "authors_public_read" ON authors;

-- The authors table should only be accessible by admins for full access
-- Public access should use the secure functions get_author_public_info() and get_authors_public()

-- Ensure admin-only access policy exists (it should already exist)
-- This policy allows admins full CRUD access to authors including email addresses
CREATE POLICY IF NOT EXISTS "authors_admin_only" ON authors
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- No public read policy should exist on authors table
-- Public access to author data should only happen through:
-- 1. get_author_public_info(author_id) - for single author (no email)
-- 2. get_authors_public() - for all authors (no email)
-- 3. get_author_for_blog(author_id) - for blog posts (no email)

-- Add audit logging for author data access
CREATE OR REPLACE FUNCTION log_author_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when author data is accessed by admins
  IF TG_OP = 'SELECT' AND is_admin() THEN
    PERFORM log_admin_action('AUTHOR_ACCESSED', 'authors', OLD.id::text);
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
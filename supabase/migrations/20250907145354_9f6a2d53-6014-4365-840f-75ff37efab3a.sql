-- Fix authors table RLS to properly protect email addresses
-- Remove all current policies and start fresh

DROP POLICY IF EXISTS "Public can read author info (no emails)" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can read author profiles (no emails)" ON public.authors;
DROP POLICY IF EXISTS "Only admins can read full author data" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can manage authors" ON public.authors;

-- Create new restrictive policies
-- Only admins can read full author data (including emails)
CREATE POLICY "Admins can read full author data" ON public.authors
FOR SELECT 
USING (is_admin());

-- Only admins can manage authors
CREATE POLICY "Admins can manage authors" ON public.authors
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create a view for public author data without emails
CREATE OR REPLACE VIEW public.authors_public AS
SELECT 
  id,
  name,
  bio,
  avatar_url,
  social_links,
  created_at,
  updated_at
FROM public.authors;

-- Grant access to the view for all users
GRANT SELECT ON public.authors_public TO anon, authenticated;

-- The view will be used by application code instead of direct table access for non-admin users
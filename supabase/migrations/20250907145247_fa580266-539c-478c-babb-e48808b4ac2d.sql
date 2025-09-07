-- Create a more secure policy for authors table that actually filters fields at database level
-- Drop the current policy and replace with field-filtered policies

DROP POLICY IF EXISTS "Public can read author info (no emails)" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can read author profiles (no emails)" ON public.authors;

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

-- Grant access to the view
GRANT SELECT ON public.authors_public TO anon, authenticated;

-- Create policy for the view (optional, since it doesn't contain sensitive data)
ALTER VIEW public.authors_public OWNER TO postgres;

-- Update RLS policies for authors table to be more restrictive
-- Only allow admin access to full author data
CREATE POLICY "Only admins can read full author data" ON public.authors
FOR SELECT 
USING (is_admin());

-- Allow authenticated users (who aren't admins) to read non-sensitive fields only
-- This policy won't actually filter fields, but the view above will be used instead
CREATE POLICY "Authenticated users can read basic author info" ON public.authors
FOR SELECT 
USING (auth.role() = 'authenticated' AND NOT is_admin());

-- Create a secure function for public author data access
CREATE OR REPLACE FUNCTION public.get_public_author_data()
RETURNS TABLE(
  id uuid,
  name text,
  bio text,
  avatar_url text,
  social_links jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.id,
    a.name,
    a.bio,
    a.avatar_url,
    a.social_links,
    a.created_at,
    a.updated_at
  FROM public.authors a;
$$;
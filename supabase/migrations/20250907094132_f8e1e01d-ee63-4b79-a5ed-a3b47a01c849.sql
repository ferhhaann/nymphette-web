-- Fix authors table RLS policy to properly hide email addresses from public access

-- Drop the current ineffective policy
DROP POLICY IF EXISTS "Public can read author profiles (without emails)" ON public.authors;

-- Create a proper RLS policy that excludes email from public access
-- We need to use a more restrictive approach since PostgreSQL RLS can't selectively hide columns in SELECT policies

-- First, create a view for public author information
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

-- Enable RLS on the view (though it inherits from the base table)
-- Now update the authors table policy to be more restrictive

-- Only authenticated users can read full author data (including emails)
CREATE POLICY "Authenticated users can read full author data" 
ON public.authors 
FOR SELECT 
TO authenticated
USING (true);

-- Create a secure function for public author access that specifically excludes emails
CREATE OR REPLACE FUNCTION public.get_authors_public()
RETURNS TABLE (
    id UUID,
    name TEXT,
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
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

-- Grant access to the public function
GRANT EXECUTE ON FUNCTION public.get_authors_public() TO anon;
GRANT EXECUTE ON FUNCTION public.get_authors_public() TO authenticated;
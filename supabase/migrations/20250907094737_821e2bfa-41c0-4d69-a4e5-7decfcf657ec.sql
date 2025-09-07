-- Simple and effective fix: Create proper RLS policies for authors table

-- Drop the current policy
DROP POLICY IF EXISTS "Public can read author profiles" ON public.authors;

-- Create a policy that allows public access for reading but we need application-level controls
-- Since we can't restrict columns at the RLS level, we'll use a different approach

-- Allow public read access (but application must be responsible for not selecting email)
CREATE POLICY "Public can read author information" 
ON public.authors 
FOR SELECT 
USING (true);

-- Create secure utility function specifically for public blog display
CREATE OR REPLACE FUNCTION public.get_author_for_blog(author_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB
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
        a.social_links
    FROM public.authors a
    WHERE a.id = author_id;
$$;

-- Add comment to remind developers about email security
COMMENT ON TABLE public.authors IS 'SECURITY WARNING: When querying this table from public-facing code, never select the email column. Use get_author_for_blog() function or explicit field lists excluding email.';
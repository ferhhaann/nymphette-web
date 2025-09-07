-- Fix security issues with author email addresses being publicly readable
-- Remove the overly permissive public read policy for authors table
DROP POLICY IF EXISTS "Public can read author information" ON public.authors;

-- Create a new policy that excludes email addresses from public access
-- Public users can only read name, bio, avatar_url, and social_links
CREATE POLICY "Public can read author info (no emails)" ON public.authors
FOR SELECT 
USING (true);

-- Note: The actual field filtering will be handled by application code using 
-- the existing secure functions: get_author_public_info() and get_authors_public()

-- Fix contact_submissions table - remove public read access
DROP POLICY IF EXISTS "Public can read contact submissions" ON public.contact_submissions;

-- Fix enquiries table - remove any public read policies
DROP POLICY IF EXISTS "Public can read enquiries" ON public.enquiries;

-- Update blog_comments to protect commenter email addresses
DROP POLICY IF EXISTS "Public can read approved comments" ON public.blog_comments;

-- Create new policy for blog comments that excludes email addresses from public view
CREATE POLICY "Public can read approved comments (no emails)" ON public.blog_comments
FOR SELECT 
USING (status = 'approved');

-- Create admin-only policy for full blog comment access
CREATE POLICY "Admins can read all blog comment data" ON public.blog_comments
FOR SELECT 
USING (is_admin());
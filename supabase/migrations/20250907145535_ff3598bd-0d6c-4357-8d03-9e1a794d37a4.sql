-- Fix remaining security issues

-- 1. Remove problematic policies that allow reading sensitive data
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can read approved comments (no emails)" ON public.blog_comments;
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON public.blog_comments;

-- 2. Create restrictive policies for contact_submissions (admin only)
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Create secure function for public blog comments without emails
CREATE OR REPLACE FUNCTION public.get_blog_comments_public(blog_post_id uuid)
RETURNS TABLE(
  id uuid,
  post_id uuid,
  author_name text,
  content text,
  created_at timestamptz,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bc.id,
    bc.post_id,
    bc.author_name,
    bc.content,
    bc.created_at,
    bc.status
  FROM public.blog_comments bc
  WHERE bc.post_id = blog_post_id 
    AND bc.status = 'approved';
$$;

-- 4. Create admin-only policy for blog comments
CREATE POLICY "Admins can manage blog comments" ON public.blog_comments
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 5. Allow public to insert comments (they can submit but not read others' emails)
CREATE POLICY "Public can create blog comments" ON public.blog_comments
FOR INSERT 
WITH CHECK (true);
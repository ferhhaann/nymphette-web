-- FINAL AUTHORS TABLE SECURITY FIX - Remove all public access to authors table
-- This completes the security fix for customer contact information exposure

-- Remove any public access to authors table entirely
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Ensure only admins can access authors table (no public policies)
DROP POLICY IF EXISTS "authors_admin_full_access" ON public.authors;

-- Only admin full access to authors table
CREATE POLICY "authors_admin_only" 
ON public.authors 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Update the existing secure functions to ensure they don't expose emails
CREATE OR REPLACE FUNCTION public.get_author_for_blog(author_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  bio text, 
  avatar_url text, 
  social_links jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.bio,
    a.avatar_url,
    a.social_links
  FROM public.authors a
  WHERE a.id = author_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure blog comments submitted by public don't expose sensitive data in logs
CREATE OR REPLACE FUNCTION public.secure_blog_comment_insert(
  post_id uuid,
  author_name text,
  author_email text,
  content text
) RETURNS json AS $$
DECLARE
  result json;
  comment_id uuid;
BEGIN
  -- Validate input (basic sanitization already done in app layer)
  IF LENGTH(author_name) = 0 OR LENGTH(content) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Name and content are required');
  END IF;
  
  -- Insert comment with pending status
  INSERT INTO public.blog_comments (post_id, author_name, author_email, content, status)
  VALUES (post_id, author_name, author_email, content, 'pending')
  RETURNING id INTO comment_id;
  
  -- Log the action without exposing sensitive data
  PERFORM public.audit_data_access('blog_comments', 'SECURE_INSERT');
  
  RETURN json_build_object('success', true, 'comment_id', comment_id);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Failed to submit comment');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- Fix security issues with sensitive data exposure

-- 1. Create a secure function to get blog comments without exposing email addresses
CREATE OR REPLACE FUNCTION public.get_blog_comments_safe(blog_post_id uuid)
RETURNS TABLE(id uuid, post_id uuid, author_name text, content text, created_at timestamp with time zone, status text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- 2. Create a secure function to get author info without exposing email addresses  
CREATE OR REPLACE FUNCTION public.get_author_public_info_safe(author_id uuid)
RETURNS TABLE(id uuid, name text, bio text, avatar_url text, social_links jsonb)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT a.id, a.name, a.bio, a.avatar_url, a.social_links
  FROM public.authors a
  WHERE a.id = author_id;
$$;

-- 3. Update RLS policies for blog_comments to be more restrictive
DROP POLICY IF EXISTS "blog_comments_admin_all" ON public.blog_comments;
DROP POLICY IF EXISTS "blog_comments_public_insert" ON public.blog_comments;

-- New restrictive policies for blog_comments
CREATE POLICY "blog_comments_admin_read_all" 
ON public.blog_comments 
FOR SELECT 
USING (is_admin());

CREATE POLICY "blog_comments_admin_write_all" 
ON public.blog_comments 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "blog_comments_public_insert_only" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

-- 4. Ensure contact_submissions has proper RLS policies (they should already be secure but let's verify)
-- Drop and recreate to ensure consistency
DROP POLICY IF EXISTS "contact_submissions_admin_all" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_public_insert" ON public.contact_submissions;

CREATE POLICY "contact_submissions_admin_read_all" 
ON public.contact_submissions 
FOR SELECT 
USING (is_admin());

CREATE POLICY "contact_submissions_admin_write_all" 
ON public.contact_submissions 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "contact_submissions_public_insert_only" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- 5. Restrict authors table to hide sensitive information
DROP POLICY IF EXISTS "authors_admin_only" ON public.authors;

CREATE POLICY "authors_admin_all_access" 
ON public.authors 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Fix CORS configuration access
DROP POLICY IF EXISTS "Admins can manage CORS configuration" ON public.cors_configuration;
DROP POLICY IF EXISTS "Public can read CORS configuration" ON public.cors_configuration;

CREATE POLICY "cors_admin_only_read" 
ON public.cors_configuration 
FOR SELECT
USING (is_admin());

CREATE POLICY "cors_admin_only_write" 
ON public.cors_configuration 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 7. Create audit log for security-sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log access to sensitive tables
  INSERT INTO public.admin_audit_log (
    user_id, 
    action, 
    table_name, 
    record_id
  ) VALUES (
    auth.uid(),
    TG_OP || '_SENSITIVE_DATA',
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers for auditing sensitive data access
DROP TRIGGER IF EXISTS audit_contact_submissions ON public.contact_submissions;
CREATE TRIGGER audit_contact_submissions
AFTER INSERT OR UPDATE OR DELETE ON public.contact_submissions
FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

DROP TRIGGER IF EXISTS audit_blog_comments ON public.blog_comments;
CREATE TRIGGER audit_blog_comments
AFTER INSERT OR UPDATE OR DELETE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();
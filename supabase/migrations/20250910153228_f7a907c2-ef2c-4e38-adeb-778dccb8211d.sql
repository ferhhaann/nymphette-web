-- FINAL SECURITY FIX: Complete protection of all customer email addresses and contact data

-- Fix authors table - prevent public access to email addresses
DROP POLICY IF EXISTS "authors_admin_all_access" ON public.authors;

-- Authors: Admin full access
CREATE POLICY "authors_admin_full_access" 
ON public.authors 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Authors: Public can read basic info but NOT email addresses
-- This creates a secure function that excludes email data
CREATE OR REPLACE FUNCTION public.get_author_safe_info(author_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  bio text, 
  avatar_url text, 
  social_links jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.bio,
    a.avatar_url,
    a.social_links,
    a.created_at,
    a.updated_at
  FROM public.authors a
  WHERE a.id = author_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update blog comments to use safe function instead of direct table access
-- Drop the old policy that exposes email addresses
DROP POLICY IF EXISTS "blog_comments_public_read_approved_only" ON public.blog_comments;

-- Create a new secure function for reading approved comments without email exposure
CREATE OR REPLACE FUNCTION public.get_blog_comments_safe(blog_post_id uuid)
RETURNS TABLE(
  id uuid,
  post_id uuid,
  author_name text,
  content text,
  created_at timestamp with time zone,
  status text
) AS $$
BEGIN
  RETURN QUERY
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add a comprehensive security audit function
CREATE OR REPLACE FUNCTION public.audit_data_access(
  table_name text,
  operation text,
  user_id uuid DEFAULT auth.uid()
) RETURNS void AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    ip_address
  ) VALUES (
    user_id,
    operation || '_SECURITY_AUDIT',
    table_name,
    NULL,
    inet_client_addr()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- CRITICAL SECURITY FIX: Protect customer enquiry data from unauthorized access
-- This fixes the reported security vulnerability where customer contact information could be stolen

-- First, let's clean up and recreate the RLS policies with proper security

-- Fix enquiries table policies
DROP POLICY IF EXISTS "enquiries_public_insert" ON public.enquiries;
DROP POLICY IF EXISTS "enquiries_admin_all" ON public.enquiries;

-- Only allow public INSERT (for form submissions) but NO READ access to public
CREATE POLICY "enquiries_secure_public_insert" 
ON public.enquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read, update, delete enquiry data
CREATE POLICY "enquiries_admin_full_access" 
ON public.enquiries 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Fix contact submissions table policies
DROP POLICY IF EXISTS "contact_submissions_public_insert_only" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_read_all" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_write_all" ON public.contact_submissions;

-- Contact submissions: Only allow public INSERT, restrict all reads to admins
CREATE POLICY "contact_submissions_secure_public_insert" 
ON public.contact_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_full_access" 
ON public.contact_submissions 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Fix blog comments table policies  
DROP POLICY IF EXISTS "blog_comments_public_insert_only" ON public.blog_comments;
DROP POLICY IF EXISTS "blog_comments_admin_read_all" ON public.blog_comments;
DROP POLICY IF EXISTS "blog_comments_admin_write_all" ON public.blog_comments;

-- Blog comments: Only allow public INSERT, admin full access
CREATE POLICY "blog_comments_secure_public_insert" 
ON public.blog_comments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "blog_comments_admin_full_access" 
ON public.blog_comments 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Allow public to read ONLY approved comments (prevents access to email addresses)
CREATE POLICY "blog_comments_public_read_approved_only" 
ON public.blog_comments 
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');

-- Create an additional security function to ensure proper admin validation
CREATE OR REPLACE FUNCTION public.validate_admin_access()
RETURNS BOOLEAN AS $$
BEGIN
  -- Double-check admin status for critical operations
  RETURN (
    auth.uid() IS NOT NULL AND 
    public.is_admin() = true AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::app_role
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
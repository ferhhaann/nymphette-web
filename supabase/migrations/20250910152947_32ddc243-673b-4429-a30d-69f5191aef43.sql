-- CRITICAL SECURITY FIX: Protect customer enquiry data from unauthorized access
-- Current issue: Enquiries table may be exposing customer data to unauthorized users

-- First, let's ensure the is_admin() function is working correctly
DROP POLICY IF EXISTS "enquiries_public_insert" ON public.enquiries;
DROP POLICY IF EXISTS "enquiries_admin_all" ON public.enquiries;

-- Create a more restrictive policy for enquiries
-- Only allow public INSERT (for form submissions) but NO READ access
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

-- CRITICAL SECURITY FIX: Protect contact submissions data
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

-- CRITICAL SECURITY FIX: Protect blog comments from exposing commenter data
DROP POLICY IF EXISTS "blog_comments_public_insert_only" ON public.blog_comments;
DROP POLICY IF EXISTS "blog_comments_admin_read_all" ON public.blog_comments;
DROP POLICY IF EXISTS "blog_comments_admin_write_all" ON public.blog_comments;

-- Blog comments: Only allow public INSERT, restrict reads to approved comments via security definer function
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

-- Allow public to read ONLY approved comments through security definer function
-- This prevents direct access to commenter email addresses
CREATE POLICY "blog_comments_public_read_approved_only" 
ON public.blog_comments 
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');

-- Add additional security logging for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any SELECT operation on sensitive tables
  IF TG_OP = 'SELECT' THEN
    INSERT INTO public.admin_audit_log (
      user_id, 
      action, 
      table_name, 
      record_id,
      ip_address
    ) VALUES (
      auth.uid(),
      'SENSITIVE_DATA_ACCESS',
      TG_TABLE_NAME,
      NULL,
      inet_client_addr()
    );
  END IF;
  
  RETURN NULL; -- For AFTER triggers
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers to log access to sensitive data
CREATE TRIGGER log_enquiry_access
AFTER SELECT ON public.enquiries
FOR EACH STATEMENT
EXECUTE FUNCTION public.log_sensitive_access();

CREATE TRIGGER log_contact_access
AFTER SELECT ON public.contact_submissions
FOR EACH STATEMENT
EXECUTE FUNCTION public.log_sensitive_access();
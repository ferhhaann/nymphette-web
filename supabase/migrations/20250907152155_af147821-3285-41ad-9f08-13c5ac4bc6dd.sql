-- CRITICAL SECURITY FIX: Complete RLS Policy Cleanup and Secure Implementation
-- This migration ensures all sensitive data is properly protected

-- 1. CONTACT SUBMISSIONS - Complete policy reset
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Create final secure policies for contact submissions
CREATE POLICY "contact_submissions_admin_all" ON public.contact_submissions
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "contact_submissions_public_insert" ON public.contact_submissions
FOR INSERT 
WITH CHECK (true);

-- 2. ENQUIRIES - Complete policy reset
DROP POLICY IF EXISTS "Admins can manage all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Only admins can manage enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Only admins can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can create enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;

-- Create final secure policies for enquiries
CREATE POLICY "enquiries_admin_all" ON public.enquiries
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "enquiries_public_insert" ON public.enquiries
FOR INSERT 
WITH CHECK (true);

-- 3. BLOG COMMENTS - Complete policy reset
DROP POLICY IF EXISTS "Admins can manage blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can submit blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Only admins can manage blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Only admins can read blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can read all blog comment data" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can create comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can read blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can create blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can submit blog comments" ON public.blog_comments;

-- Create final secure policies for blog comments
CREATE POLICY "blog_comments_admin_all" ON public.blog_comments
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "blog_comments_public_insert" ON public.blog_comments
FOR INSERT 
WITH CHECK (true);

-- 4. AUTHORS - Complete policy reset
DROP POLICY IF EXISTS "Admins can manage authors" ON public.authors;
DROP POLICY IF EXISTS "Admins can read full author data" ON public.authors;
DROP POLICY IF EXISTS "Public can read authors" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can read authors" ON public.authors;

-- Create final secure policies for authors (only admins can access)
CREATE POLICY "authors_admin_only" ON public.authors
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 5. ADMIN AUDIT LOG - Complete policy reset
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can create audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Public can read audit logs" ON public.admin_audit_log;

-- Create final secure policies for audit logs
CREATE POLICY "audit_log_admin_read" ON public.admin_audit_log
FOR SELECT 
USING (is_admin());

CREATE POLICY "audit_log_system_insert" ON public.admin_audit_log
FOR INSERT 
WITH CHECK (true);

-- Verify RLS is enabled on all tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
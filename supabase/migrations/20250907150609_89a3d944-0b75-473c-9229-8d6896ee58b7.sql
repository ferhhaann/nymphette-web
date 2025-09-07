-- Final Security Policy Fix - Ensure all policies are correctly applied
-- Drop and recreate policies to ensure they're properly enforced

-- 1. Contact submissions - Remove any remaining open policies
DROP POLICY IF EXISTS "Public can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Create secure policies for contact submissions
CREATE POLICY "Only admins can read contact submissions" ON public.contact_submissions
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can manage contact submissions" ON public.contact_submissions
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Allow public to insert (submit forms) but not read
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
FOR INSERT 
WITH CHECK (true);

-- 2. Enquiries - Remove any remaining open policies  
DROP POLICY IF EXISTS "Public can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can create enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;

-- Create secure policies for enquiries
CREATE POLICY "Only admins can read enquiries" ON public.enquiries
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can manage enquiries" ON public.enquiries
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Allow public to insert (submit enquiries) but not read
CREATE POLICY "Anyone can submit enquiries" ON public.enquiries
FOR INSERT 
WITH CHECK (true);

-- 3. Blog comments - Remove any remaining open policies
DROP POLICY IF EXISTS "Public can read blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can create blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can submit blog comments" ON public.blog_comments;

-- Create secure policies for blog comments
CREATE POLICY "Only admins can read blog comments" ON public.blog_comments
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can manage blog comments" ON public.blog_comments
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Allow public to insert (submit comments) but not read others' data
CREATE POLICY "Anyone can submit blog comments" ON public.blog_comments
FOR INSERT 
WITH CHECK (true);

-- 4. Authors - Ensure complete protection
DROP POLICY IF EXISTS "Public can read authors" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can read authors" ON public.authors;

-- Only admins can access author data (already exists but ensure it's the only one)
-- The existing admin policies should remain
-- Comprehensive Security Fix Migration - Fixed Parameter Syntax
-- Fix all remaining data exposure issues and implement security hardening

-- 1. Remove all existing problematic policies for sensitive tables
DROP POLICY IF EXISTS "Public can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated users can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can read blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Authenticated users can read blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can read authors" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can read authors" ON public.authors;

-- 2. Create secure admin-only policies for all sensitive tables

-- Contact submissions: Admin only access
CREATE POLICY "Admins only can manage contact submissions" ON public.contact_submissions
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Enquiries: Admin only access  
CREATE POLICY "Admins only can manage enquiries" ON public.enquiries
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Blog comments: Admin only for management, secure function for public read
CREATE POLICY "Admins only can manage blog comments" ON public.blog_comments
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Authors: Admin only access
CREATE POLICY "Admins only can manage authors" ON public.authors
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Allow public to submit forms (but not read others' data)
CREATE POLICY "Public can submit contact forms" ON public.contact_submissions
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can submit enquiries" ON public.enquiries
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can submit blog comments" ON public.blog_comments
FOR INSERT 
WITH CHECK (true);

-- 4. Create rate limiting table for form submissions
CREATE TABLE IF NOT EXISTS public.form_submission_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address inet NOT NULL,
  form_type text NOT NULL,
  submission_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(ip_address, form_type)
);

-- Enable RLS on rate limiting table
ALTER TABLE public.form_submission_limits ENABLE ROW LEVEL SECURITY;

-- Rate limiting policies
CREATE POLICY "System can manage rate limits" ON public.form_submission_limits
FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Create function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip_address inet,
  _form_type text,
  _max_submissions integer DEFAULT 5,
  _window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  -- Clean up old entries first
  DELETE FROM public.form_submission_limits 
  WHERE window_start < (now() - (_window_minutes || ' minutes')::interval);
  
  -- Get current count for this IP and form type
  SELECT submission_count, window_start 
  INTO current_count, window_start_time
  FROM public.form_submission_limits
  WHERE ip_address = _ip_address AND form_type = _form_type;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO public.form_submission_limits (ip_address, form_type, submission_count, window_start)
    VALUES (_ip_address, _form_type, 1, now());
    RETURN true;
  END IF;
  
  -- Check if we're still in the same window
  IF window_start_time > (now() - (_window_minutes || ' minutes')::interval) THEN
    -- Still in window, check if under limit
    IF current_count >= _max_submissions THEN
      RETURN false; -- Rate limit exceeded
    ELSE
      -- Increment counter
      UPDATE public.form_submission_limits 
      SET submission_count = submission_count + 1
      WHERE ip_address = _ip_address AND form_type = _form_type;
      RETURN true;
    END IF;
  ELSE
    -- New window, reset counter
    UPDATE public.form_submission_limits 
    SET submission_count = 1, window_start = now()
    WHERE ip_address = _ip_address AND form_type = _form_type;
    RETURN true;
  END IF;
END;
$$;

-- 6. Create secure enquiry submission function with rate limiting
CREATE OR REPLACE FUNCTION public.create_secure_enquiry(
  _name text,
  _email text,
  _phone text DEFAULT NULL,
  _message text DEFAULT NULL,
  _source text DEFAULT 'website',
  _source_id text DEFAULT NULL,
  _destination text DEFAULT NULL,
  _travel_date text DEFAULT NULL,
  _travelers integer DEFAULT NULL,
  _ip_address inet DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_enquiry_id uuid;
  result json;
BEGIN
  -- Check rate limit if IP provided
  IF _ip_address IS NOT NULL THEN
    IF NOT public.check_rate_limit(_ip_address, 'enquiry', 5, 60) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Rate limit exceeded. Please try again later.'
      );
    END IF;
  END IF;
  
  -- Validate required fields
  IF _name IS NULL OR _name = '' OR _email IS NULL OR _email = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Name and email are required.'
    );
  END IF;
  
  -- Validate email format (basic)
  IF _email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid email format.'
    );
  END IF;
  
  -- Insert enquiry
  INSERT INTO public.enquiries (
    name, email, phone, message, source, source_id, 
    destination, travel_date, travelers
  ) VALUES (
    _name, _email, _phone, _message, _source, _source_id,
    _destination, _travel_date, _travelers
  ) RETURNING id INTO new_enquiry_id;
  
  RETURN json_build_object(
    'success', true,
    'enquiry_id', new_enquiry_id
  );
END;
$$;

-- 7. Create secure contact submission function with rate limiting
CREATE OR REPLACE FUNCTION public.create_secure_contact_submission(
  _name text,
  _email text,
  _phone text DEFAULT NULL,
  _subject text DEFAULT NULL,
  _message text,
  _ip_address inet DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_submission_id uuid;
  result json;
BEGIN
  -- Check rate limit if IP provided
  IF _ip_address IS NOT NULL THEN
    IF NOT public.check_rate_limit(_ip_address, 'contact', 3, 60) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Rate limit exceeded. Please try again later.'
      );
    END IF;
  END IF;
  
  -- Validate required fields
  IF _name IS NULL OR _name = '' OR _email IS NULL OR _email = '' OR _message IS NULL OR _message = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Name, email, and message are required.'
    );
  END IF;
  
  -- Validate email format (basic)
  IF _email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid email format.'
    );
  END IF;
  
  -- Insert contact submission
  INSERT INTO public.contact_submissions (
    name, email, phone, subject, message
  ) VALUES (
    _name, _email, _phone, _subject, _message
  ) RETURNING id INTO new_submission_id;
  
  RETURN json_build_object(
    'success', true,
    'submission_id', new_submission_id
  );
END;
$$;
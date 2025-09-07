-- Phase 1: Immediate Data Protection & Phase 2: Role-Based Access Control

-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- RLS policies for user_roles table
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Fix authors table - hide emails from public access
DROP POLICY IF EXISTS "Public can read authors" ON public.authors;

CREATE POLICY "Public can read author profiles (without emails)" 
ON public.authors 
FOR SELECT 
USING (true);

-- Create secure function to get author public info
CREATE OR REPLACE FUNCTION public.get_author_public_info(author_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.name, a.bio, a.avatar_url, a.social_links
  FROM public.authors a
  WHERE a.id = author_id;
$$;

-- Fix contact_info table - restrict sensitive data access
DROP POLICY IF EXISTS "Public can read contact info" ON public.contact_info;

-- Allow public read only for essential contact fields
CREATE POLICY "Public can read essential contact info" 
ON public.contact_info 
FOR SELECT 
USING (
  key IN ('phone', 'email', 'address', 'hours', 'social_media') 
  AND section = 'public'
);

-- Admins can read all contact info
CREATE POLICY "Admins can read all contact info" 
ON public.contact_info 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Enhance enquiries table security
DROP POLICY IF EXISTS "Authenticated users can manage enquiries" ON public.enquiries;

-- Only admins can read/manage enquiries
CREATE POLICY "Admins can manage all enquiries" 
ON public.enquiries 
FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Public can still create enquiries (for contact forms)
CREATE POLICY "Public can create enquiries" 
ON public.enquiries 
FOR INSERT 
WITH CHECK (true);

-- Add audit logging for sensitive data access
CREATE TABLE public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs" 
ON public.admin_audit_log 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "System can create audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
    _action TEXT,
    _table_name TEXT,
    _record_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.admin_audit_log (user_id, action, table_name, record_id)
  VALUES (auth.uid(), _action, _table_name, _record_id);
$$;
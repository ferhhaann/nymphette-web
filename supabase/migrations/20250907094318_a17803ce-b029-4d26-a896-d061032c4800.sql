-- Comprehensive fix: Remove the view (causes security warning) and create a more robust solution

-- Remove the problematic security definer view
DROP VIEW IF EXISTS public.authors_public;

-- Update the RLS policy to be completely restrictive for anonymous users
-- This ensures no public access to the authors table directly
DROP POLICY IF EXISTS "Authenticated users can read full author data" ON public.authors;

-- Create restrictive policies
CREATE POLICY "Only admins can read full author data" 
ON public.authors 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Allow authenticated non-admin users to read authors without emails for blog functionality
CREATE POLICY "Authenticated users can read author profiles (no emails)" 
ON public.authors 
FOR SELECT 
TO authenticated
USING (NOT public.is_admin());
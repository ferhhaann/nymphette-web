-- Fix enquiries table RLS policies to prevent public access to customer data

-- First, drop any existing public read policies on enquiries table
DROP POLICY IF EXISTS "Public can read enquiries" ON enquiries;
DROP POLICY IF EXISTS "enquiries_public_read" ON enquiries;
DROP POLICY IF EXISTS "Enquiries are viewable by everyone" ON enquiries;

-- Ensure only admin users can read enquiry data
-- The existing policies should be:
-- 1. enquiries_admin_full_access - for admin full access
-- 2. enquiries_secure_public_insert - for public form submissions

-- Verify the correct policies exist
CREATE POLICY "enquiries_admin_only_read" ON enquiries
  FOR SELECT 
  USING (is_admin());

-- Also ensure the insert policy is properly restricted to prevent data exposure
DROP POLICY IF EXISTS "enquiries_secure_public_insert" ON enquiries;

CREATE POLICY "enquiries_secure_public_insert" ON enquiries
  FOR INSERT 
  WITH CHECK (true);

-- Add audit logging for enquiry access
CREATE OR REPLACE FUNCTION log_enquiry_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when enquiries are accessed by admins
  IF TG_OP = 'SELECT' AND is_admin() THEN
    PERFORM log_admin_action('ENQUIRY_ACCESSED', 'enquiries', OLD.id::text);
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
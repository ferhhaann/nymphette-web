-- Fix the search path issue in the log_enquiry_access function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- Fix security linter issues by setting search_path on functions
CREATE OR REPLACE FUNCTION public.log_enquiry_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.enquiry_logs (enquiry_id, action, new_values, notes)
    VALUES (NEW.id, 'created', row_to_json(NEW), 'Enquiry created');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.enquiry_logs (enquiry_id, action, old_values, new_values, notes)
    VALUES (NEW.id, 'updated', row_to_json(OLD), row_to_json(NEW), 'Enquiry updated');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.enquiry_logs (enquiry_id, action, old_values, notes)
    VALUES (OLD.id, 'deleted', row_to_json(OLD), 'Enquiry deleted');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
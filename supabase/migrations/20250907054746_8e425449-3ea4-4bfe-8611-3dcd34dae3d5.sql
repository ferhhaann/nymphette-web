-- Create enquiries table to store all customer booking requests
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT NOT NULL, -- 'package', 'group_tour', 'contact', 'general'
  source_id TEXT, -- package id, tour id, etc.
  destination TEXT,
  travel_date TEXT,
  travelers INTEGER,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'contacted', 'closed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to TEXT,
  notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT false,
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit logs table for tracking all enquiry operations (cannot be deleted)
CREATE TABLE public.enquiry_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed', 'assigned', 'whatsapp_sent'
  old_values JSONB,
  new_values JSONB,
  performed_by TEXT, -- admin user identifier
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_logs ENABLE ROW LEVEL SECURITY;

-- Enquiries policies
CREATE POLICY "Public can create enquiries" 
ON public.enquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage enquiries" 
ON public.enquiries 
FOR ALL
USING (auth.role() = 'authenticated');

-- Enquiry logs policies (read-only for admins, insert-only for system)
CREATE POLICY "Authenticated users can read enquiry logs" 
ON public.enquiry_logs 
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "System can create enquiry logs" 
ON public.enquiry_logs 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_enquiries_source ON public.enquiries(source);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);
CREATE INDEX idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX idx_enquiry_logs_enquiry_id ON public.enquiry_logs(enquiry_id);
CREATE INDEX idx_enquiry_logs_action ON public.enquiry_logs(action);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically log enquiry changes
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically log all enquiry operations
CREATE TRIGGER enquiry_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.log_enquiry_changes();
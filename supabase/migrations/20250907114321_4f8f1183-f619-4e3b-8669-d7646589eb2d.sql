-- Create a table to store CORS configuration settings for documentation
-- Note: This does NOT actually configure CORS - that must be done in Supabase Dashboard
CREATE TABLE IF NOT EXISTS public.cors_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text NOT NULL,
  setting_value text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cors_configuration ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage CORS configuration" 
ON public.cors_configuration 
FOR ALL 
USING (is_admin());

CREATE POLICY "Public can read CORS configuration" 
ON public.cors_configuration 
FOR SELECT 
USING (is_active = true);

-- Insert your production domain configuration for reference
INSERT INTO public.cors_configuration (setting_name, setting_value, description) VALUES
('site_url', 'https://nymphette.asmanzillounge.com', 'Main production site URL'),
('allowed_origin_1', 'https://nymphette.asmanzillounge.com', 'Production domain'),
('allowed_origin_2', 'https://*.asmanzillounge.com', 'Subdomain wildcard'),
('redirect_url_1', 'https://nymphette.asmanzillounge.com/**', 'Production redirect pattern'),
('redirect_url_2', 'https://9c7a2632-5907-434d-a7c0-2b2af4cf8296.sandbox.lovable.dev/**', 'Development redirect pattern');

-- Create trigger for updated_at
CREATE TRIGGER update_cors_configuration_updated_at
BEFORE UPDATE ON public.cors_configuration
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Update CORS configuration for new domain
-- Run this in your Supabase SQL editor

-- Update existing site_url
UPDATE public.cors_configuration 
SET setting_value = 'https://nymphetteinternationaltours.com'
WHERE setting_name = 'site_url';

-- Update allowed origins
UPDATE public.cors_configuration 
SET setting_value = 'https://nymphetteinternationaltours.com'
WHERE setting_name = 'allowed_origin_1';

UPDATE public.cors_configuration 
SET setting_value = 'https://*.nymphetteinternationaltours.com'
WHERE setting_name = 'allowed_origin_2';

-- Update redirect URLs
UPDATE public.cors_configuration 
SET setting_value = 'https://nymphetteinternationaltours.com/**'
WHERE setting_name = 'redirect_url_1';

-- Add the temporary Hostinger domain as an allowed origin (optional, for transition period)
INSERT INTO public.cors_configuration (setting_name, setting_value, description) VALUES
('allowed_origin_temp', 'https://dimgrey-wolf-289836.hostingersite.com', 'Temporary Hostinger domain during transition')
ON CONFLICT (setting_name) DO UPDATE SET 
setting_value = EXCLUDED.setting_value,
description = EXCLUDED.description;

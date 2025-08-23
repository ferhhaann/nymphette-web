-- Add missing columns to countries table for comprehensive country details
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS culture text,
ADD COLUMN IF NOT EXISTS hero_image_url text,
ADD COLUMN IF NOT EXISTS map_outline_url text,
ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '+1 (555) 123-4567',
ADD COLUMN IF NOT EXISTS contact_email text DEFAULT 'hello@nymphettetours.com';

-- Add visitor statistics columns to countries table
ALTER TABLE public.countries
ADD COLUMN IF NOT EXISTS visitor_statistics jsonb DEFAULT '{
  "annual": null,
  "gender": {"male": null, "female": null},
  "purposes": [],
  "topOrigins": []
}'::jsonb;

-- Create table for country essential tips with more detailed structure
CREATE TABLE IF NOT EXISTS public.country_essential_tips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id uuid NOT NULL,
  title text NOT NULL,
  note text NOT NULL,
  icon text NOT NULL DEFAULT 'Info',
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on country_essential_tips
ALTER TABLE public.country_essential_tips ENABLE ROW LEVEL SECURITY;

-- Create policies for country_essential_tips
CREATE POLICY "Country essential tips are viewable by everyone" 
ON public.country_essential_tips 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage country essential tips" 
ON public.country_essential_tips 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_country_essential_tips_updated_at
BEFORE UPDATE ON public.country_essential_tips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for country must-visit places
CREATE TABLE IF NOT EXISTS public.country_must_visit (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  type text DEFAULT 'attraction',
  highlights text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on country_must_visit
ALTER TABLE public.country_must_visit ENABLE ROW LEVEL SECURITY;

-- Create policies for country_must_visit
CREATE POLICY "Country must visit places are viewable by everyone" 
ON public.country_must_visit 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage country must visit places" 
ON public.country_must_visit 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_country_must_visit_updated_at
BEFORE UPDATE ON public.country_must_visit
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing travel_purposes to include better structure
ALTER TABLE public.travel_purposes 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS color text DEFAULT '#8B5CF6';

-- Add foreign key constraints for data integrity
ALTER TABLE public.country_essential_tips
ADD CONSTRAINT fk_country_essential_tips_country 
FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;

ALTER TABLE public.country_must_visit
ADD CONSTRAINT fk_country_must_visit_country 
FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_country_essential_tips_country_id ON public.country_essential_tips(country_id);
CREATE INDEX IF NOT EXISTS idx_country_essential_tips_order ON public.country_essential_tips(country_id, order_index);
CREATE INDEX IF NOT EXISTS idx_country_must_visit_country_id ON public.country_must_visit(country_id);
CREATE INDEX IF NOT EXISTS idx_country_must_visit_order ON public.country_must_visit(country_id, order_index);
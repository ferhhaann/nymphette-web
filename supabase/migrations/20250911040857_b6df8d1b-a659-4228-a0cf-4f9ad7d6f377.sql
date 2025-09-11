-- Add is_popular field to countries table
ALTER TABLE public.countries 
ADD COLUMN is_popular BOOLEAN DEFAULT false;

-- Add index for better performance when filtering popular countries
CREATE INDEX idx_countries_popular ON public.countries(is_popular) WHERE is_popular = true;
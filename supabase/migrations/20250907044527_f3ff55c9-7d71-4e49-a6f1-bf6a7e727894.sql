-- Add slug column to packages table
ALTER TABLE public.packages 
ADD COLUMN slug TEXT;

-- Generate slugs for existing packages based on title
UPDATE public.packages 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '&', 'and'), ',', '')) 
WHERE slug IS NULL;

-- Make slug NOT NULL and add unique constraint
ALTER TABLE public.packages 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.packages 
ADD CONSTRAINT packages_slug_unique UNIQUE (slug);

-- Create index for better performance
CREATE INDEX idx_packages_slug ON public.packages(slug);
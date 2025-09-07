-- Add slug column to packages table
ALTER TABLE public.packages 
ADD COLUMN slug TEXT;

-- Generate unique slugs for existing packages based on title and id
UPDATE public.packages 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(COALESCE(title, 'package'), ' ', '-'), '&', 'and'), ',', '')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE slug IS NULL;

-- Make slug NOT NULL
ALTER TABLE public.packages 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.packages 
ADD CONSTRAINT packages_slug_unique UNIQUE (slug);

-- Create index for better performance
CREATE INDEX idx_packages_slug ON public.packages(slug);
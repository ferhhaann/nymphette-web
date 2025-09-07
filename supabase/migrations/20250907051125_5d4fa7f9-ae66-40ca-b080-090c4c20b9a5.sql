-- Add slug column to packages table
ALTER TABLE public.packages ADD COLUMN slug TEXT;

-- Generate unique slugs from titles
UPDATE public.packages 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTR(id::text, 1, 8);

-- Make slug required and unique
ALTER TABLE public.packages ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.packages ADD CONSTRAINT packages_slug_unique UNIQUE (slug);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
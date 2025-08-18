-- Add featured column to packages table
ALTER TABLE public.packages ADD COLUMN featured BOOLEAN DEFAULT false;

-- Create index for featured packages for better performance
CREATE INDEX idx_packages_featured ON public.packages(featured) WHERE featured = true;

-- Remove country details from content table if they exist
DELETE FROM public.content WHERE section = 'countryDetails';

-- Update any existing packages to have some as featured (optional - you can set these manually later)
UPDATE public.packages SET featured = true WHERE id IN (
    SELECT id FROM public.packages 
    WHERE rating >= 4.8 
    ORDER BY rating DESC, reviews DESC 
    LIMIT 3
);
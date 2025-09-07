-- Remove the security definer view and use existing secure functions instead
DROP VIEW IF EXISTS public.authors_public;

-- The existing secure functions get_authors_public() and get_author_public_info() 
-- are already available and should be used by application code instead of direct table access
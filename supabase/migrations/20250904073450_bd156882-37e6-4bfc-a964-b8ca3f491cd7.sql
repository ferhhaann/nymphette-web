-- Remove content that should be hardcoded (keep only contact and about sections)
DELETE FROM public.content 
WHERE section NOT IN ('contact', 'about');
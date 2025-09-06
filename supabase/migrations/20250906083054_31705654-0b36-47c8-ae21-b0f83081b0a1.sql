-- Fix storage bucket policies for group-tour-images to allow public uploads
-- Create policy to allow public uploads without authentication

CREATE POLICY "Allow public uploads to group-tour-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'group-tour-images');

CREATE POLICY "Allow public access to group-tour-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'group-tour-images');

CREATE POLICY "Allow public updates to group-tour-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'group-tour-images');

CREATE POLICY "Allow public deletes from group-tour-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'group-tour-images');
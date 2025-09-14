-- Enable real-time for content table
ALTER TABLE public.content REPLICA IDENTITY FULL;

-- Add the content table to the realtime publication
-- This will enable real-time updates for the content table
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.content;
-- Enable real-time for all admin tables
ALTER TABLE public.packages REPLICA IDENTITY FULL;
ALTER TABLE public.group_tours REPLICA IDENTITY FULL;
ALTER TABLE public.countries REPLICA IDENTITY FULL;
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;
ALTER TABLE public.blog_categories REPLICA IDENTITY FULL;
ALTER TABLE public.authors REPLICA IDENTITY FULL;
ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.enquiries REPLICA IDENTITY FULL;
ALTER TABLE public.seo_settings REPLICA IDENTITY FULL;
ALTER TABLE public.country_sections REPLICA IDENTITY FULL;
ALTER TABLE public.country_attractions REPLICA IDENTITY FULL;
ALTER TABLE public.country_essential_tips REPLICA IDENTITY FULL;
ALTER TABLE public.famous_places REPLICA IDENTITY FULL;

-- Update the realtime publication to include all admin tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  public.content,
  public.packages,
  public.group_tours,
  public.countries,
  public.blog_posts,
  public.blog_categories,
  public.authors,
  public.contact_submissions,
  public.enquiries,
  public.seo_settings,
  public.country_sections,
  public.country_attractions,
  public.country_essential_tips,
  public.famous_places;
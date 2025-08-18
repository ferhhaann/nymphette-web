-- Create countries table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  capital TEXT,
  currency TEXT,
  climate TEXT,
  best_season TEXT,
  languages TEXT[],
  speciality TEXT,
  culture TEXT,
  annual_visitors INTEGER,
  gender_male_percentage INTEGER,
  gender_female_percentage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create famous places table
CREATE TABLE public.famous_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  type TEXT DEFAULT 'famous', -- 'famous' or 'must_visit'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essential tips table
CREATE TABLE public.essential_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create travel purposes table
CREATE TABLE public.travel_purposes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQs table
CREATE TABLE public.country_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.famous_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essential_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Countries are viewable by everyone" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Famous places are viewable by everyone" ON public.famous_places FOR SELECT USING (true);
CREATE POLICY "Essential tips are viewable by everyone" ON public.essential_tips FOR SELECT USING (true);
CREATE POLICY "Travel purposes are viewable by everyone" ON public.travel_purposes FOR SELECT USING (true);
CREATE POLICY "FAQs are viewable by everyone" ON public.country_faqs FOR SELECT USING (true);

-- Create policies for authenticated users to manage
CREATE POLICY "Authenticated users can manage countries" ON public.countries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage famous places" ON public.famous_places FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage essential tips" ON public.essential_tips FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage travel purposes" ON public.travel_purposes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage FAQs" ON public.country_faqs FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for images
CREATE POLICY "Images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export async function getStaticProps(path: string) {
  // Default data structure
  const defaultData = {
    seo: {},
    pageData: null
  };

  try {
    // Get SEO data
    const { data: seoData } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_url', path)
      .eq('is_active', true)
      .single();

    // Get page-specific data based on the route
    let pageData = null;

    if (path.startsWith('/packages/')) {
      const slug = path.split('/packages/')[1];
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('slug', slug)
        .single();
      pageData = data;
    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1];
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      pageData = data;
    }

    return {
      seo: seoData || defaultData.seo,
      pageData: pageData || defaultData.pageData
    };
  } catch (error) {
    console.error('Error fetching static props:', error);
    return defaultData;
  }
}

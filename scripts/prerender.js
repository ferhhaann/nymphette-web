import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function getStaticPaths() {
  try {
    // Get dynamic routes from Supabase
    const [packages, posts] = await Promise.all([
      supabase.from('packages').select('slug'),
      supabase.from('blog_posts').select('slug')
    ]);

    // Define static routes
    const staticRoutes = ['/', '/packages', '/group-tours', '/about', '/contact', '/blog'];
    
    // Add dynamic routes
    const dynamicRoutes = [
      ...(packages.data?.map(pkg => `/packages/${pkg.slug}`) || []),
      ...(posts.data?.map(post => `/blog/${post.slug}`) || [])
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error fetching routes:', error);
    return ['/']; // Return at least the home page
  }
}

async function getPageData(route) {
  try {
    // Get SEO data for the route
    const { data: seo } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_url', route)
      .eq('is_active', true)
      .single();

    // Get page-specific data
    let pageData = null;
    if (route.startsWith('/packages/')) {
      const slug = route.split('/packages/')[1];
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('slug', slug)
        .single();
      pageData = data;
    } else if (route.startsWith('/blog/')) {
      const slug = route.split('/blog/')[1];
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      pageData = data;
    }

    return { seo, pageData };
  } catch (error) {
    console.error(`Error fetching data for ${route}:`, error);
    return { seo: null, pageData: null };
  }
}

async function prerender() {
  const vite = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '..'),
    logLevel: 'info',
    server: {
      middlewareMode: true,
    },
  });

  try {
    // Get all routes to pre-render
    const routes = await getStaticPaths();
    console.log('Routes to pre-render:', routes);

    // Create dist directory
    const distDir = path.resolve(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }

    // Process each route
    for (const route of routes) {
      console.log(`Pre-rendering ${route}...`);

      // Get page data
      const { seo, pageData } = await getPageData(route);

      // Create the output directory for this route
      const routeDir = path.join(distDir, route === '/' ? '' : route);
      fs.mkdirSync(routeDir, { recursive: true });

      // Get the template
      let template = fs.readFileSync(
        path.resolve(__dirname, '../index.html'),
        'utf-8'
      );

      // Inject the static props
      const staticProps = {
        seo,
        pageData,
        route
      };

      // Transform the template
      template = await vite.transformIndexHtml(route, template);

      // Inject the static props into the HTML
      template = template.replace(
        '</head>',
        `<script>window.__STATIC_PROPS__ = ${JSON.stringify(staticProps)};</script></head>`
      );

      // Write the pre-rendered HTML
      fs.writeFileSync(path.join(routeDir, 'index.html'), template);
      console.log(`✓ Pre-rendered ${route}`);
    }
  } catch (e) {
    console.error('Pre-render error:', e);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

prerender().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

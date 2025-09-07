import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get base URL from environment or default to relative paths
const baseUrl = process.env.VITE_SITE_URL ? process.env.VITE_SITE_URL.replace(/\/$/, '') : '';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function generateSEO() {
  try {
    // Fetch all active SEO settings
    const { data: seoSettings, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    // Create a map of URL paths to SEO settings
    const seoMap = seoSettings.reduce((acc, setting) => {
      acc[setting.page_url] = setting;
      return acc;
    }, {});

    // Read the index.html template
    const indexPath = path.join(process.cwd(), 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // Create meta tag injection points
    const metaInjectionPoint = '<meta name="viewport"';
    const headEndPoint = '</head>';

    // Remove any existing meta tags to prevent duplication
    indexContent = indexContent.replace(/<meta\s+property="og:.*?".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="twitter:.*?".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="description".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="keywords".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="robots".*?>/g, '');
    indexContent = indexContent.replace(/<link\s+rel="canonical".*?>/g, '');
    indexContent = indexContent.replace(/<script\s+type="application\/ld\+json".*?<\/script>/gs, '');

    // Generate meta tags for each page
    for (const [pagePath, seo] of Object.entries(seoMap)) {
      // Skip if it's not the homepage (we'll handle other pages differently)
      if (pagePath !== '/') continue;

      const canonicalUrl = pagePath === '/' ? baseUrl : `${baseUrl}${pagePath}`;

      // Add canonical and social URLs
      indexContent = indexContent.replace(
        /<title>.*?<\/title>/,
        `<title>${seo.meta_title}</title>`
      );

      // Create meta tags string
      const metaTags = `
    <meta name="description" content="${seo.meta_description}" />
    <meta name="keywords" content="${seo.meta_keywords}" />
    <meta name="robots" content="${seo.robots_meta || 'index,follow'}" />
    <link rel="canonical" href="${seo.canonical_url || canonicalUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seo.canonical_url || canonicalUrl}" />
    <meta property="og:title" content="${seo.og_title || seo.meta_title}" />
    <meta property="og:description" content="${seo.og_description || seo.meta_description}" />
    <meta property="og:image" content="${seo.og_image}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${seo.canonical_url || canonicalUrl}" />
    <meta name="twitter:title" content="${seo.og_title || seo.meta_title}" />
    <meta name="twitter:description" content="${seo.og_description || seo.meta_description}" />
    <meta name="twitter:image" content="${seo.og_image}" />

    <!-- Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(seo.structured_data, null, 2)}
    </script>`;

      // Insert meta tags after viewport meta tag
      indexContent = indexContent.replace(
        metaInjectionPoint,
        `${metaTags}\n    ${metaInjectionPoint}`
      );
    }

    // Write the updated content back to index.html
    fs.writeFileSync(indexPath, indexContent);

    // Generate static HTML files for other pages
    for (const [pagePath, seo] of Object.entries(seoMap)) {
      if (pagePath === '/') continue;

      const pageDir = path.join(process.cwd(), 'dist', pagePath.slice(1));
      const pageIndexPath = path.join(pageDir, 'index.html');

      // Create directory if it doesn't exist
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }

      // Copy and modify index.html for this page
      let pageContent = indexContent;

      const pageCanonicalUrl = baseUrl ? `${baseUrl}${pagePath}` : pagePath;

      // Update meta tags for this page
      pageContent = pageContent.replace(
        /<title>.*?<\/title>/,
        `<title>${seo.meta_title}</title>`
      ).replace(
        /<meta name="description".*?>/,
        `<meta name="description" content="${seo.meta_description}" />`
      ).replace(
        /<meta name="keywords".*?>/,
        `<meta name="keywords" content="${seo.meta_keywords}" />`
      ).replace(
        /<link rel="canonical".*?>/,
        `<link rel="canonical" href="${seo.canonical_url || pageCanonicalUrl}" />`
      ).replace(
        /<meta property="og:url".*?>/,
        `<meta property="og:url" content="${seo.canonical_url || pageCanonicalUrl}" />`
      ).replace(
        /<meta name="twitter:url".*?>/,
        `<meta name="twitter:url" content="${seo.canonical_url || pageCanonicalUrl}" />`
      );

      // Update OG tags
      pageContent = pageContent.replace(
        /<meta property="og:title".*?>/,
        `<meta property="og:title" content="${seo.og_title || seo.meta_title}" />`
      ).replace(
        /<meta property="og:description".*?>/,
        `<meta property="og:description" content="${seo.og_description || seo.meta_description}" />`
      );

      // Write the page-specific file
      fs.writeFileSync(pageIndexPath, pageContent);
    }

    console.log('✅ SEO meta tags generated successfully');
  } catch (error) {
    console.error('Error generating SEO:', error);
    process.exit(1);
  }
}

generateSEO();

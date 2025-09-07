import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://duouhbzwivonyssvtiqo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3VoYnp3aXZvbnlzc3Z0aXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjkzNjIsImV4cCI6MjA3MTEwNTM2Mn0.PjAbI-RLQpL8_hFr29bWdkrIUAPcPWTHgqJGV9CYyQ0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateSEOTags() {
  try {
    // Fetch SEO settings for homepage
    const { data: seoSettings } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_url', '/')
      .eq('is_active', true)
      .single();

    if (!seoSettings) {
      console.log('No SEO settings found for homepage');
      return;
    }

    // Read the current index.html
    const indexPath = path.join(process.cwd(), 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // Remove existing meta tags to prevent duplicates
    indexContent = indexContent.replace(/<meta\s+property="og:.*?".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="twitter:.*?".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="description".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="keywords".*?>/g, '');
    indexContent = indexContent.replace(/<meta\s+name="robots".*?>/g, '');
    indexContent = indexContent.replace(/<link\s+rel="canonical".*?>/g, '');

    // Create meta tags block
    const metaTagsBlock = `
    <title>${seoSettings.meta_title}</title>
    <meta name="description" content="${seoSettings.meta_description}" />
    <meta name="keywords" content="${seoSettings.meta_keywords}" />
    ${seoSettings.robots_meta ? `<meta name="robots" content="${seoSettings.robots_meta}" />` : ''}
    <link rel="canonical" href="${seoSettings.canonical_url || window.location.origin}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seoSettings.og_title || seoSettings.meta_title}" />
    <meta property="og:description" content="${seoSettings.og_description || seoSettings.meta_description}" />
    <meta property="og:url" content="${seoSettings.canonical_url || window.location.origin}" />
    ${seoSettings.og_image ? `<meta property="og:image" content="${seoSettings.og_image}" />` : ''}
    <meta property="og:site_name" content="Nymphette Tours" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoSettings.og_title || seoSettings.meta_title}" />
    <meta name="twitter:description" content="${seoSettings.og_description || seoSettings.meta_description}" />
    ${seoSettings.og_image ? `<meta name="twitter:image" content="${seoSettings.og_image}" />` : ''}`;

    // Replace the title and add meta tags after it
    indexContent = indexContent.replace(
      /<title>.*?<\/title>/,
      metaTagsBlock
    );

    // Update Open Graph title
    indexContent = indexContent.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${seoSettings.og_title || seoSettings.meta_title}" />`
    );

    // Update Open Graph description
    indexContent = indexContent.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${seoSettings.og_description || seoSettings.meta_description}" />`
    );

    // Update Open Graph image if provided
    if (seoSettings.og_image) {
      indexContent = indexContent.replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${seoSettings.og_image}" />`
      );
    }

    // Update canonical URL if provided
    if (seoSettings.canonical_url) {
      indexContent = indexContent.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${seoSettings.canonical_url}" />`
      );
    }

    // Update robots meta if provided
    if (seoSettings.robots_meta) {
      indexContent = indexContent.replace(
        /<meta name="robots" content=".*?" \/>/,
        `<meta name="robots" content="${seoSettings.robots_meta}" />`
      );
    }

    // Update structured data if provided
    if (seoSettings.structured_data) {
      const structuredDataScript = `<script type="application/ld+json">\n      ${JSON.stringify(seoSettings.structured_data, null, 2)}\n    </script>`;
      
      // Replace the existing TravelAgency structured data
      indexContent = indexContent.replace(
        /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"TravelAgency"[\s\S]*?\}\s*<\/script>/,
        structuredDataScript
      );
    }

    // Write the updated content back to index.html
    fs.writeFileSync(indexPath, indexContent);

    console.log('✅ SEO tags updated successfully in index.html');
    console.log(`Title: ${seoSettings.meta_title}`);
    console.log(`Description: ${seoSettings.meta_description}`);
    
  } catch (error) {
    console.error('❌ Error generating SEO tags:', error);
  }
}

// Run the function
generateSEOTags();
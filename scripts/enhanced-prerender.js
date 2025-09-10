import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced prerendering for SSR-like behavior
const routes = [
  '/',
  '/packages',
  '/group-tours',
  '/about',
  '/blog',
  '/contact',
  '/regions/asia',
  '/regions/europe',
  '/regions/africa',
  '/regions/americas',
  '/regions/pacific-islands',
  '/regions/middle-east',
];

// Common countries to prerender
const countries = [
  'japan', 'thailand', 'china', 'indonesia', 'singapore',
  'france', 'italy', 'spain', 'germany', 'united-kingdom',
  'kenya', 'egypt', 'morocco', 'south-africa',
  'usa', 'canada', 'brazil', 'mexico',
  'australia', 'new-zealand', 'fiji',
  'uae', 'qatar', 'saudi-arabia'
];

// Add country routes
const regions = ['asia', 'europe', 'africa', 'americas', 'pacific-islands', 'middle-east'];
regions.forEach(region => {
  countries.forEach(country => {
    routes.push(`/regions/${region}/country/${country}`);
  });
});

const generatePrerenderedHTML = (route, title, description, ogImage) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Prerendered SEO Tags -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://your-domain.com${route}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="https://your-domain.com${route}" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/src/index.css" as="style" />
  <link rel="preconnect" href="https://duouhbzwivonyssvtiqo.supabase.co" />
  
  <!-- Critical CSS inline for faster rendering -->
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .loading-screen { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)));
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 9999;
      color: white;
    }
  </style>
</head>
<body>
  <div id="root">
    <!-- Prerendered loading state -->
    <div class="loading-screen">
      <div style="text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; margin-bottom: 1rem;">${title}</h1>
        <p style="margin: 0; opacity: 0.8;">${description}</p>
        <div style="margin-top: 2rem; width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 2rem auto;"></div>
      </div>
    </div>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
};

const getRouteMetadata = (route) => {
  const metadata = {
    '/': {
      title: 'Premium Travel Packages | Explore Asia, Europe & Beyond',
      description: 'Discover amazing travel destinations with our curated packages. From Asia to Europe, Africa to Americas - your perfect journey awaits.',
      ogImage: '/src/assets/hero-travel.jpg'
    },
    '/packages': {
      title: 'Travel Packages by Region | Custom Tours Worldwide',
      description: 'Browse our comprehensive collection of travel packages organized by region. Find your perfect destination and create unforgettable memories.',
      ogImage: '/src/assets/packages-hero-bg.jpg'
    },
    '/group-tours': {
      title: 'Join Group Tours | Small Group Travel Adventures',
      description: 'Join like-minded travelers on our small group tours. Experience destinations with expert guides and make new friends.',
      ogImage: '/src/assets/hero-travel.jpg'
    },
    '/about': {
      title: 'About Us | Your Trusted Travel Partner',
      description: 'Learn about our mission to create exceptional travel experiences. Discover why thousands choose us for their adventures.',
      ogImage: '/src/assets/team-photo.jpg'
    },
    '/blog': {
      title: 'Travel Blog | Tips, Guides & Inspiration',
      description: 'Get travel tips, destination guides, and inspiration for your next adventure. Expert advice from seasoned travelers.',
      ogImage: '/src/assets/hero-travel.jpg'
    },
    '/contact': {
      title: 'Contact Us | Plan Your Perfect Trip',
      description: 'Get in touch to start planning your dream vacation. Our travel experts are here to help create your perfect itinerary.',
      ogImage: '/src/assets/hero-travel.jpg'
    }
  };

  // Region-specific metadata
  if (route.includes('/regions/')) {
    const region = route.split('/')[2];
    const regionNames = {
      'asia': 'Asia',
      'europe': 'Europe', 
      'africa': 'Africa',
      'americas': 'Americas',
      'pacific-islands': 'Pacific Islands',
      'middle-east': 'Middle East'
    };
    
    return {
      title: `${regionNames[region]} Travel Packages | Explore ${regionNames[region]}`,
      description: `Discover the best of ${regionNames[region]} with our curated travel packages. Authentic experiences and unforgettable memories await.`,
      ogImage: `/src/assets/regions/${region}-destinations.jpg`
    };
  }

  return metadata[route] || {
    title: 'Travel Adventures | Premium Tour Packages',
    description: 'Discover amazing destinations with our premium travel packages. Your adventure starts here.',
    ogImage: '/src/assets/hero-travel.jpg'
  };
};

// Generate prerendered HTML files
console.log('🚀 Starting enhanced prerendering for SSR-like behavior...');

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

routes.forEach(route => {
  const metadata = getRouteMetadata(route);
  const html = generatePrerenderedHTML(route, metadata.title, metadata.description, metadata.ogImage);
  
  const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
  const fullPath = path.join(distDir, routePath);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, html);
  console.log(`✅ Prerendered: ${route}`);
});

// Generate sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>https://your-domain.com${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);

console.log(`✅ Enhanced prerendering completed! Generated ${routes.length} routes with SSR-like optimization.`);
console.log('✅ Generated sitemap.xml and robots.txt');
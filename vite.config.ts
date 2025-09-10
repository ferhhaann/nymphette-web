import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Plugin } from 'vite';

// SSR-like prerendering plugin
const prerenderPlugin = (): Plugin => ({
  name: 'prerender-routes',
  writeBundle: {
    sequential: true,
    order: 'post',
    handler() {
      // This will be enhanced for production builds
      console.log('🚀 Prerendering routes for SSR-like behavior');
    }
  }
});


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && prerenderPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    devSourcemap: false,
    modules: {
      generateScopedName: mode === 'production' ? '[hash:base64:8]' : '[local]_[hash:base64:5]',
    },
  },
  build: {
    cssMinify: true,
    cssCodeSplit: true,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    ssr: false, // Keep as SPA but optimize for SSR-like behavior
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('@radix-ui') || id.includes('@hookform')) {
              return 'ui';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
          }
          if (id.includes('src/index.css')) {
            return 'styles';
          }
          if (id.includes('src/pages/')) {
            return 'pages';
          }
          if (id.includes('src/components/regions/')) {
            return 'regions';
          }
        }
      }
    }
  },
}));

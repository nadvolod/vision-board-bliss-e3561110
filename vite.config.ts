import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'routing': ['react-router-dom'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'date': ['date-fns'],
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      },
    },
    // Target modern browsers for smaller bundle
    target: 'es2020',
  },
  // Enable gzip compression equivalent
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
}));

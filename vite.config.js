import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'offline.html'],
      manifest: {
        name: 'Home Workout Pro',
        short_name: 'WorkoutPro',
        description: 'Mô phỏng tập luyện',
        theme_color: '#10b981',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-fonts',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sanity-cdn',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (/[\\\\/]node_modules[\\\\/]react[\\\\/]/.test(id)) return 'react-core';
          if (/[\\\\/]node_modules[\\\\/]react-dom[\\\\/]/.test(id)) return 'react-core';
          if (/[\\\\/]node_modules[\\\\/]scheduler[\\\\/]/.test(id)) return 'react-core';

          if (/[\\\\/]node_modules[\\\\/]react-router/.test(id)) return 'router';
          if (/[\\\\/]node_modules[\\\\/]zustand[\\\\/]/.test(id)) return 'zustand';
          if (/[\\\\/]node_modules[\\\\/]use-sync-external-store[\\\\/]/.test(id)) return 'zustand';

          if (/[\\\\/]node_modules[\\\\/]lucide-react[\\\\/]/.test(id)) return 'lucide';

          if (/[\\\\/]node_modules[\\\\/]@sanity[\\\\/]/.test(id)) return 'sanity';

          return 'vendor';
        },
      },
    },
    cssCodeSplit: true,
    minify: 'oxc',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'lucide-react',
      '@sanity/client',
    ],
  },
})
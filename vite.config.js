import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
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
        scope: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // ⭐ CRITICAL: Sanity API queries — cache để offline vẫn có data
          {
            urlPattern: /^https:\/\/[^/]+\.api\.sanity\.io\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sanity-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sanity-cdn',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-thumbs',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
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
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/]react[\\/]/.test(id)) return 'react-core';
          if (/[\\/]node_modules[\\/]react-dom[\\/]/.test(id)) return 'react-core';
          if (/[\\/]node_modules[\\/]scheduler[\\/]/.test(id)) return 'react-core';
          if (/[\\/]node_modules[\\/]react-router/.test(id)) return 'router';
          if (/[\\/]node_modules[\\/]zustand[\\/]/.test(id)) return 'zustand';
          if (/[\\/]node_modules[\\/]use-sync-external-store[\\/]/.test(id)) return 'zustand';
          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return 'lucide';
          if (/[\\/]node_modules[\\/]@sanity[\\/]/.test(id)) return 'sanity';
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
    include: ['react', 'react-dom', 'zustand', 'lucide-react', '@sanity/client'],
  },
})
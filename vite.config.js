import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
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
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('zustand')) return 'zustand';
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('@sanity') || id.includes('next-sanity')) return 'sanity';
            return 'vendor';
          }
        },
      },
    },
    cssCodeSplit: true,
    minify: 'oxc',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'zustand', 'lucide-react',
      '@sanity/client', 'next-sanity'
    ],
  },
})
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Client cho React App (Read-only, Public)
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD, // Dùng CDN cho production
  perspective: 'published',
})

// Client cho Scripts/Studio (Write access - cần Token)
export const sanityWriteClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Chỉ có ở server/script
  perspective: 'published',
})

// Image URL Builder
const builder = createImageUrlBuilder({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
})

export const urlFor = (source: any) => builder.image(source)

// Helper: Lấy URL ảnh với các tùy chọn mặc định
export function getImageUrl(source: any, options: { width?: number; height?: number; format?: 'webp' | 'avif' | 'auto'; quality?: number } = {}) {
  if (!source?.asset?._ref) return null
  return builder
    .image(source)
    .width(options.width || 800)
    .auto('format')
    .format(options.format || 'webp')
    .quality(options.quality || 80)
    .url()
}
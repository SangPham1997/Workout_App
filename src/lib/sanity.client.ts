// src/lib/sanity.client.ts
import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID. Kiểm tra file .env ở gốc dự án.'
  )
}

// Client cho React App (Read-only, Public)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD,
  perspective: 'published',
})

// // Image URL Builder
// const builder = createImageUrlBuilder({ projectId, dataset })

// export const urlFor = (source: any) => builder.image(source)

// export function getImageUrl(
//   source: any,
//   options: {
//     width?: number
//     height?: number
//     format?: 'webp' | 'avif' | 'auto'
//     quality?: number
//   } = {}
// ) {
//   if (!source?.asset?._ref) return null
//   return builder
//     .image(source)
//     .width(options.width || 800)
//     .auto('format')
//     .format(options.format || 'webp')
//     .quality(options.quality || 80)
//     .url()
// }
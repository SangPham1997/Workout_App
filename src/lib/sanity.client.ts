import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = '2026-01-01'

if (!projectId) {
  throw new Error('❌ Missing VITE_SANITY_PROJECT_ID trong .env.local')
}

// Client chính: dùng CDN cho fetch thông thường
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  timeout: 15000,
})

// Client phụ: bypass CDN, dùng cho force refresh
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  timeout: 15000,
})
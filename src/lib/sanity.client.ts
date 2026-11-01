import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error('❌ Missing VITE_SANITY_PROJECT_ID trong .env.local')
}

/**
 * Sanity client tối ưu cho read-only public data:
 * - useCdn: true → dùng CDN edge của Sanity (gần user, cache HTTP ~60s)
 * - perspective: published → không fetch draft
 * - timeout: 15s → tránh treo UI nếu mạng chậm
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-01',
  useCdn: true,
  perspective: 'published',
  timeout: 15000,
})
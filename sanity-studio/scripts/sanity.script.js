// sanity-studio/scripts/sanity.script.ts
import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  'production'

if (!projectId) {
  throw new Error(
    '❌ Missing SANITY_STUDIO_PROJECT_ID hoặc VITE_SANITY_PROJECT_ID trong .env'
  )
}

if (!process.env.SANITY_API_TOKEN) {
  throw new Error(
    '❌ Missing SANITY_API_TOKEN trong .env (tạo tại sanity.io/manage → API → Tokens)'
  )
}

// Client cho Scripts (Write access - có Token)
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})

// Export thêm client read-only nếu cần
export const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
});
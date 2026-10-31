import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// index.html nằm ở gốc repo, trong khi lệnh dev chạy từ workspace src/
// => phải chỉ định root tường đối để tránh lỗi 404 khi mở http://localhost:5173/
const ROOT = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('vite').UserConfig} */
export default defineConfig({
  root: ROOT,
  base: '/',
  plugins: [react()],
  css: {
    postcss: {
      // Khai báo trực tiếp (không auto-discovery) + truyền absolute config
      // và cwd để Tailwind luôn quét đúng src/, bất kể cwd của tiến trình.
      plugins: [
        tailwindcss({ config: path.resolve(ROOT, 'tailwind.config.js') }),
        autoprefixer,
      ],
    },
  },
})

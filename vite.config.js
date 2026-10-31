import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// index.html nằm ở gốc repo, trong khi lệnh dev chạy từ workspace src/
// => phải chỉ định root tường đối để tránh lỗi 404 khi mở http://localhost:5173/
// https://vite.dev/config/
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
})

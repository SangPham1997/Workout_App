import { defineConfig } from 'vite'

// Fix lỗi esbuild khi pre-bundle dependency của Sanity Studio:
// 1. "@sanity-labs/groq-wasm" dùng top-level await -> phải target esnext (default es2020 sẽ fail).
// 2. Một số package @sanity/* biên dịch với React Compiler (import "react/compiler-runtime").
//    Khi resolve từ workspace gốc, react có exports "./compiler-runtime" hợp lệ, nhưng esbuild
//    pre-bundle bị trỏ nhầm sang bản react cũ hơn -> thêm alias để luôn dùng đúng bản react hiện tại.
export default defineConfig({
  optimizeDeps: {
    esbuild: {
      target: 'esnext',
    },
    include: ['react/compiler-runtime'],
  },
})

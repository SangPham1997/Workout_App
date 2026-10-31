import { fileURLToPath } from 'node:url'

// ROOT luôn là thư mục chứa file config này (repo gốc), bất kể lệnh dev/build
// được chạy từ đâu (repo gốc hay workspace src/). Nếu dùng đường dẫn tương đối
// './src/...', khi cwd = src/ thì Tailwind sẽ tìm 'src/src/...' -> content rỗng
// -> không sinh ra class nào (lỗi "không có css tailwind").
const ROOT = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `${ROOT}index.html`,
    `${ROOT}src/**/*.{js,ts,jsx,tsx}`,
    // tránh Tailwind quét trong sanity-studio/ (bị vite.config.ts import qua symlink)
    `!${ROOT}sanity-studio/**/*`,
  ],
  theme: {
    extend: {
      // ===== CUSTOM ANIMATIONS =====
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.045)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        habitPop: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-30deg)' },
          '50%': { opacity: '1', transform: 'scale(1.4) rotate(10deg)' },
          '100%': { opacity: '0', transform: 'scale(1.8) rotate(20deg)' },
        },
        habitSelectIn: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(-6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'dropdown-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(-8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        breathe: 'breathe 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow linear infinite',
        'habit-pop': 'habitPop 0.6s ease-out forwards',
        'habit-select-in': 'habitSelectIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.3s ease-out',
        'dropdown-in': 'dropdown-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      // ===== CUSTOM MASK UTILITIES =====
      maskImage: {
        'fade-y':
          'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
      },
    },
  },
  plugins: [
    // Plugin nhỏ để tạo utility `.mask-fade-y` từ config trên
    function ({ addUtilities, theme }) {
      addUtilities({
        '.mask-fade-y': {
          '-webkit-mask-image': theme('maskImage.fade-y'),
          'mask-image': theme('maskImage.fade-y'),
        },
        '.scroll-smooth-custom': {
          'scroll-behavior': 'smooth',
          'overscroll-behavior': 'contain',
        },
      });
    },
  ],
};
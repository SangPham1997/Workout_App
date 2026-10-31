// PostCSS được khai báo trực tiếp trong vite.config.js (css.postcss.plugins)
// để đảm bảo Tailwind luôn nhận đúng absolute config bất kể cwd của tiến trình dev.
// File này giữ lại làm no-op, tránh auto-discovery tải trùng plugin.
export default { plugins: {} }

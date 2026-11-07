export function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-slate-200"
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 tracking-wide">
        Đang tải dữ liệu từ Sanity...
      </p>
    </div>
  );
}

export default LoadingSpinner;
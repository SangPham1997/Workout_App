export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-emerald-400">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
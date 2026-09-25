export default function Header({ onToggleFocus }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
            <i className="fa-solid fa-person-biking"></i>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
              HomeCycle <span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Mô phỏng tập luyện thông minh</p>
          </div>
        </div>

        {/* Focus Mode toggle */}
        <button
          onClick={onToggleFocus}
          title="Chế độ tập trung — ẩn UI phụ, chỉ giữ hình và timer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:border-emerald-500/60 hover:text-emerald-300 font-semibold text-sm transition transform active:scale-95"
        >
          <i className="fa-solid fa-crosshairs text-emerald-400"></i>
          <span className="hidden sm:inline">Focus Mode</span>
        </button>
      </div>
    </header>
  );
}
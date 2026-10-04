const ICONS = {
  'Nền tảng': 'fa-person',
  'Kỹ thuật': 'fa-hand-fist',
  'Thể lực': 'fa-heart-pulse',
  'HIIT': 'fa-bolt',
  'Nâng cao': 'fa-bullseye',
  'Thiền & Thở': 'fa-spa',
  'Tổng hợp': 'fa-medal',
};

export default function KarateSessionList({
  sessions,
  currentIndex,
  onSelect,
  completedIds = [],
}) {
  const selectedSession = sessions[currentIndex];
  const filtered = sessions.filter((s) => s.week === (selectedSession?.week || 1));

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-list-check text-rose-400"></i>
          Buổi tập tuần {selectedSession?.week || 1}
        </h3>
        <span className="text-xs text-slate-500">{filtered.length} buổi</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[600px] scrollbar-rose scroll-fade scroll-smooth-custom">
        {filtered.map((s) => {
          const idx = sessions.indexOf(s);
          const isActive = currentIndex === idx;
          const isDone = completedIds.includes(s.id);
          const icon = ICONS[s.category] || 'fa-hand-fist';

          return (
            <div
              key={s.id}
              onClick={() => onSelect(idx)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                isActive
                  ? 'bg-rose-900/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isActive
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    <i className={`fa-solid ${icon}`}></i>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold truncate ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {s.name}
                    </span>
                    {isDone && (
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {s.subName}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {s.durationDisplay}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useRef } from 'react';

const ICONS = {
  'Nền tảng': 'fa-person',
  'Kỹ thuật': 'fa-hand-fist',
  'Thể lực': 'fa-heart-pulse',
  'HIIT': 'fa-bolt',
  'Nâng cao': 'fa-bullseye',
  'Thiền & Thở': 'fa-spa',
  'Tổng hợp': 'fa-medal',
  'Phục hồi': 'fa-spa',
};

const WEEK_LABELS = {
  1: 'Nền tảng',
  2: 'Kỹ thuật',
  3: 'Thể lực',
  4: 'Nâng cao',
  5: 'Tổng hợp',
};

export default function KarateSessionList({
  sessions,
  currentIndex,
  onSelect,
  completedIds = [],
  currentWeek,
  onSelectWeek,
}) {
  const selectedSession = sessions[currentIndex];
  const activeWeek = currentWeek || selectedSession?.week || 1;

  // Ref cho vùng scroll của WeekTabs
  const weekTabsRef = useRef(null);

  const scrollWeekTabs = (direction) => {
    const el = weekTabsRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -150 : 150,
      behavior: 'smooth',
    });
  };

  // Lọc buổi tập theo tuần đang chọn
  const filtered = sessions.filter((s) => s.week === activeWeek);

  // Progress tuần hiện tại
  const weekCompleted = filtered.filter((s) => completedIds.includes(s.id)).length;
  const weekTotal = filtered.length;
  const weekPercent = weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;

  // Progress tổng
  const totalCompleted = sessions.filter((s) => completedIds.includes(s.id)).length;
  const totalPercent = sessions.length > 0 ? (totalCompleted / sessions.length) * 100 : 0;

  // Danh sách các tuần có buổi tập
  const weeks = [...new Set(sessions.map((s) => s.week))].sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4 h-full min-w-0">
      {/* ============ PROGRESS TỔNG ============ */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-trophy text-amber-400"></i>
            <span className="text-sm font-bold text-white">Tiến độ lộ trình</span>
          </div>
          <span className="text-sm font-mono text-slate-300">
            {totalCompleted}/{sessions.length} buổi
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-700 ease-out"
            style={{ width: `${totalPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
          <span>Bắt đầu</span>
          <span className="font-bold text-rose-400">
            {Math.round(totalPercent)}%
          </span>
          <span>Hoàn thành</span>
        </div>
      </div>

      {/* ============ WEEK TABS (scroll ngang + nút chevron) ============ */}
      <div className="relative min-w-0">
        {/* Nút scroll trái */}
        <button
          type="button"
          onClick={() => scrollWeekTabs('left')}
          aria-label="Cuộn sang trái"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900/95 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-rose-500/50 transition flex items-center justify-center shadow-lg"
        >
          <i className="fa-solid fa-chevron-left text-[10px]"></i>
        </button>

        {/* Vùng scroll */}
        <div
          ref={weekTabsRef}
          className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-9 pb-1"
        >
          {weeks.map((w) => {
            const wSessions = sessions.filter((s) => s.week === w);
            const wDone = wSessions.filter((s) => completedIds.includes(s.id)).length;
            const isActive = w === activeWeek;
            const isDone = wDone === wSessions.length && wSessions.length > 0;

            return (
              <button
                key={w}
                type="button"
                onClick={() => onSelectWeek?.(w)}
                className={`flex-shrink-0 flex flex-col items-start gap-0.5 px-3.5 py-2 rounded-xl border transition-all duration-300 min-w-[100px] ${
                  isActive
                    ? 'bg-rose-500/15 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    Tuần {w}
                  </span>
                  {isDone && (
                    <i className="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider ${
                    isActive ? 'text-rose-300' : 'text-slate-500'
                  }`}
                >
                  {WEEK_LABELS[w] || ''}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[10px] font-mono ${
                      isDone ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {wDone}/{wSessions.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Nút scroll phải */}
        <button
          type="button"
          onClick={() => scrollWeekTabs('right')}
          aria-label="Cuộn sang phải"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900/95 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-rose-500/50 transition flex items-center justify-center shadow-lg"
        >
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>

      {/* ============ HEADER TUẦN + PROGRESS TUẦN ============ */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-list-check text-rose-400"></i>
            Tuần {activeWeek} — {WEEK_LABELS[activeWeek] || ''}
          </h3>
          <span className="text-xs text-slate-500">
            {weekCompleted}/{weekTotal} buổi
          </span>
        </div>
        <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden mx-2">
          <div
            className={`h-full transition-all duration-500 ${
              weekCompleted === weekTotal && weekTotal > 0
                ? 'bg-emerald-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${weekPercent}%` }}
          />
        </div>
      </div>

      {/* ============ DANH SÁCH BUỔI TẬP ============ */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[520px] scrollbar-rose scroll-fade scroll-smooth-custom">
        {filtered.map((s, weekIdx) => {
          const idx = sessions.indexOf(s);
          const isActive = currentIndex === idx;
          const isDone = completedIds.includes(s.id);
          const icon = ICONS[s.category] || 'fa-hand-fist';

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                isActive
                  ? 'bg-rose-900/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isActive
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
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
                      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      #{weekIdx + 1}
                    </span>
                    <span
                      className={`text-sm font-bold truncate ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {s.name}
                    </span>
                    {isDone && (
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xs flex-shrink-0"></i>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {s.subName}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    {s.durationDisplay}
                  </span>
                  {isActive && (
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider animate-pulse">
                      Đang xem
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 pl-13 flex items-center gap-3 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <i className="fa-solid fa-dumbbell"></i>
                  {s.exercises?.length || 0} bài tập
                </span>
                {s.circuit && (
                  <span className="inline-flex items-center gap-1">
                    <i className="fa-solid fa-rotate"></i>
                    {s.circuit.rounds} vòng
                  </span>
                )}
                {s.equipment && s.equipment !== 'Không' && (
                  <span className="inline-flex items-center gap-1 truncate">
                    <i className="fa-solid fa-toolbox"></i>
                    {s.equipment}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
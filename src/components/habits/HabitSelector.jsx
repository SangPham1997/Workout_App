import { useState, useRef, useEffect, memo } from 'react';

const HabitSelector = memo(function HabitSelector({
  habits,
  selectedId,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = habits.find((h) => h.id === selectedId) || habits[0];

  // Đóng khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Đóng khi ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!selected) return null;

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex items-center gap-2.5 pl-2.5 pr-3 py-2 rounded-xl border transition-all duration-200 ${
          open
            ? 'bg-slate-800 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800'
        }`}
      >
        {/* Icon habit */}
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${selected.color}25`,
            color: selected.color,
          }}
        >
          <i className={`fa-solid ${selected.icon} text-[10px]`}></i>
        </div>

        {/* Name */}
        <span className="text-xs font-bold text-white max-w-[140px] truncate">
          {selected.name}
        </span>

        {/* Streak badge */}
        {selected.streak > 0 && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold">
            <i className="fa-solid fa-fire text-[8px]"></i>
            {selected.streak}
          </span>
        )}

        {/* Chevron */}
        <i
          className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        ></i>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
          style={{
            animation: 'habitSelectIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-700/50 bg-slate-900/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Chọn thói quen ({habits.length})
            </p>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-700">
            {habits.map((habit) => {
              const isActive = habit.id === selectedId;
              return (
                <button
                  key={habit.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onSelect(habit.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-700/70'
                      : 'hover:bg-slate-700/40'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform"
                    style={{
                      backgroundColor: `${habit.color}20`,
                      color: habit.color,
                    }}
                  >
                    <i className={`fa-solid ${habit.icon} text-xs`}></i>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {habit.name}
                    </div>
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 font-medium mt-0.5">
                        <i className="fa-solid fa-fire text-[8px]"></i>
                        Chuỗi {habit.streak} ngày
                      </div>
                    )}
                  </div>

                  {/* Check */}
                  {isActive && (
                    <i className="fa-solid fa-circle-check text-emerald-400 text-xs flex-shrink-0"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default HabitSelector;
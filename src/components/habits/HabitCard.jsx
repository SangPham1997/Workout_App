import { memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { hapticCheckIn, hapticUndo } from '../../utils/habitFeedback';

const HabitCard = memo(function HabitCard({
  habit,
  parentHabitName,
  checkIns = [],
  onCheckIn,
  onUndoCheckIn,
  onDelete,
  onTwoMinuteStart,
}) {
  const [animating, setAnimating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Detect miss hôm qua (streak > 0 nhưng hôm qua không check-in)
  const missedYesterday = useMemo(() => {
    if (habit.isCheckedInToday) return false;
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    const hasYesterday = checkIns.includes(yesterday);
    return !hasYesterday && habit.streak > 0;
  }, [habit.isCheckedInToday, habit.streak, checkIns]);

  const handleToggle = useCallback(() => {
    if (habit.isCheckedInToday) {
      onUndoCheckIn(habit.id);
      hapticUndo();
    } else {
      onCheckIn(habit.id);
      hapticCheckIn();
      setAnimating(true);
      setTimeout(() => setAnimating(false), 700);
    }
  }, [habit, onCheckIn, onUndoCheckIn]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Xóa thói quen "${habit.name}"?`)) {
      onDelete(habit.id);
    }
    setShowMenu(false);
  }, [habit, onDelete]);

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-300 ${
        habit.isCheckedInToday
          ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
          : 'bg-slate-800/60 border-slate-700/50'
      } ${animating ? 'scale-[1.03]' : 'scale-100'}`}
    >
      {/* Menu button */}
      <button
        type="button"
        onClick={() => setShowMenu((v) => !v)}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition flex items-center justify-center z-10"
        aria-label="Menu"
      >
        <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-12 right-3 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden min-w-[140px]"
        >
          <button
            type="button"
            onClick={handleDelete}
            className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-slate-700/60 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-trash text-xs"></i>
            Xóa thói quen
          </button>
        </div>
      )}

      {/* Icon + Name + Chain + Streak */}
      <div className="flex items-center gap-3 mb-4 pr-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
        >
          <i className={`fa-solid ${habit.icon}`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-white truncate">
              {habit.name}
            </h3>
            {parentHabitName && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[9px] font-bold flex-shrink-0"
                title={`Sau khi: ${parentHabitName}`}
              >
                <i className="fa-solid fa-link text-[8px]"></i>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-fire text-amber-400"></i>
              Chuỗi:{' '}
              <span className="font-bold text-white">{habit.streak}</span>
            </span>
            {habit.freezeAvailable > 0 && (
              <span
                className="flex items-center gap-1 text-cyan-400"
                title="Có thể dùng để bỏ lỡ 1 ngày"
              >
                <i className="fa-solid fa-snowflake text-[10px]"></i>
                {habit.freezeAvailable}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main check button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 active:scale-95 ${
          habit.isCheckedInToday
            ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
            : 'bg-slate-700 text-white hover:bg-slate-600'
        }`}
        aria-pressed={habit.isCheckedInToday}
      >
        <i
          className={`fa-solid ${
            habit.isCheckedInToday ? 'fa-check-circle' : 'fa-circle'
          }`}
        ></i>
        {habit.isCheckedInToday ? 'Đã hoàn thành' : 'Hoàn thành'}
      </button>

      {/* TWO-MINUTE MODE */}
      {habit.twoMinuteMode && !habit.isCheckedInToday && (
        <>
          {missedYesterday ? (
            <button
              type="button"
              onClick={() => onTwoMinuteStart?.(habit.id)}
              className="w-full mt-2 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95"
            >
              <i className="fa-solid fa-clock text-xs"></i>
              Chỉ 2 phút cứu streak
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTwoMinuteStart?.(habit.id)}
              className="w-full mt-2 py-2 text-[11px] text-slate-500 hover:text-amber-400 transition flex items-center justify-center gap-1 group"
              title={
                habit.twoMinuteTask ? `Chỉ cần: ${habit.twoMinuteTask}` : ''
              }
            >
              <i className="fa-solid fa-clock text-[9px] group-hover:text-amber-400"></i>
              Bận quá? Chỉ 2 phút thôi
            </button>
          )}
        </>
      )}

      {/* Animation overlay */}
      {animating && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <div className="text-emerald-400 text-7xl animate-habit-pop">✓</div>
        </div>
      )}
    </div>
  );
});

export default HabitCard;
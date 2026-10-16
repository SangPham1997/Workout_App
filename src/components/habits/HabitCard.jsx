import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { hapticCheckIn, hapticUndo } from '../../utils/habitFeedback';

const HabitCard = memo(function HabitCard({
  habit,
  onCheckIn,
  onUndoCheckIn,
  onDelete,
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
        className="absolute top-3 right-3 w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition flex items-center justify-center"
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

      {/* Icon + Name + Streak */}
      <div className="flex items-center gap-3 mb-4 pr-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
        >
          <i className={`fa-solid ${habit.icon}`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">
            {habit.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-fire text-amber-400"></i>
              Chuỗi: <span className="font-bold text-white">{habit.streak}</span>
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

      {/* Check button */}
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

      {/* Animation overlay khi check-in */}
      {animating && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <div
            className="text-emerald-400 text-7xl"
            style={{
              animation: 'habitPop 0.6s ease-out forwards',
            }}
          >
            ✓
          </div>
        </div>
      )}
    </div>
  );
});

export default HabitCard;
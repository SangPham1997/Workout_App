import { useState, useEffect, useCallback } from 'react';
import { habitIcons, habitColors } from '../../data/habitTemplates';

export default function EditHabitModal({
  isOpen,
  habit,
  allHabits = [],
  onSave,
  onClose,
}) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('fa-dumbbell');
  const [color, setColor] = useState('#10b981');
  const [stackAfter, setStackAfter] = useState(null);
  const [twoMinuteMode, setTwoMinuteMode] = useState(false);
  const [twoMinuteTask, setTwoMinuteTask] = useState('');

  useEffect(() => {
    if (isOpen && habit) {
      setName(habit.name || '');
      setIcon(habit.icon || 'fa-dumbbell');
      setColor(habit.color || '#10b981');
      setStackAfter(habit.stackAfter || null);
      setTwoMinuteMode(habit.twoMinuteMode || false);
      setTwoMinuteTask(habit.twoMinuteTask || '');
    }
  }, [isOpen, habit]);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && isOpen && onClose();
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      icon,
      color,
      stackAfter,
      twoMinuteMode,
      twoMinuteTask: twoMinuteMode ? twoMinuteTask.trim() : null,
    });
    onClose();
  }, [name, icon, color, stackAfter, twoMinuteMode, twoMinuteTask, onSave, onClose]);

  if (!isOpen || !habit) return null;

  const otherHabits = allHabits.filter((h) => h.id !== habit.id && !h.archivedAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-lg font-bold text-white">Sửa thói quen</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-700 transition flex items-center justify-center text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {name || 'Chưa có tên'}
              </div>
              <div className="text-xs text-slate-500">Chuỗi: {habit.streak || 0} ngày</div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Tên thói quen
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition"
              autoFocus
            />
          </div>

          {/* Icon */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Biểu tượng
            </label>
            <div className="grid grid-cols-8 gap-2">
              {habitIcons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                    icon === ic
                      ? 'bg-emerald-500 text-slate-900'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <i className={`fa-solid ${ic} text-sm`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Màu sắc
            </label>
            <div className="flex flex-wrap gap-2">
              {habitColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Habit Stacking */}
          {otherHabits.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Gắn vào thói quen khác
              </label>
              <select
                value={stackAfter || ''}
                onChange={(e) => setStackAfter(e.target.value || null)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">-- Không gắn --</option>
                {otherHabits.map((h) => (
                  <option key={h.id} value={h.id}>
                    Sau khi: {h.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Two-Minute Mode */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={twoMinuteMode}
                onChange={(e) => setTwoMinuteMode(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald-500"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-white mb-1">
                  Chế độ 2 phút
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Giới hạn 2 lần/tuần để cứu streak khi bận rộn
                </p>
              </div>
            </label>

            {twoMinuteMode && (
              <input
                type="text"
                value={twoMinuteTask}
                onChange={(e) => setTwoMinuteTask(e.target.value)}
                placeholder="VD: Lấy áo tập ra"
                className="w-full mt-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-900 font-bold transition"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
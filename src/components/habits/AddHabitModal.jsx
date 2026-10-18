import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  habitTemplates,
  habitIcons,
  habitColors,
} from '../../data/habitTemplates';
import { useHabitStore } from '../../stores/useHabitStore';

export default function AddHabitModal({ isOpen, onClose }) {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('fa-dumbbell');
  const [color, setColor] = useState('#10b981');
  const [stackAfter, setStackAfter] = useState(null);
  const [twoMinuteMode, setTwoMinuteMode] = useState(false);
  const [twoMinuteTask, setTwoMinuteTask] = useState('');
  const [error, setError] = useState('');

  // Reset khi mở
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setIcon('fa-dumbbell');
      setColor('#10b981');
      setStackAfter(null);
      setTwoMinuteMode(false);
      setTwoMinuteTask('');
      setError('');
    }
  }, [isOpen]);

  // ESC để đóng
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleUseTemplate = useCallback((template) => {
    setName(template.name);
    setIcon(template.icon);
    setColor(template.color);
    setTwoMinuteTask(template.twoMinuteTask || '');
    setStep(2);
    setError('');
  }, []);

  // Validate: 2-min mode bật nhưng chưa có task
  const isInvalid = useMemo(() => {
    return twoMinuteMode && !twoMinuteTask.trim();
  }, [twoMinuteMode, twoMinuteTask]);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên thói quen');
      return;
    }
    if (twoMinuteMode && !twoMinuteTask.trim()) {
      setError('Vui lòng nhập việc 2 phút (VD: Lấy áo tập ra)');
      return;
    }

    addHabit({
      name: name.trim(),
      icon,
      color,
      stackAfter,
      twoMinuteMode,
      twoMinuteTask: twoMinuteMode ? twoMinuteTask.trim() : null,
      frequency: 'daily',
    });

    onClose();
  }, [
    name,
    icon,
    color,
    stackAfter,
    twoMinuteMode,
    twoMinuteTask,
    addHabit,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50 sticky top-0 bg-slate-800 z-10">
          <div>
            <h2 className="text-lg font-bold text-white">Tạo thói quen</h2>
            <p className="text-xs text-slate-500 mt-0.5">Bước {step} / 3</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-700 transition flex items-center justify-center text-slate-400 hover:text-white"
            aria-label="Đóng"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Step 1: Chọn template hoặc nhập tên */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Gợi ý nhanh
              </label>
              <div className="grid grid-cols-2 gap-2">
                {habitTemplates.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleUseTemplate(t)}
                    className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${t.color}20`,
                        color: t.color,
                      }}
                    >
                      <i className={`fa-solid ${t.icon} text-sm`}></i>
                    </div>
                    <span className="text-xs text-white font-medium truncate">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-slate-500">hoặc</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Tên thói quen
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="VD: Uống đủ nước"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                if (!name.trim()) {
                  setError('Vui lòng nhập tên thói quen');
                  return;
                }
                setStep(2);
                setError('');
              }}
              disabled={!name.trim()}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold transition"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Step 2: Icon + Color */}
        {step === 2 && (
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${color}20`, color }}
              >
                <i className={`fa-solid ${icon}`}></i>
              </div>
              <div>
                <div className="text-sm font-bold text-white">{name}</div>
                <div className="text-xs text-slate-500">Chuỗi: 0 ngày</div>
              </div>
            </div>

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
                      color === c
                        ? 'ring-2 ring-white scale-110'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Màu ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold transition"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Stack + Two-Minute */}
        {step === 3 && (
          <div className="p-5 space-y-5">
            {habits.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Gắn vào thói quen khác (tuỳ chọn)
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  "Sau khi tôi [thói quen cũ], tôi sẽ [thói quen mới]"
                </p>
                <select
                  value={stackAfter || ''}
                  onChange={(e) => setStackAfter(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="">-- Không gắn --</option>
                  {habits
                    .filter((h) => !h.archivedAt)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoMinuteMode}
                  onChange={(e) => {
                    setTwoMinuteMode(e.target.checked);
                    setError('');
                  }}
                  className="mt-1 w-4 h-4 accent-emerald-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-bold text-white mb-1">
                    Chế độ 2 phút
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Khi bận rộn, chỉ cần làm 1 việc nhỏ 2 phút cũng tính là
                    hoàn thành. Giới hạn 2 lần/tuần.
                  </p>
                </div>
              </label>

              {twoMinuteMode && (
                <input
                  type="text"
                  value={twoMinuteTask}
                  onChange={(e) => {
                    setTwoMinuteTask(e.target.value);
                    setError('');
                  }}
                  placeholder="VD: Lấy áo tập ra"
                  className="w-full mt-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isInvalid}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Tạo thói quen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
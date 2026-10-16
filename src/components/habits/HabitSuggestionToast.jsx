import { useEffect } from 'react';

export default function HabitSuggestionToast({
  isOpen,
  habitName,
  workoutName,
  onConfirm,
  onDismiss,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-slide-up">
      <div className="bg-slate-800 rounded-2xl border border-emerald-500/40 shadow-2xl p-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl flex-shrink-0">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white mb-1">
              Hoàn thành {workoutName}!
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Ghi nhận vào thói quen "{habitName}"?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold transition"
              >
                Có, ghi nhận
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
              >
                Bỏ qua
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-500 hover:text-white transition flex-shrink-0"
            aria-label="Đóng"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
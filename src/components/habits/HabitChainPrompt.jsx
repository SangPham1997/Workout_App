import { useEffect, useState } from 'react';

export default function HabitChainPrompt({
  isOpen,
  fromHabit,
  toHabit,
  onConfirm,
  onDismiss,
  autoDismissSeconds = 10,
}) {
  const [countdown, setCountdown] = useState(autoDismissSeconds);

  useEffect(() => {
    if (isOpen) setCountdown(autoDismissSeconds);
  }, [isOpen, autoDismissSeconds]);

  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) {
      onDismiss();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, countdown, onDismiss]);

  if (!isOpen || !fromHabit || !toHabit) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up">
      <div className="relative overflow-hidden bg-slate-800/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-700/50">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / autoDismissSeconds) * 100}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${fromHabit.color}25`,
                color: fromHabit.color,
              }}
            >
              <i className={`fa-solid ${fromHabit.icon} text-[10px]`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-check-circle text-emerald-400 text-xs"></i>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Vừa hoàn thành
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate">
                {fromHabit.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 pl-2">
            <div className="h-4 w-px bg-emerald-500/40"></div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
              <i className="fa-solid fa-link text-[8px]"></i>
              Chuỗi habit
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${toHabit.color}20`,
                color: toHabit.color,
              }}
            >
              <i className={`fa-solid ${toHabit.icon} text-base`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Làm tiếp
              </div>
              <div className="text-sm font-bold text-white truncate">
                {toHabit.name}
              </div>
              {toHabit.streak > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                  <i className="fa-solid fa-fire text-[8px]"></i>
                  Chuỗi {toHabit.streak} ngày
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-check text-xs"></i>
              Làm luôn
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition"
            >
              Để sau
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-500 mt-2">
            Tự đóng sau {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
}
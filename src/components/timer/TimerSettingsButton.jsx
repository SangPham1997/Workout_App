import { useCallback, useEffect, useState, memo } from 'react';
import { toast } from 'sonner';
import { useTimerStore } from '../../stores/useTimerStore';

export default memo(function TimerSettingsButton({ session, onApply }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(30);
  const [reps, setReps] = useState(10);
  const [rest, setRest] = useState(30);

  const phase = useTimerStore((s) => s.phase);
  const loadSession = useTimerStore((s) => s.loadSession);
  const fullReset = useTimerStore((s) => s.fullReset);

  // Mở modal → load giá trị hiện tại của session
  const handleOpen = useCallback(() => {
    setDuration(session?.duration ?? 30);
    setReps(session?.reps ?? 10);
    setRest(session?.rest ?? 30);
    setOpen(true);
  }, [session]);

  const handleClose = useCallback(() => setOpen(false), []);

  // Escape để đóng
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSave = useCallback(() => {
    const d = Math.max(1, Number(duration) || 30);
    const r = Math.max(1, Number(reps) || 10);
    const s = Math.max(1, Number(rest) || 30);

    if (!session) {
      toast.warning('Chưa chọn bài tập', { id: 'timer-settings' });
      setOpen(false);
      return;
    }

    try {
      // Reset nếu timer đang chạy để áp dụng config mới
      if (phase !== 'idle' && phase !== 'completed') {
        fullReset();
      }
      // Load session với overrides — giữ nguyên mọi field khác
      loadSession({
        ...session,
        duration: d,
        reps: r,
        rest: s,
        mode: session.mode ?? 'time',
        sets: session.sets ?? 3,
      });

      // Trigger parent to show TimerControl
      if (typeof onApply === 'function') onApply();
      toast.success('Đã áp dụng cài đặt timer', { id: 'timer-settings' });
      setOpen(false);
    } catch (err) {
      console.error('[TimerSettings] save failed:', err);
      toast.error('Không thể áp dụng — xem console', { id: 'timer-settings' });
    }
  }, [duration, reps, rest, session, loadSession, fullReset, phase, onApply]);

  return (
    <>
      {/* Fixed button — bottom left */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Cài đặt timer"
        title="Cài đặt timer (duration / reps / rest)"
        className="fixed bottom-4 left-6 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-2xl shadow-sky-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <i className="fa-solid fa-clock text-xl" aria-hidden="true" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Cài đặt timer"
        >
          <div
            className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-clock text-sky-400" aria-hidden="true" />
                Cài đặt Timer
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng"
                className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 -mt-2">
              {session?.name ? `Bài: ${session.name}` : 'Chưa chọn bài'}
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Duration (giây)
                </span>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Reps (số lần)
                </span>
                <input
                  type="number"
                  min={1}
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  3. Rest (giây)
                </span>
                <input
                  type="number"
                  min={1}
                  value={rest}
                  onChange={(e) => setRest(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-bold text-white transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-bold text-white transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
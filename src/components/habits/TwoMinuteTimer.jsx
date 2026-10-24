import { useState, useEffect, useRef, useCallback } from 'react';
import { hapticCheckIn, playCheckInSound } from '../../utils/habitFeedback';

const TOTAL_SECONDS = 120; // 2 phút

/**
 * Wrapper: chỉ mount nội dung khi mở, key theo habit → mỗi lần mở là một
 * phiên 2 phút mới (không cần effect reset state).
 */
export default function TwoMinuteTimer({ isOpen, habit, onComplete, onCancel }) {
  if (!isOpen || !habit) return null;
  return (
    <TwoMinuteTimerContent
      key={habit.id}
      habit={habit}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
}

function TwoMinuteTimerContent({ habit, onComplete, onCancel }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Số giây thật được giữ trong ref: interval chỉ đọc/ghi ref rồi đồng bộ ra
  // state, tránh side effect bên trong state updater (StrictMode gọi 2 lần).
  const secondsRef = useRef(TOTAL_SECONDS);
  const completedRef = useRef(false);
  const finishTimeoutRef = useRef(null);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFinishing(true);
    playCheckInSound();
    hapticCheckIn();
    finishTimeoutRef.current = setTimeout(onComplete, 800);
  }, [onComplete]);

  // Đếm ngược
  useEffect(() => {
    if (isPaused || isFinishing) return undefined;

    const id = setInterval(() => {
      secondsRef.current = Math.max(0, secondsRef.current - 1);
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current === 0) finish();
    }, 1000);

    return () => clearInterval(id);
  }, [isPaused, isFinishing, finish]);

  // Cleanup timeout khi unmount
  useEffect(
    () => () => {
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    },
    []
  );

  // ESC để đóng
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !isFinishing) onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFinishing, onCancel]);

  const handleFinishNow = useCallback(() => finish(), [finish]);

  const handlePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  const handleSkip = useCallback(() => {
    if (isFinishing) return;
    if (window.confirm('Bỏ qua 2 phút này? Streak sẽ không được tính.')) {
      onCancel();
    }
  }, [isFinishing, onCancel]);

  const progress = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (isFinishing) return '#34d399';
    if (isPaused) return '#94a3b8';
    if (secondsLeft <= 10) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-slate-800 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Hẹn giờ 2 phút"
      >
        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${habit.color}25`,
                color: habit.color,
              }}
            >
              <i className={`fa-solid ${habit.icon} text-base`}></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-clock text-[8px]"></i>
                Chế độ 2 phút
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                {habit.name}
              </h3>
            </div>
          </div>

          {habit.twoMinuteTask && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/50 mb-4">
              <i className="fa-solid fa-arrow-right text-amber-400 text-[10px]"></i>
              <span className="text-xs text-slate-300">
                {habit.twoMinuteTask}
              </span>
            </div>
          )}
        </div>

        {/* TIMER CIRCLE */}
        <div className="relative flex items-center justify-center px-6 pb-4">
          <div className="relative w-[200px] h-[200px]">
            <svg
              className="absolute inset-0 -rotate-90"
              width="200"
              height="200"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(51, 65, 85, 0.4)"
                strokeWidth="10"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={getProgressColor()}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                  filter: `drop-shadow(0 0 8px ${getProgressColor()}60)`,
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isFinishing ? (
                <>
                  <div className="text-emerald-400 text-6xl animate-habit-pop">
                    ✓
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-2">
                    Hoàn thành!
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`text-5xl font-mono font-bold tabular-nums ${
                      isPaused
                        ? 'text-slate-500'
                        : secondsLeft <= 10
                        ? 'text-amber-400 animate-pulse'
                        : 'text-white'
                    }`}
                  >
                    {displayTime}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                    {isPaused ? 'Đã tạm dừng' : 'Thời gian còn lại'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        {!isFinishing && (
          <div className="px-6 pb-6 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePause}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2 ${
                  isPaused
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <i
                  className={`fa-solid ${
                    isPaused ? 'fa-play' : 'fa-pause'
                  } text-xs`}
                ></i>
                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              </button>

              <button
                type="button"
                onClick={handleFinishNow}
                className="flex-1 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check text-xs"></i>
                Xong sớm
              </button>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-xs text-slate-500 hover:text-rose-400 transition flex items-center justify-center gap-1"
            >
              <i className="fa-solid fa-xmark text-[10px]"></i>
              Bỏ qua 2 phút này
            </button>
          </div>
        )}

        {/* FINISHING STATE */}
        {isFinishing && (
          <div className="px-6 pb-6">
            <div className="text-center text-sm text-slate-400 mb-3">
              Đã ghi nhận vào chuỗi habit
            </div>
            <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ animation: 'progressFill 0.8s ease-out forwards' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHourglassStart,
  faFire,
  faMugHot,
  faCircleCheck,
  faPause,
  faRotateRight,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';

const PHASE_STYLES = {
  idle: {
    label: 'Sẵn sàng',
    icon: faHourglassStart,
    badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    barClass: 'bg-slate-500',
    timeClass: 'text-white',
  },
  work: {
    label: 'Đang tập',
    icon: faFire,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    barClass: 'bg-emerald-500',
    timeClass: 'text-white',
  },
  rest: {
    label: 'Nghỉ',
    icon: faMugHot,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    barClass: 'bg-amber-500',
    timeClass: 'text-amber-300',
  },
  completed: {
    label: 'Hoàn thành',
    icon: faCircleCheck,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    barClass: 'bg-emerald-400',
    timeClass: 'text-emerald-400',
  },
};

function TimerControlInner({
  phase = 'idle',
  currentSet = 1,
  totalSets = 1,
  timeLeft,
  workDuration,
  restDuration = 0,
  mode = 'time',
  reps = null,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onResetAndStart,
  soundEnabled,
  onToggleSound,
}) {
  // Phase hiện tại dùng duration nào
  const phaseDuration = phase === 'rest' ? restDuration : workDuration;
  const percent =
    phaseDuration > 0 ? Math.max(0, (timeLeft / phaseDuration) * 100) : 0;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const meta = PHASE_STYLES[phase] ?? PHASE_STYLES.idle;

  // ===== BUTTON LOGIC =====
  let buttonLabel, buttonIcon, buttonClass, onClick;
  if (isRunning) {
    buttonLabel = 'Tạm dừng';
    buttonIcon = faPause;
    buttonClass = 'bg-amber-500 hover:bg-amber-400 text-slate-900';
    onClick = onPause;
  } else if (isCompleted) {
    buttonLabel = 'Bắt đầu lại';
    buttonIcon = faRotateRight;
    buttonClass = 'bg-blue-500 hover:bg-blue-400 text-white';
    onClick = onResetAndStart;
  } else if (phase !== 'idle' && timeLeft > 0 && timeLeft < phaseDuration) {
    buttonLabel = 'Tiếp tục';
    buttonIcon = faPlay;
    buttonClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-900';
    onClick = onStart;
  } else {
    buttonLabel = 'Bắt đầu';
    buttonIcon = faPlay;
    buttonClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-900';
    onClick = onStart;
  }

  // ===== SET INDICATOR =====
  const setDots = Array.from({ length: totalSets }, (_, i) => i + 1);

  // ===== REPS HINT =====
  const showRepsHint =
    mode === 'reps' && reps != null && (phase === 'work' || phase === 'idle');

  const setLabel = (() => {
    if (phase === 'idle') return 'Sẵn sàng bắt đầu';
    if (phase === 'completed') return `Đã xong ${totalSets} hiệp`;
    if (phase === 'rest') return `Nghỉ trước hiệp ${currentSet + 1}/${totalSets}`;
    return `Hiệp ${currentSet}/${totalSets}`;
  })();

  return (
    <div
      className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 shadow-lg"
      role="timer"
      aria-live="polite"
      aria-label={`${meta.label}, ${setLabel}, còn ${mins} phút ${secs} giây`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* ===== LEFT: TIME + PROGRESS ===== */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          {/* Badge + set label */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${meta.badgeClass}`}
            >
              {/* FIX: dùng FontAwesomeIcon với object icon */}
              <FontAwesomeIcon icon={meta.icon} className="text-[10px]" aria-hidden="true" />
              {meta.label}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {setLabel}
            </span>
          </div>

          {/* Time + set dots */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className={`text-4xl font-mono font-bold tabular-nums tracking-tight ${meta.timeClass}`}>
                {mins}:{secs}
              </span>
              {showRepsHint && (
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Mục tiêu: <span className="text-emerald-400 font-semibold">{reps} lần</span>
                </span>
              )}
            </div>

            {/* Set dots */}
            {totalSets > 1 && (
              <div
                className="flex items-center gap-1.5"
                aria-label={`Tiến độ hiệp: ${currentSet}/${totalSets}`}
              >
                {setDots.map((s) => {
                  const isDone = phase === 'completed' || s < currentSet;
                  const isActive = !isDone && s === currentSet;
                  return (
                    <span
                      key={s}
                      className={`w-2 h-2 rounded-full transition-all ${
                        isDone
                          ? 'bg-emerald-500'
                          : isActive
                          ? 'bg-emerald-400 ring-2 ring-emerald-400/40 scale-125'
                          : 'bg-slate-600'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="w-full max-w-[280px] h-2 bg-slate-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={timeLeft}
            aria-valuemin={0}
            aria-valuemax={phaseDuration}
            aria-label="Tiến độ phase hiện tại"
          >
            <div
              className={`h-full transition-all duration-1000 ${meta.barClass}`}
              style={{ width: `${percent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ===== RIGHT: BUTTONS ===== */}
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onClick}
            className={`flex-1 md:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${buttonClass}`}
          >
            {/* FIX: dùng FontAwesomeIcon với object icon */}
            <FontAwesomeIcon icon={buttonIcon} className="text-sm" aria-hidden="true" />
            <span>{buttonLabel}</span>
          </button>

          <button
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
            aria-label="Đặt lại bộ đếm"
          >
            <FontAwesomeIcon icon={faRotateRight} aria-hidden="true" />
          </button>

          {/* FIX: chỉ còn 1 nút sound */}
          <button
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </div>
  );
}

const arePropsEqual = (prev, next) => {
  const prevMins = String(Math.floor(prev.timeLeft / 60)).padStart(2, '0');
  const prevSecs = String(prev.timeLeft % 60).padStart(2, '0');
  const nextMins = String(Math.floor(next.timeLeft / 60)).padStart(2, '0');
  const nextSecs = String(next.timeLeft % 60).padStart(2, '0');

  return (
    // ===== FIX: bổ sung các field bị thiếu =====
    prev.phase === next.phase &&
    prev.currentSet === next.currentSet &&
    prev.mode === next.mode &&
    prev.reps === next.reps &&
    prev.workDuration === next.workDuration &&
    prev.restDuration === next.restDuration &&
    // ===== các field cũ =====
    prevMins === nextMins &&
    prevSecs === nextSecs &&
    prev.isRunning === next.isRunning &&
    prev.isCompleted === next.isCompleted &&
    prev.totalSets === next.totalSets &&
    prev.soundEnabled === next.soundEnabled &&
    // ===== callbacks =====
    prev.onStart === next.onStart &&
    prev.onPause === next.onPause &&
    prev.onReset === next.onReset &&
    prev.onResetAndStart === next.onResetAndStart &&
    prev.onToggleSound === next.onToggleSound
  );
};

export default memo(TimerControlInner, arePropsEqual);
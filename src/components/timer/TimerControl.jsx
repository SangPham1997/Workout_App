import { memo } from 'react';

const ACCENTS = {
  emerald: {
    button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bar: 'bg-emerald-500',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    dotDone: 'bg-emerald-500',
    dotActive: 'bg-emerald-400 ring-2 ring-emerald-400/40',
    text: 'text-emerald-400',
  },
  sky: {
    button: 'bg-sky-500 hover:bg-sky-400 text-slate-900',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    bar: 'bg-sky-500',
    shadow: 'shadow-[0_0_20px_rgba(14,165,233,0.3)]',
    dotDone: 'bg-sky-500',
    dotActive: 'bg-sky-400 ring-2 ring-sky-400/40',
    text: 'text-sky-400',
  },
  rose: {
    button: 'bg-rose-500 hover:bg-rose-400 text-white',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    bar: 'bg-rose-500',
    shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    dotDone: 'bg-rose-500',
    dotActive: 'bg-rose-400 ring-2 ring-rose-400/40',
    text: 'text-rose-400',
  },
};

const PHASE_STYLES = {
  idle: {
    label: 'Sẵn sàng',
    icon: 'fa-hourglass-start',
    badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    barClass: 'bg-slate-500',
    timeClass: 'text-white',
  },
  work: {
    label: 'Đang tập',
    icon: 'fa-fire',
    timeClass: 'text-white',
  },
  rest: {
    label: 'Nghỉ',
    icon: 'fa-mug-hot',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    barClass: 'bg-amber-500',
    timeClass: 'text-amber-300',
  },
  completed: {
    label: 'Hoàn thành',
    icon: 'fa-circle-check',
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
  accent = 'emerald',
  onStart,
  onPause,
  onReset,
  onToggleSound,
  soundEnabled,
  onResetAndStart,
}) {
  const accentTheme = ACCENTS[accent] ?? ACCENTS.emerald;
  const meta = PHASE_STYLES[phase] ?? PHASE_STYLES.idle;

  // Phase hiện tại dùng duration nào
  const phaseDuration = phase === 'rest' ? restDuration : workDuration;
  const percent =
    phaseDuration > 0 ? Math.max(0, (timeLeft / phaseDuration) * 100) : 0;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const badgeClass =
    phase === 'work' ? accentTheme.badge : meta.badgeClass;
  const barClass = phase === 'work' ? accentTheme.bar : meta.barClass;

  // ===== BUTTON LOGIC =====
  let buttonLabel, buttonIcon, buttonClass, onClick;
  if (isRunning) {
    buttonLabel = 'Tạm dừng';
    buttonIcon = 'fa-pause';
    buttonClass = 'bg-amber-500 hover:bg-amber-400 text-slate-900';
    onClick = onPause;
  } else if (isCompleted) {
    buttonLabel = 'Bắt đầu lại';
    buttonIcon = 'fa-rotate-right';
    buttonClass = 'bg-blue-500 hover:bg-blue-400 text-white';
    onClick = onResetAndStart;
  } else if (phase !== 'idle' && timeLeft > 0 && timeLeft < phaseDuration) {
    buttonLabel = 'Tiếp tục';
    buttonIcon = 'fa-play';
    buttonClass = accentTheme.button;
    onClick = onStart;
  } else {
    buttonLabel = 'Bắt đầu';
    buttonIcon = 'fa-play';
    buttonClass = accentTheme.button;
    onClick = onStart;
  }

  // ===== SET INDICATOR =====
  const setDots = Array.from({ length: totalSets }, (_, i) => i + 1);

  // ===== REPS HINT (chỉ khi mode='reps' và đang work) =====
  const showRepsHint =
    mode === 'reps' && reps != null && (phase === 'work' || phase === 'idle');

  // Set label hiển thị: "Hiệp 1/2" hoặc "Nghỉ" hoặc "Hoàn thành"
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
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
        {/* ===== LEFT: TIME + PROGRESS ===== */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          {/* Badge + set label */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClass}`}
            >
              <i className={`fa-solid ${meta.icon} text-[10px]`} aria-hidden="true" />
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
                  Mục tiêu:{' '}
                  <span className={`${accentTheme.text} font-semibold`}>
                    {reps} lần
                  </span>
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
                          ? accentTheme.dotDone
                          : isActive
                          ? accentTheme.dotActive
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
              className={`h-full transition-all duration-1000 ${barClass}`}
              style={{ width: `${percent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ===== RIGHT: BUTTONS ===== */}
        <div className="flex gap-3 w-full xl:w-auto">
          <button
            onClick={onClick}
            className={`flex-1 xl:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 ${accentTheme.shadow} ${buttonClass}`}
          >
            <i className={`fa-solid ${buttonIcon} text-sm`} aria-hidden="true" />
            <span>{buttonLabel}</span>
          </button>
          <button
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
            aria-label="Đặt lại bộ đếm"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>
          <button
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
            onClick={onToggleSound}
            aria-label="Toggle sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mọi prop đều là primitive/callback ổn định → memo so sánh nông là đủ.
export default memo(TimerControlInner);

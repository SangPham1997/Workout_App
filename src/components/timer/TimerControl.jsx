import { memo } from 'react';

function TimerControlInner({
  timeLeft,
  isRunning,
  total,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onResetAndStart,
}) {
  const percent = total > 0 ? (timeLeft / total) * 100 : 0;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  let buttonLabel;
  let buttonIcon;
  let buttonClass;
  const isDisabled = false;
  let onClick;

  if (isRunning) {
    buttonLabel = 'Tạm dừng';
    buttonIcon = 'fa-pause';
    buttonClass = 'bg-amber-500 hover:bg-amber-400 text-slate-900';
    onClick = onPause;
  } else if (isCompleted) {
    buttonLabel = 'Bắt đầu lại';
    buttonIcon = 'fa-rotate-right';
    buttonClass = 'bg-blue-500 hover:bg-blue-400 text-white';
    onClick = onResetAndStart; // reset + start
  } else if (timeLeft < total && timeLeft > 0) {
    buttonLabel = 'Tiếp tục';
    buttonIcon = 'fa-play';
    buttonClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-900';
    onClick = onStart; // chỉ tiếp tục, không reset
  } else {
    buttonLabel = 'Bắt đầu';
    buttonIcon = 'fa-play';
    buttonClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-900';
    onClick = onStart;
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 shadow-lg" role="timer" aria-live="polite" aria-label={`Thời gian còn lại ${mins} phút ${secs} giây`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400" aria-hidden="true">
              <i className="fa-regular fa-clock text-xl"></i>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-widest mb-0.5">
                {isCompleted ? 'Hoàn thành' : 'Thời gian còn lại'}
              </span>
              <span className={`text-4xl font-mono font-bold tabular-nums tracking-tight ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                {mins}:{secs}
              </span>
            </div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[250px] h-2 bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={total} aria-label="Tiến độ bài tập">
            <div className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }} aria-hidden="true"></div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onClick}
            disabled={isDisabled}
            className={`flex-1 md:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${buttonClass}`}
          >
            <i className={`fa-solid ${buttonIcon} text-sm`} aria-hidden="true"></i>
            <span>{buttonLabel}</span>
          </button>
          <button
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
            aria-label="Đặt lại bộ đếm"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom comparison: only re-render when props that affect UI actually change
// timeLeft changes every second, but we only need to re-render when the formatted time (mins:secs) changes
// or when isRunning/isCompleted/total change
const arePropsEqual = (prev, next) => {
  // Compare formatted time (minute:second) instead of raw seconds
  const prevMins = String(Math.floor(prev.timeLeft / 60)).padStart(2, '0');
  const prevSecs = String(prev.timeLeft % 60).padStart(2, '0');
  const nextMins = String(Math.floor(next.timeLeft / 60)).padStart(2, '0');
  const nextSecs = String(next.timeLeft % 60).padStart(2, '0');
  
  return (
    prevMins === nextMins &&
    prevSecs === nextSecs &&
    prev.isRunning === next.isRunning &&
    prev.isCompleted === next.isCompleted &&
    prev.total === next.total &&
    prev.onStart === next.onStart &&
    prev.onPause === next.onPause &&
    prev.onReset === next.onReset &&
    prev.onResetAndStart === next.onResetAndStart
  );
};

export default memo(TimerControlInner, arePropsEqual);
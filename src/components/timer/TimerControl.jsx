export default function TimerControl({
  timeLeft,
  isRunning,
  total,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onResetAndStart, // mới
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
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
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
          <div className="w-full max-w-[200px] md:max-w-[250px] h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onClick}
            disabled={isDisabled}
            className={`flex-1 md:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${buttonClass}`}
          >
            <i className={`fa-solid ${buttonIcon} text-sm`}></i>
            <span>{buttonLabel}</span>
          </button>
          <button
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
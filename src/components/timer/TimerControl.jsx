export default function TimerControl({
  timeLeft,
  isRunning,
  total,
  repCount,
  targetReps,
  onStart,
  onPause,
  onReset,
  isResting = false,
  onSkipRest,
}) {
  const percent = total > 0 ? (timeLeft / total) * 100 : 0;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const repPercent = targetReps > 0 ? (repCount / targetReps) * 100 : 0;
  const isRepComplete = repCount >= targetReps;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <i className={`fa-regular ${isResting ? 'fa-clock' : 'fa-clock'} text-xl`}></i>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-widest mb-0.5">
                {isResting ? 'Thời gian nghỉ' : 'Thời gian còn lại'}
              </span>
              <span className={`text-4xl font-mono font-bold tabular-nums tracking-tight ${isResting ? 'text-amber-400' : 'text-white'}`}>
                {mins}:{secs}
              </span>
            </div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[250px] h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isResting ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        {/* Hiển thị rep (chỉ khi không nghỉ) */}
        {!isResting && (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-repeat"></i>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-widest mb-0.5">Reps</span>
              <div className="flex items-center gap-2">
                <span className={`text-4xl font-mono font-bold tabular-nums tracking-tight ${isRepComplete ? 'text-emerald-400' : 'text-white'}`}>
                  {repCount}
                </span>
                <span className="text-xl text-slate-500">/</span>
                <span className="text-xl text-slate-400">{targetReps}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full md:w-auto">
          {isResting ? (
            // Nút bỏ qua nghỉ
            <button
              onClick={onSkipRest}
              className="flex-1 md:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <i className="fa-solid fa-forward text-sm"></i>
              <span>Bỏ qua nghỉ</span>
            </button>
          ) : (
            <>
              <button
                onClick={isRunning ? onPause : onStart}
                disabled={isRepComplete && !isRunning}
                className={`flex-1 md:flex-none min-w-[160px] py-3 px-8 rounded-2xl font-bold transition transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                    : isRepComplete
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                }`}
              >
                <i className={`fa-solid ${isRunning ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                <span>{isRunning ? 'Tạm dừng' : isRepComplete ? '✅ Hoàn thành' : 'Bắt đầu'}</span>
              </button>
              <button
                onClick={onReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-2xl transition border border-slate-700 hover:border-slate-600"
              >
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thanh tiến trình rep (chỉ khi không nghỉ) */}
      {!isResting && (
        <div className="mt-3 w-full">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Tiến độ rep</span>
            <span>{Math.round(repPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isRepComplete ? 'bg-emerald-400' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(repPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
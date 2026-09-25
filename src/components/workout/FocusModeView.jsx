import CircularTimer from '../timer/CircularTimer';
import SvgSimulator from '../simulator/SvgSimulator';

/*
  FocusModeView — chế độ tập trung toàn màn hình (Sprint 2).
  Chỉ giữ: hình động tác + vòng timer + 2 nút điều khiển tối thiểu.
  Nhận phím Space để Bắt đầu/Dừng, Esc để thoát.
*/
export default function FocusModeView({
  exercise,
  timeLeft,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onExit,
}) {
  const handleKey = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      isRunning ? onPause() : onStart();
    }
    if (e.key === 'Escape') onExit();
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKey}
      ref={(el) => el?.focus()}
      className="fixed inset-0 z-[90] bg-slate-950 flex flex-col items-center justify-center gap-6 p-6 select-none"
    >
      <button
        onClick={onExit}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition transform active:scale-90"
        aria-label="Thoát chế độ tập trung"
      >
        <i className="fa-solid fa-xmark text-lg" />
      </button>

      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">{exercise.name}</h2>
        <p className="text-sm text-emerald-400 mt-1">{exercise.target}</p>
      </div>

      <div className="w-full max-w-[380px]">
        <SvgSimulator exercise={exercise} isRunning={isRunning} />
      </div>

      <CircularTimer
        timeLeft={timeLeft}
        total={exercise.duration}
        isRunning={isRunning}
        isCompleted={isCompleted}
      />

      <div className="flex gap-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className={`min-w-[200px] py-4 px-10 rounded-2xl font-extrabold text-lg transition transform active:scale-95 shadow-lg ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
          }`}
        >
          <i className={`fa-solid ${isRunning ? 'fa-pause' : 'fa-play'} mr-2`} />
          {isRunning ? 'Tạm dừng' : isCompleted ? 'Xong — bắt đầu lại' : 'Bắt đầu'}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Space</kbd> để chạy/dừng ·{' '}
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Esc</kbd> để thoát
      </p>
    </div>
  );
}

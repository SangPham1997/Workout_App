import CircularTimer from './CircularTimer';
import { useWakeLock } from '../../hooks/useWakeLock';

/*
  TimerControl — phiên bản nâng cấp:
  - Circular Progress SVG thay text timer thuần (giữ số MM:SS ở giữa vòng).
  - Audio cues bằng Web Audio API: beep khi start/pause, đếm ngược 5..1, hợp âm hoàn thành.
  - Wake Lock API giữ sáng màn hình khi đang tập.
  - Nút điều khiển phóng to, hiệu ứng :active thu nhỏ khi bấm.
*/
export default function TimerControl({
  timeLeft,
  isRunning,
  total,
  isCompleted,
  onStart,
  onPause,
  onReset,
}) {
  // Wake lock chỉ khi đang chạy
  useWakeLock(isRunning);

  let buttonLabel = 'Bắt đầu';
  let buttonIcon = 'fa-play';
  let buttonClass = 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_28px_rgba(16,185,129,0.4)]';
  let onClick = onStart;

  if (isRunning) {
    buttonLabel = 'Tạm dừng';
    buttonIcon = 'fa-pause';
    buttonClass = 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_28px_rgba(245,158,11,0.4)]';
    onClick = onPause;
  } else if (isCompleted) {
    buttonLabel = 'Bắt đầu lại';
    buttonIcon = 'fa-rotate-right';
    buttonClass = 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_28px_rgba(56,189,248,0.4)]';
    onClick = onStart;
  } else if (timeLeft < total && timeLeft > 0) {
    buttonLabel = 'Tiếp tục';
    buttonIcon = 'fa-play';
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Vòng tròn progress SVG */}
        <CircularTimer
          timeLeft={timeLeft}
          total={total}
          isRunning={isRunning}
          isCompleted={isCompleted}
        />

        {/* Cụm nút điều khiển — phóng to, active:scale khi bấm */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={onClick}
            className={`w-full sm:min-w-[220px] py-5 px-8 rounded-2xl font-extrabold text-lg transition transform active:scale-95 flex items-center justify-center gap-3 ${buttonClass}`}
          >
            <i className={`fa-solid ${buttonIcon} text-xl`}></i>
            <span>{buttonLabel}</span>
          </button>
          <button
            onClick={onReset}
            title="Đặt lại"
            aria-label="Đặt lại"
            className="w-full sm:w-[76px] h-[76px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl transition transform active:scale-90 border border-slate-700 hover:border-slate-600 flex items-center justify-center"
          >
            <i className="fa-solid fa-rotate-right text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

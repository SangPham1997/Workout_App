import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

/**
 * MiniTimer — đồng hồ đếm ngược nhỏ hiển thị trên Header.
 * Phản ánh thời gian còn lại của buổi tập đang chọn (HIIT hoặc Karate),
 * dùng chung timer store nên luôn sync với TimerControl ở giữa trang.
 */
export default memo(function MiniTimer({ timeLeft, total, isRunning }) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const percent = total > 0 ? Math.max(0, Math.min(100, (timeLeft / total) * 100)) : 0;

  return (
    <div
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 overflow-hidden"
      title="Thời gian còn lại của buổi tập"
    >
      <FontAwesomeIcon
        icon={faClock}
        size="xs"
        className={isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}
      />
      <span
        className={`font-mono font-bold tabular-nums text-md tracking-tight ${
          isRunning ? 'text-white' : 'text-slate-300'
        }`}
      >
        {mins}:{secs}
      </span>
      {/* Thanh tiến độ mảnh ngay dưới số thời gian */}
      <span className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-1000" style={{ width: `${percent}%` }}></span>
    </div>
  );
});

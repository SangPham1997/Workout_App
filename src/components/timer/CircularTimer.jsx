/*
  CircularTimer — vòng tròn progress SVG thay cho text timer thuần.
  - Mũi cung giảm dần theo thời gian (strokeDashoffset, transition mượt 1s).
  - Giữa vòng hiển thị MM:SS + nhãn trạng thái.
  - Đổi màu: emerald (bình thường) -> amber (<=5s, nhấp nháy) -> sky (xong).
*/

const SIZE = 168;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function CircularTimer({ timeLeft, total, isRunning, isCompleted }) {
  const fraction = total > 0 ? Math.max(0, Math.min(1, timeLeft / total)) : 0;
  const offset = CIRC * (1 - fraction);
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const finalSeconds = isCompleted || timeLeft === 0;
  const urgent = !finalSeconds && timeLeft <= 5 && timeLeft > 0;

  const ringColor = finalSeconds ? '#38bdf8' : urgent ? '#f59e0b' : '#10b981';
  const glowColor = finalSeconds ? 'rgba(56,189,248,0.35)' : urgent ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.25)';

  let label = 'Sẵn sàng';
  if (isCompleted) label = 'Hoàn thành ✓';
  else if (isRunning) label = urgent ? 'Sắp xong…' : 'Đang tập';
  else if (timeLeft < total && timeLeft > 0) label = 'Tạm dừng';

  return (
    <div
      className={`relative shrink-0 ${urgent && isRunning ? 'animate-pulse' : ''}`}
      style={{ width: SIZE, height: SIZE, filter: `drop-shadow(0 0 18px ${glowColor})` }}
      role="timer"
      aria-label={`Thời gian còn lại ${mins}:${secs}`}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        {/* nền vòng */}
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#1e293b" strokeWidth={STROKE} />
        {/* vạch tick trang trí */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R - 10}
          fill="none" stroke="#334155" strokeWidth="1.5"
          strokeDasharray="2 10" opacity="0.6"
        />
        {/* mũi cung progress */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-mono font-bold tabular-nums tracking-tight"
          style={{ color: ringColor }}
        >
          {mins}:{secs}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">
          {label}
        </span>
      </div>
    </div>
  );
}

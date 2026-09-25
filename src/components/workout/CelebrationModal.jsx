import { useMemo } from 'react';

/*
  CelebrationModal — popup chúc mừng khi hoàn thành đủ 11/11 bài.
  - Confetti thuần CSS (không thư viện ngoài).
  - Tóm tắt: số bài, tổng thời gian tập.
  - Nút: "Tập lại từ đầu" / "Khép lại".
*/

const CONFETTI_COLORS = ['#34d399', '#f59e0b', '#38bdf8', '#f472b6', '#a78bfa', '#facc15'];

// sinh sẵn vị trí confetti ngoài render (tránh gọi hàm impure trong component)
const CONFETTI = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 2.5,
  duration: 2.4 + Math.random() * 2,
  size: 6 + Math.random() * 8,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  rotate: Math.random() * 360,
}));

export default function CelebrationModal({ open, exercises, completedCount, onReset, onClose }) {
  const confetti = useMemo(() => CONFETTI, []);

  if (!open) return null;

  const totalSeconds = (exercises ?? []).reduce((sum, e) => sum + (e.duration || 0), 0);
  const mins = Math.floor(totalSeconds / 60);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Chúc mừng hoàn thành lộ trình"
      onClick={onClose}
    >
      {/* confetti layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              transform: `rotate(${c.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div
        className="relative bg-slate-800 border border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_60px_rgba(16,185,129,0.35)] animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-5">
          <i className="fa-solid fa-trophy text-4xl text-yellow-400 animate-bounce" />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          Xuất sắc! 🎉
        </h2>
        <p className="text-slate-300 mb-6">
          Bạn đã hoàn thành toàn bộ lộ trình{' '}
          <span className="font-bold text-emerald-400">{completedCount}/{(exercises ?? []).length}</span> bài tập
          — khoảng <span className="font-bold text-white">{mins} phút</span> vận động.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-7">
          <div className="bg-slate-900/60 rounded-xl py-3 border border-slate-700/60">
            <div className="text-xl font-bold text-emerald-400">{completedCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Bài tập</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl py-3 border border-slate-700/60">
            <div className="text-xl font-bold text-sky-400">{mins}′</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Thời gian</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl py-3 border border-slate-700/60">
            <div className="text-xl font-bold text-amber-400">🔥 1</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Chuỗi ngày</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3.5 px-6 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition transform active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            <i className="fa-solid fa-rotate-right mr-2" />
            Tập lại từ đầu
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-6 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition transform active:scale-95"
          >
            Khép lại
          </button>
        </div>
      </div>
    </div>
  );
}

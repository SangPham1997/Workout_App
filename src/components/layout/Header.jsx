import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  useTimeLeft,
  useIsRunning,
  useKarateIndex,
  useKarateSessions,
} from '../../stores/selectors';
import MiniTimer from '../timer/MiniTimer';

export default memo(function Header() {
  // Đọc trực tiếp từ timer store — luôn phản ánh đúng buổi tập đang chọn (HIIT/Karate)
  const timeLeft = useTimeLeft();
  const isRunning = useIsRunning();
  const { pathname } = useLocation();
  const karateSessions = useKarateSessions();
  const karateIndex = useKarateIndex();

  // Tổng thời lượng của session đang chọn trên trang Karate (dùng cho vòng tiến độ)
  const total = pathname.startsWith('/karate')
    ? karateSessions[karateIndex]?.duration ?? 0
    : 0;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo + tên app */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl group-hover:bg-emerald-500/30 transition">
            <i className="fa-solid fa-person"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight leading-tight">
              Home Workout <span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Mô phỏng tập luyện
            </p>
          </div>
        </NavLink>

        {/* Mini timer — thời gian còn lại của buổi tập đang chọn */}
        <MiniTimer timeLeft={timeLeft} total={total} isRunning={isRunning} />

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-full p-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`
            }
          >
            <i className="fa-solid fa-person-biking text-xs"></i>
            <span className="hidden xs:inline">HIIT</span>
          </NavLink>

          <NavLink
            to="/karate"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`
            }
          >
            <i className="fa-solid fa-hand-fist text-xs"></i>
            <span className="hidden xs:inline">Karate</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
});
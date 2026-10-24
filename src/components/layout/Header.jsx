import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHabitStore } from '../../stores/useHabitStore';

/* ============ NAV ITEMS ============ */
const NAV_ITEMS = [
  {
    to: '/',
    end: true,
    icon: 'fa-person-biking',
    label: 'Exercises',
    color: 'emerald',
  },
  {
    to: '/karate',
    icon: 'fa-hand-fist',
    label: 'Karate',
    color: 'rose',
  },
  {
    to: '/xa',
    icon: 'fa-arrows-up-down',
    label: 'Xà',
    color: 'sky',
  },
  {
    to: '/habits',
    icon: 'fa-check-double',
    label: 'Thói quen',
    color: 'amber',
  },
];

const COLOR_CLASSES = {
  emerald: {
    active: 'bg-emerald-500 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    hover: 'text-slate-400 hover:text-emerald-400',
  },
  rose: {
    active: 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]',
    hover: 'text-slate-400 hover:text-rose-400',
  },
  sky: {
    active: 'bg-sky-500 text-slate-900 shadow-[0_0_12px_rgba(14,165,233,0.35)]',
    hover: 'text-slate-400 hover:text-sky-400',
  },
  amber: {
    active: 'bg-amber-500 text-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
    hover: 'text-slate-400 hover:text-amber-400',
  },
};

export default memo(function Header() {
  const { pathname } = useLocation();

  // Chỉ cần số habit để hiện badge; không subscribe vào session/karate để
  // Header không re-render khi đổi buổi tập.
  const habitsCount = useHabitStore((s) => s.habits.length);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Đóng khi ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [menuOpen]);

  // Đóng menu khi đổi route
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const getBadge = (item) => {
    if (item.to === '/habits' && habitsCount > 0) {
      return habitsCount > 99 ? '99+' : habitsCount;
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 flex items-center gap-2 md:gap-3">
        {/* ============ LOGO ============ */}
        <NavLink
          to="/"
          className="flex items-center flex-1 gap-2 md:gap-3 group flex-shrink-0"
          aria-label="Trang chủ"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg md:text-xl group-hover:bg-emerald-500/30 transition">
            <i className="fa-solid fa-person"></i>
          </div>
          <div className="block">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight leading-tight">
              Home Workout <span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Mô phỏng tập luyện
            </p>
          </div>
        </NavLink>

        {/* ============ DESKTOP NAV TABS (≥ lg) ============ */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-full p-1 flex-shrink-0"
          aria-label="Điều hướng chính"
        >
          {NAV_ITEMS.map((item) => {
            const colors = COLOR_CLASSES[item.color];
            const badge = getBadge(item);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    isActive ? colors.active : colors.hover
                  }`
                }
              >
                <i className={`fa-solid ${item.icon} text-xs`}></i>
                <span>{item.label}</span>
                {badge && (
                  <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ============ DROPDOWN MENU BUTTON — chỉ hiện < lg ============ */}
        <div className="relative flex-shrink-0 lg:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              menuOpen
                ? 'bg-emerald-500 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i
              className={`fa-solid ${
                menuOpen ? 'fa-xmark' : 'fa-bars'
              } text-base transition-transform duration-300`}
            />
            {!menuOpen && habitsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* ============ DROPDOWN PANEL ============ */}
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
              style={{
                animation: 'dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              role="menu"
            >
              {/* Nav items */}
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Điều hướng
                </div>
                {NAV_ITEMS.map((item) => {
                  const isActive = item.end
                    ? pathname === item.to
                    : pathname.startsWith(item.to);
                  const badge = getBadge(item);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMenu}
                      role="menuitem"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-700/60 text-white'
                          : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700/60 text-slate-400'
                        }`}
                      >
                        <i className={`fa-solid ${item.icon} text-xs`}></i>
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {badge && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                      {isActive && (
                        <i className="fa-solid fa-check text-emerald-400 text-xs"></i>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-700/50">
                <p className="text-[10px] text-slate-500 text-center">
                  Home Workout Pro • v1.0
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </header>
  );
});
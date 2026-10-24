import { useMemo, useState, useEffect, memo, useCallback } from 'react';
import { parseDateKey, toDateKey, todayKey as getTodayKey } from '../../utils/dateKey';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_LABELS = [
  'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
  'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12',
];

const DAY_CHECK_INTERVAL = 60 * 1000;

// Kích thước ô (w-3.5 = 14px) + gap-1 (4px) → bước lưới 18px.
// Nhãn tháng tuyệt đối cần bám đúng bước này, nếu lệch sẽ trôi dần về cuối.
const CELL_SIZE = 14;
const CELL_GAP = 4;
const GRID_LEFT = 32; // cột nhãn thứ: w-6 (24) + mr-1 (4) + gap-1 (4)

/* ====== TOOLTIP ====== */
function HeatmapTooltip({ data, anchorRect }) {
  if (!data || !anchorRect) return null;
  const { isChecked, isToday, isFuture, formatted } = data;

  // Kẹp tooltip trong viewport để không bị cắt ở các ô sát mép.
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const center = anchorRect.left + anchorRect.width / 2;
  const halfWidth = 90;
  const left = viewportWidth
    ? Math.min(Math.max(center, halfWidth), viewportWidth - halfWidth)
    : center;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left,
        top: anchorRect.top - 8,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl px-3 py-2 whitespace-nowrap">
        <div className="text-[11px] font-bold text-white">{formatted}</div>
        <div className={`text-[10px] mt-0.5 ${isFuture ? 'text-slate-500' : isChecked ? 'text-emerald-400 font-bold' : isToday ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
          {isFuture ? 'Chưa tới' : isChecked ? '✓ Đã hoàn thành' : isToday ? '⏳ Hôm nay' : '• Chưa hoàn thành'}
        </div>
      </div>
      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-px">
        <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
      </div>
    </div>
  );
}

/* ====== STAT PILL ====== */
function StatPill({ icon, label, value, color = 'slate' }) {
  const colorMap = {
    slate: 'bg-slate-700/40 text-slate-300',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    sky: 'bg-sky-500/15 text-sky-400',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <i className={`fa-solid ${icon} text-[10px]`}></i>
      </div>
      <div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wider leading-tight">{label}</div>
        <div className="text-sm font-bold text-white tabular-nums leading-tight">{value}</div>
      </div>
    </div>
  );
}

/* Lấy class và style cho ô heatmap (tách ra để render sạch, dễ bảo trì) */
function getCellClass({ isFuture, isChecked, isToday, isHovered, reducedMotion }) {
  const base = 'w-3.5 h-3.5 rounded-[3px] cursor-pointer relative';
  const motion = reducedMotion ? '' : 'transition-all duration-150';

  if (isFuture) return `${base} bg-slate-800/40 cursor-default ${motion}`;

  if (isChecked) {
    return `${base} ${motion} hover:scale-125 hover:ring-2 hover:ring-white/40 hover:z-10 ${isHovered ? 'scale-125 z-10' : ''}`;
  }

  return `${base} ${motion} bg-slate-700/40 hover:scale-125 hover:bg-slate-600/60 hover:ring-2 hover:ring-white/20 hover:z-10 ${isHovered ? 'scale-125 z-10' : ''} ${isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-800' : ''}`;
}

function getCellStyle({ isChecked, isHovered, color, reducedMotion }) {
  if (!isChecked) return undefined;
  const shadow = reducedMotion ? undefined : (isHovered ? `0 0 12px ${color}80` : undefined);
  return { backgroundColor: color, boxShadow: shadow };
}

const CalendarHeatmap = memo(function CalendarHeatmap({
  checkIns = [],
  color = '#10b981',
  weeksToShow = 12,
}) {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [todayDateKey, setTodayDateKey] = useState(getTodayKey);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const checkInSet = useMemo(() => new Set(checkIns), [checkIns]);

  // ===== BUILD GRID + STATS (một lượt, O(n)) =====
  const { weeks, monthLabels, stats } = useMemo(() => {
    const todayDate = parseDateKey(todayDateKey);
    const todayTime = todayDate.getTime();
    const dayOfWeek = todayDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startDate = new Date(todayDate);
    startDate.setDate(
      todayDate.getDate() + diffToMonday - (weeksToShow - 1) * 7
    );

    const weeks = [];
    const monthLabels = [];
    const pastDays = [];
    let lastMonth = -1;

    for (let w = 0; w < weeksToShow; w++) {
      const week = [];

      // Nhãn tháng đặt tại tuần có thứ Hai mở đầu tháng mới.
      const monday = new Date(startDate);
      monday.setDate(startDate.getDate() + w * 7);
      const month = monday.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex: w, label: MONTH_LABELS[month] });
        lastMonth = month;
      }

      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);

        const key = toDateKey(date);
        const isChecked = checkInSet.has(key);
        const isFuture = date.getTime() > todayTime;
        const isToday = date.getTime() === todayTime;

        const weekday = DAY_LABELS[(date.getDay() + 6) % 7];
        const formatted = `${weekday}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const status = isChecked
          ? 'Đã hoàn thành'
          : isToday
          ? 'Hôm nay - chưa hoàn thành'
          : 'Chưa hoàn thành';

        const day = {
          date: key,
          isChecked,
          isFuture,
          isToday,
          formatted,
          ariaLabel: `${formatted} - ${status}`,
        };

        week.push(day);
        if (!isFuture) pastDays.push(day);
      }

      weeks.push(week);
    }

    // ===== STATS =====
    let totalChecked = 0;
    let longestStreak = 0;
    let run = 0;

    for (const day of pastDays) {
      if (day.isChecked) {
        totalChecked++;
        run++;
        if (run > longestStreak) longestStreak = run;
      } else {
        run = 0;
      }
    }

    // Chuỗi hiện tại: tính ngược từ hôm nay, bỏ qua hôm nay nếu chưa check-in.
    let currentStreak = 0;
    for (let i = pastDays.length - 1; i >= 0; i--) {
      const day = pastDays[i];
      if (day.isChecked) currentStreak++;
      else if (day.isToday) continue;
      else break;
    }

    const totalPast = pastDays.length;
    return {
      weeks,
      monthLabels,
      stats: {
        totalChecked,
        totalPast,
        completionRate:
          totalPast > 0 ? Math.round((totalChecked / totalPast) * 100) : 0,
        currentStreak,
        longestStreak,
      },
    };
  }, [todayDateKey, checkInSet, weeksToShow]);

  // ===== HOVER HANDLERS =====
  const handleCellHover = useCallback((day, e) => {
    if (day.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ data: day, anchorRect: rect });
    setHoveredKey(day.date);
  }, []);

  const handleCellLeave = useCallback(() => {
    setTooltip(null);
    setHoveredKey(null);
  }, []);

  // Đóng tooltip khi scroll
  useEffect(() => {
    const handleScroll = () => setTooltip(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // ===== RESET KHI SANG NGÀY MỚI =====
  // App mở qua nửa đêm: kiểm tra mỗi phút, sang ngày mới thì tính lại lưới.
  useEffect(() => {
    const timer = setInterval(() => {
      const nextKey = getTodayKey();
      if (nextKey !== todayDateKey) {
        setTodayDateKey(nextKey);
        setTooltip(null);
        setHoveredKey(null);
      }
    }, DAY_CHECK_INTERVAL);
    return () => clearInterval(timer);
  }, [todayDateKey]);

  // ===== EMPTY STATE =====
  if (checkIns.length === 0) {
    return (
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-8">
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-slate-700/40 flex items-center justify-center mb-3">
            <i className="fa-solid fa-calendar-xmark text-slate-500 text-2xl"></i>
          </div>
          <p className="text-sm font-bold text-slate-300 mb-1">
            Chưa có dữ liệu
          </p>
          <p className="text-xs text-slate-500 max-w-xs">
            Bắt đầu check-in hôm nay để xây dựng chuỗi và xem tiến độ tại đây!
          </p>
        </div>
      </div>
    );
  }

  const cellStep = CELL_SIZE + CELL_GAP;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 overflow-hidden" role="region" aria-label="Lịch heatmap thói quen">
      {/* ===== STATS HEADER ===== */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5 pb-5 border-b border-slate-700/40">
        <StatPill icon="fa-circle-check" label="Đã hoàn thành" value={`${stats.totalChecked}/${stats.totalPast}`} color="emerald" />
        <StatPill icon="fa-percent" label="Tỉ lệ" value={`${stats.completionRate}%`} color="sky" />
        <StatPill icon="fa-fire" label="Chuỗi hiện tại" value={`${stats.currentStreak} ngày`} color="amber" />
        <StatPill icon="fa-trophy" label="Kỷ lục" value={`${stats.longestStreak} ngày`} color="amber" />
      </div>

      {/* ===== HEATMAP GRID ===== */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700" aria-label="Lưới check-in">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="relative h-4 mb-2" aria-hidden="true">
            {monthLabels.map((m) => (
              <div
                key={m.weekIndex}
                className="absolute text-[10px] text-slate-500 uppercase tracking-wider font-bold"
                style={{ left: `${GRID_LEFT + m.weekIndex * cellStep}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1" aria-hidden="true">
              {DAY_LABELS.map((label, i) => (
                <div key={label} className="w-6 h-3.5 text-[9px] text-slate-500 flex items-center font-medium">{i % 2 === 0 ? label : ''}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1" role="grid" aria-label="Các ngày check-in">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1" role="row">
                  {week.map((day) => {
                    const isHovered = hoveredKey === day.date;

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={(e) => handleCellHover(day, e)}
                        onMouseLeave={handleCellLeave}
                        role="gridcell"
                        aria-label={day.ariaLabel}
                        aria-checked={day.isChecked ? 'true' : 'false'}
                        tabIndex={-1}
                        className={getCellClass({ ...day, isHovered, reducedMotion })}
                        style={getCellStyle({ isChecked: day.isChecked, isHovered, color, reducedMotion })}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEGEND ===== */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/40 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500" aria-hidden="true">
          <span>Ít</span>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-700/40" />
          <div
            className="w-3.5 h-3.5 rounded-[3px]"
            style={{ backgroundColor: color }}
          />
          <span>Nhiều</span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500" aria-hidden="true">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-800" />
            <span>Hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-800/40" />
            <span>Tương lai</span>
          </div>
        </div>
      </div>

      {/* ===== TOOLTIP ===== */}
      {tooltip && <HeatmapTooltip data={tooltip.data} anchorRect={tooltip.anchorRect} />}
    </div>
  );
});

export default CalendarHeatmap;

import { useMemo, useState, useRef, useEffect, memo } from 'react';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_LABELS = [
  'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
  'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12',
];

/* ====== TOOLTIP ====== */
function HeatmapTooltip({ data, anchorRect }) {
  if (!data || !anchorRect) return null;
  const { date, isChecked, isToday, isFuture } = data;

  const dateObj = new Date(date);
  const weekday = DAY_LABELS[
    dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1
  ];
  const formatted = `${weekday}, ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: anchorRect.left + anchorRect.width / 2,
        top: anchorRect.top - 8,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl px-3 py-2 whitespace-nowrap">
        <div className="text-[11px] font-bold text-white">{formatted}</div>
        <div
          className={`text-[10px] mt-0.5 ${
            isFuture
              ? 'text-slate-500'
              : isChecked
              ? 'text-emerald-400 font-bold'
              : isToday
              ? 'text-amber-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          {isFuture
            ? 'Chưa tới'
            : isChecked
            ? '✓ Đã hoàn thành'
            : isToday
            ? '⏳ Hôm nay'
            : '• Chưa hoàn thành'}
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
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorMap[color]}`}
      >
        <i className={`fa-solid ${icon} text-[10px]`}></i>
      </div>
      <div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wider leading-tight">
          {label}
        </div>
        <div className="text-sm font-bold text-white tabular-nums leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}

const CalendarHeatmap = memo(function CalendarHeatmap({
  checkIns = [],
  color = '#10b981',
  weeksToShow = 12,
}) {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const containerRef = useRef(null);

  const checkInSet = useMemo(() => new Set(checkIns), [checkIns]);

  // ===== BUILD DAYS GRID =====
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diffToMonday);

    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - (weeksToShow - 1) * 7);

    const result = [];
    const totalDays = weeksToShow * 7;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const isChecked = checkInSet.has(iso);
      const isFuture = d.getTime() > todayTime;
      const isToday = d.getTime() === todayTime;

      result.push({
        date: iso,
        dayOfWeek: d.getDay(),
        week: Math.floor(i / 7),
        isChecked,
        isFuture,
        isToday,
      });
    }
    return result;
  }, [checkInSet, weeksToShow]);

  // ===== GROUP BY WEEK =====
  const weeks = useMemo(() => {
    const result = [];
    for (let w = 0; w < weeksToShow; w++) {
      result.push(days.filter((d) => d.week === w));
    }
    return result;
  }, [days, weeksToShow]);

  // ===== MONTH LABELS =====
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: i, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  // ===== STATS =====
  const stats = useMemo(() => {
    const pastDays = days.filter((d) => !d.isFuture);
    const checkedDays = pastDays.filter((d) => d.isChecked);
    const totalPast = pastDays.length;
    const totalChecked = checkedDays.length;
    const completionRate =
      totalPast > 0 ? Math.round((totalChecked / totalPast) * 100) : 0;

    // Current streak (tính từ hôm nay ngược lại)
    let currentStreak = 0;
    const reversed = [...pastDays].reverse();
    for (const d of reversed) {
      if (d.isChecked) currentStreak++;
      else if (d.isToday) continue; // hôm nay chưa check vẫn cho qua
      else break;
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const d of pastDays) {
      if (d.isChecked) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { totalChecked, totalPast, completionRate, currentStreak, longestStreak };
  }, [days]);

  // ===== HOVER HANDLERS =====
  const handleCellHover = (day, e) => {
    if (day.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ data: day, anchorRect: rect });
    setHoveredKey(day.date);
  };

  const handleCellLeave = () => {
    setTooltip(null);
    setHoveredKey(null);
  };

  // Đóng tooltip khi scroll
  useEffect(() => {
    const handleScroll = () => setTooltip(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

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

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 overflow-hidden">
      {/* ===== STATS HEADER ===== */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5 pb-5 border-b border-slate-700/40">
        <StatPill
          icon="fa-circle-check"
          label="Đã hoàn thành"
          value={`${stats.totalChecked}/${stats.totalPast}`}
          color="emerald"
        />
        <StatPill
          icon="fa-percent"
          label="Tỉ lệ"
          value={`${stats.completionRate}%`}
          color="sky"
        />
        <StatPill
          icon="fa-fire"
          label="Chuỗi hiện tại"
          value={`${stats.currentStreak} ngày`}
          color="amber"
        />
        <StatPill
          icon="fa-trophy"
          label="Kỷ lục"
          value={`${stats.longestStreak} ngày`}
          color="amber"
        />
      </div>

      {/* ===== HEATMAP GRID ===== */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 pl-8 relative h-4">
            {monthLabels.map((m, i) => (
              <div
                key={`${m.weekIndex}-${i}`}
                className="absolute text-[10px] text-slate-500 uppercase tracking-wider font-bold"
                style={{ left: `${32 + m.weekIndex * 15}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="w-6 h-3.5 text-[9px] text-slate-500 flex items-center font-medium"
                >
                  {i % 2 === 0 ? label : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
                    const day = week.find((d) => d.dayOfWeek === dow);
                    if (!day) {
                      return (
                        <div
                          key={dow}
                          className="w-3.5 h-3.5 rounded-[3px] bg-transparent"
                        />
                      );
                    }

                    const isHovered = hoveredKey === day.date;

                    return (
                      <div
                        key={dow}
                        onMouseEnter={(e) => handleCellHover(day, e)}
                        onMouseLeave={handleCellLeave}
                        className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-150 cursor-pointer ${
                          day.isFuture
                            ? 'bg-slate-800/40 cursor-default'
                            : day.isChecked
                            ? 'hover:scale-125 hover:ring-2 hover:ring-white/40 hover:z-10 relative'
                            : 'bg-slate-700/40 hover:scale-125 hover:bg-slate-600/60 hover:ring-2 hover:ring-white/20 hover:z-10 relative'
                        } ${day.isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-800' : ''} ${
                          isHovered && !day.isFuture
                            ? 'scale-125 z-10'
                            : ''
                        }`}
                        style={
                          day.isChecked && !day.isFuture
                            ? {
                                backgroundColor: color,
                                boxShadow: isHovered
                                  ? `0 0 12px ${color}80`
                                  : undefined,
                              }
                            : undefined
                        }
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
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>Ít</span>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-700/40" />
          <div
            className="w-3.5 h-3.5 rounded-[3px]"
            style={{ backgroundColor: color }}
          />
          <span>Nhiều</span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500">
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
      {tooltip && (
        <HeatmapTooltip data={tooltip.data} anchorRect={tooltip.anchorRect} />
      )}
    </div>
  );
});

export default CalendarHeatmap;
import { memo } from 'react';

const HabitStats = memo(function HabitStats({ habits }) {
  if (!habits?.length) return null;

  const totalHabits = habits.length;
  const totalCheckIns = habits.reduce((s, h) => s + (h.totalCheckIns || 0), 0);
  const longestStreak = habits.reduce(
    (m, h) => Math.max(m, h.longestStreak || 0),
    0
  );
  const currentMax = habits.reduce((m, h) => Math.max(m, h.streak || 0), 0);

  const items = [
    {
      icon: 'fa-fire',
      label: 'Chuỗi cao nhất',
      value: currentMax,
      suffix: 'ngày',
      color: 'amber',
    },
    {
      icon: 'fa-trophy',
      label: 'Kỷ lục',
      value: longestStreak,
      suffix: 'ngày',
      color: 'yellow',
    },
    {
      icon: 'fa-circle-check',
      label: 'Tổng check-in',
      value: totalCheckIns,
      suffix: 'lần',
      color: 'emerald',
    },
    {
      icon: 'fa-list-check',
      label: 'Thói quen',
      value: totalHabits,
      suffix: 'đang theo',
      color: 'sky',
    },
  ];

  const colorMap = {
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
    sky: 'from-sky-500/20 to-sky-600/5 border-sky-500/30 text-sky-400',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {items.map((item) => (
        <div
          key={item.label}
          className={`relative rounded-2xl border bg-gradient-to-br ${colorMap[item.color]} backdrop-blur-sm p-4 hover:scale-[1.02] transition-transform`}
        >
          <div
            className={`w-8 h-8 rounded-lg bg-slate-900/40 flex items-center justify-center mb-2 ${colorMap[item.color].split(' ').pop()}`}
          >
            <i className={`fa-solid ${item.icon} text-sm`}></i>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums leading-none mb-0.5">
            {item.value}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
});

export default HabitStats;
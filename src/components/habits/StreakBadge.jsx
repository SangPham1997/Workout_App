import { memo } from 'react';

const StreakBadge = memo(function StreakBadge({ streak, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-base px-5 py-2 gap-2',
  };

  const iconSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  if (streak === 0) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-slate-700/60 text-slate-400 font-bold ${sizeClasses[size]}`}
      >
        <i className={`fa-solid fa-fire ${iconSize[size]}`}></i>
        Chưa có chuỗi
      </span>
    );
  }

  const colorClass =
    streak >= 30
      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
      : streak >= 7
      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
      : 'bg-slate-700/60 text-slate-300';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${colorClass} ${sizeClasses[size]}`}
    >
      <i className={`fa-solid fa-fire ${iconSize[size]}`}></i>
      {streak} ngày
    </span>
  );
});

export default StreakBadge;
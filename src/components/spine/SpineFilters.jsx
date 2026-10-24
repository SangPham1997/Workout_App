import { useMemo } from 'react';

/** Nhóm bài đã lọc theo routine/level/dụng cụ, dùng cho trang /xa. */
export default function SpineFilters({
  groups,
  groupFilter,
  onGroupChange,
  levelFilter,
  onLevelChange,
  barFilter,
  onBarChange,
}) {
  const levelOptions = useMemo(
    () => [
      { value: 0, label: 'Mọi cấp' },
      { value: 1, label: 'Cấp 1 · nhẹ' },
      { value: 2, label: 'Cấp 2 · vừa' },
    ],
    []
  );

  const barOptions = useMemo(
    () => [
      { value: 'all', label: 'Mọi dụng cụ' },
      { value: 'high', label: 'Xà cao' },
      { value: 'low', label: 'Xà thấp' },
      { value: 'none', label: 'Không xà' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Routine tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        <button
          type="button"
          onClick={() => onGroupChange('all')}
          aria-pressed={groupFilter === 'all'}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            groupFilter === 'all'
              ? 'bg-sky-500/20 border-sky-500/60 text-sky-200'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
          }`}
        >
          Tất cả
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => onGroupChange(group.id)}
            aria-pressed={groupFilter === group.id}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              groupFilter === group.id
                ? 'bg-sky-500/20 border-sky-500/60 text-sky-200'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${group.icon} text-[10px]`} aria-hidden="true" />
            {group.short ?? group.label}
          </button>
        ))}
      </div>

      {/* Level + equipment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Cấp độ
          </span>
          <select
            value={levelFilter}
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-800/70 border border-slate-700/60 px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/60"
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Dụng cụ
          </span>
          <select
            value={barFilter}
            onChange={(e) => onBarChange(e.target.value)}
            className="w-full rounded-lg bg-slate-800/70 border border-slate-700/60 px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/60"
          >
            {barOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

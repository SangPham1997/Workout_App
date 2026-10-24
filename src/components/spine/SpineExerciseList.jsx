import { memo, useMemo } from 'react';

const BAR_META = {
  high: { icon: 'fa-arrows-up-down', label: 'Xà cao' },
  low: { icon: 'fa-minus', label: 'Xà thấp' },
  none: { icon: 'fa-person', label: 'Không xà' },
};

const doseLabel = (item) => {
  const sets = item.sets ?? 1;
  if (item.mode === 'reps' && item.reps != null) {
    return `${sets} × ${item.reps} lần`;
  }
  return `${sets} × ${item.duration}s`;
};

const levelDots = (level) =>
  Array.from({ length: 2 }, (_, index) => (
    <span
      key={index}
      className={`w-1.5 h-1.5 rounded-full ${
        index < level ? 'bg-sky-400' : 'bg-slate-700'
      }`}
    />
  ));

const SpineExerciseList = memo(function SpineExerciseList({
  program,
  items,
  selectedId,
  onSelect,
  completedIds,
  onToggleComplete,
}) {
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const grouped = useMemo(() => {
    return program.groups
      .map((group) => {
        const groupItems = items.filter((item) => item.groupId === group.id);
        const done = groupItems.filter((item) => completedSet.has(item.id)).length;
        return { ...group, items: groupItems, done };
      })
      .filter((group) => group.items.length > 0);
  }, [program.groups, items, completedSet]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 text-center">
        <i className="fa-solid fa-filter-circle-xmark text-2xl text-slate-600" aria-hidden="true" />
        <p className="text-sm text-slate-300 mt-2">Không có bài phù hợp bộ lọc.</p>
        <p className="text-xs text-slate-500 mt-1">
          Thử chọn “Mọi cấp” hoặc “Mọi dụng cụ”.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {grouped.map((group) => (
        <section
          key={group.id}
          className="rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden"
          aria-labelledby={`spine-group-${group.id}`}
        >
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-800/70 border-b border-slate-700/40">
            <h3
              id={`spine-group-${group.id}`}
              className="flex items-center gap-2 text-xs font-bold text-sky-200 uppercase tracking-wide"
            >
              <i className={`fa-solid ${group.icon}`} aria-hidden="true" />
              {group.label}
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              {group.done}/{group.items.length}
            </span>
          </div>

          <ul className="divide-y divide-slate-700/30">
            {group.items.map((item) => {
              const isActive = item.id === selectedId;
              const isDone = completedSet.has(item.id);
              const bar = BAR_META[item.bar] ?? BAR_META.none;

              return (
                <li key={item.id}>
                  <div
                    className={`flex items-stretch gap-1 transition ${
                      isActive ? 'bg-sky-900/25' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex-1 min-w-0 text-left px-3 py-2.5 flex items-start gap-2.5 border-l-4 ${
                        isActive ? 'border-sky-400' : 'border-transparent'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? 'bg-sky-500 text-slate-900'
                            : isDone
                            ? 'bg-sky-500/15 text-sky-300'
                            : 'bg-slate-700/70 text-slate-400'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            isDone ? 'fa-check' : bar.icon
                          } text-[11px]`}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-semibold truncate ${
                              isActive ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {item.name}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-bold text-sky-300 uppercase tracking-wider whitespace-nowrap">
                              Đang chọn
                            </span>
                          )}
                        </span>
                        <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                          {item.subName} · {bar.label}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-mono">{doseLabel(item)}</span>
                          <span className="inline-flex items-center gap-0.5" aria-label={`Cấp ${item.level}`}>
                            {levelDots(item.level)}
                          </span>
                          <span className="truncate text-slate-500">
                            {item.spineFocus?.[0]}
                          </span>
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleComplete(item.id)}
                      aria-label={
                        isDone
                          ? `Bỏ đánh dấu đã tập ${item.name}`
                          : `Đánh dấu đã tập ${item.name}`
                      }
                      aria-pressed={isDone}
                      className={`w-9 flex-shrink-0 flex items-center justify-center transition ${
                        isDone
                          ? 'text-sky-300 bg-sky-500/10 hover:bg-sky-500/20'
                          : 'text-slate-600 hover:text-slate-300 hover:bg-slate-700/40'
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          isDone ? 'fa-circle-check' : 'fa-circle'
                        } text-sm`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
});

export default SpineExerciseList;

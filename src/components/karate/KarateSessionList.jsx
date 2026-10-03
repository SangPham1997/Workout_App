import { useState, useMemo } from 'react';

export default function KarateSessionList({
  sessions,
  currentIndex,
  completedIds = [],
  onSelect,
}) {
  // Nhóm theo tuần (lộ trình tuyến tính 4 tuần) — mặc định mở nhóm chứa buổi đang chọn
  const groupedByWeek = useMemo(() => {
    const acc = {};
    sessions.forEach((s, i) => {
      const wk = `Tuần ${s.week ?? '?'}`;
      if (!acc[wk]) acc[wk] = [];
      acc[wk].push({ ...s, _idx: i });
    });
    return acc;
  }, [sessions]);

  const currentWeekKey = `Tuần ${sessions[currentIndex]?.week ?? 1}`;
  const [expandedCategories, setExpandedCategories] = useState({});
  const isOpen = (cat) =>
    expandedCategories[cat] !== undefined
      ? expandedCategories[cat]
      : cat === currentWeekKey; // tự mở nhóm của buổi đang tập

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !(prev[cat] !== undefined ? prev[cat] : cat === currentWeekKey),
    }));
  };

  const doneCount = completedIds.length;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-hand-fist text-rose-400"></i>
          Lộ trình Karate
        </h3>
        <span className="text-xs text-slate-500">
          {doneCount}/{sessions.length} buổi
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[600px]">
        {Object.keys(groupedByWeek).map((cat) => {
          const list = groupedByWeek[cat];
          const doneInCat = list.filter((s) =>
            completedIds.includes(s.id)
          ).length;
          return (
          <div key={cat} className="border border-slate-700/50 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
              onClick={() => toggleCategory(cat)}
            >
              <span className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                {cat}
                {doneInCat === list.length && (
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                )}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  {doneInCat}/{list.length}
                </span>
                <i
                  className={`fa-solid fa-chevron-${
                    isOpen(cat) ? 'up' : 'down'
                  } text-slate-400 text-xs`}
                />
              </span>
            </div>

            {isOpen(cat) && (
              <div className="divide-y divide-slate-700/30">
                {list.map((s) => {
                  const idx = s._idx;
                  const isActive = currentIndex === idx;
                  const isDone = completedIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => onSelect(idx)}
                      className={`p-3 cursor-pointer transition flex flex-col gap-1 ${
                        isActive
                          ? 'bg-rose-900/20 border-l-4 border-rose-500'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-500/90 text-white'
                                : isActive
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {isDone ? (
                              <i className="fa-solid fa-check"></i>
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? 'text-white'
                                : isDone
                                ? 'text-slate-500 line-through decoration-slate-600'
                                : 'text-slate-300'
                            }`}
                          >
                            {s.name}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {s.durationDisplay}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-10">
                        {s.subName} • {cat}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
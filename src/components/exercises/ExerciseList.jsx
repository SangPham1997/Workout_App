import { useMemo, useState, useCallback } from 'react';
import ExerciseItem from './ExerciseItem';

/*
  ExerciseList — danh sách bài tập nhóm theo tuần (từ Sanity Program)
  - Nhận `exercises` là mảng phẳng của tuần hiện tại
  - Nhận `currentWeekNumber` để hiển thị label
  - Checkbox ✓ ở HEADER TUẦN: tick khi user đánh dấu tuần đã xong
*/
export default function ExerciseList({
  exercises,
  currentId,
  onSelect,
  completedWeeks = [],
  onToggleWeekComplete,
  currentWeekNumber = 1,
}) {
  const [expanded, setExpanded] = useState(true); // Mặc định mở rộng

  // Tra index theo id — O(1)
  const indexById = useMemo(() => {
    const map = new Map();
    exercises.forEach((ex, i) => map.set(ex.id, i));
    return map;
  }, [exercises]);

  // Set để tra O(1)
  const completedSet = useMemo(
    () => new Set(completedWeeks),
    [completedWeeks]
  );

  const isCompleted = completedSet.has(currentWeekNumber);

  const toggleWeek = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleToggleCheck = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleWeekComplete?.(currentWeekNumber);
    },
    [onToggleWeekComplete, currentWeekNumber]
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-list-check text-emerald-400"></i>
          Lộ trình tập
        </h3>
        <span className="text-xs text-slate-500">{exercises.length} bài</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700">
        <div
          className={`border rounded-xl overflow-hidden transition ${
            isCompleted
              ? 'border-emerald-500/50 bg-emerald-900/5'
              : 'border-slate-700/50'
          }`}
        >
          {/* Header tuần */}
          <div
            className="flex items-center justify-between px-4 py-2.5 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
            onClick={toggleWeek}
          >
            <div className="flex items-center gap-2 min-w-0">
              <i
                className={`fa-solid ${
                  isCompleted
                    ? 'fa-circle-check text-emerald-400'
                    : 'fa-calendar-week text-emerald-400'
                }`}
              ></i>
              <span
                className={`font-semibold text-sm truncate ${
                  isCompleted ? 'text-emerald-300' : 'text-slate-200'
                }`}
              >
                Tuần {currentWeekNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Nút check "đã xong" */}
              <button
                type="button"
                onClick={handleToggleCheck}
                aria-label={
                  isCompleted
                    ? 'Bỏ đánh dấu tuần đã xong'
                    : 'Đánh dấu tuần đã xong'
                }
                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                  isCompleted
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
                }`}
              >
                <i className="fa-solid fa-check text-[10px]"></i>
              </button>

              <i
                className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-slate-400 text-xs`}
              />
            </div>
          </div>

          {/* Danh sách bài */}
          {expanded && (
            <div className="divide-y divide-slate-700/30">
              {exercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  selectedId={currentId}
                  onSelect={onSelect}
                  idx={indexById.get(ex.id) ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState, useCallback } from 'react';
import ExerciseItem from './ExerciseItem';
import { weekLabels } from '../../data/exercises';

/*
  ExerciseList — danh sách bài tập nhóm theo tuần
  - Checkbox ✓ ở HEADER TUẦN: tick khi user đánh dấu tuần đã xong
  - Không đếm progress, không phụ thuộc workoutProgram
*/
export default function ExerciseList({
  exercises,
  currentIndex,
  onSelect,
  completedWeeks = [],
  onToggleWeekComplete,
}) {
  const [expandedWeeks, setExpandedWeeks] = useState({});

  // Nhóm bài theo week
  const grouped = useMemo(() => {
    const acc = {};
    for (const ex of exercises) {
      const week = ex.week ?? 0;
      const key = `week-${week}`;
      (acc[key] ||= []).push(ex);
    }
    return acc;
  }, [exercises]);

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

  const toggleWeek = useCallback((weekKey) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekKey]: !prev[weekKey] }));
  }, []);

  const handleToggleCheck = useCallback(
    (e, weekNum) => {
      e.stopPropagation(); // không trigger expand/collapse
      onToggleWeekComplete?.(weekNum);
    },
    [onToggleWeekComplete]
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
        {Object.keys(grouped).map((weekKey) => {
          const weekNum = parseInt(weekKey.split('-')[1], 10);
          const weekLabel = weekLabels[weekNum] || `Tuần ${weekNum}`;
          const isCompleted = completedSet.has(weekNum);

          return (
            <div
              key={weekKey}
              className={`border rounded-xl overflow-hidden transition ${
                isCompleted
                  ? 'border-emerald-500/50 bg-emerald-900/5'
                  : 'border-slate-700/50'
              }`}
            >
              {/* Header tuần */}
              <div
                className="flex items-center justify-between px-4 py-2.5 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
                onClick={() => toggleWeek(weekKey)}
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
                    Tuần {weekNum}: {weekLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Nút check "đã xong" */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleCheck(e, weekNum)}
                    aria-label={
                      isCompleted ? 'Bỏ đánh dấu tuần đã xong' : 'Đánh dấu tuần đã xong'
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isCompleted ? 'fa-check' : 'fa-check'
                      } text-[10px]`}
                    ></i>
                  </button>

                  <i
                    className={`fa-solid fa-chevron-${
                      expandedWeeks[weekKey] ? 'up' : 'down'
                    } text-slate-400 text-xs`}
                  />
                </div>
              </div>

              {/* Danh sách bài — không có checkbox */}
              {expandedWeeks[weekKey] && (
                <div className="divide-y divide-slate-700/30">
                  {grouped[weekKey].map((ex) => (
                    <ExerciseItem
                      key={ex.id}
                      exercise={ex}
                      currentIndex={currentIndex}
                      onSelect={onSelect}
                      idx={indexById.get(ex.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useMemo, useState } from 'react';
import ExerciseItem from './ExerciseItem';

/*
  ExerciseList — tối ưu hiệu năng:
  - useMemo cho việc nhóm bài theo category (tránh reduce lại mỗi lần re-render).
  - Map index O(1) thay vì exercises.indexOf(ex) O(n) cho mỗi item.
  - React.memo ở ExerciseItem + callback ổn định → chỉ item thay đổi active mới re-render.
*/
export default function ExerciseList({
  exercises,
  currentIndex,
  onSelect,
}) {
  const [expandedCategories, setExpandedCategories] = useState({});

  // Nhóm bài theo category — chỉ tính lại khi danh sách bài đổi.
  const grouped = useMemo(() => {
    const acc = {};
    for (const ex of exercises) {
      const cat = ex.category || 'Khác';
      (acc[cat] ||= []).push(ex);
    }
    return acc;
  }, [exercises]);

  // Tra index theo id — O(1) thay vì indexOf O(n).
  const indexById = useMemo(() => {
    const map = new Map();
    exercises.forEach((ex, i) => map.set(ex.id, i));
    return map;
  }, [exercises]);

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

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
        {Object.keys(grouped).map(cat => (
          <div key={cat} className="border border-slate-700/50 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
              onClick={() => toggleCategory(cat)}
            >
              <span className="font-semibold text-sm text-slate-200">{cat}</span>
              <i className={`fa-solid fa-chevron-${expandedCategories[cat] ? 'up' : 'down'} text-slate-400 text-xs`} />
            </div>
            {expandedCategories[cat] && (
              <div className="divide-y divide-slate-700/30">
                {grouped[cat].map((ex) => {
                  return (
                    <ExerciseItem
                      key={ex.id}
                      exercise={ex}
                      currentIndex={currentIndex}
                      onSelect={onSelect}
                      idx={indexById.get(ex.id)} />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
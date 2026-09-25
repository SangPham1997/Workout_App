import { useState } from 'react';
import ExerciseItem from './ExerciseItem';

export default function ExerciseList({
  exercises,
  currentIndex,
  completedIds = [],
  onSelect,
  onUndo,
}) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const grouped = exercises.reduce((acc, ex) => {
    const cat = ex.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ex);
    return acc;
  }, {});

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
        <span className="text-xs text-slate-500 tabular-nums">
          <span className="text-emerald-400 font-bold">{completedIds.length}</span>/{exercises.length} bài
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700">
        {Object.keys(grouped).map(cat => {
          const doneInCat = grouped[cat].filter((e) => completedIds.includes(e.id)).length;
          return (
            <div key={cat} className="border border-slate-700/50 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-2 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
                onClick={() => toggleCategory(cat)}
              >
                <span className="font-semibold text-sm text-slate-200">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tabular-nums ${doneInCat === grouped[cat].length ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {doneInCat}/{grouped[cat].length}
                  </span>
                  <i className={`fa-solid fa-chevron-${expandedCategories[cat] ? 'up' : 'down'} text-slate-400 text-xs`} />
                </div>
              </div>
              {expandedCategories[cat] && (
                <div className="divide-y divide-slate-700/30">
                  {grouped[cat].map((ex) => {
                    const idx = exercises.indexOf(ex);
                    return (
                      <ExerciseItem
                        key={ex.id}
                        exercise={ex}
                        currentIndex={currentIndex}
                        completedIds={completedIds}
                        onSelect={onSelect}
                        onUndo={onUndo}
                        idx={idx} />
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

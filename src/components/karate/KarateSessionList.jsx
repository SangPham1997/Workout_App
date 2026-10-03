import { useState } from 'react';

export default function KarateSessionList({ sessions, currentIndex, onSelect }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const grouped = sessions.reduce((acc, s) => {
    const cat = s.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-hand-fist text-rose-400"></i>
          Lộ trình Karate
        </h3>
        <span className="text-xs text-slate-500">{sessions.length} buổi</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-2 max-h-[600px]">
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="border border-slate-700/50 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2 bg-slate-800/60 cursor-pointer hover:bg-slate-700/60 transition"
              onClick={() => toggleCategory(cat)}
            >
              <span className="font-semibold text-sm text-slate-200">{cat}</span>
              <i
                className={`fa-solid fa-chevron-${
                  expandedCategories[cat] ? 'up' : 'down'
                } text-slate-400 text-xs`}
              />
            </div>

            {expandedCategories[cat] && (
              <div className="divide-y divide-slate-700/30">
                {grouped[cat].map((s) => {
                  const idx = sessions.indexOf(s);
                  const isActive = currentIndex === idx;
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
                              isActive
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isActive ? 'text-white' : 'text-slate-300'
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
                        {s.subName} • Tuần {s.week}
                      </div>
                    </div>
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
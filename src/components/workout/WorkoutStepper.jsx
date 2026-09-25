/*
  WorkoutStepper — thanh 11 bước của lộ trình với 3 trạng thái:
  - done    (đã hoàn thành): nền emerald + dấu tích
  - active  (đang xem/tập): viền emerald sáng + số thứ tự
  - pending (chưa tới): xám nhạt
  Click vào bước để nhảy tới bài đó. Tự scroll bước active vào tầm nhìn.
*/
import { useEffect, useRef } from 'react';

export default function WorkoutStepper({ exercises, currentIndex, completedIds, onSelect }) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current[currentIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentIndex]);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Tiến độ buổi tập
        </span>
        <span className="text-[11px] font-semibold text-emerald-400 tabular-nums">
          {completedIds.length}/{exercises.length} bài
        </span>
      </div>
      {/* progress bar tổng */}
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
          style={{ width: `${(completedIds.length / Math.max(1, exercises.length)) * 100}%` }}
        />
      </div>

      <ol className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin" aria-label="Các bước của lộ trình">
        {exercises.map((ex, i) => {
          const done = completedIds.includes(ex.id);
          const active = i === currentIndex;
          return (
            <li key={ex.id} className="flex items-center shrink-0">
              {i > 0 && (
                <span className={`w-3 md:w-5 h-0.5 rounded ${done || active ? 'bg-emerald-500/60' : 'bg-slate-700'}`} />
              )}
              <button
                ref={(el) => (refs.current[i] = el)}
                onClick={() => onSelect(i)}
                title={`${i + 1}. ${ex.name}${done ? ' — đã hoàn thành' : ''}`}
                aria-current={active ? 'step' : undefined}
                className={[
                  'w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition transform active:scale-90 border',
                  done
                    ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : active
                      ? 'bg-slate-900 text-emerald-300 border-emerald-400 ring-2 ring-emerald-500/40 scale-110'
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300 hover:border-slate-500',
                ].join(' ')}
              >
                {done ? <i className="fa-solid fa-check" /> : i + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

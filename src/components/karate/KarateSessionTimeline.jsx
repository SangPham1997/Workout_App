import { memo } from 'react';

const KIND_ICONS = {
  warmup: 'fa-temperature-low',
  drill: 'fa-bullseye',
  practice: 'fa-repeat',
  cooldown: 'fa-spa',
};

const formatTime = (seconds) => {
  const safe = Math.max(0, Math.round(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const KarateSessionTimeline = memo(function KarateSessionTimeline({
  blocks = [],
  activeIndex = 0,
  onSelect,
  canSeek = false,
}) {
  if (!blocks.length) return null;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide flex items-center gap-2">
          <i className="fa-solid fa-timeline" aria-hidden="true" />
          Cấu trúc buổi tập
        </h4>
        <span className="text-[10px] text-slate-500">
          {canSeek ? 'Click để tua video' : 'Dùng làm checklist'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {blocks.map((block, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${block.label}-${block.start}`}
              type="button"
              onClick={() => onSelect?.(index)}
              aria-pressed={isActive}
              className={`text-left rounded-xl border px-2.5 py-2 transition ${
                isActive
                  ? 'bg-rose-500/15 border-rose-500/60'
                  : 'bg-slate-900/40 border-slate-700/50 hover:border-rose-500/30 hover:bg-slate-900/70'
              }`}
            >
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <i
                  className={`fa-solid ${
                    KIND_ICONS[block.kind] ?? 'fa-circle'
                  } text-[9px]`}
                  aria-hidden="true"
                />
                {formatTime(block.start)}
              </span>
              <span
                className={`block text-[11px] font-semibold leading-tight mt-0.5 ${
                  isActive ? 'text-rose-200' : 'text-slate-300'
                }`}
              >
                {block.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default KarateSessionTimeline;

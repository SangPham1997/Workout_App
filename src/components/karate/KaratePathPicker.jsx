import { memo, useMemo } from 'react';

const KaratePathPicker = memo(function KaratePathPicker({
  tracks,
  sessions,
  completedIds,
  activeTrackId,
  onChange,
}) {
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const stats = useMemo(() => {
    const map = new Map();
    for (const track of tracks) {
      map.set(track.id, { total: 0, done: 0 });
    }
    for (const session of sessions) {
      const entry = map.get(session.track);
      if (!entry) continue;
      entry.total += 1;
      if (completedSet.has(session.id)) entry.done += 1;
    }
    return map;
  }, [tracks, sessions, completedSet]);

  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
      role="tablist"
      aria-label="Lộ trình Karate"
    >
      {tracks.map((track) => {
        const entry = stats.get(track.id) ?? { total: 0, done: 0 };
        const percent =
          entry.total > 0 ? Math.round((entry.done / entry.total) * 100) : 0;
        const isActive = track.id === activeTrackId;

        return (
          <button
            key={track.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(track.id)}
            className={`flex-shrink-0 sm:flex-1 min-w-[155px] text-left rounded-2xl border p-3 transition ${
              isActive
                ? 'bg-rose-500/15 border-rose-500/60 shadow-[0_0_14px_rgba(244,63,94,0.12)]'
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  isActive
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-700/70 text-slate-400'
                }`}
              >
                <i className={`fa-solid ${track.icon}`} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-sm font-bold truncate ${
                    isActive ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {track.label}
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  {track.vi}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 text-[10px]">
              <span className="text-slate-500 font-mono">
                {entry.done}/{entry.total} buổi
              </span>
              <span className={isActive ? 'text-rose-300' : 'text-slate-500'}>
                {percent}%
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-700/70 overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  isActive ? 'bg-rose-400' : 'bg-slate-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default KaratePathPicker;

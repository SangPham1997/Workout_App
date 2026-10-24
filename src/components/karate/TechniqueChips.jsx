import { useEffect, useMemo, useState } from 'react';
import { getTechnique } from '../../data/karate';
import { KARATE_TRACK_MAP } from '../../data/karate/tracks';

export default function TechniqueChips({ techniqueIds = [] }) {
  const [selected, setSelected] = useState(null);

  const techniques = useMemo(
    () =>
      techniqueIds
        .map((id) => getTechnique(id))
        .filter(Boolean),
    [techniqueIds]
  );

  useEffect(() => {
    if (!selected) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  if (!techniques.length) return null;

  const track = selected ? KARATE_TRACK_MAP[selected.track] : null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mr-0.5">
          Kỹ thuật
        </span>
        {techniques.map((technique) => (
          <button
            key={technique.id}
            type="button"
            onClick={() => setSelected(technique)}
            className="inline-flex items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-200 hover:bg-rose-500/20 hover:border-rose-500/40 transition"
          >
            <i className="fa-solid fa-circle-info text-[9px]" aria-hidden="true" />
            {technique.name}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="technique-modal-title"
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">
                  {track?.label} · {track?.vi}
                </p>
                <h3
                  id="technique-modal-title"
                  className="text-lg font-bold text-white mt-0.5"
                >
                  {selected.name}
                </h3>
                <p className="text-xs text-slate-400">{selected.vi}</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setSelected(null)}
                aria-label="Đóng"
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center flex-shrink-0"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-check" aria-hidden="true" />
                Điểm cần nhớ
              </h4>
              <ul className="mt-1.5 space-y-1">
                {selected.cues.map((cue) => (
                  <li key={cue} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-emerald-400">•</span>
                    {cue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                Lỗi thường gặp
              </h4>
              <ul className="mt-1.5 space-y-1">
                {selected.mistakes.map((mistake) => (
                  <li key={mistake} className="text-xs text-slate-400 flex gap-2">
                    <span className="text-amber-400">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
              Tập chậm trước gương, ưu tiên đúng đường đi của kỹ thuật trước khi tăng tốc.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

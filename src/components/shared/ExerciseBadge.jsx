import { figureRegistry } from '../simulator/figureRegistry';

/*
  ExerciseBadge — thumbnail SVG nhỏ dùng trong danh sách bài tập,
  vẽ lại đúng hình của bài (dùng chung SvgFigures với simulator).
*/
export default function ExerciseBadge({ type, active = false }) {
  const Figure = figureRegistry[type];
  if (!Figure) return null;
  return (
    <div
      className={`shrink-0 rounded-lg border overflow-hidden ${
        active
          ? 'bg-emerald-500/15 border-emerald-500/50'
          : 'bg-slate-800/60 border-slate-700/60'
      }`}
      style={{ width: 34, height: 34 }}
      aria-hidden="true"
    >
      <Figure
        primary={active ? '#34d399' : '#94a3b8'}
        secondary={active ? '#059669' : '#64748b'}
      />
    </div>
  );
}

import ExerciseBadge from '../shared/ExerciseBadge';

/*
  ExerciseItem — dòng bài tập trong danh sách, giờ có trạng thái tiến độ:
  - done: dấu tích xanh + tên gạch nhẹ (click vào dấu tick để bỏ đánh dấu — undo)
  - active: viền trái emerald như cũ
*/
export default function ExerciseItem({ exercise, currentIndex, completedIds, onSelect, idx, onUndo }) {
  const isActive = currentIndex === idx;
  const isDone = completedIds?.includes(exercise.id);

  return (
    <div
      className={`p-3 transition cursor-pointer flex items-center gap-2 ${
        isActive
          ? 'bg-emerald-900/20 border-l-4 border-emerald-500'
          : 'hover:bg-slate-800/30 border-l-4 border-transparent'
      }`}
      onClick={() => onSelect(idx)}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
            isDone
              ? 'bg-emerald-500 text-slate-900'
              : isActive
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/60'
                : 'bg-slate-700 text-slate-400'
          }`}
        >
          {isDone ? <i className="fa-solid fa-check text-[10px]" /> : idx + 1}
        </div>
        {/* thumbnail SVG minh họa động tác */}
        <ExerciseBadge type={exercise.type} active={isActive} />
        <span
          className={`text-sm font-medium truncate ${
            isDone ? 'text-slate-500 line-through decoration-emerald-600/60' : isActive ? 'text-white' : 'text-slate-300'
          }`}
        >
          {exercise.name}
        </span>
      </div>

      {isDone && (
        <button
          title="Bỏ đánh dấu hoàn thành"
          aria-label="Bỏ đánh dấu hoàn thành"
          onClick={(e) => { e.stopPropagation(); onUndo?.(exercise.id); }}
          className="shrink-0 w-6 h-6 rounded-full text-slate-500 hover:text-red-400 hover:bg-slate-700/60 transition transform active:scale-90 flex items-center justify-center"
        >
          <i className="fa-solid fa-rotate-left text-[10px]" />
        </button>
      )}
      <span className="text-xs text-slate-500 ml-1 shrink-0">{exercise.duration}s</span>
    </div>
  );
}

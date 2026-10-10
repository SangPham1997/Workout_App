import { memo, useCallback } from 'react';

/*
  ExerciseItem — hiển thị 1 bài tập trong danh sách
  - Hiển thị số reps nếu có (VD: "8 reps", "2 hiệp")
  - Hiển thị thời gian nếu không có reps (VD: "45s")
  - Nếu có cả 2 (VD: "8 reps × 30s"), hiển thị gọn
*/
const ExerciseItem = memo(function ExerciseItem({
  exercise,
  currentIndex,
  onSelect,
  idx,
}) {
  const isActive = currentIndex === idx;

  const handleClick = useCallback(() => {
    onSelect(idx);
  }, [onSelect, idx]);

  // Format hiển thị reps/thời gian
  const buildMetaLabel = () => {
    const parts = [];

    // Ưu tiên reps nếu có
    if (exercise.reps != null && exercise.reps > 0) {
      parts.push(`${exercise.reps} reps`);
    }

    // Thời gian (chỉ hiện khi có reps hoặc measurement = time)
    if (exercise.measurement === 'time' && exercise.duration) {
      parts.push(`${exercise.duration}s`);
    } else if (exercise.duration && parts.length === 0) {
      // Không có reps → chỉ hiện duration
      parts.push(`${exercise.duration}s`);
    }

    return parts.join(' × ');
  };

  const metaLabel = buildMetaLabel();

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left p-3 transition cursor-pointer flex items-center gap-3 ${
        isActive
          ? 'bg-emerald-900/20 border-l-4 border-emerald-500'
          : 'hover:bg-slate-800/30'
      }`}
    >
      {/* Số thứ tự */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isActive
            ? 'bg-emerald-500 text-slate-900'
            : 'bg-slate-700 text-slate-400'
        }`}
      >
        {idx + 1}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium truncate ${
              isActive ? 'text-white' : 'text-slate-300'
            }`}
          >
            {exercise.name}
          </span>
          {isActive && (
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">
              Đang tập
            </span>
          )}
        </div>
        {exercise.subName && (
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5 truncate">
            {exercise.subName}
          </div>
        )}
      </div>

      {/* Meta: reps + duration */}
      {metaLabel && (
        <span
          className={`text-xs font-mono whitespace-nowrap flex-shrink-0 ${
            isActive ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          {metaLabel}
        </span>
      )}
    </button>
  );
});

export default ExerciseItem;
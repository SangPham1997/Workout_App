import { useMemo } from 'react';
import { mapSanityToLegacyExercise } from '../../utils/sanityExerciseMapper';

/*
  ExerciseItem — hiển thị 1 bài tập trong danh sách
  Hỗ trợ cả Legacy format (local data) và Sanity format (mới)
*/
const ExerciseItem = ({ exercise, selectedId, onSelect, idx }) => {
  const isActive = selectedId === exercise.id;

  const handleClick = () => {
    onSelect(exercise.id);
  };

  // Chuẩn hóa exercise data (hỗ trợ cả 2 format)
  const normalized = useMemo(() => {
    // Nếu đã là legacy format (có mode, duration, sets)
    if ('mode' in exercise && 'duration' in exercise) {
      return exercise;
    }
    // Nếu là Sanity format (có exerciseType, defaultSets, defaultReps)
    return mapSanityToLegacyExercise(exercise);
  }, [exercise]);

  // Build meta label từ schema
  const getMetaLabel = (ex) => {
    const sets = ex.sets ?? 1;

    if (ex.mode === 'reps' && ex.reps != null) {
      return `${sets} hiệp · ${ex.reps} lần`;
    }

    return `${sets} hiệp · ${ex.duration}s`;
  };

  const metaLabel = getMetaLabel(normalized);

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
            {normalized.name}
          </span>
          {isActive && (
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">
              Đang tập
            </span>
          )}
        </div>
        {normalized.subName && (
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5 truncate">
            {normalized.subName}
          </div>
        )}
      </div>

      {/* Meta: sets × reps/duration */}
      <span
        className={`text-xs font-mono whitespace-nowrap flex-shrink-0 ${
          isActive ? 'text-emerald-400' : 'text-slate-500'
        }`}
      >
        {metaLabel}
      </span>
    </button>
  );
};

export default ExerciseItem;
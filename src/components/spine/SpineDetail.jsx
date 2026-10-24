import { memo, useMemo } from 'react';
import { getVideoEmbedUrl } from '../shared/getVideoEmbedUrl';

const LEVEL_LABELS = {
  1: 'Cấp 1 · nhẹ',
  2: 'Cấp 2 · vừa',
};

const BAR_LABELS = {
  high: 'Xà cao',
  low: 'Xà thấp',
  none: 'Không cần xà',
};

const SpineDetail = memo(function SpineDetail({
  exercise,
  isCompleted,
  onToggleComplete,
}) {
  const embedUrl = useMemo(
    () =>
      exercise.videoUrl
        ? getVideoEmbedUrl(exercise.videoUrl, {
            autoplay: false,
            mute: true,
            loop: false,
            controls: true,
          })
        : '',
    [exercise.videoUrl]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Video nếu có; chưa có thì dùng card hướng dẫn gọn */}
      {embedUrl ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700/50 bg-black">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={exercise.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-sky-500/25 bg-sky-950/20 px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-stopwatch" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-sky-200">
              Tập theo mô tả + timer
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bài này chưa cần video. Đọc hướng dẫn, bấm timer và giữ đúng biên độ.
            </p>
          </div>
        </div>
      )}

      {/* Thông tin bài */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-sky-400 font-bold">
              {exercise.subName}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
              {exercise.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {exercise.target}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleComplete(exercise.id)}
            aria-pressed={isCompleted}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              isCompleted
                ? 'bg-sky-500 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <i
              className={`fa-solid ${
                isCompleted ? 'fa-circle-check' : 'fa-circle'
              } text-xs`}
              aria-hidden="true"
            />
            {isCompleted ? 'Đã tập' : 'Đánh dấu'}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300">
            <i className="fa-solid fa-signal text-sky-400 text-[10px]" aria-hidden="true" />
            {LEVEL_LABELS[exercise.level]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300">
            <i className="fa-solid fa-toolbox text-sky-400 text-[10px]" aria-hidden="true" />
            {BAR_LABELS[exercise.bar]} · {exercise.equipment}
          </span>
          {exercise.spineFocus?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-[11px] text-sky-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-3">
          {exercise.guide}
        </p>
      </div>

      {/* An toàn */}
      {exercise.safety && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 flex items-start gap-2.5">
          <i
            className="fa-solid fa-shield-heart text-amber-400 text-sm mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Lưu ý an toàn
            </p>
            <p className="text-xs text-amber-100/80 leading-relaxed mt-1">
              {exercise.safety}
            </p>
          </div>
        </div>
      )}

      {/* Regression / progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-down-short-wide" aria-hidden="true" />
            Dễ hơn
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
            {exercise.regression}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-up-short-wide" aria-hidden="true" />
            Tiến bộ
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
            {exercise.progression}
          </p>
        </div>
      </div>
    </div>
  );
});

export default SpineDetail;

import { memo, useMemo, useState } from 'react';
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
  // Gắn trạng thái video với đúng exercise.id: đổi bài là tự coi như chưa tải,
  // không cần remount component bằng key (tránh lỗi stack của React 19).
  const [videoState, setVideoState] = useState({
    id: null,
    loaded: false,
    failed: false,
  });
  const isCurrentVideo = videoState.id === exercise.id;
  const videoLoaded = isCurrentVideo && videoState.loaded;
  const videoFailed = isCurrentVideo && videoState.failed;

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

  const videoId = useMemo(() => {
    const match = exercise.videoUrl?.match(
      /(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/
    );
    return match?.[1] ?? '';
  }, [exercise.videoUrl]);

  const posterUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : '';

  return (
    <div className="flex flex-col gap-4">
      {/* Video nếu có; lỗi tải thì hiện fallback + link YouTube */}
      {embedUrl && !videoFailed ? (
        <div className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-700/50 bg-black">
          {posterUrl && !videoLoaded && (
            <>
              <img
                src={posterUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950/25 text-white pointer-events-none">
                <i className="fa-solid fa-circle-play text-4xl text-white/90" aria-hidden="true" />
                <span className="text-[11px] font-medium text-white/80">Đang tải video…</span>
              </div>
            </>
          )}
          <iframe
            className={`relative w-full h-full transition-opacity duration-300 ${
              videoLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            src={embedUrl}
            title={exercise.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={() =>
              setVideoState({ id: exercise.id, loaded: true, failed: false })
            }
            onError={() =>
              setVideoState({ id: exercise.id, loaded: false, failed: true })
            }
          />
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg transition hover:bg-sky-500"
          >
            <i className="fa-brands fa-youtube" aria-hidden="true" />
            Mở trên YouTube
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-sky-500/25 bg-sky-950/20 px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center flex-shrink-0">
            <i
              className={`fa-solid ${
                videoFailed ? 'fa-video-slash' : 'fa-stopwatch'
              }`}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-sky-200">
              {videoFailed ? 'Video không tải được' : 'Tập theo mô tả + timer'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {videoFailed
                ? 'Mở liên kết YouTube bên dưới hoặc làm theo hướng dẫn trong bài.'
                : 'Đọc hướng dẫn, bấm timer và giữ đúng biên độ.'}
            </p>
          </div>
          {exercise.videoUrl && (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-bold text-slate-900 hover:bg-sky-400 transition"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true" />
              YouTube
            </a>
          )}
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

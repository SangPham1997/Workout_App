import { useState, useMemo, useCallback, memo } from 'react';
import { getVideoEmbedUrl } from '../shared/getVideoEmbedUrl';
import KarateSessionTimeline from './KarateSessionTimeline';
import TechniqueChips from './TechniqueChips';

const EXERCISE_ICONS = {
  'Đấm': 'fa-hand-fist',
  'Đá': 'fa-shoe-prints',
  'Block': 'fa-shield-halved',
  'Thở': 'fa-wind',
  'Thiền': 'fa-spa',
  'Plank': 'fa-person',
  'Jumping': 'fa-person-running',
  'Burpees': 'fa-fire',
  'Squat': 'fa-person',
};

const VIDEO_OPTIONS = { autoplay: false, mute: true, loop: true, controls: true };

const getExerciseIcon = (name) => {
  for (const [key, icon] of Object.entries(EXERCISE_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'fa-dumbbell';
};

// Lấy exercise đầu tiên có videoUrl
const getFirstVideoExercise = (session) => {
  if (!session?.exercises) return null;
  return session.exercises.find((e) => e.videoUrl) || null;
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

function KarateDetail({
  session,
  isCompleted,
  onToggleComplete,
  note,
  onNoteChange,
  lastPracticedAt,
}) {
  // State nội bộ cho buổi đang xem. Parent render component với
  // key={session.id} nên các state này tự reset khi đổi buổi.
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeBlock, setActiveBlock] = useState(0);
  const [videoStart, setVideoStart] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [noteText, setNoteText] = useState(note || '');

  const fallbackExercise = useMemo(() => getFirstVideoExercise(session), [session]);

  // Video hiện tại: ưu tiên exercise được chọn, fallback exercise đầu tiên có video
  const currentExercise = session?.exercises?.[activeIndex] || null;
  const videoExercise = currentExercise?.videoUrl
    ? currentExercise
    : fallbackExercise;

  const currentVideoUrl = useMemo(
    () =>
      getVideoEmbedUrl(videoExercise?.videoUrl, {
        ...VIDEO_OPTIONS,
        start: videoStart,
      }) || '',
    [videoExercise, videoStart]
  );

  const youtubeHref = useMemo(() => {
    if (!currentVideoUrl) return videoExercise?.videoUrl || '';
    try {
      const url = new URL(currentVideoUrl);
      const id = url.pathname.split('/').filter(Boolean).pop();
      const start = url.searchParams.get('start');
      return `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}` : ''}`;
    } catch {
      return videoExercise?.videoUrl || '';
    }
  }, [currentVideoUrl, videoExercise]);

  const handleNoteBlur = useCallback(() => {
    if (noteText !== note) onNoteChange(noteText);
  }, [noteText, note, onNoteChange]);

  const handleSelectExercise = useCallback(
    (index) => {
      const ex = session.exercises[index];
      if (!ex?.videoUrl) return;
      setActiveIndex(index);
      setActiveBlock(0);
      setVideoStart(0);
      setVideoFailed(false);
    },
    [session.exercises]
  );

  const handleSelectBlock = useCallback(
    (index) => {
      const block = session.blocks?.[index];
      if (!block) return;
      setActiveBlock(index);
      // Chưa có video thì block chỉ là checklist; không đổi URL.
      if (videoExercise?.videoUrl) {
        setVideoStart(block.start);
        setVideoFailed(false);
      }
    },
    [session.blocks, videoExercise]
  );

  if (!session) return null;

  const lastPracticedLabel = formatDate(lastPracticedAt);

  return (
    <div className="flex flex-col gap-5">
      {/* ============ VIDEO CHÍNH ============ */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg bg-black group">
        {currentVideoUrl && !videoFailed ? (
          <iframe
            key={`${session.id}-${currentVideoUrl}`}
            className="w-full h-full"
            src={currentVideoUrl}
            title={videoExercise?.name || session.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/40 px-6 text-center">
            <i
              className={`fa-solid ${
                videoFailed ? 'fa-video-slash text-rose-400/50' : 'fa-stopwatch text-rose-400/40'
              } text-5xl mb-3`}
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-slate-300">
              {videoFailed ? 'Video không tải được' : 'Buổi tập theo hiệp'}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {videoFailed
                ? 'Mở liên kết YouTube bên dưới hoặc làm theo nội dung buổi tập.'
                : 'Chưa có video — làm theo nội dung bên dưới và dùng timeline như checklist.'}
            </p>
          </div>
        )}

        {/* Badge tên bài đang xem */}
        {videoExercise && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur text-rose-300 border border-rose-500/30 shadow-lg max-w-[70%]">
            <i className="fa-solid fa-circle-play text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{videoExercise.name}</span>
          </div>
        )}

        {/* Nút mở YouTube */}
        {youtubeHref && (
          <a
            href={youtubeHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg transition ${
              videoFailed || !currentVideoUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <i className="fa-brands fa-youtube" aria-hidden="true" />
            Mở trên YouTube
          </a>
        )}
      </div>

      {/* ============ TIMELINE ============ */}
      {session.blocks?.length > 0 && (
        <KarateSessionTimeline
          blocks={session.blocks}
          activeIndex={activeBlock}
          onSelect={handleSelectBlock}
          canSeek={Boolean(videoExercise?.videoUrl)}
        />
      )}

      {/* ============ THÔNG TIN BUỔI TẬP ============ */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white">{session.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{session.subName}</p>
          </div>
          <button
            type="button"
            onClick={onToggleComplete}
            aria-pressed={isCompleted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'} text-xs`} aria-hidden="true" />
            {isCompleted ? 'Đã xong' : 'Đánh dấu'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/20">
            <i className="fa-solid fa-clock" aria-hidden="true" />
            {session.durationDisplay}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-crosshairs" aria-hidden="true" />
            {session.target}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-signal" aria-hidden="true" />
            {session.level}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-layer-group" aria-hidden="true" />
            {session.category}
          </span>
          {lastPracticedLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
              Gần nhất: {lastPracticedLabel}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{session.guide}</p>

        <div className="mt-3">
          <TechniqueChips techniqueIds={session.techniques} />
        </div>

        {session.homework && (
          <div className="mt-3 rounded-xl border border-sky-500/25 bg-sky-950/20 px-3.5 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Bài về nhà
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {session.homework}
            </p>
          </div>
        )}
      </div>

      {/* ============ NỘI DUNG BUỔI TẬP ============ */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
            <i className="fa-solid fa-list-check" aria-hidden="true" />
            Nội dung buổi tập
          </h4>
          <span className="text-[10px] text-slate-500 italic">
            {videoExercise ? 'Click để xem video' : 'Làm theo thứ tự'}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {session.exercises.map((ex, i) => {
            const hasVideo = Boolean(ex.videoUrl);
            const isActive = videoExercise === ex;

            return (
              <button
                key={`${ex.name}-${i}`}
                type="button"
                onClick={() => handleSelectExercise(i)}
                disabled={!hasVideo}
                className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all group/ex ${
                  isActive
                    ? 'bg-rose-900/25 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer'
                    : hasVideo
                    ? 'bg-slate-900/50 border-slate-700/40 hover:border-rose-500/40 hover:bg-slate-900/80 cursor-pointer'
                    : 'bg-slate-900/30 border-slate-700/30 cursor-default opacity-80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition ${
                    isActive
                      ? 'bg-rose-500 text-white'
                      : hasVideo
                      ? 'bg-rose-500/15 text-rose-400 group-hover/ex:bg-rose-500/30'
                      : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  <i className={`fa-solid ${getExerciseIcon(ex.name)}`} aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span
                      className={`text-sm font-semibold leading-snug transition ${
                        isActive ? 'text-rose-300' : 'text-white'
                      }`}
                    >
                      {ex.name}
                    </span>
                    <span
                      className={`text-xs font-mono whitespace-nowrap px-2 py-0.5 rounded-md transition ${
                        isActive ? 'bg-rose-500 text-white' : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {ex.work}
                    </span>
                  </div>

                  {ex.note && (
                    <p className="text-xs text-slate-400 leading-relaxed">{ex.note}</p>
                  )}

                  <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                    {hasVideo ? (
                      isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-300 font-bold">
                          <i className="fa-solid fa-circle-play animate-pulse" aria-hidden="true" />
                          Đang xem
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 group-hover/ex:text-rose-400 transition font-medium">
                          <i className="fa-brands fa-youtube" aria-hidden="true" />
                          Click để xem video
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <i className="fa-solid fa-person-walking" aria-hidden="true" />
                        Tập theo mô tả
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {session.circuit && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
            <i className="fa-solid fa-circle-info text-amber-400 text-sm mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Circuit:</strong> {session.circuit.rounds} vòng
              {session.circuit.note && ` • ${session.circuit.note}`}
            </p>
          </div>
        )}
      </div>

      {/* ============ GHI CHÚ BUỔI TẬP ============ */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3 uppercase tracking-wide">
          <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
          Ghi chú buổi tập
        </h4>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={handleNoteBlur}
          rows={3}
          placeholder="Cảm nhận sau buổi tập: kỹ thuật nào chưa ổn, thể lực, chấn thương... (tự lưu khi bạn gõ xong)"
          className="w-full resize-y rounded-xl bg-slate-900/60 border border-slate-700/50 px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition"
        />
      </div>
    </div>
  );
}

export default memo(KarateDetail);

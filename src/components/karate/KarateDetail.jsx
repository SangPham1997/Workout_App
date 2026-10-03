import { useState } from 'react';

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

const getExerciseIcon = (name) => {
  for (const [key, icon] of Object.entries(EXERCISE_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'fa-dumbbell';
};

export default function KarateDetail({
  session,
  isCompleted,
  onToggleComplete,
  note,
  onNoteChange,
}) {
  const [noteState, setNoteState] = useState({ sid: session?.id, text: note || '' });
  const [videoState, setVideoState] = useState({ sid: session?.id, url: session?.videoUrl, failed: false });

  // Đồng bộ state khi đổi buổi (pattern "adjust state during render" của React)
  if (noteState.sid !== session?.id) {
    setNoteState({ sid: session?.id, text: note || '' });
  }
  if (videoState.sid !== session?.id || videoState.url !== session?.videoUrl) {
    setVideoState({ sid: session?.id, url: session?.videoUrl, failed: false });
  }

  if (!session) return null;

  const localNote = noteState.text;
  const videoError = videoState.failed;

  const handleNoteBlur = () => {
    if (localNote !== note) onNoteChange(localNote);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* VIDEO — iframe + nút fallback mở YouTube khi lỗi/chết link */}
      {session.videoUrl ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg bg-black group">
          {!videoError && (
            <iframe
              className="w-full h-full"
              src={session.videoUrl}
              title={session.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onError={() => setVideoState((v) => ({ ...v, failed: true }))}
            />
          )}
          {videoError && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800/60 gap-3">
              <i className="fa-solid fa-video-slash text-4xl text-rose-400/50"></i>
              <p className="text-sm">Video không tải được</p>
            </div>
          )}
          {/* Nút fallback: hiện khi hover, bắt buộc khi lỗi */}
          <a
            href={session.videoUrl.replace('/embed/', '/watch?v=')}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg transition ${
              videoError ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <i className="fa-brands fa-youtube"></i>
            Mở trên YouTube
          </a>
        </div>
      ) : (
        <div className="aspect-video rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-slate-500 bg-slate-800/40">
          <i className="fa-solid fa-hand-fist text-6xl text-rose-400/30 mb-2"></i>
          <p className="text-sm">Chưa có video hướng dẫn</p>
        </div>
      )}

      {/* THÔNG TIN BUỔI TẬP */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xl font-bold text-white">{session.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{session.subName}</p>
          </div>
          <button
            onClick={onToggleComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <i
              className={`fa-solid ${
                isCompleted ? 'fa-circle-check' : 'fa-circle'
              } text-xs`}
            ></i>
            {isCompleted ? 'Đã xong' : 'Đánh dấu'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/20">
            <i className="fa-solid fa-clock"></i>
            {session.durationDisplay}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-crosshairs"></i>
            {session.target}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-signal"></i>
            {session.level}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium">
            <i className="fa-solid fa-layer-group"></i>
            {session.category}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{session.guide}</p>
      </div>

      {/* NỘI DUNG BUỔI TẬP */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-4 uppercase tracking-wide">
          <i className="fa-solid fa-list-check"></i>
          Nội dung buổi tập
        </h4>

        <div className="flex flex-col gap-3">
          {session.exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/40 hover:border-slate-600/60 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center text-sm flex-shrink-0">
                <i className={`fa-solid ${getExerciseIcon(ex.name)}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className="text-sm font-semibold text-white leading-snug">
                    {ex.name}
                  </span>
                  <span className="text-xs font-mono text-rose-400 whitespace-nowrap bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {ex.work}
                  </span>
                </div>
                {ex.note && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ex.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {session.circuit && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
            <i className="fa-solid fa-circle-info text-amber-400 text-sm mt-0.5"></i>
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Circuit:</strong> {session.circuit.rounds} vòng
              {session.circuit.note && ` • ${session.circuit.note}`}
            </p>
          </div>
        )}
      </div>

      {/* GHI CHÚ BUỔI TẬP */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
        <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3 uppercase tracking-wide">
          <i className="fa-solid fa-pen-to-square"></i>
          Ghi chú buổi tập
        </h4>
        <textarea
          value={localNote}
          onChange={(e) => setNoteState({ sid: session.id, text: e.target.value })}
          onBlur={handleNoteBlur}
          rows={3}
          placeholder='Cảm nhận sau buổi tập: kỹ thuật nào chưa ổn, thể lực, chấn thương... (tự lưu khi bạn gõ xong)'
          className="w-full resize-y rounded-xl bg-slate-900/60 border border-slate-700/50 px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition"
        />
      </div>
    </div>
  );
}
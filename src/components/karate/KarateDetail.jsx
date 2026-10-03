import { useState, useEffect } from 'react';

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
  const [localNote, setLocalNote] = useState(note || '');

  useEffect(() => {
    setLocalNote(note || '');
  }, [session?.id, note]);

  if (!session) return null;

  const handleNoteBlur = () => {
    if (localNote !== note) onNoteChange(localNote);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* VIDEO — dùng trực tiếp URL đã ở dạng embed */}
      {session.videoUrl ? (
        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg bg-black">
          <iframe
            className="w-full h-full"
            src={session.videoUrl}
            title={session.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
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
    </div>
  );
}
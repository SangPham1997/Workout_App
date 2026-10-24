import { memo, useEffect, useState } from 'react';

const SpineNote = memo(function SpineNote({ note = '', onSave, exerciseName }) {
  const [text, setText] = useState(note);

  // Không remount bằng key nữa → đồng bộ lại nội dung khi đổi bài.
  useEffect(() => {
    setText(note);
  }, [exerciseName, note]);

  const handleBlur = () => {
    if (text !== note) onSave(text);
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wide flex items-center gap-2">
          <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
          Ghi chú sau bài
        </h3>
        <span className="text-[10px] text-slate-500">Tự lưu khi rời ô</span>
      </div>
      <label className="sr-only" htmlFor="spine-note">
        Ghi chú cho bài {exerciseName}
      </label>
      <textarea
        id="spine-note"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={handleBlur}
        rows={3}
        placeholder="Ví dụ: vai trái hơi căng, treo 20 giây thấy nhẹ hơn, ngày mai giảm còn 15 giây..."
        className="w-full resize-y rounded-xl bg-slate-900/60 border border-slate-700/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition"
      />
    </div>
  );
});

export default SpineNote;

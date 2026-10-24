import { useRef, useState, useEffect } from 'react';
import { todayKey } from '../../utils/dateKey';

export default function BackupMenu({ onExport, onImport }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null); // { type, text }

  // Auto dismiss message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Đã xuất dữ liệu' });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = onImport(text);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Đã nhập ${result.count || 0} thói quen`,
        });
      } else {
        setMessage({ type: 'error', text: `Lỗi: ${result.error}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'Không đọc được file' });
    }

    e.target.value = '';
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
          title="Xuất JSON"
        >
          <i className="fa-solid fa-download text-[10px]"></i>
          Backup
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
          title="Nhập JSON"
        >
          <i className="fa-solid fa-upload text-[10px]"></i>
          Restore
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Inline message */}
      {message && (
        <div
          className={`absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg z-20 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          <i
            className={`fa-solid ${
              message.type === 'success'
                ? 'fa-circle-check'
                : 'fa-circle-exclamation'
            } mr-1.5`}
          ></i>
          {message.text}
        </div>
      )}
    </div>
  );
}
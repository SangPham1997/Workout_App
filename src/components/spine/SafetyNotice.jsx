import { useState } from 'react';

const STORAGE_KEY = 'spine-safety-ack-v1';

const readAcknowledged = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Banner an toàn cho mục Xà. Người dùng xác nhận một lần; có thể mở lại.
 * Nội dung chỉ mang tính hướng dẫn vận động, không phải tư vấn y khoa.
 */
export default function SafetyNotice() {
  const [acknowledged, setAcknowledged] = useState(readAcknowledged);
  const [expanded, setExpanded] = useState(() => !readAcknowledged());

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setExpanded(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage bị chặn → chỉ cần trạng thái trong phiên.
    }
  };

  if (acknowledged && !expanded) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-500/30 bg-sky-900/20 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-sky-200">
          <i className="fa-solid fa-shield-heart text-sky-400" aria-hidden="true" />
          Bạn đã xem hướng dẫn an toàn. Tập trong biên độ không đau.
        </p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex-shrink-0 text-[11px] font-bold text-sky-300 hover:text-sky-200 underline underline-offset-2"
        >
          Xem lại
        </button>
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 md:p-5"
      aria-labelledby="spine-safety-title"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="spine-safety-title" className="text-sm font-bold text-amber-200">
            Trước khi treo xà
          </h2>
          <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
            Đây là vận động nhẹ để thư giãn, không thay thế chẩn đoán hoặc điều trị.
            Dừng ngay nếu đau nhói, tê tay, chóng mặt hoặc đau lan xuống chân.
          </p>

          <ul className="mt-2.5 grid gap-1.5 text-xs text-amber-100/75">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              Dùng ghế hoặc thang thấp để lên xuống, không nhảy lên xà.
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              Không đu người, không kipping; giữ thân dưới ổn định.
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              Người mới nên bắt đầu bằng treo có hỗ trợ (mũi chân chạm ghế).
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              Có tiền sử trật khớp vai, đau cổ/tay, thoát vị đĩa đệm, đang mang thai
              hoặc huyết áp không ổn định: hỏi bác sĩ trước khi tập.
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 transition"
            >
              <i className="fa-solid fa-check" aria-hidden="true" />
              Tôi đã hiểu
            </button>
            <span className="text-[10px] text-amber-200/50">
              Chỉ hiện đầy đủ ở lần đầu.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

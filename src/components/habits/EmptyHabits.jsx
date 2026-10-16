export default function EmptyHabits({ onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5">
        <i className="fa-solid fa-seedling text-emerald-400 text-4xl"></i>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        Bắt đầu hành trình của bạn
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        Tạo thói quen đầu tiên và bắt đầu xây dựng chuỗi ngày thành công. Não
        bộ sẽ thưởng cho bạn mỗi lần hoàn thành!
      </p>
      <button
        type="button"
        onClick={onAddClick}
        className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
      >
        <i className="fa-solid fa-plus"></i>
        Tạo thói quen đầu tiên
      </button>
    </div>
  );
}
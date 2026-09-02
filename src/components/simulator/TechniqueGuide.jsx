export default function TechniqueGuide({ guide }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 border-l-4 border-amber-400 shadow-md">
      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
        <i className="fa-solid fa-lightbulb"></i>
        Kỹ thuật chuẩn
      </h4>
      <p className="text-sm text-slate-300 leading-relaxed">{guide}</p>
    </div>
  );
}
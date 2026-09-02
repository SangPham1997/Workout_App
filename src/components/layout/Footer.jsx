export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>&copy; 2026 HomeCycle Pro. Designed for Fitness.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
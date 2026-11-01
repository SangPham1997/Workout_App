import Header from '../layout/Header'
import Footer from '../layout/Footer'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-slate-400">Đang tải dữ liệu từ Sanity...</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
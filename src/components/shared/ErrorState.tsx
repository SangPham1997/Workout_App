import Header from '../layout/Header'
import Footer from '../layout/Footer'

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-rose-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Không tải được dữ liệu</h2>
          <p className="text-sm text-slate-400 mb-4">{message}</p>
          <button type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold"
          >
            Thử lại
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
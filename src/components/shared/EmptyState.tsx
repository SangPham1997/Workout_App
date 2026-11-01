import Header from '../layout/Header'
import Footer from '../layout/Footer'

export function EmptyState({ message = 'Chưa có dữ liệu' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center text-slate-400">
          <i className="fa-solid fa-inbox text-4xl mb-2" />
          <p>{message}</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
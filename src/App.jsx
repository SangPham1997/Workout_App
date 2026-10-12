import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load pages for code splitting - reduces initial bundle size
const HomePage = lazy(() => import('./pages/HomePage'));
const KaratePage = lazy(() => import('./pages/KaratePage'));

// Suspense fallback component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Đang tải trang...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karate" element={<KaratePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
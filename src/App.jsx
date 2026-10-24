import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Tách bundle theo route: mỗi trang chỉ tải khi được mở.
const HomePage = lazy(() => import('./pages/HomePage'));
const KaratePage = lazy(() => import('./pages/KaratePage'));
const SpineBarPage = lazy(() => import('./pages/SpineBarPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));

function PageFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm"
      role="status"
      aria-live="polite"
    >
      Đang tải...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karate" element={<KaratePage />} />
          <Route path="/xa" element={<SpineBarPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

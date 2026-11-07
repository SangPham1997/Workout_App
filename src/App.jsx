import { lazy, Suspense } from 'react';
import { Toaster } from './components/ui/Toaster';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Prefetcher } from './components/shared/Prefetcher';

// Tách bundle theo route: mỗi trang chỉ tải khi được mở.
const HomePage = lazy(() => import('./pages/HomePage'));
const KaratePage = lazy(() => import('./pages/KaratePage'));
const SpineBarPage = lazy(() => import('./pages/SpineBarPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Prefetcher />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karate" element={<KaratePage />} />
          <Route path="/xa" element={<SpineBarPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

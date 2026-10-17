import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KaratePage from './pages/KaratePage';
import HabitsPage from './pages/HabitsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/karate" element={<KaratePage />} />
        <Route path="/habits" element={<HabitsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
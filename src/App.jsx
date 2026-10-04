import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KaratePage from './pages/KaratePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/karate" element={<KaratePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
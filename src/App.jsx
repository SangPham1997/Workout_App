import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KaratePage from './pages/KaratePage';

function App() {
  return (
    <BrowserRouter>
      {/* Thanh điều hướng giữa 2 chế độ */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-full px-2 py-2 shadow-2xl flex gap-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-5 py-2 rounded-full text-sm font-bold transition ${
              isActive
                ? 'bg-emerald-500 text-slate-900'
                : 'text-slate-300 hover:bg-slate-700'
            }`
          }
        >
          <i className="fa-solid fa-person-biking mr-2"></i>
          HIIT
        </NavLink>
        <NavLink
          to="/karate"
          className={({ isActive }) =>
            `px-5 py-2 rounded-full text-sm font-bold transition ${
              isActive
                ? 'bg-rose-500 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`
          }
        >
          <i className="fa-solid fa-hand-fist mr-2"></i>
          Karate
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/karate" element={<KaratePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
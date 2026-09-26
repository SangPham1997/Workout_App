import { useCallback, useMemo } from 'react';
import {
  useExercises,
  useSelectedIndex,
  useSelectExercise,
  useTimeLeft,
  useIsRunning,
  useIsCompleted,
  useStartTimer,
  usePauseTimer,
  useFullReset,
} from './stores/selectors';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SvgSimulator from './components/simulator/SvgSimulator';
import TimerControl from './components/timer/TimerControl';
import TechniqueGuide from './components/simulator/TechniqueGuide';
import ExerciseList from './components/exercises/ExerciseList';

function App() {
  // Subscribe từng field nhỏ để tránh re-render cả cây khi không cần thiết.
  const exercises = useExercises();
  const selectedIndex = useSelectedIndex();
  const selectExercise = useSelectExercise();
  const timeLeft = useTimeLeft();
  const isRunning = useIsRunning();
  const isCompleted = useIsCompleted();
  const startTimer = useStartTimer();
  const pauseTimer = usePauseTimer();
  const fullReset = useFullReset();

  const selectedExercise = exercises[selectedIndex] || null;

  // Callback ổn định — giúp React.memo ở ExerciseList / ExerciseItem có tác dụng.
  const handleSelectExercise = useCallback(
    (index) => {
      selectExercise(index);
      fullReset();
    },
    [selectExercise, fullReset]
  );

  const handleResetAndStart = useCallback(() => {
    fullReset();
    startTimer();
  }, [fullReset, startTimer]);

  const handlers = useMemo(
    () => ({ onStart: startTimer, onPause: pauseTimer, onReset: fullReset }),
    [startTimer, pauseTimer, fullReset]
  );

  if (!selectedExercise) {
    return <div className="text-white p-4">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-1 min-h-[350px] md:min-h-[420px] flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition duration-700"></div>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-800/80 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang chọn
            </div>
            <SvgSimulator
              exercise={selectedExercise}
              isRunning={isRunning}
            />
            <div className="text-center z-10 mt-2 mb-6 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                {selectedExercise.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
                <i className="fa-solid fa-crosshairs text-emerald-400 text-xs"></i>
                <p className="text-xs md:text-sm font-medium">{selectedExercise.target}</p>
              </div>
            </div>
          </div>

          <TimerControl
            timeLeft={timeLeft}
            isRunning={isRunning}
            total={selectedExercise.duration}
            isCompleted={isCompleted}
            onStart={handlers.onStart}
            onPause={handlers.onPause}
            onReset={handlers.onReset}
            onResetAndStart={handleResetAndStart}
          />

          <TechniqueGuide guide={selectedExercise.guide} />
        </section>

        <section className="lg:col-span-5">
          <ExerciseList
            exercises={exercises}
            currentIndex={selectedIndex}
            onSelect={handleSelectExercise}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
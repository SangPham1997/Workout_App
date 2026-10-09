import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useTimerStore } from '../hooks/useTimerStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TimerControl from '../components/timer/TimerControl';
import TechniqueGuide from '../components/simulator/TechniqueGuide';
import ExerciseList from '../components/exercises/ExerciseList';
import { getVideoEmbedUrl } from '../components/shared/getVideoEmbedUrl';

// Module-level constant to avoid recreating options object on every render
const EMBED_OPTIONS = { autoplay: false, mute: true, loop: true, controls: true };

function HomePage() {
  // Combined Exercise store subscription — single re-render for all exercise state
  const {
    exercises,
    selectedIndex,
    selectExercise,
    // Use getSelectedExercise() which returns stable reference from exercisesById Map
    selectedExercise,
  } = useExerciseStore(
    useShallow((state) => ({
      exercises: state.exercises,
      selectedIndex: state.selectedIndex,
      selectExercise: state.selectExercise,
      selectedExercise: state.getSelectedExercise(),
    }))
  );

  // Combined Timer store subscription
  const {
    timeLeft,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    fullReset,
  } = useTimerStore(
    useShallow((state) => ({
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      isCompleted: state.isCompleted,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
      fullReset: state.fullReset,
    }))
  );

  // Stable embed URL — only recomputes when selectedExercise changes
  const embedUrl = useMemo(
    () => (selectedExercise ? getVideoEmbedUrl(selectedExercise.videoUrl, EMBED_OPTIONS) : ''),
    [selectedExercise]
  );

  // Stable callbacks for ExerciseList memoization
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

  // Early return while loading
  if (!selectedExercise) {
    return <div className="text-white p-4" role="status" aria-live="polite">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 flex flex-col gap-6" aria-label="Khu vực tập luyện chính">
          <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-1 min-h-[350px] md:min-h-[420px] flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
            {/* Indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-800/80 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              Đang chọn
            </div>
            
            {/* Video Wrapper */}
            <div className="w-full flex-1 flex items-center justify-center p-2">
              <iframe
                className="w-full aspect-video rounded-2xl border border-slate-700/50"
                src={embedUrl}
                title={selectedExercise.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="text-center z-10 mt-4 mb-6 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                {selectedExercise.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
                <i className="fa-solid fa-crosshairs text-emerald-400 text-xs" aria-hidden="true"></i>
                <p className="text-xs md:text-sm font-medium">{selectedExercise.target}</p>
              </div>
            </div>
          </div>

          <TimerControl
            timeLeft={timeLeft}
            isRunning={isRunning}
            total={selectedExercise.duration}
            isCompleted={isCompleted}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={fullReset}
            onResetAndStart={handleResetAndStart}
          />

          <TechniqueGuide guide={selectedExercise.guide} />
        </section>

        <section className="lg:col-span-5" aria-label="Danh sách bài tập">
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

export default HomePage;
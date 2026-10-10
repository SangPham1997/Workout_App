import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useTimerStore } from '../hooks/useTimerStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TimerControl from '../components/timer/TimerControl';
import ExerciseList from '../components/exercises/ExerciseList';
import TechniqueGuide from '../components/simulator/TechniqueGuide';
import { getVideoEmbedUrl } from '../components/shared/getVideoEmbedUrl';

// Module-level constant — tránh tạo object mỗi lần render
const EMBED_OPTIONS = {
  autoplay: false,
  mute: true,
  loop: true,
  controls: true,
};

function HomePage() {
  // ===== EXERCISE STORE — gộp 1 subscription =====
  const {
    exercises,
    selectedIndex,
    selectedExercise,
    selectExercise,
    completedWeeks,
    toggleWeekComplete,
  } = useExerciseStore(
    useShallow((state) => ({
      exercises: state.exercises,
      selectedIndex: state.selectedIndex,
      selectedExercise: state.getSelectedExercise(),
      selectExercise: state.selectExercise,
      completedWeeks: state.completedWeeks,
      toggleWeekComplete: state.toggleWeekComplete,
    }))
  );

  // ===== TIMER STORE — gộp 1 subscription =====
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

  // ===== EMBED URL — memo theo selectedExercise =====
  const embedUrl = useMemo(
    () =>
      selectedExercise
        ? getVideoEmbedUrl(selectedExercise.videoUrl, EMBED_OPTIONS)
        : '',
    [selectedExercise]
  );

  // ===== HANDLERS =====
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

  // ===== GUARD =====
  if (!selectedExercise) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div
            className="text-slate-400 text-sm"
            role="status"
            aria-live="polite"
          >
            Đang tải bài tập...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===== CỘT TRÁI ===== */}
        <section
          className="lg:col-span-7 flex flex-col gap-6"
          aria-label="Khu vực tập luyện chính"
        >
          {/* VIDEO */}
          <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-3 shadow-2xl overflow-hidden">
            <div
              className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-slate-800/80 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm"
              aria-hidden="true"
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                aria-hidden="true"
              />
              Đang chọn
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-700/50 bg-black">
              {embedUrl ? (
                <iframe
                  key={embedUrl}
                  className="w-full h-full"
                  src={embedUrl}
                  title={selectedExercise.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  credentialless="true"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <i
                    className="fa-solid fa-video-slash text-4xl text-rose-400/50 mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-sm">Chưa có video hướng dẫn</p>
                </div>
              )}
            </div>

            <div className="text-center mt-4 mb-2 px-4">
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}
              >
                {selectedExercise.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
                <i
                  className="fa-solid fa-crosshairs text-emerald-400 text-xs"
                  aria-hidden="true"
                />
                <p className="text-xs md:text-sm font-medium">
                  {selectedExercise.target}
                </p>
              </div>
            </div>
          </div>

          {/* TIMER */}
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

          {/* GUIDE */}
          <TechniqueGuide guide={selectedExercise.guide} />
        </section>

        {/* ===== CỘT PHẢI ===== */}
        <section className="lg:col-span-5" aria-label="Danh sách bài tập">
          <ExerciseList
            exercises={exercises}
            currentIndex={selectedIndex}
            onSelect={handleSelectExercise}
            completedWeeks={completedWeeks}
            onToggleWeekComplete={toggleWeekComplete}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
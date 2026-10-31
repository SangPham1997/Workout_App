import { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTimerStore } from '../stores/useTimerStore';
import { useHomeWorkout } from '../hooks/useHomeWorkout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TimerControl from '../components/timer/TimerControl';
import ExerciseList from '../components/exercises/ExerciseList';
import TechniqueGuide from '../components/simulator/TechniqueGuide';
import { getVideoEmbedUrl } from '../components/shared/getVideoEmbedUrl';

const EMBED_OPTIONS = {
  autoplay: false,
  mute: true,
  loop: true,
  controls: true,
};

function HomePage() {
  // ===== HOOK KẾT HỢP SANITY + ZUSTAND =====
  const {
    program,
    weeks,
    currentWeek,
    exercises,
    selectedExercise,
    selectedId,
    selectExercise,
    completedWeeks,
    toggleWeekComplete,
    isLoading,
    error,
  } = useHomeWorkout();

  // ===== TIMER STORE =====
  const {
    phase,
    currentSet,
    totalSets,
    timeLeft,
    workDuration,
    restDuration,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    fullReset,
    resetAndStart,
    loadSession,
    toggleSound,
    soundEnabled,
  } = useTimerStore(
    useShallow((state) => ({
      phase: state.phase,
      currentSet: state.currentSet,
      totalSets: state.totalSets,
      timeLeft: state.timeLeft,
      workDuration: state.workDuration,
      restDuration: state.restDuration,
      isRunning: state.isRunning,
      isCompleted: state.isCompleted,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
      fullReset: state.fullReset,
      resetAndStart: state.resetAndStart,
      loadSession: state.loadSession,
      toggleSound: state.toggleSound,
      soundEnabled: state.soundEnabled,
    }))
  );

  // ===== EMBED URL =====
  const embedUrl = useMemo(
    () =>
      selectedExercise
        ? getVideoEmbedUrl(selectedExercise.videoUrl, EMBED_OPTIONS)
        : '',
    [selectedExercise]
  );

  // ===== LOAD SESSION CHO TIMER =====
  useEffect(() => {
    if (selectedExercise) loadSession(selectedExercise);
  }, [selectedExercise, loadSession]);

  // ===== HANDLERS =====
  const handleSelectExercise = useCallback(
    (id) => {
      selectExercise(id);
    },
    [selectExercise]
  );

  // ===== LOADING / ERROR STATES =====
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-400">Đang tải chương trình tập luyện...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center text-rose-400">
            <i className="fa-solid fa-triangle-exclamation text-4xl mb-2" />
            <p className="mb-2">Không thể tải dữ liệu từ máy chủ</p>
            <p className="text-sm text-slate-500">{error.message}</p>
            <button onClick={refetch} className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ===== GUARD =====
  if (!selectedExercise) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-slate-400 text-sm" role="status" aria-live="polite">
            Không có bài tập nào trong chương trình
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
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
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
                  <i className="fa-solid fa-video-slash text-4xl text-rose-400/50 mb-2" aria-hidden="true" />
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
                <i className="fa-solid fa-crosshairs text-emerald-400 text-xs" aria-hidden="true" />
                <p className="text-xs md:text-sm font-medium">{selectedExercise.target || selectedExercise.muscleGroups?.join(', ') || 'Toàn thân'}</p>
              </div>
            </div>
          </div>

          {/* TIMER */}
          <TimerControl
            accent="emerald"
            phase={phase}
            currentSet={currentSet}
            totalSets={totalSets}
            timeLeft={timeLeft}
            workDuration={workDuration}
            restDuration={restDuration}
            mode={selectedExercise.exerciseType === 'hold' ? 'time' : selectedExercise.mode}
            reps={selectedExercise.exerciseType === 'reps' ? selectedExercise.defaultReps : undefined}
            isRunning={isRunning}
            isCompleted={isCompleted}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={fullReset}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
            onResetAndStart={resetAndStart}
          />

          {/* GUIDE */}
          <TechniqueGuide guide={selectedExercise.instructions} />
        </section>

        {/* ===== CỘT PHẢI ===== */}
        <section className="lg:col-span-5" aria-label="Danh sách bài tập">
          <ExerciseList
            exercises={exercises}
            currentId={selectedId}
            onSelect={handleSelectExercise}
            completedWeeks={completedWeeks}
            onToggleWeekComplete={toggleWeekComplete}
            currentWeekNumber={currentWeek?.weekNumber}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
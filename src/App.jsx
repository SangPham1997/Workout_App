import { useState, useEffect, useRef } from 'react';
import { exercises } from './data/exercises';
import { useTimer } from './hooks/useTimer';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CanvasSimulator from './components/simulator/CanvasSimulator';
import TimerControl from './components/timer/TimerControl';
import TechniqueGuide from './components/simulator/TechniqueGuide';
import ExerciseList from './components/exercises/ExerciseList';

const STORAGE_KEY = 'exerciseReps';
const REST_DURATION = 30; // Thời gian nghỉ giữa các bài (giây)

function App() {
  // ===== STATE =====
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const audioCtxRef = useRef(null);
  const restTimerRef = useRef(null);

  // State cho chế độ nghỉ
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(REST_DURATION);

  // State reps từ localStorage
  const [repTargets, setRepTargets] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const defaultReps = {};
    exercises.forEach(ex => { defaultReps[ex.id] = ex.reps || 10; });
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultReps, ...parsed };
      } catch {
        return defaultReps;
      }
    }
    return defaultReps;
  });

  const resetAllReps = () => {
    const defaultReps = {};
    exercises.forEach(ex => {
      defaultReps[ex.id] = ex.reps || 10;
    });
    setRepTargets(defaultReps);
    localStorage.setItem('exerciseReps', JSON.stringify(defaultReps));
    if (selectedExercise) {
      setRepCount(0);
    }
  };

  const currentExercise = exercises[currentIndex];
  const targetReps = repTargets[currentExercise?.id] || 10;

  // Lưu reps vào localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repTargets));
  }, [repTargets]);

  // ===== HÀM PHÁT BEEP =====
  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const delays = [0, 0.2, 0.4];
      delays.forEach((delay) => {
        setTimeout(() => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 880;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => {
            oscillator.stop();
          }, 150);
        }, delay * 1000);
      });
    } catch (e) {
      console.log('Cannot play beep:', e);
    }
  };

  // ===== TIMER TẬP =====
  const { timeLeft, isRunning, start, pause, reset } = useTimer(
    currentExercise?.duration || 30,
    () => {
      // Khi timer tập kết thúc (hết giờ hoặc đạt rep)
      playBeep();
      // Tự động bắt đầu nghỉ
      startRest();
    }
  );

  // ===== HÀM QUẢN LÝ NGHỈ =====
  const startRest = () => {
    setIsResting(true);
    setRestTimeLeft(REST_DURATION);
    pause(); // Dừng timer tập

    // Clear timer cũ nếu có
    if (restTimerRef.current) clearInterval(restTimerRef.current);

    restTimerRef.current = setInterval(() => {
      setRestTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          // Hết nghỉ → chuyển bài tiếp theo
          setIsResting(false);
          if (currentIndex < exercises.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSelectedExercise(exercises[nextIndex]);
            setRepCount(0);
            reset(exercises[nextIndex].duration);
            playBeep(); // Bíp thông báo bắt đầu bài mới
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipRest = () => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }
    setIsResting(false);
    if (currentIndex < exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedExercise(exercises[nextIndex]);
      setRepCount(0);
      reset(exercises[nextIndex].duration);
    }
  };

  // Cleanup timer nghỉ khi unmount
  useEffect(() => {
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, []);

  // ===== HIỆU ỨNG TỰ ĐỘNG =====
  // Phát beep và bắt đầu nghỉ khi timer về 0
  useEffect(() => {
    if (timeLeft === 0 && !isRunning && !isResting) {
      playBeep();
      startRest();
    }
  }, [timeLeft, isRunning]);

  // Tự động nghỉ khi đạt số rep
  useEffect(() => {
    if (isRunning && repCount >= targetReps && !isResting) {
      pause();
      playBeep();
      startRest();
    }
  }, [repCount, isRunning, targetReps, isResting]);

  // ===== HANDLERS =====
  const handleSelectExercise = (index) => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setIsResting(false);
    setCurrentIndex(index);
    setSelectedExercise(exercises[index]);
    setRepCount(0);
    reset(exercises[index].duration);
  };

  const handleStart = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (repCount >= targetReps) setRepCount(0);
    start();
  };

  const handlePause = () => pause();
  const handleReset = () => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setIsResting(false);
    reset(currentExercise?.duration || 30);
    setRepCount(0);
  };

  const handleRepChange = (id, newReps) => {
    setRepTargets(prev => ({ ...prev, [id]: newReps }));
  };

  const handleRepUpdate = (count) => setRepCount(count);

  if (!currentExercise) return <div className="text-white p-4">Đang tải...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-1 min-h-[350px] md:min-h-[420px] flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition duration-700"></div>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-800/80 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isResting ? '🔄 Nghỉ giải lao' : 'Đang chọn'}
            </div>
            <CanvasSimulator
              exercise={currentExercise}
              isRunning={isRunning}
              onRepChange={handleRepUpdate}
            />
            <div className="text-center z-10 mt-2 mb-6 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                {isResting ? '⏳ Nghỉ giải lao' : currentExercise.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
                <i className="fa-solid fa-crosshairs text-emerald-400 text-xs"></i>
                <p className="text-xs md:text-sm font-medium">
                  {isResting ? `Còn ${restTimeLeft}s` : currentExercise.target}
                </p>
              </div>
            </div>
          </div>

          <TimerControl
            timeLeft={isResting ? restTimeLeft : timeLeft}
            isRunning={isRunning}
            total={isResting ? REST_DURATION : currentExercise.duration}
            repCount={repCount}
            targetReps={targetReps}
            onStart={isResting ? skipRest : handleStart}
            onPause={handlePause}
            onReset={handleReset}
            isResting={isResting}
            onSkipRest={skipRest}
          />

          <TechniqueGuide guide={currentExercise.guide} />
        </section>

        <section className="lg:col-span-5">
          <ExerciseList
            exercises={exercises}
            currentIndex={currentIndex}
            onSelect={handleSelectExercise}
            repTargets={repTargets}
            onRepChange={handleRepChange}
            onResetAllReps={resetAllReps}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
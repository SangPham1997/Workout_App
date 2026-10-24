import { create } from 'zustand';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useKarateStore } from '../stores/useKarateStore';
import {
  beepSetComplete,
  beepRestComplete,
  beepAllComplete,
} from '../utils/sound';

// Nhịp tick nhỏ hơn 1s để đồng hồ bám sát thời gian thực (không bị trôi
// khi tab bị throttle). Thời gian còn lại luôn tính từ `endsAt`, không trừ dồn.
const TICK_MS = 250;

const getActiveSession = () => {
  const isKarate =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/karate');
  if (isKarate) {
    const ks = useKarateStore.getState();
    return ks.sessions[ks.selectedIndex] || null;
  }
  return useExerciseStore.getState().getSelectedExercise();
};

const getSessionConfig = (session) => {
  if (!session) {
    return { workDuration: 30, restDuration: 0, totalSets: 1 };
  }
  return {
    workDuration: session.duration || 30,
    restDuration: session.rest ?? 0,
    totalSets: session.sets ?? 1,
  };
};

let intervalId = null;

const clearTimer = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const remainingSeconds = (endsAt) =>
  Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

export const useTimerStore = create((set, get) => ({
  // ===== CONFIG =====
  workDuration: 30,
  restDuration: 0,
  totalSets: 1,

  // ===== RUNTIME =====
  phase: 'idle',
  currentSet: 1,
  timeLeft: 30,
  isRunning: false,
  isCompleted: false,
  endsAt: null, // timestamp kết thúc phase hiện tại (null khi tạm dừng)

  // ===== SOUND =====
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  // ===== ACTIONS =====
  startTimer: () => {
    const { isRunning, phase, timeLeft } = get();
    if (isRunning || phase === 'completed') return;

    if (phase === 'idle') {
      const session = getActiveSession();
      if (!session) return;

      const config = getSessionConfig(session);
      set({
        ...config,
        phase: 'work',
        currentSet: 1,
        timeLeft: config.workDuration,
        isRunning: true,
        isCompleted: false,
        endsAt: Date.now() + config.workDuration * 1000,
      });
    } else {
      // Tiếp tục từ trạng thái tạm dừng
      if (timeLeft <= 0) return;
      set({ isRunning: true, endsAt: Date.now() + timeLeft * 1000 });
    }

    clearTimer();
    intervalId = setInterval(() => get().tick(), TICK_MS);
  },

  pauseTimer: () => {
    clearTimer();
    const { endsAt } = get();

    if (!endsAt) {
      set({ isRunning: false });
      return;
    }

    const remaining = remainingSeconds(endsAt);
    set({ isRunning: false, timeLeft: remaining, endsAt: null });

    // Tạm dừng đúng lúc phase vừa hết → chuyển phase luôn.
    if (remaining <= 0) get().advancePhase();
  },

  tick: () => {
    const { phase, timeLeft, endsAt } = get();

    if (phase === 'idle' || phase === 'completed') {
      clearTimer();
      return;
    }
    if (!endsAt) return;

    const remaining = remainingSeconds(endsAt);
    if (remaining === timeLeft) return;

    if (remaining > 0) {
      set({ timeLeft: remaining });
      return;
    }

    get().advancePhase();
  },

  advancePhase: () => {
    const {
      phase,
      currentSet,
      totalSets,
      workDuration,
      restDuration,
      soundEnabled,
    } = get();
    const now = Date.now();

    if (phase === 'work') {
      if (currentSet < totalSets) {
        // ✅ Beep luôn, dù có nghỉ hay không
        if (soundEnabled) beepSetComplete();

        if (restDuration > 0) {
          set({
            phase: 'rest',
            timeLeft: restDuration,
            endsAt: now + restDuration * 1000,
          });
        } else {
          set({
            phase: 'work',
            currentSet: currentSet + 1,
            timeLeft: workDuration,
            endsAt: now + workDuration * 1000,
          });
        }
      } else {
        if (soundEnabled) beepAllComplete();
        clearTimer();
        set({
          phase: 'completed',
          timeLeft: 0,
          isRunning: false,
          isCompleted: true,
          endsAt: null,
        });
      }
    } else if (phase === 'rest') {
      if (soundEnabled) beepRestComplete();
      set({
        phase: 'work',
        currentSet: currentSet + 1,
        timeLeft: workDuration,
        endsAt: now + workDuration * 1000,
      });
    }
  },

  fullReset: () => {
    clearTimer();
    const session = getActiveSession();
    const config = getSessionConfig(session);
    set({
      ...config,
      phase: 'idle',
      currentSet: 1,
      timeLeft: config.workDuration,
      isRunning: false,
      isCompleted: false,
      endsAt: null,
    });
  },

  resetAndStart: () => {
    get().fullReset();
    get().startTimer();
  },

  resetTimer: (duration) => {
    clearTimer();
    const d = duration || get().workDuration;
    set({
      phase: 'idle',
      currentSet: 1,
      timeLeft: d,
      isRunning: false,
      isCompleted: false,
      endsAt: null,
    });
  },
}));

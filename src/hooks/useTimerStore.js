import { create } from 'zustand';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useKarateStore } from '../stores/useKarateStore';
import {
  beepSetComplete,
  beepRestComplete,
  beepAllComplete,
} from '../utils/sound';

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
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

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

  // ===== SOUND =====
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  // ===== ACTIONS =====
  startTimer: () => {
    const { isRunning, phase } = get();
    if (isRunning || phase === 'completed') return;

    const session = getActiveSession();
    if (!session) return;

    const config = getSessionConfig(session);

    if (phase === 'idle') {
      set({
        workDuration: config.workDuration,
        restDuration: config.restDuration,
        totalSets: config.totalSets,
        phase: 'work',
        currentSet: 1,
        timeLeft: config.workDuration,
        isRunning: true,
        isCompleted: false,
      });
    } else {
      set({ isRunning: true });
    }

    clearTimer();
    intervalId = setInterval(() => get().tick(), 1000);
  },

  pauseTimer: () => {
    clearTimer();
    set({ isRunning: false });
  },

  tick: () => {
    const {
      timeLeft,
      phase,
      currentSet,
      totalSets,
      workDuration,
      restDuration,
      soundEnabled,       // ✅ FIX: thêm vào destructure
    } = get();

    if (phase === 'idle' || phase === 'completed') {
      clearTimer();
      return;
    }

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    if (phase === 'work') {
      if (currentSet < totalSets) {
        // ✅ Beep luôn, dù có nghỉ hay không
        if (soundEnabled) beepSetComplete();

        if (restDuration > 0) {
          set({ phase: 'rest', timeLeft: restDuration });
        } else {
          set({
            phase: 'work',
            currentSet: currentSet + 1,
            timeLeft: workDuration,
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
        });
      }
    } else if (phase === 'rest') {
      if (soundEnabled) beepRestComplete();
      set({
        phase: 'work',
        currentSet: currentSet + 1,
        timeLeft: workDuration,
      });
    }
  },

  fullReset: () => {
    clearTimer();
    const session = getActiveSession();
    const config = getSessionConfig(session);
    set({
      workDuration: config.workDuration,
      restDuration: config.restDuration,
      totalSets: config.totalSets,
      phase: 'idle',
      currentSet: 1,
      timeLeft: config.workDuration,
      isRunning: false,
      isCompleted: false,
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
    });
  },
}));
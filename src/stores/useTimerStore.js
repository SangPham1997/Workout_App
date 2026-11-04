import { create } from 'zustand';
import {
  beepSetComplete,
  beepRestComplete,
  beepAllComplete,
} from '../utils/sound';

const TICK_MS = 250;

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
  session: null,

  workDuration: 30,
  restDuration: 0,
  totalSets: 1,

  phase: 'idle',
  currentSet: 1,
  timeLeft: 30,
  isRunning: false,
  isCompleted: false,
  endsAt: null,

  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  loadSession: (session) => {
    const current = get();

    // ⚡ FIX: Không reset timer nếu cùng exercise + timer đang chạy/paused
    const sameSession = current.session?.id === session?.id;
    const timerActive =
      current.phase !== 'idle' && current.phase !== 'completed';

    if (sameSession && timerActive) {
      if (import.meta.env.DEV) {
        console.debug(
          '[useTimerStore] loadSession skipped — same session, timer active',
          { id: session?.id, phase: current.phase }
        );
      }
      return;
    }

    // Reset bình thường (new exercise hoặc completed/idle)
    clearTimer();
    const config = getSessionConfig(session);
    set({
      session,
      ...config,
      phase: 'idle',
      currentSet: 1,
      timeLeft: config.workDuration,
      isRunning: false,
      isCompleted: false,
      endsAt: null,
    });
  },

  startTimer: () => {
    const { isRunning, phase, timeLeft, session } = get();
    if (isRunning || phase === 'completed' || !session) return;

    if (phase === 'idle') {
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
      session,
    } = get();
    const now = Date.now();
    // Đồng bộ endsAt khi duration thay đổi (phòng config lệch)
    const cfg = getSessionConfig(session);

    if (phase === 'work') {
      if (currentSet < totalSets) {
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
    const config = getSessionConfig(get().session);
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
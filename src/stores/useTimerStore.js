import { create } from 'zustand';
import {
  beepSetComplete,
  beepRestComplete,
  beepAllComplete,
} from '../utils/sound';

// Nhịp tick nhỏ hơn 1s để đồng hồ bám sát thời gian thực (không bị trôi
// khi tab bị throttle). Thời gian còn lại luôn tính từ `endsAt`, không trừ dồn.
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
  // ===== SESSION ĐANG CHẠY =====
  // Page gọi loadSession(session) khi đổi bài/buổi. Timer không còn tự dò
  // window.location.pathname, nhờ vậy thêm route mới không cần sửa timer.
  session: null,

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
  loadSession: (session) => {
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
        // Beep luôn, dù có nghỉ hay không
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

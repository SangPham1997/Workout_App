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

// Use requestAnimationFrame for smoother timer updates and better performance
let animationFrameId = null;
let lastTickTime = 0;
let accumulatedTime = 0;

const clearTimer = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastTickTime = 0;
  accumulatedTime = 0;
};

/**
 * High-performance tick using requestAnimationFrame
 * Accumulates time and only updates state when a full second has passed
 */
const tick = (timestamp) => {
  const { phase, timeLeft, isRunning } = useTimerStore.getState();
  
  if (phase === 'idle' || phase === 'completed' || !isRunning) {
    clearTimer();
    return;
  }

  // Initialize on first frame
  if (lastTickTime === 0) {
    lastTickTime = timestamp;
    animationFrameId = requestAnimationFrame(tick);
    return;
  }

  // Calculate elapsed time since last frame
  const deltaTime = timestamp - lastTickTime;
  lastTickTime = timestamp;
  accumulatedTime += deltaTime;

  // Only update state when 1 second (1000ms) has accumulated
  if (accumulatedTime >= 1000) {
    const secondsToDecrement = Math.floor(accumulatedTime / 1000);
    accumulatedTime = accumulatedTime % 1000;
    
    const { 
      phase, 
      currentSet, 
      totalSets, 
      workDuration, 
      restDuration 
    } = useTimerStore.getState();

    let newTimeLeft = timeLeft - secondsToDecrement;
    
    if (newTimeLeft <= 0) {
      // Phase transition logic
      if (phase === 'work') {
        if (currentSet < totalSets) {
          if (restDuration > 0) {
            // Transition to rest phase
            useTimerStore.setState({ 
              phase: 'rest', 
              timeLeft: restDuration 
            });
          } else {
            // No rest, go to next set immediately
            useTimerStore.setState({ 
              phase: 'work', 
              currentSet: currentSet + 1, 
              timeLeft: workDuration 
            });
          }
        } else {
          // All sets completed
          clearTimer();
          useTimerStore.setState({ 
            phase: 'completed', 
            timeLeft: 0, 
            isRunning: false, 
            isCompleted: true 
          });
          return;
        }
      } else if (phase === 'rest') {
        // Rest phase completed, go to next work set
        useTimerStore.setState({ 
          phase: 'work', 
          currentSet: currentSet + 1, 
          timeLeft: workDuration 
        });
      }
    } else {
      // Just decrement time
      useTimerStore.setState({ timeLeft: newTimeLeft });
    }
  }

  // Continue animation loop
  animationFrameId = requestAnimationFrame(tick);
};

/**
 * Start the high-performance timer loop
 */
const startTimerLoop = () => {
  lastTickTime = 0;
  accumulatedTime = 0;
  animationFrameId = requestAnimationFrame(tick);
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
    startTimerLoop();
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
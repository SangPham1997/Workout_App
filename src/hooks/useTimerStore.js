import { create } from 'zustand';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useKarateStore } from '../stores/useKarateStore';

/**
 * Resolve buổi tập HIIT hoặc Karate đang chọn theo route hiện tại.
 * Dùng chung cho timer để đồng hồ luôn phản ánh đúng buổi tập trên màn hình.
 */
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

/**
 * Chuẩn hóa config từ session.
 * Karate sessions có thể không có `sets` / `rest` → fallback 1 hiệp, không nghỉ.
 * HIIT exercises có schema mới → dùng trực tiếp.
 */
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

// Interval ID để ngoài state — tránh re-render không cần thiết
let intervalId = null;
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
  const { phase, timeLeft, isRunning, isCompleted } = useTimerStore.getState();
  
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

/**
 * State machine:
 *   idle → work(set 1) → rest → work(set 2) → … → work(set N) → completed
 *
 * - Nếu restDuration = 0 → bỏ qua phase rest.
 * - Nếu totalSets = 1 → chạy 1 hiệp duy nhất (giống store cũ).
 */
export const useTimerStore = create((set, get) => ({
  // ===== CONFIG (được set khi bắt đầu / reset) =====
  workDuration: 30,   // giây/hiệp
  restDuration: 0,    // giây nghỉ giữa hiệp
  totalSets: 1,       // số hiệp

  // ===== RUNTIME =====
  phase: 'idle',      // 'idle' | 'work' | 'rest' | 'completed'
  currentSet: 1,      // 1..totalSets
  timeLeft: 30,       // giây còn lại của phase hiện tại
  isRunning: false,
  isCompleted: false,

  // ===== ACTIONS =====

  startTimer: () => {
    const { isRunning, phase } = get();
    if (isRunning || phase === 'completed') return;

    const session = getActiveSession();
    if (!session) return;

    const config = getSessionConfig(session);

    if (phase === 'idle') {
      // Bắt đầu từ đầu
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
      // Resume từ pause (work hoặc rest)
      set({ isRunning: true });
    }

    clearTimer();
    startTimerLoop();
  },

  pauseTimer: () => {
    clearTimer();
    set({ isRunning: false });
  },

  /**
   * Tick mỗi giây — xử lý transition giữa các phase.
   * Không dùng ở ngoài, chỉ gọi từ interval trong startTimer.
   */
  tick: () => {
    const {
      timeLeft,
      phase,
      currentSet,
      totalSets,
      workDuration,
      restDuration,
    } = get();

    if (phase === 'idle' || phase === 'completed') {
      clearTimer();
      return;
    }

    // Còn thời gian → giảm 1 giây
    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    // timeLeft === 1 → chuyển phase
    if (phase === 'work') {
      if (currentSet < totalSets) {
        if (restDuration > 0) {
          // Sang phase nghỉ
          set({ phase: 'rest', timeLeft: restDuration });
        } else {
          // Không có nghỉ → sang set kế tiếp luôn
          set({
            phase: 'work',
            currentSet: currentSet + 1,
            timeLeft: workDuration,
          });
        }
      } else {
        // Hết set cuối → hoàn thành
        clearTimer();
        set({
          phase: 'completed',
          timeLeft: 0,
          isRunning: false,
          isCompleted: true,
        });
      }
    } else if (phase === 'rest') {
      // Hết nghỉ → sang set kế tiếp
      set({
        phase: 'work',
        currentSet: currentSet + 1,
        timeLeft: workDuration,
      });
    }
  },

  /**
   * Reset hoàn toàn về idle, dựa trên session hiện tại.
   * Gọi khi user chọn bài khác hoặc nhấn nút Reset.
   */
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

  /**
   * Reset rồi start ngay — dùng cho nút "Bắt đầu lại" khi đã hoàn thành.
   */
  resetAndStart: () => {
    get().fullReset();
    get().startTimer();
  },

  /**
   * Compat shim — giữ signature cũ nếu còn chỗ gọi `resetTimer(duration)`.
   * @deprecated Dùng `fullReset()` thay thế.
   */
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
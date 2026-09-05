import { create } from 'zustand';
import { useExerciseStore } from '../stores/useExerciseStore';

export const useTimerStore = create((set, get) => ({
  timeLeft: 30,
  isRunning: false,
  isCompleted: false,
  intervalId: null,

  startTimer: () => {
    const { isRunning, isCompleted, timeLeft: currentTimeLeft } = get();
    if (isRunning || isCompleted) return;

    const exercise = useExerciseStore.getState().getSelectedExercise();
    if (!exercise) return;

    const duration = exercise.duration || 30;

    // Nếu timeLeft đang bằng duration (chưa từng chạy) hoặc đã hoàn thành,
    // reset về duration. Ngược lại giữ nguyên để tiếp tục.
    if (currentTimeLeft === duration || isCompleted) {
      set({ timeLeft: duration, isCompleted: false });
    } else {
      set({ isCompleted: false });
    }

    // Clear interval cũ nếu còn
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }

    const id = setInterval(() => {
      const state = get();
      const { timeLeft, isCompleted: comp } = state;
      const exerciseNow = useExerciseStore.getState().getSelectedExercise();
      if (!exerciseNow || comp) {
        clearInterval(id);
        set({ intervalId: null, isRunning: false });
        return;
      }

      if (timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
      } else {
        clearInterval(id);
        set({
          intervalId: null,
          isRunning: false,
          isCompleted: true,
        });
      }
    }, 1000);

    set({ intervalId: id, isRunning: true });
  },

  pauseTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null, isRunning: false });
    }
  },

  resetTimer: (duration) => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({
      intervalId: null,
      isRunning: false,
      isCompleted: false,
      timeLeft: duration || 30,
    });
  },

  fullReset: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    const exercise = useExerciseStore.getState().getSelectedExercise();
    set({
      intervalId: null,
      isRunning: false,
      isCompleted: false,
      timeLeft: exercise?.duration || 30,
    });
  },
}));
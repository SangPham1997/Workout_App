/*
  Selectors cho zustand store — tách riêng để dùng với hook selector.
  Component chỉ subscribe đúng field nó cần → chỉ re-render khi giá trị đó đổi.
  Ví dụ: ExerciseList không re-render mỗi giây khi đồng hồ chạy.
*/
import { useExerciseStore } from './useExerciseStore';
import { useTimerStore } from '../hooks/useTimerStore';

// ----- Exercise store -----
export const selectExercises = (s) => s.exercises;
export const selectSelectedIndex = (s) => s.selectedIndex;
export const selectSelectExercise = (s) => s.selectExercise;
export const selectSelectedExercise = (s) => s.exercises[s.selectedIndex] || null;

export const useExercises = () => useExerciseStore(selectExercises);
export const useSelectedIndex = () => useExerciseStore(selectSelectedIndex);
export const useSelectedExercise = () => useExerciseStore(selectSelectedExercise);
// Action của zustand luôn là tham chiếu ổn định → an toàn khi đưa vào deps của useMemo.
export const useSelectExercise = () => useExerciseStore(selectSelectExercise);

// ----- Timer store -----
export const selectTimeLeft = (s) => s.timeLeft;
export const selectIsRunning = (s) => s.isRunning;
export const selectIsCompleted = (s) => s.isCompleted;
export const selectStartTimer = (s) => s.startTimer;
export const selectPauseTimer = (s) => s.pauseTimer;
export const selectFullReset = (s) => s.fullReset;

export const useTimeLeft = () => useTimerStore(selectTimeLeft);
export const useIsRunning = () => useTimerStore(selectIsRunning);
export const useIsCompleted = () => useTimerStore(selectIsCompleted);
export const useStartTimer = () => useTimerStore(selectStartTimer);
export const usePauseTimer = () => useTimerStore(selectPauseTimer);
export const useFullReset = () => useTimerStore(selectFullReset);

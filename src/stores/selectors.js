import { useExerciseStore } from './useExerciseStore';
import { useKarateStore } from './useKarateStore';
import { useTimerStore } from '../hooks/useTimerStore';

// ===== Exercise store =====
export const selectExercises = (s) => s.exercises;
export const selectSelectedIndex = (s) => s.selectedIndex;
export const selectSelectExercise = (s) => s.selectExercise;
export const selectSelectedExercise = (s) => s.exercises[s.selectedIndex] || null;

export const useExercises = () => useExerciseStore(selectExercises);
export const useSelectedIndex = () => useExerciseStore(selectSelectedIndex);
export const useSelectedExercise = () => useExerciseStore(selectSelectedExercise);
export const useSelectExercise = () => useExerciseStore(selectSelectExercise);

// ===== Timer store =====

// --- Legacy (giữ để không break chỗ cũ) ---
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

// --- Multi-set phase ---
export const selectPhase = (s) => s.phase;
export const selectCurrentSet = (s) => s.currentSet;
export const selectTotalSets = (s) => s.totalSets;
export const selectWorkDuration = (s) => s.workDuration;
export const selectRestDuration = (s) => s.restDuration;
export const selectResetAndStart = (s) => s.resetAndStart;

export const usePhase = () => useTimerStore(selectPhase);
export const useCurrentSet = () => useTimerStore(selectCurrentSet);
export const useTotalSets = () => useTimerStore(selectTotalSets);
export const useWorkDuration = () => useTimerStore(selectWorkDuration);
export const useRestDuration = () => useTimerStore(selectRestDuration);
export const useResetAndStart = () => useTimerStore(selectResetAndStart);

// --- Derived selectors ---

/** Phase hiện tại có phải là nghỉ không */
export const selectIsResting = (s) => s.phase === 'rest';

/** Phase hiện tại có phải đang tập không */
export const selectIsWorking = (s) => s.phase === 'work';

/** Duration của phase hiện tại (work hay rest) */
export const selectPhaseDuration = (s) =>
  s.phase === 'rest' ? s.restDuration : s.workDuration;

/** % tiến độ của phase hiện tại (0..100) */
export const selectPhasePercent = (s) => {
  const duration = s.phase === 'rest' ? s.restDuration : s.workDuration;
  if (!duration) return 0;
  return Math.max(0, Math.min(100, (s.timeLeft / duration) * 100));
};

/** Text hiển thị cho set hiện tại: "Hiệp 1/2", "Nghỉ trước hiệp 2/2", ... */
export const selectSetLabel = (s) => {
  if (s.phase === 'idle') return 'Sẵn sàng bắt đầu';
  if (s.phase === 'completed') return `Đã xong ${s.totalSets} hiệp`;
  if (s.phase === 'rest') {
    return `Nghỉ trước hiệp ${s.currentSet + 1}/${s.totalSets}`;
  }
  return `Hiệp ${s.currentSet}/${s.totalSets}`;
};

export const useIsResting = () => useTimerStore(selectIsResting);
export const useIsWorking = () => useTimerStore(selectIsWorking);
export const usePhaseDuration = () => useTimerStore(selectPhaseDuration);
export const usePhasePercent = () => useTimerStore(selectPhasePercent);
export const useSetLabel = () => useTimerStore(selectSetLabel);

// ===== Karate store =====
export const selectKarateSessions = (s) => s.sessions;
export const selectKarateIndex = (s) => s.selectedIndex;
export const selectSelectKarateSession = (s) => s.selectSession;
export const selectSelectedKarateSession = (s) => s.sessions[s.selectedIndex] || null;
export const selectKarateCompletedIds = (s) => s.completedIds;
export const selectKarateToggleComplete = (s) => s.toggleComplete;
export const selectKarateNotes = (s) => s.notes;
export const selectKarateSetNote = (s) => s.setNote;

export const useKarateSessions = () => useKarateStore(selectKarateSessions);
export const useKarateIndex = () => useKarateStore(selectKarateIndex);
export const useSelectedKarateSession = () => useKarateStore(selectSelectedKarateSession);
export const useSelectKarateSession = () => useKarateStore(selectSelectKarateSession);
export const useKarateCompletedIds = () => useKarateStore(selectKarateCompletedIds);
export const useKarateToggleComplete = () => useKarateStore(selectKarateToggleComplete);
export const useKarateNotes = () => useKarateStore(selectKarateNotes);
export const useKarateSetNote = () => useKarateStore(selectKarateSetNote);
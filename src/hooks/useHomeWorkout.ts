// Hook kết hợp Sanity Data (Program) + Zustand State (User Progress)
import { useProgram } from './useSanityData';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useEffect } from 'react';
import type { AppProgram, AppWeek, AppExercise } from '../lib/sanity.mappers';

export function useHomeWorkout() {
  // 1. Fetch Program Data từ Sanity
  const { data: program, isLoading, error, refetch } = useProgram('home-workout-pro');
  
  // 2. User State từ Zustand
  const userState = useExerciseStore();

  // 3. Derived State: Kết hợp Program + User State
  // Chỉ tính toán khi có program data
  const weeks = program?.weeks || [];
  const allExercises = weeks.flatMap((w) => w.exercises);
  const firstExerciseId = allExercises[0]?.id || null;

  // Khởi tạo selectedId nếu chưa có (chạy 1 lần khi data ready)
  useEffect(() => {
    if (!userState.selectedId && firstExerciseId) {
      userState.initializeFromProgram(firstExerciseId);
    }
  }, [firstExerciseId, userState]);

  // Tìm tuần hiện tại (mặc định tuần 1, sau đó có thể thêm logic "tuần hiện tại dựa trên ngày")
  const currentWeek = weeks.find((w) => w.weekNumber === 1) || weeks[0];
  const exercises = currentWeek?.exercises || [];
  
  // Selected Exercise: Ưu tiên user selection, fallback first exercise
  const selectedExercise = exercises.find((ex) => ex.id === userState.selectedId) || exercises[0] || null;

  return {
    // Program Info (Sanity)
    program,
    weeks,
    currentWeek,
    allExercises,
    
    // Current Week Data
    exercises,
    selectedExercise,
    
    // User State (Zustand)
    selectedId: userState.selectedId,
    selectExercise: userState.selectExercise,
    completedWeeks: userState.completedWeeks,
    toggleWeekComplete: userState.toggleWeekComplete,
    
    // Meta
    isLoading,
    error,
    refetch,
    
    // Helpers
    getWeek: (weekNum: number) => weeks.find((w) => w.weekNumber === weekNum),
    getExercise: (id: string) => allExercises.find((ex) => ex.id === id),
  };
}
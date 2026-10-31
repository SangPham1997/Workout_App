import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store quản lý USER STATE cho Home Workout (Weekly Program)
 * - selectedId: Bài tập đang chọn
 * - completedWeeks: Các tuần đã hoàn thành [1, 2, 3, 4]
 * 
 * KHÔNG lưu exercises, weeks data (lấy từ Sanity via useProgram hook)
 */
export const useExerciseStore = create(
  persist(
    (set, get) => ({
      // ===== USER STATE =====
      selectedId: null, // Sẽ được set bởi HomePage khi có data từ Sanity
      completedWeeks: [], // [1, 2, 3, 4]

      // ===== ACTIONS =====
      selectExercise: (id) => set({ selectedId: id }),

      toggleWeekComplete: (weekNum) =>
        set((state) => ({
          completedWeeks: state.completedWeeks.includes(weekNum)
            ? state.completedWeeks.filter((w) => w !== weekNum)
            : [...state.completedWeeks, weekNum],
        })),

      // Helper: Khởi tạo selectedId từ program data (gọi từ HomePage)
      initializeFromProgram: (firstExerciseId) =>
        set((state) => ({
          selectedId: state.selectedId || firstExerciseId,
        })),
    }),
    {
      name: 'exercise-storage',
      version: 2, // Bump version để migrate
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedWeeks: state.completedWeeks,
      }),
      migrate: (persistedState, oldVersion) => {
        const state = persistedState ? { ...persistedState } : {};
        if (oldVersion < 2) {
          // Migration từ version cũ (có exercises, selectedIndex)
          delete state.exercises;
          delete state.selectedIndex;
        }
        return state;
      },
    }
  )
);
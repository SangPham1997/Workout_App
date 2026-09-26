import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exercises as initialExercises } from '../data/exercises';

// Memo các exercise object theo id — giữ tham chiếu ổn định giữa các lần hydrate
// để selector `selectSelectedExercise` không tạo giá trị mới gây re-render thừa.
const exercisesById = new Map(initialExercises.map((ex) => [ex.id, ex]));

export const useExerciseStore = create(
  persist(
    (set, get) => ({
      exercises: initialExercises,
      selectedIndex: 0,

      selectExercise: (index) => set({ selectedIndex: index }),

      getSelectedExercise: () => {
        const { exercises, selectedIndex } = get();
        const ex = exercises[selectedIndex];
        // Trả về object "gốc" đã memo (tham chiếu ổn định).
        return ex ? exercisesById.get(ex.id) || ex : null;
      },
    }),
    {
      name: 'exercise-storage',
      partialize: (state) => ({ selectedIndex: state.selectedIndex }),
    }
  )
);
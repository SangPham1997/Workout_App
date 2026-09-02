import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exercises as initialExercises } from '../data/exercises';

export const useExerciseStore = create(
  persist(
    (set, get) => ({
      exercises: initialExercises,
      selectedIndex: 0,

      selectExercise: (index) => set({ selectedIndex: index }),

      getSelectedExercise: () => {
        const { exercises, selectedIndex } = get();
        return exercises[selectedIndex] || null;
      },
    }),
    {
      name: 'exercise-storage',
      partialize: (state) => ({ selectedIndex: state.selectedIndex }),
    }
  )
);
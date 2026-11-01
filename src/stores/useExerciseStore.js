import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { homeWorkoutProgram } from '../data/programs/homeWorkout';
import { sanityClient } from '../lib/sanity.client'
import { EXERCISES_QUERY } from '../lib/queries/exercises'
import { adaptExercise } from '../lib/adapters/exercise'
import { cachedFetch } from '../lib/sanityCache'

const initialExercises = homeWorkoutProgram.items;
const firstId = initialExercises[0]?.id ?? null;

// Memo object theo id — giữ tham chiếu ổn định để selector không tạo giá trị
// mới gây re-render thừa.
const exercisesById = new Map(initialExercises.map((ex) => [ex.id, ex]));

export const useExerciseStore = create(
  persist(
    (set, get) => ({
loading: true,
  error: null,
  initFromSanity: async () => {
    const current = get()
    if (!current.loading && current.exercises.length > 0) return
    set({ loading: true, error: null })
    try {
      const docs = await cachedFetch(sanityClient, EXERCISES_QUERY)
      const adapted = docs.map(adaptExercise)
      set({
        exercises: adapted,
        selectedId: current.selectedId ?? adapted[0]?.id ?? null,
        loading: false,
      })
    } catch (err) {
      console.error('[useExerciseStore] fetch failed:', err)
      set({ error: err, loading: false })
    }
  },
      exercises: initialExercises,
      selectedId: firstId,
      completedWeeks: [], // [1, 2, 3, 4]

      selectExercise: (id) => {
        if (!exercisesById.has(id)) return;
        set({ selectedId: id });
      },

      getSelectedExercise: () => {
        const { selectedId } = get();
        return exercisesById.get(selectedId) ?? initialExercises[0] ?? null;
      },

      toggleWeekComplete: (weekNum) =>
        set((state) => ({
          completedWeeks: state.completedWeeks.includes(weekNum)
            ? state.completedWeeks.filter((w) => w !== weekNum)
            : [...state.completedWeeks, weekNum],
        })),
    }),
    {
      name: 'exercise-storage',
      version: 1,
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedWeeks: state.completedWeeks,
      }),
      // v0 lưu selectedIndex; đổi sang selectedId để thêm/xoá bài không lệch.
      migrate: (persistedState, oldVersion) => {
        const state = persistedState ? { ...persistedState } : {};
        if (oldVersion === 0 && Number.isInteger(state.selectedIndex)) {
          state.selectedId = initialExercises[state.selectedIndex]?.id ?? firstId;
          delete state.selectedIndex;
        }
        return state;
      },
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState || {}) };
        if (!exercisesById.has(merged.selectedId)) {
          merged.selectedId = firstId;
        }
        merged.completedWeeks = merged.completedWeeks || [];
        return merged;
      },
    }
  )
);

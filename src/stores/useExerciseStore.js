import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { homeWorkoutProgram } from '../data/programs/homeWorkout';
import { sanityClient, freshClient } from '../lib/sanity.client';
import { EXERCISES_QUERY } from '../lib/queries/exercises';
import { adaptExercise } from '../lib/adapters/exercise';
import { cachedFetch } from '../lib/sanityCache';

const initialExercises = Object.freeze([...homeWorkoutProgram.items]);
const firstId = initialExercises[0]?.id ?? null;
const exercisesById = new Map(initialExercises.map((ex) => [ex.id, ex]));

export const useExerciseStore = create(
  persist(
    (set, get) => ({
      exercises: initialExercises,
      selectedId: firstId,
      completedWeeks: [],

      loading: true,
      error: null,

      _isFetching: false,
      _fetchedFromSanity: false,

      initFromSanity: async (options = {}) => {
        const { force = false } = options;
        const current = get();

        if (current._isFetching) return;
        if (!force && current._fetchedFromSanity) return;

        set({ loading: true, error: null, _isFetching: true });

        try {
          const client = force ? freshClient : sanityClient;
          const docs = await cachedFetch(client, EXERCISES_QUERY, undefined, { force });
          const adapted = docs.map(adaptExercise);

          exercisesById.clear();
          adapted.forEach((ex) => exercisesById.set(ex.id, ex));

          set({
            exercises: adapted,
            selectedId: exercisesById.has(current.selectedId)
              ? current.selectedId
              : adapted[0]?.id ?? null,
            loading: false,
            error: null,
            _isFetching: false,
            _fetchedFromSanity: true,
          });
        } catch (err) {
          console.error('[useExerciseStore] fetch failed:', err);
          set({ error: err, loading: false, _isFetching: false });
        }
      },

      selectExercise: (id) => {
        if (!exercisesById.has(id)) return;
        set({ selectedId: id });
      },

      getSelectedExercise: () => {
        const { selectedId } = get();
        if (!selectedId) return initialExercises[0] ?? null;
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
      version: 2,
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedWeeks: state.completedWeeks,
      }),
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
        if (!exercisesById.has(merged.selectedId)) merged.selectedId = firstId;
        merged.completedWeeks = merged.completedWeeks || [];
        merged.loading = currentState.loading;
        merged.error = currentState.error;
        merged._isFetching = currentState._isFetching;
        merged._fetchedFromSanity = currentState._fetchedFromSanity;
        return merged;
      },
    }
  )
);
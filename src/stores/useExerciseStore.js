import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { homeWorkoutProgram } from '../data/programs/homeWorkout';
import { sanityClient, freshClient } from '../lib/sanity.client';
import { EXERCISES_QUERY } from '../lib/queries/exercises';
import { adaptExercise } from '../lib/adapters/exercise';
import { cachedFetch } from '../lib/sanityCache';
import { createSanityListInit } from './_helpers/createSanityInit';

const initialExercises = Object.freeze([...homeWorkoutProgram.items]);
const firstId = initialExercises[0]?.id ?? null;

// Set<id> module-level, luôn được đồng bộ với state.exercises hiện tại.
// Được rebuild khi: khởi tạo, fetch thành công, và rehydrate từ localStorage.
const exercisesById = new Set(initialExercises.map((ex) => ex.id));

function syncExercisesById(exercises) {
  exercisesById.clear();
  for (const ex of exercises) exercisesById.add(ex.id);
}

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
      _isRefreshing: false,

      initFromSanity: createSanityListInit({
        name: 'useExerciseStore',
        query: EXERCISES_QUERY,
        adapt: adaptExercise,
        getClient: (force) => (force ? freshClient : sanityClient),
        cachedFetch,
        stateKey: 'exercises',
        getIdSet: () => exercisesById,
        get,
        set,
      }),

      selectExercise: (id) => {
        if (!exercisesById.has(id)) return;
        set({ selectedId: id });
      },

      getSelectedExercise: () => {
        const { exercises, selectedId } = get();
        return (
          exercises.find((ex) => ex.id === selectedId) ??
          exercises[0] ??
          initialExercises[0] ??
          null
        );
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
        // selectedId validate dựa trên state.exercises hiện tại (có thể là
        // initialExercises lúc rehydrate, sẽ được fetch cập nhật sau).
        const currentIds = new Set(merged.exercises.map((ex) => ex.id));
        if (!currentIds.has(merged.selectedId)) merged.selectedId = firstId;
        merged.completedWeeks = merged.completedWeeks || [];
        // Các cờ runtime không lấy từ persisted.
        merged.loading = currentState.loading;
        merged.error = currentState.error;
        merged._isFetching = currentState._isFetching;
        merged._fetchedFromSanity = currentState._fetchedFromSanity;
        merged._isRefreshing = currentState._isRefreshing;
        return merged;
      },
      onRehydrateStorage: () => (state) => {
        // FIX: rebuild Set<id> ngay sau khi đọc từ localStorage, tránh
        // trường hợp exercises trong state đã đổi nhưng Set vẫn giữ dữ liệu cũ.
        if (state?.exercises) syncExercisesById(state.exercises);
      },
    }
  )
);

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sanityClient, freshClient } from '../lib/sanity.client'
import { EXERCISES_QUERY } from '../lib/queries/exercises'
import { adaptExercise } from '../lib/adapters/exercise'
import { cachedFetch } from '../lib/sanityCache'
import { createSanityListInit } from './_helpers/createSanityInit'

// Empty initial state — data luôn fetch từ Sanity
const initialExercises = Object.freeze([])
const firstId = null

const exercisesById = new Set()

function syncExercisesById(exercises) {
  exercisesById.clear()
  for (const ex of exercises) {
    if (ex?.id) exercisesById.add(ex.id)
  }
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

      initFromSanity: async (options = {}) => {
        const result = await createSanityListInit({
          name: 'useExerciseStore',
          query: EXERCISES_QUERY,
          adapt: adaptExercise,
          getClient: (force) => (force ? freshClient : sanityClient),
          cachedFetch,
          stateKey: 'exercises',
          getIdSet: () => exercisesById,
          get,
          set,
        })(options)

        const { exercises } = get()
        if (exercises?.length) {
          syncExercisesById(exercises)
          const { selectedId } = get()
          if (!selectedId || !exercisesById.has(selectedId)) {
            set({ selectedId: exercises[0]?.id ?? null })
          }
        }

        return result
      },

      selectExercise: (id) => {
        if (!exercisesById.has(id)) return
        set({ selectedId: id })
      },

      getSelectedExercise: () => {
        const { exercises, selectedId } = get()
        return exercises.find((ex) => ex.id === selectedId) ?? exercises[0] ?? null
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
      version: 3,
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedWeeks: state.completedWeeks,
      }),
      migrate: (persistedState, oldVersion) => {
        const state = persistedState ? { ...persistedState } : {}
        // v0-v2: có selectedIndex hoặc selectedId từ static
        if (oldVersion < 3) {
          delete state.selectedIndex
          // Giữ selectedId — sẽ validate sau fetch
        }
        return state
      },
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState || {}) }
        merged.completedWeeks = merged.completedWeeks || []
        merged.loading = currentState.loading
        merged.error = currentState.error
        merged._isFetching = currentState._isFetching
        merged._fetchedFromSanity = currentState._fetchedFromSanity
        merged._isRefreshing = currentState._isRefreshing
        return merged
      },
      onRehydrateStorage: () => (state) => {
        if (state?.exercises) syncExercisesById(state.exercises)
      },
    }
  )
)
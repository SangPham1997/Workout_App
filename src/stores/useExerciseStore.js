import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { homeWorkoutProgram } from '../data/programs/homeWorkout'
import { sanityClient, freshClient } from '../lib/sanity.client'
import { EXERCISES_QUERY } from '../lib/queries/exercises'
import { adaptExercise } from '../lib/adapters/exercise'
import { cachedFetch } from '../lib/sanityCache'
import { createSanityListInit } from './_helpers/createSanityInit'

const initialExercises = Object.freeze([...homeWorkoutProgram.items])
const firstId = initialExercises[0]?.id ?? null

// Set<id> module-level, sync với state.exercises
const exercisesById = new Set(initialExercises.map((ex) => ex.id))

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
        // Wrapper để rebuild Set sau khi fetch xong
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

        // FIX: rebuild Set từ state.exercises hiện tại (sau khi fetch)
        const { exercises } = get()
        if (exercises?.length) {
          syncExercisesById(exercises)
          // Validate selectedId nếu không còn tồn tại
          const { selectedId } = get()
          if (selectedId && !exercisesById.has(selectedId)) {
            const newId = exercises[0]?.id ?? firstId
            set({ selectedId: newId })
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
        return (
          exercises.find((ex) => ex.id === selectedId) ??
          exercises[0] ??
          initialExercises[0] ??
          null
        )
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
        const state = persistedState ? { ...persistedState } : {}
        if (oldVersion === 0 && Number.isInteger(state.selectedIndex)) {
          state.selectedId = initialExercises[state.selectedIndex]?.id ?? firstId
          delete state.selectedIndex
        }
        return state
      },
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState || {}) }
        // KHÔNG validate selectedId ở đây — sẽ validate sau fetch
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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karate';
import { sanityClient, freshClient } from '../lib/sanity.client';
import { KARATE_SESSIONS_QUERY } from '../lib/queries/karate';
import { adaptKarateSession } from '../lib/adapters/karateSession';
import { cachedFetch } from '../lib/sanityCache';
import { createSanityListInit } from './_helpers/createSanityInit';

const initialSessions = Object.freeze([...karateSessions]);
const firstId = initialSessions[0]?.id ?? null;

// Set<id> module-level, luôn đồng bộ với state.sessions.
const sessionIds = new Set(initialSessions.map((s) => s.id));

function syncSessionIds(sessions) {
  sessionIds.clear();
  for (const s of sessions) sessionIds.add(s.id);
}

export const useKarateStore = create(
  persist(
    (set, get) => ({
      sessions: initialSessions,
      selectedId: firstId,
      completedIds: [],
      notes: {},
      lastPracticedAt: {},

      loading: true,
      error: null,

      _isFetching: false,
      _fetchedFromSanity: false,
      _isRefreshing: false,

      initFromSanity: createSanityListInit({
        name: 'useKarateStore',
        query: KARATE_SESSIONS_QUERY,
        adapt: adaptKarateSession,
        getClient: (force) => (force ? freshClient : sanityClient),
        cachedFetch,
        stateKey: 'sessions',
        getIdSet: () => sessionIds,
        get,
        set,
      }),

      selectSession: (id) => {
        if (!sessionIds.has(id)) return;
        set({ selectedId: id });
      },

      getSelectedSession: () => {
        const { sessions, selectedId } = get();
        return sessions.find((s) => s.id === selectedId) ?? sessions[0] ?? null;
      },

      toggleComplete: (id) => {
        if (!sessionIds.has(id)) return;
        set((state) => {
          const isDone = state.completedIds.includes(id);
          const completedIds = isDone
            ? state.completedIds.filter((x) => x !== id)
            : [...state.completedIds, id];
          const lastPracticedAt = { ...state.lastPracticedAt };
          if (isDone) delete lastPracticedAt[id];
          else lastPracticedAt[id] = Date.now();
          return { completedIds, lastPracticedAt };
        });
      },

      setNote: (id, note) => {
        if (!sessionIds.has(id)) return;
        set((state) => {
          const notes = { ...state.notes };
          if (note && note.trim()) notes[id] = note;
          else delete notes[id];
          return { notes };
        });
      },
    }),
    {
      name: 'karate-storage',
      version: 2,
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedIds: state.completedIds,
        notes: state.notes,
        lastPracticedAt: state.lastPracticedAt,
      }),
      migrate: (persistedState, oldVersion) => {
        const state = persistedState ? { ...persistedState } : {};
        if (oldVersion === 0 && Number.isInteger(state.selectedIndex)) {
          state.selectedId = karateSessions[state.selectedIndex]?.id ?? firstId;
          delete state.selectedIndex;
        }
        return state;
      },
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState || {}) };
        // FIX[karate-check-undo]: không reset selectedId về firstId (static).
        // Page effect tự chọn session đầu sau khi Sanity fetch xong.
        // FIX[karate-check-undo]: KHÔNG filter completedIds tại merge().
        // sessions lúc này là static fallback (id 'kt-XX'), còn completedIds
        // persisted từ hôm qua là Sanity _id → filter cũ xoá sạch completion.
        merged.completedIds = Array.isArray(merged.completedIds) ? merged.completedIds : [];
        merged.notes = merged.notes || {};
        merged.lastPracticedAt = merged.lastPracticedAt || {};
        merged.loading = currentState.loading;
        merged.error = currentState.error;
        merged._isFetching = currentState._isFetching;
        merged._fetchedFromSanity = currentState._fetchedFromSanity;
        merged._isRefreshing = currentState._isRefreshing;
        return merged;
      },
      onRehydrateStorage: () => (state) => {
        if (state?.sessions) syncSessionIds(state.sessions);
      },
    }
  )
);

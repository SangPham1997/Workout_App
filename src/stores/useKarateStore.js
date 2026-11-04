import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karate';
import { sanityClient, freshClient } from '../lib/sanity.client';
import { KARATE_SESSIONS_QUERY } from '../lib/queries/karate';
import { adaptKarateSession } from '../lib/adapters/karateSession';
import { cachedFetch } from '../lib/sanityCache';

const firstId = karateSessions[0]?.id ?? null;
const initialSessions = Object.freeze([...karateSessions]);
const sessionIds = new Set(initialSessions.map((s) => s.id));

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

      initFromSanity: async (options = {}) => {
        const { force = false } = options;
        const current = get();

        if (current._isFetching) return;
        if (!force && current._fetchedFromSanity) return;

        const isInitialLoad = !current._fetchedFromSanity;
        set({
          loading: isInitialLoad,
          _isRefreshing: !isInitialLoad,
          error: null,
          _isFetching: true,
        });

        try {
          const client = force ? freshClient : sanityClient;
          const docs = await cachedFetch(client, KARATE_SESSIONS_QUERY, undefined, { force });

          const seen = new Set();
          const adapted = docs
            .map(adaptKarateSession)
            .filter((s) => {
              if (seen.has(s.id)) return false;
              seen.add(s.id);
              return true;
            });

          sessionIds.clear();
          adapted.forEach((s) => sessionIds.add(s.id));

          set({
            sessions: adapted,
            selectedId: sessionIds.has(current.selectedId)
              ? current.selectedId
              : adapted[0]?.id ?? null,
            loading: false,
            _isRefreshing: false,
            error: null,
            _isFetching: false,
            _fetchedFromSanity: true,
          });
        } catch (err) {
          console.error('[useKarateStore] fetch failed:', err);
          set({ error: err, loading: false, _isRefreshing: false, _isFetching: false });
        }
      },

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
        if (!sessionIds.has(merged.selectedId)) merged.selectedId = firstId;
        merged.completedIds = (merged.completedIds || []).filter((id) => sessionIds.has(id));
        merged.notes = merged.notes || {};
        merged.lastPracticedAt = merged.lastPracticedAt || {};
        merged.loading = currentState.loading;
        merged.error = currentState.error;
        merged._isFetching = currentState._isFetching;
        merged._fetchedFromSanity = currentState._fetchedFromSanity;
        return merged;
      },
    }
  )
);
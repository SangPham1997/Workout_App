import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const createProgramStore = ({
  name,
  program,
  version = 1,
  initFromSanity,
}) => {
  const getItemIds = (p) => new Set((p?.items ?? []).map((item) => item.id));
  const firstId = program?.items?.[0]?.id ?? null;

  return create(
    persist(
      (set, get) => ({
        program,
        selectedId: firstId,
        completedIds: [],
        notes: {},

        loading: initFromSanity ? true : false,
        error: null,
        _isFetching: false,
        _fetchedFromSanity: false,
        _isRefreshing: false,

        ...(initFromSanity
          ? {
              initFromSanity: async (options = {}) => {
                const current = get();
                if (current._isFetching) return;
                if (!options.force && current._fetchedFromSanity) return;

                const isInitialLoad = !current._fetchedFromSanity;
                set({
                  loading: isInitialLoad,
                  _isRefreshing: !isInitialLoad,
                  error: null,
                  _isFetching: true,
                });

                try {
                  const fnResult = initFromSanity({
                    set,
                    get,
                    initialProgram: program,
                  });

                  let promise;
                  if (typeof fnResult === 'function') {
                    promise = fnResult(options);
                  } else if (fnResult && typeof fnResult.then === 'function') {
                    promise = fnResult;
                  } else {
                    promise = Promise.resolve(fnResult);
                  }

                  await promise;

                  // Không ghi đè error nếu init impl đã set error, nhưng đảm
                  // bảo cờ runtime luôn được reset.
                  set((state) => ({
                    loading: false,
                    _isRefreshing: false,
                    _isFetching: false,
                    error: state.error ?? null,
                  }));
                } catch (err) {
                  console.error(`[${name}] initFromSanity failed:`, err);
                  set({
                    error: err,
                    loading: false,
                    _isRefreshing: false,
                    _isFetching: false,
                  });
                }
              },
            }
          : {}),

        selectItem: (id) => {
          const { program: p } = get();
          if (!getItemIds(p).has(id)) return;
          set({ selectedId: id });
        },

        toggleComplete: (id) => {
          const { program: p } = get();
          if (!getItemIds(p).has(id)) return;
          set((state) => ({
            completedIds: state.completedIds.includes(id)
              ? state.completedIds.filter((x) => x !== id)
              : [...state.completedIds, id],
          }));
        },

        setNote: (id, text) => {
          const { program: p } = get();
          if (!getItemIds(p).has(id)) return;
          set((state) => {
            const notes = { ...state.notes };
            if (text?.trim()) notes[id] = text;
            else delete notes[id];
            return { notes };
          });
        },

        getSelectedItem: () => {
          const { program: p, selectedId } = get();
          return (
            p?.items?.find((item) => item.id === selectedId) ??
            p?.items?.[0] ??
            null
          );
        },
      }),
      {
        name,
        version,
        partialize: (state) => ({
          selectedId: state.selectedId,
          completedIds: state.completedIds,
          notes: state.notes,
        }),
        migrate: (persistedState, oldVersion) => {
          const state = persistedState ? { ...persistedState } : {};
          if (oldVersion === 0 && Number.isInteger(state.selectedIndex)) {
            state.selectedId = program.items[state.selectedIndex]?.id ?? firstId;
            delete state.selectedIndex;
          }
          return state;
        },
        merge: (persistedState, currentState) => {
          const merged = { ...currentState, ...(persistedState || {}) };
            // FIX[program-empty-initial]: không filter completedIds / reset selectedId
            merged.completedIds = Array.isArray(merged.completedIds)
              ? merged.completedIds
              : [];
          merged.notes = merged.notes || {};
          merged.loading = currentState.loading;
          merged.error = currentState.error;
          merged._isFetching = currentState._isFetching;
          merged._fetchedFromSanity = currentState._fetchedFromSanity;
          merged._isRefreshing = currentState._isRefreshing;
          return merged;
        },
      }
    )
  );
};

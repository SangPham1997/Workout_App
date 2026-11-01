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

        ...(initFromSanity
          ? {
              initFromSanity: async (options = {}) => {
                const current = get();
                const loadedFromSanity = current.program !== program;
                if (current._isFetching) return;
                if (!options.force && current._fetchedFromSanity) return;

                set({ loading: true, error: null, _isFetching: true });

                try {
                  const fnResult = initFromSanity({ set, get, initialProgram: program });

                  let promise;
                  if (typeof fnResult === 'function') {
                    promise = fnResult(options);
                  } else if (fnResult && typeof fnResult.then === 'function') {
                    promise = fnResult;
                  } else {
                    promise = Promise.resolve(fnResult);
                  }

                  await promise;

                  set((state) => ({
                    loading: false,
                    _isFetching: false,
                    error: state.error ?? null,
                  }));
                } catch (err) {
                  console.error(`[${name}] initFromSanity failed:`, err);
                  set({ error: err, loading: false, _isFetching: false });
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
          return p?.items?.find((item) => item.id === selectedId) ?? p?.items?.[0] ?? null;
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
          const currentIds = getItemIds(merged.program);
          if (!currentIds.has(merged.selectedId)) merged.selectedId = firstId;
          merged.completedIds = (merged.completedIds || []).filter((id) => currentIds.has(id));
          merged.notes = merged.notes || {};
          merged.loading = currentState.loading;
          merged.error = currentState.error;
          merged._isFetching = currentState._isFetching;
          merged._fetchedFromSanity = currentState._fetchedFromSanity;
          return merged;
        },
      }
    )
  );
};
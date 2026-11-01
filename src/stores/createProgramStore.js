import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store dùng chung cho một "Program".
 *
 * `initFromSanity` hỗ trợ 2 pattern:
 *  - Function thường:  async () => {...}
 *  - Curried function: ({ set, get, initialProgram }) => async () => {...}
 *
 * Factory tự unwrap và đảm bảo loading luôn reset sau khi xong.
 */
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

        // ===== SANITY LOADER (unwrap curried fn) =====
        ...(initFromSanity
          ? {
              initFromSanity: async () => {
                const current = get();
                const loadedFromSanity = current.program !== program;
                if (!current.loading && loadedFromSanity) {
                  console.debug(`[${name}] already loaded, skip`);
                  return;
                }

                set({ loading: true, error: null });

                try {
                  const fnResult = initFromSanity({ set, get, initialProgram: program });

                  let promise;
                  if (typeof fnResult === 'function') {
                    promise = fnResult();
                  } else if (fnResult && typeof fnResult.then === 'function') {
                    promise = fnResult;
                  } else {
                    promise = Promise.resolve(fnResult);
                  }

                  await promise;

                  set((state) => ({
                    loading: false,
                    error: state.error ?? null,
                  }));

                  console.debug(`[${name}] initFromSanity completed`);
                } catch (err) {
                  console.error(`[${name}] initFromSanity failed:`, err);
                  set({ error: err, loading: false });
                }
              },
            }
          : {}),

        // ===== ACTIONS =====
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
          return merged;
        },
      }
    )
  );
};
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store dùng chung cho một "Program" dạng danh sách bài.
 *
 * - Lưu `selectedId` thay vì index để thêm/xoá bài không làm lệch lựa chọn.
 * - `completedIds` + `notes` là dữ liệu người dùng, được persist.
 * - Có migrate từ schema cũ `selectedIndex` (version 0).
 */
export const createProgramStore = ({ name, program, version = 1 }) => {
  const items = program.items;
  const firstId = items[0]?.id ?? null;
  const itemIds = new Set(items.map((item) => item.id));

  return create(
    persist(
      (set, get) => ({
        program,
        selectedId: firstId,
        completedIds: [],
        notes: {},

        selectItem: (id) => {
          if (!itemIds.has(id)) return;
          set({ selectedId: id });
        },

        toggleComplete: (id) => {
          if (!itemIds.has(id)) return;
          set((state) => ({
            completedIds: state.completedIds.includes(id)
              ? state.completedIds.filter((x) => x !== id)
              : [...state.completedIds, id],
          }));
        },

        setNote: (id, text) => {
          if (!itemIds.has(id)) return;
          set((state) => {
            const notes = { ...state.notes };
            if (text?.trim()) notes[id] = text;
            else delete notes[id];
            return { notes };
          });
        },

        getSelectedItem: () => {
          const { program: currentProgram, selectedId } = get();
          return (
            currentProgram.items.find((item) => item.id === selectedId) ??
            currentProgram.items[0] ??
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
            state.selectedId = items[state.selectedIndex]?.id ?? firstId;
            delete state.selectedIndex;
          }
          return state;
        },
        merge: (persistedState, currentState) => {
          const merged = { ...currentState, ...(persistedState || {}) };
          if (!itemIds.has(merged.selectedId)) merged.selectedId = firstId;
          merged.completedIds = (merged.completedIds || []).filter((id) =>
            itemIds.has(id)
          );
          merged.notes = merged.notes || {};
          return merged;
        },
      }
    )
  );
};

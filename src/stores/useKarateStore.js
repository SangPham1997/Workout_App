import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karateSessions';

export const useKarateStore = create(
  persist(
    (set) => ({
      sessions: karateSessions,
      selectedIndex: 0,
      completedIds: [],   // các buổi đã đánh dấu hoàn thành (lưu localStorage)
      notes: {},          // ghi chú tập theo từng buổi

      selectSession: (index) => set({ selectedIndex: index }),

      toggleComplete: (id) =>
        set((state) => ({
          completedIds: state.completedIds.includes(id)
            ? state.completedIds.filter((x) => x !== id)
            : [...state.completedIds, id],
        })),

      setNote: (id, note) =>
        set((state) => {
          const notes = { ...state.notes };
          if (note && note.trim()) notes[id] = note;
          else delete notes[id];
          return { notes };
        }),
    }),
    {
      name: 'karate-storage',
      partialize: (state) => ({
        selectedIndex: state.selectedIndex,
        completedIds: state.completedIds,
        notes: state.notes,
      }),
      // Clamp index khi hydrate (dữ liệu buổi tập có thể thay đổi giữa các bản).
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted || {}) };
        const max = merged.sessions.length - 1;
        if (
          !Number.isInteger(merged.selectedIndex) ||
          merged.selectedIndex < 0 ||
          merged.selectedIndex > max
        ) {
          merged.selectedIndex = 0;
        }
        return merged;
      },
    }
  )
);
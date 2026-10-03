import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karateSessions';

export const useKarateStore = create(
  persist(
    (set, get) => ({
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

      getSelectedSession: () => {
        const { sessions, selectedIndex } = get();
        return sessions[selectedIndex] || null;
      },

      resetAll: () => set({ selectedIndex: 0 }),
    }),
    {
      name: 'karate-storage',
      partialize: (state) => ({
        selectedIndex: state.selectedIndex,
        completedIds: state.completedIds,
        notes: state.notes,
      }),
    }
  )
);
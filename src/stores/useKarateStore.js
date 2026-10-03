import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karateSessions';

export const useKarateStore = create(
  persist(
    (set, get) => ({
      sessions: karateSessions,
      selectedIndex: 0,

      selectSession: (index) => set({ selectedIndex: index }),

      getSelectedSession: () => {
        const { sessions, selectedIndex } = get();
        return sessions[selectedIndex] || null;
      },

      resetAll: () => set({ selectedIndex: 0 }),
    }),
    {
      name: 'karate-storage',
      partialize: (state) => ({ selectedIndex: state.selectedIndex }),
    }
  )
);
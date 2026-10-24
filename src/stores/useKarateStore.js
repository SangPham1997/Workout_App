import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { karateSessions } from '../data/karate';

const sessionIds = new Set(karateSessions.map((session) => session.id));
const firstId = karateSessions[0]?.id ?? null;

export const useKarateStore = create(
  persist(
    (set, get) => ({
      sessions: karateSessions,
      selectedId: firstId,
      completedIds: [], // các buổi đã đánh dấu hoàn thành (lưu localStorage)
      notes: {}, // ghi chú tập theo từng buổi
      lastPracticedAt: {}, // id -> timestamp lần hoàn thành gần nhất

      selectSession: (id) => {
        if (!sessionIds.has(id)) return;
        set({ selectedId: id });
      },

      getSelectedSession: () => {
        const { sessions, selectedId } = get();
        return sessions.find((session) => session.id === selectedId) ?? sessions[0] ?? null;
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
      version: 1,
      partialize: (state) => ({
        selectedId: state.selectedId,
        completedIds: state.completedIds,
        notes: state.notes,
        lastPracticedAt: state.lastPracticedAt,
      }),
      // v0 lưu selectedIndex; đổi sang selectedId để dữ liệu buổi tập thay đổi
      // không làm lệch buổi đang chọn.
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
        merged.sessions = karateSessions;
        if (!sessionIds.has(merged.selectedId)) merged.selectedId = firstId;
        merged.completedIds = (merged.completedIds || []).filter((id) =>
          sessionIds.has(id)
        );
        merged.notes = merged.notes || {};
        merged.lastPracticedAt = merged.lastPracticedAt || {};
        return merged;
      },
    }
  )
);

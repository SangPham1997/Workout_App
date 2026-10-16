import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ===== STREAK CALCULATION =====
function calculateStreak(dates = []) {
  if (!dates.length) return 0;

  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .slice(0, 10);

  // Không check hôm nay và hôm qua → streak = 0
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i - 1]);
    const prev = new Date(sorted[i]);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ===== STORE =====
export const useHabitStore = create(
  persist(
    (set, get) => ({
      // ===== STATE =====
      habits: [],
      checkIns: {},
      lastOpenDate: null,

      // ===== ACTIONS =====
      addHabit: (habit) => {
        const newHabit = {
          id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString().slice(0, 10),
          freezeAvailable: 1,
          archivedAt: null,
          twoMinuteMode: false,
          stackAfter: null,
          ...habit,
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
        return newHabit.id;
      },

      deleteHabit: (id) =>
        set((state) => {
          const nextCheckIns = { ...state.checkIns };
          delete nextCheckIns[id];
          return {
            habits: state.habits.filter((h) => h.id !== id),
            checkIns: nextCheckIns,
          };
        }),

      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...patch } : h
          ),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, archivedAt: new Date().toISOString().slice(0, 10) }
              : h
          ),
        })),

      checkIn: (habitId, date) => {
        const d = date || new Date().toISOString().slice(0, 10);
        set((state) => {
          const current = state.checkIns[habitId] || [];
          if (current.includes(d)) return state;
          return {
            checkIns: {
              ...state.checkIns,
              [habitId]: [...current, d].sort(),
            },
          };
        });
      },

      undoCheckIn: (habitId, date) => {
        const d = date || new Date().toISOString().slice(0, 10);
        set((state) => ({
          checkIns: {
            ...state.checkIns,
            [habitId]: (state.checkIns[habitId] || []).filter((x) => x !== d),
          },
        }));
      },

      useFreeze: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit || habit.freezeAvailable <= 0) return false;

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .slice(0, 10);

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId
              ? { ...h, freezeAvailable: h.freezeAvailable - 1 }
              : h
          ),
          checkIns: {
            ...state.checkIns,
            [habitId]: [
              ...new Set([...(state.checkIns[habitId] || []), yesterday]),
            ].sort(),
          },
        }));
        return true;
      },

      resetMonthlyFreeze: () => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const lastMonth = get().lastOpenDate?.slice(0, 7);

        if (lastMonth === currentMonth) return;

        set((state) => ({
          habits: state.habits.map((h) => ({ ...h, freezeAvailable: 1 })),
          lastOpenDate: new Date().toISOString().slice(0, 10),
        }));
      },

      // ===== SELECTORS =====
      getTodayHabits: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        return state.habits
          .filter((h) => !h.archivedAt)
          .map((h) => ({
            ...h,
            isCheckedInToday: (state.checkIns[h.id] || []).includes(today),
            streak: calculateStreak(state.checkIns[h.id] || []),
            totalCheckIns: (state.checkIns[h.id] || []).length,
          }))
          .sort((a, b) => b.streak - a.streak);
      },

      getStreak: (habitId) => calculateStreak(get().checkIns[habitId] || []),

      getCheckIns: (habitId) => get().checkIns[habitId] || [],

      getLongestStreak: (habitId) => {
        const dates = (get().checkIns[habitId] || []).sort();
        if (!dates.length) return 0;
        let longest = 1;
        let current = 1;
        for (let i = 1; i < dates.length; i++) {
          const diff = Math.round(
            (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000
          );
          if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
          } else {
            current = 1;
          }
        }
        return longest;
      },
    }),
    {
      name: 'habit-tracker-storage',
      version: 1,
      partialize: (state) => ({
        habits: state.habits,
        checkIns: state.checkIns,
        lastOpenDate: state.lastOpenDate,
      }),
    }
  )
);

export { calculateStreak };
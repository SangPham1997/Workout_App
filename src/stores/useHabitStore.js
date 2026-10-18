import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TWO_MINUTE_MAX_PER_WEEK = 2;

// ===== STREAK CALCULATION =====
function calculateStreak(dates = []) {
  if (!dates.length) return 0;
  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (new Date(sorted[i - 1]) - new Date(sorted[i])) / 86400000
    );
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ===== WEEK START =====
function getWeekStart() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

// ===== STORE =====
export const useHabitStore = create(
  persist(
    (set, get) => ({
      // ===== STATE =====
      habits: [],
      checkIns: {},
      twoMinuteUsage: {}, // { [habitId]: { weekStart, count } }
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
        set((state) => ({ habits: [...state.habits, newHabit] }));
        return newHabit.id;
      },

      // ✏️ EDIT
      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...patch } : h
          ),
        })),

      // 🗄️ ARCHIVE
      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, archivedAt: new Date().toISOString().slice(0, 10) }
              : h
          ),
        })),

      // ♻️ UNARCHIVE
      unarchiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archivedAt: null } : h
          ),
        })),

      // 🗑️ DELETE
      deleteHabit: (id) =>
        set((state) => {
          const nextCheckIns = { ...state.checkIns };
          const nextTwoMin = { ...state.twoMinuteUsage };
          delete nextCheckIns[id];
          delete nextTwoMin[id];
          return {
            habits: state.habits.filter((h) => h.id !== id),
            checkIns: nextCheckIns,
            twoMinuteUsage: nextTwoMin,
          };
        }),

      // ✅ CHECK-IN
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

      // ⏱️ 2-MINUTE CHECK-IN (có tracking + giới hạn)
      markTwoMinuteCheckIn: (habitId) => {
        if (!get().canUseTwoMinute(habitId)) return false;

        const weekStart = getWeekStart();
        const today = new Date().toISOString().slice(0, 10);

        set((state) => {
          const current = state.checkIns[habitId] || [];
          const nextCheckIns = current.includes(today)
            ? state.checkIns
            : { ...state.checkIns, [habitId]: [...current, today].sort() };

          const prevUsage = state.twoMinuteUsage[habitId];
          const count =
            prevUsage?.weekStart === weekStart ? prevUsage.count + 1 : 1;

          return {
            checkIns: nextCheckIns,
            twoMinuteUsage: {
              ...state.twoMinuteUsage,
              [habitId]: { weekStart, count },
            },
          };
        });

        return true;
      },

      // ↩️ UNDO
      undoCheckIn: (habitId, date) => {
        const d = date || new Date().toISOString().slice(0, 10);
        set((state) => ({
          checkIns: {
            ...state.checkIns,
            [habitId]: (state.checkIns[habitId] || []).filter((x) => x !== d),
          },
        }));
      },

      // 🧊 USE FREEZE
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

      // 🔄 RESET MONTHLY FREEZE
      resetMonthlyFreeze: () => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const lastMonth = get().lastOpenDate?.slice(0, 7);
        if (lastMonth === currentMonth) return;

        set((state) => ({
          habits: state.habits.map((h) => ({ ...h, freezeAvailable: 1 })),
          lastOpenDate: new Date().toISOString().slice(0, 10),
        }));
      },

      // 📤 EXPORT
      exportData: () => {
        const { habits, checkIns, twoMinuteUsage, lastOpenDate } = get();
        return JSON.stringify(
          {
            version: 2,
            exportedAt: new Date().toISOString(),
            habits,
            checkIns,
            twoMinuteUsage,
            lastOpenDate,
          },
          null,
          2
        );
      },

      // 📥 IMPORT
      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          if (!Array.isArray(data.habits)) {
            return { success: false, error: 'Định dạng không hợp lệ' };
          }
          set({
            habits: data.habits,
            checkIns: data.checkIns || {},
            twoMinuteUsage: data.twoMinuteUsage || {},
            lastOpenDate: data.lastOpenDate || null,
          });
          return { success: true, count: data.habits.length };
        } catch (e) {
          return { success: false, error: e.message };
        }
      },

      // ===== SELECTORS =====
      getTodayHabits: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        return state.habits
          .filter((h) => !h.archivedAt)
          .map((h) => {
            const dates = state.checkIns[h.id] || [];
            return {
              ...h,
              isCheckedInToday: dates.includes(today),
              streak: calculateStreak(dates),
              totalCheckIns: dates.length,
              longestStreak: get().getLongestStreak(h.id),
            };
          })
          .sort((a, b) => b.streak - a.streak);
      },

      getArchivedHabits: () =>
        get().habits.filter((h) => h.archivedAt),

      getStreak: (habitId) => calculateStreak(get().checkIns[habitId] || []),

      getCheckIns: (habitId) => get().checkIns[habitId] || [],

      getLongestStreak: (habitId) => {
        const dates = [...(get().checkIns[habitId] || [])].sort();
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
          } else current = 1;
        }
        return longest;
      },

      // 📊 HABIT STATS
      getHabitStats: (habitId) => {
        const dates = get().checkIns[habitId] || [];
        const today = new Date();
        let last30 = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          if (dates.includes(d.toISOString().slice(0, 10))) last30++;
        }
        return {
          currentStreak: calculateStreak(dates),
          longestStreak: get().getLongestStreak(habitId),
          totalCheckIns: dates.length,
          last30Days: last30,
          completionRate: Math.round((last30 / 30) * 100),
        };
      },

      // ⏱️ TWO-MINUTE USAGE
      getWeekStart,

      getTwoMinuteUsage: (habitId) => {
        const weekStart = getWeekStart();
        const usage = get().twoMinuteUsage[habitId];
        if (!usage || usage.weekStart !== weekStart) return 0;
        return usage.count;
      },

      canUseTwoMinute: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit?.twoMinuteMode) return false;
        return get().getTwoMinuteUsage(habitId) < TWO_MINUTE_MAX_PER_WEEK;
      },

      getTwoMinuteRemaining: (habitId) =>
        Math.max(0, TWO_MINUTE_MAX_PER_WEEK - get().getTwoMinuteUsage(habitId)),
    }),
    {
      name: 'habit-tracker-storage',
      version: 2,
      partialize: (state) => ({
        habits: state.habits,
        checkIns: state.checkIns,
        twoMinuteUsage: state.twoMinuteUsage,
        lastOpenDate: state.lastOpenDate,
      }),
      migrate: (persistedState, version) => {
        if (version < 2) {
          return { ...persistedState, twoMinuteUsage: {} };
        }
        return persistedState;
      },
    }
  )
);

export { calculateStreak, getWeekStart };
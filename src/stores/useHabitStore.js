import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addDaysKey,
  getMonthKey,
  getWeekStartKey,
  todayKey,
} from '../utils/dateKey';
import { calculateLongestStreak, calculateStreak } from '../utils/habitStats';
import { TWO_MINUTE_MAX_PER_WEEK } from '../data/habitSettings';

const EMPTY_DATES = Object.freeze([]);

// ===== DERIVED STATE CACHE =====
// `selectTodayHabits` tạo object mới cho mỗi habit. Nếu tạo lại mọi object ở
// mọi lần check-in, toàn bộ HabitCard (memo) sẽ re-render dù chỉ 1 habit đổi.
// Cache theo id + tham chiếu habit/dates/usage giữ nguyên object cũ khi dữ liệu
// của habit đó không thay đổi → memo của HabitCard mới có tác dụng.
const derivedCache = new Map();

function clearDerivedCache() {
  derivedCache.clear();
}

function getTwoMinuteUsageCount(usage, weekStart) {
  return usage && usage.weekStart === weekStart ? usage.count : 0;
}

/**
 * Selector thuần (dùng trực tiếp với zustand + useShallow).
 * Trả về danh sách habit chưa archive kèm dữ liệu dẫn xuất.
 */
export function selectTodayHabits(state) {
  const today = todayKey();
  const weekStart = getWeekStartKey();
  const yesterday = addDaysKey(today, -1);
  const result = [];

  for (const habit of state.habits) {
    if (habit.archivedAt) continue;

    const dates = state.checkIns[habit.id] || EMPTY_DATES;
    const usage = state.twoMinuteUsage[habit.id];
    const cached = derivedCache.get(habit.id);

    if (
      cached &&
      cached.habit === habit &&
      cached.dates === dates &&
      cached.usage === usage &&
      cached.today === today
    ) {
      result.push(cached.value);
      continue;
    }

    const isCheckedInToday = dates.includes(today);
    const streak = calculateStreak(dates, today);
    const missedYesterday =
      !isCheckedInToday &&
      streak === 0 &&
      dates.length > 0 &&
      !dates.includes(yesterday);

    const value = {
      ...habit,
      isCheckedInToday,
      streak,
      totalCheckIns: dates.length,
      longestStreak: calculateLongestStreak(dates),
      missedYesterday,
      canFreeze: missedYesterday && (habit.freezeAvailable || 0) > 0,
      twoMinuteRemaining: Math.max(
        0,
        TWO_MINUTE_MAX_PER_WEEK - getTwoMinuteUsageCount(usage, weekStart)
      ),
    };

    derivedCache.set(habit.id, { habit, dates, usage, today, value });
    result.push(value);
  }

  // Giữ nguyên thứ tự cũ: chuỗi dài lên trước (sort ổn định của JS).
  return result.sort((a, b) => b.streak - a.streak);
}

/** Habit kế tiếp trong chuỗi (habit stacking) đang chưa được check-in. */
export function selectNextChainHabit(state, habitId) {
  return (
    selectTodayHabits(state).find(
      (habit) =>
        habit.id !== habitId &&
        habit.stackAfter === habitId &&
        !habit.isCheckedInToday
    ) || null
  );
}

/** Gom các action (tham chiếu luôn ổn định) để subscribe 1 lần. */
export function selectHabitActions(state) {
  return {
    addHabit: state.addHabit,
    updateHabit: state.updateHabit,
    archiveHabit: state.archiveHabit,
    unarchiveHabit: state.unarchiveHabit,
    deleteHabit: state.deleteHabit,
    checkIn: state.checkIn,
    markTwoMinuteCheckIn: state.markTwoMinuteCheckIn,
    undoCheckIn: state.undoCheckIn,
    applyFreeze: state.applyFreeze,
    resetMonthlyFreeze: state.resetMonthlyFreeze,
    exportData: state.exportData,
    importData: state.importData,
    canUseTwoMinute: state.canUseTwoMinute,
  };
}

// ===== VALIDATION (dữ liệu import từ file ngoài) =====
const isValidHabit = (habit) =>
  habit && typeof habit === 'object' && typeof habit.id === 'string' && habit.id;

const isValidDateKey = (value) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

function sanitizeCheckIns(raw) {
  const checkIns = {};
  if (!raw || typeof raw !== 'object') return checkIns;

  for (const [habitId, dates] of Object.entries(raw)) {
    if (!Array.isArray(dates)) continue;
    const clean = [...new Set(dates.filter(isValidDateKey))].sort();
    if (clean.length) checkIns[habitId] = clean;
  }
  return checkIns;
}

function sanitizeTwoMinuteUsage(raw) {
  const usage = {};
  if (!raw || typeof raw !== 'object') return usage;

  for (const [habitId, value] of Object.entries(raw)) {
    if (!value || typeof value !== 'object') continue;
    if (typeof value.weekStart !== 'string' || !Number.isFinite(value.count)) continue;
    usage[habitId] = { weekStart: value.weekStart, count: value.count };
  }
  return usage;
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
          createdAt: todayKey(),
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
            h.id === id ? { ...h, archivedAt: todayKey() } : h
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
          derivedCache.delete(id);
          return {
            habits: state.habits.filter((h) => h.id !== id),
            checkIns: nextCheckIns,
            twoMinuteUsage: nextTwoMin,
          };
        }),

      // ✅ CHECK-IN
      checkIn: (habitId, date) => {
        const d = date || todayKey();
        set((state) => {
          const current = state.checkIns[habitId] || EMPTY_DATES;
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

        const weekStart = getWeekStartKey();
        const today = todayKey();

        set((state) => {
          const current = state.checkIns[habitId] || EMPTY_DATES;
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
        const d = date || todayKey();
        set((state) => {
          const current = state.checkIns[habitId];
          if (!current?.includes(d)) return state;
          return {
            checkIns: {
              ...state.checkIns,
              [habitId]: current.filter((x) => x !== d),
            },
          };
        });
      },

      // 🧊 USE FREEZE
      applyFreeze: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit || (habit.freezeAvailable || 0) <= 0) return false;

        const yesterday = addDaysKey(todayKey(), -1);
        const current = get().checkIns[habitId] || EMPTY_DATES;
        if (current.includes(yesterday)) return false;

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId
              ? { ...h, freezeAvailable: (h.freezeAvailable || 0) - 1 }
              : h
          ),
          checkIns: {
            ...state.checkIns,
            [habitId]: [...current, yesterday].sort(),
          },
        }));
        return true;
      },

      // 🔄 RESET MONTHLY FREEZE
      resetMonthlyFreeze: () => {
        const currentMonth = getMonthKey(todayKey());
        const lastMonth = get().lastOpenDate
          ? getMonthKey(get().lastOpenDate)
          : null;
        if (lastMonth === currentMonth) return;

        set((state) => ({
          habits: state.habits.map((h) =>
            h.freezeAvailable === 1 ? h : { ...h, freezeAvailable: 1 }
          ),
          lastOpenDate: todayKey(),
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
          if (!data || !Array.isArray(data.habits)) {
            return { success: false, error: 'Định dạng không hợp lệ' };
          }

          const habits = data.habits.filter(isValidHabit);
          clearDerivedCache();
          set({
            habits,
            checkIns: sanitizeCheckIns(data.checkIns),
            twoMinuteUsage: sanitizeTwoMinuteUsage(data.twoMinuteUsage),
            lastOpenDate:
              typeof data.lastOpenDate === 'string' ? data.lastOpenDate : null,
          });
          return { success: true, count: habits.length };
        } catch (e) {
          return { success: false, error: e.message };
        }
      },

      // ⏱️ TWO-MINUTE USAGE
      canUseTwoMinute: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit?.twoMinuteMode) return false;
        const usage = get().twoMinuteUsage[habitId];
        return (
          getTwoMinuteUsageCount(usage, getWeekStartKey()) <
          TWO_MINUTE_MAX_PER_WEEK
        );
      },
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

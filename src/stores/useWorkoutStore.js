import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/*
  useWorkoutStore — trạng thái buổi tập, lưu localStorage (Sprint 3):
  - completedIds: các bài đã hoàn thành trong lộ trình hôm nay
  - routeCompleted / celebrationShown: cờ hiển thị Celebration Modal
  - focusMode: Sprint 2 — chế độ toàn màn hình, ẩn UI phụ
  Nếu người dùng tải lại trang giữa buổi, tiến độ được khôi phục.
*/

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      date: todayKey(),
      completedIds: [],
      celebrationOpen: false,
      celebrationShown: false,
      focusMode: false,

      /** đánh dấu 1 bài hoàn thành (idempotent) */
      completeExercise: (id) => {
        const { completedIds, exercisesTotal } = get();
        if (completedIds.includes(id)) return;
        const next = [...completedIds, id];
        const doneAll = exercisesTotal > 0 && next.length >= exercisesTotal;
        set({
          completedIds: next,
          celebrationOpen: doneAll && !get().celebrationShown,
          celebrationShown: doneAll ? true : get().celebrationShown,
        });
      },

      undoExercise: (id) =>
        set((s) => ({
          completedIds: s.completedIds.filter((x) => x !== id),
          celebrationShown: false,
        })),

      setExercisesTotal: (n) => {
        if (get().exercisesTotal !== n) set({ exercisesTotal: n });
      },

      closeCelebration: () => set({ celebrationOpen: false }),

      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),

      /** reset ngày mới tự động + nút "Tập lại từ đầu" */
      resetSession: () =>
        set({
          date: todayKey(),
          completedIds: [],
          celebrationOpen: false,
          celebrationShown: false,
        }),
    }),
    {
      name: 'workout-progress',
      partialize: (s) => ({
        date: s.date,
        completedIds: s.completedIds,
        celebrationShown: s.celebrationShown,
      }),
      merge: (persisted, current) => {
        const p = persisted ?? {};
        // sang ngày mới -> tự xóa tiến độ cũ
        const isSameDay = p.date === current.date;
        return {
          ...current,
          ...p,
          date: current.date,
          completedIds: isSameDay ? (p.completedIds ?? []) : [],
          celebrationShown: isSameDay ? (p.celebrationShown ?? false) : false,
        };
      },
    }
  )
);

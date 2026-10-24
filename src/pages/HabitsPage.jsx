import { useState, useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  selectHabitActions,
  selectNextChainHabit,
  selectTodayHabits,
  useHabitStore,
} from '../stores/useHabitStore';
import { playStreakSound, hapticCheckIn } from '../utils/habitFeedback';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HabitList from '../components/habits/HabitList';
import AddHabitModal from '../components/habits/AddHabitModal';
import EditHabitModal from '../components/habits/EditHabitModal';
import StreakBadge from '../components/habits/StreakBadge';
import CalendarHeatmap from '../components/habits/CalendarHeatmap';
import HabitSelector from '../components/habits/HabitSelector';
import HabitChainPrompt from '../components/habits/HabitChainPrompt';
import TwoMinuteTimer from '../components/habits/TwoMinuteTimer';
import HabitStats from '../components/habits/HabitStats';
import BackupMenu from '../components/habits/BackupMenu';

const EMPTY_DATES = Object.freeze([]);

export default function HabitsPage() {
  // Derived list: object của habit không đổi thì giữ nguyên tham chiếu,
  // nhờ vậy HabitCard (memo) bỏ qua re-render khi habit khác thay đổi.
  const todayHabits = useHabitStore(useShallow(selectTodayHabits));
  const habits = useHabitStore((s) => s.habits);
  const {
    undoCheckIn,
    deleteHabit,
    archiveHabit,
    updateHabit,
    applyFreeze,
    resetMonthlyFreeze,
    markTwoMinuteCheckIn,
    exportData,
    importData,
  } = useHabitStore(useShallow(selectHabitActions));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [chainPrompt, setChainPrompt] = useState(null);
  const [twoMinuteHabit, setTwoMinuteHabit] = useState(null);

  useEffect(() => {
    resetMonthlyFreeze();
  }, [resetMonthlyFreeze]);

  const { totalStreak, completedToday } = useMemo(() => {
    let maxStreak = 0;
    let completed = 0;
    for (const habit of todayHabits) {
      if (habit.streak > maxStreak) maxStreak = habit.streak;
      if (habit.isCheckedInToday) completed++;
    }
    return { totalStreak: maxStreak, completedToday: completed };
  }, [todayHabits]);

  const totalHabits = todayHabits.length;

  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return todayHabits[0] || null;
    return todayHabits.find((h) => h.id === selectedHabitId) || todayHabits[0];
  }, [selectedHabitId, todayHabits]);

  const selectedHabitIdForHeatmap = selectedHabit?.id;
  const checkInDates =
    useHabitStore((s) =>
      selectedHabitIdForHeatmap
        ? s.checkIns[selectedHabitIdForHeatmap]
        : undefined
    ) || EMPTY_DATES;

  // ===== HANDLERS =====
  // Đọc state trực tiếp từ store để callback giữ được tham chiếu ổn định
  // (nếu phụ thuộc `todayHabits` thì mọi HabitCard sẽ re-render sau mỗi check-in).
  const handleCheckIn = useCallback((habitId) => {
    const state = useHabitStore.getState();
    const habit = selectTodayHabits(state).find((h) => h.id === habitId);

    state.checkIn(habitId);

    // Streak milestone: chỉ phát sound, không toast
    if (habit && habit.streak > 0 && (habit.streak + 1) % 7 === 0) {
      setTimeout(() => playStreakSound(), 600);
    }

    const next = selectNextChainHabit(useHabitStore.getState(), habitId);
    if (next && habit) {
      setTimeout(
        () => setChainPrompt({ fromHabit: habit, toHabit: next }),
        600
      );
    }
  }, []);

  const handleUndoCheckIn = useCallback(
    (habitId) => {
      undoCheckIn(habitId);
    },
    [undoCheckIn]
  );

  const handleDelete = useCallback(
    (habitId) => {
      deleteHabit(habitId);
    },
    [deleteHabit]
  );

  const handleArchive = useCallback(
    (habitId) => {
      archiveHabit(habitId);
    },
    [archiveHabit]
  );

  const handleEdit = useCallback((habit) => {
    setEditingHabit(habit);
  }, []);

  const handleSaveEdit = useCallback(
    (patch) => {
      if (!editingHabit) return;
      updateHabit(editingHabit.id, patch);
      setEditingHabit(null);
    },
    [editingHabit, updateHabit]
  );

  const handleApplyFreeze = useCallback(
    (habitId) => {
      applyFreeze(habitId);
    },
    [applyFreeze]
  );

  const handleChainConfirm = useCallback(() => {
    if (!chainPrompt) return;
    useHabitStore.getState().checkIn(chainPrompt.toHabit.id);
    hapticCheckIn();
    setChainPrompt(null);

    const next = selectNextChainHabit(
      useHabitStore.getState(),
      chainPrompt.toHabit.id
    );
    if (next) {
      setTimeout(
        () =>
          setChainPrompt({
            fromHabit: chainPrompt.toHabit,
            toHabit: next,
          }),
        700
      );
    }
  }, [chainPrompt]);

  const handleTwoMinuteStart = useCallback((habitId) => {
    const state = useHabitStore.getState();
    if (!state.canUseTwoMinute(habitId)) return;
    const habit = selectTodayHabits(state).find((h) => h.id === habitId);
    if (habit) setTwoMinuteHabit(habit);
  }, []);

  const handleTwoMinuteComplete = useCallback(() => {
    if (!twoMinuteHabit) return;

    const snapshot = twoMinuteHabit;
    markTwoMinuteCheckIn(snapshot.id);
    setTwoMinuteHabit(null);

    const next = selectNextChainHabit(useHabitStore.getState(), snapshot.id);
    if (next) {
      setTimeout(
        () => setChainPrompt({ fromHabit: snapshot, toHabit: next }),
        700
      );
    }
  }, [twoMinuteHabit, markTwoMinuteCheckIn]);

  const handleTwoMinuteCancel = useCallback(() => setTwoMinuteHabit(null), []);

  const openAddModal = useCallback(() => setIsModalOpen(true), []);

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-grow">
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-emerald-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-emerald-500/30 p-5 shadow-2xl overflow-hidden mb-5">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
                <i className="fa-solid fa-check-double"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Thói quen
                </h1>
                <p className="text-xs text-slate-400 capitalize">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <BackupMenu onExport={exportData} onImport={importData} />
              <StreakBadge streak={totalStreak} size="lg" />
            </div>
          </div>

          {totalHabits > 0 && (
            <div className="relative mt-4">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-slate-400">Tiến độ hôm nay</span>
                <span className="font-bold text-white">
                  {completedToday}/{totalHabits}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${(completedToday / totalHabits) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* STATS */}
        <HabitStats habits={todayHabits} />

        {/* HABITS */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-calendar-day text-emerald-400"></i>
              Hôm nay
            </h2>
            <button
              type="button"
              onClick={openAddModal}
              className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
              Thêm
            </button>
          </div>

          <HabitList
            habits={todayHabits}
            onCheckIn={handleCheckIn}
            onUndoCheckIn={handleUndoCheckIn}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onApplyFreeze={handleApplyFreeze}
            onAddClick={openAddModal}
            onTwoMinuteStart={handleTwoMinuteStart}
          />
        </section>

        {/* HEATMAP */}
        {totalHabits > 0 && selectedHabit && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-chart-simple text-emerald-400"></i>
                12 tuần qua
              </h2>
              {totalHabits > 1 && (
                <HabitSelector
                  habits={todayHabits}
                  selectedId={selectedHabit.id}
                  onSelect={setSelectedHabitId}
                />
              )}
            </div>
            <CalendarHeatmap
              checkIns={checkInDates}
              color={selectedHabit.color}
              weeksToShow={12}
            />
          </section>
        )}
      </main>

      <Footer />

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditHabitModal
        isOpen={!!editingHabit}
        habit={editingHabit}
        allHabits={habits}
        onSave={handleSaveEdit}
        onClose={() => setEditingHabit(null)}
      />
      <HabitChainPrompt
        isOpen={!!chainPrompt}
        fromHabit={chainPrompt?.fromHabit}
        toHabit={chainPrompt?.toHabit}
        onConfirm={handleChainConfirm}
        onDismiss={() => setChainPrompt(null)}
      />
      <TwoMinuteTimer
        isOpen={!!twoMinuteHabit}
        habit={twoMinuteHabit}
        onComplete={handleTwoMinuteComplete}
        onCancel={handleTwoMinuteCancel}
      />
    </div>
  );
}

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHabitStore } from '../stores/useHabitStore';
import { playStreakSound, hapticCheckIn } from '../utils/habitFeedback';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HabitList from '../components/habits/HabitList';
import AddHabitModal from '../components/habits/AddHabitModal';
import StreakBadge from '../components/habits/StreakBadge';
import CalendarHeatmap from '../components/habits/CalendarHeatmap';
import HabitSelector from '../components/habits/HabitSelector';
import HabitChainPrompt from '../components/habits/HabitChainPrompt';
import TwoMinuteTimer from '../components/habits/TwoMinuteTimer';

export default function HabitsPage() {
  const {
    habits,
    checkIns,
    getTodayHabits,
    checkIn,
    undoCheckIn,
    deleteHabit,
    resetMonthlyFreeze,
    getCheckIns,
  } = useHabitStore(
    useShallow((state) => ({
      habits: state.habits,
      checkIns: state.checkIns,
      getTodayHabits: state.getTodayHabits,
      checkIn: state.checkIn,
      undoCheckIn: state.undoCheckIn,
      deleteHabit: state.deleteHabit,
      resetMonthlyFreeze: state.resetMonthlyFreeze,
      getCheckIns: state.getCheckIns,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  // Chain prompt state
  const [chainPrompt, setChainPrompt] = useState(null);

  // Two-minute timer state
  const [twoMinuteHabit, setTwoMinuteHabit] = useState(null);

  // Reset freeze đầu tháng
  useEffect(() => {
    resetMonthlyFreeze();
  }, [resetMonthlyFreeze]);

  // Today habits với streak đã tính
  const todayHabits = useMemo(() => {
    return getTodayHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, checkIns]);

  // Streak tổng
  const totalStreak = useMemo(
    () => todayHabits.reduce((max, h) => Math.max(max, h.streak), 0),
    [todayHabits]
  );

  const completedToday = todayHabits.filter((h) => h.isCheckedInToday).length;
  const totalHabits = todayHabits.length;

  // Habit đang xem trong heatmap
  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return todayHabits[0] || null;
    return todayHabits.find((h) => h.id === selectedHabitId) || todayHabits[0];
  }, [selectedHabitId, todayHabits]);

  // ===== CHAIN LOGIC =====
  const findNextInChain = useCallback(
    (habitId, excludeId = null) => {
      return (
        todayHabits.find(
          (h) =>
            h.stackAfter === habitId &&
            !h.isCheckedInToday &&
            h.id !== excludeId
        ) || null
      );
    },
    [todayHabits]
  );

  const handleCheckIn = useCallback(
    (habitId) => {
      checkIn(habitId);

      const habit = todayHabits.find((h) => h.id === habitId);
      if (habit && (habit.streak + 1) % 7 === 0 && habit.streak > 0) {
        setTimeout(playStreakSound, 300);
      }

      const nextHabit = findNextInChain(habitId, habitId);
      if (nextHabit && habit) {
        setTimeout(() => {
          setChainPrompt({ fromHabit: habit, toHabit: nextHabit });
        }, 600);
      }
    },
    [checkIn, todayHabits, findNextInChain]
  );

  const handleChainConfirm = useCallback(() => {
    if (!chainPrompt) return;
    const { toHabit } = chainPrompt;

    checkIn(toHabit.id);
    hapticCheckIn();
    setChainPrompt(null);

    const nextNext = findNextInChain(toHabit.id, toHabit.id);
    if (nextNext) {
      setTimeout(() => {
        setChainPrompt({ fromHabit: toHabit, toHabit: nextNext });
      }, 700);
    }
  }, [chainPrompt, checkIn, findNextInChain]);

  const handleChainDismiss = useCallback(() => {
    setChainPrompt(null);
  }, []);

  // ===== TWO-MINUTE LOGIC =====
  const handleTwoMinuteStart = useCallback(
    (habitId) => {
      const habit = todayHabits.find((h) => h.id === habitId);
      if (habit) setTwoMinuteHabit(habit);
    },
    [todayHabits]
  );

  const handleTwoMinuteComplete = useCallback(() => {
    if (!twoMinuteHabit) return;
    const habitId = twoMinuteHabit.id;
    const habitSnapshot = twoMinuteHabit;

    checkIn(habitId);
    setTwoMinuteHabit(null);

    // Trigger chain nếu có
    const nextHabit = findNextInChain(habitId, habitId);
    if (nextHabit) {
      setTimeout(() => {
        setChainPrompt({ fromHabit: habitSnapshot, toHabit: nextHabit });
      }, 700);
    }
  }, [twoMinuteHabit, checkIn, findNextInChain]);

  const handleTwoMinuteCancel = useCallback(() => {
    setTwoMinuteHabit(null);
  }, []);

  // ===== MODAL =====
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-grow">
        {/* ===== HEADER ===== */}
        <div className="relative bg-gradient-to-r from-emerald-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-emerald-500/30 p-5 shadow-2xl overflow-hidden mb-5">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between gap-3 flex-wrap">
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
            <StreakBadge streak={totalStreak} size="lg" />
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
                    width: `${
                      totalHabits > 0
                        ? (completedToday / totalHabits) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ===== TODAY HABITS ===== */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-calendar-day text-emerald-400"></i>
              Hôm nay
            </h2>
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
              Thêm
            </button>
          </div>

          <HabitList
            habits={todayHabits}
            checkInsMap={checkIns}
            onCheckIn={handleCheckIn}
            onUndoCheckIn={undoCheckIn}
            onDelete={deleteHabit}
            onAddClick={handleOpenModal}
            onTwoMinuteStart={handleTwoMinuteStart}
          />
        </section>

        {/* ===== HEATMAP ===== */}
        {todayHabits.length > 0 && selectedHabit && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-chart-simple text-emerald-400"></i>
                12 tuần qua
              </h2>

              {todayHabits.length > 1 && (
                <HabitSelector
                  habits={todayHabits}
                  selectedId={selectedHabit.id}
                  onSelect={setSelectedHabitId}
                />
              )}
            </div>

            <CalendarHeatmap
              checkIns={getCheckIns(selectedHabit.id)}
              color={selectedHabit.color}
              weeksToShow={12}
            />
          </section>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <AddHabitModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <HabitChainPrompt
        isOpen={!!chainPrompt}
        fromHabit={chainPrompt?.fromHabit}
        toHabit={chainPrompt?.toHabit}
        onConfirm={handleChainConfirm}
        onDismiss={handleChainDismiss}
        autoDismissSeconds={10}
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
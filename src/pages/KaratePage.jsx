import { useState, useEffect, useMemo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useKarateStore } from '../stores/useKarateStore';
import { useTimerStore } from '../hooks/useTimerStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TimerControl from '../components/timer/TimerControl';
import KarateSessionList from '../components/karate/KarateSessionList';
import KarateDetail from '../components/karate/KarateDetail';

export default function KaratePage() {
  // Combined Karate store subscription - single re-render for all karate state
  const {
    sessions,
    selectedIndex,
    selectedSession: selectedSessionFromStore,
    selectSession,
    completedIds,
    toggleComplete,
    notes,
    setNote,
  } = useKarateStore(
    useShallow((state) => ({
      sessions: state.sessions,
      selectedIndex: state.selectedIndex,
      selectedSession: state.sessions[state.selectedIndex] || null,
      selectSession: state.selectSession,
      completedIds: state.completedIds,
      toggleComplete: state.toggleComplete,
      notes: state.notes,
      setNote: state.setNote,
    }))
  );

  // Combined Timer store subscription
  const {
    timeLeft,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    fullReset,
  } = useTimerStore(
    useShallow((state) => ({
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      isCompleted: state.isCompleted,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
      fullReset: state.fullReset,
    }))
  );

  // Tuần đang chọn (mặc định theo buổi hiện tại)
  const [currentWeek, setCurrentWeek] = useState(selectedSessionFromStore?.week || 1);

  // Đồng bộ currentWeek khi selectedSession thay đổi (ví dụ từ localStorage)
  useEffect(() => {
    if (selectedSessionFromStore?.week && selectedSessionFromStore.week !== currentWeek) {
      setCurrentWeek(selectedSessionFromStore.week);
    }
  }, [selectedSessionFromStore?.id]);

  if (!selectedSessionFromStore) {
    return <div className="text-white p-4">Đang tải...</div>;
  }

  // Memoize derived values to avoid recalculation on every render
  const totalWeeks = useMemo(
    () => new Set(sessions.map((s) => s.week)).size,
    [sessions]
  );

  const isCurrentSessionCompleted = useMemo(
    () => completedIds.includes(selectedSessionFromStore.id),
    [completedIds, selectedSessionFromStore.id]
  );

  const currentSessionNote = useMemo(
    () => notes[selectedSessionFromStore.id] || '',
    [notes, selectedSessionFromStore.id]
  );

  // Stable callbacks using useCallback to prevent child re-renders
  const handleSelect = useCallback(
    (index) => {
      selectSession(index);
      fullReset();
    },
    [selectSession, fullReset]
  );

  const handleSelectWeek = useCallback(
    (week) => {
      setCurrentWeek(week);
      const firstOfWeek = sessions.find((s) => s.week === week);
      if (firstOfWeek) {
        const idx = sessions.indexOf(firstOfWeek);
        selectSession(idx);
        fullReset();
      }
    },
    [sessions, selectSession, fullReset]
  );

  const handleResetAndStart = useCallback(() => {
    fullReset();
    startTimer();
  }, [fullReset, startTimer]);

  const handleToggleComplete = useCallback(() => {
    toggleComplete(selectedSessionFromStore.id);
  }, [toggleComplete, selectedSessionFromStore.id]);

  const handleNoteChange = useCallback(
    (text) => {
      setNote(selectedSessionFromStore.id, text);
    },
    [setNote, selectedSessionFromStore.id]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Tiêu đề trang */}
          <div className="relative bg-gradient-to-r from-rose-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-rose-500/30 p-5 shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 text-2xl">
                <i className="fa-solid fa-hand-fist"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Karate <span className="text-rose-400">Training</span>
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  {sessions.length} buổi tập • {totalWeeks} tuần
                </p>
              </div>
            </div>
          </div>

          {/* Chi tiết buổi tập */}
          <KarateDetail
            session={selectedSessionFromStore}
            isCompleted={isCurrentSessionCompleted}
            onToggleComplete={handleToggleComplete}
            note={currentSessionNote}
            onNoteChange={handleNoteChange}
          />

          <TimerControl
            timeLeft={timeLeft}
            isRunning={isRunning}
            total={selectedSessionFromStore.duration}
            isCompleted={isCompleted}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={fullReset}
            onResetAndStart={handleResetAndStart}
          />
        </section>

        <section className="lg:col-span-5">
          <KarateSessionList
            sessions={sessions}
            currentIndex={selectedIndex}
            onSelect={handleSelect}
            completedIds={completedIds}
            currentWeek={currentWeek}
            onSelectWeek={handleSelectWeek}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
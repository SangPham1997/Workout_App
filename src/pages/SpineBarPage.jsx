import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SafetyNotice from '../components/spine/SafetyNotice';
import SpineFilters from '../components/spine/SpineFilters';
import SpineExerciseList from '../components/spine/SpineExerciseList';
import SpineDetail from '../components/spine/SpineDetail';
import SpineNote from '../components/spine/SpineNote';
import TimerControl from '../components/timer/TimerControl';
import { useSpineBarStore } from '../stores/useSpineBarStore';
import { useTimerStore } from '../stores/useTimerStore';

export default function SpineBarPage() {
  const {
    program,
    selectedId,
    completedIds,
    notes,
    selectItem,
    toggleComplete,
    setNote,
  } = useSpineBarStore(
    useShallow((state) => ({
      program: state.program,
      selectedId: state.selectedId,
      completedIds: state.completedIds,
      notes: state.notes,
      selectItem: state.selectItem,
      toggleComplete: state.toggleComplete,
      setNote: state.setNote,
    }))
  );

  const [groupFilter, setGroupFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState(0);
  const [barFilter, setBarFilter] = useState('all');

  const items = useMemo(
    () =>
      program.items.filter((item) => {
        if (groupFilter !== 'all' && item.groupId !== groupFilter) return false;
        if (levelFilter !== 0 && item.level !== levelFilter) return false;
        if (barFilter !== 'all' && item.bar !== barFilter) return false;
        return true;
      }),
    [program.items, groupFilter, levelFilter, barFilter]
  );

  const selected = useMemo(
    () => program.items.find((item) => item.id === selectedId) ?? null,
    [program.items, selectedId]
  );

  // Nếu bộ lọc làm bài đang chọn biến mất, chuyển sang bài đầu tiên còn hiển thị.
  useEffect(() => {
    if (items.length === 0) return;
    if (!items.some((item) => item.id === selectedId)) {
      selectItem(items[0].id);
    }
  }, [items, selectedId, selectItem]);

  const timer = useTimerStore(
    useShallow((state) => ({
      phase: state.phase,
      currentSet: state.currentSet,
      totalSets: state.totalSets,
      timeLeft: state.timeLeft,
      workDuration: state.workDuration,
      restDuration: state.restDuration,
      isRunning: state.isRunning,
      isCompleted: state.isCompleted,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
      fullReset: state.fullReset,
      resetAndStart: state.resetAndStart,
      loadSession: state.loadSession,
      toggleSound: state.toggleSound,
      soundEnabled: state.soundEnabled,
    }))
  );

  // Nạp session tường minh — timer không tự dò URL.
  const { loadSession } = timer;
  useEffect(() => {
    if (selected) loadSession(selected);
  }, [selected, loadSession]);

  const handleSaveNote = useCallback(
    (text) => {
      if (selectedId) setNote(selectedId, text);
    },
    [selectedId, setNote]
  );

  const total = program.items.length;
  const done = completedIds.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const routineCount = program.groups.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow flex flex-col gap-5">
        {/* ===== HEADER ===== */}
        <section className="relative bg-gradient-to-r from-sky-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-sky-500/30 p-5 shadow-2xl overflow-hidden">
          <div className="absolute -top-12 -right-10 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 text-2xl">
                <i className="fa-solid fa-arrows-up-down" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Xà <span className="text-sky-400">& Cột sống</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Giải nén – mở ngực – ổn định · {total} bài · {routineCount} routine · 8–12 phút
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[190px]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Đã tập</span>
                <span className="font-mono text-sky-300">
                  {done}/{total} bài
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 text-right">
                {percent}% hoàn thành
              </span>
            </div>
          </div>
        </section>

        <SafetyNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ===== CỘT TRÁI: BÀI ĐANG CHỌN ===== */}
          <section
            className="lg:col-span-7 flex flex-col gap-4 min-w-0"
            aria-label="Bài tập đang chọn"
          >
            {selected ? (
              <>
                {/* Chọn nhanh trên mobile — danh sách đầy đủ nằm bên dưới */}
                {items.length > 0 && (
                  <label className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                      Bài đang chọn
                    </span>
                    <select
                      value={selectedId}
                      onChange={(event) => selectItem(event.target.value)}
                      className="flex-1 min-w-0 rounded-lg bg-slate-900/70 border border-slate-700/60 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500/60"
                    >
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <SpineDetail
                  key={selected.id}
                  exercise={selected}
                  isCompleted={completedIds.includes(selected.id)}
                  onToggleComplete={toggleComplete}
                />

                <TimerControl
                  accent="sky"
                  phase={timer.phase}
                  currentSet={timer.currentSet}
                  totalSets={timer.totalSets}
                  timeLeft={timer.timeLeft}
                  workDuration={timer.workDuration}
                  restDuration={timer.restDuration}
                  mode={selected.mode}
                  reps={selected.reps}
                  isRunning={timer.isRunning}
                  isCompleted={timer.isCompleted}
                  onStart={timer.startTimer}
                  onPause={timer.pauseTimer}
                  onReset={timer.fullReset}
                  onToggleSound={timer.toggleSound}
                  soundEnabled={timer.soundEnabled}
                  onResetAndStart={timer.resetAndStart}
                />

                <SpineNote
                  key={selected.id}
                  note={notes[selected.id] || ''}
                  onSave={handleSaveNote}
                  exerciseName={selected.name}
                />

                <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Liều khuyến nghị:</strong>{' '}
                    RPE 3–5/10 · giữ 15–30 giây/hiệp · nghỉ 30–45 giây · 3–4 buổi/tuần.
                    Không tập đến thất bại; tăng thời gian trước khi tăng độ khó.
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 text-sm text-slate-400">
                Chọn một bài ở cột bên phải để bắt đầu.
              </div>
            )}
          </section>

          {/* ===== CỘT PHẢI: DANH SÁCH ===== */}
          <section
            className="lg:col-span-5 flex flex-col gap-3 min-w-0"
            aria-label="Danh sách bài tập xà"
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-list-check text-sky-400" aria-hidden="true" />
                Chọn bài
              </h2>
              <span className="text-[11px] text-slate-500">{items.length} bài</span>
            </div>

            <SpineFilters
              groups={program.groups}
              groupFilter={groupFilter}
              onGroupChange={setGroupFilter}
              levelFilter={levelFilter}
              onLevelChange={setLevelFilter}
              barFilter={barFilter}
              onBarChange={setBarFilter}
            />

            <SpineExerciseList
              program={program}
              items={items}
              selectedId={selectedId}
              onSelect={selectItem}
              completedIds={completedIds}
              onToggleComplete={toggleComplete}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

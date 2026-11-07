import { useDeferredValue, useCallback, useEffect, useMemo, useRef, useState  } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import SafetyNotice from '../components/spine/SafetyNotice';
import SpineFilters from '../components/spine/SpineFilters';
import SpineExerciseList from '../components/spine/SpineExerciseList';
import SpineDetail from '../components/spine/SpineDetail';
import SpineNote from '../components/spine/SpineNote';
import TimerControl from '../components/timer/TimerControl';
import { useSpineBarStore } from '../stores/useSpineBarStore';
import { useTimerStore } from '../stores/useTimerStore';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

// DEBUG flag - bat/tat bang localStorage.setItem('DEBUG_SPINE', '1')
const debug = (...args) => {
  if (typeof window !== 'undefined' && localStorage.getItem('DEBUG_SPINE') === '1') {
    console.log('%c[SpineBarPage]', 'color:#0ea5e9;font-weight:bold', ...args);
  }
};

export default function SpineBarPage() {
  // ============================================================
  // 1. TAT CA HOOKS PHAI O DAY - KHONG CO RETURN TRUOC DAY
  // ============================================================

  // Sanity loading state
  const loading = useSpineBarStore((s) => s.loading);
  const error = useSpineBarStore((s) => s.error);
  const initFromSanity = useSpineBarStore((s) => s.initFromSanity);

  // Main store data
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

  // Local filters
  const [groupFilter, setGroupFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState(0);
  const [barFilter, setBarFilter] = useState('all');
  // React 19: defer filter values để không block UI
  const deferredGroupFilter = useDeferredValue(groupFilter);
  const deferredLevelFilter = useDeferredValue(levelFilter);
  const deferredBarFilter = useDeferredValue(barFilter);

  // ===== INIT FROM SANITY =====
  useEffect(() => {
    debug('calling initFromSanity()');
    debug('initFromSanity type:', typeof initFromSanity);
    if (typeof initFromSanity !== 'function') {
      console.error('[SpineBarPage] initFromSanity is not a function! Store not updated properly.');
      return;
    }
    initFromSanity();
  }, [initFromSanity]);

  // ===== DEBUG STATE CHANGES =====
  useEffect(() => {
    debug('state update:', {
      loading,
      error: error?.message ?? null,
      programExists: !!program,
      itemsCount: program?.items?.length ?? 0,
      groupsCount: program?.groups?.length ?? 0,
      selectedId,
    });
  }, [loading, error, program, selectedId]);

  // ===== DERIVED STATE (safe with optional chaining) =====
  const items = useMemo(() => {
    const source = program?.items ?? [];
    const filtered = source.filter((item) => {
      if (deferredGroupFilter !== 'all' && item.groupId !== deferredGroupFilter) return false;
      if (deferredLevelFilter !== 0 && item.level !== deferredLevelFilter) return false;
      if (deferredBarFilter !== 'all' && item.bar !== deferredBarFilter) return false;
      return true;
    });
    return filtered;
  }, [program, groupFilter, levelFilter, barFilter]);

  const selected = useMemo(() => {
    const source = program?.items ?? [];
    return source.find((item) => item.id === selectedId) ?? null;
  }, [program, selectedId]);

  // Auto-select first item neu filter lam mat selection
  useEffect(() => {
    if (items.length === 0) return;
    if (!items.some((item) => item.id === selectedId)) {
      debug('auto-select first item:', items[0].id);
      selectItem(items[0].id);
    }
  }, [items, selectedId, selectItem]);

  // ===== TIMER STORE =====
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

  const { loadSession } = timer;
  // ⚡ FIX: Guard by ID — không reset timer khi data refresh
  const lastLoadedIdRef = useRef(null);
  useEffect(() => {
    if (!selected) return;
    if (lastLoadedIdRef.current === selected.id) return;
    lastLoadedIdRef.current = selected.id;
    debug('loadSession:', selected.id);
    loadSession(selected);
  }, [selected, loadSession]);

  // ===== HANDLERS =====
  const handleSaveNote = useCallback(
    (text) => {
      if (selectedId) setNote(selectedId, text);
    },
    [selectedId, setNote]
  );

  // ============================================================
  // 2. EARLY RETURNS - SAU TAT CA HOOKS
  // ============================================================

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error?.message ?? 'Lỗi không xác định'} />;
  if (!program) return <EmptyState message="Chưa có chương trình Spine Bar" />;

  // ============================================================
  // 3. RENDER - program da ton tai, an toan de truy cap
  // ============================================================
  const total = program.items?.length ?? 0;
  const done = completedIds.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const routineCount = program.groups?.length ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow flex flex-col gap-5">
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
          <section
            className="lg:col-span-7 flex flex-col gap-4 min-w-0"
            aria-label="Bài tập đang chọn"
          >
            {selected ? (
              <>
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
              groups={program.groups ?? []}
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
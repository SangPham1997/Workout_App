import { useEffect, useMemo, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useKarateStore } from '../stores/useKarateStore';
import { KARATE_TRACKS } from '../data/karate';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import KaratePathPicker from '../components/karate/KaratePathPicker';
import KarateSessionList from '../components/karate/KarateSessionList';
import KarateDetail from '../components/karate/KarateDetail';

const LEVEL_OPTIONS = [
  { value: 'all', label: 'Mọi cấp độ' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export default function KaratePage() {
  const {
    sessions,
    selectedId,
    selectedSession,
    selectSession,
    completedIds,
    toggleComplete,
    notes,
    setNote,
    lastPracticedAt,
  } = useKarateStore(
    useShallow((state) => ({
      sessions: state.sessions,
      selectedId: state.selectedId,
      selectedSession:
        state.sessions.find((session) => session.id === state.selectedId) ?? null,
      selectSession: state.selectSession,
      completedIds: state.completedIds,
      toggleComplete: state.toggleComplete,
      notes: state.notes,
      setNote: state.setNote,
      lastPracticedAt: state.lastPracticedAt,
    }))
  );

  const [levelFilter, setLevelFilter] = useState('all');

  const activeTrackId = selectedSession?.track ?? KARATE_TRACKS[0].id;
  const activeTrack =
    KARATE_TRACKS.find((track) => track.id === activeTrackId) ?? KARATE_TRACKS[0];

  const trackSessions = useMemo(
    () => sessions.filter((session) => session.track === activeTrackId),
    [sessions, activeTrackId]
  );

  const visibleSessions = useMemo(
    () =>
      levelFilter === 'all'
        ? trackSessions
        : trackSessions.filter((session) => session.level === levelFilter),
    [trackSessions, levelFilter]
  );

  const totalWeeks = useMemo(
    () => new Set(trackSessions.map((session) => session.week)).size,
    [trackSessions]
  );

  // Nếu bộ lọc cấp độ làm buổi đang chọn biến mất, chọn buổi đầu còn hiển thị.
  useEffect(() => {
    if (visibleSessions.length === 0) return;
    if (!visibleSessions.some((session) => session.id === selectedId)) {
      selectSession(visibleSessions[0].id);
    }
  }, [visibleSessions, selectedId, selectSession]);

  const isCurrentSessionCompleted = useMemo(
    () => (selectedId ? completedIds.includes(selectedId) : false),
    [completedIds, selectedId]
  );

  const currentSessionNote = useMemo(
    () => (selectedId ? notes[selectedId] || '' : ''),
    [notes, selectedId]
  );

  const handleSelect = useCallback(
    (id) => {
      selectSession(id);
    },
    [selectSession]
  );

  const handleSelectTrack = useCallback(
    (trackId) => {
      const first = sessions.find((session) => session.track === trackId);
      if (first) selectSession(first.id);
    },
    [sessions, selectSession]
  );

  const handleSelectWeek = useCallback(
    (week) => {
      const first = visibleSessions.find((session) => session.week === week);
      if (first) selectSession(first.id);
    },
    [visibleSessions, selectSession]
  );

  const handleToggleComplete = useCallback(() => {
    if (selectedId) toggleComplete(selectedId);
  }, [toggleComplete, selectedId]);

  const handleNoteChange = useCallback(
    (text) => {
      if (selectedId) setNote(selectedId, text);
    },
    [setNote, selectedId]
  );

  if (!selectedSession) {
    return <div className="text-white p-4">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 flex flex-col gap-4 min-w-0">
          {/* Tiêu đề trang */}
          <div className="relative bg-gradient-to-r from-rose-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-rose-500/30 p-5 shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 text-2xl">
                  <i className="fa-solid fa-hand-fist" aria-hidden="true"></i>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Karate <span className="text-rose-400">Training</span>
                  </h1>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    {sessions.length} buổi • {KARATE_TRACKS.length} lộ trình
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-200">
                <i className="fa-solid fa-route" aria-hidden="true" />
                {activeTrack.label}: {trackSessions.length} buổi / {totalWeeks} tuần
              </span>
            </div>
          </div>

          <KaratePathPicker
            tracks={KARATE_TRACKS}
            sessions={sessions}
            completedIds={completedIds}
            activeTrackId={activeTrackId}
            onChange={handleSelectTrack}
          />

          {/* Chọn nhanh trên mobile — danh sách đầy đủ nằm bên dưới */}
          {visibleSessions.length > 0 && (
            <label className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                Buổi đang chọn
              </span>
              <select
                value={selectedId}
                onChange={(event) => handleSelect(event.target.value)}
                className="flex-1 min-w-0 rounded-lg bg-slate-900/70 border border-slate-700/60 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/60"
              >
                {visibleSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    Tuần {session.week} · {session.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Chi tiết buổi tập — key theo id để state nội bộ tự reset khi đổi buổi */}
          <KarateDetail
            key={selectedSession.id}
            session={selectedSession}
            isCompleted={isCurrentSessionCompleted}
            onToggleComplete={handleToggleComplete}
            note={currentSessionNote}
            onNoteChange={handleNoteChange}
            lastPracticedAt={lastPracticedAt?.[selectedId]}
          />
        </section>

        <section className="lg:col-span-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-list-check text-rose-400" aria-hidden="true" />
              Lộ trình {activeTrack.label}
            </h2>
            <label className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="sr-only">Lọc theo cấp độ</span>
              <select
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value)}
                className="rounded-lg bg-slate-800/70 border border-slate-700/60 px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-rose-500/60"
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visibleSessions.length > 0 ? (
            <KarateSessionList
              sessions={visibleSessions}
              currentId={selectedId}
              onSelect={handleSelect}
              completedIds={completedIds}
              currentWeek={selectedSession.week || 1}
              onSelectWeek={handleSelectWeek}
              weekLabels={activeTrack.weekLabels}
              allSessions={sessions}
            />
          ) : (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 text-center">
              <i
                className="fa-solid fa-filter-circle-xmark text-2xl text-slate-600"
                aria-hidden="true"
              />
              <p className="text-sm text-slate-300 mt-2">
                Không có buổi phù hợp cấp độ này.
              </p>
              <button
                type="button"
                onClick={() => setLevelFilter('all')}
                className="mt-3 text-xs font-bold text-rose-300 hover:text-rose-200 underline underline-offset-2"
              >
                Bỏ bộ lọc
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

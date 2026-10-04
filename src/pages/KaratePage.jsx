import {
  useKarateSessions,
  useKarateIndex,
  useSelectKarateSession,
  useSelectedKarateSession,
  useKarateCompletedIds,
  useKarateToggleComplete,
  useKarateNotes,
  useKarateSetNote,
  useTimeLeft,
  useIsRunning,
  useIsCompleted,
  useStartTimer,
  usePauseTimer,
  useFullReset,
} from '../stores/selectors';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TimerControl from '../components/timer/TimerControl';
import KarateSessionList from '../components/karate/KarateSessionList';
import KarateDetail from '../components/karate/KarateDetail';

export default function KaratePage() {
  // Karate store
  const sessions = useKarateSessions();
  const selectedIndex = useKarateIndex();
  const selectedSession = useSelectedKarateSession();
  const selectSession = useSelectKarateSession();

  // Progress + Notes (mới)
  const completedIds = useKarateCompletedIds();
  const toggleComplete = useKarateToggleComplete();
  const notes = useKarateNotes();
  const setNote = useKarateSetNote();

  // Timer store
  const timeLeft = useTimeLeft();
  const isRunning = useIsRunning();
  const isCompleted = useIsCompleted();
  const startTimer = useStartTimer();
  const pauseTimer = usePauseTimer();
  const fullReset = useFullReset();

  if (!selectedSession) {
    return <div className="text-white p-4">Đang tải...</div>;
  }

  const handleSelect = (index) => {
    selectSession(index);
    fullReset();
  };

  const handleResetAndStart = () => {
    fullReset();
    startTimer();
  };

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
                  7 buổi tập nền tảng • 4 tuần
                </p>
              </div>
            </div>
          </div>

          {/* Chi tiết buổi tập — truyền đầy đủ props từ store */}
          <KarateDetail
            session={selectedSession}
            isCompleted={completedIds.includes(selectedSession.id)}
            onToggleComplete={() => toggleComplete(selectedSession.id)}
            note={notes[selectedSession.id] || ''}
            onNoteChange={(text) => setNote(selectedSession.id, text)}
          />

          <TimerControl
            timeLeft={timeLeft}
            isRunning={isRunning}
            total={selectedSession.duration}
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
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
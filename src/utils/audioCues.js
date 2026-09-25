/*
  Audio Cues — tạo tiếng beep bằng Web Audio API (không cần file mp3).
  - start(): beep khi bắt đầu / tiếp tục hiệp
  - pause(): bíp thấp khi tạm dừng
  - countdownTick(s): "bíp" dồn khi còn <=5 giây
  - complete(): hợp âm chiến thắng khi xong bài
  AudioContext tạo lười (lazy) để tuân thủ autoplay policy.
*/

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, startOffset, duration, gainPeak = 0.12, type = 'sine') {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + startOffset;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const audioCues = {
  /** beep lên 2 tông khi bắt đầu / tiếp tục */
  start() {
    tone(660, 0, 0.14, 0.12);
    tone(880, 0.15, 0.18, 0.12);
  },

  /** bíp đơn khi tạm dừng */
  pause() {
    tone(392, 0, 0.16, 0.1, 'triangle');
  },

  /** đếm ngược 5..1 — cao dần, giây cuối nhấn mạnh */
  countdownTick(secondsLeft) {
    if (secondsLeft <= 0 || secondsLeft > 5) return;
    const freq = 520 + (5 - secondsLeft) * 90; // 5s:520 ... 1s:880
    tone(freq, 0, 0.12, 0.13, 'square');
    if (secondsLeft === 1) tone(freq * 1.5, 0.16, 0.2, 0.13, 'square');
  },

  /** hợp âm hoàn thành */
  complete() {
    tone(523.25, 0, 0.18, 0.12);       // C5
    tone(659.25, 0.16, 0.18, 0.12);    // E5
    tone(783.99, 0.32, 0.26, 0.13);    // G5
    tone(1046.5, 0.5, 0.4, 0.12);      // C6
  },
};

export default audioCues;

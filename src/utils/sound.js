let audioCtx = null;

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const playBeep = ({ frequency = 800, duration = 0.15, gain = 0.15, delay = 0 } = {}) => {
  const ctx = getCtx();
  if (!ctx) return;

  const startAt = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, startAt);

  vol.gain.setValueAtTime(0, startAt);
  vol.gain.linearRampToValueAtTime(gain, startAt + 0.01);
  vol.gain.linearRampToValueAtTime(0, startAt + duration);

  osc.connect(vol);
  vol.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
};

/** Hết 1 hiệp work (→ sắp vào nghỉ). 1 tiếng cao ngắn. */
export const beepSetComplete = () => {
  playBeep({ frequency: 880, duration: 0.15, gain: 0.18 });
};

/** Hết thời gian nghỉ (→ quay lại tập). 2 tiếng liên tiếp, tần số thấp hơn. */
export const beepRestComplete = () => {
  playBeep({ frequency: 660, duration: 0.12, gain: 0.18, delay: 0 });
  playBeep({ frequency: 880, duration: 0.12, gain: 0.18, delay: 0.18 });
};

/** Hoàn thành toàn bộ bài. 3 tiếng tăng dần kiểu "success". */
export const beepAllComplete = () => {
  playBeep({ frequency: 660, duration: 0.12, gain: 0.2, delay: 0 });
  playBeep({ frequency: 880, duration: 0.12, gain: 0.2, delay: 0.15 });
  playBeep({ frequency: 1100, duration: 0.22, gain: 0.2, delay: 0.30 });
};
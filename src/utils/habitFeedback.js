let audioCtx = null;

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
};

const playNote = (freq, startTime, duration = 0.2) => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startTime + duration
  );

  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playCheckInSound = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // C5 → E5 (2 nốt vui tai)
    playNote(523.25, 0, 0.2);
    playNote(659.25, 0.1, 0.25);
  } catch {
    // silent
  }
};

export const playStreakSound = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // C5 → E5 → G5 (3 nốt cho streak milestone)
    playNote(523.25, 0, 0.15);
    playNote(659.25, 0.1, 0.15);
    playNote(783.99, 0.2, 0.3);
  } catch {
    // silent
  }
};

export const playUndoSound = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // Nốt trầm nhẹ
    playNote(392.0, 0, 0.15);
  } catch {
    // silent
  }
};

export const vibrate = (pattern = 50) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // silent
  }
};

export const hapticCheckIn = () => {
  playCheckInSound();
  vibrate([50, 30, 50]);
};

export const hapticUndo = () => {
  playUndoSound();
  vibrate(30);
};

export const hapticStreak = () => {
  playStreakSound();
  vibrate([100, 50, 100, 50, 100]);
};
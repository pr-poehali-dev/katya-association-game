interface AudioContextWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function getAudioCtx(): AudioContext | null {
  const win = window as AudioContextWindow;
  const Ctx = window.AudioContext || win.webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

function createTone(frequency: number, duration: number, type: OscillatorType = "sine", gain = 0.3): void {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playSequence(notes: { freq: number; time: number; dur: number }[], type: OscillatorType = "sine", gain = 0.3) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime + time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur);
  });
}

export const sounds = {
  correct: () => {
    playSequence([
      { freq: 523, time: 0, dur: 0.15 },
      { freq: 659, time: 0.1, dur: 0.15 },
      { freq: 784, time: 0.2, dur: 0.3 },
    ], "square", 0.2);
  },

  wrong: () => {
    playSequence([
      { freq: 300, time: 0, dur: 0.2 },
      { freq: 200, time: 0.15, dur: 0.3 },
    ], "sawtooth", 0.15);
  },

  reveal: () => {
    playSequence([
      { freq: 400, time: 0, dur: 0.1 },
      { freq: 600, time: 0.08, dur: 0.15 },
      { freq: 800, time: 0.18, dur: 0.2 },
    ], "triangle", 0.2);
  },

  fanfare: () => {
    playSequence([
      { freq: 523, time: 0, dur: 0.15 },
      { freq: 659, time: 0.1, dur: 0.15 },
      { freq: 784, time: 0.2, dur: 0.15 },
      { freq: 1047, time: 0.3, dur: 0.4 },
    ], "square", 0.25);
  },

  click: () => {
    createTone(800, 0.05, "square", 0.1);
  },

  tick: () => {
    createTone(600, 0.08, "triangle", 0.15);
  },

  win: () => {
    playSequence([
      { freq: 523, time: 0, dur: 0.1 },
      { freq: 659, time: 0.1, dur: 0.1 },
      { freq: 784, time: 0.2, dur: 0.1 },
      { freq: 1047, time: 0.3, dur: 0.1 },
      { freq: 1319, time: 0.4, dur: 0.4 },
    ], "square", 0.2);
  },
};
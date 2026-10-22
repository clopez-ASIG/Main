import { CONFIG } from '../config.js';

// Sonidos sintetizados (sin archivos) y narración por voz del navegador.
let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, { t = 0.12, type = 'sine', gain = 0.18, when = 0, slide = null } = {}) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, a.currentTime + when);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + when + t);
  g.gain.setValueAtTime(0, a.currentTime + when);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + when + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + when + t);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + when); o.stop(a.currentTime + when + t + 0.02);
}

export const audio = {
  unlock() { ac(); },
  click() { tone(880, { t: 0.05, gain: 0.08, type: 'triangle' }); },
  hover() { tone(1200, { t: 0.03, gain: 0.03, type: 'sine' }); },
  ok() { tone(660, { t: 0.1, type: 'triangle' }); tone(990, { t: 0.16, type: 'triangle', when: 0.09 }); },
  bad() { tone(180, { t: 0.22, type: 'sawtooth', gain: 0.12, slide: 120 }); },
  success() { [523, 659, 784, 1046].forEach((f, i) => tone(f, { t: 0.18, type: 'triangle', when: i * 0.11 })); },
  fail() { tone(300, { t: 0.3, type: 'sawtooth', gain: 0.1, slide: 150 }); tone(220, { t: 0.4, type: 'sawtooth', gain: 0.1, when: 0.25, slide: 110 }); },
  alarm() { tone(1000, { t: 0.15, type: 'square', gain: 0.06 }); tone(800, { t: 0.15, type: 'square', gain: 0.06, when: 0.18 }); },
  speak(text) {
    if (!CONFIG.voice || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = CONFIG.voiceLang; u.rate = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(v => v.lang.startsWith('es')) ; if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch { /* sin voz */ }
  },
  stopSpeech() { try { window.speechSynthesis?.cancel(); } catch {} },
};

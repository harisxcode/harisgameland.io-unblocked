/**
 * Lightweight Web Audio synthesizer for arcade feedback chimes
 * Uses zero external audio files.
 */
export function playArcadeSfx(type: 'intro' | 'click' | 'launch') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'intro') {
      // Ascending chord chime
      const now = ctx.currentTime;
      const notes = [220, 330, 440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else if (type === 'click') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'launch') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Audio contexts can be blocked until user gesture, safely ignore
  }
}

/**
 * Retro arcade synth chord for "Pablo Arcade Presents"
 */
export function playPabloPresentsSfx() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Synth sweep + retro major 7th chord (analog boot feel)
    const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 523.25];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.3);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / freqs.length, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  } catch {}
}

/**
 * Announcer voice: "It's in the game!"
 */
export function speakItsInTheGame() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("It's in the game!");
    utterance.rate = 0.95;
    utterance.pitch = 0.82; // confident deep announcer tone
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

/**
 * Iconic retro brass fanfare + kick impact for Pablo the Penguin "It's in the game!"
 */
export function playItsInTheGameFanfare() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Deep EA-sports style thud/kick impact
    const kick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(150, now);
    kick.frequency.exponentialRampToValueAtTime(35, now + 0.4);
    kickGain.gain.setValueAtTime(0.35, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    kick.connect(kickGain);
    kickGain.connect(ctx.destination);
    kick.start(now);
    kick.stop(now + 0.46);

    // Brilliant golden brass fanfare chord
    const chord = [164.81, 246.94, 329.63, 493.88, 659.25, 987.77];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + 0.05);
      gain.gain.setValueAtTime(0.001, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.05);
      osc.stop(now + 1.55);
    });

    // Arcade sparkle coin on top
    const coin = ctx.createOscillator();
    const coinGain = ctx.createGain();
    coin.type = 'square';
    coin.frequency.setValueAtTime(987.77, now + 0.25);
    coin.frequency.setValueAtTime(1318.51, now + 0.35);
    coinGain.gain.setValueAtTime(0.08, now + 0.25);
    coinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    coin.connect(coinGain);
    coinGain.connect(ctx.destination);
    coin.start(now + 0.25);
    coin.stop(now + 0.7);

    // Announcer voice spoken along with fanfare
    setTimeout(() => {
      speakItsInTheGame();
    }, 200);
  } catch {}
}


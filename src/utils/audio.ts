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

/**
 * Handle returned by startRetroIntroMusic to control background music and transition into the game
 */
export interface RetroIntroMusicHandle {
  transitionToGame: (onDone?: () => void) => void;
  stop: () => void;
  setMuted: (muted: boolean) => void;
}

/**
 * Multi-channel 8-bit / 16-bit retro arcade background music synthesizer
 * Plays high-energy chiptune music during the retro intro, then smoothly transitions into the game.
 */
export function startRetroIntroMusic(initialMuted = false): RetroIntroMusicHandle {
  if (typeof window === 'undefined') {
    return {
      transitionToGame: (cb) => { if (cb) cb(); },
      stop: () => {},
      setMuted: () => {}
    };
  }

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      return {
        transitionToGame: (cb) => { if (cb) cb(); },
        stop: () => {},
        setMuted: () => {}
      };
    }

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(initialMuted ? 0 : 0.18, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Filter to give authentic analog arcade warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
    filter.connect(masterGain);

    let isStopped = false;
    let timerId: number | null = null;
    let step = 0;

    // 138 BPM 16th note timing = ~0.1087s per step
    const stepDuration = 60 / 138 / 4;

    // Note frequencies
    const C2 = 65.41, Eb2 = 77.78, F2 = 87.31, G2 = 98.00, Ab2 = 103.83, Bb2 = 116.54;
    const C3 = 130.81, Eb3 = 155.56, F3 = 174.61, G3 = 196.00, Bb3 = 233.08;
    const C4 = 261.63, D4 = 293.66, Eb4 = 311.13, F4 = 349.23, G4 = 392.00, Ab4 = 415.30, Bb4 = 466.16;
    const C5 = 523.25, D5 = 587.33, Eb5 = 622.25, F5 = 698.46, G5 = 783.99, Ab5 = 830.61, Bb5 = 932.33, C6 = 1046.50;

    // 32-step bassline pattern
    const bassline: (number | 0)[] = [
      C2, C2, C3, C2,  Eb2, Eb2, Eb3, Eb2,  F2, F2, F3, F2,  G2, G2, Bb2, C3,
      C2, C2, C3, C2,  Eb2, Eb2, Eb3, Eb2,  Ab2, Ab2, Bb2, Bb2,  C3, G2, Eb2, G2
    ];

    // 32-step lead arpeggio & melody
    const melody: (number | 0)[] = [
      // Measure 1-2: Pablo Arcade Presents Buildup
      C4, Eb4, G4, C5,  Eb4, G4, C5, Eb5,  F4, Ab4, C5, F5,  G4, Bb4, D5, G5,
      C4, Eb4, G4, C5,  Eb4, G4, C5, Eb5,  Ab4, C5, Eb5, Ab5, Bb4, D5, F5, Bb5,
      // Measure 3-4: Heroic "It's in the game!" theme
      C5, 0, G4, 0,     Eb5, 0, D5, C5,    F5, 0, Eb5, 0,    G5, 0, F5, Eb5,
      C5, D5, Eb5, G5,  C6, 0, Bb5, G5,    Ab5, G5, F5, Eb5, D5, Eb5, F5, G5
    ];

    // Helper to play short retro noise burst for snare/hi-hat
    const playNoise = (time: number, isSnare: boolean) => {
      try {
        const bufferSize = ctx.sampleRate * (isSnare ? 0.08 : 0.03);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = isSnare ? 'bandpass' : 'highpass';
        noiseFilter.frequency.setValueAtTime(isSnare ? 1200 : 7000, time);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(isSnare ? 0.14 : 0.04, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (isSnare ? 0.08 : 0.03));

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(filter);

        noise.start(time);
        noise.stop(time + (isSnare ? 0.09 : 0.04));
      } catch {}
    };

    // Helper to play retro punchy kick drum
    const playKick = (time: number) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(32, time + 0.1);

        gain.gain.setValueAtTime(0.24, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(time);
        osc.stop(time + 0.13);
      } catch {}
    };

    // Helper for synth notes
    const playSynthNote = (freq: number, time: number, duration: number, type: OscillatorType, vol: number) => {
      if (freq <= 0) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(time);
        osc.stop(time + duration + 0.02);
      } catch {}
    };

    // Scheduler tick
    const scheduleNextBeats = () => {
      if (isStopped) return;
      const now = ctx.currentTime;

      // Schedule 8 steps ahead for rock-solid timing
      for (let i = 0; i < 4; i++) {
        const currentStep = (step + i) % melody.length;
        const time = now + i * stepDuration;

        // 1. Bassline
        const bassFreq = bassline[currentStep % bassline.length];
        if (bassFreq) {
          playSynthNote(bassFreq, time, stepDuration * 0.9, 'triangle', 0.18);
        }

        // 2. Melody / Arp
        const melFreq = melody[currentStep];
        if (melFreq) {
          playSynthNote(melFreq, time, stepDuration * 0.85, 'square', 0.10);
        }

        // 3. Drums (Kick on 0, 8, 16, 24; Snare on 4, 12, 20, 28; Hi-hat on 2, 6, 10, 14...)
        const stepInBar = currentStep % 16;
        if (stepInBar === 0 || stepInBar === 8) {
          playKick(time);
        } else if (stepInBar === 4 || stepInBar === 12) {
          playNoise(time, true); // Snare
        }
        if (stepInBar % 2 === 0) {
          playNoise(time, false); // Hi-hat
        }
      }

      step = (step + 4) % melody.length;
      timerId = window.setTimeout(scheduleNextBeats, stepDuration * 4 * 1000 * 0.85);
    };

    // Begin playback
    scheduleNextBeats();

    return {
      setMuted: (muted: boolean) => {
        try {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.18, now + 0.05);
        } catch {}
      },
      transitionToGame: (onDone) => {
        if (isStopped) {
          if (onDone) onDone();
          return;
        }
        isStopped = true;
        if (timerId !== null) clearTimeout(timerId);

        try {
          const now = ctx.currentTime;

          // 1. Triumphant fast ascending game-start fanfare sweep
          const transitionNotes = [C4, Eb4, G4, C5, Eb5, G5, C6];
          transitionNotes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.001, now + idx * 0.04);
            gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.04 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.35);
          });

          // 2. High sparkle coin chime on top
          const sparkle = ctx.createOscillator();
          const sparkleGain = ctx.createGain();
          sparkle.type = 'square';
          sparkle.frequency.setValueAtTime(1046.50, now + 0.28);
          sparkle.frequency.setValueAtTime(1567.98, now + 0.36);
          sparkleGain.gain.setValueAtTime(0.15, now + 0.28);
          sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          sparkle.connect(sparkleGain);
          sparkleGain.connect(ctx.destination);
          sparkle.start(now + 0.28);
          sparkle.stop(now + 0.7);

          // 3. Smoothly fade out the background music
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(masterGain.gain.value, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          // Clean up context and trigger callback
          setTimeout(() => {
            if (onDone) onDone();
            setTimeout(() => {
              try { ctx.close(); } catch {}
            }, 300);
          }, 320);
        } catch {
          if (onDone) onDone();
        }
      },
      stop: () => {
        isStopped = true;
        if (timerId !== null) clearTimeout(timerId);
        try {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.linearRampToValueAtTime(0.001, now + 0.05);
          setTimeout(() => {
            try { ctx.close(); } catch {}
          }, 60);
        } catch {}
      }
    };
  } catch {
    return {
      transitionToGame: (cb) => { if (cb) cb(); },
      stop: () => {},
      setMuted: () => {}
    };
  }
}

/**
 * High-energy level-up fanfare for season pass tiers
 */
export function playLevelUpSfx() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Quick rising arpeggio C4, E4, G4, C5, E5, G5, C6
    const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.42);
    });
  } catch {}
}

/**
 * Coin collection / reward claimed sound
 */
export function playClaimRewardSfx() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Two bright high chime pings
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.001, now + i * 0.09);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.36);
    });
  } catch {}
}

/**
 * Mechanical ticking sound as wheel spins
 */
export function playWheelTickSfx() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  } catch {}
}

/**
 * Big win jackpot fanfare for daily wheel
 */
export function playWheelWinSfx() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.85);
    });
  } catch {}
}



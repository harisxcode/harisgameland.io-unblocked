import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, FastForward, Play, ShieldCheck, Zap } from 'lucide-react';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';
import { playPabloPresentsSfx, playItsInTheGameFanfare, startRetroIntroMusic, RetroIntroMusicHandle } from '../utils/audio';

interface PabloRetroIntroProps {
  isOpen: boolean;
  onComplete: () => void;
  gameTitle?: string;
  gameGenre?: string;
}

export function PabloRetroIntro({
  isOpen,
  onComplete,
  gameTitle = 'Retro Classic',
  gameGenre = 'Arcade'
}: PabloRetroIntroProps) {
  // Intro animation phases: 'presents' -> 'mascot' -> 'ready'
  const [phase, setPhase] = useState<'presents' | 'mascot' | 'ready'>('presents');
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);
  const musicHandleRef = useRef<RetroIntroMusicHandle | null>(null);

  // Clear all pending timers
  const clearTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  // Graceful game transition handler
  const handleTransitionToGame = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    clearTimers();

    if (musicHandleRef.current) {
      musicHandleRef.current.transitionToGame(() => {
        onComplete();
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setPhase('presents');
      setIsTransitioning(false);
      musicHandleRef.current?.stop();
      musicHandleRef.current = null;
      return;
    }

    setPhase('presents');
    setIsTransitioning(false);

    // 1. Start energetic 8-bit / 16-bit retro arcade background music
    musicHandleRef.current = startRetroIntroMusic(isMuted);

    // Initial audio boot chime
    if (!isMuted) {
      playPabloPresentsSfx();
    }

    // 2. Sequence to Phase 2 (Retro Penguin Mascot + "It's in the game!") at 1.8s
    const t1 = setTimeout(() => {
      setPhase('mascot');
      if (!isMuted) {
        playItsInTheGameFanfare();
      }
    }, 1800);

    // 3. Sequence to Phase 3 (Ready / Press Start prompt) at 4.2s
    const t2 = setTimeout(() => {
      setPhase('ready');
    }, 4200);

    // 4. Smooth automatic transition into game at 5.5s
    const t3 = setTimeout(() => {
      handleTransitionToGame();
    }, 5500);

    timerRef.current = [t1, t2, t3];

    return () => {
      clearTimers();
      musicHandleRef.current?.stop();
      musicHandleRef.current = null;
    };
  }, [isOpen, onComplete]);

  // Sync mute state with background music
  useEffect(() => {
    musicHandleRef.current?.setMuted(isMuted);
  }, [isMuted]);

  // Keyboard shortcut: Space, Enter, or Escape transitions into the game
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleTransitionToGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleTransitionToGame}
      className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      title="Click anywhere or press Space to transition into game"
    >
      {/* Vintage CRT Scanlines and phosphor bloom overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1px, transparent 1px, transparent 3px)',
          backgroundSize: '100% 3px'
        }}
      />
      {/* CRT Vignette shadow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.92) 95%)'
        }}
      />

      {/* Top Controls Bar (Mute & Skip) */}
      <div 
        className="absolute top-3 left-3 right-3 flex items-center justify-between z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 bg-slate-950/80 border border-cyan-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            CHIPTUNE BGM · 138 BPM
          </span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        <button
          onClick={handleTransitionToGame}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all shadow-md hover:scale-105 cursor-pointer"
        >
          <span>SKIP TO GAME</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>

      {/* =========================================================
          TRANSITION TO GAME FLASH OVERLAY
         ========================================================= */}
      {isTransitioning && (
        <div className="absolute inset-0 z-50 bg-cyan-950/90 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 text-cyan-300 font-mono font-black text-xl sm:text-2xl tracking-widest animate-pulse">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span>GAME START · READY PLAYER 1</span>
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="text-xs font-mono text-cyan-400 mt-2 uppercase tracking-wider">
            Loading {gameTitle}...
          </div>
        </div>
      )}

      {/* =========================================================
          PHASE 1: "PABLO ARCADE PRESENTS"
         ========================================================= */}
      {phase === 'presents' && !isTransitioning && (
        <div className="flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-500 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.35em] text-cyan-400/90 uppercase">
              COIN-OP ENTERTAINMENT SYSTEM
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div className="relative">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-300 drop-shadow-[0_0_35px_rgba(6,182,212,0.85)] scale-y-110">
              PABLO ARCADE
            </h1>
            <div className="text-xl sm:text-3xl md:text-4xl font-black font-display tracking-[0.4em] uppercase text-white/95 mt-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
              PRESENTS
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <span className="h-0.5 w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <span>🎵</span>
              <span>SYNTHESIS MUSIC LOADING</span>
              <span>⚡</span>
            </span>
            <span className="h-0.5 w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>
      )}

      {/* =========================================================
          PHASE 2 & 3: RETRO PENGUIN EMOJI MASCOT + "IT'S IN THE GAME!"
         ========================================================= */}
      {(phase === 'mascot' || phase === 'ready') && !isTransitioning && (
        <div className="flex flex-col items-center justify-center text-center px-4 animate-in zoom-in-75 fade-in duration-500 space-y-5 max-w-xl">
          
          {/* Pablo The Penguin Retro Emoji Mascot Medallion */}
          <div className="relative group">
            {/* Outer pulsating neon rings */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500 via-amber-400 to-sky-400 opacity-70 blur-xl animate-pulse" />
            <div className="absolute -inset-1.5 rounded-full border-2 border-cyan-400/80 animate-spin" style={{ animationDuration: '14s' }} />
            
            {/* Retro Pixel Emoji Mascot Frame */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-amber-400 shadow-[0_0_45px_rgba(245,158,11,0.7)] bg-[#040816] flex items-center justify-center">
              <img 
                src={pabloMascotImg} 
                alt="Pablo the Penguin Retro Emoji Mascot" 
                className="w-full h-full object-cover object-center scale-105"
                style={{ imageRendering: 'pixelated' }}
              />
              {/* Scanline texture over pixel emoji for arcade authenticity */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 2px)',
                  backgroundSize: '100% 2px'
                }}
              />
            </div>

            {/* Mascot Crown / Emoji Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-[10px] sm:text-xs font-black font-display uppercase tracking-wider shadow-lg border border-amber-200 whitespace-nowrap flex items-center gap-1">
              <span>🐧</span>
              <span>PABLO THE PENGUIN</span>
              <span>⭐</span>
            </div>
          </div>

          {/* Requested Legendary Caption: "IT'S IN THE GAME!" */}
          <div className="space-y-1.5 pt-2 animate-in slide-in-from-bottom-4 duration-400">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.95)]">
              IT'S IN THE GAME!
            </h2>
            <div className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300/90 uppercase font-semibold flex items-center justify-center gap-2">
              <span>★</span>
              <span>RETRO ARCADE 16-BIT EDITION</span>
              <span>★</span>
            </div>
          </div>

          {/* Launching target game badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target:</span>
            <strong className="text-white font-bold">{gameTitle}</strong>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400">{gameGenre}</span>
          </div>

          {/* Press Start to play CTA */}
          <div className="pt-2">
            <button
              onClick={handleTransitionToGame}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/35 cursor-pointer animate-pulse"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START GAME / TRANSITION NOW</span>
            </button>
            <div className="text-[10px] font-mono text-slate-400 mt-1.5">
              Press [SPACE], [ENTER] or Click to jump in immediately
            </div>
          </div>

        </div>
      )}

      {/* Bottom Arcade Copyright Tag */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] font-mono text-slate-600 tracking-wider uppercase">
          © 2026 PABLO ARCADE CORPORATION · BACKGROUND CHIPTUNE STEREO SOUND
        </p>
      </div>
    </div>
  );
}

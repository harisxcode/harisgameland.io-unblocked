import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, FastForward, Play, ShieldCheck } from 'lucide-react';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';
import { playPabloPresentsSfx, playItsInTheGameFanfare } from '../utils/audio';

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
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all pending timers
  const clearTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setPhase('presents');
      setHasStartedAudio(false);
      return;
    }

    setPhase('presents');

    // Trigger Phase 1 audio (Pablo Arcade Presents)
    if (!isMuted) {
      playPabloPresentsSfx();
      setHasStartedAudio(true);
    }

    // Sequence to Phase 2 (Mascot + "It's in the game!") at 1.8s
    const t1 = setTimeout(() => {
      setPhase('mascot');
      if (!isMuted) {
        playItsInTheGameFanfare();
      }
    }, 1800);

    // Sequence to Phase 3 (Ready / Auto Complete prompt) at 4.2s
    const t2 = setTimeout(() => {
      setPhase('ready');
    }, 4200);

    // Auto complete at 5.5s so player seamlessly transitions to the game
    const t3 = setTimeout(() => {
      onComplete();
    }, 5500);

    timerRef.current = [t1, t2, t3];

    return () => clearTimers();
  }, [isOpen, onComplete, isMuted]);

  // Keyboard shortcut: Space, Enter, or Escape skips intro
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        clearTimers();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={() => {
        clearTimers();
        onComplete();
      }}
      className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      title="Click anywhere or press Space to skip"
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
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 bg-slate-950/80 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
            ARCADE BIOS v2.6 · 60 FPS
          </span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute intro' : 'Mute intro'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        <button
          onClick={() => {
            clearTimers();
            onComplete();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all shadow-md hover:scale-105 cursor-pointer"
        >
          <span>SKIP INTRO</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>

      {/* =========================================================
          PHASE 1: "PABLO ARCADE PRESENTS"
         ========================================================= */}
      {phase === 'presents' && (
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
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              HIGH VOLTAGE RETRO ENGINE
            </span>
            <span className="h-0.5 w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>
      )}

      {/* =========================================================
          PHASE 2 & 3: PABLO THE PENGUIN + "IT'S IN THE GAME!"
         ========================================================= */}
      {(phase === 'mascot' || phase === 'ready') && (
        <div className="flex flex-col items-center justify-center text-center px-4 animate-in zoom-in-75 fade-in duration-500 space-y-5 max-w-xl">
          
          {/* Pablo The Penguin Mascot Medallion */}
          <div className="relative group">
            {/* Outer pulsating neon rings */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500 via-amber-400 to-sky-400 opacity-60 blur-xl animate-pulse" />
            <div className="absolute -inset-1.5 rounded-full border-2 border-cyan-400/80 animate-spin" style={{ animationDuration: '14s' }} />
            
            {/* Mascot Image Frame */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.6)] bg-slate-950">
              <img 
                src={pabloMascotImg} 
                alt="Pablo the Penguin Arcade Mascot" 
                className="w-full h-full object-cover object-top scale-105"
              />
              {/* Scanline texture over photo for vintage arcade authenticity */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 2px)',
                  backgroundSize: '100% 2px'
                }}
              />
            </div>

            {/* Mascot Crown Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] sm:text-xs font-black font-display uppercase tracking-wider shadow-lg border border-amber-200 whitespace-nowrap">
              ★ PABLO THE PENGUIN ★
            </div>
          </div>

          {/* Requested Legendary Caption: "IT'S IN THE GAME!" */}
          <div className="space-y-1.5 pt-2 animate-in slide-in-from-bottom-4 duration-400">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.95)]">
              IT'S IN THE GAME!
            </h2>
            <div className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300/90 uppercase font-semibold">
              ORIGINAL PABLO ARCADE EDITION
            </div>
          </div>

          {/* Launching target game badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Loading:</span>
            <strong className="text-white font-bold">{gameTitle}</strong>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400">{gameGenre}</span>
          </div>

          {/* Press Start to play blinking CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                clearTimers();
                onComplete();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 cursor-pointer animate-pulse"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>PRESS START / CLICK TO PLAY</span>
            </button>
            <div className="text-[10px] font-mono text-slate-500 mt-1">
              Press [SPACE] or Click to jump in immediately
            </div>
          </div>

        </div>
      )}

      {/* Bottom Arcade Copyright Tag */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] font-mono text-slate-600 tracking-wider uppercase">
          © 2025 PABLO ARCADE CORPORATION · ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

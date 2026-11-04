import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  RotateCw, 
  Crown, 
  Trophy, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Gift 
} from 'lucide-react';
import { UserAccount, DailySpinSlice } from '../types';
import { 
  DAILY_SPIN_SLICES, 
  checkDailySpinStatus, 
  executeDailySpin, 
  ensureUserProgression 
} from '../utils/seasonPass';
import { playWheelTickSfx, playWheelWinSfx, playArcadeSfx } from '../utils/audio';

interface DailySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenSeasonPass?: () => void;
}

export function DailySpinModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenSeasonPass
}: DailySpinModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winningSlice, setWinningSlice] = useState<DailySpinSlice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const user = currentUser ? ensureUserProgression(currentUser) : null;
  const status = checkDailySpinStatus(user);

  // Format countdown string
  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const handleSpin = (useTokens: boolean = false) => {
    if (isSpinning) return;
    setErrorMsg(null);
    setWinningSlice(null);
    playArcadeSfx('click');

    const result = executeDailySpin(useTokens);
    if (!result.success || !result.slice || result.sliceIndex === undefined || !result.user) {
      setErrorMsg(result.message);
      return;
    }

    setIsSpinning(true);

    // Calculate rotation:
    // 8 slices => each slice spans 45 degrees (360 / 8)
    // Slices are laid out from slice 0 at angle 0.
    // The pointer is at top (270 degrees or 90 degrees depending on base).
    // Let's rotate 5 full 360 loops (1800 deg) + target angle so picked slice lands under pointer
    const sliceAngle = 360 / DAILY_SPIN_SLICES.length;
    // Pointer is at top (270 deg / -90 deg). We want sliceIndex to land at top.
    const targetOffset = 360 - (result.sliceIndex * sliceAngle + sliceAngle / 2);
    const extraFullRotations = 360 * 6; // 6 full spins
    const totalRotation = wheelRotation + extraFullRotations + targetOffset;

    setWheelRotation(totalRotation);

    // Play periodic tick sounds
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playWheelTickSfx();
      tickCount++;
      if (tickCount > 24) clearInterval(tickInterval);
    }, 140);

    // Easing finishes after 3.8s
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWinningSlice(result.slice!);
      playWheelWinSfx();
      onUserUpdated(result.user!);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#091530] via-[#060e22] to-[#040816] border-2 border-cyan-400/50 rounded-3xl shadow-2xl shadow-cyan-950/70 p-5 sm:p-6 text-white overflow-hidden flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          title="Close wheel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DAILY LUCKY WHEEL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-amber-300">
            Spin For Tokens & XP!
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              Day {status.streak} Streak
            </span>
            <span>·</span>
            <span>Your Points: <strong className="text-cyan-300">{user?.penguinPoints || 0} pts</strong></span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center select-none">
          
          {/* Outer glowing ring with neon pegs */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] ring-4 ring-cyan-500/30 bg-[#020510]" />

          {/* Top Pointer Arrow */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-6 h-6 bg-amber-400 transform rotate-45 rounded-sm border-2 border-white shadow-md shadow-amber-500/50 -mb-2" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>

          {/* Rotating SVG Wheel */}
          <div 
            className="w-full h-full rounded-full transition-transform ease-out"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transitionDuration: isSpinning ? '3800ms' : '0ms'
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full rounded-full overflow-hidden">
              {DAILY_SPIN_SLICES.map((slice, index) => {
                const angle = 360 / DAILY_SPIN_SLICES.length;
                const startAngle = index * angle;
                const endAngle = (index + 1) * angle;

                // SVG slice path
                const x1 = 100 + 96 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 96 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 96 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 96 * Math.sin((Math.PI * endAngle) / 180);
                const pathData = `M100,100 L${x1},${y1} A96,96 0 0,1 ${x2},${y2} Z`;

                // Center text rotation
                const textAngle = startAngle + angle / 2;
                const textRadius = 65;
                const tx = 100 + textRadius * Math.cos((Math.PI * textAngle) / 180);
                const ty = 100 + textRadius * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={slice.id}>
                    <path
                      d={pathData}
                      fill={slice.color}
                      stroke="#040916"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                    >
                      {slice.icon} {slice.title.replace('Tokens', 'Pts')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center pointer-events-none z-20">
            <span className="text-xl">🐧</span>
            <span className="text-[8px] font-black font-mono text-cyan-300 uppercase tracking-tighter">PABLO</span>
          </div>

        </div>

        {/* Win Alert Announcement */}
        {winningSlice && (
          <div className="w-full my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-amber-950/80 border-2 border-amber-400 shadow-lg shadow-amber-500/20 text-center animate-in zoom-in duration-300">
            <div className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-black flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRIZE WON!</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black font-display text-white mt-0.5">
              {winningSlice.icon} {winningSlice.title}
            </div>
            <p className="text-xs text-amber-200/90 font-mono mt-0.5">
              Reward added to your profile! {winningSlice.type === 'xp' && 'Check your Season Pass tiers!'}
            </p>
          </div>
        )}

        {/* Spin Actions */}
        <div className="w-full mt-3 flex flex-col gap-2">
          {status.canSpinFree ? (
            <button
              onClick={() => handleSpin(false)}
              disabled={isSpinning}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING THE WHEEL...' : 'FREE DAILY SPIN'}</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                disabled
                className="flex-1 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 font-mono text-xs flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Free in {formatCountdown(status.timeLeftMs)}</span>
              </button>

              <button
                onClick={() => handleSpin(true)}
                disabled={isSpinning || (user?.penguinPoints || 0) < 15}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Spin Again (15 Pts)</span>
              </button>
            </div>
          )}

          {/* Quick link to Season Pass */}
          {onOpenSeasonPass && (
            <button
              onClick={() => {
                onClose();
                onOpenSeasonPass();
              }}
              className="py-1.5 text-center text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              View Season 1: Neon Frost Pass →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

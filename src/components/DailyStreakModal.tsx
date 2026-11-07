import React from 'react';
import { Flame, Coins, Calendar, CheckCircle2, Clock, X, Sparkles, Crown, Gem, Star } from 'lucide-react';
import { UserAccount } from '../types';
import { STREAK_DAYS_CONFIG, calculateDailyStreakRewardPoints, getTodayLocalDateStr } from '../utils/streak';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onClaimToday?: () => void;
}

export function DailyStreakModal({
  isOpen,
  onClose,
  currentUser,
  onClaimToday
}: DailyStreakModalProps) {
  if (!isOpen || !currentUser) return null;

  const currentStreak = currentUser.dailyLoginStreak || 1;
  const todayStr = getTodayLocalDateStr();
  const claimedToday = currentUser.lastDailyStreakRewardDate === todayStr;
  const vipTier = currentUser.vipTier;

  // Normalized day in 7-day cycle (1 to 7)
  const cycleDay = ((currentStreak - 1) % 7) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-br from-[#070e24] via-[#0b1638] to-[#050b1a] border-2 border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-950/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-orange-950/60 via-[#1e0e04] to-amber-950/50 border-b border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0a0814] rounded-[14px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400 fill-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                  Daily Login Streak
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  {currentStreak} Days
                </span>
              </div>
              <p className="text-xs text-orange-200/80 mt-0.5">
                Return every consecutive day to earn escalated bonus Penguin Points!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30">
          
          {/* Active Status Banner */}
          <div className="p-4 rounded-2xl bg-[#091535] border border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>Today's Status:</span>
              </div>
              <div className="flex items-center gap-2">
                {claimedToday ? (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Day {currentStreak} Reward Claimed!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Reward Ready to Claim!</span>
                  </span>
                )}
                
                {claimedToday && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Return tomorrow for Day {currentStreak + 1}!
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Total Tokens Balance</div>
              <div className="text-lg font-black text-amber-300 font-mono flex items-center gap-1 sm:justify-end">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{currentUser.penguinPoints.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Calendar Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>7-Day Reward Progression</span>
              </span>
              <span className="text-orange-400 text-[11px]">
                {currentStreak > 7 ? `${currentStreak}d Streak Bonus Active!` : `Day ${cycleDay} of 7`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {STREAK_DAYS_CONFIG.map((cfg) => {
                const isCompleted = claimedToday ? cycleDay >= cfg.day : cycleDay > cfg.day;
                const isCurrent = cycleDay === cfg.day;
                const points = calculateDailyStreakRewardPoints(cfg.day, vipTier);

                return (
                  <div
                    key={`streak-day-${cfg.day}`}
                    className={`relative p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-b from-orange-500/25 to-amber-500/15 border-2 border-orange-400 shadow-lg shadow-orange-500/20 scale-105'
                        : isCompleted
                        ? 'bg-[#091535]/80 border border-emerald-500/40 text-slate-300'
                        : 'bg-[#08122d]/60 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-1.5 right-1.5 text-emerald-400" title="Completed">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isCurrent && (
                      <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-orange-500 text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider">
                        Active
                      </span>
                    )}

                    <span className="text-lg mt-1">{cfg.icon}</span>
                    <span className="text-[11px] font-bold text-white mt-1">Day {cfg.day}</span>
                    <span className="text-xs font-black font-mono text-amber-300 mt-0.5">
                      +{points}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate w-full">
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VIP Multiplier Bonus Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#120f2c] to-indigo-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                {vipTier === 'diamond' ? (
                  <Gem className="w-5 h-5 text-cyan-400" />
                ) : vipTier === 'gold' ? (
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                ) : (
                  <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>VIP Streak Multiplier</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 text-[10px] font-mono font-bold uppercase">
                    {vipTier ? `${vipTier} VIP` : 'Standard'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 mt-0.5">
                  {vipTier === 'diamond' 
                    ? '💎 Diamond VIP: 2.0x Double Points on every daily login streak!' 
                    : vipTier === 'gold'
                    ? '👑 Gold VIP: 1.5x Multiplier bonus applied to your streak points!'
                    : vipTier === 'regular'
                    ? '⭐ Regular VIP: 1.25x Multiplier boost applied to daily logins!'
                    : 'Upgrade to VIP in the Game Center to earn up to 2x more streak points!'}
                </p>
              </div>
            </div>
          </div>

          {/* Rules & streak preservation note */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>How the Daily Login Streak works:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
              <li>Log in every consecutive day to keep your streak alive and increase point rewards.</li>
              <li>Missing a day resets your streak back to Day 1.</li>
              <li>Points can be used to feed Pablo snacks, unlock VIP games, or redeem arcade titles!</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#050c20] border-t border-slate-800 flex items-center justify-end gap-3">
          {!claimedToday && onClaimToday && (
            <button
              onClick={() => {
                onClaimToday();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 fill-slate-950" />
              <span>Claim Today's Points</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

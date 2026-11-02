import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Gamepad2,
  Zap,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game, UserAccount } from '../types';
import { unlockVipWithPoints, unlockVipWithCash } from '../utils/auth';

interface VipLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onUnlockedPlay: (game: Game) => void;
}

export const VipLockModal: React.FC<VipLockModalProps> = ({
  isOpen,
  onClose,
  game,
  currentUser,
  onUserUpdated,
  onUnlockedPlay
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'points' | 'cash'>('points');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen || !game) return null;

  const userPoints = currentUser?.penguinPoints || 0;
  const REQUIRED_POINTS = 500;
  const hasEnoughPoints = userPoints >= REQUIRED_POINTS;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleUnlockWithPoints = () => {
    setIsProcessing(true);
    setMessage(null);

    setTimeout(() => {
      const res = unlockVipWithPoints();
      setIsProcessing(false);
      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        onUserUpdated(res.user);
        triggerConfetti();
        setTimeout(() => {
          onClose();
          onUnlockedPlay(game);
        }, 1200);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }, 400);
  };

  const handleUnlockWithCash = () => {
    setIsProcessing(true);
    setMessage(null);

    setTimeout(() => {
      const res = unlockVipWithCash();
      setIsProcessing(false);
      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        onUserUpdated(res.user);
        triggerConfetti();
        setTimeout(() => {
          onClose();
          onUnlockedPlay(game);
        }, 1200);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#070e20] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 border border-slate-700/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 mb-3 shadow-lg shadow-amber-500/20 animate-pulse">
            <Crown className="w-8 h-8 fill-amber-400" />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            VIP ACCESS REQUIRED
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Unlock {game.title}
          </h2>

          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            This premier game is reserved for Haris Game Center VIP members. Choose how you want to unlock unlimited lifetime access:
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`mb-5 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Two Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          {/* Option 1: 500 Penguin Points */}
          <div
            onClick={() => setSelectedMethod('points')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'points'
                ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Coins className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded">
                FREE VIA PLAY
              </span>
            </div>

            <div className="text-sm font-bold text-white mb-0.5">
              500 Penguin Points
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              Earned simply by playing any game in our unblocked center.
            </p>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-400">Your Balance:</span>
                <span className={hasEnoughPoints ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {userPoints} / 500 pts
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-1.5 transition-all duration-300"
                  style={{ width: `${Math.min(100, (userPoints / 500) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Option 2: $5 USD Checkout */}
          <div
            onClick={() => setSelectedMethod('cash')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'cash'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CreditCard className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded">
                INSTANT VIP
              </span>
            </div>

            <div className="text-sm font-bold text-white mb-0.5">
              $5.00 USD Upgrade
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              Instant Diamond VIP pass + 250 bonus Penguin Points gift!
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">One-time payment:</span>
              <span className="text-amber-300 font-bold">$5.00</span>
            </div>
          </div>

        </div>

        {/* VIP Catalog Games Strip */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-400" /> UNLOCKS ALL 6 VIP EXPANSIONS:
            </span>
            <span className="text-slate-400 font-sans">0% Lag Guaranteed</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-300">🚨 Escape Road</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-300">⚡ Slope 3D</span>
            <span className="px-2 py-0.5 rounded-md bg-sky-950 border border-sky-500/30 text-sky-300">🎯 1v1.LOL Arena</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/30 text-amber-300">🚜 Drive Mad</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/30 text-purple-300">🏎️ Nitro League</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-950 border border-blue-500/30 text-blue-300">☁️ Roblox Cloud</span>
          </div>
        </div>

        {/* Action Button */}
        {selectedMethod === 'points' ? (
          <div>
            <button
              onClick={handleUnlockWithPoints}
              disabled={!hasEnoughPoints || isProcessing}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                hasEnoughPoints
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>
                {hasEnoughPoints
                  ? 'Redeem 500 Penguin Points for VIP'
                  : `Need ${500 - userPoints} More Points (Play Games To Earn!)`}
              </span>
            </button>
            {!hasEnoughPoints && (
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Tip: Each time you play any game, Pablo awards you <span className="text-cyan-300 font-bold">+25 Penguin Points</span>!
              </p>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={handleUnlockWithCash}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay $5.00 USD & Unlock VIP Instantly</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              🔒 Safe 256-bit instant simulation. Unlocks all VIP games immediately for this browser!
            </p>
          </div>
        )}

        {/* Legal Terms of Agreement Notice */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
          VIP access and Penguin Point redemptions are subject to Haris Game Center's Terms of Agreement &amp; Virtual Currency Policy.
        </div>

      </div>
    </div>
  );
};

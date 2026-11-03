import React, { useState, useEffect } from 'react';
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
  Lock,
  Star,
  Gem,
  Award,
  Check,
  ArrowRight,
  Fish,
  User,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game, UserAccount, VipTierLevel } from '../types';
import { 
  VIP_TIERS_CONFIG, 
  unlockVipTierWithPoints, 
  unlockVipTierWithCash,
  updateUserProfileCustomization,
  hasVipTierAccess,
  isOwnerAccount
} from '../utils/auth';
import { playArcadeSfx } from '../utils/audio';

interface VipLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onUnlockedPlay?: (game: Game) => void;
  onOpenPabloFeed?: () => void;
}

type ModalTab = 'tiers' | 'titles' | 'foods';

export const VipLockModal: React.FC<VipLockModalProps> = ({
  isOpen,
  onClose,
  game,
  currentUser,
  onUserUpdated,
  onUnlockedPlay,
  onOpenPabloFeed
}) => {
  // Pre-select tier based on game if game requires a specific tier
  const defaultTier: 'regular' | 'gold' | 'diamond' = 
    game?.vipTierRequired ? game.vipTierRequired : 
    (currentUser?.vipTier === 'regular' ? 'gold' : currentUser?.vipTier === 'gold' ? 'diamond' : 'regular');

  const [selectedTier, setSelectedTier] = useState<'regular' | 'gold' | 'diamond'>(defaultTier);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'tokens' | 'usd'>('tokens');
  const [activeTab, setActiveTab] = useState<ModalTab>('tiers');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile customization state
  const [activeTitle, setActiveTitle] = useState(currentUser?.activeTitle || 'Arcade Challenger');
  const [activeAvatar, setActiveAvatar] = useState(currentUser?.avatar || '🐧');

  // Update selection when game changes
  useEffect(() => {
    if (game?.vipTierRequired) {
      setSelectedTier(game.vipTierRequired);
    }
  }, [game]);

  useEffect(() => {
    if (currentUser) {
      setActiveTitle(currentUser.activeTitle || 'Arcade Challenger');
      setActiveAvatar(currentUser.avatar || '🐧');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const userPoints = currentUser?.penguinPoints || 0;
  const currentTier: VipTierLevel = currentUser?.vipTier || (currentUser?.isVip ? 'regular' : 'none');
  const isOwner = isOwnerAccount(currentUser);

  const selectedConfig = VIP_TIERS_CONFIG[selectedTier];
  const requiredTokens = selectedConfig.tokenCost; // 500, 750, 1000
  const hasEnoughTokens = userPoints >= requiredTokens;
  const alreadyOwnsSelectedTier = hasVipTierAccess(currentTier, selectedTier, isOwner);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleUnlockWithTokens = () => {
    setIsProcessing(true);
    setMessage(null);
    playArcadeSfx('click');

    setTimeout(() => {
      const res = unlockVipTierWithPoints(selectedTier);
      setIsProcessing(false);
      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        onUserUpdated(res.user);
        triggerConfetti();
        if (game && onUnlockedPlay) {
          setTimeout(() => {
            onClose();
            onUnlockedPlay(game);
          }, 1400);
        }
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }, 400);
  };

  const handleUnlockWithUSD = () => {
    setIsProcessing(true);
    setMessage(null);
    playArcadeSfx('click');

    setTimeout(() => {
      const res = unlockVipTierWithCash(selectedTier);
      setIsProcessing(false);
      if (res.success && res.user) {
        setMessage({ text: res.message, type: 'success' });
        onUserUpdated(res.user);
        triggerConfetti();
        if (game && onUnlockedPlay) {
          setTimeout(() => {
            onClose();
            onUnlockedPlay(game);
          }, 1400);
        }
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }, 500);
  };

  const handleSaveProfileCustomization = (newTitle?: string, newAvatar?: string) => {
    playArcadeSfx('click');
    const res = updateUserProfileCustomization(newTitle, newAvatar);
    if (res.success && res.user) {
      onUserUpdated(res.user);
      setMessage({ text: 'Profile title and badge equipped successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#070e20] border-2 border-amber-500/50 rounded-3xl flex flex-col shadow-2xl shadow-amber-500/20 overflow-hidden my-auto animate-fadeIn">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-amber-400 to-cyan-400" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 border border-slate-700/80 transition-colors cursor-pointer"
          aria-label="Close VIP modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-[#091535] via-[#0d1f48] to-[#091535] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Crown className="w-7 h-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                  VIP Membership &amp; Access Pass
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  3 TIERS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Unlock exclusive games, gamer titles, custom profile badges, and gourmet Pablo foods!
              </p>
            </div>
          </div>

          {/* User's Current Balance & Status */}
          <div className="flex items-center gap-2 bg-[#050b1a] px-3.5 py-2 rounded-2xl border border-cyan-500/30">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Your Balance</div>
              <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{userPoints} Tokens</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800 mx-1" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Current Tier</div>
              <div className="text-xs font-bold font-mono uppercase text-cyan-300">
                {currentTier === 'none' ? 'Standard' : `${currentTier} VIP`}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#060b1c] px-5 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'tiers'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>VIP Tiers &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('titles')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'titles'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Gaming Titles &amp; Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab('foods')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'foods'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Pablo's VIP Foods</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* Alert / Notification Banner */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
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
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Context Banner if opened from a specific locked game */}
          {game && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/40 shrink-0">
                  <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{game.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                      Requires {game.vipTierRequired || 'regular'} VIP
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Unlock {VIP_TIERS_CONFIG[game.vipTierRequired || 'regular'].name} or higher to play immediately!
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-amber-300 font-bold">{VIP_TIERS_CONFIG[game.vipTierRequired || 'regular'].tokenCost} Tokens</span>
                <span className="text-slate-400 block text-[10px]">or ${VIP_TIERS_CONFIG[game.vipTierRequired || 'regular'].usdCost.toFixed(2)} USD</span>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 1: VIP TIERS & PRICING (3 GRADE LEVELS)
             ======================================================== */}
          {activeTab === 'tiers' && (
            <div className="space-y-6">
              
              {/* Three Grade Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. REGULAR VIP (500 Tokens / $4.99 USD) */}
                <div
                  onClick={() => setSelectedTier('regular')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedTier === 'regular'
                      ? 'border-purple-400 bg-gradient-to-b from-purple-950/60 to-[#0c132e] ring-2 ring-purple-400/30 shadow-xl shadow-purple-950/60'
                      : 'border-slate-800 bg-[#080f24]/80 hover:border-purple-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Star className="w-5 h-5 fill-purple-400" />
                      </span>
                      <span className="text-[10px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        STARTER GRADE
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white font-display">Regular VIP</h3>
                    <p className="text-xs text-slate-300 mb-3 min-h-[32px]">
                      Arcade Pass with unblocked games, titles, and snacks.
                    </p>

                    {/* Dual Pricing Pill */}
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-purple-300 font-black text-sm flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> 500 Tokens
                        </span>
                        <span className="text-slate-300 font-bold">$4.99 USD</span>
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="text-[11px] font-mono uppercase text-purple-400 font-bold">Unlocks:</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>3 Games: Nitro League, Slope, Paper.io</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>4 Titles: VIP Grinder, Arcade Apprentice...</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>2 Pablo Foods: Glacial Sprats &amp; Krill</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>Regular VIP Profile Star Badge</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-purple-500/20">
                    {hasVipTierAccess(currentTier, 'regular', isOwner) ? (
                      <span className="w-full py-1.5 text-[11px] font-mono font-bold text-center block text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        ✓ UNLOCKED (ACTIVE)
                      </span>
                    ) : (
                      <button 
                        type="button" 
                        className="w-full py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                      >
                        Select Regular VIP
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. GOLD VIP (750 Tokens / $7.99 USD) */}
                <div
                  onClick={() => setSelectedTier('gold')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedTier === 'gold'
                      ? 'border-amber-400 bg-gradient-to-b from-amber-950/60 to-[#1c1605] ring-2 ring-amber-400/40 shadow-xl shadow-amber-950/80 scale-[1.02]'
                      : 'border-slate-800 bg-[#080f24]/80 hover:border-amber-500/40'
                  }`}
                >
                  {/* Popular Tag */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black font-mono shadow-md uppercase tracking-wider">
                    MOST POPULAR
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Crown className="w-5 h-5 fill-amber-400" />
                      </span>
                      <span className="text-[10px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        CHAMPION GRADE
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white font-display">Gold VIP</h3>
                    <p className="text-xs text-slate-300 mb-3 min-h-[32px]">
                      High-Roller Pass with Retro Bowl, Escape Road &amp; Gold Crown.
                    </p>

                    {/* Dual Pricing Pill */}
                    <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-300 font-black text-sm flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> 750 Tokens
                        </span>
                        <span className="text-slate-300 font-bold">$7.99 USD</span>
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">Unlocks Everything in Regular + :</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>3 Gold Games: Escape Road, Retro Bowl, Drive Mad</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>4 Titles: Golden Legend, Pablo's Champion...</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>2 Rare Foods: Golden Salmon &amp; Honeycomb</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Gold Glowing Crown &amp; 1.5x Daily Points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-amber-500/20">
                    {hasVipTierAccess(currentTier, 'gold', isOwner) ? (
                      <span className="w-full py-1.5 text-[11px] font-mono font-bold text-center block text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        ✓ UNLOCKED (ACTIVE)
                      </span>
                    ) : (
                      <button 
                        type="button" 
                        className="w-full py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 transition-all font-black"
                      >
                        Select Gold VIP
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. DIAMOND VIP (1000 Tokens / $11.99 USD) */}
                <div
                  onClick={() => setSelectedTier('diamond')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedTier === 'diamond'
                      ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/70 to-[#071638] ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/80'
                      : 'border-slate-800 bg-[#080f24]/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <Gem className="w-5 h-5 text-cyan-400" />
                      </span>
                      <span className="text-[10px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        OVERLORD GRADE
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white font-display">Diamond VIP</h3>
                    <p className="text-xs text-slate-300 mb-3 min-h-[32px]">
                      Supreme Tier with Roblox Cloud, 1v1 Arena &amp; Diamond Halo.
                    </p>

                    {/* Dual Pricing Pill */}
                    <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-300 font-black text-sm flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> 1000 Tokens
                        </span>
                        <span className="text-slate-300 font-bold">$11.99 USD</span>
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold">Unlocks ALL 9 VIP Games:</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>Roblox Cloud, 1v1 Arena, Tunnel Rush + all 6</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>4 Overlord Titles: Diamond Overlord, God...</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>2 Ultra Feasts: Diamond Caviar &amp; Sundae</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>Holographic Halo, Double Points &amp; Chat Glow</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-cyan-500/20">
                    {hasVipTierAccess(currentTier, 'diamond', isOwner) ? (
                      <span className="w-full py-1.5 text-[11px] font-mono font-bold text-center block text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        ✓ UNLOCKED (MAX TIER)
                      </span>
                    ) : (
                      <button 
                        type="button" 
                        className="w-full py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:brightness-110 transition-all font-black"
                      >
                        Select Diamond VIP
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Checkout & Payment Options for Selected Tier */}
              <div className="p-5 rounded-3xl bg-[#08122c] border border-cyan-500/30 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                      <span>Checkout for {selectedConfig.name}</span>
                      <span className="text-xs font-mono font-normal text-cyan-400">({selectedConfig.badge})</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Choose to pay with your in-game earned tokens (Penguin Points) or instant USD upgrade.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#040816] p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setSelectedPaymentMethod('tokens')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        selectedPaymentMethod === 'tokens'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tokens ({selectedConfig.tokenCost} pts)
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('usd')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        selectedPaymentMethod === 'usd'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      USD (${selectedConfig.usdCost.toFixed(2)})
                    </button>
                  </div>
                </div>

                {/* Tokens Method Detail */}
                {selectedPaymentMethod === 'tokens' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Your Current Balance:</span>
                      <span className={hasEnoughTokens ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {userPoints} / {requiredTokens} Tokens
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-2.5 transition-all duration-500 ${
                          hasEnoughTokens ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-cyan-400'
                        }`}
                        style={{ width: `${Math.min(100, (userPoints / requiredTokens) * 100)}%` }}
                      />
                    </div>

                    <button
                      onClick={handleUnlockWithTokens}
                      disabled={!hasEnoughTokens || isProcessing || alreadyOwnsSelectedTier}
                      className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                        alreadyOwnsSelectedTier
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : hasEnoughTokens
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 shadow-lg shadow-cyan-500/25 cursor-pointer transform active:scale-98'
                          : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span>
                        {alreadyOwnsSelectedTier
                          ? `Already Unlocked (${selectedConfig.name})`
                          : hasEnoughTokens
                          ? `Redeem ${requiredTokens} Tokens for ${selectedConfig.name}`
                          : `Need ${requiredTokens - userPoints} More Tokens (Play games to earn +25 pts each!)`}
                      </span>
                    </button>
                  </div>
                ) : (
                  /* USD Method Detail */
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                      <span>Includes instant VIP activation + bonus points gift!</span>
                      <span className="font-mono font-bold text-amber-300">
                        +{selectedTier === 'regular' ? '150' : selectedTier === 'gold' ? '300' : '500'} Bonus Pts
                      </span>
                    </div>

                    <button
                      onClick={handleUnlockWithUSD}
                      disabled={isProcessing || alreadyOwnsSelectedTier}
                      className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                        alreadyOwnsSelectedTier
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/25 cursor-pointer transform active:scale-98'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {alreadyOwnsSelectedTier
                          ? `Already Unlocked (${selectedConfig.name})`
                          : `Pay $${selectedConfig.usdCost.toFixed(2)} USD & Activate ${selectedConfig.name} Instantly`}
                      </span>
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 2: GAMING TITLES & GAME PROFILES
             ======================================================== */}
          {activeTab === 'titles' && (
            <div className="space-y-6">
              
              {/* Profile Card Preview */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#091535] via-[#0d2250] to-[#091535] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-3xl shadow-lg relative">
                    {activeAvatar}
                    <span className="absolute -bottom-2 -right-2 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] font-mono">
                      {currentTier.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-mono">{currentUser?.username || 'Player'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30 font-bold">
                        {activeTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Your title and avatar appear in the top navbar, game leaderboards, and the community lounge chat!
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400">Total Games Played</div>
                  <div className="text-sm font-bold text-white font-mono">{currentUser?.gamesPlayedCount || 0} sessions</div>
                </div>
              </div>

              {/* Title Selector Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Choose Your Gaming Title</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    // Standard
                    { title: 'Arcade Challenger', requiredTier: 'none', color: 'border-slate-700 bg-slate-900/60 text-slate-300' },
                    // Regular VIP
                    { title: 'VIP Grinder', requiredTier: 'regular', color: 'border-purple-500/40 bg-purple-950/30 text-purple-200' },
                    { title: 'Arcade Apprentice', requiredTier: 'regular', color: 'border-purple-500/40 bg-purple-950/30 text-purple-200' },
                    { title: 'Ice Breaker', requiredTier: 'regular', color: 'border-purple-500/40 bg-purple-950/30 text-purple-200' },
                    { title: 'Penguin Cadet', requiredTier: 'regular', color: 'border-purple-500/40 bg-purple-950/30 text-purple-200' },
                    // Gold VIP
                    { title: 'Golden Legend', requiredTier: 'gold', color: 'border-amber-500/40 bg-amber-950/30 text-amber-200' },
                    { title: "Pablo's Champion", requiredTier: 'gold', color: 'border-amber-500/40 bg-amber-950/30 text-amber-200' },
                    { title: 'High Roller', requiredTier: 'gold', color: 'border-amber-500/40 bg-amber-950/30 text-amber-200' },
                    { title: 'Golden Striker', requiredTier: 'gold', color: 'border-amber-500/40 bg-amber-950/30 text-amber-200' },
                    // Diamond VIP
                    { title: 'Diamond Overlord', requiredTier: 'diamond', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' },
                    { title: 'Emperor of Ice', requiredTier: 'diamond', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' },
                    { title: 'Arcade God', requiredTier: 'diamond', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' },
                    { title: 'Untouchable Grinder', requiredTier: 'diamond', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' }
                  ].map((item) => {
                    const isUnlocked = item.requiredTier === 'none' || hasVipTierAccess(currentTier, item.requiredTier as any, isOwner);
                    const isSelected = activeTitle === item.title;

                    return (
                      <button
                        key={item.title}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveTitle(item.title);
                            handleSaveProfileCustomization(item.title, undefined);
                          } else {
                            setSelectedTier(item.requiredTier as any);
                            setActiveTab('tiers');
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 border-cyan-400 bg-cyan-950/60 shadow-md shadow-cyan-950/50'
                            : isUnlocked
                            ? `${item.color} hover:brightness-125`
                            : 'border-slate-800/80 bg-slate-950/40 text-slate-500'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-mono">{item.title}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {item.requiredTier === 'none' ? 'Free Starter' : `Requires ${item.requiredTier.toUpperCase()} VIP`}
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="p-1 rounded-full bg-cyan-400 text-slate-950">
                            <Check className="w-3 h-3" />
                          </span>
                        ) : !isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Avatar Selector Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>VIP Profile Badges &amp; Avatars</span>
                </h4>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    { av: '🐧', name: 'Pablo Fan', req: 'none' },
                    { av: '⭐', name: 'Regular Star', req: 'regular' },
                    { av: '🎮', name: 'Retro Joypad', req: 'regular' },
                    { av: '⚡', name: 'Lightning Bolt', req: 'regular' },
                    { av: '👑', name: 'Golden Crown', req: 'gold' },
                    { av: '🏆', name: 'Trophy Cup', req: 'gold' },
                    { av: '🦁', name: 'Gold Lion', req: 'gold' },
                    { av: '🌟', name: 'Glow Star', req: 'gold' },
                    { av: '💎', name: 'Diamond Gem', req: 'diamond' },
                    { av: '🌌', name: 'Cosmic Galaxy', req: 'diamond' },
                    { av: '🦅', name: 'Frost Eagle', req: 'diamond' },
                    { av: '🔱', name: 'Poseidon Trident', req: 'diamond' }
                  ].map((item) => {
                    const isUnlocked = item.req === 'none' || hasVipTierAccess(currentTier, item.req as any, isOwner);
                    const isSelected = activeAvatar === item.av;

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveAvatar(item.av);
                            handleSaveProfileCustomization(undefined, item.av);
                          } else {
                            setSelectedTier(item.req as any);
                            setActiveTab('tiers');
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center min-w-[76px] ${
                          isSelected
                            ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20'
                            : isUnlocked
                            ? 'bg-slate-900 border-slate-700 hover:border-slate-500'
                            : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
                        }`}
                        title={isUnlocked ? item.name : `Requires ${item.req} VIP`}
                      >
                        <span className="text-2xl mb-1">{item.av}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-300">{item.name}</span>
                        {!isUnlocked && (
                          <span className="text-[8px] text-amber-400 font-mono mt-0.5">LOCKED</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: PABLO'S VIP GOURMET FOODS
             ======================================================== */}
          {activeTab === 'foods' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-1 bg-slate-900 rounded-xl border border-emerald-500/40">🐧🍴</span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Feed Pablo Gourmet VIP Delicacies
                    </h4>
                    <p className="text-xs text-slate-300">
                      Different VIP levels unlock gourmet recipes that give massive affection boosts to Pablo the Penguin!
                    </p>
                  </div>
                </div>

                {onOpenPabloFeed && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPabloFeed();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Open Pablo Pet Shop →
                  </button>
                )}
              </div>

              {/* VIP Food Menus Categorized by Level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Regular VIP Foods */}
                <div className="p-4 rounded-2xl bg-[#08122c] border border-purple-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-300 pb-2 border-b border-purple-500/20">
                    <span>⭐ Regular VIP Foods</span>
                    <span className="text-[9px] bg-purple-500/20 px-2 py-0.5 rounded">500 PTS</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">🐟✨</span> Gourmet Glacial Sprats
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">55 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Glacial sprats dusted with frozen sea salt. (+25 Affection boost)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">🦐⚡</span> Crispy Ice Krill Deluxe
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">75 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Zero-oil tempura krill that makes Pablo do backflips! (+35 Affection)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gold VIP Foods */}
                <div className="p-4 rounded-2xl bg-[#141205] border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 pb-2 border-b border-amber-500/20">
                    <span>👑 Gold VIP Foods</span>
                    <span className="text-[9px] bg-amber-500/20 px-2 py-0.5 rounded">750 PTS</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">🍣👑</span> Golden Glazed Salmon
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">110 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Glazed wild arctic salmon with golden maple syrup. (+55 Affection)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">🍯🍓</span> Honeycomb Glacier Berries
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">135 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Alpine glacier berries dipped in raw golden honeycomb. (+70 Affection)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diamond VIP Foods */}
                <div className="p-4 rounded-2xl bg-[#06142c] border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 pb-2 border-b border-cyan-500/20">
                    <span>💎 Diamond VIP Feasts</span>
                    <span className="text-[9px] bg-cyan-500/20 px-2 py-0.5 rounded">1000 PTS</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">💎🍱</span> Diamond Caviar Platter
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">180 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Rare sturgeon caviar that triggers an instant happiness dance! (+100 Affection)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-lg">🍨🌌</span> Frostfire Aurora Sundae
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">220 Tokens</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Cosmic glacier gelato infused with aurora stardust! (+120 Affection)
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Notice */}
        <div className="px-6 py-3 bg-[#040814] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
          <span>Haris Game Center · Multi-Tier VIP System</span>
          <span className="text-cyan-400">Instant Unlocks Guaranteed</span>
        </div>

      </div>
    </div>
  );
};

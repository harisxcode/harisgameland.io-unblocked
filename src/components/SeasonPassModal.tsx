import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Crown, 
  Lock, 
  CheckCircle2, 
  Gift, 
  Zap, 
  Flame, 
  Clock, 
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Star,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { 
  UserAccount, 
  SeasonPassRewardTier, 
  SeasonRewardItem, 
  SeasonQuest 
} from '../types';
import { 
  SEASON_CONFIG, 
  SEASON_PASS_REWARD_TIERS, 
  DAILY_QUESTS, 
  SEASONAL_MILESTONES,
  calculateTier,
  unlockSeasonPassPremium,
  claimSeasonReward,
  claimAllAvailableSeasonRewards,
  skipSeasonTier,
  recordQuestAction,
  ensureUserProgression
} from '../utils/seasonPass';
import { playClaimRewardSfx, playLevelUpSfx, playArcadeSfx } from '../utils/audio';

interface SeasonPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenVipModal?: () => void;
  onOpenLocker?: () => void;
}

export function SeasonPassModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenVipModal,
  onOpenLocker
}: SeasonPassModalProps) {
  const [activeTab, setActiveTab] = useState<'rewards' | 'quests'>('rewards');
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const user = currentUser ? ensureUserProgression(currentUser) : null;
  const currentXp = user?.seasonPassXp || 0;
  const isPremium = !!user?.hasSeasonPassPremium;
  const tierInfo = calculateTier(currentXp);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleUpgradeToPremium = () => {
    playArcadeSfx('click');
    const result = unlockSeasonPassPremium();
    if (result.success && result.user) {
      playLevelUpSfx();
      onUserUpdated(result.user);
      showToast(result.message);
    } else {
      showToast(result.message, true);
    }
  };

  const handleClaim = (tierNum: number, claimPremium: boolean) => {
    playArcadeSfx('click');
    const result = claimSeasonReward(tierNum, claimPremium);
    if (result.success && result.user) {
      playClaimRewardSfx();
      onUserUpdated(result.user);
      showToast(result.message);
    } else {
      showToast(result.message, true);
    }
  };

  const handleClaimAll = () => {
    playArcadeSfx('click');
    const result = claimAllAvailableSeasonRewards();
    if (result.success && result.user) {
      playClaimRewardSfx();
      onUserUpdated(result.user);
      showToast(result.message);
    } else {
      showToast(result.message, !result.success);
    }
  };

  const handleSkipTier = () => {
    playArcadeSfx('click');
    const result = skipSeasonTier();
    if (result.success && result.user) {
      playLevelUpSfx();
      onUserUpdated(result.user);
      showToast(result.message);
    } else {
      showToast(result.message, true);
    }
  };

  // Count unclaimed rewards ready right now
  let unclaimedCount = 0;
  if (user) {
    for (let t = 1; t <= tierInfo.currentTier; t++) {
      if (!user.claimedFreeTiers?.includes(t)) unclaimedCount++;
      if (isPremium && !user.claimedPremiumTiers?.includes(t)) unclaimedCount++;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#081226] via-[#050b18] to-[#040813] border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-white">
        
        {/* Toast Alert notification */}
        {toastMsg && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg border animate-in slide-in-from-top duration-300 flex items-center gap-2 ${
            toastMsg.isError 
              ? 'bg-rose-950/95 border-rose-500 text-rose-200' 
              : 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-cyan-950/80 via-[#0a1a38] to-blue-950/80 border-b border-cyan-500/30 shrink-0">
          
          {/* Background cyber grid */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Title & Season details */}
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#040916] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
                  ❄️
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    {SEASON_CONFIG.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Ends in 28 Days
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
                  {SEASON_CONFIG.title}
                </h2>
                <p className="text-xs text-cyan-300/80 font-mono">
                  {SEASON_CONFIG.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Actions (Claim All / Skip Tier / Close) */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              {unclaimedCount > 0 && (
                <button
                  onClick={handleClaimAll}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/30 cursor-pointer animate-pulse"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Claim All ({unclaimedCount})</span>
                </button>
              )}

              <button
                onClick={handleSkipTier}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Skip to next tier for 50 tokens"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>+1 Tier (50 pts)</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Season Pass"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Level Progress Meter Card */}
          <div className="relative mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#040a18]/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400 text-center shrink-0">
                <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold">CURRENT</div>
                <div className="text-xl sm:text-2xl font-black font-display text-white">
                  TIER {tierInfo.currentTier}
                </div>
              </div>

              <div className="flex-1 sm:w-64">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300 font-bold">XP Progress</span>
                  <span className="text-cyan-300 font-bold">
                    {tierInfo.isMaxTier ? 'MAX TIER REACHED!' : `${tierInfo.xpInCurrentTier} / ${tierInfo.xpNeededForNextTier} XP`}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full transition-all duration-500 shadow-sm shadow-cyan-400"
                    style={{ width: `${tierInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Premium Status / Upgrade Callout */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {isPremium ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>PREMIUM PASS ACTIVATED</span>
                </div>
              ) : (
                <button
                  onClick={handleUpgradeToPremium}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Unlock Premium Pass ({SEASON_CONFIG.premiumCostTokens} Pts)</span>
                </button>
              )}

              {onOpenLocker && (
                <button
                  onClick={onOpenLocker}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Open Locker to equip earned titles & themes"
                >
                  Locker
                </button>
              )}
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🎁 Rewards Track (Tiers 1-20)
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quests'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>⚡ Daily Quests & Milestones</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-900 text-cyan-200 text-[10px]">
                +XP
              </span>
            </button>
          </div>

        </div>

        {/* Tab 1: Rewards Track (Free vs Premium) */}
        {activeTab === 'rewards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* VIP perk hint */}
            {!isPremium && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-cyan-950/40 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-200">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                  <span>
                    <strong>Pro Tip:</strong> Gold VIP and Diamond VIP members unlock the Premium Track automatically at no extra cost!
                  </span>
                </div>
                {onOpenVipModal && (
                  <button
                    onClick={onOpenVipModal}
                    className="text-amber-300 underline font-mono text-[11px] hover:text-amber-200 shrink-0 cursor-pointer"
                  >
                    View VIP Access →
                  </button>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                  <span>Free Track (Unlocked for everyone)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                  <span>Premium Track (Exclusive Titles, Avatars & Themes)</span>
                </div>
              </div>
              <span className="text-cyan-400 hidden sm:inline">Play games to earn +50 XP per run!</span>
            </div>

            {/* Reward Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {SEASON_PASS_REWARD_TIERS.map((tierConfig) => {
                const tierNum = tierConfig.tier;
                const isUnlocked = tierInfo.currentTier >= tierNum;
                const isFreeClaimed = user?.claimedFreeTiers?.includes(tierNum) || false;
                const isPremiumClaimed = user?.claimedPremiumTiers?.includes(tierNum) || false;

                return (
                  <div 
                    key={tierConfig.tier}
                    className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                      isUnlocked
                        ? 'bg-slate-950/90 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950/40 border-slate-800 opacity-75'
                    }`}
                  >
                    {/* Tier badge header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-black ${
                          isUnlocked ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          TIER {tierNum}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {tierConfig.xpRequired} XP
                        </span>
                      </div>

                      {isUnlocked ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* FREE REWARD CARD */}
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tierConfig.freeReward.icon}</span>
                          <div>
                            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Free Track</div>
                            <div className="text-xs font-bold text-white line-clamp-1">{tierConfig.freeReward.title}</div>
                          </div>
                        </div>

                        {isFreeClaimed ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Claimed
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleClaim(tierNum, false)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] uppercase cursor-pointer shadow-sm shadow-cyan-500/30"
                          >
                            Claim
                          </button>
                        ) : (
                          <Lock className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {tierConfig.freeReward.description}
                      </div>
                    </div>

                    {/* PREMIUM REWARD CARD */}
                    <div className={`p-2.5 rounded-xl border relative overflow-hidden ${
                      isPremium 
                        ? 'bg-amber-950/20 border-amber-500/40' 
                        : 'bg-slate-900/40 border-slate-800'
                    }`}>
                      {tierConfig.premiumReward.highlight && (
                        <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[8px] px-1.5 rounded-bl uppercase">
                          Featured
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tierConfig.premiumReward.icon}</span>
                          <div>
                            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" />
                              <span>Premium</span>
                            </div>
                            <div className="text-xs font-bold text-amber-200 line-clamp-1">{tierConfig.premiumReward.title}</div>
                          </div>
                        </div>

                        {isPremiumClaimed ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Claimed
                          </span>
                        ) : isUnlocked && isPremium ? (
                          <button
                            onClick={() => handleClaim(tierNum, true)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] uppercase cursor-pointer shadow-sm shadow-amber-500/30"
                          >
                            Claim
                          </button>
                        ) : isUnlocked && !isPremium ? (
                          <button
                            onClick={handleUpgradeToPremium}
                            className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-[9px] uppercase cursor-pointer"
                          >
                            Pass Req.
                          </button>
                        ) : (
                          <Lock className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {tierConfig.premiumReward.description}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 2: Quests & Daily Challenges */}
        {activeTab === 'quests' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Daily Quests Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    Daily Arcade Quests
                  </h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">Resets Daily at Midnight UTC</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DAILY_QUESTS.map((quest) => {
                  const currentCount = user?.questProgress?.[quest.progressKey] || 0;
                  const isDone = user?.completedQuestIds?.includes(quest.id) || currentCount >= quest.targetCount;
                  const progressPct = Math.min(100, Math.round((currentCount / quest.targetCount) * 100));

                  return (
                    <div 
                      key={quest.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/40' 
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                            {quest.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                              <span>{quest.title}</span>
                              {isDone && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                                  COMPLETED
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {quest.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-cyan-300">
                            +{quest.xpReward} XP
                          </div>
                          <div className="text-[11px] font-mono text-amber-300">
                            +{quest.tokenReward} Pts
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                          <span>Progress</span>
                          <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                            {Math.min(currentCount, quest.targetCount)} / {quest.targetCount}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDone ? 'bg-emerald-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Milestones Section */}
            <div>
              <div className="flex items-center justify-between mb-3 pt-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    Season 1 Championship Milestones
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-300">Lasts All Season</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SEASONAL_MILESTONES.map((milestone) => {
                  const currentCount = user?.questProgress?.[milestone.progressKey] || 0;
                  const isDone = user?.completedQuestIds?.includes(milestone.id) || currentCount >= milestone.targetCount;
                  const progressPct = Math.min(100, Math.round((currentCount / milestone.targetCount) * 100));

                  return (
                    <div 
                      key={milestone.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone 
                          ? 'bg-amber-950/20 border-amber-500/40' 
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{milestone.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{milestone.title}</h4>
                          <div className="text-xs font-mono text-amber-300">
                            +{milestone.xpReward} XP · +{milestone.tokenReward} Pts
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mb-3 min-h-[32px]">
                        {milestone.description}
                      </p>

                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-amber-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 text-right">
                        {Math.min(currentCount, milestone.targetCount)} / {milestone.targetCount} ({progressPct}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Footer info bar */}
        <div className="p-3 sm:p-4 bg-[#030610] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Progress automatically saved to your player profile</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Your Points: <strong className="text-amber-300">{user?.penguinPoints || 0} pts</strong></span>
            <span>·</span>
            <span>Your Affection: <strong className="text-pink-300">{user?.pabloAffection || 15}%</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}

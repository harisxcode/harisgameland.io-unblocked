import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Palette, 
  Tag, 
  Smile, 
  Fish, 
  Check, 
  Lock,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  ARCADE_BORDER_THEMES, 
  equipTitle, 
  equipAvatar, 
  equipBorderTheme, 
  ensureUserProgression 
} from '../utils/seasonPass';
import { PENGUIN_SNACKS } from '../utils/auth';
import { playArcadeSfx } from '../utils/audio';

interface PlayerLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenSeasonPass?: () => void;
}

type LockerTab = 'titles' | 'avatars' | 'themes' | 'inventory';

export function PlayerLockerModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenSeasonPass
}: PlayerLockerModalProps) {
  const [activeTab, setActiveTab] = useState<LockerTab>('titles');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const user = currentUser ? ensureUserProgression(currentUser) : null;
  if (!user) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleEquipTitle = (title: string) => {
    playArcadeSfx('click');
    const updated = equipTitle(title);
    onUserUpdated(updated);
    showFeedback(`Equipped title "${title}"!`);
  };

  const handleEquipAvatar = (avatar: string) => {
    playArcadeSfx('click');
    const updated = equipAvatar(avatar);
    onUserUpdated(updated);
    showFeedback(`Equipped avatar ${avatar}!`);
  };

  const handleEquipTheme = (themeId: string) => {
    playArcadeSfx('click');
    const updated = equipBorderTheme(themeId);
    onUserUpdated(updated);
    showFeedback(`Equipped border theme "${ARCADE_BORDER_THEMES[themeId]?.name}"!`);
  };

  const unlockedTitles = user.unlockedTitles || ['Arcade Challenger'];
  const unlockedAvatars = user.unlockedAvatars || ['🐧'];
  const unlockedThemes = user.unlockedBorderThemes || ['default'];
  const currentBorder = user.equippedBorderTheme || 'default';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-gradient-to-b from-[#081228] via-[#050b18] to-[#040813] border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-950/80 via-[#0a1835] to-blue-950/80 border-b border-cyan-500/30 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-2xl shadow-md shadow-cyan-500/30">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                  PLAYER LOCKER
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {user.username}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-0.5">
                Equip Badges & Custom Themes
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Locker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="bg-emerald-950 border-b border-emerald-500/40 px-4 py-2 text-xs font-mono text-emerald-300 text-center animate-in slide-in-from-top duration-200">
            ✓ {feedbackMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-4 border-b border-slate-800/80 bg-[#060c1d] shrink-0 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('titles')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'titles'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Titles ({unlockedTitles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('avatars')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'avatars'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Avatars ({unlockedAvatars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Border Themes ({unlockedThemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Pablo Snacks ({user.inventory?.reduce((acc, i) => acc + i.quantity, 0) || 0})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* TAB 1: TITLES */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                Titles are displayed on your player profile, certified high score brags, and community chat.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unlockedTitles.map((title) => {
                  const isEquipped = user.activeTitle === title;
                  return (
                    <div
                      key={title}
                      onClick={() => handleEquipTitle(title)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isEquipped
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono text-cyan-400">Title</div>
                        <div className="font-bold text-sm text-white">{title}</div>
                      </div>

                      {isEquipped ? (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-black uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <button className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] uppercase hover:bg-slate-700">
                          Equip
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {onOpenSeasonPass && (
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between gap-2">
                  <span>Want more exclusive titles like <strong>"Apex Frost Legend"</strong>?</span>
                  <button
                    onClick={onOpenSeasonPass}
                    className="text-cyan-400 hover:text-cyan-300 underline font-bold"
                  >
                    View Season Pass →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AVATARS */}
          {activeTab === 'avatars' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                Choose your avatar to appear in top navigation, leaderboards, and game comments.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {unlockedAvatars.map((av) => {
                  const isEquipped = user.avatar === av;
                  return (
                    <div
                      key={av}
                      onClick={() => handleEquipAvatar(av)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isEquipped
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="text-3xl">{av}</div>
                      {isEquipped ? (
                        <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Equipped
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Click to Equip</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BORDER THEMES */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                Custom arcade borders apply animated neon frames around your games and menus.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(ARCADE_BORDER_THEMES).map((theme) => {
                  const isUnlocked = unlockedThemes.includes(theme.id) || !theme.vipOrPassReward || user.isAdmin;
                  const isEquipped = currentBorder === theme.id;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        if (isUnlocked) handleEquipTheme(theme.id);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        theme.borderStyle
                      } ${
                        isEquipped
                          ? 'bg-slate-900/90 ring-2 ring-cyan-400/40 shadow-xl'
                          : isUnlocked
                          ? 'bg-slate-950/70 hover:bg-slate-900/80 cursor-pointer'
                          : 'bg-slate-950/40 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="font-bold text-base text-white">{theme.name}</div>
                          <div className="text-xs font-mono text-slate-400">{theme.tagline}</div>
                        </div>

                        {isEquipped ? (
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-xs font-black uppercase flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : isUnlocked ? (
                          <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs uppercase cursor-pointer">
                            Equip
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-500 font-mono text-[10px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Pass Tier Reward
                          </span>
                        )}
                      </div>

                      {/* Theme Preview Bar */}
                      <div className={`w-full h-3 rounded-full bg-gradient-to-r ${theme.previewGradient} border ${theme.borderStyle}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                Snacks won from the Daily Lucky Wheel or Season Pass tiers. Visit Pablo's Arcade Hub to feed him!
              </div>

              {(!user.inventory || user.inventory.length === 0) ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 font-mono text-xs">
                  Your snack backpack is empty. Spin the Daily Wheel or level up your Season Pass to win treats for Pablo!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {user.inventory.map((inv) => {
                    const snack = PENGUIN_SNACKS.find(s => s.id === inv.snackId);
                    if (!snack) return null;

                    return (
                      <div
                        key={inv.snackId}
                        className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                            {snack.icon}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-white">{snack.name}</div>
                            <div className="text-xs font-mono text-pink-300">+{snack.affectionBoost}% Affection</div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                          x{inv.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#030610] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <div>
            Active Title: <strong className="text-cyan-300">{user.activeTitle || 'Arcade Challenger'}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

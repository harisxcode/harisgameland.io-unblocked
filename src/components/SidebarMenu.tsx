import React, { useEffect, useState } from 'react';
import { 
  X, 
  Crown, 
  Scale, 
  ShieldCheck, 
  BarChart3, 
  MessageSquare, 
  Gamepad2, 
  Users, 
  Snowflake, 
  ShieldAlert, 
  LogOut, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Mail,
  Copy,
  Check,
  Send,
  FileText,
  School,
  ArrowRight,
  PanelLeftClose,
  AtSign,
  Trophy,
  Car,
  Flame,
  BrainCircuit,
  Laugh,
  Cloud,
  Heart,
  SlidersHorizontal,
  Laptop
} from 'lucide-react';
import { UserAccount, Game } from '../types';
import { isOwnerAccount } from '../utils/auth';
import { playArcadeSfx } from '../utils/audio';
import { LegalTab } from './LegalModal';
import { CategoryFilter } from './GameFilterControls';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';
import { calculateTier, checkDailySpinStatus } from '../utils/seasonPass';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onOpenAdminPanel: () => void;
  onOpenLegal: (tab?: LegalTab) => void;
  onOpenPabloHub: () => void;
  onOpenDiscordModal: () => void;
  onTriggerStealth: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  onSignOut: () => void;
  activeCategory?: CategoryFilter;
  onSelectCategory?: (cat: CategoryFilter) => void;
  games?: Game[];
  favorites?: string[];
  onOpenChromebookModal?: () => void;
  onOpenSeasonPass?: () => void;
  onOpenDailySpin?: () => void;
  onOpenLocker?: () => void;
  onOpenVipModal?: () => void;
  onOpenCharityModal?: () => void;
  onOpenYouTubeModal?: () => void;
  onOpenTokenPacks?: () => void;
  onOpenSignIn?: () => void;
}

export function SidebarMenu({
  isOpen,
  onClose,
  currentUser,
  onOpenAdminPanel,
  onOpenLegal,
  onOpenPabloHub,
  onOpenDiscordModal,
  onTriggerStealth,
  snowEnabled,
  onToggleSnow,
  onSignOut,
  activeCategory = 'all',
  onSelectCategory,
  games = [],
  favorites = [],
  onOpenChromebookModal,
  onOpenSeasonPass,
  onOpenDailySpin,
  onOpenLocker,
  onOpenVipModal,
  onOpenCharityModal,
  onOpenYouTubeModal,
  onOpenTokenPacks,
  onOpenSignIn
}: SidebarMenuProps) {
  const isOwner = isOwnerAccount(currentUser);
  const tierInfo = currentUser ? calculateTier(currentUser.seasonPassXp || 0) : null;
  const spinStatus = checkDailySpinStatus(currentUser);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const OWNER_EMAIL = 'harisxcode@gmail.com';
  const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(OWNER_EMAIL)}&su=${encodeURIComponent('Haris Game Center - Inquiry to Owner')}&body=${encodeURIComponent("Hi Haris,\n\nI'm contacting you directly from Haris Game Center.\n\nMessage:\n")}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER_EMAIL);
      setCopiedEmail(true);
      playArcadeSfx('click');
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleOpenGmail = () => {
    playArcadeSfx('click');
    window.open(GMAIL_COMPOSE_URL, '_blank', 'noopener,noreferrer');
  };

  // Close on Escape only on mobile viewports so desktop browsing remains unobstructed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && window.innerWidth < 768) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile-only backdrop overlay (hidden on md: and above to allow concurrent browsing) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        onClick={() => {
          playArcadeSfx('click');
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Docked Left Sidebar Container */}
      <aside 
        className="fixed inset-y-0 left-0 w-80 z-40 bg-[#050a1c] border-r border-cyan-500/30 flex flex-col shadow-2xl shadow-cyan-950/80 text-slate-100 transition-all duration-300 ease-in-out select-none"
        aria-label="Navigation & Control Sidebar"
      >
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#08122a] border-b border-cyan-500/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-400 shadow-md shrink-0">
              <img 
                src={pabloMascotImg} 
                alt="Pablo Mascot" 
                className="w-full h-full object-cover" 
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight font-display">
                Haris Game Center
              </h3>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400">
                  Left Sidebar · Live Docked
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playArcadeSfx('click');
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer group"
            title="Collapse sidebar to full-screen browsing"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform text-cyan-400" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* User Account Showcase Card */}
          {currentUser && (
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isOwner 
                ? 'bg-gradient-to-br from-amber-500/20 via-[#0c1836] to-[#071024] border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-[#08122a] border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl p-1 bg-slate-900 rounded-xl border border-slate-800">
                    {currentUser.avatar || '🐧'}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs font-mono truncate max-w-[120px]">
                        {currentUser.username}
                      </span>
                      {isOwner && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-wider font-mono shadow-sm">
                          OWNER
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                      <span>{isOwner ? 'harisxcode@gmail.com' : `${currentUser.penguinPoints} In-Game Tokens`}</span>
                      {currentUser.isTrial && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold">
                          15m Trial
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                )}
              </div>

              {isOwner ? (
                <div className="mt-2 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[10px] font-mono text-amber-300">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" /> Diamond Overlord · Admin
                  </span>
                  <span className="text-[9px] text-amber-200/80">Owner</span>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span className="truncate max-w-[140px]">{currentUser.activeTitle || (currentUser.isVip ? 'VIP Member' : 'Standard Gamer')}</span>
                  {onOpenTokenPacks ? (
                    <button
                      onClick={() => {
                        playArcadeSfx('click');
                        onOpenTokenPacks();
                      }}
                      className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[9px] uppercase hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      + Buy Tokens
                    </button>
                  ) : (
                    <span className="uppercase text-amber-300 font-bold shrink-0">{currentUser.vipTier ? `${currentUser.vipTier} VIP` : `${currentUser.gamesPlayedCount} plays`}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SEASON 1 PASS & ARCADE PROGRESSION
             ======================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Season 1 &amp; Arcade Hub</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                NEW
              </span>
            </div>

            <div className="space-y-1.5 bg-[#060e22] p-2 rounded-2xl border border-cyan-500/20 shadow-inner">
              {/* Season 1 Pass Button */}
              {onOpenSeasonPass && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenSeasonPass();
                  }}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">❄️</span>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        Season 1: Neon Frost Pass
                      </div>
                      <div className="text-[10px] text-cyan-300/80 font-mono">
                        Tier {tierInfo?.currentTier || 0} / 20 · 28 Days Left
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black font-mono text-[10px] uppercase">
                    View
                  </span>
                </button>
              )}

              {/* Daily Lucky Wheel Button */}
              {onOpenDailySpin && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenDailySpin();
                  }}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer group ${
                    spinStatus.canSpinFree
                      ? 'bg-amber-950/40 border-amber-400/60 hover:bg-amber-950/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎡</span>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <span>Daily Lucky Wheel</span>
                        {spinStatus.canSpinFree && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {spinStatus.canSpinFree ? '⭐ Free spin ready!' : `Streak: Day ${spinStatus.streak}`}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                    spinStatus.canSpinFree ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {spinStatus.canSpinFree ? 'Spin Free' : 'Spin'}
                  </span>
                </button>
              )}

              {/* Player Locker Button */}
              {onOpenLocker && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenLocker();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎒</span>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        Player Locker
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {currentUser?.activeTitle || 'Equip Titles & Themes'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                    Equip
                  </span>
                </button>
              )}

              {/* Pablo Penguin Charity Repository Button */}
              {onOpenCharityModal && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenCharityModal();
                  }}
                  className="w-full p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 hover:border-emerald-400/60 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🐧💙</span>
                    <div>
                      <div className="font-bold text-xs text-emerald-300 group-hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                        <span>Pablo Charity</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          REAL TX
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Wildlife Fund &amp; Tax Receipts
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold">
                    Donate
                  </span>
                </button>
              )}

              {/* YouTube Player & Streaming Repository Button */}
              {onOpenYouTubeModal && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenYouTubeModal();
                  }}
                  className="w-full p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400/60 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📺</span>
                    <div>
                      <div className="font-bold text-xs text-red-300 group-hover:text-red-200 transition-colors flex items-center gap-1.5">
                        <span>YouTube Stream</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-500/20 text-red-300 font-mono font-bold">
                          LIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Unblocked 1080p60 Video Hub
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-mono text-[10px] uppercase font-bold">
                    Watch
                  </span>
                </button>
              )}

              {/* In-Game Token Store Button (Buy Tokens USD) */}
              {onOpenTokenPacks && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onOpenTokenPacks();
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 hover:border-amber-300 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🪙</span>
                    <div>
                      <div className="font-bold text-xs text-amber-300 group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                        <span>Buy Tokens (USD)</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] bg-amber-400 text-slate-950 font-mono font-black">
                          PACKS
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Starter, Champion, Vault &amp; Overlord
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono text-[10px] uppercase font-black">
                    Store
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================
              GAME CATEGORIES & FILTERS (SIDEBAR FILTER OPTIONS)
             ======================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Game Filters</span>
              </span>
              {activeCategory && activeCategory !== 'all' && (
                <button
                  onClick={() => {
                    playArcadeSfx('click');
                    onSelectCategory?.('all');
                  }}
                  className="text-[10px] text-cyan-300 hover:text-white underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="space-y-1 bg-[#060e22] p-2 rounded-2xl border border-cyan-500/20 shadow-inner">
              {[
                {
                  id: 'all' as CategoryFilter,
                  label: 'All Games',
                  sublabel: 'Full unblocked catalog',
                  icon: Gamepad2,
                  color: 'text-cyan-400',
                  count: games.length
                },
                {
                  id: 'arcade' as CategoryFilter,
                  label: 'Retro Games',
                  sublabel: 'Classic 8-bit & coin-op arcade',
                  icon: Gamepad2,
                  color: 'text-amber-400',
                  count: games.filter(g => g.category === 'arcade' || g.genre.toLowerCase().includes('retro') || g.title.toLowerCase().includes('retro')).length
                },
                {
                  id: 'sports' as CategoryFilter,
                  label: 'Sports Games',
                  sublabel: 'Retro Bowl, soccer & basketball',
                  icon: Trophy,
                  color: 'text-emerald-400',
                  count: games.filter(g => g.category === 'sports').length
                },
                {
                  id: 'racing' as CategoryFilter,
                  label: 'Racing & Driving',
                  sublabel: 'Polytrack, drifts & getaway runs',
                  icon: Car,
                  color: 'text-orange-400',
                  count: games.filter(g => g.category === 'racing').length
                },
                {
                  id: 'action' as CategoryFilter,
                  label: 'Action Games',
                  sublabel: 'Brawl Stars, Cuphead & combat',
                  icon: Flame,
                  color: 'text-rose-400',
                  count: games.filter(g => g.category === 'action').length
                },
                {
                  id: 'puzzle' as CategoryFilter,
                  label: 'Puzzle & Strategy',
                  sublabel: 'Block Blast, 2048 & Tetris',
                  icon: BrainCircuit,
                  color: 'text-purple-400',
                  count: games.filter(g => g.category === 'puzzle').length
                },
                {
                  id: 'casual' as CategoryFilter,
                  label: 'Casual & Viral',
                  sublabel: 'Cookie clickers & meme party',
                  icon: Laugh,
                  color: 'text-yellow-400',
                  count: games.filter(g => g.category === 'casual' || (g.category as string) === 'meme').length
                },
                {
                  id: 'cloud' as CategoryFilter,
                  label: 'Cloud Streaming',
                  sublabel: 'Instant 3D browser games (no install)',
                  icon: Cloud,
                  color: 'text-sky-400',
                  count: games.filter(g => g.category === 'cloud').length
                },
                {
                  id: 'vault' as CategoryFilter,
                  label: 'Haris Deluxe Vault',
                  sublabel: '34 original native classics',
                  icon: Gamepad2,
                  color: 'text-cyan-300',
                  count: games.filter(g => g.serverSource === 'Haris Arcade Vault' || g.id.startsWith('gl-')).length
                },
                {
                  id: 'recommended' as CategoryFilter,
                  label: 'Pablo\'s Top Picks',
                  sublabel: '5-Star certified unblocked',
                  icon: Sparkles,
                  color: 'text-amber-300',
                  count: games.filter(g => g.isFeatured || g.isPopular || g.rating >= 4.8).length
                },
                {
                  id: 'favorites' as CategoryFilter,
                  label: 'My Favorites',
                  sublabel: 'Saved & bookmarked games',
                  icon: Heart,
                  color: 'text-rose-400',
                  count: favorites.length
                }
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playArcadeSfx('click');
                      onSelectCategory?.(cat.id);
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/20 border border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                        : 'hover:bg-slate-900/90 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : cat.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                          {cat.label}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">
                          {cat.sublabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 group-hover:text-slate-200 border border-slate-800'
                      }`}>
                        {cat.count}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              CONTACT US SECTION (DIRECT GMAIL TO OWNER HARIS)
             ======================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact Us</span>
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                DIRECT TO OWNER
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1e48] via-[#081533] to-[#050e24] border border-cyan-500/40 shadow-xl shadow-cyan-950/50 space-y-3">
              {/* Owner Info Tag */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                  H
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Haris</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      Founder &amp; Owner
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono truncate max-w-[170px]">
                    harisxcode@gmail.com
                  </div>
                </div>
              </div>

              {/* Exact user-requested description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-[#040816]/60 p-2.5 rounded-xl border border-cyan-500/20">
                This is the owner of this website. If you want to send a personal email to him, click here.
              </p>

              {/* Primary Action Button: Opens Gmail directly */}
              <button
                onClick={handleOpenGmail}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
                title="Open Gmail with harisxcode@gmail.com recipient pre-filled"
              >
                <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Open in Gmail (harisxcode@gmail.com)</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </button>

              {/* Secondary Actions: Copy Email & Mailto Fallback */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={handleCopyEmail}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                    copiedEmail
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 text-slate-300 hover:text-white'
                  }`}
                  title="Copy owner's email address to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-cyan-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${OWNER_EMAIL}?subject=Haris%20Game%20Center%20-%20Inquiry%20to%20Owner`}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-750 text-slate-300 hover:text-white text-[10px] font-mono font-semibold transition-all cursor-pointer"
                  title="Open in your default desktop or phone mail app"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>Default Mail</span>
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================
              OWNER ADMIN PANEL SECTION (HARIS EXCLUSIVE - ONLY OWNER)
             ======================================================== */}
          {isOwner && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-amber-400 font-bold px-1">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Owner Portal</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold">
                  HARIS ONLY
                </span>
              </div>

              {/* Primary Admin Panel Button */}
              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onOpenAdminPanel();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs tracking-wide shadow-xl shadow-amber-500/25 transition-all transform active:scale-98 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-display font-black text-slate-950 text-xs flex items-center gap-1.5">
                      <span>Owner Admin Panel</span>
                      <span className="text-[9px] bg-slate-950 text-amber-300 px-1 py-0.2 rounded font-mono">LIVE</span>
                    </div>
                    <div className="text-[10px] text-slate-900/80 font-mono font-medium">
                      Player Counts &amp; Graphs
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ========================================================
              TERMS & POLICIES SECTION (ON THE SIDEBAR)
             ======================================================== */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold px-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Legal &amp; Policies</span>
            </div>

            {/* Main Terms & Policies Button */}
            <button
              onClick={() => {
                playArcadeSfx('click');
                onOpenLegal('terms');
              }}
              className="w-full p-3 rounded-2xl bg-[#091535] hover:bg-[#0c1e4c] border border-cyan-500/30 hover:border-cyan-400 transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Terms of Agreement &amp; Rules
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    No cyberbullying · Active cameras
                  </div>
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Quick Policy Sub-Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onOpenLegal('privacy');
                }}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                <div className="font-bold text-[10px]">Privacy Policy</div>
                <div className="text-[8px] text-slate-500">Zero tracking</div>
              </button>

              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onOpenLegal('safety');
                }}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <School className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                <div className="font-bold text-[10px]">School Safety</div>
                <div className="text-[8px] text-slate-500">Friendly learning</div>
              </button>
            </div>
          </div>

          {/* ========================================================
              ARCADE NAVIGATION
             ======================================================== */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
              Arcade Navigation
            </div>

            <div className="space-y-1.5">
              <a
                href="#games"
                className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>All Unblocked Games</span>
              </a>

              <a
                href="#arcade-chat-lounge"
                className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Community Lounge &amp; Chat</span>
              </a>

              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onOpenPabloHub();
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="text-base">🐧</span>
                <span>Pablo Arcade Hub (Feed &amp; Tips)</span>
              </button>

              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onOpenDiscordModal();
                }}
                className="w-full p-2.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-between text-xs font-semibold text-[#c7d2fe] hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#5865F2]" />
                  <span>Game Grinders (Discord)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions & Utilities */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {/* School Chromebook & Low-Spec Mode Launcher */}
            <button
              onClick={() => {
                playArcadeSfx('click');
                onOpenChromebookModal?.();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Chromebook Hub</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                60 FPS Turbo
              </span>
            </button>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onTriggerStealth();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                title="Classroom panic stealth (Hotkey: ] or Esc)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Panic Mode</span>
              </button>

              <button
                onClick={() => {
                  playArcadeSfx('click');
                  onToggleSnow();
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  snowEnabled
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Snow: {snowEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                playArcadeSfx('click');
                onSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Profile / Sign Out</span>
            </button>
          </div>

        </div>

        {/* Sidebar Footer Info */}
        <div className="px-5 py-3 bg-[#040814] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
          <span>Haris Game Center · 2026</span>
          <button 
            onClick={onClose}
            className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Docked ◀</span>
          </button>
        </div>

      </aside>
    </>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GameCard } from './components/GameCard';
import { CompactGameRow } from './components/CompactGameRow';
import { GameFilterControls, CategoryFilter, SortOption, ViewMode } from './components/GameFilterControls';
import { GameModal } from './components/GameModal';
import { AddGameModal } from './components/AddGameModal';
import { GameHypeAdModal } from './components/GameHypeAdModal';
import { RatingModal } from './components/RatingModal';
import { RecommendGameModal } from './components/RecommendGameModal';
import { DeveloperHub } from './components/DeveloperHub';
import { CommunityRecommendationsSection } from './components/CommunityRecommendationsSection';
import { ArcadeChatSection } from './components/ArcadeChatSection';
import { HighScoreShareModal } from './components/HighScoreShareModal';
import { GameGrindersDiscordModal } from './components/GameGrindersDiscordModal';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { MusicStreamPlayerModal } from './components/MusicStreamPlayerModal';
import { LegalModal, LegalTab } from './components/LegalModal';
import { MandatoryTermsModal } from './components/MandatoryTermsModal';
import { SidebarMenu } from './components/SidebarMenu';
import { OwnerAdminPanelModal } from './components/OwnerAdminPanelModal';
import { ChromebookModal } from './components/ChromebookModal';
import { isChromebookTurboActive } from './utils/chromebook';

import { AuthEntry } from './components/AuthEntry';
import { PabloMascot } from './components/PabloMascot';
import { PabloArcadeHubModal } from './components/PabloArcadeHubModal';
import { VipLockModal } from './components/VipLockModal';
import { DisguiseOverlay } from './components/DisguiseOverlay';
import { SnowfallEffect } from './components/SnowfallEffect';
import { SeasonPassModal } from './components/SeasonPassModal';
import { DailySpinModal } from './components/DailySpinModal';
import { PlayerLockerModal } from './components/PlayerLockerModal';

import { INITIAL_GAMES, Game, UNIVERSAL_CATEGORIES } from './data/games';
import { UserAccount } from './types';
import { getActiveUser, setActiveUser, awardPenguinPoints, hasVipTierAccess, isOwnerAccount } from './utils/auth';
import { awardSeasonXp, recordQuestAction, ensureUserProgression, ARCADE_BORDER_THEMES } from './utils/seasonPass';

import { 
  Gamepad2, 
  Plus, 
  Sparkles, 
  Car, 
  Laugh, 
  Flame, 
  Cloud, 
  BrainCircuit, 
  ArrowRight,
  Star,
  Lightbulb,
  Headphones,
  ShieldCheck,
  Zap,
  Crown,
  Trophy,
  Menu,
  PanelLeftOpen,
  Mail,
  Server,
  Laptop
} from 'lucide-react';

export default function App() {
  // Player Profile Auth Gate
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveUser());
  const [showIntro, setShowIntro] = useState(false);

  // Modals state
  const [isPabloHubOpen, setIsPabloHubOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isSeasonPassOpen, setIsSeasonPassOpen] = useState(false);
  const [isDailySpinOpen, setIsDailySpinOpen] = useState(false);
  const [isLockerOpen, setIsLockerOpen] = useState(false);
  const [targetVipGame, setTargetVipGame] = useState<Game | null>(null);
  const [isStealthActive, setIsStealthActive] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(true);

  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem('haris_games');
      if (saved) {
        const parsed: Game[] = JSON.parse(saved);
        const initialIds = new Set(INITIAL_GAMES.map(g => g.id));
        const customGames = parsed.filter(
          (g) => !initialIds.has(g.id) && g.id !== 'drive-u' && g.id !== 'cyber-runner-dx'
        );
        return [...INITIAL_GAMES, ...customGames];
      }
    } catch {}
    return INITIAL_GAMES;
  });

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [adGame, setAdGame] = useState<Game | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [ratingTargetGame, setRatingTargetGame] = useState<Game | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isMusicStreamModalOpen, setIsMusicStreamModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<LegalTab>('privacy');
  const [isHighScoreModalOpen, setIsHighScoreModalOpen] = useState(false);
  const [targetHighScoreGame, setTargetHighScoreGame] = useState<Game | null>(null);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isChromebookModalOpen, setIsChromebookModalOpen] = useState(false);
  const [isChromebookTurbo, setIsChromebookTurbo] = useState(() => isChromebookTurboActive());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('haris_sidebar_open');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' && window.innerWidth >= 1024;
    } catch {
      return true;
    }
  });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [externalChatComment, setExternalChatComment] = useState<{ text: string; gameTitle?: string; highScoreBadge?: string } | null>(null);
  const [hasAgreedTerms, setHasAgreedTerms] = useState<boolean>(() => {
    const active = getActiveUser();
    if (!active) return false;
    try {
      return localStorage.getItem(`haris_rules_agreed_${active.username}`) === 'true';
    } catch {
      return false;
    }
  });

  const [musicStreamUrl, setMusicStreamUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('haris_music_stream_url') || 'https://is.gd/musicstream';
    } catch {
      return 'https://is.gd/musicstream';
    }
  });

  const handleUpdateMusicStreamUrl = (newUrl: string) => {
    setMusicStreamUrl(newUrl);
    try {
      localStorage.setItem('haris_music_stream_url', newUrl);
    } catch {}
    setGames(prev => prev.map(g => g.id === 'music-stream' ? { ...g, playUrl: newUrl, repoUrl: newUrl } : g));
  };

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('shelves');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haris_favorites');
      return saved ? JSON.parse(saved) : ['escape-road', 'nitro-league', 'flappy-bird-arcade'];
    } catch {
      return ['escape-road', 'nitro-league', 'flappy-bird-arcade'];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Keyboard shortcut for Panic Stealth Disguise (`]` or `Escape`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ']') {
        setIsStealthActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for Chromebook Turbo Mode state changes
  useEffect(() => {
    const handleTurboChange = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && typeof custom.detail.enabled === 'boolean') {
        setIsChromebookTurbo(custom.detail.enabled);
        if (custom.detail.enabled) {
          setSnowEnabled(false);
        }
      }
    };
    window.addEventListener('haris_turbo_mode_changed', handleTurboChange);
    return () => window.removeEventListener('haris_turbo_mode_changed', handleTurboChange);
  }, []);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('haris_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handleAddGame = (newGame: Game) => {
    setGames(prev => [newGame, ...prev]);
  };

  const handleOpenAd = (game: Game) => {
    setAdGame(game);
    setIsAdModalOpen(true);
  };

  const handleShareHighScore = (game: Game) => {
    setTargetHighScoreGame(game);
    setIsHighScoreModalOpen(true);
  };

  const handlePostBragToChat = (text: string, gameTitle: string, scoreBadge: string) => {
    setExternalChatComment({ text, gameTitle, highScoreBadge: scoreBadge });
  };

  const handleSaveRating = (stars: number, _review: string, gameId?: string) => {
    if (gameId) {
      setGames(prev => {
        const updated = prev.map(g => {
          if (g.id === gameId) {
            const newCount = g.ratingCount + 1;
            const newRating = Math.round(((g.rating * g.ratingCount + stars) / newCount) * 10) / 10;
            return { ...g, rating: newRating, ratingCount: newCount };
          }
          return g;
        });
        try {
          localStorage.setItem('haris_games', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleSignOut = () => {
    setActiveUser(null);
    setCurrentUser(null);
    setHasAgreedTerms(false);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Explicit user request: show up as soon as someone logs into this website
    const alreadyAgreed = localStorage.getItem(`haris_rules_agreed_${user.username}`) === 'true';
    setHasAgreedTerms(alreadyAgreed);
  };

  // Game execution handler
  const handlePlayGame = (game: Game) => {
    // Check VIP requirement against player's tier level
    if (game.isVipExclusive) {
      const isOwner = isOwnerAccount(currentUser);
      const requiredTier = game.vipTierRequired || 'regular';
      if (!hasVipTierAccess(currentUser?.vipTier, requiredTier, isOwner)) {
        setTargetVipGame(game);
        setIsVipModalOpen(true);
        return;
      }
    }

    if (game.id === 'music-stream') {
      setIsMusicStreamModalOpen(true);
      return;
    }

    setSelectedGame(game);
  };

  // Award points on game play & track Season Pass progression
  const handleGamePlayedSession = (game: Game) => {
    let updated = awardPenguinPoints(25);
    if (updated) {
      try {
        awardSeasonXp(50, `Played ${game.title}`);
        recordQuestAction('daily_games_played', 1);
        const qResult = recordQuestAction('season_games_played', 1);
        updated = qResult.user;
      } catch {}
      setCurrentUser({ ...updated });
    }
    // Increment local play count
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, playCount: g.playCount + 1 } : g));
  };

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    const result = games.filter(game => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'vault' || (activeCategory as string) === 'server1') {
          if (game.serverSource !== 'Haris Arcade Vault' && !game.id.startsWith('gl-')) return false;
        } else if (activeCategory === 'recommended') {
          if (!game.isFeatured && !game.isPopular && game.rating < 4.8) return false;
        } else if (activeCategory === 'favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory === 'upcoming') {
          if (game.status !== 'upcoming') return false;
        } else if (activeCategory === 'casual') {
          if (game.category !== 'casual' && (game.category as string) !== 'meme') return false;
        } else {
          if (game.category !== activeCategory) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(query);
        const matchGenre = game.genre.toLowerCase().includes(query);
        const matchCategory = game.category.toLowerCase().includes(query);
        const matchDesc = game.description.toLowerCase().includes(query);
        const matchTagline = game.tagline.toLowerCase().includes(query);
        return matchTitle || matchGenre || matchCategory || matchDesc || matchTagline;
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortOption === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'newest') {
        return (b.releaseYear || '').localeCompare(a.releaseYear || '');
      }
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.playCount - a.playCount;
    });
  }, [games, activeCategory, searchQuery, favorites, sortOption]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'vault':
      case 'server1': return Gamepad2;
      case 'recommended': return Sparkles;
      case 'racing': return Car;
      case 'cloud': return Cloud;
      case 'arcade': return Gamepad2;
      case 'action': return Flame;
      case 'casual': return Laugh;
      case 'puzzle': return BrainCircuit;
      case 'sports': return Trophy;
      case 'other': return Headphones;
      default: return Gamepad2;
    }
  };

  // Gated View: If user is not signed in, show Auth Gate
  if (!currentUser) {
    return <AuthEntry onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      
      {/* Arctic Snowfall Effect */}
      <SnowfallEffect enabled={snowEnabled} />

      {/* Classroom Stealth Disguise Overlay (Panic Mask) */}
      <DisguiseOverlay
        isActive={isStealthActive}
        disguiseType="google_docs"
        onExit={() => setIsStealthActive(false)}
      />

      {/* Mandatory Legal Terms & Conduct Rules Modal (Appears as soon as someone logs into this website) */}
      <MandatoryTermsModal
        isOpen={!hasAgreedTerms}
        currentUser={currentUser}
        onAgreeAndContinue={() => {
          setHasAgreedTerms(true);
          try {
            if (currentUser) {
              localStorage.setItem(`haris_rules_agreed_${currentUser.username}`, 'true');
            }
          } catch {}
        }}
        onSignOut={handleSignOut}
      />

      {/* Floating Sidebar Menu Launcher Tab (When sidebar is collapsed, docked on left edge) */}
      {!isSidebarOpen && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-start pointer-events-auto animate-fadeIn">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-r-2xl bg-gradient-to-r from-[#091535] via-[#0c1e48] to-[#071024] hover:from-[#0d2254] hover:to-[#091838] border-y border-r-2 border-cyan-400 text-cyan-300 hover:text-white shadow-2xl shadow-cyan-950/80 transition-all transform hover:translate-x-1.5 cursor-pointer group"
            title="Expand Left Sidebar (Contact, Admin & Terms)"
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-display font-black text-xs text-white block">Sidebar Menu</span>
              <span className="text-[10px] text-cyan-300 font-mono font-bold block -mt-0.5">Contact · Admin · Rules</span>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Floating Quick Button (Bottom Left) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="sm:hidden fixed left-4 bottom-20 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 shadow-2xl shadow-black font-black flex items-center justify-center cursor-pointer border-2 border-cyan-300 animate-bounce"
          title="Open Sidebar Menu (Contact, Admin & Terms)"
        >
          <Menu className="w-5 h-5 text-slate-950" />
        </button>
      )}

      {/* Main Browsable Content Wrapper: smoothly shifts with md:pl-80 when Left Sidebar is open */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:pl-80' : 'pl-0'}`}>
        {/* Sticky Main Navigation */}
        <Navbar 
          currentUser={currentUser}
          onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onOpenPabloHub={() => setIsPabloHubOpen(true)}
          onTriggerStealth={() => setIsStealthActive(true)}
          snowEnabled={snowEnabled}
          onToggleSnow={() => setSnowEnabled(!snowEnabled)}
          onSignOut={handleSignOut}
          onOpenRecommendModal={() => setIsRecommendModalOpen(true)}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
          onOpenVipModal={() => {
            setTargetVipGame(null);
            setIsVipModalOpen(true);
          }}
          onOpenLegal={(tab) => {
            setLegalInitialTab(tab || 'privacy');
            setIsLegalModalOpen(true);
          }}
          onOpenDiscordModal={() => setIsDiscordModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          games={games}
          onSelectGame={handlePlayGame}
          onOpenChromebookModal={() => setIsChromebookModalOpen(true)}
          isChromebookTurbo={isChromebookTurbo}
          onOpenSeasonPass={() => setIsSeasonPassOpen(true)}
          onOpenDailySpin={() => setIsDailySpinOpen(true)}
          onOpenLocker={() => setIsLockerOpen(true)}
        />

        <main className="flex-1">
        {/* Hero Section */}
        <HeroSection 
          games={games}
          onOpenRecommendModal={() => setIsRecommendModalOpen(true)}
          onOpenPabloHub={() => setIsPabloHubOpen(true)}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
          onOpenDiscord={() => setIsDiscordModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSeasonPass={() => setIsSeasonPassOpen(true)}
          onOpenDailySpin={() => setIsDailySpinOpen(true)}
        />

        {/* Pablo Unblocked Announcement Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#091738] via-[#0d2254] to-[#091738] border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-1.5 bg-cyan-950/80 rounded-xl border border-cyan-500/40">🐧</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-display">
                    Pablo's Unblocked Guarantee: 0% Lag & 60 FPS
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> 100% UNBLOCKED
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Play games to earn +25 Penguin Points per session! Hit 500 points to unlock VIP access forever.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsChromebookModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-colors cursor-pointer"
                title="School Chromebook & Low-Spec Performance Hub (60 FPS Turbo & Tab Disguise)"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Chromebook Hub</span>
              </button>
              <button
                onClick={() => setIsPabloHubOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20 cursor-pointer"
              >
                Open Pablo Hub
              </button>
            </div>
          </div>
        </section>

        {/* Starting Community Lounge: Comment & Submit High Scores Area */}
        <ArcadeChatSection
          currentUserUsername={currentUser?.username || 'GuestGrinder'}
          currentUserAvatar={currentUser?.avatar || '🐧'}
          isVip={!!currentUser?.isVip}
          games={games}
          onPlayGame={handlePlayGame}
          onOpenDiscordModal={() => setIsDiscordModalOpen(true)}
          onOpenHighScoreModal={handleShareHighScore}
          externalNewComment={externalChatComment}
        />

        {/* Main Catalog View */}
        <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Top Quick Category Pills */}
          <div className="border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all' as CategoryFilter, label: 'All Catalog' },
                { id: 'arcade' as CategoryFilter, label: '🕹️ Retro & Arcade' },
                { id: 'sports' as CategoryFilter, label: '⚽ Sports Games' },
                { id: 'racing' as CategoryFilter, label: '🏎️ Racing & Drifting' },
                { id: 'action' as CategoryFilter, label: '💥 Action & Fighting' },
                { id: 'puzzle' as CategoryFilter, label: '🧩 Puzzle & Strategy' },
                { id: 'casual' as CategoryFilter, label: '😄 Casual & Meme' },
                { id: 'cloud' as CategoryFilter, label: '☁️ Cloud Gaming' },
                { id: 'vault' as CategoryFilter, label: '⚡ Haris Deluxe Vault' },
                { id: 'recommended' as CategoryFilter, label: '⭐ Recommended (Top Picks)' },
                { id: 'favorites' as CategoryFilter, label: `❤️ Favorites (${favorites.length})` }
              ].map((pill) => {
                const isSelected = activeCategory === pill.id;
                const Icon = getCategoryIcon(pill.id);
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveCategory(pill.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter, Search & View Controls */}
          <GameFilterControls
            games={games}
            favoritesCount={favorites.length}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFilteredCount={filteredAndSortedGames.length}
          />

          {/* Catalog Render Logic */}
          {filteredAndSortedGames.length > 0 ? (
            viewMode === 'shelves' && activeCategory === 'all' && !searchQuery.trim() ? (
              <div className="space-y-12">
                {/* 1. Featured Recommended Games Shelf with + Recommend Tile */}
                <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0a1533] to-cyan-500/10 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white font-display">
                            Recommended Games
                          </h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            PABLO'S 5-STAR PICKS
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Handpicked top-rated unblocked games with verified 0% lag and certified 60 FPS
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsRecommendModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-amber-500/20 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Recommend a Game</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {games
                      .filter((g) => g.isFeatured || g.id === 'slope-cyber-tunnel' || g.id === 'escape-road' || g.id === '1v1-arena-duel')
                      .slice(0, 3)
                      .map((game) => (
                        <GameCard
                          key={`rec-${game.id}`}
                          game={game}
                          onPlayModal={handlePlayGame}
                          onPreviewAd={handleOpenAd}
                          isFavorite={favorites.includes(game.id)}
                          onToggleFavorite={toggleFavorite}
                          onOpenRatingModal={() => {
                            setRatingTargetGame(game);
                            setIsRatingModalOpen(true);
                          }}
                          onOpenVipModal={(g) => {
                            setTargetVipGame(g);
                            setIsVipModalOpen(true);
                          }}
                          isUserVip={!!currentUser?.isVip}
                          userVipTier={currentUser?.vipTier}
                          onShareHighScore={handleShareHighScore}
                        />
                      ))}

                    {/* Interactive Recommend a Game Card in Grid */}
                    <div
                      onClick={() => setIsRecommendModalOpen(true)}
                      className="group relative flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#091530]/90 border-2 border-dashed border-amber-500/40 hover:border-amber-400 transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">
                        GAME RECOMMENDATIONS
                      </div>
                      <h4 className="text-base font-bold text-white mb-1 font-display">
                        Recommend a Game
                      </h4>
                      <p className="text-xs text-slate-400 mb-3 max-w-[200px] leading-relaxed">
                        Want an unblocked game added to the center? Send your recommendation to Pablo!
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/25">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Submit Idea</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Haris Retro & Arcade Vault Shelf */}
                <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-[#06122c] to-blue-500/10 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white font-display">
                            Haris Retro &amp; Arcade Vault
                          </h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            34 NATIVE CLASSICS
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Official Haris Game Center unblocked collection with certified 60 FPS &amp; 0% lag
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveCategory('vault')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-cyan-500/20 self-start sm:self-auto"
                    >
                      <span>View All 34 Vault Games</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {games
                      .filter((g) => g.serverSource === 'Haris Arcade Vault' || g.id.startsWith('gl-'))
                      .slice(0, 8)
                      .map((game) => (
                        <GameCard
                          key={`vault-${game.id}`}
                          game={game}
                          onPlayModal={handlePlayGame}
                          onPreviewAd={handleOpenAd}
                          isFavorite={favorites.includes(game.id)}
                          onToggleFavorite={toggleFavorite}
                          onOpenRatingModal={() => {
                            setRatingTargetGame(game);
                            setIsRatingModalOpen(true);
                          }}
                          onOpenVipModal={(g) => {
                            setTargetVipGame(g);
                            setIsVipModalOpen(true);
                          }}
                          isUserVip={!!currentUser?.isVip}
                          userVipTier={currentUser?.vipTier}
                          onShareHighScore={handleShareHighScore}
                        />
                      ))}
                  </div>
                </div>

                {UNIVERSAL_CATEGORIES.map((catMeta) => {
                  const categoryGames = games.filter(g => 
                    g.category === catMeta.id || (catMeta.id === 'casual' && (g.category as string) === 'meme')
                  );

                  if (categoryGames.length === 0) return null;

                  const CatIcon = getCategoryIcon(catMeta.id);

                  return (
                    <div key={catMeta.id} className="space-y-4">
                      {/* Category Shelf Header */}
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white font-display">
                                {catMeta.title}
                              </h3>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
                                {categoryGames.length} {categoryGames.length === 1 ? 'game' : 'games'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {catMeta.tagline}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveCategory(catMeta.id)}
                          className="hidden sm:inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
                        >
                          <span>View Only {catMeta.shortLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Category Games Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categoryGames.map((game) => (
                          <GameCard
                            key={game.id}
                            game={game}
                            onPlayModal={handlePlayGame}
                            onPreviewAd={handleOpenAd}
                            isFavorite={favorites.includes(game.id)}
                            onToggleFavorite={toggleFavorite}
                            onOpenRatingModal={() => {
                              setRatingTargetGame(game);
                              setIsRatingModalOpen(true);
                            }}
                            onOpenVipModal={(g) => {
                              setTargetVipGame(g);
                              setIsVipModalOpen(true);
                            }}
                            isUserVip={!!currentUser?.isVip}
                            userVipTier={currentUser?.vipTier}
                            onShareHighScore={handleShareHighScore}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : viewMode === 'compact' ? (
              <div className="space-y-3">
                {filteredAndSortedGames.map((game) => (
                  <CompactGameRow
                    key={game.id}
                    game={game}
                    onPlayModal={handlePlayGame}
                    onPreviewAd={handleOpenAd}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenRatingModal={() => {
                      setRatingTargetGame(game);
                      setIsRatingModalOpen(true);
                    }}
                    onShareHighScore={handleShareHighScore}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAndSortedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlayModal={handlePlayGame}
                    onPreviewAd={handleOpenAd}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenRatingModal={() => {
                      setRatingTargetGame(game);
                      setIsRatingModalOpen(true);
                    }}
                    onOpenVipModal={(g) => {
                      setTargetVipGame(g);
                      setIsVipModalOpen(true);
                    }}
                    isUserVip={!!currentUser?.isVip}
                    userVipTier={currentUser?.vipTier}
                    onShareHighScore={handleShareHighScore}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="py-14 px-6 text-center rounded-2xl border border-slate-800 bg-[#070e22]">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 mb-3 border border-slate-800">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No games found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No titles match your current category &ldquo;{activeCategory}&rdquo;
                {searchQuery ? ` and search query "${searchQuery}"` : ''}.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Community 5-Star Ratings & Game Recommendations Section */}
        <CommunityRecommendationsSection
          onOpenRecommendModal={() => setIsRecommendModalOpen(true)}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
        />

        {/* Developer Hub Section */}
        <DeveloperHub onOpenAddModal={() => setIsAddModalOpen(true)} />
      </main>

      {/* Floating Pablo Mascot (Bottom Right) */}
      <PabloMascot 
        onOpenHub={() => setIsPabloHubOpen(true)}
        affectionLevel={currentUser.pabloAffection || 25}
      />

      {/* Footer with Legal, Terms, Privacy, DMCA and School Safety */}
      <Footer 
        onOpenLegal={(tab) => {
          setLegalInitialTab(tab || 'privacy');
          setIsLegalModalOpen(true);
        }}
        onOpenPabloHub={() => setIsPabloHubOpen(true)}
        onOpenDiscord={() => setIsDiscordModalOpen(true)}
      />
      </div>

      {/* Game Runner Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onGamePlayed={handleGamePlayedSession}
        allGames={games}
        onSelectGame={handlePlayGame}
        onShareHighScore={handleShareHighScore}
        onOpenDiscord={() => setIsDiscordModalOpen(true)}
        currentUser={currentUser}
        onOpenRatingModal={(g) => {
          setRatingTargetGame(g);
          setIsRatingModalOpen(true);
        }}
      />

      {/* Pablo Arcade Hub Modal */}
      <PabloArcadeHubModal
        isOpen={isPabloHubOpen}
        onClose={() => setIsPabloHubOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
        onOpenVipModal={() => {
          setIsPabloHubOpen(false);
          setIsVipModalOpen(true);
        }}
      />

      {/* VIP Access Unlock Modal */}
      <VipLockModal
        isOpen={isVipModalOpen}
        onClose={() => {
          setIsVipModalOpen(false);
          setTargetVipGame(null);
        }}
        game={targetVipGame}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
        onUnlockedPlay={(g) => handlePlayGame(g)}
        onOpenPabloFeed={() => {
          setIsVipModalOpen(false);
          setIsPabloHubOpen(true);
        }}
      />

      {/* Game Hype Pre-Roll Modal */}
      <GameHypeAdModal
        game={adGame}
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onLaunchGame={handlePlayGame}
      />

      {/* Music Stream Player Modal */}
      <MusicStreamPlayerModal
        isOpen={isMusicStreamModalOpen}
        onClose={() => setIsMusicStreamModalOpen(false)}
        configuredUrl={musicStreamUrl}
        onUpdateConfiguredUrl={handleUpdateMusicStreamUrl}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setRatingTargetGame(null);
        }}
        game={ratingTargetGame}
        onSaveRating={handleSaveRating}
      />

      {/* Recommend Game Modal */}
      <RecommendGameModal
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
      />

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Legal, Privacy Policy & Terms of Agreement Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />

      {/* All-Time High Score Share & Brag Modal */}
      <HighScoreShareModal
        isOpen={isHighScoreModalOpen}
        onClose={() => {
          setIsHighScoreModalOpen(false);
          setTargetHighScoreGame(null);
        }}
        game={targetHighScoreGame}
        currentUserUsername={currentUser?.username}
        currentUserAvatar={currentUser?.avatar}
        onPostToChat={handlePostBragToChat}
        onOpenDiscordModal={() => setIsDiscordModalOpen(true)}
      />

      {/* Official Game Grinders Discord Server Modal */}
      <GameGrindersDiscordModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />

      {/* Sidebar Navigation & Control Drawer (Admin Panel, Terms Option & Game Filters) */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenLegal={(tab) => {
          setLegalInitialTab(tab || 'terms');
          setIsLegalModalOpen(true);
        }}
        onOpenPabloHub={() => setIsPabloHubOpen(true)}
        onOpenDiscordModal={() => setIsDiscordModalOpen(true)}
        onTriggerStealth={() => setIsStealthActive(true)}
        snowEnabled={snowEnabled}
        onToggleSnow={() => setSnowEnabled(!snowEnabled)}
        onSignOut={handleSignOut}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('games');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        games={games}
        favorites={favorites}
        onOpenChromebookModal={() => setIsChromebookModalOpen(true)}
        onOpenSeasonPass={() => setIsSeasonPassOpen(true)}
        onOpenDailySpin={() => setIsDailySpinOpen(true)}
        onOpenLocker={() => setIsLockerOpen(true)}
        onOpenVipModal={() => {
          setTargetVipGame(null);
          setIsVipModalOpen(true);
        }}
      />

      {/* Owner Admin Analytics & Graphs Panel (Haris Only) */}
      <OwnerAdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
        games={games}
        onOpenLegal={() => {
          setIsAdminPanelOpen(false);
          setLegalInitialTab('terms');
          setIsLegalModalOpen(true);
        }}
      />

      {/* School Chromebook 60 FPS Turbo & Unblock Hub Modal */}
      <ChromebookModal
        isOpen={isChromebookModalOpen}
        onClose={() => setIsChromebookModalOpen(false)}
        onTriggerStealth={() => setIsStealthActive(true)}
        onToggleSnow={(en) => setSnowEnabled(en)}
      />

      {/* Season 1: Neon Frost Pass Modal */}
      <SeasonPassModal
        isOpen={isSeasonPassOpen}
        onClose={() => setIsSeasonPassOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
        onOpenVipModal={() => {
          setIsSeasonPassOpen(false);
          setIsVipModalOpen(true);
        }}
        onOpenLocker={() => {
          setIsSeasonPassOpen(false);
          setIsLockerOpen(true);
        }}
      />

      {/* Daily Lucky Wheel Modal */}
      <DailySpinModal
        isOpen={isDailySpinOpen}
        onClose={() => setIsDailySpinOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
        onOpenSeasonPass={() => {
          setIsDailySpinOpen(false);
          setIsSeasonPassOpen(true);
        }}
      />

      {/* Player Locker Modal (Equip Titles, Avatars, Border Themes) */}
      <PlayerLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(u) => setCurrentUser(u)}
        onOpenSeasonPass={() => {
          setIsLockerOpen(false);
          setIsSeasonPassOpen(true);
        }}
      />
    </div>
  );
}

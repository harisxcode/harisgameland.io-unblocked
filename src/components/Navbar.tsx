import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Github, 
  Sparkles, 
  Menu, 
  X, 
  Star, 
  Lightbulb, 
  ShieldAlert, 
  Snowflake, 
  Coins, 
  Crown, 
  LogOut,
  User,
  Heart,
  Scale,
  Users,
  MessageSquare,
  Search,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { UserAccount } from '../types';
import { isOwnerAccount } from '../utils/auth';
import { Game } from '../data/games';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';
import { LegalTab } from './LegalModal';

interface NavbarProps {
  currentUser: UserAccount | null;
  onOpenSidebar: () => void;
  isSidebarOpen?: boolean;
  onOpenAdminPanel?: () => void;
  onOpenPabloHub: () => void;
  onTriggerStealth: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  onSignOut: () => void;
  onOpenRecommendModal: () => void;
  onOpenRatingModal: () => void;
  onOpenVipModal: () => void;
  onOpenLegal?: (tab?: LegalTab) => void;
  onOpenDiscordModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  games?: Game[];
  onSelectGame?: (game: Game) => void;
}

export function Navbar({ 
  currentUser,
  onOpenSidebar,
  isSidebarOpen = false,
  onOpenAdminPanel,
  onOpenPabloHub,
  onTriggerStealth,
  snowEnabled,
  onToggleSnow,
  onSignOut,
  onOpenRecommendModal,
  onOpenRatingModal,
  onOpenVipModal,
  onOpenLegal,
  onOpenDiscordModal,
  searchQuery = '',
  onSearchChange,
  games = [],
  onSelectGame
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const points = currentUser?.penguinPoints || 0;
  const isVip = !!currentUser?.isVip;
  const isOwner = isOwnerAccount(currentUser);

  // Filter matching games for live suggestions dropdown
  const matchingGames = useMemo(() => {
    if (!games || !searchQuery?.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return games.filter(g => 
      g.title.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q) ||
      g.tagline?.toLowerCase().includes(q) ||
      g.genre?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q) ||
      g.features?.some(f => f.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [games, searchQuery]);

  // Global keyboard shortcut: press `/` to focus the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchDropdownOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectGameItem = (game: Game) => {
    setIsSearchDropdownOpen(false);
    onSelectGame?.(game);
  };

  const handleScrollToCatalog = () => {
    setIsSearchDropdownOpen(false);
    const catalogElem = document.getElementById('games');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#040814]/90 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Wordmark & Mascot Logo + Sidebar Menu Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Main Sidebar Menu Trigger */}
          <button
            onClick={onOpenSidebar}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all text-xs font-bold shadow-md cursor-pointer group ${
              isSidebarOpen
                ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-cyan-500/20'
                : 'bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-400/60 text-cyan-300 hover:text-white shadow-cyan-950/50'
            }`}
            title={isSidebarOpen ? "Collapse Left Sidebar" : "Open Left Sidebar (Contact, Admin & Terms)"}
            aria-label="Toggle Sidebar Menu"
          >
            <Menu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold hidden sm:inline">{isSidebarOpen ? 'Sidebar Open' : 'Sidebar Menu'}</span>
          </button>

          <button
            onClick={onOpenPabloHub}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="Click to visit Pablo Arcade Hub"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-cyan-400 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src={pabloMascotImg}
                alt="Pablo Mascot"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden min-[480px]:block">
              <div className="text-sm sm:text-base font-black tracking-tight text-white font-display group-hover:text-cyan-300 transition-colors truncate">
                Haris Game Center
              </div>
              <div className="text-[10px] font-mono text-cyan-400 -mt-1 hidden lg:block">
                Powered by Pablo the Penguin · 0% Lag
              </div>
            </div>
          </button>
        </div>

        {/* Center: Top Search Bar (Visible on top of page) */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-cyan-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange?.(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleScrollToCatalog();
                } else if (e.key === 'Escape') {
                  setIsSearchDropdownOpen(false);
                }
              }}
              placeholder="Search unblocked games... (Slope, 1v1, Retro Bowl)"
              className="w-full bg-[#081329] hover:bg-[#0c1c3f] focus:bg-[#0a1838] border border-cyan-500/40 focus:border-cyan-400 rounded-xl pl-9 pr-12 sm:pr-14 py-1.5 sm:py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all font-medium shadow-inner"
            />
            {/* Clear Button or Keyboard Shortcut Badge */}
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange?.('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-cyan-400/80 bg-slate-900 border border-cyan-500/30 rounded pointer-events-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Quick-Search Results Dropdown */}
          {isSearchDropdownOpen && searchQuery?.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#060e24] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/90 overflow-hidden z-50 backdrop-blur-xl animate-fadeIn">
              <div className="p-2.5 bg-[#081433] border-b border-cyan-500/20 flex items-center justify-between text-[11px] font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Found {matchingGames.length} game{matchingGames.length === 1 ? '' : 's'}</span>
                </span>
                <button
                  onClick={handleScrollToCatalog}
                  className="text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>View in Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {matchingGames.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30">
                  {matchingGames.map((game) => (
                    <div
                      key={`top-search-${game.id}`}
                      onClick={() => handleSelectGameItem(game)}
                      className="p-2 rounded-xl hover:bg-cyan-950/60 flex items-center justify-between gap-3 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-cyan-500/30 shrink-0">
                          <img
                            src={game.thumbnailUrl}
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                            {game.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                            <span className="capitalize">{game.category}</span>
                            <span>·</span>
                            <span className="text-amber-300">⭐ {game.rating?.toFixed(1) || '4.9'}</span>
                            {game.isVipExclusive && (
                              <span className="text-amber-400 font-bold">👑 VIP</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectGameItem(game);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] shrink-0 transition-colors shadow-sm cursor-pointer"
                      >
                        Play
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-1">
                  <div className="text-xs font-bold text-slate-300">No games found matching "{searchQuery}"</div>
                  <p className="text-[11px] text-slate-500">Try searching "Slope", "Escape Road", "1v1", or browse the full catalog.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Utilities & Player Status */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* OWNER EXCLUSIVE: Admin Panel Quick Launcher */}
          {isOwner && onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer animate-pulse"
              title="Open Owner Admin Panel (Graphs &amp; Stats)"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Pablo Hub shortcut button */}
          <button
            onClick={onOpenPabloHub}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-bold shadow-sm shadow-cyan-950/40 cursor-pointer"
          >
            <span className="text-sm">🐧</span>
            <span>Pablo Hub</span>
          </button>

          {/* Teacher Panic / Stealth Button */}
          <button
            onClick={onTriggerStealth}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Instant classroom disguise (Hotkey: ] or Esc)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Panic</span>
          </button>

          {/* Snow toggle */}
          <button
            onClick={onToggleSnow}
            className={`hidden md:block p-2 rounded-xl border transition-colors cursor-pointer ${
              snowEnabled
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={snowEnabled ? 'Disable snowfall particles' : 'Enable snowfall particles'}
          >
            <Snowflake className="w-4 h-4" />
          </button>

          {/* Player status & Points */}
          {currentUser && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Penguin Points badge */}
              <div 
                onClick={onOpenPabloHub}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
                title="Your Penguin Points balance. Click to feed Pablo or unlock VIP!"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{points} pts</span>
              </div>

              {/* VIP Status or VIP Upgrade Button */}
              {isVip ? (
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>VIP</span>
                </div>
              ) : (
                <button
                  onClick={onOpenVipModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>VIP</span>
                </button>
              )}

              {/* Player Tag & Sign Out */}
              <div className="flex items-center gap-1 pl-0.5">
                <span className="text-base sm:text-lg p-1 bg-slate-900 rounded-lg border border-slate-800" title={`Signed in as ${currentUser.username}`}>
                  {currentUser.avatar || '🐧'}
                </span>
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Sign out or switch gamer tag"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open menu drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070e24] px-4 py-4 space-y-3 animate-fadeIn">
          {/* Mobile Top Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                  handleScrollToCatalog();
                }
              }}
              placeholder="Search specific game..."
              className="w-full bg-[#081228] border border-cyan-500/40 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Open Full Sidebar Menu */}
          <button
            onClick={() => { onOpenSidebar(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 text-xs font-bold cursor-pointer"
          >
            <span>📜 Open Left Sidebar Menu &amp; Policies</span>
            <span>View →</span>
          </button>

          {/* Owner Admin Panel (Mobile) */}
          {isOwner && onOpenAdminPanel && (
            <button
              onClick={() => { onOpenAdminPanel(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase cursor-pointer"
            >
              <span>👑 Owner Admin Panel (Stats &amp; Graphs)</span>
              <span>Launch</span>
            </button>
          )}

          <button
            onClick={() => { onOpenPabloHub(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer"
          >
            <span>🐧 Pablo Arcade Hub (Tips &amp; Pet)</span>
            <span>Open →</span>
          </button>

          <button
            onClick={() => { onTriggerStealth(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold cursor-pointer"
          >
            <span>🛡️ Stealth Panic Disguise</span>
            <span>Activate</span>
          </button>

          <button
            onClick={() => { onOpenDiscordModal?.(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#5865F2]/25 border border-[#5865F2]/40 text-[#c7d2fe] text-xs font-bold cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Game Grinders Discord</span>
            </span>
            <span>Join →</span>
          </button>

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => { onOpenRecommendModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-slate-300 cursor-pointer"
            >
              Recommend
            </button>
            <button
              onClick={() => { onOpenRatingModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-amber-300 cursor-pointer"
            >
              Rate Site
            </button>
            <button
              onClick={() => { onOpenLegal?.('terms'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-cyan-300 cursor-pointer"
            >
              📜 Terms
            </button>
            <button
              onClick={() => { onToggleSnow(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-cyan-300 cursor-pointer"
            >
              ❄️
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

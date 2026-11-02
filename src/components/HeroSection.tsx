import { Github, Gamepad2, ArrowUpRight, ShieldCheck, Zap, Crown, Sparkles, Star, Users, MessageSquare, Menu } from 'lucide-react';
import { Game, heroBanner, pabloMascotImg } from '../data/games';

const GAME_CENTER_REPO = 'https://github.com/harisxcode/haris-game-center';

interface HeroSectionProps {
  games: Game[];
  onOpenPabloHub?: () => void;
  onOpenRecommendModal?: () => void;
  onOpenRatingModal?: () => void;
  onOpenDiscord?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenSidebar?: () => void;
}

export function HeroSection({ 
  games, 
  onOpenPabloHub, 
  onOpenRecommendModal,
  onOpenRatingModal,
  onOpenDiscord,
  onOpenAdminPanel,
  onOpenSidebar
}: HeroSectionProps) {
  const liveCount = games.filter((g) => g.status === 'live').length;
  const vipCount = games.filter((g) => g.isVipExclusive).length;

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-cyan-500/20">
      {/* Dark blue ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/20 via-cyan-900/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top unboxed kicker metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 mb-4 uppercase font-mono">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> HARIS GAME CENTER
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>FEATURING PABLO THE PENGUIN</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% UNBLOCKED
          </span>
        </div>

        {/* 2-Column Split: Editorial Headline & Actions on Left, Hero Visual Arena on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-display text-balance">
              100% Unblocked arcade gaming with certified 0% lag.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Welcome to Haris Game Center—the ultimate unblocked web gaming sanctuary guided by our retro arcade mascot, Pablo the Penguin. Play Slope 3D, 1v1.LOL Arena, Escape Road, Drive Mad, and retro classics directly in your browser with 0% lag. Earn Penguin Points on every play to unlock VIP games for free!
            </p>

            {/* Unboxed Metadata Stats Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tabular-nums text-base">{liveCount}</span>
                <span>Unblocked Titles</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 tabular-nums text-base">{vipCount} VIP</span>
                <span>Exclusive Releases</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 text-base">0%</span>
                <span>Server Lag Rate</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              {onOpenRatingModal && (
                <button
                  onClick={onOpenRatingModal}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group"
                  title="Click to rate Haris Game Center out of 5 stars"
                >
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                    ))}
                  </div>
                  <span className="font-bold font-mono text-white text-base">4.9/5</span>
                  <span className="text-xs text-slate-400 group-hover:underline">(4.8k ratings)</span>
                </button>
              )}
            </div>

            {/* Universal Navigation Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#games"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Explore All Games</span>
              </a>

              <a
                href="#arcade-chat-lounge"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/70 text-purple-200 hover:text-white border border-purple-500/40 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-purple-950/40"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>💬 Community Comments &amp; Chat</span>
              </a>

              {onOpenPabloHub && (
                <button
                  onClick={onOpenPabloHub}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#091530] hover:bg-[#0c1e44] border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-cyan-950/40"
                >
                  <span>🐧 Meet Pablo &amp; Tips</span>
                </button>
              )}

              {onOpenRecommendModal && (
                <button
                  onClick={onOpenRecommendModal}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Request Game</span>
                </button>
              )}

              {onOpenDiscord && (
                <button
                  onClick={onOpenDiscord}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#c7d2fe] hover:text-white border border-[#5865F2]/40 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm shadow-[#5865F2]/20"
                >
                  <Users className="w-4 h-4 text-[#5865F2]" />
                  <span>Game Grinders (Discord)</span>
                </button>
              )}

              {onOpenAdminPanel && (
                <button
                  onClick={onOpenAdminPanel}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-amber-500/25"
                  title="Open Owner Admin Panel"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>👑 Owner Admin Panel</span>
                </button>
              )}

              {onOpenSidebar && (
                <button
                  onClick={onOpenSidebar}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  title="Open Sidebar Menu"
                >
                  <Menu className="w-4 h-4 text-cyan-400" />
                  <span>Sidebar Menu</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero Visual Arena Artwork Card with Pablo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/30 bg-slate-900/80 shadow-2xl shadow-cyan-950/60 group">
              
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-950">
                <img
                  src={pabloMascotImg}
                  alt="Pablo the Gamer Penguin at Haris Game Center"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-[#040814]/30 to-transparent pointer-events-none" />

                {/* Overlaid quick launch badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="text-white font-black text-sm flex items-center gap-1.5 font-display">
                      <span>Pablo's Unblocked Arcade</span>
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-cyan-400 font-mono text-[11px]">
                      Earn +25 Penguin Points Every Session
                    </div>
                  </div>

                  <a
                    href="#games"
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-sm"
                  >
                    Play Now
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

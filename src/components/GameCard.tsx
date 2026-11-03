import { useState } from 'react';
import { 
  Play, 
  Github, 
  ExternalLink, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Tv, 
  Sparkles,
  Flame,
  Star,
  Lock,
  Crown,
  Eye,
  Zap,
  Coins,
  Mail
} from 'lucide-react';
import { Game, VipTierLevel } from '../types';
import { hasVipTierAccess } from '../utils/auth';

interface GameCardProps {
  game: Game;
  onPlayModal: (game: Game) => void;
  onPreviewAd: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onOpenRatingModal: (game: Game) => void;
  onOpenVipModal: (game: Game) => void;
  isUserVip: boolean;
  userVipTier?: VipTierLevel;
  onShareHighScore?: (game: Game) => void;
}

export function GameCard({ 
  game, 
  onPlayModal, 
  onPreviewAd, 
  isFavorite, 
  onToggleFavorite,
  onOpenRatingModal,
  onOpenVipModal,
  isUserVip,
  userVipTier,
  onShareHighScore
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const effectiveTier = userVipTier || (isUserVip ? 'regular' : 'none');
  const requiredTier = game.vipTierRequired || 'regular';
  const isLocked = game.isVipExclusive && !hasVipTierAccess(effectiveTier, requiredTier);

  const handleGameLaunch = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isLocked) {
      onOpenVipModal(game);
      return;
    }
    onPlayModal(game);
  };

  const formatPlays = (plays: number): string => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`;
    return plays.toString();
  };

  return (
    <div
      id={game.id}
      className={`group relative flex flex-col rounded-2xl bg-[#081024] border transition-all duration-300 overflow-hidden shadow-md shadow-black/50 ${
        isLocked
          ? 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-950/30'
          : 'border-slate-800/90 hover:border-cyan-500/50 hover:shadow-cyan-950/30'
      }`}
    >
      {/* Thumbnail Banner Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        {!imgError ? (
          <img
            src={game.thumbnailUrl}
            alt={`${game.title} thumbnail`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
            <span className="text-sm font-semibold text-slate-300">{game.title}</span>
            <span className="text-xs text-slate-500 mt-1">Arcade 60FPS Visual</span>
          </div>
        )}

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081024] via-[#081024]/20 to-transparent pointer-events-none" />

        {/* Top Floating Badges: Genre, VIP status & Favorite */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono tracking-wide text-cyan-300 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-cyan-500/20">
              {game.genre}
            </span>

            {(game.serverSource === 'Haris Arcade Vault' || game.id.startsWith('gl-')) && (
              <span className="text-[10px] font-mono tracking-wide text-cyan-300 bg-cyan-950/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-cyan-400/40 font-semibold shadow-xs">
                🕹️ Arcade Vault
              </span>
            )}

            {game.isVipExclusive && (
              <span className={`flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md shadow-sm border ${
                game.vipTierRequired === 'diamond'
                  ? 'text-cyan-300 bg-cyan-950/90 border-cyan-400/60'
                  : game.vipTierRequired === 'gold'
                  ? 'text-amber-300 bg-amber-950/90 border-amber-400/60'
                  : 'text-purple-300 bg-purple-950/90 border-purple-400/60'
              }`}>
                <Crown className="w-3 h-3" />
                <span>{game.vipTierRequired ? `${game.vipTierRequired.toUpperCase()} VIP` : 'VIP'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Preview Ad Button */}
            {game.hypeAd && (
              <button
                onClick={() => onPreviewAd(game)}
                className="p-1.5 rounded-lg backdrop-blur-md bg-slate-950/70 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-colors"
                title="Watch fun preview ad"
                aria-label="Watch game preview ad"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Overlay Button */}
        {game.status === 'live' && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-[2px]">
            {isLocked ? (
              <button
                onClick={() => onOpenVipModal(game)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-transform transform active:scale-95 shadow-xl shadow-amber-500/30 cursor-pointer"
              >
                <Lock className="w-4 h-4 fill-slate-950" />
                <span>Unlock VIP ($5 or 500 Pts)</span>
              </button>
            ) : (
              <>
                {game.hypeAd && (
                  <button
                    onClick={() => onPreviewAd(game)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-transform transform active:scale-95 shadow-lg shadow-amber-500/30 cursor-pointer"
                    title="Watch hype preview"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}

                <button
                  onClick={handleGameLaunch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-transform transform active:scale-95 shadow-xl shadow-cyan-500/30 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{game.category === 'other' ? 'Stream Audio' : 'Play Unblocked'}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Card Content & Stats */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-3">
        {/* Title and Ratings/Plays row */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-base tracking-tight font-display truncate">
              {game.title}
            </h3>
            {game.isNew && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.tagline}
          </p>
        </div>

        {/* Real-time 5-Star Rating & Plays Counter Bar */}
        <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          {/* 5-Star Rating Display */}
          <button
            onClick={() => onOpenRatingModal(game)}
            className="flex flex-col items-start gap-0.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group text-left"
            title="Click to rate this game out of 5 stars"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(game.rating)
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                      : 'fill-slate-800 text-slate-700'
                  }`}
                />
              ))}
              <span className="font-black font-mono ml-1.5 text-xs text-amber-300">
                {game.rating.toFixed(1)}<span className="text-slate-400 text-[10px] font-normal">/5</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:underline">
              {game.ratingCount.toLocaleString()} player ratings
            </span>
          </button>

          {/* Plays count */}
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-cyan-300 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{formatPlays(game.playCount)}</span>
            </div>
            <span className="text-[10px] text-slate-400">plays</span>
          </div>
        </div>

        {/* Expanded Controls Drawer */}
        {showDetails && (
          <div className="pt-2 text-xs space-y-2 border-t border-slate-800 animate-fadeIn">
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider block mb-1">
                Controls:
              </span>
              <div className="space-y-1">
                {game.controls.map((ctrl, i) => (
                  <div key={i} className="flex justify-between text-[11px] text-slate-300">
                    <span className="font-mono text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {ctrl.key}
                    </span>
                    <span className="text-slate-400">{ctrl.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-400">
              <span className="text-slate-500">Tech:</span> {game.techStack.join(', ')}
            </div>

            {/* Quick in-drawer feedback and owner email links */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => onOpenRatingModal(game)}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                title="Rate game & give feedback"
              >
                <Star className="w-3 h-3 fill-amber-400" />
                <span>Rate Game</span>
              </button>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=harisxcode@gmail.com&su=${encodeURIComponent(`Arcade Feedback on ${game.title} - Haris Arcade`)}&body=${encodeURIComponent(`Hi Haris,\n\nI am contacting you in person regarding ${game.title} on your arcade website:\n\n`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                title="Tell website owner (Haris) in person via Gmail"
              >
                <Mail className="w-3 h-3" />
                <span>Email Owner</span>
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-slate-800/80 mt-auto flex items-center gap-2">
          {game.status === 'live' ? (
            <>
              {isLocked ? (
                <button
                  onClick={() => onOpenVipModal(game)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-transform transform active:scale-98 shadow-sm cursor-pointer ${
                    game.vipTierRequired === 'diamond'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/20'
                      : game.vipTierRequired === 'gold'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/20'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {game.vipTierRequired === 'diamond'
                      ? 'Diamond VIP (1000 Pts)'
                      : game.vipTierRequired === 'gold'
                      ? 'Gold VIP (750 Pts)'
                      : 'Regular VIP (500 Pts)'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleGameLaunch}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{game.category === 'other' ? 'Stream' : 'Play Direct'}</span>
                </button>
              )}

              {/* Rate & Feedback button */}
              <button
                onClick={() => onOpenRatingModal(game)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 border border-slate-800 transition-colors cursor-pointer"
                title={`Rate ${game.title} & give feedback`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400/40" />
              </button>

              {/* Email Owner (Gmail) button */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=harisxcode@gmail.com&su=${encodeURIComponent(`Arcade Feedback on ${game.title} - Haris Arcade`)}&body=${encodeURIComponent(`Hi Haris,\n\nI was playing ${game.title} on your arcade website and wanted to tell you in person:\n\n`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-rose-400 hover:text-rose-300 border border-slate-800 transition-colors"
                title="Tell website owner (Haris) in person via Gmail"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

              {/* Details toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title={showDetails ? 'Hide details' : 'Show controls'}
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Host/External mirror */}
              {game.isExternal ? (
                <a
                  href={game.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                  title="Open direct mirror in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={handleGameLaunch}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                  title="Launch 0% lag canvas player"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}
            </>
          ) : (
            <div className="flex-1 py-2 px-3 text-center text-xs font-medium text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
              Coming Soon
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

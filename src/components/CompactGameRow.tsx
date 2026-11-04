import { useState } from 'react';
import { Play, Github, ExternalLink, Heart, Terminal, Sparkles, Globe, Tv, Star, Flame, Crown } from 'lucide-react';
import { Game } from '../data/games';

interface CompactGameRowProps {
  game: Game;
  onPlayModal: (game: Game) => void;
  onPreviewAd?: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onOpenRatingModal?: (game: Game) => void;
  onShareHighScore?: (game: Game) => void;
}

export function CompactGameRow({ 
  game, 
  onPlayModal, 
  onPreviewAd, 
  isFavorite, 
  onToggleFavorite,
  onOpenRatingModal,
  onShareHighScore
}: CompactGameRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      id={game.id === 'flappy-bird-arcade' ? 'flappy-bird' : game.id}
      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#081022] hover:bg-[#0c1630] border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200"
    >
      {/* Left: Thumbnail & Game Details */}
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        {/* Compact Thumbnail */}
        <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
          {!imgError ? (
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
              {game.title}
            </div>
          )}

          {/* Quick hover play icon */}
          {game.status === 'live' && (
            game.id === 'music-stream' ? (
              <button
                onClick={() => onPlayModal(game)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                title="Stream Music Player"
              >
                <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
              </button>
            ) : game.directPlayOnly ? (
              <a
                href={game.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title={game.id === 'roblox-cloud' ? 'Play on now.gg' : 'Play Direct'}
              >
                <ExternalLink className="w-5 h-5 text-cyan-400" />
              </a>
            ) : (
              <button
                onClick={() => onPlayModal(game)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                title="Quick preview"
              >
                <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
              </button>
            )
          )}
        </div>

        {/* Title & Metadata */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate font-display">
              {game.title}
            </h3>

            {/* Unboxed Metadata separator */}
            <span className="text-xs text-slate-500 hidden sm:inline">·</span>
            <span className="text-xs font-mono text-cyan-400">{game.genre}</span>

            {game.isFeatured && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 truncate max-w-xl font-normal">
            {game.tagline}
          </p>

          {/* 5-Star Rating and Plays Stats */}
          <div className="flex items-center gap-3 pt-1 text-xs">
            <button
              onClick={() => onOpenRatingModal && onOpenRatingModal(game)}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group"
              title="Rate this game out of 5 stars"
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(game.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-800 text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold font-mono text-[11px] text-amber-300">
                {game.rating.toFixed(1)}/5
              </span>
              <span className="text-[10px] text-slate-400 group-hover:underline">
                ({game.ratingCount.toLocaleString()})
              </span>
            </button>

            <span className="text-slate-600">·</span>

            <div className="flex items-center gap-1 text-cyan-300 font-mono text-[11px]">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span>{(game.playCount / 1000).toFixed(0)}k plays</span>
            </div>

            <span className="text-slate-600 hidden sm:inline">·</span>

            <span className="text-[11px] font-mono text-cyan-400 font-bold hidden sm:inline">
              ❄️ +50 S1 XP
            </span>
          </div>

          {/* Controls hint */}
          {game.controls.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <Terminal className="w-3 h-3 text-cyan-500 shrink-0" />
              <span>{game.controls.slice(0, 3).map(c => `${c.key} (${c.action})`).join(' · ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
        {/* Favorite toggle */}
        <button
          onClick={() => onToggleFavorite(game.id)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite
              ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
              : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800'
          }`}
          title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* GitHub Repo or External Host */}
        <a
          href={game.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
          title={game.directPlayOnly ? 'Direct link to now.gg' : (game.isExternal ? 'Visit host site' : 'View source code on GitHub')}
        >
          {game.isExternal ? <Globe className="w-4 h-4 text-cyan-400" /> : <Github className="w-4 h-4" />}
        </a>

        {/* In-App Frame button (Hidden for directPlayOnly games) */}
        {game.status === 'live' && !game.directPlayOnly && (
          <button
            onClick={() => onPlayModal(game)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>In-App</span>
          </button>
        )}

        {/* Ad preview button */}
        {onPreviewAd && (
          <button
            onClick={() => onPreviewAd(game)}
            className="p-2 rounded-lg text-amber-300 hover:text-amber-200 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 transition-colors cursor-pointer"
            title="Watch game hype preview ad"
          >
            <Tv className="w-4 h-4" />
          </button>
        )}

        {/* Launch / Play in new tab */}
        {game.status === 'live' ? (
          game.id === 'music-stream' ? (
            <button
              onClick={() => onPlayModal(game)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Stream Music</span>
            </button>
          ) : (
            <a
              href={game.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{game.id === 'roblox-cloud' ? 'Play (now.gg)' : (game.directPlayOnly ? 'Play Direct' : 'Play')}</span>
            </a>
          )
        ) : (
          <span className="text-xs text-slate-500 font-mono px-3 py-1 bg-slate-950 rounded border border-slate-800">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

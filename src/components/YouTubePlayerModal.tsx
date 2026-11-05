import React, { useState, useRef } from 'react';
import { 
  X, 
  Youtube, 
  Search, 
  ExternalLink, 
  Maximize, 
  Share2, 
  Sparkles, 
  Radio, 
  Tv, 
  Play, 
  Flame, 
  Check, 
  Volume2, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { 
  CURATED_YOUTUBE_VIDEOS, 
  parseYouTubeVideoId, 
  getYouTubeEmbedUrl 
} from '../utils/youtube';
import { YouTubeVideoItem } from '../types';
import { playArcadeSfx } from '../utils/audio';

interface YouTubePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideoId?: string;
}

export function YouTubePlayerModal({
  isOpen,
  onClose,
  initialVideoId
}: YouTubePlayerModalProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string>(
    initialVideoId || CURATED_YOUTUBE_VIDEOS[0].id
  );
  const [urlInput, setUrlInput] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentVideo: YouTubeVideoItem | undefined = CURATED_YOUTUBE_VIDEOS.find(
    v => v.id === currentVideoId
  );

  const handleSelectVideo = (videoId: string) => {
    playArcadeSfx('click');
    setCurrentVideoId(videoId);
    setSearchFeedback(null);
  };

  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    playArcadeSfx('click');
    const parsedId = parseYouTubeVideoId(urlInput);

    if (parsedId) {
      setCurrentVideoId(parsedId);
      setSearchFeedback(`Loaded YouTube Video ID: ${parsedId}`);
      setUrlInput('');
      setTimeout(() => setSearchFeedback(null), 3000);
    } else {
      // If not a direct video URL, open YouTube search in new tab
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(urlInput)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      setSearchFeedback('Opened YouTube search query in new tab!');
      setTimeout(() => setSearchFeedback(null), 3500);
    }
  };

  const handleCopyLink = async () => {
    const fullUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      playArcadeSfx('click');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 ${
      isTheaterMode ? 'bg-black/95' : ''
    }`}>
      <div 
        ref={playerContainerRef}
        className="relative w-full max-w-5xl max-h-[95vh] flex flex-col bg-[#050914] border-2 border-red-500/40 rounded-3xl shadow-2xl shadow-red-950/60 text-white overflow-hidden"
      >
        
        {/* Top Header & Search Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/80 via-[#180a0a] to-[#0a0515] border-b border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
              <Youtube className="w-5 h-5 fill-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  YOUTUBE ARCADE STREAMER
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                  https://www.youtube.com/
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display truncate">
                {currentVideo?.title || 'YouTube Live Player'}
              </h3>
            </div>
          </div>

          {/* Direct Paste URL / Search Input */}
          <form onSubmit={handleLoadCustomUrl} className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste any YouTube URL or search terms..."
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-950 border border-red-500/30 focus:border-red-400 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-mono font-bold uppercase cursor-pointer"
            >
              Play
            </button>
          </form>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Toggle Theater Mode"
            >
              <Tv className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Full Screen Player"
            >
              <Maximize className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Feedback Notification */}
        {searchFeedback && (
          <div className="px-4 py-1.5 bg-red-950/80 border-b border-red-500/40 text-xs font-mono text-red-200 text-center animate-in slide-in-from-top duration-200">
            {searchFeedback}
          </div>
        )}

        {/* Main Player Screen Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden shrink-0">
          <iframe
            key={currentVideoId}
            src={getYouTubeEmbedUrl(currentVideoId, true)}
            title={currentVideo?.title || 'YouTube Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Below Player Controls & Video Info */}
        <div className="p-3.5 sm:p-4 bg-[#040816] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-[11px] font-bold">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>1080p 60FPS STREAM</span>
            </div>

            <div className="text-slate-300 font-mono text-xs">
              Channel: <strong className="text-white">{currentVideo?.channel || 'YouTube Video'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Share Video'}</span>
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${currentVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase transition-colors shadow-sm shadow-red-600/30"
            >
              <span>Open on YouTube.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Curated Channels & Gaming Streams Carousel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#030610] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Curated Arcade Playlists &amp; Chill Gaming Tracks</span>
            </span>
            <span className="text-slate-500">Click any card to play immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CURATED_YOUTUBE_VIDEOS.map((vid) => {
              const isPlaying = vid.id === currentVideoId;
              return (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                    isPlaying
                      ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/30 ring-1 ring-red-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/80 px-1 rounded text-white font-bold">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      )}
                      <span className="text-[10px] font-mono text-red-400 uppercase font-semibold">
                        {vid.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-red-300 transition-colors">
                      {vid.title}
                    </h4>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {vid.channel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}

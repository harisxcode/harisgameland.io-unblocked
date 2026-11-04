import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  Laugh, 
  Music, 
  Fish, 
  Coins, 
  Heart, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Zap, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, PenguinSnack } from '../types';
import { PENGUIN_SNACKS, feedPabloSnack, hasVipTierAccess, isOwnerAccount } from '../utils/auth';
import { PABLO_PROMO_TIPS, PABLO_JOKES } from '../data/pabloHubData';
import { musicEngine } from '../utils/audioMusic';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';
import { PabloRetroIntro } from './PabloRetroIntro';
import { recordQuestAction } from '../utils/seasonPass';

interface PabloArcadeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenVipModal?: (tier?: 'regular' | 'gold' | 'diamond') => void;
}

type TabType = 'tips' | 'jokes' | 'feed' | 'music';

export const PabloArcadeHubModal: React.FC<PabloArcadeHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenVipModal
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tips');
  const [revealedJokes, setRevealedJokes] = useState<Record<string, boolean>>({});
  const [feedingStatus, setFeedingStatus] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>('chillwave');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(musicEngine.getIsPlaying());
  const [volume, setVolume] = useState<number>(0.3);
  const [showRetroIntro, setShowRetroIntro] = useState(false);

  if (!isOpen) return null;

  const points = currentUser?.penguinPoints || 0;
  const affection = currentUser?.pabloAffection || 20;

  const handleToggleJoke = (jokeId: string) => {
    setRevealedJokes((prev) => ({
      ...prev,
      [jokeId]: !prev[jokeId]
    }));
  };

  const handleFeed = (snack: PenguinSnack) => {
    const res = feedPabloSnack(snack.id);
    if (res.success && res.user) {
      try {
        recordQuestAction('daily_pablo_feed', 1);
        const q2 = recordQuestAction('season_pablo_feed', 1);
        onUserUpdated(q2.user);
      } catch {
        onUserUpdated(res.user);
      }
      setFeedingStatus(res.message);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {
        // safe
      }
      setTimeout(() => setFeedingStatus(null), 4000);
    } else {
      setFeedingStatus(res.message);
      setTimeout(() => setFeedingStatus(null), 3000);
    }
  };

  const handleMusicToggle = () => {
    const active = musicEngine.toggle(selectedTrack);
    setIsPlayingMusic(active);
  };

  const handleTrackChange = (tId: string) => {
    setSelectedTrack(tId);
    musicEngine.playTrack(tId);
    setIsPlayingMusic(true);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    musicEngine.setVolume(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#060c1d] border-2 border-cyan-500/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/70">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#091530] via-[#0b1c40] to-[#091530] border-b border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-500/20">
              <img 
                src={pabloMascotImg} 
                alt="Pablo the Retro Penguin Emoji Mascot" 
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="absolute bottom-0 inset-x-0 bg-cyan-950/80 text-[9px] font-bold text-center text-cyan-300 uppercase py-0.5">
                PABLO
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white font-display">
                  Pablo Arcade Hub
                </h2>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  OFFICIAL MASCOT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Site Tips · Gamer Jokes · Virtual Pet Shop · Chiptune Jukebox
              </p>
            </div>
          </div>

          {/* Affection & Points Status Bar */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{points} Pts</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Penguin Points
              </div>
            </div>

            <div className="h-7 w-px bg-slate-800" />

            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{affection}% Love</span>
              </div>
              <div className="w-20 bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className="bg-rose-500 h-1.5 transition-all duration-300" 
                  style={{ width: `${affection}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Watch Retro Intro & Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRetroIntro(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
              title="Watch Pablo Arcade 'It's in the game!' Retro Intro"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Watch Retro Intro</span>
              <span className="sm:hidden">Intro</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/60 border border-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-[#070e24] px-4 gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'tips'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>0% Lag & Tips</span>
          </button>

          <button
            onClick={() => setActiveTab('jokes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'jokes'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Laugh className="w-3.5 h-3.5" />
            <span>Pablo's Jokes</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'feed'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Feed Pablo</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'music'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Arcade Jukebox</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: 0% LAG & UNBLOCKED TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-blue-950/40 border border-cyan-500/30 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    100% Unblocked & 0% Lag Guarantee
                  </h3>
                  <p className="text-xs text-slate-300">
                    Pablo and the Haris Game Center engineering team built custom zero-lag canvas renderers and mirror protocols so you get 60 FPS gameplay on any device without fear of school firewalls!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {PABLO_PROMO_TIPS.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-white font-display">
                        {tip.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                        {tip.highlight}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PABLO'S JOKES */}
          {activeTab === 'jokes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Click any card to reveal Pablo's ice-cold gamer punchlines! 🐧😂
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PABLO_JOKES.map((joke) => {
                  const isRevealed = !!revealedJokes[joke.id];
                  return (
                    <div
                      key={joke.id}
                      onClick={() => handleToggleJoke(joke.id)}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="text-xs font-semibold text-slate-200 mb-3 group-hover:text-amber-300 transition-colors">
                        "{joke.setup}"
                      </div>

                      {isRevealed ? (
                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 animate-fadeIn">
                          {joke.punchline}
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Click to reveal punchline</span>
                          <span>→</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FEED PABLO */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Virtual Pet Food Market
                  </h3>
                  <p className="text-xs text-slate-300">
                    Use leftover Penguin Points to feed snacks to Pablo and max out his affection meter!
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {points} Pts
                  </span>
                </div>
              </div>

              {feedingStatus && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0" />
                  <span>{feedingStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PENGUIN_SNACKS.map((snack) => {
                  const canAfford = points >= snack.cost;
                  const isVipLocked = snack.vipTierRequired && !hasVipTierAccess(currentUser?.vipTier, snack.vipTierRequired, isOwnerAccount(currentUser));

                  const tierColor = snack.vipTierRequired === 'regular'
                    ? 'border-purple-500/40 text-purple-300 bg-purple-500/15'
                    : snack.vipTierRequired === 'gold'
                    ? 'border-amber-500/40 text-amber-300 bg-amber-500/15'
                    : snack.vipTierRequired === 'diamond'
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/15'
                    : '';

                  return (
                    <div
                      key={snack.id}
                      className={`p-4 rounded-2xl bg-slate-950/70 border flex flex-col justify-between transition-all ${
                        isVipLocked 
                          ? 'border-slate-800 opacity-80' 
                          : 'border-slate-800 hover:border-rose-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                            {snack.icon}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {snack.vipTierRequired && (
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${tierColor}`}>
                                {snack.vipTierRequired} VIP
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/20">
                              {snack.cost} Pts
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">
                          {snack.name}
                        </h4>
                        <p className="text-xs text-slate-400 mb-3">
                          {snack.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-rose-400 font-semibold">
                          +{snack.affectionBoost}% Affection
                        </span>

                        {isVipLocked ? (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenVipModal?.(snack.vipTierRequired);
                            }}
                            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-colors"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Unlock {snack.vipTierRequired?.toUpperCase()} VIP</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFeed(snack)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              canAfford
                                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20 cursor-pointer'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Fish className="w-3.5 h-3.5" />
                            <span>Feed Pablo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ARCADE JUKEBOX */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Arcade Chillwave Synthesizer
                  </h3>
                  <p className="text-xs text-slate-300">
                    Real-time synthesized 8-bit & synthwave audio loops directly synthesized via Web Audio API.
                  </p>
                </div>

                <button
                  onClick={handleMusicToggle}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 cursor-pointer transition-all"
                >
                  {isPlayingMusic ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Lounge</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Lounge</span>
                    </>
                  )}
                </button>
              </div>

              {/* Station Select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'chillwave', name: "Midnight Arcade (Chill)", vibe: 'Mellow synth pads' },
                  { id: 'neon_drift', name: "Neon Ice Rink (Drift)", vibe: 'Minor melodic bass' },
                  { id: 'retro_chiptune', name: "8-Bit Penguin Hop", vibe: 'Square wave arcade retro' }
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackChange(track.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTrack === track.id
                        ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">
                      {track.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {track.vibe}
                    </div>
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="text-xs font-mono text-slate-400 w-12 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#050a18] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>0% Packet Lag Active · 100% Unblocked</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>

        {/* Retro Intro Overlay */}
        <PabloRetroIntro
          isOpen={showRetroIntro}
          onComplete={() => setShowRetroIntro(false)}
          gameTitle="Pablo Arcade Classic"
          gameGenre="Retro Arcade"
        />

      </div>
    </div>
  );
};

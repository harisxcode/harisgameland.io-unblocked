import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Crown, 
  ExternalLink,
  Flame,
  ArrowRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game, GameHighScore } from '../types';
import { 
  getPersonalHighScore, 
  savePersonalHighScore, 
  generateBragText,
  getFullLeaderboard,
  formatGameScore,
  getGameUnit
} from '../utils/highScores';
import { playArcadeSfx } from '../utils/audio';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';

interface HighScoreShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  currentUserUsername?: string;
  currentUserAvatar?: string;
  onPostToChat?: (text: string, gameTitle: string, scoreBadge: string) => void;
  onOpenDiscordModal?: () => void;
}

export function HighScoreShareModal({
  isOpen,
  onClose,
  game,
  currentUserUsername = 'PabloGrinder',
  currentUserAvatar = '🐧',
  onPostToChat,
  onOpenDiscordModal
}: HighScoreShareModalProps) {
  const [personalScore, setPersonalScore] = useState<GameHighScore | null>(null);
  const [copied, setCopied] = useState(false);
  const [postedToChat, setPostedToChat] = useState(false);
  const [customScoreInput, setCustomScoreInput] = useState('');
  const [isEditingScore, setIsEditingScore] = useState(false);

  useEffect(() => {
    if (game) {
      const existing = getPersonalHighScore(game.id);
      setPersonalScore(existing);
      setCustomScoreInput(existing ? String(existing.score) : '');
      setPostedToChat(false);
      setCopied(false);
    }
  }, [game, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  const currentUnit = game.highScoreUnit || getGameUnit(game.id);
  const displayScoreText = personalScore?.formattedScore || (personalScore?.score ? `${personalScore.score} ${currentUnit}` : 'No Record Yet');
  const leaderboard = getFullLeaderboard(game.id, currentUserUsername);

  const handleCopyBrag = () => {
    const text = generateBragText(
      game.title,
      personalScore?.formattedScore || `${customScoreInput || '0'} ${currentUnit}`,
      currentUserUsername
    );
    navigator.clipboard.writeText(text);
    setCopied(true);
    playArcadeSfx('click');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveNewScore = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(customScoreInput);
    if (isNaN(num) || num <= 0) return;

    const res = savePersonalHighScore(
      game.id,
      game.title,
      num,
      currentUnit,
      currentUserUsername,
      currentUserAvatar
    );
    setPersonalScore(res.highScore);
    setIsEditingScore(false);
    playArcadeSfx('click');
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  const handleShareToLounge = () => {
    if (!onPostToChat) return;
    const brag = `🏆 New all-time personal best on ${game.title}: ${displayScoreText}! Can anyone in Game Grinders beat this?`;
    onPostToChat(brag, game.title, displayScoreText);
    setPostedToChat(true);
    playArcadeSfx('click');
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#081024] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a1430] border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                All-Time High Score &amp; Brag Card
              </h3>
              <p className="text-xs text-slate-400">
                Share your personal best score across Game Grinders
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playArcadeSfx('click');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Visual Brag Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#091530] to-[#060e22] border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 shrink-0 shadow-md">
                  <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-mono text-cyan-300 text-center py-0.5">
                    {game.genre}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono text-amber-400 mb-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="uppercase tracking-wider font-bold">Haris Game Center Record</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white font-display">
                    {game.title}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-1">
                    <span className="p-0.5 px-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                      {currentUserAvatar} @{currentUserUsername}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] font-mono text-emerald-400">0% Lag Verified</span>
                  </div>
                </div>
              </div>

              {/* Big Score Stamp */}
              <div className="text-center sm:text-right shrink-0 bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  All-Time Best
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  {displayScoreText}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Saved in LocalStorage
                </div>
              </div>
            </div>

            {/* Mascot Stamp */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <img src={pabloMascotImg} alt="Pablo" className="w-4 h-4 rounded-full" style={{ imageRendering: 'pixelated' }} />
                <span>Pablo Mascot Certified Clean Run</span>
              </div>
              <div className="text-slate-500">
                #GameGrinders
              </div>
            </div>
          </div>

          {/* Quick Record Update / Manual Logger */}
          <div className="p-4 rounded-2xl bg-[#060c1d] border border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Logged A New Run Just Now?</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Enter your latest achieved score to update your all-time high score on this browser.
              </p>
            </div>

            {isEditingScore ? (
              <form onSubmit={handleSaveNewScore} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  step="any"
                  value={customScoreInput}
                  onChange={(e) => setCustomScoreInput(e.target.value)}
                  placeholder={`Score in ${currentUnit}`}
                  className="w-28 px-3 py-1.5 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingScore(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingScore(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                ✏️ Update Score
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Copy Post Button */}
            <button
              onClick={handleCopyBrag}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Brag Copied!' : 'Copy Share Text'}</span>
            </button>

            {/* Share to Community Lounge */}
            <button
              onClick={handleShareToLounge}
              disabled={postedToChat}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                postedToChat
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300 hover:text-white'
              }`}
            >
              {postedToChat ? <Check className="w-4 h-4 text-emerald-400" /> : <MessageSquare className="w-4 h-4 text-cyan-400" />}
              <span>{postedToChat ? 'Posted to Lounge!' : 'Post in Lounge'}</span>
            </button>

            {/* Share to Game Grinders Discord */}
            <button
              onClick={() => {
                handleCopyBrag();
                if (onOpenDiscordModal) onOpenDiscordModal();
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 text-[#8ea1e1] hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#5865F2]" />
              <span>Game Grinders</span>
            </button>
          </div>

          {/* Community Leaderboard Snippet */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>TOP ARCADE GRINDERS FOR {game.title.toUpperCase()}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">All-Time Standings</span>
            </div>

            <div className="p-2 rounded-2xl bg-[#060c1d] border border-slate-800 divide-y divide-slate-800/80">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                    entry.isMe ? 'bg-amber-500/15 border border-amber-500/30 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 text-center font-mono font-bold ${
                      entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{entry.rank}
                    </span>
                    <span className="text-sm">{entry.avatar}</span>
                    <span className={entry.isMe ? 'text-amber-300' : 'text-slate-200'}>
                      {entry.player} {entry.isMe ? '(You)' : ''}
                    </span>
                  </div>
                  <span className="font-mono text-cyan-300 font-bold">
                    {entry.formatted}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

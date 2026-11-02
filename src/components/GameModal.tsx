import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Zap, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Share2, 
  Users, 
  MessageSquare, 
  Send, 
  Heart, 
  Crown, 
  Check, 
  Gamepad2,
  Copy,
  Terminal,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game, UserAccount, ChatComment } from '../types';
import { 
  getPersonalHighScore, 
  savePersonalHighScore, 
  getFullLeaderboard, 
  getGameUnit, 
  formatGameScore,
  generateBragText
} from '../utils/highScores';
import { getAllComments, postComment, toggleCommentLike } from '../utils/comments';
import { playArcadeSfx } from '../utils/audio';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onGamePlayed?: (game: Game) => void;
  allGames?: Game[];
  onSelectGame?: (game: Game) => void;
  onShareHighScore?: (game: Game) => void;
  onOpenDiscord?: () => void;
  currentUser?: UserAccount | null;
  initialTab?: 'game' | 'highscore' | 'comments';
}

export function GameModal({ 
  game, 
  onClose, 
  onGamePlayed, 
  allGames, 
  onSelectGame,
  onOpenDiscord,
  currentUser
}: GameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [useBuiltInEngine, setUseBuiltInEngine] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
  
  // High score submission state
  const [scoreInput, setScoreInput] = useState('');
  const [scoreSuccessMsg, setScoreSuccessMsg] = useState<string | null>(null);
  const [copiedBrag, setCopiedBrag] = useState(false);

  // In-modal comments state
  const [gameComments, setGameComments] = useState<ChatComment[]>([]);
  const [commentInput, setCommentInput] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomScoresRef = useRef<HTMLDivElement>(null);

  const username = currentUser?.username || 'GuestGrinder';
  const avatar = currentUser?.avatar || '🐧';
  const isVip = !!currentUser?.isVip;

  // Award points on game play
  useEffect(() => {
    if (game && !hasAwardedPoints && onGamePlayed) {
      onGamePlayed(game);
      setHasAwardedPoints(true);
    }
  }, [game, hasAwardedPoints, onGamePlayed]);

  // Sync game comments
  useEffect(() => {
    if (!game) return;
    const loadComments = () => {
      const all = getAllComments();
      const filtered = all.filter(c => 
        c.gameId === game.id || 
        (c.gameTitle && c.gameTitle.toLowerCase().includes(game.title.toLowerCase().split(':')[0]))
      );
      setGameComments(filtered);
    };

    loadComments();
    window.addEventListener('haris_comments_updated', loadComments);
    return () => window.removeEventListener('haris_comments_updated', loadComments);
  }, [game]);

  // Keyboard shortcut for escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!game) return null;

  const currentUnit = game.highScoreUnit || getGameUnit(game.id);
  const personalRecord = getPersonalHighScore(game.id);
  const leaderboard = getFullLeaderboard(game.id, username);
  const topRecord = leaderboard[0]?.formatted || 'N/A';

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  const scrollToBottomScores = () => {
    bottomScoresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScoreSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseFloat(scoreInput);
    if (isNaN(num) || num <= 0) return;

    savePersonalHighScore(
      game.id,
      game.title,
      num,
      currentUnit,
      username,
      avatar
    );

    const formatted = formatGameScore(num, currentUnit);

    // Automatically post celebration in community chatter
    postComment({
      username,
      avatar,
      text: `🏆 Just set a personal best of ${formatted} on ${game.title}! Beat that in Game Grinders!`,
      gameId: game.id,
      gameTitle: game.title,
      highScoreBadge: `${formatted} 🏆`,
      isVip
    });

    setScoreInput('');
    setScoreSuccessMsg(`Logged ${formatted}! Recorded to leaderboard.`);
    playArcadeSfx('click');

    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.7 } });
    } catch {}

    setTimeout(() => setScoreSuccessMsg(null), 3500);
  };

  const handlePostGameComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    postComment({
      username,
      avatar,
      text: commentInput.trim(),
      gameId: game.id,
      gameTitle: game.title,
      isVip
    });

    setCommentInput('');
    playArcadeSfx('click');
  };

  const handleToggleLike = (id: string) => {
    playArcadeSfx('click');
    toggleCommentLike(id);
  };

  const handleCopyBrag = () => {
    const text = generateBragText(
      game.title,
      personalRecord?.formattedScore || `${scoreInput || '0'} ${currentUnit}`,
      username
    );
    navigator.clipboard.writeText(text);
    setCopiedBrag(true);
    playArcadeSfx('click');
    setTimeout(() => setCopiedBrag(false), 2500);
  };

  // Determine source
  const hasBuiltIn = !!game.builtInHtml;
  const isUsingBuiltIn = useBuiltInEngine || (hasBuiltIn && !game.isExternal);
  const directLink = game.playUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[94vh] max-h-[920px] bg-[#050916] rounded-2xl border border-cyan-500/30 flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/60"
      >
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-[#081024] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
              {game.title}
            </h2>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              · {game.genre}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              <Coins className="w-3 h-3 text-amber-400" /> +25 Pts Earned!
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick jump to bottom scores button */}
            <button
              onClick={scrollToBottomScores}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-colors cursor-pointer"
              title="Jump to high scores and leaderboard at bottom of page"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>High Scores ↓</span>
            </button>

            {/* Built-in engine fallback toggle */}
            {hasBuiltIn && (
              <button
                onClick={() => setUseBuiltInEngine(!useBuiltInEngine)}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isUsingBuiltIn
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Toggle 0% lag built-in engine"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isUsingBuiltIn ? 'Built-In (0% Lag)' : 'Switch Engine'}</span>
              </button>
            )}

            {/* Reload button */}
            <button
              onClick={reloadGame}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Restart session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Direct launch link that safely navigates without 404 */}
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              title="Open full page in dedicated tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Tab</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close game modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Game Page Content */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          
          {/* Main Game Stage / Canvas */}
          <div className="w-full h-[520px] sm:h-[580px] lg:h-[620px] relative flex items-center justify-center bg-black shrink-0">
            {isUsingBuiltIn && game.builtInHtml ? (
              <iframe
                key={`builtin-${iframeKey}`}
                srcDoc={game.builtInHtml}
                title={`${game.title} Built-in Engine`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            ) : (
              <iframe
                key={`external-${iframeKey}`}
                src={game.iframeUrl || game.playUrl}
                title={game.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
              />
            )}
          </div>

          {/* Quick Indicator Bar below canvas */}
          <div className="px-4 py-2 bg-[#060c1d] border-t border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Unblocked &amp; 0% Lag
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
                Unit: <strong className="text-amber-300 font-mono">{currentUnit}</strong>
              </span>
            </div>

            <button
              onClick={scrollToBottomScores}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Scroll to High Scores &amp; Submit Run</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>

          {/* ========================================================
              BOTTOM OF THE GAME PAGE: HIGH SCORES & SUBMISSION AREA 
             ======================================================== */}
          <div 
            ref={bottomScoresRef}
            className="p-5 sm:p-8 bg-gradient-to-b from-[#070e24] via-[#091535] to-[#040817] border-t-2 border-amber-500/30 space-y-8"
          >
            {/* Header: All-Time High Scores Desk */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                  <Trophy className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <span>Bottom of Game Page</span>
                    <span>·</span>
                    <span>High Score Station</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    {game.title} High Scores &amp; Leaderboard
                  </h3>
                </div>
              </div>

              {onOpenDiscord && (
                <button
                  onClick={onOpenDiscord}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#c7d2fe] hover:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Users className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Game Grinders Discord</span>
                </button>
              )}
            </div>

            {/* High Score Numbers Dashboard Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Your Personal All-Time High Score Number */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#0c1836] to-slate-950 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center justify-between">
                  <span>Your All-Time Record</span>
                  <Trophy className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight pt-1">
                  {personalRecord ? personalRecord.formattedScore : 'None Logged'}
                </div>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  {personalRecord ? `Recorded: ${personalRecord.achievedAt}` : `Submit your run below!`}
                </div>
              </div>

              {/* Card 2: Community #1 Record Number */}
              <div className="p-5 rounded-2xl bg-[#08122a] border border-cyan-500/40 shadow-lg space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center justify-between">
                  <span>Community #1 Record</span>
                  <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight pt-1">
                  {topRecord}
                </div>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  Top Grinder: {leaderboard[0]?.player || 'PenguinMaster'}
                </div>
              </div>

              {/* Card 3: Measurement Standard */}
              <div className="p-5 rounded-2xl bg-[#08122a] border border-slate-800 shadow-lg space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>Score Metric</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-300 font-mono tracking-tight pt-2">
                  Standard: {currentUnit.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  Lag-free validated score calculations
                </div>
              </div>

            </div>

            {/* Direct High Score Submission Form at the bottom of the game page */}
            <div className="p-6 rounded-3xl bg-[#08122b] border-2 border-amber-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <span>Submit Your High Score</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      SAVES ALL-TIME BEST
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Finished a run? Enter the number you achieved in <strong>{currentUnit}</strong> to save your all-time high score and update the leaderboard.
                  </p>
                </div>

                {personalRecord && (
                  <button
                    onClick={handleCopyBrag}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedBrag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBrag ? 'Brag Copied!' : 'Copy Score Card'}</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleScoreSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder={`Enter score number (e.g. 1500, 48, 12.5)...`}
                    className="w-full px-4 py-3 bg-slate-950 border border-amber-500/40 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-amber-400 font-bold">
                    {currentUnit}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!scoreInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Trophy className="w-4 h-4 fill-slate-950" />
                  <span>Submit High Score</span>
                </button>
              </form>

              {scoreSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{scoreSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* All-Time Leaderboard Numbers Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>All-Time High Score Standings</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  Updated Live
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/70">
                <div className="divide-y divide-slate-800/80">
                  {leaderboard.slice(0, 5).map((entry, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-3.5 transition-colors ${
                        entry.player === username 
                          ? 'bg-amber-500/10' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                          entry.rank === 1 ? 'bg-amber-500 text-slate-950' :
                          entry.rank === 2 ? 'bg-slate-300 text-slate-950' :
                          entry.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          #{entry.rank}
                        </span>

                        <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">
                          {entry.avatar}
                        </span>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white font-mono">
                              {entry.player}
                            </span>
                            {entry.player === username && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Verified Grinder Run
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-amber-300 font-mono">
                          {entry.formatted}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Comments & Discussion Section at the bottom */}
            <div className="p-6 rounded-3xl bg-[#08122a] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-base font-bold text-white font-display">
                      {game.title} Player Comments
                    </h4>
                    <p className="text-xs text-slate-400">
                      Discuss tips, routes, and high-score strategies with other grinders
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {gameComments.length} Comments
                </span>
              </div>

              {/* Comment composer for this game */}
              <form onSubmit={handlePostGameComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={`Drop a tip, comment or high-score brag for ${game.title}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              {/* Comment feed */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {gameComments.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 text-center text-xs text-slate-500 font-mono">
                    No comments for {game.title} yet. Be the first to drop a comment!
                  </div>
                ) : (
                  gameComments.map(comment => (
                    <div key={comment.id} className="p-3.5 rounded-2xl bg-[#060c1d] border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">
                            {comment.avatar}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-white font-mono">
                              {comment.username}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono ml-2">
                              {comment.timestamp}
                            </span>
                          </div>
                        </div>

                        {comment.highScoreBadge && (
                          <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Trophy className="w-3 h-3 fill-amber-400" />
                            <span>{comment.highScoreBadge}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-1">
                        {comment.text}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <button
                          onClick={() => handleToggleLike(comment.id)}
                          className={`flex items-center gap-1 py-0.5 px-2 rounded hover:bg-slate-900 transition-colors cursor-pointer ${
                            comment.likedByMe ? 'text-rose-400' : 'text-slate-400'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${comment.likedByMe ? 'fill-rose-400' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recommended Games Switcher */}
            {allGames && allGames.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Other Popular Games:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {allGames
                    .filter((g) => g.id !== game.id)
                    .slice(0, 4)
                    .map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => {
                          if (onSelectGame) onSelectGame(rec);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
                      >
                        <img
                          src={rec.thumbnailUrl}
                          alt={rec.title}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                            {rec.title}
                          </div>
                          <div className="text-[10px] font-mono text-amber-400">★ {rec.rating.toFixed(1)}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Game Controls Footer */}
            {game.controls.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="font-mono text-[11px] text-cyan-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Controls:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {game.controls.map((c, i) => (
                    <span key={i} className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <strong>{c.key}</strong>: {c.action}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

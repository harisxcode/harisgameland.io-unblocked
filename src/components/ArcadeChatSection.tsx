import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Sparkles, 
  Crown, 
  ExternalLink, 
  Users, 
  Flame, 
  ShieldCheck,
  Gamepad2,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { ChatComment, Game } from '../types';
import { playArcadeSfx } from '../utils/audio';
import { getAllComments, postComment, toggleCommentLike } from '../utils/comments';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';

interface ArcadeChatSectionProps {
  currentUserUsername?: string;
  currentUserAvatar?: string;
  isVip?: boolean;
  games?: Game[];
  onPlayGame?: (game: Game) => void;
  onOpenDiscordModal: () => void;
  onOpenHighScoreModal?: (game: Game) => void;
  externalNewComment?: { text: string; gameTitle?: string; highScoreBadge?: string } | null;
}

export function ArcadeChatSection({
  currentUserUsername = 'GuestGrinder',
  currentUserAvatar = '🐧',
  isVip = false,
  games = [],
  onPlayGame,
  onOpenDiscordModal,
  externalNewComment
}: ArcadeChatSectionProps) {
  const [comments, setComments] = useState<ChatComment[]>(() => getAllComments());
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('General');
  const [filterMode, setFilterMode] = useState<'all' | 'tips' | 'discussions'>('all');

  // Reload comments when custom event triggers
  useEffect(() => {
    const handleUpdate = () => {
      setComments(getAllComments());
    };
    window.addEventListener('haris_comments_updated', handleUpdate);
    return () => window.removeEventListener('haris_comments_updated', handleUpdate);
  }, []);

  // Sync external comments
  useEffect(() => {
    if (externalNewComment && externalNewComment.text) {
      postComment({
        username: currentUserUsername,
        avatar: currentUserAvatar,
        text: externalNewComment.text,
        gameTitle: externalNewComment.gameTitle,
        highScoreBadge: externalNewComment.highScoreBadge,
        isVip
      });
      setComments(getAllComments());
    }
  }, [externalNewComment, currentUserUsername, currentUserAvatar, isVip]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    postComment({
      username: currentUserUsername,
      avatar: currentUserAvatar,
      text: inputMessage.trim(),
      gameTitle: selectedTag !== 'General' ? selectedTag : undefined,
      isVip
    });

    setComments(getAllComments());
    setInputMessage('');
    playArcadeSfx('click');
  };

  const handleToggleLike = (commentId: string) => {
    toggleCommentLike(commentId);
    setComments(getAllComments());
    playArcadeSfx('click');
  };

  const filteredComments = comments.filter(c => {
    if (filterMode === 'tips') {
      return (
        c.text.toLowerCase().includes('tip') || 
        c.text.toLowerCase().includes('strat') || 
        c.text.toLowerCase().includes('how to') || 
        c.text.toLowerCase().includes('trick')
      );
    }
    if (filterMode === 'discussions') {
      return !c.highScoreBadge;
    }
    return true;
  });

  const popularGames = games.filter(g => 
    g.id === 'slope-cyber-tunnel' || 
    g.id === '1v1-arena-duel' || 
    g.id === 'tunnel-rush-3d' || 
    g.id === 'escape-road' || 
    g.id === 'drive-mad-stunt' || 
    g.id === 'retro-bowl-champions'
  );

  return (
    <section id="arcade-chat-lounge" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070e24] via-[#091535] to-[#050b1c] border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Discord Group Chat Announcement Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#091330] border border-[#5865F2]/40 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md shadow-[#5865F2]/30 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm font-display">
                  Official Discord Group Chat: Game Grinders
                </span>
                <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE COMMUNITY
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hang out with fellow grinders, trade game strategies, and talk unblocked gaming at <span className="font-mono text-cyan-300">discord.gg/gamegrinders</span>!
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDiscordModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#5865F2]/25 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Join Game Grinders</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Starting Player Lounge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Arcade Chat &amp; Community Comments
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Drop comments, talk unblocked strategies, and chat with other players. Click on any game below to play and access all high score numbers at the bottom of the game page!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#070e22] border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Comments ({comments.length})
            </button>
            <button
              onClick={() => setFilterMode('tips')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterMode === 'tips'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tips &amp; Strats</span>
            </button>
            <button
              onClick={() => setFilterMode('discussions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterMode === 'discussions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>General Chat</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Comments Feed on Left, High Score Guidance & Game Launcher on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Area (Col 1-7): Comments Feed & Composer */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Input Composer Box */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 rounded-3xl bg-[#08122a] border border-cyan-500/40 shadow-xl shadow-cyan-950/40 space-y-3"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base p-1 bg-slate-900 rounded-lg border border-slate-800">
                    {currentUserAvatar}
                  </span>
                  <span className="font-bold text-white font-mono">@{currentUserUsername}</span>
                  {isVip && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-amber-400" /> VIP
                    </span>
                  )}
                </div>

                {/* Game Tag Picker */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Topic:</span>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="General">General Lounge</option>
                    {games.map(g => (
                      <option key={g.id} value={g.title}>{g.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Drop a comment, share strategy, or chat with other gamers..."
                  className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Post</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredComments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    comment.pinned 
                      ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/40 shadow-md'
                      : 'bg-[#060c1d] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                        {comment.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm font-mono">
                            {comment.username}
                          </span>
                          {comment.isVip && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 fill-amber-400" /> VIP
                            </span>
                          )}
                          {comment.pinned && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                              PINNED 📌
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>{comment.timestamp}</span>
                          {comment.gameTitle && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400 font-semibold">{comment.gameTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {comment.gameTitle && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {comment.gameTitle.split(':')[0]}
                      </span>
                    )}
                  </div>

                  {/* Comment text */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                    {comment.text}
                  </p>

                  {/* Comment actions */}
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        comment.likedByMe 
                          ? 'text-rose-400 bg-rose-500/10' 
                          : 'hover:text-rose-400 hover:bg-slate-900'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-rose-400' : ''}`} />
                      <span className="font-mono text-xs">{comment.likes}</span>
                    </button>

                    <div className="text-[10px] font-mono text-slate-500">
                      Game Grinder Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Area (Col 8-12): Clean Guidance & Direct Game Launcher */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* High Score Placement Information Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#091530] to-[#070e24] border-2 border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                  <Trophy className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    High Scores &amp; Record Submissions
                  </h3>
                  <p className="text-xs text-cyan-300/90 font-mono">
                    Integrated at the bottom of each game page
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  To keep the main dashboard clean and uncluttered, all high score numbers, your personal best records, and score submissions are located <strong>directly at the bottom of each game page</strong> when you click to play!
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Click any title below → Scroll to bottom to view &amp; submit scores!</span>
                </div>
              </div>

              {/* Quick Game Click Launcher */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Click a Game to Play &amp; View High Scores:
                </span>
                <div className="space-y-2">
                  {popularGames.slice(0, 4).map(g => (
                    <button
                      key={g.id}
                      onClick={() => onPlayGame && onPlayGame(g)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={g.thumbnailUrl} alt={g.title} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {g.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {g.genre} · Certified 0% Lag
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Play &amp; Scores</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discord Quick Invite Card */}
              <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="text-xs font-bold text-white">Join Game Grinders</div>
                    <div className="text-[10px] text-slate-300 font-mono">discord.gg/gamegrinders</div>
                  </div>
                </div>

                <button
                  onClick={onOpenDiscordModal}
                  className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

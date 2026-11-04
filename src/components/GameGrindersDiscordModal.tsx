import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  MessageSquare, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Flame,
  Crown,
  Radio
} from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';

interface GameGrindersDiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameGrindersDiscordModal({ isOpen, onClose }: GameGrindersDiscordModalProps) {
  const [copied, setCopied] = useState(false);
  const DISCORD_INVITE_URL = 'https://discord.gg/gamegrinders';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(DISCORD_INVITE_URL);
    setCopied(true);
    playArcadeSfx('click');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinDiscord = () => {
    playArcadeSfx('click');
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
  };

  const channels = [
    { name: '#high-score-flex', desc: 'Post your all-time records, brag cards & speedrun runs', icon: Trophy, color: 'text-amber-400' },
    { name: '#game-grinders-chat', desc: 'Main hangout for daily gaming banter, tips & strategies', icon: MessageSquare, color: 'text-cyan-400' },
    { name: '#game-requests', desc: 'Vote and suggest which school unblocked games get added next', icon: Sparkles, color: 'text-purple-400' },
    { name: '#vip-exclusive-club', desc: 'Exclusive tactics & chatter for 500pt VIP Grinders', icon: Crown, color: 'text-yellow-400' },
    { name: '#unblocked-news', desc: 'Real-time site updates, mirror links & 0% lag announcements', icon: Radio, color: 'text-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#090d1f] border border-[#5865F2]/40 rounded-3xl shadow-2xl shadow-[#5865F2]/20 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Discord Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#5865F2]/25 via-[#3b47b8]/20 to-[#1e2354]/40 border-b border-[#5865F2]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              playArcadeSfx('click');
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#5865F2] shadow-lg shadow-[#5865F2]/40 shrink-0">
              <img src={pabloMascotImg} alt="Game Grinders Mascot" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  Game Grinders
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#5865F2] text-white font-mono text-[10px] font-bold">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs text-[#a5b4fc] mt-0.5">
                The #1 Unblocked Arcade Community &amp; High Score Flex Server
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>1,420 Online</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>8,950 Members</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Quick Invite Box */}
          <div className="p-4 rounded-2xl bg-[#060a16] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-300 truncate max-w-full">
              <span className="text-slate-500">Invite Link: </span>
              <span className="text-[#a5b4fc] font-bold">{DISCORD_INVITE_URL}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#5865F2]" />}
                <span>{copied ? 'Copied Link!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleJoinDiscord}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-all shadow-md shadow-[#5865F2]/30 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Join Discord</span>
              </button>
            </div>
          </div>

          {/* Featured Channels List */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>ACTIVE CHANNELS IN GAME GRINDERS</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div 
                    key={ch.name}
                    className="p-3 rounded-2xl bg-[#070c1a] border border-slate-800/80 flex items-start gap-3 hover:border-[#5865F2]/40 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      <Icon className={`w-4 h-4 ${ch.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                        <span>{ch.name}</span>
                        {ch.name === '#high-score-flex' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-normal">
                            HOT 🔥
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ch.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Perks */}
          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe, Moderated &amp; School-Safe</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Game Grinders is strictly moderated for respectful gaming, high-score verification, and unblocked game mirrors. Zero toxicity, friendly tournament ladders, and instant dev updates directly from Haris and Pablo!
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#070b18] border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500">
            discord.gg/gamegrinders
          </div>

          <button
            onClick={handleJoinDiscord}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#5865F2]/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Accept Invite &amp; Start Chatting</span>
          </button>
        </div>

      </div>
    </div>
  );
}

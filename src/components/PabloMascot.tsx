import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Heart, X, Fish } from 'lucide-react';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';

interface PabloMascotProps {
  onOpenHub: () => void;
  affectionLevel: number;
}

const PABLO_SPEECH_LINES = [
  "Season 1: Neon Frost Pass is live! Level up to Tier 20 for exclusive titles & themes! ❄️✨",
  "Don't forget your Daily Lucky Wheel spin today for free tokens & XP drops! 🎡🪙",
  "Hey! Haris Game Center is running with 0% lag and 100% unblocked play! 🐧⚡",
  "Got 500 Penguin Points? Unlock Slope 3D, 1v1.LOL, Escape Road & Drive Mad VIP! 👑",
  "Feeling hungry? Visit my Arcade Hub to feed me delicious Arctic Fish! 🐟",
  "Press ']' or 'Esc' anytime for our stealth teacher disguise cloak! 🤫",
  "Enjoying the games? Every play gives you +25 free Penguin Points & +50 Season XP! 🎮✨"
];

export const PabloMascot: React.FC<PabloMascotProps> = ({
  onOpenHub,
  affectionLevel
}) => {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isSpeechVisible, setIsSpeechVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLineIdx((prev) => (prev + 1) % PABLO_SPEECH_LINES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#081226]/90 border border-cyan-500/50 text-cyan-300 shadow-xl shadow-cyan-950/60 backdrop-blur-md hover:scale-105 transition-all cursor-pointer group"
        title="Open Pablo Mascot"
      >
        <span className="text-xl">🐧</span>
        <span className="text-xs font-bold font-display group-hover:text-white">Pablo Hub</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none sm:pointer-events-auto">
      {/* Speech Bubble */}
      {isSpeechVisible && (
        <div className="relative mb-2 max-w-xs p-3 rounded-2xl bg-[#091530]/95 border border-cyan-500/40 text-xs text-white shadow-xl shadow-black/60 backdrop-blur-md animate-bounce-subtle pointer-events-auto">
          <button
            onClick={() => setIsSpeechVisible(false)}
            className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
            title="Dismiss speech"
          >
            <X className="w-3 h-3" />
          </button>
          
          <p className="leading-snug pr-2 text-slate-200">
            {PABLO_SPEECH_LINES[currentLineIdx]}
          </p>
          
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-cyan-400 border-t border-cyan-500/20 pt-1">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> {affectionLevel}% Love
            </span>
            <button
              onClick={onOpenHub}
              className="text-cyan-300 hover:text-white font-bold underline cursor-pointer"
            >
              Open Hub →
            </button>
          </div>

          {/* Speech bubble arrow pointing down */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-[#091530] border-r border-b border-cyan-500/40 transform rotate-45" />
        </div>
      )}

      {/* Mascot Avatar Widget */}
      <div className="relative group pointer-events-auto flex items-center gap-2">
        <button
          onClick={onOpenHub}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 bg-slate-950 ring-4 ring-cyan-500/20 cursor-pointer"
          title="Click to visit Pablo Arcade Hub"
        >
          <img
            src={pabloMascotImg}
            alt="Pablo the Retro Penguin Emoji Mascot"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute bottom-0 inset-x-0 bg-cyan-950/90 py-0.5 text-center text-[9px] font-black text-cyan-300 uppercase tracking-wider">
            PABLO
          </div>
        </button>

        {/* Action badge */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute -top-1 -left-1 p-1 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 rounded-full text-slate-400 hover:text-white text-[10px] transition-colors"
          title="Minimize mascot"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};

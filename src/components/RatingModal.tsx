import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Check, Heart, Sparkles, MessageSquare, Mail } from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';

import { Game } from '../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
  onSaveRating?: (rating: number, review: string, gameId?: string) => void;
}

export function RatingModal({ isOpen, onClose, game, onSaveRating }: RatingModalProps) {
  const [rating, setRating] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('haris_user_rating');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const starLabels = [
    '',
    'Needs Improvement',
    'Fair Experience',
    'Good & Fun',
    'Great Game Center!',
    'Legendary Arcade Hub! 🔥'
  ];

  const availableTags = [
    '⚡ Instant Game Play',
    '🏎️ Fun Drift Physics',
    '☁️ Seamless Cloud Stream',
    '🎯 Organized Categories',
    '🎨 Clean Dark Theme',
    '📱 Responsive Controls'
  ];

  const toggleTag = (tag: string) => {
    setFeedbackTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('haris_user_rating', rating.toString());
      localStorage.setItem('haris_user_feedback', JSON.stringify({
        rating,
        feedbackTags,
        comment,
        timestamp: new Date().toISOString()
      }));
    } catch {}

    playArcadeSfx('launch');
    setIsSubmitted(true);
    if (onSaveRating) {
      onSaveRating(rating, comment, game?.id);
    }
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const activeRating = hoverRating || rating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#070e24] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden"
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {game ? `Rate ${game.title}` : 'Rate Your Experience'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm text-slate-300">
                  {game
                    ? `How many stars would you rate ${game.title}?`
                    : 'How would you rate your overall experience on Haris Game Center?'}
                </p>

                {/* 5-Star Interactive Rating Selector */}
                <div className="flex items-center justify-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= activeRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                          setRating(starVal);
                          playArcadeSfx('click');
                        }}
                        className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        aria-label={`${starVal} star rating`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                              : 'text-slate-700 hover:text-slate-500'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Rating Label */}
                <div className="h-6">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                    {starLabels[activeRating] || 'Tap to Rate'}
                  </span>
                </div>
              </div>

              {/* What did you like most? */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  What did you like most?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = feedbackTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional comments input */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Any feedback or suggestions? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or how we can make the game center even better..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tell Owner in Person via Gmail */}
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-300">
                  <span className="text-rose-300 font-bold block">Tell Website Owner in Person:</span>
                  <span className="text-slate-400">Want to email Haris directly about {game ? game.title : 'this game'}?</span>
                </div>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=harisxcode@gmail.com&su=${encodeURIComponent(`Feedback on ${game ? game.title : 'Haris Arcade'} - Direct to Owner`)}&body=${encodeURIComponent(`Hi Haris,\n\nI was reviewing ${game ? game.title : 'your arcade'} and wanted to tell you in person:\n\n`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-sm transition-colors"
                  title="Open Gmail to email website owner (Haris)"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail Owner</span>
                </a>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Submit {rating} Star Rating</span>
                </button>
              </div>
            </form>
          ) : (
            /* Celebration Success State */
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Thank You for Rating!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Your feedback helps make Haris Game Center the ultimate destination for web games.
              </p>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

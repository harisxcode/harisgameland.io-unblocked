import { useState } from 'react';
import { X, Plus, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { Game, GameCategory } from '../data/games';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

export function AddGameModal({ isOpen, onClose, onAddGame }: AddGameModalProps) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GameCategory>('arcade');
  const [playUrl, setPlayUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [directPlayOnly, setDirectPlayOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getGenreForCategory = (cat: GameCategory): Game['genre'] => {
    switch (cat) {
      case 'racing': return 'Arcade Racing';
      case 'cloud': return 'Cloud Gaming';
      case 'arcade': return 'Retro Arcade';
      case 'action': return 'Action Adventure';
      case 'casual': return 'Casual & Viral';
      case 'puzzle': return 'Puzzle & Strategy';
      case 'other': return 'Web Apps & Tools';
      default: return 'Retro Arcade';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newGame: Game = {
      id,
      title: title.trim(),
      tagline: tagline.trim() || 'Fast-paced browser game experience',
      description: description.trim() || 'Custom browser-based game created with HTML5 canvas and TypeScript.',
      genre: getGenreForCategory(category),
      category,
      status: playUrl.trim() ? 'live' : 'upcoming',
      playUrl: playUrl.trim(),
      repoUrl: repoUrl.trim() || `https://github.com/harisxcode/${id}`,
      thumbnailUrl: thumbnailUrl.trim() || '/src/assets/images/hero_gaming_center_1791725017457.jpg',
      features: ['Zero-install instant browser play', 'Responsive controls and audio feedback'],
      controls: [{ key: 'Arrows / WASD', action: 'Movement' }, { key: 'Space', action: 'Action' }],
      releaseYear: new Date().getFullYear().toString(),
      techStack: directPlayOnly ? ['Cloud Stream Engine', 'Direct Launch'] : ['HTML5 Canvas', 'TypeScript', 'GitHub Pages'],
      isFeatured: false,
      directPlayOnly,
      rating: 5.0,
      ratingCount: 1,
      playCount: 120,
      hypeAd: {
        headline: `${title.toUpperCase()} IS READY TO PLAY!`,
        badge: '🚀 COMMUNITY SPOTLIGHT',
        funPitch: description.trim() || 'Fast-paced, high-intensity browser gaming action built for instant fun!',
        hypeQuote: 'Awesome new addition to Haris Game Center—check it out!',
        reviewer: 'Game Center Community',
        ratingScore: '9.8 / 10',
        gameplayTips: ['Learn controls for best high scores', 'Compete with friends for top ranks'],
        excitementLevel: 'COMMUNITY FAVORITE'
      }
    };

    onAddGame(newGame);
    onClose();
  };

  const generatedSnippet = `{
  id: '${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'my-new-game'}',
  title: '${title || 'My New Game'}',
  tagline: '${tagline || 'Exciting browser gameplay'}',
  description: '${description || 'Game description here.'}',
  genre: '${getGenreForCategory(category)}',
  category: '${category}',
  status: '${playUrl ? 'live' : 'upcoming'}',
  playUrl: '${playUrl || 'https://haris-arcade.local/my-new-game/'}',
  repoUrl: '${repoUrl || 'https://git.harisgamecenter.com/harisxcode/my-new-game'}',
  thumbnailUrl: '${thumbnailUrl || '/src/assets/images/hero_gaming_center_1791725017457.jpg'}',
  directPlayOnly: ${directPlayOnly},
  features: ['Zero-install browser play', 'Full 60fps loop'],
  controls: [{ key: 'Space', action: 'Primary Action' }],
  releaseYear: '${new Date().getFullYear()}',
  techStack: ${directPlayOnly ? "['Cloud Engine', 'Direct Launch']" : "['HTML5 Canvas', 'TypeScript', 'GitHub Pages']"},
}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#070e22] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Register New Game to Category</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a new game cleanly to your universal categories and hub.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyber Drift 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. High-speed obstacle runner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Universal Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GameCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="racing">🏎️ Racing &amp; Driving</option>
                <option value="cloud">☁️ Cloud &amp; Streaming (now.gg)</option>
                <option value="arcade">🕹️ Arcade &amp; Retro</option>
                <option value="action">⚡ Action &amp; Platformer</option>
                <option value="casual">🎭 Casual &amp; Viral</option>
                <option value="puzzle">🧩 Puzzle &amp; Strategy</option>
                <option value="other">🌐 Other (Apps &amp; Websites)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief synopsis of gameplay mechanics..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Game Play URL *
              </label>
              <input
                type="url"
                required
                value={playUrl}
                onChange={(e) => setPlayUrl(e.target.value)}
                placeholder="https://haris-arcade.local/game/ or now.gg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Project / Host URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/harisxcode/game"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Direct Launch Checkbox (no iframe) */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200">Direct Launch Only (No Iframe)</span>
                <p className="text-[11px] text-slate-400">Recommended for cloud streamed titles like now.gg</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="directPlayOnly"
              checked={directPlayOnly}
              onChange={(e) => setDirectPlayOnly(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Thumbnail URL (Optional)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Path to thumbnail image or screenshot"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={copySnippet}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Code Snippet Copied!' : 'Copy Code Snippet'}</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Game to Hub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

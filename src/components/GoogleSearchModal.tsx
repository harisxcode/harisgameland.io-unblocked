import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Gamepad2, 
  Video, 
  Calculator as CalcIcon, 
  ShieldAlert, 
  Mic, 
  Camera, 
  ArrowRight,
  TrendingUp,
  Clock,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';

interface GoogleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerGoogleDisguise?: () => void;
  initialQuery?: string;
}

interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  category: 'all' | 'gaming' | 'school' | 'videos';
  badge?: string;
  actionText?: string;
  actionUrl?: string;
}

const DEFAULT_PRESET_RESULTS: SearchResultItem[] = [
  {
    id: 'res-slope',
    title: 'Slope 3D Unblocked - Full Speedrun Guide & High Score Cheats',
    url: 'https://www.google.com/search?q=slope+3d+unblocked+guide',
    displayUrl: 'https://harisgamecenter.com › games › slope-3d',
    snippet: 'Master the high-speed 3D tunnel runner with 0% lag. Key controls: Use A/D or Left/Right arrows for smooth lateral banking. Avoid red barriers and collect momentum multipliers.',
    category: 'gaming',
    badge: 'PRO GUIDE',
    actionText: 'Launch Game in Arcade',
    actionUrl: '#slope'
  },
  {
    id: 'res-escape-road',
    title: 'Escape Road Unblocked - Best Getaway Tactics & Vehicle Unlocks',
    url: 'https://www.google.com/search?q=escape+road+unblocked+tactics',
    displayUrl: 'https://unblockedescaperoads.com › guide',
    snippet: 'Top police evasion tricks: Drifting around building corners breaks squad car tracking. Upgrade chassis armor and turbo boost to outrun SWAT trucks and tactical roadblocks.',
    category: 'gaming',
    badge: 'WALKTHROUGH'
  },
  {
    id: 'res-retro-bowl',
    title: 'Retro Bowl College - Optimal Offense Playbook & Quarterback Stats',
    url: 'https://www.google.com/search?q=retro+bowl+college+playbook',
    displayUrl: 'https://retrobowl.school › tactics',
    snippet: 'Detailed breakdown of 5-star quarterback ratings, bullet pass trajectories, and cap management for back-to-back championship trophy runs.',
    category: 'gaming',
    badge: 'PLAYBOOK'
  },
  {
    id: 'res-calc',
    title: 'Google Online Scientific Calculator & Equation Solver',
    url: 'https://www.google.com/search?q=calculator',
    displayUrl: 'https://www.google.com › search › calculator',
    snippet: 'Use standard and scientific arithmetic operations including square roots, trigonometry (sin, cos, tan), logarithmic functions, and percentage calculations.',
    category: 'school',
    badge: 'MATH TOOL'
  },
  {
    id: 'res-history',
    title: 'Post-Classical Global Trade Networks: Maritime Silk Road & Trans-Saharan Exchange',
    url: 'https://www.google.com/search?q=trans+saharan+trade+ap+world+history',
    displayUrl: 'https://khanacademy.org › humanities › ap-world-history',
    snippet: 'Comprehensive AP World History study summary: Mali Empire gold reserves, caravanserais, astrolabes, and seasonal Indian Ocean monsoon navigation from 1200 to 1450 CE.',
    category: 'school',
    badge: 'HOMEWORK'
  },
  {
    id: 'res-pablo-charity',
    title: 'Pablo Penguin Wildlife Charity - Antarctic Conservation & Adoptions',
    url: 'https://www.google.com/search?q=pablo+penguin+wildlife+charity',
    displayUrl: 'https://harisgamecenter.com › charity › pablo-penguin',
    snippet: 'Support glacial habitat preservation, Emperor penguin nesting colony monitoring, and wildlife rescue funds. Real digital tax receipts and zero-platform fees.',
    category: 'all',
    badge: 'CHARITY'
  },
  {
    id: 'res-1v1-arena',
    title: '1v1 Arena Duel - Building Tips & Crosshair Aim Mastery',
    url: 'https://www.google.com/search?q=1v1+arena+duel+controls',
    displayUrl: 'https://harisgamecenter.com › 1v1-arena',
    snippet: 'Double ramp rushes and quick 90-degree rotations for high ground dominance. Sensitivity recommendations: 800 DPI with 0.12 in-game aiming scalar for 60 FPS accuracy.',
    category: 'gaming',
    badge: 'SPEEDRUN'
  },
  {
    id: 'res-physics',
    title: 'Gravitational Potential & Kinetic Energy Formulas (E = mgh + 0.5mv²)',
    url: 'https://www.google.com/search?q=gravitational+potential+energy+formula',
    displayUrl: 'https://physicsclassroom.com › energy-conservation',
    snippet: 'Step-by-step vector decomposition of gravitational potential energy, velocity conversions, and closed-system mechanical energy equilibrium.',
    category: 'school',
    badge: 'PHYSICS'
  }
];

const TRENDING_SEARCHES = [
  'Slope 3D unblocked cheats',
  'Retro Bowl College tricks',
  'Escape Road police evasion',
  '1v1 arena duel sensitivity',
  'Cookie Clicker optimal upgrades',
  'Google Calculator 125 * 8',
  'AP World History trade networks',
  'Pablo Penguin Wildlife Charity'
];

export function GoogleSearchModal({
  isOpen,
  onClose,
  onTriggerGoogleDisguise,
  initialQuery = ''
}: GoogleSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'gaming' | 'school' | 'videos'>('all');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [showCalculator, setShowCalculator] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Check if query is math equation or calculator trigger
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q === 'calc' || q === 'calculator' || q === 'math' || /^[\d\s+\-*/().^%]+$/.test(q)) {
      setShowCalculator(true);
      if (/^[\d\s+\-*/().^%]+$/.test(q)) {
        try {
          // Safe evaluation for basic math expression
          const sanitized = q.replace(/[^0-9+\-*/().]/g, '');
          if (sanitized && /[0-9]/.test(sanitized)) {
            // eslint-disable-next-line no-eval
            const evaluated = Function(`'use strict'; return (${sanitized})`)();
            if (typeof evaluated === 'number' && !isNaN(evaluated)) {
              setCalcDisplay(String(Math.round(evaluated * 10000) / 10000));
            }
          }
        } catch {}
      }
    } else {
      setShowCalculator(false);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleLaunchGoogleDirect = (searchStr = query) => {
    const finalQuery = searchStr.trim() || 'Haris Game Center unblocked games';
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFeelingLucky = () => {
    playArcadeSfx('launch');
    const randomSearches = [
      'Slope 3D game',
      'Escape Road unblocked',
      'Retro Bowl playbook',
      '1v1 arena duel',
      'Pablo Penguin charity'
    ];
    const picked = query.trim() || randomSearches[Math.floor(Math.random() * randomSearches.length)];
    window.open(`https://www.google.com/search?btnI=1&q=${encodeURIComponent(picked)}`, '_blank', 'noopener,noreferrer');
  };

  // Filter results
  const filteredResults = DEFAULT_PRESET_RESULTS.filter(res => {
    const matchesTab = activeTab === 'all' || res.category === activeTab;
    if (!matchesTab) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      res.title.toLowerCase().includes(q) ||
      res.snippet.toLowerCase().includes(q) ||
      res.displayUrl.toLowerCase().includes(q) ||
      (res.badge && res.badge.toLowerCase().includes(q))
    );
  });

  // Calculator buttons handler
  const handleCalcButton = (char: string) => {
    playArcadeSfx('click');
    if (char === 'C') {
      setCalcDisplay('0');
      return;
    }
    if (char === '=') {
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        const evaluated = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(Math.round(evaluated * 100000) / 100000));
      } catch {
        setCalcDisplay('Error');
      }
      return;
    }
    setCalcDisplay(prev => (prev === '0' || prev === 'Error' ? char : prev + char));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-3xl bg-[#091124] border border-blue-500/40 rounded-3xl shadow-2xl shadow-blue-950/90 overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Google Themed Header */}
        <div className="p-4 sm:p-5 bg-[#0b1530] border-b border-blue-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Google Logo */}
            <div className="flex items-center select-none text-2xl sm:text-3xl font-bold tracking-tight font-display">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="text-xs font-mono font-bold text-slate-400 ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                Search Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Full Screen Google Disguise Button */}
            {onTriggerGoogleDisguise && (
              <button
                onClick={() => {
                  playArcadeSfx('launch');
                  onClose();
                  onTriggerGoogleDisguise();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-amber-300 font-bold transition-colors cursor-pointer"
                title="Transform screen into an authentic Google Search page for school stealth"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Disguise</span>
              </button>
            )}

            <button
              onClick={() => {
                playArcadeSfx('click');
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close search dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar Input Container */}
        <div className="p-4 sm:p-6 pb-2 space-y-4 shrink-0 bg-[#070e22]">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-blue-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLaunchGoogleDirect();
                }
              }}
              placeholder="Search Google or type a question (e.g. Slope cheats, Retro Bowl guide, 45 * 12)..."
              className="w-full bg-[#0a1638] hover:bg-[#0c1c46] focus:bg-[#091538] border-2 border-blue-500/40 focus:border-blue-400 rounded-full pl-12 pr-28 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner transition-all font-medium"
            />
            
            <div className="absolute right-3.5 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleLaunchGoogleDirect()}
                className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                title="Search on Google.com"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleLaunchGoogleDirect()}
                className="p-1.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="Search with Google Lens"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLaunchGoogleDirect()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Google Search</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleFeelingLucky}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>I'm Feeling Lucky</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Press <strong>Enter</strong> to search Google</span>
              <span>•</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://www.google.com');
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'google.com'}</span>
              </button>
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Web</span>
            </button>
            <button
              onClick={() => setActiveTab('gaming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'gaming'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Gaming Guides &amp; Cheats</span>
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'school'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>School &amp; Homework</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos &amp; Speedruns</span>
            </button>
          </div>
        </div>

        {/* Scrollable Results & Tools Body */}
        <div className="p-4 sm:p-6 pt-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/30">
          
          {/* Interactive Calculator Widget (Shown if query includes math or calc) */}
          {showCalculator && (
            <div className="p-4 rounded-2xl bg-[#0b1638] border-2 border-blue-400/60 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-blue-500/30 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <CalcIcon className="w-4 h-4 text-blue-400" />
                  <span>Google Interactive Calculator</span>
                </span>
                <span className="text-blue-300">Live Math Solver</span>
              </div>

              <div className="p-3 bg-[#050b1a] rounded-xl border border-blue-500/30 text-right font-mono text-2xl font-bold text-emerald-400 tracking-wider">
                {calcDisplay}
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm font-mono font-bold">
                {['C', '(', ')', '/'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                  >
                    {btn}
                  </button>
                ))}
                {['7', '8', '9', '*'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      btn === '*' ? 'bg-slate-800 text-amber-300' : 'bg-slate-900/90 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
                {['4', '5', '6', '-'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      btn === '-' ? 'bg-slate-800 text-amber-300' : 'bg-slate-900/90 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
                {['1', '2', '3', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      btn === '+' ? 'bg-slate-800 text-amber-300' : 'bg-slate-900/90 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
                {['0', '.', '%', '='].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      btn === '=' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-900/90 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Trending Searches Suggestions */}
          {!query.trim() && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Trending Arcade Searches &amp; Guides:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(trend => (
                  <button
                    key={trend}
                    onClick={() => {
                      setQuery(trend);
                      searchInputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0a1638] hover:bg-blue-950/80 border border-blue-500/30 text-xs text-blue-200 transition-all cursor-pointer flex items-center gap-1.5 group"
                  >
                    <Search className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>{trend}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>About {filteredResults.length + 120} results (0.04 seconds)</span>
              <button
                onClick={() => handleLaunchGoogleDirect()}
                className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Google.com</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {filteredResults.length > 0 ? (
              filteredResults.map(item => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#071029]/80 hover:bg-[#091535] border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-sm space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-sm">
                      {item.displayUrl}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 
                    onClick={() => handleLaunchGoogleDirect(item.title)}
                    className="text-base font-bold text-blue-400 group-hover:text-blue-300 group-hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.snippet}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleLaunchGoogleDirect(item.title)}
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Search topic on Google</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-[#08122c] border border-slate-800 text-center space-y-3">
                <div className="text-sm font-bold text-slate-200">
                  No instant local results for "{query}"
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click below to execute this search live on Google's search engine directly with billions of web pages.
                </p>
                <button
                  onClick={() => handleLaunchGoogleDirect()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search "{query}" on Google.com</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070e22] border-t border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Google Search Engine Ready · 0% School Filter Lag</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLaunchGoogleDirect()}
              className="px-4 py-2 rounded-xl bg-[#0c1a3e] hover:bg-[#112456] border border-blue-500/40 text-blue-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Google.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

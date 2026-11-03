import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  Flame,
  Gamepad2,
  Car,
  Laugh,
  Heart,
  Clock,
  ArrowDownAZ,
  Sparkles,
  Cloud,
  BrainCircuit,
  Layers,
  Headphones,
  Trophy,
  Server
} from 'lucide-react';
import { Game } from '../data/games';

export type CategoryFilter = 'all' | 'vault' | 'recommended' | 'racing' | 'cloud' | 'arcade' | 'action' | 'casual' | 'puzzle' | 'sports' | 'other' | 'favorites' | 'upcoming';
export type SortOption = 'featured' | 'az' | 'newest';
export type ViewMode = 'shelves' | 'grid' | 'compact';

interface GameFilterControlsProps {
  games: Game[];
  favoritesCount: number;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
}

export function GameFilterControls({
  games,
  favoritesCount,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount
}: GameFilterControlsProps) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Press "/" to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories: { id: CategoryFilter; label: string; icon: typeof Gamepad2; count: number }[] = [
    { id: 'all', label: 'All Categories', icon: SlidersHorizontal, count: games.length },
    { id: 'vault', label: '🕹️ Retro & Arcade Vault (34 Games)', icon: Gamepad2, count: games.filter(g => g.serverSource === 'Haris Arcade Vault' || g.id.startsWith('gl-')).length },
    { id: 'recommended', label: '⭐ Recommended (Top Picks)', icon: Sparkles, count: games.filter(g => g.isFeatured || g.isPopular || g.rating >= 4.8).length },
    { id: 'racing', label: 'Racing & Driving', icon: Car, count: games.filter(g => g.category === 'racing').length },
    { id: 'cloud', label: 'Cloud & Streaming', icon: Cloud, count: games.filter(g => g.category === 'cloud').length },
    { id: 'arcade', label: 'Arcade & Retro', icon: Gamepad2, count: games.filter(g => g.category === 'arcade').length },
    { id: 'action', label: 'Action & Platformer', icon: Flame, count: games.filter(g => g.category === 'action').length },
    { id: 'sports', label: 'Sports & Football', icon: Trophy, count: games.filter(g => g.category === 'sports').length },
    { id: 'casual', label: 'Casual & Viral', icon: Laugh, count: games.filter(g => g.category === 'casual' || (g.category as string) === 'meme').length },
    { id: 'puzzle', label: 'Puzzle & Strategy', icon: BrainCircuit, count: games.filter(g => g.category === 'puzzle').length },
    { id: 'other', label: 'Other (Apps & Web)', icon: Headphones, count: games.filter(g => g.category === 'other').length },
    { id: 'favorites', label: 'My Favorites', icon: Heart, count: favoritesCount },
    { id: 'upcoming', label: 'In Development', icon: Clock, count: games.filter(g => g.status === 'upcoming').length }
  ];

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

  const sortLabels: Record<SortOption, { label: string; icon: typeof Flame }> = {
    featured: { label: 'Featured Order', icon: Sparkles },
    az: { label: 'Name (A to Z)', icon: ArrowDownAZ },
    newest: { label: 'Latest Release', icon: Clock }
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-4 mb-8">
      {/* Top Controls Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#081024] border border-slate-800/80 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left Side: Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search titles, universal categories, mechanics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 select-none">
                /
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Category Dropdown + Sort + View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          {/* Universal Category Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setSortDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <currentCategory.icon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[130px] sm:max-w-none">{currentCategory.label}</span>
              <span className="text-[11px] font-mono text-slate-500 ml-0.5">({currentCategory.count})</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-xl bg-[#091124] border border-slate-800 shadow-2xl py-1.5 z-30">
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-800/80 mb-1">
                  Filter by Category
                </div>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums ml-2">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setSortDropdownOpen(!sortDropdownOpen);
                setCategoryDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Sort order"
            >
              <span>{sortLabels[sortOption].label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#091124] border border-slate-800 shadow-2xl py-1.5 z-30">
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-800/80 mb-1">
                  Sort Games By
                </div>
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onSortChange(opt);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left cursor-pointer ${
                      sortOption === opt 
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold' 
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{sortLabels[opt].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3 View Modes: Category Shelves, Grid, Compact List */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => onViewModeChange('shelves')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'shelves' 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Organized by Category Shelves"
              aria-label="Category Shelves View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shelves</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid poster view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'compact' 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Compact directory list view"
              aria-label="Compact list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Active Filter Indicators & Quick Reset Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-cyan-400 font-semibold tabular-nums">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'game' : 'games'}
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Category: <strong className="text-slate-200">{currentCategory.label}</strong></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>
            Layout: <strong className="text-slate-200">
              {viewMode === 'shelves' ? 'Category Shelves' : viewMode === 'grid' ? 'Grid Cards' : 'Directory List'}
            </strong>
          </span>

          {searchQuery && (
            <>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span>Matching &ldquo;{searchQuery}&rdquo;</span>
            </>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

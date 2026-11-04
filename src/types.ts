export type GameCategory = 
  | 'racing' 
  | 'arcade' 
  | 'action' 
  | 'cloud' 
  | 'casual' 
  | 'puzzle' 
  | 'sports'
  | 'other';

export interface GameControl {
  key: string;
  action: string;
}

export interface GameHypeAd {
  headline: string;
  badge: string;
  funPitch: string;
  hypeQuote: string;
  reviewer: string;
  ratingScore: string;
  gameplayTips: string[];
  excitementLevel: string;
}

export type VipTierLevel = 'none' | 'regular' | 'gold' | 'diamond';

export interface VipTierDefinition {
  id: 'regular' | 'gold' | 'diamond';
  name: string;
  tagline: string;
  tokenCost: number; // 500, 750, 1000
  usdCost: number; // 4.99, 7.99, 11.99
  badge: string;
  icon: string;
  accentClass: string;
  borderClass: string;
  bgGradient: string;
  textClass: string;
  unlockedGameNames: string[];
  unlockedTitles: string[];
  unlockedAvatars: string[];
  unlockedSnackNames: string[];
  perks: string[];
}

export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genre: string;
  category: GameCategory;
  status: 'live' | 'upcoming';
  playUrl: string;
  repoUrl: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  features: string[];
  controls: GameControl[];
  releaseYear: string;
  techStack: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isVipExclusive?: boolean;
  vipTierRequired?: 'regular' | 'gold' | 'diamond';
  vipRequirement?: {
    points: number; // 500, 750, 1000
    priceUsd: number; // 4.99, 7.99, 11.99
  };
  rating: number; // 4.8
  ratingCount: number; // 1240
  playCount: number; // 184500
  directPlayOnly?: boolean;
  isExternal?: boolean;
  iframeUrl?: string;
  builtInHtml?: string;
  hypeAd?: GameHypeAd;
  highScoreUnit?: string; // 'm', 'pts', 'cookies', 'wins', '%', etc.
  serverSource?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  penguinPoints: number;
  isVip: boolean;
  vipTier?: VipTierLevel;
  activeTitle?: string;
  unlockedTitles?: string[];
  unlockedAvatars?: string[];
  vipActivatedAt?: string;
  createdAt: string;
  lastLogin: string;
  gamesPlayedCount: number;
  favoriteGameIds: string[];
  snacksFedCount: number;
  pabloAffection: number; // 0 to 100
  inventory: {
    snackId: string;
    quantity: number;
  }[];
  isAdmin?: boolean;
  // Season Pass & Progression
  seasonPassXp?: number;
  hasSeasonPassPremium?: boolean;
  claimedFreeTiers?: number[];
  claimedPremiumTiers?: number[];
  lastDailySpinAt?: string | null;
  dailySpinStreak?: number;
  equippedBorderTheme?: string;
  unlockedBorderThemes?: string[];
  questProgress?: Record<string, number>;
  completedQuestIds?: string[];
}

export interface PenguinSnack {
  id: string;
  name: string;
  cost: number;
  icon: string;
  affectionBoost: number;
  description: string;
  tasteReaction: string;
  vipTierRequired?: 'regular' | 'gold' | 'diamond';
}

export interface PabloTip {
  id: string;
  title: string;
  text: string;
  highlight: string;
  category: 'performance' | 'unblocked' | 'pro-tip';
}

export interface PabloJoke {
  id: string;
  setup: string;
  punchline: string;
}

export type DisguiseType = 'google_docs' | 'wikipedia' | 'canvas_lms' | 'calculator';

export interface StealthConfig {
  isActive: boolean;
  disguiseType: DisguiseType;
  panicKey: string;
}

export interface GameHighScore {
  gameId: string;
  gameTitle: string;
  score: number;
  unit: string;
  playerUsername: string;
  playerAvatar: string;
  achievedAt: string;
  formattedScore: string;
}

export interface ChatComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  gameId?: string;
  gameTitle?: string;
  highScoreBadge?: string;
  isVip?: boolean;
  likes: number;
  likedByMe?: boolean;
  pinned?: boolean;
}

export type SeasonRewardType = 'tokens' | 'title' | 'avatar' | 'snack' | 'theme';

export interface SeasonRewardItem {
  type: SeasonRewardType;
  value: string | number;
  title: string;
  icon: string;
  description: string;
  highlight?: boolean;
}

export interface SeasonPassRewardTier {
  tier: number;
  xpRequired: number;
  freeReward: SeasonRewardItem;
  premiumReward: SeasonRewardItem;
}

export interface SeasonQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetCount: number;
  xpReward: number;
  tokenReward: number;
  category: 'daily' | 'seasonal';
  progressKey: string;
}

export interface DailySpinSlice {
  id: string;
  title: string;
  icon: string;
  type: 'tokens' | 'xp' | 'snack' | 'title';
  value: number | string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  color: string;
}



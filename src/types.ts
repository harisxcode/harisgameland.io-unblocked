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
  vipRequirement?: {
    points: number; // 500
    priceUsd: number; // 5.00
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
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  penguinPoints: number;
  isVip: boolean;
  vipTier?: 'Gold' | 'Platinum' | 'Diamond';
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
}

export interface PenguinSnack {
  id: string;
  name: string;
  cost: number;
  icon: string;
  affectionBoost: number;
  description: string;
  tasteReaction: string;
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


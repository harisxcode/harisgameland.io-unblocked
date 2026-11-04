import { 
  UserAccount, 
  SeasonPassRewardTier, 
  SeasonRewardItem, 
  SeasonQuest, 
  DailySpinSlice,
  PenguinSnack
} from '../types';
import { getActiveUser, setActiveUser } from './auth';

export const SEASON_CONFIG = {
  seasonNumber: 1,
  title: 'Season 1: Neon Frost Pass',
  subtitle: 'Cyber Arctic Winter Arcade Championship',
  badge: '❄️ SEASON 1',
  endDate: '2026-12-05T00:00:00Z',
  xpPerTier: 150,
  maxTiers: 20,
  premiumCostTokens: 400,
  premiumCostUsd: 3.99,
  tierSkipCostTokens: 50
};

export interface BorderTheme {
  id: string;
  name: string;
  tagline: string;
  className: string;
  borderStyle: string;
  previewGradient: string;
  vipOrPassReward: boolean;
}

export const ARCADE_BORDER_THEMES: Record<string, BorderTheme> = {
  default: {
    id: 'default',
    name: 'Cyber Slate',
    tagline: 'Standard Arcade Terminal',
    className: 'border-slate-800 shadow-slate-900/50',
    borderStyle: 'border-slate-800',
    previewGradient: 'from-slate-900 to-slate-950',
    vipOrPassReward: false
  },
  cyber_cyan: {
    id: 'cyber_cyan',
    name: 'Cyber Cyan Bloom',
    tagline: 'High-frequency neon laser glow',
    className: 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-cyan-500/30',
    borderStyle: 'border-cyan-400',
    previewGradient: 'from-cyan-950 to-slate-950',
    vipOrPassReward: true
  },
  synthwave_pink: {
    id: 'synthwave_pink',
    name: 'Neon Synthwave',
    tagline: 'Hot magenta and violet retro grid',
    className: 'border-pink-500 shadow-[0_0_22px_rgba(236,72,153,0.45)] ring-1 ring-pink-500/30',
    borderStyle: 'border-pink-500',
    previewGradient: 'from-fuchsia-950 to-slate-950',
    vipOrPassReward: true
  },
  frozen_emerald: {
    id: 'frozen_emerald',
    name: 'Frozen Emerald',
    tagline: 'Glacial green crystal matrix',
    className: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] ring-1 ring-emerald-500/30',
    borderStyle: 'border-emerald-400',
    previewGradient: 'from-emerald-950 to-slate-950',
    vipOrPassReward: true
  },
  golden_arcade: {
    id: 'golden_arcade',
    name: 'Golden Champion',
    tagline: 'Pure arcade royalty radiance',
    className: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] ring-1 ring-amber-400/40',
    borderStyle: 'border-amber-400',
    previewGradient: 'from-amber-950 to-slate-950',
    vipOrPassReward: true
  }
};

export const SEASON_PASS_REWARD_TIERS: SeasonPassRewardTier[] = [
  {
    tier: 1,
    xpRequired: 150,
    freeReward: {
      type: 'tokens',
      value: 50,
      title: '+50 Penguin Points',
      icon: '🪙',
      description: 'Quick booster to kickstart your Season 1 run.'
    },
    premiumReward: {
      type: 'title',
      value: 'Frost Cadet',
      title: 'Title: Frost Cadet',
      icon: '❄️',
      description: 'Exclusive Season 1 starter badge flair.',
      highlight: true
    }
  },
  {
    tier: 2,
    xpRequired: 300,
    freeReward: {
      type: 'snack',
      value: 'snack-fish',
      title: '2x Arctic Silver Fish',
      icon: '🐟',
      description: 'Pablo loves fresh fish! +16 Affection total.'
    },
    premiumReward: {
      type: 'tokens',
      value: 100,
      title: '+100 Penguin Points',
      icon: '🪙',
      description: 'Double point payload for VIP grinders.'
    }
  },
  {
    tier: 3,
    xpRequired: 450,
    freeReward: {
      type: 'tokens',
      value: 40,
      title: '+40 Penguin Points',
      icon: '🪙',
      description: 'Feed Pablo or save up for VIP tiers.'
    },
    premiumReward: {
      type: 'snack',
      value: 'snack-popsicle',
      title: 'Glacier Popsicle',
      icon: '🍧',
      description: 'Seasonal treat! Pablo squawks with joy (+35 Affection).',
      highlight: true
    }
  },
  {
    tier: 4,
    xpRequired: 600,
    freeReward: {
      type: 'avatar',
      value: '🧊',
      title: 'Ice Block Avatar',
      icon: '🧊',
      description: 'Equip the chilled sub-zero player avatar.'
    },
    premiumReward: {
      type: 'title',
      value: 'Neon Drift',
      title: 'Title: Neon Drift',
      icon: '🏎️',
      description: 'High-speed arcade prestige title.'
    }
  },
  {
    tier: 5,
    xpRequired: 750,
    freeReward: {
      type: 'tokens',
      value: 75,
      title: '+75 Penguin Points',
      icon: '🪙',
      description: 'Solid bank deposit for unlocking VIP games.'
    },
    premiumReward: {
      type: 'theme',
      value: 'cyber_cyan',
      title: 'Theme: Cyber Cyan Bloom',
      icon: '💠',
      description: 'Laser-cyan border glow across your games & hub!',
      highlight: true
    }
  },
  {
    tier: 6,
    xpRequired: 900,
    freeReward: {
      type: 'snack',
      value: 'snack-shrimp',
      title: 'Antarctic Krill Basket',
      icon: '🦐',
      description: 'Crispy protein snack for Pablo (+18 Affection).'
    },
    premiumReward: {
      type: 'tokens',
      value: 120,
      title: '+120 Penguin Points',
      icon: '🪙',
      description: 'Massive token drop to keep your streak hot.'
    }
  },
  {
    tier: 7,
    xpRequired: 1050,
    freeReward: {
      type: 'title',
      value: 'Sub-Zero',
      title: 'Title: Sub-Zero',
      icon: '❄️',
      description: 'For players that keep their cool in Clutch 1v1s.'
    },
    premiumReward: {
      type: 'avatar',
      value: '🐧⚡',
      title: 'Cyber Penguin Avatar',
      icon: '🐧⚡',
      description: 'Overclocked Pablo-style cyber mascot avatar.',
      highlight: true
    }
  },
  {
    tier: 8,
    xpRequired: 1200,
    freeReward: {
      type: 'tokens',
      value: 60,
      title: '+60 Penguin Points',
      icon: '🪙',
      description: 'Steady progression bonus.'
    },
    premiumReward: {
      type: 'snack',
      value: 'snack-sundae',
      title: 'Frozen Krill Sundae',
      icon: '🍨',
      description: 'Deluxe multi-flavor arctic delight (+60 Affection).',
      highlight: true
    }
  },
  {
    tier: 9,
    xpRequired: 1350,
    freeReward: {
      type: 'avatar',
      value: '⛄',
      title: 'Frost Golem Avatar',
      icon: '⛄',
      description: 'Friendly winter snowman icon.'
    },
    premiumReward: {
      type: 'tokens',
      value: 150,
      title: '+150 Penguin Points',
      icon: '🪙',
      description: 'High-roller funding for arcade supremacy.'
    }
  },
  {
    tier: 10,
    xpRequired: 1500,
    freeReward: {
      type: 'tokens',
      value: 100,
      title: '+100 Penguin Points',
      icon: '🪙',
      description: 'Milestone halfway cache!'
    },
    premiumReward: {
      type: 'theme',
      value: 'synthwave_pink',
      title: 'Theme: Neon Synthwave',
      icon: '🌆',
      description: 'Radical 80s outrun magenta border frame!',
      highlight: true
    }
  },
  {
    tier: 11,
    xpRequired: 1650,
    freeReward: {
      type: 'snack',
      value: 'snack-sprats',
      title: 'Gourmet Glacial Sprats',
      icon: '🐟',
      description: 'Tender ocean fish caught under the polar ice cap.'
    },
    premiumReward: {
      type: 'tokens',
      value: 160,
      title: '+160 Penguin Points',
      icon: '🪙',
      description: 'Premium token drop.'
    }
  },
  {
    tier: 12,
    xpRequired: 1800,
    freeReward: {
      type: 'avatar',
      value: '🎮💎',
      title: 'Diamond Controller Avatar',
      icon: '🎮💎',
      description: 'Showcase that you never drop frames.'
    },
    premiumReward: {
      type: 'title',
      value: 'Glacial Shaman',
      title: 'Title: Glacial Shaman',
      icon: '🔮',
      description: 'Master of arctic elements and 0-lag runs.',
      highlight: true
    }
  },
  {
    tier: 13,
    xpRequired: 1950,
    freeReward: {
      type: 'tokens',
      value: 80,
      title: '+80 Penguin Points',
      icon: '🪙',
      description: 'Points for snacks and VIP upgrades.'
    },
    premiumReward: {
      type: 'title',
      value: 'Zero-Lag Phantom',
      title: 'Title: Zero-Lag Phantom',
      icon: '👻',
      description: 'Untouchable speedrun king.'
    }
  },
  {
    tier: 14,
    xpRequired: 2100,
    freeReward: {
      type: 'snack',
      value: 'snack-salmon',
      title: 'Golden Glazed Salmon',
      icon: '🍣',
      description: 'Honey-marinated wild catch (+55 Affection).'
    },
    premiumReward: {
      type: 'tokens',
      value: 200,
      title: '+200 Penguin Points',
      icon: '🪙',
      description: 'Huge points bounty for the endgame stretch.'
    }
  },
  {
    tier: 15,
    xpRequired: 2250,
    freeReward: {
      type: 'tokens',
      value: 120,
      title: '+120 Penguin Points',
      icon: '🪙',
      description: 'Deep tier bonus.'
    },
    premiumReward: {
      type: 'theme',
      value: 'frozen_emerald',
      title: 'Theme: Frozen Emerald',
      icon: '❇️',
      description: 'Rare crystal green frame for Chromebook screens.',
      highlight: true
    }
  },
  {
    tier: 16,
    xpRequired: 2400,
    freeReward: {
      type: 'title',
      value: 'Blizzard Born',
      title: 'Title: Blizzard Born',
      icon: '🌨️',
      description: 'Tempered by the fiercest arctic storms.'
    },
    premiumReward: {
      type: 'avatar',
      value: '🛸',
      title: 'Alien Invader Avatar',
      icon: '🛸',
      description: 'Retro extraterrestrial space fighter.'
    }
  },
  {
    tier: 17,
    xpRequired: 2550,
    freeReward: {
      type: 'tokens',
      value: 140,
      title: '+140 Penguin Points',
      icon: '🪙',
      description: 'Massive endgame token bundle.'
    },
    premiumReward: {
      type: 'snack',
      value: 'snack-caviar',
      title: 'Diamond Caviar Frost',
      icon: '🍱',
      description: 'The pinnacle of luxury cuisine for Pablo (+100 Affection).',
      highlight: true
    }
  },
  {
    tier: 18,
    xpRequired: 2700,
    freeReward: {
      type: 'avatar',
      value: '🥷',
      title: 'Stealth Ninja Avatar',
      icon: '🥷',
      description: 'For master stealth Chromebook operatives.'
    },
    premiumReward: {
      type: 'tokens',
      value: 250,
      title: '+250 Penguin Points',
      icon: '🪙',
      description: 'Elite treasury drop.'
    }
  },
  {
    tier: 19,
    xpRequired: 2850,
    freeReward: {
      type: 'tokens',
      value: 150,
      title: '+150 Penguin Points',
      icon: '🪙',
      description: 'One step away from ultimate championship.'
    },
    premiumReward: {
      type: 'title',
      value: 'Cyber Warlord',
      title: 'Title: Cyber Warlord',
      icon: '⚔️',
      description: 'Ruler of the leaderboard and speedrun circuits.'
    }
  },
  {
    tier: 20,
    xpRequired: 3000,
    freeReward: {
      type: 'title',
      value: 'Apex Frost Legend',
      title: 'Title: Apex Frost Legend (+200 Pts)',
      icon: '🏆',
      description: 'Complete Free Season 1 pass mastery badge!'
    },
    premiumReward: {
      type: 'theme',
      value: 'golden_arcade',
      title: 'Grand Prize: Golden Champion (+500 Pts & Crown Avatar)',
      icon: '👑⭐',
      description: 'Supreme Golden Border + "Emperor of the Arctic" Title + 👑 Avatar + 500 Pts!',
      highlight: true
    }
  }
];

export const DAILY_QUESTS: SeasonQuest[] = [
  {
    id: 'quest-play-2',
    title: 'Arcade Warmup',
    description: 'Play any 2 games today on Haris Game Center',
    icon: '🎮',
    targetCount: 2,
    xpReward: 150,
    tokenReward: 30,
    category: 'daily',
    progressKey: 'daily_games_played'
  },
  {
    id: 'quest-retro-intro',
    title: 'Retro Nostalgia',
    description: "Launch a retro game or watch the Pablo Arcade Retro Intro",
    icon: '📼',
    targetCount: 1,
    xpReward: 200,
    tokenReward: 35,
    category: 'daily',
    progressKey: 'daily_retro_intro'
  },
  {
    id: 'quest-feed-pablo',
    title: 'Hungry Mascot',
    description: 'Feed Pablo the Penguin any delicious snack in the Arcade Hub',
    icon: '🐟',
    targetCount: 1,
    xpReward: 150,
    tokenReward: 25,
    category: 'daily',
    progressKey: 'daily_pablo_feed'
  },
  {
    id: 'quest-high-score',
    title: 'Bragging Rights',
    description: 'Submit or share a personal high score or post a game comment',
    icon: '🏅',
    targetCount: 1,
    xpReward: 220,
    tokenReward: 40,
    category: 'daily',
    progressKey: 'daily_score_shared'
  },
  {
    id: 'quest-daily-spin',
    title: 'Wheel of Fortune',
    description: 'Spin the Daily Lucky Wheel for tokens and seasonal prizes',
    icon: '🎡',
    targetCount: 1,
    xpReward: 100,
    tokenReward: 20,
    category: 'daily',
    progressKey: 'daily_wheel_spun'
  }
];

export const SEASONAL_MILESTONES: SeasonQuest[] = [
  {
    id: 'milestone-play-15',
    title: 'Marathon Grinder',
    description: 'Complete 15 total game sessions during Season 1',
    icon: '⚡',
    targetCount: 15,
    xpReward: 500,
    tokenReward: 120,
    category: 'seasonal',
    progressKey: 'season_games_played'
  },
  {
    id: 'milestone-feed-5',
    title: 'Penguin Whisperer',
    description: 'Feed Pablo 5 snacks to raise his affection level',
    icon: '💖',
    targetCount: 5,
    xpReward: 450,
    tokenReward: 100,
    category: 'seasonal',
    progressKey: 'season_pablo_feed'
  },
  {
    id: 'milestone-fav-3',
    title: 'Curator',
    description: 'Add 3 or more games to your favorites shelf',
    icon: '⭐',
    targetCount: 3,
    xpReward: 350,
    tokenReward: 75,
    category: 'seasonal',
    progressKey: 'season_favorites_added'
  }
];

export const DAILY_SPIN_SLICES: DailySpinSlice[] = [
  {
    id: 'spin-50-pts',
    title: '+50 Tokens',
    icon: '🪙',
    type: 'tokens',
    value: 50,
    rarity: 'common',
    color: '#0284c7' // sky-600
  },
  {
    id: 'spin-100-xp',
    title: '+100 Season XP',
    icon: '❄️',
    type: 'xp',
    value: 100,
    rarity: 'common',
    color: '#059669' // emerald-600
  },
  {
    id: 'spin-100-pts',
    title: '+100 Tokens',
    icon: '🪙',
    type: 'tokens',
    value: 100,
    rarity: 'uncommon',
    color: '#7c3aed' // purple-600
  },
  {
    id: 'spin-fish',
    title: 'Silver Fish Snack',
    icon: '🐟',
    type: 'snack',
    value: 'snack-fish',
    rarity: 'common',
    color: '#0891b2' // cyan-600
  },
  {
    id: 'spin-250-xp',
    title: '+250 Season XP',
    icon: '⚡',
    type: 'xp',
    value: 250,
    rarity: 'uncommon',
    color: '#2563eb' // blue-600
  },
  {
    id: 'spin-200-pts',
    title: '+200 Tokens',
    icon: '🪙',
    type: 'tokens',
    value: 200,
    rarity: 'rare',
    color: '#ea580c' // orange-600
  },
  {
    id: 'spin-popsicle',
    title: 'Glacier Popsicle',
    icon: '🍧',
    type: 'snack',
    value: 'snack-popsicle',
    rarity: 'rare',
    color: '#db2777' // pink-600
  },
  {
    id: 'spin-jackpot',
    title: '💎 500 PTS JACKPOT',
    icon: '👑',
    type: 'tokens',
    value: 500,
    rarity: 'legendary',
    color: '#d97706' // amber-600
  }
];

// Helper: Ensure user has default progression objects initialized
export function ensureUserProgression(user: UserAccount): UserAccount {
  const updated = { ...user };
  if (typeof updated.seasonPassXp !== 'number') updated.seasonPassXp = 0;
  if (!Array.isArray(updated.claimedFreeTiers)) updated.claimedFreeTiers = [];
  if (!Array.isArray(updated.claimedPremiumTiers)) updated.claimedPremiumTiers = [];
  if (!updated.questProgress) updated.questProgress = {};
  if (!Array.isArray(updated.completedQuestIds)) updated.completedQuestIds = [];
  if (!Array.isArray(updated.unlockedBorderThemes)) updated.unlockedBorderThemes = ['default'];
  if (!updated.equippedBorderTheme) updated.equippedBorderTheme = 'default';
  if (typeof updated.dailySpinStreak !== 'number') updated.dailySpinStreak = 1;

  // Gold or Diamond VIP users automatically receive free Premium Season Pass!
  if (updated.vipTier === 'gold' || updated.vipTier === 'diamond' || updated.isAdmin) {
    updated.hasSeasonPassPremium = true;
  }

  return updated;
}

// Calculate user's current tier based on total Season XP
export function calculateTier(totalXp: number): {
  currentTier: number;
  xpInCurrentTier: number;
  xpNeededForNextTier: number;
  progressPercent: number;
  isMaxTier: boolean;
} {
  const xpPerTier = SEASON_CONFIG.xpPerTier;
  const currentTier = Math.min(SEASON_CONFIG.maxTiers, Math.floor(totalXp / xpPerTier));
  const isMaxTier = currentTier >= SEASON_CONFIG.maxTiers;
  const xpInCurrentTier = isMaxTier ? xpPerTier : (totalXp % xpPerTier);
  const xpNeededForNextTier = xpPerTier;
  const progressPercent = isMaxTier ? 100 : Math.round((xpInCurrentTier / xpPerTier) * 100);

  return {
    currentTier,
    xpInCurrentTier,
    xpNeededForNextTier,
    progressPercent,
    isMaxTier
  };
}

// Award Season XP (e.g. from playing games, quests, spins)
export function awardSeasonXp(amount: number, reason: string = 'Game Run'): {
  user: UserAccount;
  leveledUp: boolean;
  oldTier: number;
  newTier: number;
} {
  let user = getActiveUser();
  if (!user) {
    throw new Error('No active user logged in');
  }
  user = ensureUserProgression(user);
  const oldTier = calculateTier(user.seasonPassXp || 0).currentTier;

  user.seasonPassXp = (user.seasonPassXp || 0) + amount;
  const newTier = calculateTier(user.seasonPassXp).currentTier;
  const leveledUp = newTier > oldTier;

  setActiveUser(user);
  return {
    user,
    leveledUp,
    oldTier,
    newTier
  };
}

// Unlock Premium Pass with Penguin Points
export function unlockSeasonPassPremium(): {
  success: boolean;
  message: string;
  user?: UserAccount;
} {
  let user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in to unlock the Season Pass!' };
  }
  user = ensureUserProgression(user);

  if (user.hasSeasonPassPremium) {
    return { success: true, message: 'You already own the Season 1 Premium Pass!', user };
  }

  const cost = SEASON_CONFIG.premiumCostTokens;
  if ((user.penguinPoints || 0) < cost) {
    return {
      success: false,
      message: `Need ${cost} Penguin Points for Premium Pass. You have ${user.penguinPoints || 0} pts.`
    };
  }

  user.penguinPoints = (user.penguinPoints || 0) - cost;
  user.hasSeasonPassPremium = true;

  // Add instant bonus title
  const titles = new Set(user.unlockedTitles || []);
  titles.add('Frost Hunter');
  user.unlockedTitles = Array.from(titles);

  setActiveUser(user);
  return {
    success: true,
    message: '🎉 Congratulations! Season 1: Neon Frost Premium Pass is UNLOCKED!',
    user
  };
}

// Claim a specific tier reward
export function claimSeasonReward(tierNum: number, isPremium: boolean): {
  success: boolean;
  message: string;
  user?: UserAccount;
  reward?: SeasonRewardItem;
} {
  let user = getActiveUser();
  if (!user) return { success: false, message: 'Sign in to claim rewards.' };
  user = ensureUserProgression(user);

  const tierInfo = calculateTier(user.seasonPassXp || 0);
  if (tierInfo.currentTier < tierNum) {
    return {
      success: false,
      message: `Tier ${tierNum} is locked. You need ${tierNum * SEASON_CONFIG.xpPerTier - (user.seasonPassXp || 0)} more XP!`
    };
  }

  const tierConfig = SEASON_PASS_REWARD_TIERS.find(t => t.tier === tierNum);
  if (!tierConfig) return { success: false, message: 'Invalid reward tier.' };

  if (isPremium) {
    if (!user.hasSeasonPassPremium) {
      return { success: false, message: 'Upgrade to Season 1 Premium Pass to claim this row!' };
    }
    if ((user.claimedPremiumTiers || []).includes(tierNum)) {
      return { success: false, message: `Tier ${tierNum} Premium reward already claimed.` };
    }
    user.claimedPremiumTiers = [...(user.claimedPremiumTiers || []), tierNum];
    applyRewardItem(user, tierConfig.premiumReward);
    setActiveUser(user);
    return {
      success: true,
      message: `Claimed Tier ${tierNum} Premium: ${tierConfig.premiumReward.title}!`,
      user,
      reward: tierConfig.premiumReward
    };
  } else {
    if ((user.claimedFreeTiers || []).includes(tierNum)) {
      return { success: false, message: `Tier ${tierNum} Free reward already claimed.` };
    }
    user.claimedFreeTiers = [...(user.claimedFreeTiers || []), tierNum];
    applyRewardItem(user, tierConfig.freeReward);
    setActiveUser(user);
    return {
      success: true,
      message: `Claimed Tier ${tierNum} Free: ${tierConfig.freeReward.title}!`,
      user,
      reward: tierConfig.freeReward
    };
  }
}

// Internal helper to apply reward item to user inventory/profile
function applyRewardItem(user: UserAccount, item: SeasonRewardItem) {
  if (item.type === 'tokens') {
    user.penguinPoints = (user.penguinPoints || 0) + (typeof item.value === 'number' ? item.value : parseInt(item.value, 10));
  } else if (item.type === 'title') {
    const titles = new Set(user.unlockedTitles || ['Arcade Challenger']);
    titles.add(String(item.value));
    user.unlockedTitles = Array.from(titles);
  } else if (item.type === 'avatar') {
    const avatars = new Set(user.unlockedAvatars || ['🐧']);
    avatars.add(String(item.value));
    user.unlockedAvatars = Array.from(avatars);
  } else if (item.type === 'theme') {
    const themes = new Set(user.unlockedBorderThemes || ['default']);
    themes.add(String(item.value));
    user.unlockedBorderThemes = Array.from(themes);
  } else if (item.type === 'snack') {
    const snackId = String(item.value);
    const existing = (user.inventory || []).find(i => i.snackId === snackId);
    if (existing) {
      existing.quantity += 1;
    } else {
      user.inventory = [...(user.inventory || []), { snackId, quantity: 1 }];
    }
  }
}

// Claim all available unlocked rewards at once
export function claimAllAvailableSeasonRewards(): {
  success: boolean;
  message: string;
  user?: UserAccount;
  claimedCount: number;
} {
  let user = getActiveUser();
  if (!user) return { success: false, message: 'Please sign in first.', claimedCount: 0 };
  user = ensureUserProgression(user);

  const { currentTier } = calculateTier(user.seasonPassXp || 0);
  let claimedCount = 0;

  for (let t = 1; t <= currentTier; t++) {
    const tierConfig = SEASON_PASS_REWARD_TIERS.find(r => r.tier === t);
    if (!tierConfig) continue;

    // Free track
    if (!user.claimedFreeTiers?.includes(t)) {
      user.claimedFreeTiers = [...(user.claimedFreeTiers || []), t];
      applyRewardItem(user, tierConfig.freeReward);
      claimedCount++;
    }

    // Premium track
    if (user.hasSeasonPassPremium && !user.claimedPremiumTiers?.includes(t)) {
      user.claimedPremiumTiers = [...(user.claimedPremiumTiers || []), t];
      applyRewardItem(user, tierConfig.premiumReward);
      claimedCount++;
    }
  }

  if (claimedCount === 0) {
    return { success: false, message: 'No new rewards ready to claim yet!', user, claimedCount: 0 };
  }

  setActiveUser(user);
  return {
    success: true,
    message: `🎉 Claimed ${claimedCount} Season 1 rewards! Check your points & locker!`,
    user,
    claimedCount
  };
}

// Skip 1 Tier with Penguin Points
export function skipSeasonTier(): {
  success: boolean;
  message: string;
  user?: UserAccount;
} {
  let user = getActiveUser();
  if (!user) return { success: false, message: 'Please sign in first.' };
  user = ensureUserProgression(user);

  const cost = SEASON_CONFIG.tierSkipCostTokens;
  if ((user.penguinPoints || 0) < cost) {
    return {
      success: false,
      message: `Need ${cost} Penguin Points to skip a tier. You have ${user.penguinPoints || 0} pts.`
    };
  }

  const { isMaxTier } = calculateTier(user.seasonPassXp || 0);
  if (isMaxTier) {
    return { success: false, message: 'You have already reached the maximum Season Tier (20)!' };
  }

  user.penguinPoints = (user.penguinPoints || 0) - cost;
  user.seasonPassXp = (user.seasonPassXp || 0) + SEASON_CONFIG.xpPerTier;
  setActiveUser(user);

  return {
    success: true,
    message: `⚡ Skipped +1 Tier for ${cost} Penguin Points!`,
    user
  };
}

// Track quest progress & automatically award when target is reached
export function recordQuestAction(actionKey: string, amount: number = 1): {
  user: UserAccount;
  completedQuests: SeasonQuest[];
} {
  let user = getActiveUser();
  if (!user) {
    throw new Error('No user signed in');
  }
  user = ensureUserProgression(user);

  const allQuests = [...DAILY_QUESTS, ...SEASONAL_MILESTONES];
  const matchingQuests = allQuests.filter(q => q.progressKey === actionKey);
  const completedNow: SeasonQuest[] = [];

  matchingQuests.forEach(quest => {
    if (user.completedQuestIds?.includes(quest.id)) return; // already completed

    const currentCount = (user.questProgress?.[quest.progressKey] || 0) + amount;
    user.questProgress = {
      ...(user.questProgress || {}),
      [quest.progressKey]: currentCount
    };

    if (currentCount >= quest.targetCount) {
      // Completed quest!
      user.completedQuestIds = [...(user.completedQuestIds || []), quest.id];
      user.seasonPassXp = (user.seasonPassXp || 0) + quest.xpReward;
      user.penguinPoints = (user.penguinPoints || 0) + quest.tokenReward;
      completedNow.push(quest);
    }
  });

  setActiveUser(user);
  return { user, completedQuests: completedNow };
}

// Daily Spin Eligibility Check
export function checkDailySpinStatus(user: UserAccount | null): {
  canSpinFree: boolean;
  canSpinWithTokens: boolean;
  timeLeftMs: number;
  streak: number;
} {
  if (!user) {
    return { canSpinFree: false, canSpinWithTokens: false, timeLeftMs: 0, streak: 0 };
  }
  const u = ensureUserProgression(user);
  const lastSpin = u.lastDailySpinAt ? new Date(u.lastDailySpinAt).getTime() : 0;
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const diff = now - lastSpin;

  const canSpinFree = diff >= ONE_DAY_MS;
  const timeLeftMs = canSpinFree ? 0 : ONE_DAY_MS - diff;
  const canSpinWithTokens = (u.penguinPoints || 0) >= 15;

  return {
    canSpinFree,
    canSpinWithTokens,
    timeLeftMs,
    streak: u.dailySpinStreak || 1
  };
}

// Execute spin
export function executeDailySpin(useTokens: boolean = false): {
  success: boolean;
  message: string;
  slice?: DailySpinSlice;
  sliceIndex?: number;
  user?: UserAccount;
} {
  let user = getActiveUser();
  if (!user) return { success: false, message: 'Please sign in to spin the wheel!' };
  user = ensureUserProgression(user);

  const status = checkDailySpinStatus(user);
  if (!status.canSpinFree && !useTokens) {
    return {
      success: false,
      message: 'Free spin on cooldown. You can spin again for 15 Penguin Points!'
    };
  }

  if (useTokens) {
    if ((user.penguinPoints || 0) < 15) {
      return { success: false, message: 'Need 15 Penguin Points to re-spin the wheel!' };
    }
    user.penguinPoints = (user.penguinPoints || 0) - 15;
  } else {
    user.lastDailySpinAt = new Date().toISOString();
    user.dailySpinStreak = (user.dailySpinStreak || 1) + 1;
  }

  // Weighted random pick
  const randomIndex = Math.floor(Math.random() * DAILY_SPIN_SLICES.length);
  const pickedSlice = DAILY_SPIN_SLICES[randomIndex];

  // Apply prize
  if (pickedSlice.type === 'tokens') {
    user.penguinPoints = (user.penguinPoints || 0) + Number(pickedSlice.value);
  } else if (pickedSlice.type === 'xp') {
    user.seasonPassXp = (user.seasonPassXp || 0) + Number(pickedSlice.value);
  } else if (pickedSlice.type === 'snack') {
    const snackId = String(pickedSlice.value);
    const existing = (user.inventory || []).find(i => i.snackId === snackId);
    if (existing) {
      existing.quantity += 1;
    } else {
      user.inventory = [...(user.inventory || []), { snackId, quantity: 1 }];
    }
  }

  // Record quest action
  const questResult = recordQuestAction('daily_wheel_spun', 1);
  user = questResult.user;

  setActiveUser(user);
  return {
    success: true,
    message: `You won ${pickedSlice.title}!`,
    slice: pickedSlice,
    sliceIndex: randomIndex,
    user
  };
}

// Equip Border Theme
export function equipBorderTheme(themeId: string): UserAccount {
  let user = getActiveUser();
  if (!user) throw new Error('No user logged in');
  user = ensureUserProgression(user);
  user.equippedBorderTheme = themeId;
  setActiveUser(user);
  return user;
}

// Equip Player Title
export function equipTitle(title: string): UserAccount {
  let user = getActiveUser();
  if (!user) throw new Error('No user logged in');
  user = ensureUserProgression(user);
  user.activeTitle = title;
  setActiveUser(user);
  return user;
}

// Equip Player Avatar
export function equipAvatar(avatar: string): UserAccount {
  let user = getActiveUser();
  if (!user) throw new Error('No user logged in');
  user = ensureUserProgression(user);
  user.avatar = avatar;
  setActiveUser(user);
  return user;
}

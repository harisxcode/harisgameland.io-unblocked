import { UserAccount, PenguinSnack, VipTierLevel, VipTierDefinition, TokenPack } from '../types';

const STORAGE_KEY_USERS = 'haris_gamecenter_users_v3';
const STORAGE_KEY_ACTIVE_USER = 'haris_gamecenter_active_user_v3';

export const VIP_TIERS_CONFIG: Record<'regular' | 'gold' | 'diamond', VipTierDefinition> = {
  regular: {
    id: 'regular',
    name: 'Regular VIP',
    tagline: 'Arcade Pass with exclusive games & titles',
    tokenCost: 500,
    usdCost: 4.99,
    badge: '⭐ REGULAR VIP',
    icon: '⭐',
    accentClass: 'from-purple-500 to-indigo-500',
    borderClass: 'border-purple-400/60',
    bgGradient: 'from-purple-950/40 via-[#0c1230] to-[#080d24]',
    textClass: 'text-purple-300',
    unlockedGameNames: ['Nitro League 3D', 'Slope Cyber Tunnel', 'Paper.io 2'],
    unlockedTitles: ['VIP Grinder', 'Arcade Apprentice', 'Ice Breaker', 'Penguin Cadet'],
    unlockedAvatars: ['⭐', '🐧', '🎮', '⚡'],
    unlockedSnackNames: ['Gourmet Glacial Sprats', 'Crispy Ice Krill Deluxe'],
    perks: [
      'Unlock 3 Regular VIP Games (Nitro League, Slope, Paper.io)',
      '4 Exclusive Regular Gamer Titles',
      'Regular VIP Star Badge & Profile Flair',
      '2 Gourmet Foods to feed Pablo (+25 & +35 Affection)',
      'Zero Ads on All Unblocked Games'
    ]
  },
  gold: {
    id: 'gold',
    name: 'Gold VIP',
    tagline: 'High-Roller Pass with premium games & golden glow',
    tokenCost: 750,
    usdCost: 7.99,
    badge: '👑 GOLD VIP',
    icon: '👑',
    accentClass: 'from-amber-400 via-yellow-400 to-amber-500',
    borderClass: 'border-amber-400/70',
    bgGradient: 'from-amber-950/40 via-[#181404] to-[#0d152b]',
    textClass: 'text-amber-300',
    unlockedGameNames: ['Escape Road Unblocked', 'Retro Bowl College', 'Drive Mad Stunt Mania', 'Nitro League 3D', 'Slope Cyber Tunnel', 'Paper.io 2'],
    unlockedTitles: ['Golden Legend', "Pablo's Champion", 'High Roller', 'Golden Striker'],
    unlockedAvatars: ['👑', '🏆', '🦁', '🌟'],
    unlockedSnackNames: ['Golden Glazed Arctic Salmon', 'Honeycomb Glacier Berries'],
    perks: [
      'Unlock 6 VIP Games (Escape Road, Retro Bowl, Drive Mad + all Regular)',
      '4 Legendary Golden Gamer Titles',
      'Gold Animated Glowing Profile Frame',
      '2 Rare Pablo Feasts (+55 & +70 Affection)',
      '1.5x Daily Penguin Points Multiplier'
    ]
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond VIP',
    tagline: 'Supreme Access with Cloud Games & Overlord Status',
    tokenCost: 1000,
    usdCost: 11.99,
    badge: '💎 DIAMOND VIP',
    icon: '💎',
    accentClass: 'from-cyan-400 via-sky-300 to-blue-500',
    borderClass: 'border-cyan-400/80',
    bgGradient: 'from-cyan-950/50 via-[#07193b] to-[#050f24]',
    textClass: 'text-cyan-300',
    unlockedGameNames: [
      'Roblox Cloud Edition', '1v1 Arena Duel', 'Tunnel Rush Hyperspeed',
      'Escape Road Unblocked', 'Retro Bowl College', 'Drive Mad Stunt Mania',
      'Nitro League 3D', 'Slope Cyber Tunnel', 'Paper.io 2'
    ],
    unlockedTitles: ['Diamond Overlord', 'Emperor of Ice', 'Arcade God', 'Untouchable Grinder'],
    unlockedAvatars: ['💎', '🌌', '🦅', '🔱'],
    unlockedSnackNames: ['Diamond Caviar Platter', 'Frostfire Aurora Sundae'],
    perks: [
      'Unlock ALL 9 VIP Games including Roblox Cloud & 1v1 Arena',
      '4 Supreme Diamond Overlord Titles',
      'Holographic Diamond Animated Profile Halo',
      '2 Ultra Pablo Feasts (+100 & +120 Affection)',
      'Double (2x) Point Earnings on all speedruns',
      'Special Diamond Glow in Community Chat Lounge'
    ]
  }
};

export const PENGUIN_SNACKS: PenguinSnack[] = [
  // Free / Standard Snacks (Everyone can feed)
  {
    id: 'snack-fish',
    name: 'Arctic Silver Fish',
    cost: 20,
    icon: '🐟',
    affectionBoost: 8,
    description: 'Fresh glacial sprats loaded with Omega-3. Pablo crunches these between speedruns!',
    tasteReaction: 'Pablo swallows the fish whole in one bite! *Happy penguin squawk!* (+8 Affection)'
  },
  {
    id: 'snack-shrimp',
    name: 'Crispy Antarctic Krill',
    cost: 40,
    icon: '🦐',
    affectionBoost: 16,
    description: 'Crispy deep-sea krill snack. Pablo says it boosts his FPS reaction time by 300%!',
    tasteReaction: 'Pablo munches enthusiastically! His eyes sparkle with retro gamer joy! (+16 Affection)'
  },
  {
    id: 'snack-squid',
    name: 'Glacial Neon Squid',
    cost: 85,
    icon: '🦑',
    affectionBoost: 35,
    description: 'Glowing deep-sea delicacy. Rumored to give Pablo temporary zero-friction ice speed.',
    tasteReaction: 'Whoa! Pablo does a 360-degree victory spin on the ice! Absolutely gourmet! (+35 Affection)'
  },
  {
    id: 'snack-icepop',
    name: 'Cyberberry Ice Pop',
    cost: 150,
    icon: '🍧',
    affectionBoost: 60,
    description: 'Sub-zero frozen glacier pop infused with arcade neon syrup. The ultimate treat.',
    tasteReaction: 'Pablo wears his RGB headphones proudly and shares a joyful waddle dance! (+60 Affection)'
  },

  // Regular VIP Exclusive Snacks
  {
    id: 'snack-regular-sprat',
    name: 'Gourmet Glacial Sprats',
    cost: 55,
    icon: '🐟✨',
    affectionBoost: 25,
    vipTierRequired: 'regular',
    description: 'Hand-selected glacial sprats dusted with crystal sea salt. Unlocked for Regular VIPs.',
    tasteReaction: 'Pablo munches with VIP gusto! "Regular VIP taste approved!" (+25 Affection)'
  },
  {
    id: 'snack-regular-krill',
    name: 'Crispy Ice Krill Deluxe',
    cost: 75,
    icon: '🦐⚡',
    affectionBoost: 35,
    vipTierRequired: 'regular',
    description: 'Sub-zero tempura krill fried with zero oil. Crispy delight reserved for Regular VIPs.',
    tasteReaction: 'Pablo does a happy backflip on the ice! Pure crispiness! (+35 Affection)'
  },

  // Gold VIP Exclusive Snacks
  {
    id: 'snack-gold-salmon',
    name: 'Golden Glazed Arctic Salmon',
    cost: 110,
    icon: '🍣👑',
    affectionBoost: 55,
    vipTierRequired: 'gold',
    description: 'Glistening wild salmon topped with golden arctic maple glaze. Exquisite Gold VIP recipe.',
    tasteReaction: 'Pablo wears his gold crown and claps his flippers in culinary ecstasy! (+55 Affection)'
  },
  {
    id: 'snack-gold-berries',
    name: 'Honeycomb Glacier Berries',
    cost: 135,
    icon: '🍯🍓',
    affectionBoost: 70,
    vipTierRequired: 'gold',
    description: 'Rare berries harvested from glacial peaks dipped in sweet frozen honeycomb.',
    tasteReaction: 'Sweetness overload! Pablo slides around the room with pure golden joy! (+70 Affection)'
  },

  // Diamond VIP Exclusive Snacks
  {
    id: 'snack-diamond-caviar',
    name: 'Diamond Caviar Platter',
    cost: 180,
    icon: '💎🍱',
    affectionBoost: 100,
    vipTierRequired: 'diamond',
    description: 'Luminescent deep-trench sturgeon caviar served on crystal ice. The ultimate Diamond VIP meal.',
    tasteReaction: 'MAGNIFICENT! Pablo enters a sparkling rainbow frenzy dance! Unstoppable happiness! (+100 Affection)'
  },
  {
    id: 'snack-diamond-sundae',
    name: 'Frostfire Aurora Sundae',
    cost: 220,
    icon: '🍨🌌',
    affectionBoost: 120,
    vipTierRequired: 'diamond',
    description: 'Multi-layered frozen glacier gelato swirling with actual aurora borealis stardust.',
    tasteReaction: 'A cosmic feast! Pablo ascends into pure gamer enlightenment! Legendary affection reached! (+120 Affection)'
  }
];

// Initial demo accounts
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-haris-owner',
    username: 'Haris',
    fullName: 'Haris (Website Owner)',
    email: 'harisxcode@gmail.com',
    avatar: '👑',
    activeTitle: 'Diamond Overlord',
    unlockedTitles: ['Diamond Overlord', 'Emperor of Ice', 'Golden Legend', 'VIP Grinder'],
    unlockedAvatars: ['👑', '💎', '🐧', '🏆'],
    penguinPoints: 9999,
    isVip: true,
    vipTier: 'diamond',
    isAdmin: true,
    vipActivatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 150,
    favoriteGameIds: ['slope-cyber-tunnel', '1v1-arena-duel', 'escape-road', 'drive-mad-stunt'],
    snacksFedCount: 50,
    pabloAffection: 100,
    inventory: []
  },
  {
    id: 'user-demo-guest',
    username: 'ArcadeRider',
    fullName: 'Guest Challenger',
    email: 'guest@harisgamecenter.com',
    avatar: '🐧',
    activeTitle: 'Guest Challenger',
    unlockedTitles: ['Guest Challenger'],
    unlockedAvatars: ['🐧'],
    penguinPoints: 0,
    isVip: false,
    vipTier: 'none',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 0,
    favoriteGameIds: ['escape-road', 'nitro-league'],
    snacksFedCount: 0,
    pabloAffection: 15,
    inventory: []
  },
  {
    id: 'user-pablo-pro',
    username: 'PabloVIP',
    fullName: 'Pablo Fan Club #1',
    email: 'vip@harisgamecenter.com',
    avatar: '👑',
    activeTitle: 'Golden Legend',
    unlockedTitles: ['Golden Legend', "Pablo's Champion", 'VIP Grinder'],
    unlockedAvatars: ['👑', '⭐', '🐧'],
    penguinPoints: 0,
    isVip: true,
    vipTier: 'gold',
    vipActivatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: 42,
    favoriteGameIds: ['nitro-league', 'escape-road', 'roblox-cloud'],
    snacksFedCount: 12,
    pabloAffection: 88,
    inventory: []
  }
];

export function isOwnerAccount(user: UserAccount | null): boolean {
  if (!user) return false;
  const username = user.username?.toLowerCase().trim();
  const email = user.email?.toLowerCase().trim();
  return (
    email === 'harisxcode@gmail.com' ||
    username === 'haris' ||
    username === 'harisxcode'
  );
}

const TIER_HIERARCHY: Record<VipTierLevel, number> = {
  none: 0,
  regular: 1,
  gold: 2,
  diamond: 3
};

export function hasVipTierAccess(
  userTier: VipTierLevel = 'none', 
  requiredTier: 'regular' | 'gold' | 'diamond' = 'regular',
  isOwner: boolean = false
): boolean {
  if (isOwner) return true;
  const userRank = TIER_HIERARCHY[userTier] || 0;
  const requiredRank = TIER_HIERARCHY[requiredTier] || 1;
  return userRank >= requiredRank;
}

export const TOKEN_PACKS: TokenPack[] = [
  {
    id: 'pack-starter',
    name: 'Starter Grinder Pouch',
    tokens: 250,
    bonusTokens: 0,
    priceUsd: 1.99,
    icon: '🪙',
    description: 'Perfect starter pack to grab snack treats for Pablo and quick titles.'
  },
  {
    id: 'pack-popular',
    name: 'Arcade Champion Chest',
    tokens: 600,
    bonusTokens: 100, // Total 700
    priceUsd: 4.49,
    popular: true,
    badge: 'MOST POPULAR',
    icon: '💰',
    description: 'Instantly unlock Regular VIP or stock up on gourmet glacial treats.'
  },
  {
    id: 'pack-highroller',
    name: 'Glacial Gold Vault',
    tokens: 1200,
    bonusTokens: 300, // Total 1500
    priceUsd: 8.99,
    bestValue: true,
    badge: 'BEST VALUE',
    icon: '👑',
    description: 'Enough tokens to unlock Gold VIP and max out Pablo affection.'
  },
  {
    id: 'pack-overlord',
    name: 'Diamond Overlord Trove',
    tokens: 2500,
    bonusTokens: 1000, // Total 3500
    priceUsd: 18.99,
    badge: 'MAX TOKENS',
    icon: '💎',
    description: 'The supreme arcade treasure. Unlock Diamond VIP, top rank, and unlimited snacks.'
  }
];

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    let users: UserAccount[] = raw ? JSON.parse(raw) : DEFAULT_ACCOUNTS;
    const hasHaris = users.some(u => u.username.toLowerCase() === 'haris' || u.email === 'harisxcode@gmail.com');
    if (!hasHaris) {
      users = [DEFAULT_ACCOUNTS[0], ...users];
      saveUsers(users);
    }
    return users;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getActiveUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (raw) {
      const user: UserAccount = JSON.parse(raw);
      // Ensure tier is standardized
      if (user.isVip && (!user.vipTier || String(user.vipTier).toLowerCase() === 'gold' || String(user.vipTier).toLowerCase() === 'diamond')) {
        const lower = String(user.vipTier || 'regular').toLowerCase() as VipTierLevel;
        user.vipTier = (lower === 'gold' || lower === 'diamond') ? lower : 'regular';
      }
      return user;
    }
    // No active user saved in session -> return null so login is required!
    return null;
  } catch {
    return null;
  }
}

export function setActiveUser(user: UserAccount | null): void {
  try {
    if (user) {
      // User requested: When a new account is made or logged in to, tokens are set automatically to 0 (except for owner Haris)
      const isHaris = isOwnerAccount(user);
      if (!isHaris && (user.penguinPoints === undefined || user.penguinPoints === null)) {
        user.penguinPoints = 0;
      }
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
      const users = getAllUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      saveUsers(users);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    }
  } catch (err) {
    console.error('Failed to set active user', err);
  }
}

export function createPlayerAccount(
  username: string,
  fullName: string = '',
  avatar: string = '🐧'
): UserAccount {
  const isHaris = username.toLowerCase().trim() === 'haris' || username.toLowerCase().trim() === 'harisxcode';
  const newUser: UserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: username.trim(),
    fullName: fullName.trim() || username.trim(),
    email: isHaris ? 'harisxcode@gmail.com' : `${username.toLowerCase().replace(/\s+/g, '')}@player.local`,
    avatar: isHaris ? '👑' : avatar,
    activeTitle: isHaris ? 'Diamond Overlord' : 'Arcade Challenger',
    unlockedTitles: isHaris 
      ? ['Diamond Overlord', 'Emperor of Ice', 'Golden Legend', 'VIP Grinder']
      : ['Arcade Challenger'],
    unlockedAvatars: isHaris ? ['👑', '💎', '🐧'] : [avatar],
    penguinPoints: isHaris ? 9999 : 0, // Starts from ZERO tokens for each player account
    isVip: isHaris,
    vipTier: isHaris ? 'diamond' : 'none',
    isAdmin: isHaris,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    gamesPlayedCount: isHaris ? 150 : 0,
    favoriteGameIds: [],
    snacksFedCount: 0,
    pabloAffection: 15,
    inventory: []
  };

  const users = getAllUsers();
  users.push(newUser);
  saveUsers(users);
  setActiveUser(newUser);
  return newUser;
}

/**
 * Creates or activates a 15-Minute Free Trial account.
 * Gives full temporary VIP access (regular VIP tier) for 15 minutes,
 * starting with 0 tokens so they earn from zero.
 */
export function startFreeTrialAccount(gamerTag?: string): UserAccount {
  const trialId = `trial-${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // exactly 15 minutes from now

  const name = gamerTag?.trim() || `TrialRunner-${Math.floor(100 + Math.random() * 900)}`;

  const trialUser: UserAccount = {
    id: trialId,
    username: name,
    fullName: `${name} (15m Free Trial)`,
    email: `${name.toLowerCase()}@trial.arcade`,
    avatar: '⏱️',
    activeTitle: '15m VIP Trialist',
    unlockedTitles: ['15m VIP Trialist', 'Speedy Tester'],
    unlockedAvatars: ['⏱️', '⚡', '🐧'],
    penguinPoints: 0, // Starts from ZERO tokens
    isVip: true, // Temporary VIP during trial
    vipTier: 'regular',
    isAdmin: false, // Absolutely NO admin panel access
    isTrial: true,
    trialStartedAt: now.toISOString(),
    trialExpiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    lastLogin: now.toISOString(),
    gamesPlayedCount: 0,
    favoriteGameIds: [],
    snacksFedCount: 0,
    pabloAffection: 20,
    inventory: []
  };

  const users = getAllUsers();
  users.push(trialUser);
  saveUsers(users);
  setActiveUser(trialUser);
  return trialUser;
}

/**
 * Checks if the user is currently on an active trial, and returns remaining seconds
 */
export function getTrialRemainingSeconds(user: UserAccount | null): number {
  if (!user || !user.isTrial || !user.trialExpiresAt) return 0;
  const expires = new Date(user.trialExpiresAt).getTime();
  const diff = Math.floor((expires - Date.now()) / 1000);
  return Math.max(0, diff);
}

/**
 * Calculate token rewards for playing games:
 * VIP games award more tokens (e.g. 50-75 tokens vs 25 standard),
 * plus player tier multiplier (Gold 1.5x, Diamond 2.0x).
 */
export function calculateGameTokenReward(game?: { isVipExclusive?: boolean; vipTierRequired?: string } | null, user?: UserAccount | null): {
  baseAmount: number;
  vipBonus: number;
  tierMultiplier: number;
  totalTokens: number;
} {
  // Base token reward: standard games give 25 tokens. VIP games give out more tokens (50-75).
  let baseAmount = 25;
  let vipBonus = 0;

  if (game?.isVipExclusive) {
    if (game.vipTierRequired === 'diamond') {
      vipBonus = 50; // Total base: 75
    } else if (game.vipTierRequired === 'gold') {
      vipBonus = 35; // Total base: 60
    } else {
      vipBonus = 25; // Total base: 50
    }
  }

  const rawBase = baseAmount + vipBonus;

  let tierMultiplier = 1;
  if (user?.vipTier === 'gold') tierMultiplier = 1.5;
  if (user?.vipTier === 'diamond') tierMultiplier = 2.0;

  const totalTokens = Math.round(rawBase * tierMultiplier);

  return {
    baseAmount,
    vipBonus,
    tierMultiplier,
    totalTokens
  };
}

export function awardPenguinPoints(amount: number = 25): UserAccount | null {
  const user = getActiveUser();
  if (!user) return null;

  user.penguinPoints = (user.penguinPoints || 0) + amount;
  user.gamesPlayedCount = (user.gamesPlayedCount || 0) + 1;
  setActiveUser(user);
  return user;
}

export function unlockVipTierWithPoints(tier: 'regular' | 'gold' | 'diamond'): { 
  success: boolean; 
  message: string; 
  user?: UserAccount 
} {
  const user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in first to upgrade your VIP tier!' };
  }

  const config = VIP_TIERS_CONFIG[tier];
  const requiredPoints = config.tokenCost; // 500, 750, 1000

  // Check if user already has equal or higher tier
  const currentRank = TIER_HIERARCHY[user.vipTier || 'none'] || 0;
  const targetRank = TIER_HIERARCHY[tier];
  if (currentRank >= targetRank) {
    return { 
      success: true, 
      message: `You already hold the ${config.name} (or higher) status!`, 
      user 
    };
  }

  if (user.penguinPoints < requiredPoints) {
    return {
      success: false,
      message: `Need ${requiredPoints} Penguin Points for ${config.name}. You currently have ${user.penguinPoints} pts. Play more games to earn more!`
    };
  }

  user.penguinPoints -= requiredPoints;
  user.isVip = true;
  user.vipTier = tier;
  user.vipActivatedAt = new Date().toISOString();

  // Add unlocked titles and avatars
  const currentTitles = new Set(user.unlockedTitles || ['Arcade Challenger']);
  config.unlockedTitles.forEach(t => currentTitles.add(t));
  user.unlockedTitles = Array.from(currentTitles);
  if (!user.activeTitle || user.activeTitle === 'Arcade Challenger') {
    user.activeTitle = config.unlockedTitles[0];
  }

  const currentAvatars = new Set(user.unlockedAvatars || [user.avatar]);
  config.unlockedAvatars.forEach(a => currentAvatars.add(a));
  user.unlockedAvatars = Array.from(currentAvatars);

  setActiveUser(user);

  return {
    success: true,
    message: `🎉 Congratulations! ${config.name} unlocked for ${requiredPoints} tokens! Enjoy your new games, titles, and Pablo treats!`,
    user
  };
}

export function unlockVipTierWithCash(tier: 'regular' | 'gold' | 'diamond'): { 
  success: boolean; 
  message: string; 
  user?: UserAccount 
} {
  const user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in first to upgrade your VIP tier!' };
  }

  const config = VIP_TIERS_CONFIG[tier];
  const bonusPoints = tier === 'regular' ? 150 : tier === 'gold' ? 300 : 500;

  user.isVip = true;
  user.vipTier = tier;
  user.vipActivatedAt = new Date().toISOString();
  user.penguinPoints = (user.penguinPoints || 0) + bonusPoints;

  // Add unlocked titles and avatars
  const currentTitles = new Set(user.unlockedTitles || ['Arcade Challenger']);
  config.unlockedTitles.forEach(t => currentTitles.add(t));
  user.unlockedTitles = Array.from(currentTitles);
  user.activeTitle = config.unlockedTitles[0];

  const currentAvatars = new Set(user.unlockedAvatars || [user.avatar]);
  config.unlockedAvatars.forEach(a => currentAvatars.add(a));
  user.unlockedAvatars = Array.from(currentAvatars);

  setActiveUser(user);

  return {
    success: true,
    message: `⚡ ${config.name} Activated ($${config.usdCost.toFixed(2)} USD)! +${bonusPoints} Bonus Penguin Points added to your balance!`,
    user
  };
}

// Backward-compatible methods
export function unlockVipWithPoints() {
  return unlockVipTierWithPoints('regular');
}

export function unlockVipWithCash() {
  return unlockVipTierWithCash('regular');
}

export function updateUserProfileCustomization(
  title?: string, 
  avatar?: string
): { success: boolean; user?: UserAccount } {
  const user = getActiveUser();
  if (!user) return { success: false };

  if (title) user.activeTitle = title;
  if (avatar) user.avatar = avatar;

  setActiveUser(user);
  return { success: true, user };
}

export function feedPabloSnack(snackId: string): { success: boolean; message: string; user?: UserAccount } {
  const user = getActiveUser();
  if (!user) return { success: false, message: 'Sign in to feed Pablo!' };

  const snack = PENGUIN_SNACKS.find((s) => s.id === snackId);
  if (!snack) return { success: false, message: 'Snack not found' };

  // Check VIP tier requirement
  if (snack.vipTierRequired) {
    const isOwner = isOwnerAccount(user);
    if (!hasVipTierAccess(user.vipTier, snack.vipTierRequired, isOwner)) {
      const tierName = snack.vipTierRequired === 'regular' ? 'Regular VIP' : snack.vipTierRequired === 'gold' ? 'Gold VIP' : 'Diamond VIP';
      return {
        success: false,
        message: `🔒 Locked! "${snack.name}" requires ${tierName} access. Upgrade your VIP tier to feed this delicacy!`
      };
    }
  }

  if (user.penguinPoints < snack.cost) {
    return {
      success: false,
      message: `Not enough Penguin Points! Need ${snack.cost} pts, you have ${user.penguinPoints} pts.`
    };
  }

  user.penguinPoints -= snack.cost;
  user.snacksFedCount = (user.snacksFedCount || 0) + 1;
  user.pabloAffection = Math.min(100, (user.pabloAffection || 0) + snack.affectionBoost);
  setActiveUser(user);

  return {
    success: true,
    message: snack.tasteReaction,
    user
  };
}

/**
 * Purchase Token Packs with USD
 */
export function buyTokenPackWithUsd(packId: string): {
  success: boolean;
  message: string;
  user?: UserAccount;
  tokensAdded?: number;
} {
  const user = getActiveUser();
  if (!user) {
    return { success: false, message: 'Please sign in to buy token packs!' };
  }

  const pack = TOKEN_PACKS.find(p => p.id === packId);
  if (!pack) {
    return { success: false, message: 'Token pack not found.' };
  }

  const totalTokens = pack.tokens + pack.bonusTokens;
  user.penguinPoints = (user.penguinPoints || 0) + totalTokens;
  setActiveUser(user);

  return {
    success: true,
    message: `🪙 Purchased ${pack.name} for $${pack.priceUsd.toFixed(2)} USD! +${totalTokens.toLocaleString()} in-game tokens added to your balance!`,
    user,
    tokensAdded: totalTokens
  };
}

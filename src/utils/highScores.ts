import { GameHighScore } from '../types';

const STORAGE_KEY = 'haris_high_scores';

// Initial community arcade high scores for each game
export const INITIAL_COMMUNITY_LEADERBOARDS: Record<string, { player: string; avatar: string; score: number; formatted: string; isVip?: boolean }[]> = {
  'tunnel-rush-3d': [
    { player: 'VortexPilot', avatar: '🌀', score: 1840, formatted: '1,840m', isVip: true },
    { player: 'CyberPenguin', avatar: '🐧', score: 1420, formatted: '1,420m', isVip: true },
    { player: 'NeonStriker', avatar: '⚡', score: 1190, formatted: '1,190m' },
    { player: 'SpeedDemon', avatar: '🚀', score: 980, formatted: '980m' }
  ],
  'slope-cyber-3d': [
    { player: 'SlopeMaster', avatar: '🚀', score: 2450, formatted: '2,450m', isVip: true },
    { player: 'CyberPenguin', avatar: '🐧', score: 2120, formatted: '2,120m', isVip: true },
    { player: 'GravityDrifter', avatar: '⚡', score: 1780, formatted: '1,780m' },
    { player: 'RollerPro', avatar: '🎮', score: 1350, formatted: '1,350m' }
  ],
  'escape-road': [
    { player: 'DriftMaster99', avatar: '🏎️', score: 3450, formatted: '3,450m', isVip: true },
    { player: 'PabloGetaway', avatar: '🐧', score: 2890, formatted: '2,890m', isVip: true },
    { player: 'NitroGhost', avatar: '🔥', score: 2410, formatted: '2,410m' },
    { player: 'SpeedyChaser', avatar: '⚡', score: 1960, formatted: '1,960m' }
  ],
  'retro-bowl-champion': [
    { player: 'TouchdownPablo', avatar: '🏈', score: 56, formatted: '56 PTS', isVip: true },
    { player: 'GridironHero', avatar: '👑', score: 48, formatted: '48 PTS', isVip: true },
    { player: 'BlitzCommander', avatar: '🔥', score: 38, formatted: '38 PTS' },
    { player: 'QuarterbackAce', avatar: '⚡', score: 28, formatted: '28 PTS' }
  ],
  'flappy-bird-arcade': [
    { player: 'FlappyKing', avatar: '👑', score: 92, formatted: '92 PTS', isVip: true },
    { player: 'WingMaster', avatar: '🐧', score: 78, formatted: '78 PTS' },
    { player: 'PixelGlider', avatar: '⚡', score: 64, formatted: '64 PTS' },
    { player: 'RetroFlyer', avatar: '🎮', score: 45, formatted: '45 PTS' }
  ],
  'cookie-clicker-classic': [
    { player: 'BakerPenguin', avatar: '🍪', score: 14500000, formatted: '14.5M 🍪', isVip: true },
    { player: 'CookieBaron', avatar: '👑', score: 9800000, formatted: '9.8M 🍪' },
    { player: 'GrandmaWhisperer', avatar: '🔥', score: 4200000, formatted: '4.2M 🍪' },
    { player: 'CocoaKing', avatar: '⚡', score: 1500000, formatted: '1.5M 🍪' }
  ],
  'paper-io-2-arena': [
    { player: 'GridMaster', avatar: '🗺️', score: 62.4, formatted: '62.4%', isVip: true },
    { player: 'PaperOverlord', avatar: '👑', score: 54.8, formatted: '54.8%' },
    { player: 'TerritoryKing', avatar: '⚡', score: 44.2, formatted: '44.2%' },
    { player: 'TrailSlicer', avatar: '🔥', score: 36.5, formatted: '36.5%' }
  ],
  'nitro-league': [
    { player: 'SpeedyHarisFan', avatar: '🏎️', score: 4120, formatted: '4,120m', isVip: true },
    { player: 'NitroRacer', avatar: '⚡', score: 3650, formatted: '3,650m' },
    { player: 'ApexDrifter', avatar: '🔥', score: 2980, formatted: '2,980m' },
    { player: 'TurboPablo', avatar: '🐧', score: 2450, formatted: '2,450m' }
  ],
  '1v1-arena-strike': [
    { player: 'ViperGamer', avatar: '🎯', score: 18, formatted: '18 Wins', isVip: true },
    { player: 'SniperPenguin', avatar: '🐧', score: 14, formatted: '14 Wins', isVip: true },
    { player: 'ClutchBuilder', avatar: '⚡', score: 11, formatted: '11 Wins' },
    { player: 'ShotgunKing', avatar: '🔥', score: 9, formatted: '9 Wins' }
  ],
  'drive-mad-extreme': [
    { player: 'OffroadKing', avatar: '🚜', score: 3, formatted: 'Stage 3 Clear', isVip: true },
    { player: 'BridgeMaster', avatar: '👑', score: 3, formatted: 'Stage 3 Clear' },
    { player: 'VoxelMonster', avatar: '🔥', score: 2, formatted: 'Stage 2 Clear' }
  ]
};

export function getGameUnit(gameId: string): string {
  switch (gameId) {
    case 'tunnel-rush-3d':
    case 'slope-cyber-3d':
    case 'escape-road':
    case 'nitro-league':
      return 'm';
    case 'flappy-bird-arcade':
    case 'retro-bowl-champion':
      return 'pts';
    case 'cookie-clicker-classic':
      return 'cookies';
    case 'paper-io-2-arena':
      return '%';
    case '1v1-arena-strike':
      return 'wins';
    case 'drive-mad-extreme':
      return 'stages';
    default:
      return 'pts';
  }
}

export function formatGameScore(score: number, unit: string): string {
  if (unit === 'cookies') {
    if (score >= 1000000) return (score / 1000000).toFixed(1) + 'M 🍪';
    if (score >= 1000) return (score / 1000).toFixed(1) + 'K 🍪';
    return `${Math.round(score)} 🍪`;
  }
  if (unit === '%') {
    return `${score.toFixed(1)}%`;
  }
  if (unit === 'm') {
    return `${Math.round(score).toLocaleString()}m`;
  }
  if (unit === 'wins') {
    return `${score} Wins`;
  }
  if (unit === 'stages') {
    return `Stage ${score} Clear`;
  }
  return `${Math.round(score).toLocaleString()} PTS`;
}

export function getAllSavedHighScores(): Record<string, GameHighScore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getPersonalHighScore(gameId: string): GameHighScore | null {
  const all = getAllSavedHighScores();
  return all[gameId] || null;
}

export function savePersonalHighScore(
  gameId: string,
  gameTitle: string,
  score: number,
  unit?: string,
  username?: string,
  avatar?: string
): { isNewRecord: boolean; previousRecord: number; currentRecord: number; highScore: GameHighScore } {
  const all = getAllSavedHighScores();
  const existing = all[gameId];
  const previousRecord = existing ? existing.score : 0;
  const isNewRecord = score > previousRecord;
  const targetUnit = unit || existing?.unit || getGameUnit(gameId);

  const highScore: GameHighScore = {
    gameId,
    gameTitle,
    score: isNewRecord ? score : previousRecord,
    unit: targetUnit,
    playerUsername: username || existing?.playerUsername || 'Guest Grinder',
    playerAvatar: avatar || existing?.playerAvatar || '🐧',
    achievedAt: isNewRecord ? new Date().toISOString() : existing?.achievedAt || new Date().toISOString(),
    formattedScore: formatGameScore(isNewRecord ? score : previousRecord, targetUnit)
  };

  if (isNewRecord || !existing) {
    all[gameId] = highScore;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
  }

  return {
    isNewRecord,
    previousRecord,
    currentRecord: highScore.score,
    highScore
  };
}

export function getFullLeaderboard(gameId: string, currentUsername?: string): {
  rank: number;
  player: string;
  avatar: string;
  score: number;
  formatted: string;
  isMe?: boolean;
}[] {
  const defaultList = INITIAL_COMMUNITY_LEADERBOARDS[gameId] || [];
  const personal = getPersonalHighScore(gameId);

  let combined = [...defaultList.map(item => ({ ...item, isMe: false }))];

  if (personal && personal.score > 0) {
    const existingIndex = combined.findIndex(c => c.player.toLowerCase() === (currentUsername || personal.playerUsername).toLowerCase());
    if (existingIndex >= 0) {
      if (personal.score > combined[existingIndex].score) {
        combined[existingIndex].score = personal.score;
        combined[existingIndex].formatted = personal.formattedScore;
        combined[existingIndex].isMe = true;
      }
    } else {
      combined.push({
        player: personal.playerUsername,
        avatar: personal.playerAvatar,
        score: personal.score,
        formatted: personal.formattedScore,
        isMe: true
      });
    }
  }

  combined.sort((a, b) => b.score - a.score);

  return combined.map((entry, idx) => ({
    rank: idx + 1,
    ...entry
  }));
}

export function generateBragText(
  gameTitle: string,
  scoreText: string,
  playerTag: string
): string {
  return `🎮 [Haris Game Center - High Score Brag!]\n🏆 Just crushed a NEW ALL-TIME RECORD on ${gameTitle}!\n⭐ Score: ${scoreText}\n👤 Gamer: ${playerTag}\n🕹️ Think you can beat my run? Play unblocked now with 0% lag: https://harisxcode.github.io\n#GameGrinders #HarisGameCenter #UnblockedGames`;
}

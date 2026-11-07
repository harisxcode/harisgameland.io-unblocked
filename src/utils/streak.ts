/**
 * Daily Login Streak utility functions & reward schedules
 */

export const STREAK_DAYS_CONFIG = [
  { day: 1, basePoints: 50, label: 'Starter Spark', icon: '⚡' },
  { day: 2, basePoints: 75, label: 'Flame Ignited', icon: '🔥' },
  { day: 3, basePoints: 100, label: 'Arcade Regular', icon: '🎯' },
  { day: 4, basePoints: 150, label: 'Glacial Fire', icon: '❄️' },
  { day: 5, basePoints: 200, label: 'Grinder Elite', icon: '🏆' },
  { day: 6, basePoints: 250, label: 'Ice Legend', icon: '🌟' },
  { day: 7, basePoints: 350, label: 'Weekly Overlord', icon: '👑' }
];

export const getTodayLocalDateStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayLocalDateStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function calculateDailyStreakRewardPoints(streak: number, vipTier?: string): number {
  let basePoints = 50;
  if (streak === 1) basePoints = 50;
  else if (streak === 2) basePoints = 75;
  else if (streak === 3) basePoints = 100;
  else if (streak === 4) basePoints = 150;
  else if (streak === 5) basePoints = 200;
  else if (streak === 6) basePoints = 250;
  else if (streak === 7) basePoints = 350;
  else {
    // Scaled bonus for 8+ days
    basePoints = Math.min(600, 350 + (streak - 7) * 25);
  }

  // VIP multipliers: diamond = 2.0x, gold = 1.5x, regular = 1.25x
  if (vipTier === 'diamond') return Math.round(basePoints * 2.0);
  if (vipTier === 'gold') return Math.round(basePoints * 1.5);
  if (vipTier === 'regular') return Math.round(basePoints * 1.25);
  return basePoints;
}

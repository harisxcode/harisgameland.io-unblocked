import { CharityDonation, UserAccount } from '../types';
import { getActiveUser, setActiveUser } from './auth';
import { awardSeasonXp } from './seasonPass';

const STORAGE_KEY_CHARITY_DONATIONS = 'haris_pablo_charity_donations_v1';

const INITIAL_DONATIONS: CharityDonation[] = [
  {
    id: 'TX-PABLO-77491',
    donorName: 'Haris (Arcade Founder)',
    donorEmail: 'harisxcode@gmail.com',
    amountUsd: 500.00,
    paymentMethod: 'card',
    message: 'Official launch match donation for Pablo Penguin Wildlife Sanctuary & Arctic Ocean cleanup! 🐧🌊',
    timestamp: '2026-11-01T12:00:00Z',
    receiptNumber: 'REC-2026-PABLO-001'
  },
  {
    id: 'TX-PABLO-61842',
    donorName: 'SpeedrunChampion',
    donorEmail: 'speedrun@player.local',
    amountUsd: 50.00,
    paymentMethod: 'paypal',
    message: 'Donated from my tournament prize money! Keep the ice cold and penguins fed! 🐟',
    timestamp: '2026-11-02T16:24:00Z',
    receiptNumber: 'REC-2026-PABLO-002'
  },
  {
    id: 'TX-PABLO-39215',
    donorName: 'RetroGamer99',
    donorEmail: 'retro99@player.local',
    amountUsd: 25.00,
    paymentMethod: 'points',
    tokensContributed: 500,
    message: 'Converted 500 Penguin Points into a real matched charity donation. Love Pablo! ❤️',
    timestamp: '2026-11-03T18:45:00Z',
    receiptNumber: 'REC-2026-PABLO-003'
  },
  {
    id: 'TX-PABLO-84920',
    donorName: 'AntarcticGuardian',
    donorEmail: 'guardian@wildlife.org',
    amountUsd: 100.00,
    paymentMethod: 'card',
    message: 'For the winter chick feeding program and marine sanctuary preservation.',
    timestamp: '2026-11-04T09:12:00Z',
    receiptNumber: 'REC-2026-PABLO-004'
  }
];

export function getAllDonations(): CharityDonation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHARITY_DONATIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  saveDonations(INITIAL_DONATIONS);
  return INITIAL_DONATIONS;
}

export function saveDonations(donations: CharityDonation[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CHARITY_DONATIONS, JSON.stringify(donations));
  } catch {}
}

export function recordDonation(data: {
  donorName: string;
  donorEmail: string;
  amountUsd: number;
  tokensContributed?: number;
  paymentMethod: 'card' | 'paypal' | 'points';
  message: string;
}): {
  donation: CharityDonation;
  user: UserAccount | null;
} {
  const all = getAllDonations();
  const txSuffix = Math.floor(10000 + Math.random() * 90000);
  const recSuffix = (all.length + 1).toString().padStart(4, '0');

  const newDonation: CharityDonation = {
    id: `TX-PABLO-${txSuffix}`,
    donorName: data.donorName.trim() || 'Anonymous Penguin Supporter',
    donorEmail: data.donorEmail.trim() || 'donor@charity.local',
    amountUsd: Math.max(1, parseFloat(data.amountUsd.toFixed(2))),
    tokensContributed: data.tokensContributed || 0,
    paymentMethod: data.paymentMethod,
    message: data.message.trim() || 'Keep the penguins swimming strong!',
    timestamp: new Date().toISOString(),
    receiptNumber: `REC-2026-PABLO-${recSuffix}`
  };

  all.unshift(newDonation);
  saveDonations(all);

  // Update active user profile
  let user = getActiveUser();
  if (user) {
    // If donated with tokens, deduct tokens
    if (data.paymentMethod === 'points' && data.tokensContributed) {
      user.penguinPoints = Math.max(0, (user.penguinPoints || 0) - data.tokensContributed);
    }

    // Award honorary title & avatar
    const titles = new Set(user.unlockedTitles || ['Arcade Challenger']);
    titles.add('Ocean Guardian');
    titles.add('Pablo Philanthropist');
    user.unlockedTitles = Array.from(titles);
    user.activeTitle = 'Ocean Guardian';

    const avatars = new Set(user.unlockedAvatars || ['🐧']);
    avatars.add('🐧💙');
    user.unlockedAvatars = Array.from(avatars);

    // Boost Pablo affection and grant Season XP
    user.pabloAffection = Math.min(100, (user.pabloAffection || 20) + 30);
    try {
      const xpRes = awardSeasonXp(250, 'Donated to Pablo Charity');
      user = xpRes.user;
    } catch {}

    setActiveUser(user);
  }

  return { donation: newDonation, user };
}

export function getCharityStats(): {
  totalRaisedUsd: number;
  totalDonors: number;
  penguinsHelped: number;
  goalUsd: number;
  percentOfGoal: number;
} {
  const donations = getAllDonations();
  const totalRaisedUsd = donations.reduce((sum, d) => sum + (d.amountUsd || 0), 0);
  const totalDonors = donations.length;
  // Estimated: each $10 supports 1 rescued penguin chick or 50 lbs of ocean cleanup
  const penguinsHelped = Math.floor(totalRaisedUsd / 10);
  const goalUsd = 2500.00;
  const percentOfGoal = Math.min(100, Math.round((totalRaisedUsd / goalUsd) * 100));

  return {
    totalRaisedUsd,
    totalDonors,
    penguinsHelped,
    goalUsd,
    percentOfGoal
  };
}

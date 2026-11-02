import { ChatComment } from '../types';

export const COMMENTS_STORAGE_KEY = 'haris_arcade_comments';

export const INITIAL_COMMENTS: ChatComment[] = [
  {
    id: 'c-pin-1',
    username: 'Haris (Creator)',
    avatar: '🐧',
    text: 'Welcome to Haris Game Center and the Game Grinders community! All games run on 100% offline-ready canvas with 0% server lag. Post your game comments and submit your all-time high scores below!',
    timestamp: 'Pinned by Admin',
    isVip: true,
    likes: 142,
    pinned: true
  },
  {
    id: 'c-1',
    username: 'VortexPilot',
    avatar: '🌀',
    text: 'Tunnel Rush at 2.5x speed is pure adrenaline! Just hit an all-time record of 1,840m. Try dodging using quick tap taps instead of holding the arrows!',
    timestamp: '8 mins ago',
    gameId: 'tunnel-rush-3d',
    gameTitle: 'Tunnel Rush 3D',
    highScoreBadge: '1,840m 🏆',
    isVip: true,
    likes: 38
  },
  {
    id: 'c-2',
    username: 'TouchdownPablo',
    avatar: '🏈',
    text: 'Retro Bowl is so good! Drag backwards to aim bullet passes. Receiver #87 cuts inside on slant routes right at the 20 yard line.',
    timestamp: '22 mins ago',
    gameId: 'retro-bowl-champion',
    gameTitle: 'Retro Bowl',
    highScoreBadge: '56 PTS 🏆',
    isVip: true,
    likes: 29
  },
  {
    id: 'c-3',
    username: 'BakerPenguin',
    avatar: '🍪',
    text: 'Tip for Cookie Clicker: save up early for Grandmas before cocoa mines. Also the Golden Cookie gives 7x multiplier frenzy for 15 seconds!',
    timestamp: '45 mins ago',
    gameId: 'cookie-clicker-classic',
    gameTitle: 'Cookie Clicker',
    highScoreBadge: '14.5M 🍪',
    likes: 24
  },
  {
    id: 'c-4',
    username: 'CyberPenguin',
    avatar: '⚡',
    text: 'Slope Cyber is buttery smooth on school Chromebooks. 2,120m score! Who is in the Game Grinders Discord voice call?',
    timestamp: '1 hour ago',
    gameId: 'slope-cyber-3d',
    gameTitle: 'Slope Cyber 3D',
    highScoreBadge: '2,120m 🏆',
    isVip: true,
    likes: 31
  },
  {
    id: 'c-5',
    username: 'GridMaster',
    avatar: '🗺️',
    text: 'Paper.io 2 trick: don’t expand too far from base unless all 4 bots are on the other side of the arena. Locked in 62.4% map territory!',
    timestamp: '2 hours ago',
    gameId: 'paper-io-2-arena',
    gameTitle: 'Paper.io 2',
    highScoreBadge: '62.4% 🏆',
    likes: 19
  },
  {
    id: 'c-6',
    username: 'DriftMaster99',
    avatar: '🏎️',
    text: 'Escape Road getaway: brake right before taking the tight intersection turns to make the cop cruisers crash into building barricades! Hit 3,450m!',
    timestamp: '3 hours ago',
    gameId: 'escape-road',
    gameTitle: 'Escape Road Unblocked',
    highScoreBadge: '3,450m 🏆',
    isVip: true,
    likes: 27
  }
];

export function getAllComments(): ChatComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return INITIAL_COMMENTS;
}

export function saveAllComments(comments: ChatComment[]): void {
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haris_comments_updated'));
    }
  } catch {}
}

export function postComment(newCommentData: {
  username: string;
  avatar: string;
  text: string;
  gameId?: string;
  gameTitle?: string;
  highScoreBadge?: string;
  isVip?: boolean;
}): ChatComment {
  const all = getAllComments();
  const newComment: ChatComment = {
    id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: newCommentData.username || 'GuestGrinder',
    avatar: newCommentData.avatar || '🐧',
    text: newCommentData.text.trim(),
    timestamp: 'Just now',
    gameId: newCommentData.gameId,
    gameTitle: newCommentData.gameTitle,
    highScoreBadge: newCommentData.highScoreBadge,
    isVip: newCommentData.isVip,
    likes: 0,
    likedByMe: false
  };

  const updated = [newComment, ...all];
  saveAllComments(updated);
  return newComment;
}

export function toggleCommentLike(commentId: string): ChatComment[] {
  const all = getAllComments();
  const updated = all.map(c => {
    if (c.id === commentId) {
      const currentlyLiked = !!c.likedByMe;
      return {
        ...c,
        likes: currentlyLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
        likedByMe: !currentlyLiked
      };
    }
    return c;
  });
  saveAllComments(updated);
  return updated;
}

import { YouTubeVideoItem } from '../types';

export const CURATED_YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Synthwave / Cyber Chill Beats (Arcade Radio)',
    channel: 'Lofi Girl · Live Stream',
    category: 'chill',
    duration: '24/7 Live',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    description: 'Relaxing retro cyberpunk beats, neon synthwave rhythms, and chill gaming soundtrack streaming live from YouTube.'
  },
  {
    id: 'j5auLnkQ4gE',
    title: 'Super Mario 64 - The Quest for the 16-Star World Record',
    channel: 'Summoning Salt',
    category: 'speedrun',
    duration: '42:15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'The complete documentary history of the most competitive retro speedrun in arcade and console history.'
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Minecraft - Volume Alpha & Beta Chill Ambient Gaming Suite',
    channel: 'C418 · Official',
    category: 'music',
    duration: '1:58:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic pixel world piano melodies, soothing acoustic sounds, and relaxing background gaming atmosphere.'
  },
  {
    id: 'k4V3Mo61fJM',
    title: 'Retro 80s Arcade Games Golden Era Showcase',
    channel: 'Retro Gaming Center',
    category: 'gameplay',
    duration: '28:40',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    description: 'Classic coin-op arcade cabinets in action: Pac-Man, Galaga, Space Invaders, OutRun, and Donkey Kong.'
  },
  {
    id: 'M576WGiDBdQ',
    title: 'Chiptune 8-Bit Retro Video Game Battle Anthems',
    channel: 'Arcade Soundtracks',
    category: 'music',
    duration: '1:14:20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'Energetic square wave basslines, crisp noise percussion, and fast arpeggios modeled after classic GameBoy and NES soundchips.'
  },
  {
    id: 'Z1BCujX3pw8',
    title: 'Slope 3D & Tunnel Speedrun World Record Clutch',
    channel: 'Arcade Grinders',
    category: 'speedrun',
    duration: '15:20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    description: 'Incredible reflexes dodging hyper-speed red blocks and surviving narrow neon bridges without falling.'
  }
];

/**
 * Extracts YouTube video ID from various YouTube URL formats or raw IDs
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Raw 11-char alphanumeric ID
 */
export function parseYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtu.be/VIDEO_ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Handle youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return null;
}

/**
 * Builds standard compliant YouTube embed URL that loads within iframe without CSP block
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

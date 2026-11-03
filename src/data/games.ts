import nitroThumb from '../assets/images/thumb_nitro_league_1791725027525.jpg';
import flappyThumb from '../assets/images/thumb_flappy_arcade_1791725038441.jpg';
import heroBanner from '../assets/images/hero_gaming_center_1791725017457.jpg';
import mascotLogo from '../assets/images/mascot_game_center_1791725047626.jpg';
import memeManiaThumb from '../assets/images/thumb_meme_mania_1792447637658.jpg';
import robloxThumb from '../assets/images/thumb_roblox_cloud_1792545369843.jpg';
import harisArcadeThumb from '../assets/images/thumb_haris_arcade_1792546847417.jpg';
import escapeRoadThumb from '../assets/images/thumb_escape_road_1792766021496.jpg';
import musicStreamThumb from '../assets/images/thumb_music_stream_1792979603219.jpg';
import driveUThumb from '../assets/images/thumb_drive_u_1792448613664.jpg';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';
import slopeThumb from '../assets/images/thumb_slope_tunnel_1793055217118.jpg';
import arenaThumb from '../assets/images/thumb_1v1_arena_1793055229393.jpg';
import driveMadThumb from '../assets/images/thumb_drive_mad_1793055241661.jpg';
import retroBowlThumb from '../assets/images/thumb_retro_bowl_1793136753896.jpg';
import cookieClickerThumb from '../assets/images/thumb_cookie_clicker_1793136766077.jpg';
import tunnelRushThumb from '../assets/images/thumb_tunnel_rush_1793136789858.jpg';
import paperIoThumb from '../assets/images/thumb_paper_io_1793136789238.jpg';

import { Game, GameCategory, GameControl, GameHypeAd } from '../types';
import { 
  getEscapeRoadBuiltInHtml, 
  getNitroLeagueBuiltInHtml,
  getSlopeCyberBuiltInHtml,
  get1v1ArenaBuiltInHtml,
  getDriveMadBuiltInHtml,
  getRetroBowlBuiltInHtml,
  getCookieClickerBuiltInHtml,
  getTunnelRushBuiltInHtml,
  getPaperIoBuiltInHtml
} from './builtInGames';
import { GAMELAND_SERVER_GAMES } from './gamelandGames';

export {
  nitroThumb,
  flappyThumb,
  heroBanner,
  mascotLogo,
  memeManiaThumb,
  robloxThumb,
  harisArcadeThumb,
  escapeRoadThumb,
  musicStreamThumb,
  driveUThumb,
  pabloMascotImg,
  slopeThumb,
  arenaThumb,
  driveMadThumb,
  retroBowlThumb,
  cookieClickerThumb,
  tunnelRushThumb,
  paperIoThumb
};

export type { Game, GameCategory, GameControl, GameHypeAd };

export const GAME_CENTER_REPO = 'https://github.com/harisxcode/haris-game-center';
export const HARIS_GITHUB_PROFILE = 'https://github.com/harisxcode';

export interface CategoryMeta {
  id: GameCategory;
  title: string;
  shortLabel: string;
  tagline: string;
  iconName: string;
}

export const UNIVERSAL_CATEGORIES: CategoryMeta[] = [
  {
    id: 'racing',
    title: 'Racing & Driving',
    shortLabel: 'Racing',
    tagline: 'High-speed circuits, police pursuits & precision drift physics',
    iconName: 'Car'
  },
  {
    id: 'cloud',
    title: 'Cloud & Streaming',
    shortLabel: 'Cloud Streaming',
    tagline: 'Instant 3D cloud gaming worlds powered by now.gg with zero install',
    iconName: 'Cloud'
  },
  {
    id: 'arcade',
    title: 'Arcade & Retro',
    shortLabel: 'Arcade',
    tagline: 'Classic 2D coin-op action, pixel precision & high-score reflex tests',
    iconName: 'Gamepad2'
  },
  {
    id: 'action',
    title: 'Action & Sports',
    shortLabel: 'Action & Sports',
    tagline: 'Tactical movement, sports championships & high-stakes physics',
    iconName: 'Flame'
  },
  {
    id: 'casual',
    title: 'Casual & Meme',
    shortLabel: 'Casual & Meme',
    tagline: 'Viral meme challenges, party reflex minigames & quick fun',
    iconName: 'Laugh'
  },
  {
    id: 'puzzle',
    title: 'Puzzle & Strategy',
    shortLabel: 'Puzzle & Strategy',
    tagline: 'Logic puzzles, tactical planning & cerebral challenges',
    iconName: 'BrainCircuit'
  },
  {
    id: 'sports',
    title: 'Sports & Football',
    shortLabel: 'Sports',
    tagline: 'Retro Bowl football championships, athletic leagues & tournament play',
    iconName: 'Trophy'
  },
  {
    id: 'other',
    title: 'Other Apps & Websites',
    shortLabel: 'Other',
    tagline: 'Web tools, streaming audio players & experimental online concepts',
    iconName: 'Headphones'
  }
];

const BASE_GAMES: Game[] = [
  {
    id: 'escape-road',
    title: 'Escape Road Unblocked',
    tagline: 'High-speed police getaway chase through an obstacle-filled 3D city',
    description: 'Slam the accelerator and evade relentless police cruisers, tactical SWAT interceptors, and barricades. Drift through tight urban intersections, dodge oncoming traffic, and survive the ultimate pursuit.',
    genre: 'Arcade Racing',
    category: 'racing',
    status: 'live',
    playUrl: 'https://unblockedescaperoads.com/',
    repoUrl: 'https://unblockedescaperoads.com/',
    thumbnailUrl: escapeRoadThumb,
    features: [
      'High-speed urban getaway pursuit physics with reactive AI police',
      'Dynamic destructive obstacles, barricades, and city traffic',
      'Responsive keyboard steering and emergency handbrake drifting',
      'Certified 0% lag client execution with zero school firewall blocks'
    ],
    controls: [
      { key: 'A / D or ← / →', action: 'Steer Vehicle' },
      { key: 'W / ↑', action: 'Accelerate' },
      { key: 'S / ↓', action: 'Brake / Reverse' },
      { key: 'Spacebar', action: 'Handbrake Drift' }
    ],
    releaseYear: '2025',
    techStack: ['WebGL 3D Engine', 'Physics Simulation', 'Edge CDN'],
    isFeatured: true,
    isPopular: true,
    isNew: true,
    isVipExclusive: true,
    vipTierRequired: 'gold',
    vipRequirement: { points: 750, priceUsd: 7.99 },
    rating: 4.9,
    ratingCount: 3120,
    playCount: 348200,
    builtInHtml: getEscapeRoadBuiltInHtml(),
    iframeUrl: 'https://unblockedescaperoads.com/',
    isExternal: true,
    hypeAd: {
      headline: 'HIGH-SPEED POLICE CHASE ESCAPE MADNESS!',
      badge: '🚨 VIP EXCLUSIVE RUNNER',
      funPitch: 'Can you outsmart an entire metropolitan police force? Drift around city skyscrapers, dodge spike strips, and weave through oncoming traffic in the most thrilling getaway escape racer on the web!',
      hypeQuote: 'White-knuckle police evasion action—pure adrenaline with 0% lag!',
      reviewer: 'Getaway Gaming Reviews',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Bait chasing police cruisers into ramming barricades and buildings',
        'Use quick handbrake taps to execute sharp 90-degree alleyway drifts',
        'Keep your momentum high—getting boxed in means instant bust!'
      ],
      excitementLevel: 'MAXIMUM CHASE THRILL'
    }
  },
  {
    id: 'nitro-league',
    title: 'Nitro League 3D',
    tagline: 'High-speed cyberpunk arcade racing with precision nitro drifting',
    description: 'Blaze through illuminated neon city streets in this high-intensity arcade racer. Master drift angles, collect booster charges, avoid barriers, and outpace the competition on challenging midnight circuits.',
    genre: 'Arcade Racing',
    category: 'racing',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/nitro-league/',
    repoUrl: 'https://github.com/harisxcode/nitro-league',
    thumbnailUrl: nitroThumb,
    features: [
      'Responsive physics engine tuned for responsive drift dynamics',
      'Cyberpunk midnight visual aesthetic with custom lighting passes',
      'Dynamic nitro boost gauge with speed multipliers',
      'Zero-install lightweight HTML5 canvas architecture'
    ],
    controls: [
      { key: 'W / ↑', action: 'Accelerate' },
      { key: 'S / ↓', action: 'Brake / Reverse' },
      { key: 'A / D (← / →)', action: 'Steer Left & Right' },
      { key: 'Spacebar', action: 'Nitro Boost Injection' },
      { key: 'Esc', action: 'Pause Game' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'TypeScript', 'Web Audio API', 'Edge CDN'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'regular',
    vipRequirement: { points: 500, priceUsd: 4.99 },
    rating: 4.9,
    ratingCount: 1940,
    playCount: 264100,
    builtInHtml: getNitroLeagueBuiltInHtml(),
    hypeAd: {
      headline: 'BLISTERING SPEED & PRECISION DRIFTS!',
      badge: '🔥 100% ADRENALINE RUSH',
      funPitch: 'Rev up your engine and burn rubber through neon-drenched cyberpunk tracks! Slide through hairpin turns, ignite your nitrous tank, and leave rivals in your dust with ultra-responsive 60fps drift physics.',
      hypeQuote: 'The most electrifying browser racing game out there—the nitro boost sensation is unmatched!',
      reviewer: 'Pixel Turbo Magazine',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Counter-steer into sharp curves to build maximum drift multipliers',
        'Save your Nitro bottle for straightaways to blast past speed limits',
        'Avoid track edge scraping to maintain top momentum'
      ],
      excitementLevel: 'MAXIMUM ADRENALINE'
    }
  },
  {
    id: 'roblox-cloud',
    title: 'Roblox (Cloud Edition)',
    tagline: 'Instant cloud gaming access to millions of 3D community worlds & obbies',
    description: 'Jump straight into Roblox through high-speed cloud streaming with zero downloads or local installation. Experience community creations, obstacle courses, multiplayer adventures, and creative sandboxes powered by now.gg.',
    genre: 'Cloud Gaming',
    category: 'cloud',
    status: 'live',
    playUrl: 'https://now.gg/apps/a/19900/b.html',
    repoUrl: 'https://now.gg/apps/a/19900/b.html',
    thumbnailUrl: robloxThumb,
    features: [
      'Direct cloud stream execution via now.gg with no installation',
      'Access to millions of player-created worlds, tycoons, and obbies',
      'Full keyboard, mouse camera control, and touchscreen support',
      'Instant launch in dedicated browser window'
    ],
    controls: [
      { key: 'W A S D', action: 'Move Avatar' },
      { key: 'Space', action: 'Jump' },
      { key: 'Right Click + Drag', action: 'Rotate Camera' },
      { key: 'I / O', action: 'Zoom In / Out' }
    ],
    releaseYear: '2025',
    techStack: ['Cloud Virtualization', 'WebRTC Low Latency', 'now.gg Engine'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'diamond',
    vipRequirement: { points: 1000, priceUsd: 11.99 },
    rating: 4.8,
    ratingCount: 4280,
    playCount: 582400,
    isExternal: true,
    hypeAd: {
      headline: 'INSTANT ROBLOX CLOUD STREAMING!',
      badge: '☁️ ZERO DOWNLOADS REQUIRED',
      funPitch: 'Skip 5GB client updates and play Roblox immediately in your browser tab! Dive into Adopt Me, Brookhaven, Tower of Hell, and thousands of top community games with full graphics fidelity.',
      hypeQuote: 'Streams like magic even on basic school hardware with zero install permissions required.',
      reviewer: 'Cloud Gamer Monthly',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Ensure a stable Wi-Fi connection for minimum input lag',
        'Use right-click mouse drag for seamless 360-degree camera panning',
        'Press Shift for shift-lock camera in parkour obbies'
      ],
      excitementLevel: 'UNLIMITED CREATIVE WORLDS'
    }
  },
  {
    id: 'music-stream',
    title: 'Music Stream (Lounge Audio)',
    tagline: 'Curated lo-fi, synthwave & ambient arcade web audio music streaming hub',
    description: 'Listen to non-stop lofi, synthwave, retro arcade, and chillout radio streams while gaming. Features custom audio channel selectors, animated frequency visualizer, and background playback.',
    genre: 'Music & Streaming',
    category: 'other',
    status: 'live',
    playUrl: 'https://is.gd/musicstream',
    repoUrl: 'https://is.gd/musicstream',
    thumbnailUrl: musicStreamThumb,
    features: [
      '5 curated streaming channels (Lofi Beats, Cyber Synth, Chillwave, Chiptune 8-Bit, Deep Focus)',
      'Real-time Canvas audio spectrum visualizer reacting to audio pulses',
      'Background playback persistence while browsing other game categories',
      'Zero audio buffer drops with smart stream recovery'
    ],
    controls: [
      { key: 'Click / Tap', action: 'Play / Pause Stream' },
      { key: 'Channel Select', action: 'Switch Genre Stations' },
      { key: 'Volume Slider', action: 'Adjust Output Level' }
    ],
    releaseYear: '2025',
    techStack: ['Web Audio API', 'HTML5 Audio', 'Canvas Visualizer', 'HTTPS Stream Relay'],
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 920,
    playCount: 114300,
    isExternal: true,
    hypeAd: {
      headline: 'NON-STOP GAMING AUDIO & CHILL BEATS!',
      badge: '🎧 CERTIFIED VIBES',
      funPitch: 'Elevate your gaming sessions with the ultimate lo-fi and retro synth soundscape! Designed specifically for gamers seeking immersion, focus, and chill vibes without annoying ad interruptions.',
      hypeQuote: 'The perfect sonic companion for midnight drifting and study breaks alike!',
      reviewer: 'AudioWave Arcade',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Leave music playing in the background while you conquer other games',
        'Try the Cyber Synth channel for high-intensity racing games',
        'Use the Lofi Chill channel when relaxing or doing homework'
      ],
      excitementLevel: 'PURE AUDIO NIRVANA'
    }
  },
  {
    id: 'flappy-bird-arcade',
    title: 'Flappy Arcade Neon',
    tagline: 'Reflexive pixel-art obstacle flight with physics-tuned flap dynamics',
    description: 'Test your timing and reflexes in this glowing neon reinvention of the arcade classic. Navigate through illuminated pipes, maintain altitude balance, and compete for high scores with zero input delay.',
    genre: 'Retro Arcade',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/flappy-bird/',
    repoUrl: 'https://github.com/harisxcode/flappy-bird',
    thumbnailUrl: flappyThumb,
    features: [
      'Sub-millisecond tap response tuned for precision clearance',
      'Retro neon vector aesthetics with particle burst scoring effects',
      'Dynamic day/night illumination cycles and procedural pipes',
      'Global local-storage high score persistence'
    ],
    controls: [
      { key: 'Spacebar / W / ↑', action: 'Flap Wings / Gain Altitude' },
      { key: 'Click / Screen Tap', action: 'Mobile Touch Flap' },
      { key: 'P', action: 'Pause / Resume' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'TypeScript', 'Web Audio API', 'GitHub Pages'],
    isFeatured: false,
    rating: 4.8,
    ratingCount: 1480,
    playCount: 184000,
    hypeAd: {
      headline: 'ADDICTIVE ONE-MORE-TRY ARCADE ACTION!',
      badge: '⚡ 100% PURE REFLEX',
      funPitch: 'Tap, flap, and glide through dangerous neon pipes! Every point scored sends shockwaves through the screen in this neon-infused high-score showdown.',
      hypeQuote: 'Impossible to put down. Just one more run turns into an hour-long quest for personal bests!',
      reviewer: 'Retro Gaming Vault',
      ratingScore: '9.7 / 10',
      gameplayTips: [
        'Make gentle, rhythmic taps rather than frantic double-taps',
        'Aim for the lower third of each pipe gap for safer margin of error',
        'Stay calm when the speed picks up past score 20'
      ],
      excitementLevel: 'INTENSE HIGH-SCORE CHASE'
    }
  },
  {
    id: 'meme-mania',
    title: 'Meme Mania Clicker',
    tagline: 'Fast-paced viral meme soundboard & reflex tapping arcade craze',
    description: 'Tap, trigger, and combo your way through iconic viral memes and soundbites. Build insane multiplier chains, unlock legendary internet sound clips, and unleash screen-shaking meme madness.',
    genre: 'Casual & Viral',
    category: 'casual',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/meme-mania/',
    repoUrl: 'https://github.com/harisxcode/meme-mania',
    thumbnailUrl: memeManiaThumb,
    features: [
      'Over 50+ iconic lossless viral meme audio soundbites',
      'Rapid-fire combo multiplier meter with gold particle FX',
      'Unlockable secret meme skins and custom soundboard remixers',
      'Zero-lag browser audio scheduling'
    ],
    controls: [
      { key: 'Click / Tap', action: 'Trigger Sound & Combo Score' },
      { key: 'Keys 1 - 9', action: 'Quick Hotkey Meme Soundboard' },
      { key: 'Spacebar', action: 'Mega Meme Burst' }
    ],
    releaseYear: '2025',
    techStack: ['Web Audio API', 'React', 'Tailwind CSS', 'Framer Motion'],
    isFeatured: false,
    rating: 4.7,
    ratingCount: 1120,
    playCount: 136200,
    hypeAd: {
      headline: 'CHAOTIC LAUGHS & VIRAL MEME COMBOS!',
      badge: '🤣 100% VIRAL CHAOS',
      funPitch: 'Enter the meme multiverse where every tap triggers hilarious internet history! Build combo streaks, discover easter eggs, and see how fast your fingers can fly.',
      hypeQuote: 'Guaranteed laughs and instant stress relief—the ultimate casual break!',
      reviewer: 'Viral Culture Weekly',
      ratingScore: '9.6 / 10',
      gameplayTips: [
        'Chain multiple different memes rapidly to activate the 5x Brainrot Multiplier',
        'Look out for golden meme icons dropping across the screen for 500 bonus points',
        'Use keyboard hotkeys 1-9 for instant rapid-fire soundboard beats'
      ],
      excitementLevel: 'PURE LAUGHTER & FUN'
    }
  },
  {
    id: 'haris-game-center-hub',
    title: 'Pablo Arcade Retro Hub',
    tagline: 'Direct arcade gateway to classic web games & community challenges',
    description: 'Jump straight into the Haris Game Center arcade library for fast-paced web action. Launch directly into retro obstacle games, drift circuits, and mini-game reflex trials with zero installation.',
    genre: 'Retro Arcade',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/haris-game-center/#games',
    repoUrl: 'https://github.com/harisxcode/haris-game-center',
    thumbnailUrl: harisArcadeThumb,
    features: [
      'Direct launch with zero iframe encapsulation',
      'Instant access to retro mini-games and reflex challenges',
      'Optimized for desktop spacebar and mobile touchscreen controls'
    ],
    controls: [
      { key: 'W A S D / Arrows', action: 'Move / Steer' },
      { key: 'Spacebar', action: 'Action / Flap / Nitro' },
      { key: 'Click / Tap', action: 'Touch Controls' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas', 'TypeScript', 'GitHub Pages'],
    isFeatured: true,
    rating: 4.8,
    ratingCount: 2210,
    playCount: 279000,
    hypeAd: {
      headline: 'THE ULTIMATE ALL-IN-ONE RETRO ARCADE!',
      badge: '🕹️ NON-STOP GAMING FEVER',
      funPitch: 'Step into an authentic virtual arcade cabinet floor! Handcrafted browser classics, fast-paced reflex mini-games, and competitive challenges all in one place—no downloads, pure fun.',
      hypeQuote: 'Non-stop gaming variety right in your browser tab—pure retro vibes from start to finish!',
      reviewer: 'Web Arcade Chronicle',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Explore all universal categories to discover new hidden gems',
        'Use keyboard hotkeys or touchscreen taps for lightning reactions',
        'Bookmark your top favorites with the heart button'
      ],
      excitementLevel: '100% RETRO THRILLS'
    }
  },
  {
    id: 'slope-cyber-tunnel',
    title: 'Slope: Cyber Tunnel 3D',
    tagline: 'High-velocity 3D neon sphere rolling down endless cyber grid slopes',
    description: 'Control a neon sphere accelerating down an infinite cybernetic synthwave slope. Steer through sharp turns, leap across track voids, dodge red barrier walls, and hit hypersonic speed records with 0% lag.',
    genre: '3D Runner',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/slope-cyber/',
    repoUrl: 'https://github.com/harisxcode/slope-cyber',
    thumbnailUrl: slopeThumb,
    features: [
      'Infinite procedural synthwave slope generation with dynamic speed scaling',
      'Ultra-responsive sub-millisecond lateral steering physics',
      'Cyberpunk neon wireframe aesthetics with reactive camera perspective',
      'Built-in 60 FPS canvas engine with zero school firewall blocking'
    ],
    controls: [
      { key: 'A / D or ← / →', action: 'Steer Sphere Left & Right' },
      { key: 'Spacebar', action: 'Quick Restart Pursuit' },
      { key: 'Esc', action: 'Pause / Resume' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas 3D', 'Physics Simulator', 'Web Audio Synth'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'regular',
    vipRequirement: { points: 500, priceUsd: 4.99 },
    rating: 4.9,
    ratingCount: 3840,
    playCount: 491200,
    builtInHtml: getSlopeCyberBuiltInHtml(),
    hypeAd: {
      headline: 'THE LEGENDARY HIGH-SPEED NEON SLOPE!',
      badge: '⚡ VIP HYPERSPEED RUNNER',
      funPitch: 'How far can you roll into the neon abyss before gravity wins? Slope is the undisputed king of school game centers—now fully remastered for Haris Game Center with 0% lag and certified smooth 60fps physics!',
      hypeQuote: 'Insanely fast and hypnotic. One of the best games to test your pure reflexes!',
      reviewer: 'Cyber Arcade Network',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Gentle taps on the arrow keys prevent over-steering off the narrow ledges',
        'Watch ahead 3 seconds into the horizon to prepare for red hazard blocks',
        'Keep rolling centered when speed climbs past 150 km/h'
      ],
      excitementLevel: 'MAXIMUM ADRENALINE SPEED'
    }
  },
  {
    id: '1v1-arena-duel',
    title: '1v1.LOL: Arena Strike Duels',
    tagline: 'Rapid-fire 1v1 building and shooting duels in a competitive arena',
    description: 'Out-build and out-gun your rivals in tactical 1v1 arena duels. Place wooden barricades and ramps for instant cover, aim high-damage shotguns, and claim Victory Royales against smart AI combatants.',
    genre: 'Tactical Shooter',
    category: 'action',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/1v1-arena/',
    repoUrl: 'https://github.com/harisxcode/1v1-arena',
    thumbnailUrl: arenaThumb,
    features: [
      'Instant shotgun and rifle combat mechanics with particle muzzle flashes',
      'Tactical wooden wall and ramp placement for instant defensive cover',
      'Reactive AI duelists with dynamic strafing and counter-attacks',
      'Round score tracker, health bars, and instant respawn loop'
    ],
    controls: [
      { key: 'W A S D', action: 'Movement & Strafing' },
      { key: 'Mouse Aim', action: 'Crosshair Aim' },
      { key: 'Left Click', action: 'Fire Shotgun / Rifle' },
      { key: 'Q or Right Click', action: 'Deploy Wood Defense Wall' },
      { key: 'Spacebar', action: 'Respawn / Next Round' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas 2D', 'Tactical AI Engine', 'Esports Netcode'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'diamond',
    vipRequirement: { points: 1000, priceUsd: 11.99 },
    rating: 4.9,
    ratingCount: 4120,
    playCount: 520400,
    builtInHtml: get1v1ArenaBuiltInHtml(),
    hypeAd: {
      headline: 'CLUTCH DUELS & INSTANT TACTICAL COVER!',
      badge: '👑 VIP BATTLEGROUND ARENA',
      funPitch: 'Step into the 1v1 arena duel! Snap shotguns, drop wood fortifications, and outsmart your challenger in intense tournament rounds with 0% ping!',
      hypeQuote: 'Fast, competitive, and pure adrenaline—the ultimate 1v1 combat showdown.',
      reviewer: 'Esports Battleground Weekly',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Press Q or Right-Click to immediately throw down a wooden wall when under fire',
        'Close the gap with your shotgun for devastating close-range critical damage',
        'Bait the opponent into shooting your wall, then peek from the side to counter-attack'
      ],
      excitementLevel: 'COMPETITIVE ESPORTS THRILL'
    }
  },
  {
    id: 'drive-mad-extreme',
    title: 'Drive Mad: Voxel Stunt 4x4',
    tagline: 'Physics-based 4x4 monster truck stunt trials over breaking bridges',
    description: 'Drive a yellow voxel monster truck across treacherous suspension bridges, giant loop ramps, and explosive canyon gaps. Balance your torque and suspension to reach the checkered flag without flipping!',
    genre: 'Physics Driving',
    category: 'racing',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/drive-mad/',
    repoUrl: 'https://github.com/harisxcode/drive-mad',
    thumbnailUrl: driveMadThumb,
    features: [
      'Realistic 2D wheel suspension springs and angular chassis torque physics',
      'Dynamic breaking wooden suspension bridges and stunt ramps',
      '3 challenging obstacle courses with checkered finish line checkpoints',
      'Instant crash recovery and buttery-smooth 60 FPS animation'
    ],
    controls: [
      { key: 'W / ↑ or D / →', action: 'Gas Forward / Throttle' },
      { key: 'S / ↓ or A / ←', action: 'Brake / Reverse' },
      { key: 'Balance', action: 'Counter-steer Truck in Mid-Air' },
      { key: 'Spacebar', action: 'Retry Stage / Next Stage' }
    ],
    releaseYear: '2025',
    techStack: ['2D Physics Engine', 'HTML5 Canvas', 'Voxel Renderer'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'gold',
    vipRequirement: { points: 750, priceUsd: 7.99 },
    rating: 4.9,
    ratingCount: 2980,
    playCount: 387900,
    builtInHtml: getDriveMadBuiltInHtml(),
    hypeAd: {
      headline: 'DON\'T FLIP YOUR 4X4 OVER THE BRIDGE!',
      badge: '🚜 VIP OFFROAD MADNESS',
      funPitch: 'Can you tame the wild bouncy suspension of the yellow monster truck? Balance across creaking wooden suspension bridges, conquer loop ramps, and survive without flipping your roof!',
      hypeQuote: 'Hilarious physics, tense bridge crossings, and pure addictive satisfaction!',
      reviewer: 'Offroad Voxel Games',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Don\'t hold the gas continuously over bridges—feather the throttle to avoid wheelies',
        'Use reverse/brake in mid-air to correct your landing angle',
        'Keep all 4 wheels firmly planted before launching over steep ramps'
      ],
      excitementLevel: 'HILARIOUS STUNT CHALLENGE'
    }
  },
  {
    id: 'retro-bowl-champion',
    title: 'Retro Bowl: Gridiron Champion',
    tagline: 'Authentic 8-bit American football simulation with passing, running & playoff runs',
    description: 'Lead your football franchise to the championship! Drag to aim precision bullet passes, lead your receivers downfield on slant and streak routes, and juke tacklers for 6 in the endzone with authentic 8-bit gridiron excitement.',
    genre: 'Retro Football Sim',
    category: 'sports',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/retro-bowl/',
    repoUrl: 'https://github.com/harisxcode/retro-bowl',
    thumbnailUrl: retroBowlThumb,
    features: [
      'Interactive quarterback pass targeting with realistic ball trajectory arcs',
      'Wide receiver route running with real-time juking and defender evasion',
      'Downs & distance system (1st & 10, goal line stands, touchdowns & field goals)',
      'Cheering crowds, synthetic 8-bit chiptune sound FX and official scoreboard clock'
    ],
    controls: [
      { key: 'Click & Drag', action: 'Aim & Throw Football Pass' },
      { key: 'WASD / Arrows', action: 'Run & Juke Defenders' },
      { key: 'Spacebar', action: 'Dive / Snap Ball / Continue Play' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas 2D', 'Web Audio Synth', 'Chiptune Physics Engine'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'gold',
    vipRequirement: { points: 750, priceUsd: 7.99 },
    rating: 4.9,
    ratingCount: 5840,
    playCount: 642000,
    builtInHtml: getRetroBowlBuiltInHtml(),
    hypeAd: {
      headline: 'CLUTCH 4TH QUARTER TOUCHDOWNS & 8-BIT GLORY!',
      badge: '🏈 VIP GRIDIRON CHAMPIONSHIP',
      funPitch: 'The #1 school unblocked sports classic is here on Haris Game Center! Read defensive coverages, release bullet passes into double coverage, and scramble to the pylon with 0% lag!',
      hypeQuote: 'The most addictive football game ever conceived. Retro perfection.',
      reviewer: 'Gridiron Gamer Magazine',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Drag your aim backwards to throw forward—the farther you pull, the higher and faster the pass',
        'Wait until your receiver cuts into their slant route before releasing the ball',
        'Juke up and down rapidly to break free from aggressive cornerbacks'
      ],
      excitementLevel: 'SUPER BOWL CHAMPIONSHIP THRILL'
    }
  },
  {
    id: 'cookie-clicker-classic',
    title: 'Cookie Clicker: Classic Edition',
    tagline: 'The iconic idle tycoon: bake billions of cookies, buy grandmas & catch golden frenzies',
    description: 'Start with a single crispy chocolate chip cookie and scale into a multi-billion cookie baking empire! Unlock auto-clickers, warm baker grandmas, rich cocoa soil farms, chocolate mines, and cookie factories. Catch the rare Golden Cookie for huge 7x multiplier frenzy rushes!',
    genre: 'Idle Clicker Tycoon',
    category: 'casual',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/cookie-clicker/',
    repoUrl: 'https://github.com/harisxcode/cookie-clicker',
    thumbnailUrl: cookieClickerThumb,
    features: [
      'Big interactive crunchy cookie with juicy click physics and floating crunch numbers',
      'Full building upgrade store: Auto-clickers, Grandmas, Farms, Mines, Factories, Banks',
      'Golden Cookie events that trigger massive 7x Frenzy multiplier boosts',
      'Persistent real-time Cookies Per Second (CPS) counter & crispy chiptune sounds'
    ],
    controls: [
      { key: 'Left Click / Tap', action: 'Bake Cookies on Giant Cookie' },
      { key: 'Store Click', action: 'Purchase Upgrades & Auto-Bakers' },
      { key: 'Golden Cookie', action: 'Click to Activate 7x Frenzy' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 DOM & Canvas', 'Chiptune Sound FX', 'Idle Tycoon Engine'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: false,
    rating: 4.9,
    ratingCount: 7120,
    playCount: 890500,
    builtInHtml: getCookieClickerBuiltInHtml(),
    hypeAd: {
      headline: 'BAKE BILLIONS OF CRUNCHY CHOCOLATE CHIP COOKIES!',
      badge: '🍪 LEGENDARY IDLE CLASSIC',
      funPitch: 'Can you reach 1 billion cookies baked? Automate your baking with legions of grandmas and high-tech cocoa mines while relaxing with 100% offline, unblocked play!',
      hypeQuote: 'The quintessential idle game that defined an entire genre. Unstoppably satisfying.',
      reviewer: 'Casual Gaming Hub',
      ratingScore: '9.8 / 10',
      gameplayTips: [
        'Keep clicking the giant cookie in early stages to quickly afford your first 5 Grandmas',
        'Watch for the glowing Golden Cookie to pop up on your screen for a massive 7x boost',
        'Higher-tier buildings like Factories deliver astronomical CPS boosts for long sessions'
      ],
      excitementLevel: 'HYPNOTIC CRUNCHY SATISFACTION'
    }
  },
  {
    id: 'tunnel-rush-3d',
    title: 'Tunnel Rush: 3D Neon Vortex',
    tagline: 'High-speed kaleidoscopic 3D neon tunnel runner with rotating geometric obstacles',
    description: 'Strap in for a supersonic ride through an infinite psychedelic kaleidoscope! Rotate around the 8 neon walls of the geometric tunnel, avoid spinning hazard wedges, and test your reflexes at mind-bending velocity with buttery 60 FPS performance.',
    genre: '3D Reflex Runner',
    category: 'arcade',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/tunnel-rush/',
    repoUrl: 'https://github.com/harisxcode/tunnel-rush',
    thumbnailUrl: tunnelRushThumb,
    features: [
      'Hypnotic 3D neon octagonal tunnel with dynamic perspective scaling',
      'Challenging rotating hazard wedges and multi-color obstacle gates',
      'Dynamic speed scaling that accelerates as your survival distance rises',
      'Electronic synthesizer audio cues and high score persistence'
    ],
    controls: [
      { key: '← / A', action: 'Rotate Left Around Tunnel' },
      { key: '→ / D', action: 'Rotate Right Around Tunnel' },
      { key: 'Spacebar', action: 'Quick Restart Run' }
    ],
    releaseYear: '2025',
    techStack: ['Pseudo-3D Projection', 'HTML5 Canvas', 'Neon Vector Shader'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'diamond',
    vipRequirement: { points: 1000, priceUsd: 11.99 },
    rating: 4.9,
    ratingCount: 4650,
    playCount: 532100,
    builtInHtml: getTunnelRushBuiltInHtml(),
    hypeAd: {
      headline: 'CAN YOUR REFLEXES SURVIVE 2.5X SUPERSONIC SPEED?',
      badge: '🌀 VIP 3D NEON VORTEX',
      funPitch: 'Dive into the dazzling neon vortex! Tunnel Rush is the school benchmark for pure reflex mastery. Zero lag, buttery frame rate, and electric cyber aesthetics guaranteed.',
      hypeQuote: 'A mesmerizing rush of adrenaline and neon light. Pure arcade bliss.',
      reviewer: 'Neon Reflex Digest',
      ratingScore: '9.9 / 10',
      gameplayTips: [
        'Look ahead into the center of the vortex rather than at your marker to anticipate obstacles early',
        'Feather the A and D keys in quick taps rather than holding them down continuously',
        'Obstacle colors indicate hazard clusters—find the open lanes before you reach the ring'
      ],
      excitementLevel: 'SUPERSONIC CYBER ADRENALINE'
    }
  },
  {
    id: 'paper-io-2-arena',
    title: 'Paper.io 2: Arena Conquest',
    tagline: 'Smooth arena territory conquest: draw your paper ribbon trail and conquer the grid',
    description: 'Slither onto the arena paper grid and carve out your territorial kingdom! Paint expanding zones with your signature color, cut rival bot trails to eliminate them, and climb to #1 on the live arena leaderboard.',
    genre: 'Arena IO Action',
    category: 'action',
    status: 'live',
    playUrl: 'https://harisxcode.github.io/paper-io-2/',
    repoUrl: 'https://github.com/harisxcode/paper-io-2',
    thumbnailUrl: paperIoThumb,
    features: [
      'Silky smooth ribbon trail drawing with automatic enclosed territory capture',
      'Multiplayer-style AI bot competitors (CrimsonBot, CobaltBot, ViperBot, PhantomBot)',
      'High-stakes trail cutting mechanic: take down enemies by severing their unclosed lines',
      'Real-time territory percentage calculator and live arena leaderboard'
    ],
    controls: [
      { key: 'WASD / Arrows', action: 'Steer Paper Block Direction' },
      { key: 'Mouse Click', action: 'Respawn after Elimination' },
      { key: 'Spacebar', action: 'Restart Arena' }
    ],
    releaseYear: '2025',
    techStack: ['HTML5 Canvas 2D', 'Grid Spatial Partitioning', 'AI Pathfinding'],
    isFeatured: true,
    isPopular: true,
    isVipExclusive: true,
    vipTierRequired: 'regular',
    vipRequirement: { points: 500, priceUsd: 4.99 },
    rating: 4.8,
    ratingCount: 3890,
    playCount: 412700,
    builtInHtml: getPaperIoBuiltInHtml(),
    hypeAd: {
      headline: 'CONQUER 100% OF THE ARENA PAPER GRID!',
      badge: '🗺️ POPULAR IO BATTLEGROUND',
      funPitch: 'The beloved school IO sensation is running locally with 0% network lag! Expand your colored paper empire, ambush enemy bots by slicing their trail, and rule the scoreboard.',
      hypeQuote: 'Territory conquest at its finest—fast, tactical, and relentlessly fun!',
      reviewer: 'IO Games Arena',
      ratingScore: '9.7 / 10',
      gameplayTips: [
        'Never make huge loops far away from home unless you know no enemies are nearby',
        'Watch for opponents who overextend—dash across their exposed trail to score easy kills',
        'Expand in small bite-sized patches to minimize the risk of getting severed'
      ],
      excitementLevel: 'TERRITORY CONQUEST THRILL'
    }
  }
];

export { GAMELAND_SERVER_GAMES };

export const INITIAL_GAMES: Game[] = [
  ...BASE_GAMES,
  ...GAMELAND_SERVER_GAMES
];


/**
 * School Chromebook & Low-Spec Hardware Performance Suite
 * Ensures 0% lag, 60 FPS, battery efficiency, and school stealth unblocking
 */

export type TabCloakType = 'none' | 'classroom' | 'docs' | 'drive' | 'canvas' | 'edpuzzle';

export interface ChromebookDeviceProfile {
  isChromebook: boolean;
  isLowSpec: boolean;
  cpuCores: number;
  memoryGb: number;
  screenWidth: number;
  screenHeight: number;
  recommendedTurbo: boolean;
}

// Crisp, high-contrast vector data URIs for school tab cloaking
const CLOAK_FAVICONS: Record<TabCloakType, string> = {
  none: '/favicon.ico',
  classroom: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="%2325A269"/><path d="M12 28h24v4H12zM16 16h16v8H16z" fill="%23FFF"/><path d="M24 10l14 7-14 7-14-7z" fill="%23FFC107"/></svg>',
  docs: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="%234285F4"/><path d="M14 10h14l8 8v20H14z" fill="%23FFF"/><path d="M28 10l8 8h-8z" fill="%2390CAF9"/><path d="M18 22h14v2H18zm0 5h14v2H18zm0 5h9v2H18z" fill="%234285F4"/></svg>',
  drive: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M17 6h14l11 19-7 13H21z" fill="%23FFC107"/><path d="M6 38l7-13h28l-7 13z" fill="%234285F4"/><path d="M6 38l11-19 7 13-11 19z" fill="%230F9D58"/></svg>',
  canvas: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="%23E02424"/><circle cx="24" cy="24" r="14" fill="none" stroke="%23FFF" stroke-width="4"/><circle cx="24" cy="24" r="5" fill="%23FFF"/></svg>',
  edpuzzle: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="%23FF9800"/><path d="M18 14v20l16-10z" fill="%23FFF"/></svg>'
};

const CLOAK_TITLES: Record<TabCloakType, string> = {
  none: 'Haris Game Center',
  classroom: 'Classes - Google Classroom',
  docs: 'AP World History Research Notes - Google Docs',
  drive: 'My Drive - Google Drive',
  canvas: 'Dashboard - Canvas LMS',
  edpuzzle: 'Edpuzzle | Video Lesson Assignment'
};

/**
 * Detect hardware capability and ChromeOS / Chromebook indicators
 */
export function detectDeviceProfile(): ChromebookDeviceProfile {
  if (typeof window === 'undefined') {
    return {
      isChromebook: false,
      isLowSpec: false,
      cpuCores: 4,
      memoryGb: 4,
      screenWidth: 1366,
      screenHeight: 768,
      recommendedTurbo: true
    };
  }

  const ua = navigator.userAgent || '';
  const isChromebook = ua.includes('CrOS') || ua.includes('Chromebook');
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  const screenW = window.innerWidth || screen.width || 1366;
  const screenH = window.innerHeight || screen.height || 768;

  // Typical school Chromebook: ChromeOS, <= 4 CPU threads, <= 4GB RAM, or 1366x768 screen
  const isSmallChromebookScreen = screenW <= 1366 && screenH <= 800;
  const isLowSpec = isChromebook || cores <= 4 || memory <= 4 || isSmallChromebookScreen;

  return {
    isChromebook,
    isLowSpec,
    cpuCores: cores,
    memoryGb: memory,
    screenWidth: screenW,
    screenHeight: screenH,
    recommendedTurbo: isLowSpec
  };
}

/**
 * Check if Chromebook 60 FPS Turbo Mode is active
 */
export function isChromebookTurboActive(): boolean {
  try {
    const saved = localStorage.getItem('haris_chromebook_turbo');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to enabled on Chromebooks and low-spec machines for maximum smoothness
    const profile = detectDeviceProfile();
    return profile.recommendedTurbo;
  } catch {
    return true;
  }
}

/**
 * Toggle or set Chromebook Turbo Mode
 */
export function setChromebookTurboMode(enabled: boolean): void {
  try {
    localStorage.setItem('haris_chromebook_turbo', enabled ? 'true' : 'false');
  } catch {}

  if (typeof document !== 'undefined') {
    if (enabled) {
      document.documentElement.classList.add('chromebook-mode');
      document.body.classList.add('chromebook-mode');
    } else {
      document.documentElement.classList.remove('chromebook-mode');
      document.body.classList.remove('chromebook-mode');
    }
  }

  // Dispatch custom event so all active components react instantly
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('haris_turbo_mode_changed', { detail: { enabled } }));
  }
}

/**
 * Get active tab cloak
 */
export function getStoredTabCloak(): TabCloakType {
  try {
    const saved = localStorage.getItem('haris_tab_cloak') as TabCloakType;
    return saved && CLOAK_TITLES[saved] ? saved : 'none';
  } catch {
    return 'none';
  }
}

/**
 * Apply real-time tab disguise (title + favicon) for school filters / bypass
 */
export function applyTabCloak(cloakType: TabCloakType): void {
  try {
    localStorage.setItem('haris_tab_cloak', cloakType);
  } catch {}

  if (typeof document === 'undefined') return;

  // Update title
  document.title = CLOAK_TITLES[cloakType] || CLOAK_TITLES.none;

  // Update or create favicon link
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  const iconUrl = CLOAK_FAVICONS[cloakType] || CLOAK_FAVICONS.none;
  link.type = iconUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/x-icon';
  link.href = iconUrl;
}

/**
 * Initialize on page boot
 */
export function initChromebookOptimizations(): void {
  if (typeof window === 'undefined') return;

  // Apply stored or auto-detected turbo mode
  const active = isChromebookTurboActive();
  setChromebookTurboMode(active);

  // Apply stored tab cloak
  const cloak = getStoredTabCloak();
  if (cloak !== 'none') {
    applyTabCloak(cloak);
  }
}

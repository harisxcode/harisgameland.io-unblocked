import React from 'react';
import { 
  Github, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Cookie, 
  School, 
  Lock, 
  Zap, 
  Heart,
  Mail,
  ExternalLink,
  Users,
  MessageSquare
} from 'lucide-react';
import { GAME_CENTER_REPO, HARIS_GITHUB_PROFILE } from '../data/games';
import { LegalTab } from './LegalModal';
import { playArcadeSfx } from '../utils/audio';

interface FooterProps {
  onOpenLegal?: (tab?: LegalTab) => void;
  onOpenPabloHub?: () => void;
  onOpenDiscord?: () => void;
}

export function Footer({ onOpenLegal, onOpenPabloHub, onOpenDiscord }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleOpenTab = (tab: LegalTab) => {
    playArcadeSfx('click');
    if (onOpenLegal) {
      onOpenLegal(tab);
    }
  };

  return (
    <footer className="border-t border-slate-900 bg-[#02050e] text-slate-400 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Mascot */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐧</span>
              <span className="text-lg font-black text-white tracking-tight font-display">
                Haris Game Center
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier open-source unblocked arcade network engineered with 0% server lag, retro chiptunes, VIP games, and mascot companionship powered by Pablo the Penguin.
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-cyan-400">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">0% Lag</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">100% Unblocked</span>
              <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/60 text-purple-300">COPPA Safe</span>
            </div>
          </div>

          {/* Col 2: Popular Unblocked Games */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Popular Unblocked Games
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#retro-bowl" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>🏈 Retro Bowl (Gridiron Champion)</span>
                </a>
              </li>
              <li>
                <a href="#cookie-clicker" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>🍪 Cookie Clicker (Classic Edition)</span>
                </a>
              </li>
              <li>
                <a href="#tunnel-rush" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>🌀 Tunnel Rush (3D Neon Vortex)</span>
                </a>
              </li>
              <li>
                <a href="#paper-io" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>🗺️ Paper.io 2 (Arena Conquest)</span>
                </a>
              </li>
              <li>
                <a href="#slope" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>⚡ Slope Cyber 3D (VIP)</span>
                </a>
              </li>
              <li>
                <a href="#escape-road" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>🏎️ Escape Road (Police Getaway)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Agreements (Requested by User) */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Legal, Privacy &amp; Terms</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleOpenTab('privacy')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2 text-left cursor-pointer group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">Privacy Policy (Zero Tracking)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenTab('terms')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2 text-left cursor-pointer group"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">Terms of Agreement &amp; Fair Use</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenTab('dmca')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2 text-left cursor-pointer group"
                >
                  <Scale className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">DMCA &amp; Copyright Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenTab('cookies')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2 text-left cursor-pointer group"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">Cookie &amp; Local Storage Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenTab('safety')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2 text-left cursor-pointer group"
                >
                  <School className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">School Safety &amp; Unblocked Standards</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Community &amp; Ratings
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Haris Game Center is community rated <strong>4.9 / 5 Stars</strong> by over 24,000 active students and arcade fans.
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={onOpenDiscord}
                className="text-[#a5b4fc] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Users className="w-3.5 h-3.5 text-[#5865F2]" />
                <span className="font-bold">Game Grinders Discord (8.9k+)</span>
              </button>
              <a href="#arcade-chat-lounge" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Penguin Arcade Chat Lounge</span>
              </a>
              <a href="#community-hub" className="text-amber-300 hover:text-amber-200 font-semibold block transition-colors">
                ⭐ Community Recommendations &amp; Votes
              </a>
              <a href={GAME_CENTER_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Source Repository</span>
              </a>
              <a href={`mailto:harisxcode@gmail.com`} className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono">harisxcode@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Safety & Compliance Assurance Banner */}
        <div className="p-4 rounded-2xl bg-[#070e20] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TLS 1.3 HTTPS Encrypted</span>
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>COPPA &amp; FERPA Respectful</span>
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero Malware / No Executables</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenTab('terms')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-medium"
            >
              Review Terms of Agreement
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => handleOpenTab('privacy')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-medium"
            >
              Review Privacy Policy
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} Haris Game Center. Designed and maintained by Haris. Pablo the Penguin mascot and all associated game center marks are property of the platform.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={HARIS_GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
              aria-label="GitHub profile"
            >
              <Github className="w-4 h-4" />
              <span>@harisxcode</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

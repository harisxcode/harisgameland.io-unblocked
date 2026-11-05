import React, { useState } from 'react';
import { 
  Gamepad2, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  KeyRound,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { UserAccount } from '../types';
import { getAllUsers, setActiveUser, createPlayerAccount, isOwnerAccount, startFreeTrialAccount } from '../utils/auth';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';
import { LegalModal, LegalTab } from './LegalModal';
import { Clock } from 'lucide-react';

interface AuthEntryProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const AVATAR_OPTIONS = ['🐧', '👑', '⚡', '🎮', '🚀', '🔥', '❄️', '🕶️'];

export const AuthEntry: React.FC<AuthEntryProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'trial'>('signin');
  const [username, setUsername] = useState('');
  const [trialName, setTrialName] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐧');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');

  const existingUsers = getAllUsers();

  const handleStartTrial = () => {
    const trialUser = startFreeTrialAccount(trialName.trim());
    onLoginSuccess(trialUser);
  };

  const handleSignIn = (userToLogin?: UserAccount) => {
    if (userToLogin) {
      const isOwner = isOwnerAccount(userToLogin);
      // User request: "when a new account is made or logged in to, for the tokens to be set automatically to 0"
      if (!isOwner && (!userToLogin.penguinPoints || userToLogin.penguinPoints > 0)) {
        userToLogin.penguinPoints = 0;
      }
      setActiveUser(userToLogin);
      onLoginSuccess(userToLogin);
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Please enter your player gamer tag or nickname');
      return;
    }

    const found = existingUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (found) {
      const isOwner = isOwnerAccount(found);
      if (!isOwner) {
        found.penguinPoints = 0;
      }
      setActiveUser(found);
      onLoginSuccess(found);
    } else {
      // Auto create or suggest sign up
      const newUser = createPlayerAccount(username.trim(), fullName || username.trim(), selectedAvatar);
      onLoginSuccess(newUser);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter a gamer username');
      return;
    }

    const existing = existingUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (existing) {
      setErrorMessage('That gamer tag is already in use. Please sign in or pick another!');
      return;
    }

    const newUser = createPlayerAccount(username.trim(), fullName.trim(), selectedAvatar);
    onLoginSuccess(newUser);
  };

  const handleQuickGuest = () => {
    const guestUser = createPlayerAccount(`Guest-${Math.floor(1000 + Math.random() * 9000)}`, 'Guest Player', '🐧');
    onLoginSuccess(guestUser);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-[#091124] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl">
        
        {/* Pablo Mascot Presentation */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-24 h-24 mb-3 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/10">
            <img 
              src={pabloMascotImg} 
              alt="Pablo the Retro Penguin Emoji Mascot" 
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-widest text-center">
              PABLO
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>HARIS GAME CENTER GATEKEEPER</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            Sign In to Unlock Games
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Pablo requires player authentication to access 100% unblocked games and save your Penguin Points!
          </p>
        </div>

        {/* Tab Toggle with 15-Min Free Trial Option */}
        <div className="grid grid-cols-3 bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-6 gap-1">
          <button
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Player Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Account
          </button>
          <button
            onClick={() => { setMode('trial'); setErrorMessage(null); }}
            className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              mode === 'trial'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>15m Trial</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {mode === 'signin' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Player Gamer Tag / Nickname
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SpeedRacer, CyberPenguin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                />
              </div>
            </div>

            <button
              onClick={() => handleSignIn()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide transition-all transform active:scale-98 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <span>Enter Game Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Saved Player Selector */}
            {existingUsers.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Quick Select Profile:
                </p>
                <div className="flex flex-col gap-1.5">
                  {existingUsers.slice(0, 3).map((user) => {
                    const isOwner = isOwnerAccount(user);
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleSignIn(user)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-colors text-left group ${
                          isOwner 
                            ? 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-500/50 shadow-sm shadow-amber-500/20' 
                            : 'bg-slate-950/60 hover:bg-cyan-950/40 border-slate-800/80 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{user.avatar}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                                {user.username}
                              </span>
                              {isOwner && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                                  OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isOwner ? 'harisxcode@gmail.com' : `${user.penguinPoints} pts ${user.isVip ? '· VIP 👑' : ''}`}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] font-semibold ${isOwner ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {isOwner ? 'Admin →' : 'Play →'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : mode === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Mascot Avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`py-2 text-xl rounded-xl border text-center transition-all ${
                      selectedAvatar === av
                        ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Gamer Tag
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. PabloDrifter"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Create Account (Earn Tokens From 0)</span>
            </button>
          </form>
        ) : (
          /* 15-Minute Free Trial Form */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>15-Minute Free VIP Trial</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Experience full VIP access with zero credit card required! Play all exclusive games and earn in-game tokens starting from 0. VIP games grant increased token rewards!
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trial Gamer Tag (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={trialName}
                  onChange={(e) => setTrialName(e.target.value)}
                  placeholder="e.g. TrialRacer77"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleStartTrial()}
                />
              </div>
            </div>

            <button
              onClick={handleStartTrial}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Start 15-Minute Free VIP Trial</span>
            </button>
          </div>
        )}

        {/* Guest Access Fallback */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleQuickGuest}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors font-medium underline underline-offset-4 cursor-pointer"
            >
              Instant Guest Pass (0 Tokens)
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={handleStartTrial}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-bold underline underline-offset-4 cursor-pointer flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              <span>15m VIP Trial</span>
            </button>
          </div>

          {/* Website Rules & Terms Notice */}
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <span>⚖️ Mandatory Website Terms &amp; Rules:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Haris Game Center is a <strong>friendly learning website</strong>. <strong>NO cyberbullying</strong> is allowed. Everyone must be nice or an automated complaint will be dispatched to school admins (active cameras &amp; monitors active). You will be required to review and accept the official rules upon login.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => { setLegalTab('terms'); setIsLegalModalOpen(true); }}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer font-bold"
              >
                Read Legal Terms &amp; Rules →
              </button>
              <button
                type="button"
                onClick={() => { setLegalTab('privacy'); setIsLegalModalOpen(true); }}
                className="text-slate-400 hover:text-slate-200 underline underline-offset-2 cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Safety & Performance Notice Footer */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> 0% Server Lag
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Unblocked Play
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP Perks
        </span>
        <span>•</span>
        <button
          type="button"
          onClick={() => { setLegalTab('dmca'); setIsLegalModalOpen(true); }}
          className="hover:text-slate-300 underline underline-offset-2 cursor-pointer"
        >
          DMCA Notice
        </button>
      </div>

      {/* Embedded Legal Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};

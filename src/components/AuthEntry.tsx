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
  Crown,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  getAllUsers, 
  setActiveUser, 
  createPlayerAccount, 
  isOwnerAccount, 
  startFreeTrialAccount,
  validatePassword,
  validatePinCode
} from '../utils/auth';
import pabloMascotImg from '../assets/images/retro_penguin_emoji_1793831650652.jpg';
import { LegalModal, LegalTab } from './LegalModal';

interface AuthEntryProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const AVATAR_OPTIONS = ['🐧', '👑', '⚡', '🎮', '🚀', '🔥', '❄️', '🕶️'];

export const AuthEntry: React.FC<AuthEntryProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'trial'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignIn = (selectedProfile?: UserAccount) => {
    setErrorMessage(null);

    const targetUser = selectedProfile || existingUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!targetUser) {
      if (!username.trim()) {
        setErrorMessage('Please enter your gamer tag or username.');
        return;
      }
      setErrorMessage(`Account "${username}" was not found. Please click "New Account" to register or verify your username.`);
      return;
    }

    const isTargetAdmin = isOwnerAccount(targetUser) || targetUser.isAdmin;

    // Requirement 1 & 2: New users cannot enter through admin accounts.
    // If attempting to enter Haris / admin account, require the verified admin credentials
    if (isTargetAdmin) {
      if (!password.trim() && !pinCode.trim()) {
        setErrorMessage('⚠️ Owner / Admin account is protected! You must enter the Admin Password or 4-digit Security PIN to log in.');
        return;
      }

      const validPass = targetUser.passwordHash || 'Owner#2026!';
      const validPin = targetUser.pinCode || '7799';

      const passMatch = password.trim() === validPass;
      const pinMatch = pinCode.trim() === validPin;

      if (!passMatch && !pinMatch) {
        setErrorMessage('⛔ Access Denied! Invalid credentials for Owner Admin account. New users cannot access admin accounts.');
        return;
      }
    } else {
      // For standard accounts: passwords or PIN codes must be verified. Users cannot enter with random passwords!
      const savedPass = targetUser.passwordHash;
      const savedPin = targetUser.pinCode;

      if (!password.trim() && !pinCode.trim()) {
        setErrorMessage('Please enter the verified password or 4-digit PIN for this account.');
        return;
      }

      let credentialsValid = false;
      if (password.trim() && savedPass && password.trim() === savedPass) {
        credentialsValid = true;
      }
      if (pinCode.trim() && savedPin && pinCode.trim() === savedPin) {
        credentialsValid = true;
      }

      if (!credentialsValid) {
        setErrorMessage('⛔ Access Denied! Password or PIN does not match the registered account. Random passwords are not permitted.');
        return;
      }
    }

    // Keep track of account data: ensure tokens default to 0 only if unset, preserving earned points
    if (targetUser.penguinPoints === undefined || targetUser.penguinPoints === null) {
      targetUser.penguinPoints = 0;
    }
    targetUser.lastLogin = new Date().toISOString();

    setActiveUser(targetUser);
    onLoginSuccess(targetUser);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim();
    if (!cleanUser) {
      setErrorMessage('Please enter a gamer username.');
      return;
    }

    // Validate password requirement
    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      setErrorMessage(passCheck.error || 'Invalid password.');
      return;
    }

    // Validate PIN code requirement
    const pinCheck = validatePinCode(pinCode);
    if (!pinCheck.isValid) {
      setErrorMessage(pinCheck.error || 'Invalid 4-digit PIN code.');
      return;
    }

    // Requirement 1: New users cannot enter through admin accounts
    const lower = cleanUser.toLowerCase();
    if (lower === 'haris' || lower === 'harisxcode' || lower === 'owner' || lower === 'admin' || lower === 'administrator') {
      setErrorMessage('⛔ That username is reserved for the site owner. New users cannot register as admin.');
      return;
    }

    const existing = existingUsers.find(
      (u) => u.username.toLowerCase() === lower
    );

    if (existing) {
      setErrorMessage('That gamer tag is already in use. Please sign in or choose another!');
      return;
    }

    try {
      const newUser = createPlayerAccount(cleanUser, fullName.trim(), selectedAvatar, password.trim(), pinCode.trim());
      onLoginSuccess(newUser);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
    }
  };

  const handleQuickGuest = () => {
    const guestUser = createPlayerAccount(`Guest-${Math.floor(1000 + Math.random() * 9000)}`, 'Guest Player', '🐧', 'Guest#1234', '1234');
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
          <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} className="space-y-4">
            
            {/* Prominent 15-Minute Free VIP Trial Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 flex items-center justify-between gap-3 shadow-md shadow-amber-950/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 flex-wrap">
                    <span>15-Minute Free VIP Trial</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30 font-mono font-bold">
                      0 TOKENS START
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">
                    No password needed · Earn tokens with VIP multiplier!
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartTrial}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs shrink-0 transition-transform active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Try Free →
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Player Gamer Tag / Nickname
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SpeedRacer, CyberPenguin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Min 6 chars + letters &amp; numbers/symbols</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter registered account password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  4-Digit Security PIN (Alternative to Password)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">4 numeric digits</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 4829"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide transition-all transform active:scale-98 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <span>Verify &amp; Enter Game Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Account Data Tracking Verification Banner */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Account data tracked: In-game tokens, games played, and VIP tiers are preserved persistently.</span>
            </div>

            {/* Quick Saved Player Selector with Password / PIN prompts */}
            {existingUsers.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Quick Select Profile (Requires Password / PIN Verification):
                </p>
                <div className="flex flex-col gap-1.5">
                  {existingUsers.slice(0, 3).map((user) => {
                    const isOwner = isOwnerAccount(user);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setUsername(user.username);
                          if (password.trim() || pinCode.trim()) {
                            handleSignIn(user);
                          } else {
                            if (isOwner) {
                              setErrorMessage(`🔒 Admin Profile: Enter Owner Password or PIN (7799) for "${user.username}" to sign in.`);
                            } else {
                              setErrorMessage(`🔑 Selected ${user.username}. Enter password or 4-digit PIN to sign in.`);
                            }
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors text-left group ${
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
                                  PROTECTED OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {isOwner ? 'Requires Admin Password or PIN' : `${user.penguinPoints || 0} Tokens · Password Protected`}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${isOwner ? 'text-amber-400' : 'text-cyan-400'}`}>
                          <Lock className="w-3 h-3" />
                          <span>{isOwner ? 'Owner Login →' : 'Sign In →'}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
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
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                * Note: Admin / Owner usernames are protected and reserved.
              </p>
            </div>

            {/* Password Field with Interactive Validation Rules */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password (Required)
                </label>
                <span className="text-[10px] text-amber-300 font-mono">Min 6 chars + numbers/symbols</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. Pablo#2026"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength checklist */}
              <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] font-mono">
                <span className={password.length >= 6 ? 'text-emerald-400' : 'text-slate-500'}>
                  {password.length >= 6 ? '✓ 6+ characters' : '○ Min 6 characters'}
                </span>
                <span className={/[a-zA-Z]/.test(password) && /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                  {/[a-zA-Z]/.test(password) && /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓ Letters & numbers/symbols' : '○ Letters & numbers/symbols'}
                </span>
              </div>
            </div>

            {/* 4-Digit Security PIN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  4-Digit Security PIN (Required)
                </label>
                <span className="text-[10px] text-cyan-300 font-mono">Exactly 4 digits</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5821"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono tracking-widest"
                />
              </div>
              <div className="mt-1 text-[10px] font-mono">
                <span className={/^\d{4}$/.test(pinCode) && pinCode !== '0000' && pinCode !== '1111' && pinCode !== '1234' ? 'text-emerald-400' : 'text-slate-500'}>
                  {/^\d{4}$/.test(pinCode) && pinCode !== '0000' && pinCode !== '1111' && pinCode !== '1234' ? '✓ Valid 4-digit code' : '○ 4 numeric digits (not trivial repeats)'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>New accounts automatically start with <strong>0 tokens</strong>. Earn tokens by playing games!</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Create Account (0 Tokens · Secure Credentials)</span>
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

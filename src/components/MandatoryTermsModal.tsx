import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Heart, 
  BookOpen, 
  Scale, 
  Check, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  Video, 
  BellRing
} from 'lucide-react';
import { UserAccount } from '../types';
import { playArcadeSfx } from '../utils/audio';
import pabloMascotImg from '../assets/images/retro_pablo_mascot_1793055166374.jpg';

interface MandatoryTermsModalProps {
  isOpen: boolean;
  currentUser: UserAccount | null;
  onAgreeAndContinue: () => void;
  onSignOut: () => void;
}

export function MandatoryTermsModal({
  isOpen,
  currentUser,
  onAgreeAndContinue,
  onSignOut
}: MandatoryTermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Check if scrolled near the bottom (within 40px)
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAgree = () => {
    playArcadeSfx('click');
    onAgreeAndContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-auto bg-[#081024] border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-950/90 overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Attention Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0d1e44] via-[#091533] to-[#0d1e44] border-b border-cyan-500/30 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 shrink-0">
              <img 
                src={pabloMascotImg} 
                alt="Pablo the Penguin" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Official Website Rules &amp; Agreement
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  REQUIRED TO PLAY
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-display">
                Legal Terms, Safety &amp; Conduct Agreement
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <span>Player:</span>
            <span className="font-bold text-cyan-300">@{currentUser.username}</span>
          </div>
        </div>

        {/* Live Surveillance & Monitoring Alert Pill */}
        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200 shrink-0">
          <div className="flex items-center gap-2 font-mono">
            <Video className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>
              <strong>Active Digital Monitoring &amp; Cameras Engaged:</strong> All user activities, comments, and interactions are continuously monitored.
            </span>
          </div>
          <span className="hidden md:inline text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
            RECORDING ON
          </span>
        </div>

        {/* Scrollable Terms Content */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed bg-[#050a1c]"
        >
          
          {/* Section 1: Friendly Learning Website */}
          <div className="p-5 rounded-2xl bg-[#091535] border border-cyan-500/30 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3>1. A Friendly Learning &amp; Educational Recreation Sanctuary</h3>
            </div>
            <p>
              Welcome to <strong>Haris Game Center</strong>. This platform is intentionally constructed as a wholesome, positive, and friendly learning environment. While we provide high-performance, 0% lag unblocked gaming for players, our fundamental mission is to stimulate critical thinking, spatial logic, reaction time, strategic problem solving, and technological curiosity.
            </p>
            <p>
              Games like Slope 3D, 1v1.LOL Arena, Escape Road, Retro Bowl, and Drive Mad challenge your hand-eye coordination, quick decision-making under pressure, and geometric spatial awareness. We believe gaming should serve as a healthy, rejuvenating educational brain break during study sessions and not as a distraction. Every player on this website is expected to cultivate an uplifting atmosphere of continuous improvement, intellectual curiosity, and friendly camaraderie.
            </p>
          </div>

          {/* Section 2: No Cyberbullying Allowed */}
          <div className="p-5 rounded-2xl bg-rose-950/30 border-2 border-rose-500/40 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-rose-200 font-bold text-base font-display">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3>2. Strict Anti-Cyberbullying Rule: Zero Tolerance</h3>
            </div>
            <p>
              There is <strong>ABSOLUTELY NO CYBERBULLYING ALLOWED</strong> on this website under any circumstance. That category of behavior is strictly prohibited. This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-100">
              <li>Mocking, insulting, belittling, or harassing other players about their skill level, high scores, or gameplay performance.</li>
              <li>Using vulgarity, profanity, slurs, threats, sexually suggestive remarks, or discriminatory language in comments, gamer tags, or chat messages.</li>
              <li>Attempting to intimidate, embarrass, exclude, or defame any student, peer, or community member.</li>
              <li>Spamming hateful messages, unsolicited trolling, or posting negative comments on someone else&apos;s achievements.</li>
            </ul>
            <p className="text-xs text-rose-200 font-medium">
              We uphold zero tolerance. If you cannot say something constructive, encouraging, or kind, do not say anything at all. Violators will face immediate termination of access without warning.
            </p>
          </div>

          {/* Section 3: Be Nice or a Complaint Will Be Sent Out - Cameras & Observers */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-amber-200 font-bold text-base font-display">
              <Eye className="w-5 h-5 text-amber-400" />
              <h3>3. Mandatory Kindness — Active Cameras, Observers &amp; Complaint System</h3>
            </div>
            <p>
              <strong>Everyone using this website MUST be nice, respectful, and courteous at all times.</strong> If anyone fails to abide by this standard, <strong>a formal complaint will be sent out immediately.</strong>
            </p>
            <p>
              Please take notice: <strong>this website has digital security cameras, audit logs, automated telemetry watchers, and moderators always actively looking and monitoring player activities.</strong> Your keystrokes, comment submissions, user handles, IP network logs, and interaction timestamps are continuously monitored and inspected by automated safety systems and human supervisors.
            </p>
            <p>
              If a player engages in cyberbullying, rudeness, cheating, or abusive speech, our automated safety engine immediately flags the account. An official violation report and formal complaint containing exact transcripts, timestamps, and account details will be dispatched directly to school administrators, classroom instructors, and guardians. You are never invisible here—act with the same respect and decency you would under the direct watch of your teachers and peers.
            </p>
          </div>

          {/* Section 4: Academic Integrity, Respectful Sportsmanship & Fair Play */}
          <div className="p-5 rounded-2xl bg-[#091535] border border-cyan-500/30 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <Heart className="w-5 h-5 text-emerald-400" />
              <h3>4. Digital Sportsmanship, Honest Scoring &amp; Student Responsibility</h3>
            </div>
            <p>
              Haris Game Center is built on fair play and genuine achievement. You agree to submit only honest, legitimate high scores that you personally earned through legitimate gameplay. The use of memory injectors, automated score bots, cheating scripts, or fabricated screenshots is strictly prohibited.
            </p>
            <p>
              Furthermore, you acknowledge that gaming on this website is an earned privilege. You pledge to prioritize your academic homework, school assignments, and teacher instructions first before gaming. Use our classroom stealth mode responsibly, support fellow grinders in the community lounge, and help keep Haris Game Center the safest, friendliest unblocked gaming hub on the web.
            </p>
          </div>

          {/* Read Confirmation Notice */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">
                Summary of Your Legal &amp; Behavioral Commitment:
              </span>
              <span>
                By clicking below, you legally and ethically pledge to treat every player with kindness, adhere to the zero-tolerance anti-cyberbullying rules, respect the learning purpose of the site, and acknowledge that active cameras and watchers will immediately dispatch complaints for any misconduct.
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className="px-6 py-4 bg-[#0a1430] border-t border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Confirmation Checkbox */}
          <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-cyan-500/40 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="font-medium">
              I have read the rules and agree there is no cyberbullying and to always be nice.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                playArcadeSfx('click');
                onSignOut();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Decline &amp; Sign Out</span>
            </button>

            <button
              onClick={handleAgree}
              disabled={!checkboxChecked}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>I Agree and Understand</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

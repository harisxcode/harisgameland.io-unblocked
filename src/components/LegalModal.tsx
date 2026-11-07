import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Cookie, 
  School, 
  CheckCircle2, 
  Mail, 
  Copy, 
  Check, 
  Crown,
  Award
} from 'lucide-react';
import { playArcadeSfx } from '../utils/audio';

export type LegalTab = 'privacy' | 'terms' | 'dmca' | 'cookies' | 'safety' | 'license';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('harisxcode@gmail.com');
    setCopiedEmail(true);
    playArcadeSfx('click');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const MIT_LICENSE_TEXT = `MIT License

Copyright (c) 2026 Haris (Haris Game Center) & Pablo the Penguin Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(MIT_LICENSE_TEXT);
    setCopiedLicense(true);
    playArcadeSfx('click');
    setTimeout(() => setCopiedLicense(false), 2500);
  };

  const tabs = [
    { id: 'privacy' as LegalTab, label: 'Privacy Policy', icon: ShieldCheck, badge: 'Zero Tracking' },
    { id: 'terms' as LegalTab, label: 'Terms of Agreement', icon: FileText, badge: 'VIP & Rules' },
    { id: 'dmca' as LegalTab, label: 'DMCA & Copyright', icon: Scale, badge: 'Fair Use & IP' },
    { id: 'cookies' as LegalTab, label: 'Cookie & Storage', icon: Cookie, badge: 'Local Only' },
    { id: 'safety' as LegalTab, label: 'School Safety & Unblocked', icon: School, badge: '100% Secure' },
    { id: 'license' as LegalTab, label: 'MIT License', icon: Award, badge: 'Open Source' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#081024] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a1430] border-b border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-display">
                  Haris Game Center Legal &amp; Policies
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Updated 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent student privacy, terms of agreement, DMCA compliance &amp; safety standards
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playArcadeSfx('click');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-[#060c1d] border-b border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playArcadeSfx('click');
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* ================= TAB 1: PRIVACY POLICY ================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Privacy Summary &amp; Zero-Tracking Guarantee</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Haris Game Center is designed specifically for students and casual gamers. We believe web games should be fun, fast, and completely free from invasive ad trackers, browser profiling, and third-party data harvesting.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    1. Information We Collect (Or Rather, Do NOT Collect)
                  </h4>
                  <p className="text-slate-300">
                    We collect <strong>zero Personally Identifiable Information (PII)</strong>. When creating an arcade profile:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300 text-xs">
                    <li>We do <strong>not</strong> collect real legal names, email addresses, phone numbers, or physical locations.</li>
                    <li>We do <strong>not</strong> require passwords or banking credentials.</li>
                    <li>Gamer tags (e.g., &quot;PabloDrifter&quot;) and avatar selections are stored solely inside your local browser storage (<code className="text-cyan-300 font-mono">localStorage</code>).</li>
                  </ul>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    2. Client-Side Data Architecture
                  </h4>
                  <p className="text-slate-300">
                    All player progress—including high scores, game ratings, community recommendation votes, virtual fish collected for Pablo the Penguin, and earned Penguin Points—resides directly on your device. Nothing is sent to external advertising networks or data broker platforms.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    3. Children’s Online Privacy Protection (COPPA &amp; FERPA)
                  </h4>
                  <p className="text-slate-300">
                    Because Haris Game Center is widely accessed on school Chromebooks and public academic networks, our architecture strictly complies with COPPA (Children’s Online Privacy Protection Act) and FERPA standards. We do not engage in behavioral advertising, microphone/camera access, or persistent cross-site fingerprinting.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    4. External Sandboxed Embeds
                  </h4>
                  <p className="text-slate-300">
                    Certain titles (such as Roblox streaming via now.gg) are presented within isolated iframe sandboxes. Those external services maintain their own independent terms and privacy protocols. We advise users to review external providers when interacting outside our native canvas engines.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    5. Right to Erasure &amp; Data Reset
                  </h4>
                  <p className="text-slate-300">
                    You have complete autonomy over your data. Simply clearing your browser cache or clicking &quot;Log Out&quot; in the navigation bar wipes your session instantly.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TERMS OF AGREEMENT ================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Terms of Agreement &amp; Code of Conduct</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    By accessing or continuing to use Haris Game Center (&quot;the Platform&quot;), you agree to be bound by these Terms of Agreement. Please read them thoroughly.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
                    1. Friendly Learning &amp; Educational Recreation Sanctuary
                  </h4>
                  <p className="text-slate-300">
                    Haris Game Center is established as a positive, educational, and friendly learning sanctuary. The games provided on this platform are designed to sharpen cognitive reaction speeds, analytical decision-making, geometric spatial reasoning, and hand-eye coordination during constructive study breaks. Every user agrees to maintain an atmosphere of continuous learning, mutual respect, and positive peer encouragement.
                  </p>
                </section>

                <section className="p-4 rounded-2xl bg-rose-950/30 border-2 border-rose-500/40 space-y-2">
                  <h4 className="text-base font-bold text-rose-200 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-rose-400"></span>
                    2. Strict Anti-Cyberbullying Rule — Zero Tolerance
                  </h4>
                  <p className="text-slate-300">
                    There is <strong>ABSOLUTELY NO CYBERBULLYING ALLOWED</strong> on this website. Any category of cyberbullying is strictly forbidden. This includes derogatory remarks, slurs, harassment, mocking players about high scores, insults in the community lounge, or any form of intimidation. Bullying of any kind results in immediate, permanent banishment from the platform.
                  </p>
                </section>

                <section className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 space-y-2">
                  <h4 className="text-base font-bold text-amber-200 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
                    3. Mandatory Kindness — Active Cameras, Watchers &amp; Complaint Dispatches
                  </h4>
                  <p className="text-slate-300">
                    Everyone using this website <strong>MUST be nice and respectful to everyone at all times</strong>, or a formal complaint will be sent out immediately. This website operates digital security cameras, automated activity monitors, audit trails, and moderators always actively looking and observing platform usage. Any inappropriate conduct or disrespect triggers an automated violation report and formal complaint dispatched directly to school administrators, teachers, and guardians.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
                    4. Penguin Points &amp; VIP Access Policy
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Crown className="w-4 h-4" />
                      <span>Dual VIP Unlock Model ($5.00 USD or 500 Penguin Points)</span>
                    </div>
                    <p className="text-slate-300">
                      • <strong>Free Gameplay Path:</strong> Every user can unlock 100% of VIP games without paying a dime by playing casual titles, rating games, providing feedback, and collecting daily points (500 pts required).
                    </p>
                    <p className="text-slate-300">
                      • <strong>Simulated Supporter Pass:</strong> Instant VIP pass unlocks the premium catalog immediately.
                    </p>
                    <p className="text-slate-300">
                      • <strong>Virtual Currency Clause:</strong> Penguin Points, virtual fish for Pablo, and badges are digital recreational tokens. They hold zero fiat cash value, cannot be redeemed for legal tender, and are non-transferable outside this platform.
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
                    3. Stealth &amp; Panic Disguise Feature
                  </h4>
                  <p className="text-slate-300">
                    The &quot;Stealth Mode&quot; button (and shortcut key <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">]</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">Esc</kbd>) simulates a Google Classroom or Wikipedia research screen. This is provided for personal privacy. Users remain responsible for respecting their local school or workplace technology usage guidelines.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
                    4. Community Recommendations &amp; Ratings
                  </h4>
                  <p className="text-slate-300">
                    Users can submit game recommendations and 5-star ratings. Submissions must not contain offensive language, hate speech, malicious URLs, or harassment. We reserve the right to moderate or reject inappropriate submissions.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
                    5. Disclaimer of Warranties &amp; Limitation of Liability
                  </h4>
                  <p className="text-slate-300">
                    Haris Game Center is provided &quot;AS IS&quot; without warranties of any kind. While we engineer our canvas engines to deliver 0% server lag and 60 FPS performance, we cannot guarantee uninterrupted access in the event of institutional firewall updates or local browser incompatibilities.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* ================= TAB 3: DMCA & COPYRIGHT ================= */}
          {activeTab === 'dmca' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
                <Scale className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">DMCA Takedown &amp; Intellectual Property Policy</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Haris Game Center respects intellectual property rights and adheres to the Digital Millennium Copyright Act (17 U.S.C. § 512).
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-purple-400"></span>
                    1. Open-Source Attributions &amp; Fair Use
                  </h4>
                  <p className="text-slate-300">
                    Many titles featured on this platform are open-source HTML5 Canvas recreations, community-built demakes, or fan tributes distributed under MIT, Apache 2.0, or creative commons licenses. We provide clear repository links to authors on our Developer Hub.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-purple-400"></span>
                    2. Copyright Holder Notice &amp; Takedown Procedure
                  </h4>
                  <p className="text-slate-300">
                    If you are a copyright owner or an authorized agent and believe that content hosted or linked on Haris Game Center infringes upon your copyright, please submit an official DMCA notice containing:
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-slate-300 text-xs">
                    <li>Identification of the copyrighted work claimed to have been infringed.</li>
                    <li>The specific URL or game title within Haris Game Center where the material is located.</li>
                    <li>Your contact information (legal name, address, telephone number, and email address).</li>
                    <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner.</li>
                    <li>A statement, under penalty of perjury, that the information in the notification is accurate and you are authorized to act on behalf of the owner.</li>
                    <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
                  </ol>
                </section>

                <section className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase font-mono text-purple-400">Designated DMCA Agent Contact</div>
                      <div className="font-bold text-white text-base">Haris (Lead Developer)</div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied!' : 'Copy DMCA Email'}</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-mono text-slate-200">harisxcode@gmail.com</span>
                    <span>• Response time: Within 24–48 business hours</span>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ================= TAB 4: COOKIE & STORAGE ================= */}
          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <Cookie className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Cookie &amp; Local Storage Disclosure</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    How we maintain your high scores and game state without using intrusive tracking cookies.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-emerald-400"></span>
                    1. No Marketing or Third-Party Advertising Cookies
                  </h4>
                  <p className="text-slate-300">
                    We do <strong>not</strong> install advertising cookies, retargeting pixels (such as Meta Pixel or Google AdSense), or cross-domain tracking beacons.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-emerald-400"></span>
                    2. LocalStorage Key Catalog
                  </h4>
                  <p className="text-slate-300 mb-2">
                    The following client-side keys are stored exclusively in your browser&apos;s isolated sandboxed storage:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                      <thead className="bg-slate-900 text-slate-300 font-mono">
                        <tr>
                          <th className="p-2.5">Storage Key</th>
                          <th className="p-2.5">Purpose</th>
                          <th className="p-2.5">Data Retention</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-400">
                        <tr>
                          <td className="p-2.5 text-cyan-300 font-semibold">haris_active_user</td>
                          <td className="p-2.5">Current gamer username, avatar &amp; VIP status</td>
                          <td className="p-2.5">Until sign out / cache clear</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-cyan-300 font-semibold">haris_player_accounts</td>
                          <td className="p-2.5">Created player profiles and accumulated points</td>
                          <td className="p-2.5">Persistent on local device</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-cyan-300 font-semibold">haris_pablo_fish</td>
                          <td className="p-2.5">Count of virtual fish fed to Pablo mascot</td>
                          <td className="p-2.5">Persistent on local device</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-cyan-300 font-semibold">haris_favorites</td>
                          <td className="p-2.5">Array of favorited game IDs</td>
                          <td className="p-2.5">Persistent on local device</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-cyan-300 font-semibold">haris_community_ratings</td>
                          <td className="p-2.5">Your 5-star ratings and submitted feedback</td>
                          <td className="p-2.5">Persistent on local device</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ================= TAB 5: SCHOOL SAFETY & UNBLOCKED ================= */}
          {activeTab === 'safety' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
                <School className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">School Safety &amp; Unblocked Infrastructure</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Why Haris Game Center runs with 0% server lag, 100% unblocked safety, and zero executable risks.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-blue-400"></span>
                    1. 100% Web Standards (No Executable Downloads)
                  </h4>
                  <p className="text-slate-300">
                    Unlike shady emulator sites that demand downloading <code className="text-amber-300 font-mono">.exe</code>, <code className="text-amber-300 font-mono">.bat</code>, or suspicious browser extensions, <strong>Haris Game Center runs 100% inside native HTML5 Canvas and WebGL</strong>. There is zero risk of malware, adware, or background crypto mining.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-blue-400"></span>
                    2. Why Our Built-in Games Never 404 or Lag
                  </h4>
                  <p className="text-slate-300">
                    School filters frequently block external proxy redirects and foreign game CDNs. To solve this, all popular games (<em>Retro Bowl, 1v1 Arena, Escape Road, Tunnel Rush, Cookie Clicker, Slope, Drive Mad</em>) are bundled with local interactive canvas code that compiles immediately inside the browser memory. This eliminates external hops, yielding true <strong>0% server lag</strong>.
                  </p>
                </section>

                <section>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-blue-400"></span>
                    3. HTTPS &amp; Cloudflare Zero-Trust Architecture
                  </h4>
                  <p className="text-slate-300">
                    All assets, chiptunes, and scripts are encrypted end-to-end via TLS 1.3 / HTTPS. No unencrypted HTTP packets are transmitted.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* ================= TAB 6: MIT LICENSE & OPEN SOURCE ================= */}
          {activeTab === 'license' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span>The MIT License (MIT)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Open Source &amp; Free Software
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Haris Game Center is fully open-source and released under the permissive, globally recognized MIT License.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyLicense}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  {copiedLicense ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy License</span>
                    </>
                  )}
                </button>
              </div>

              {/* Permission & Condition Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Permissions Granted:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
                    <li><strong>Commercial use:</strong> Deploy, host, or adapt for personal or enterprise hubs.</li>
                    <li><strong>Modification:</strong> Add custom web games, soundtracks, and themes.</li>
                    <li><strong>Distribution:</strong> Share code or fork to your GitHub repository.</li>
                    <li><strong>Private use:</strong> Run offline or locally on school Chromebooks.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-cyan-400 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Conditions &amp; Limitations:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
                    <li><strong>License &amp; Copyright Notice:</strong> Include the original MIT notice in copies.</li>
                    <li><strong>Zero Warranty:</strong> Software is provided "as is" with no guarantee.</li>
                    <li><strong>No Liability:</strong> Authors are not liable for claims or damages.</li>
                    <li><strong>Freedom to Innovate:</strong> Open for educational &amp; gaming communities.</li>
                  </ul>
                </div>
              </div>

              {/* Official License Text Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-bold text-white">Official MIT License Text (LICENSE)</span>
                  <button
                    onClick={handleCopyLicense}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLicense ? 'Copied to Clipboard!' : 'Click to copy text'}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#050b1a] border border-cyan-500/20 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner select-all">
                  {MIT_LICENSE_TEXT}
                </pre>
              </div>

              {/* GitHub Repository Reference */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  GitHub Repository: <strong className="text-white font-mono">harisxcode/game-center</strong>
                </span>
                <span className="text-amber-300 font-mono font-bold">
                  License: MIT
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-[#0a1430] border-t border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Compliance &amp; Safe Harbor Guaranteed</span>
            </span>
            <span>•</span>
            <button
              onClick={handleCopyEmail}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-mono"
            >
              harisxcode@gmail.com
            </button>
          </div>

          <button
            onClick={() => {
              playArcadeSfx('click');
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            I Acknowledge &amp; Understand
          </button>
        </div>

      </div>
    </div>
  );
}

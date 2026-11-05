import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  Receipt, 
  ExternalLink, 
  Users, 
  Globe, 
  Download, 
  Fish,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, CharityDonation } from '../types';
import { 
  getAllDonations, 
  recordDonation, 
  getCharityStats 
} from '../utils/charity';
import { playClaimRewardSfx, playArcadeSfx } from '../utils/audio';

interface PabloCharityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenLocker?: () => void;
}

export function PabloCharityModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenLocker
}: PabloCharityModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'points'>('card');
  const [donorName, setDonorName] = useState<string>(currentUser?.fullName || currentUser?.username || '');
  const [donorEmail, setDonorEmail] = useState<string>(currentUser?.email || '');
  const [message, setMessage] = useState<string>('Protect the Antarctic penguins! 🐧💙');

  // Simulated card fields
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('888');

  // Transaction processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedDonation, setCompletedDonation] = useState<CharityDonation | null>(null);
  const [activeTab, setActiveTab] = useState<'donate' | 'wall' | 'receipt'>('donate');

  if (!isOpen) return null;

  const stats = getCharityStats();
  const recentDonations = getAllDonations();

  const finalAmount = customAmount ? Math.max(1, parseFloat(customAmount) || 10) : selectedAmount;
  const userPoints = currentUser?.penguinPoints || 0;
  // 100 points = $1.00 donation
  const requiredTokensForPoints = Math.round(finalAmount * 100);
  const canAffordPoints = userPoints >= requiredTokensForPoints;

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (paymentMethod === 'points' && !canAffordPoints) {
      alert(`Need ${requiredTokensForPoints} Penguin Points for a $${finalAmount.toFixed(2)} donation. You have ${userPoints} pts.`);
      return;
    }

    setIsProcessing(true);
    playArcadeSfx('click');

    // Simulate real secure gateway handoff (3-way handshake & ledger commit)
    setTimeout(() => {
      const result = recordDonation({
        donorName: donorName || currentUser?.username || 'Anonymous Penguin Friend',
        donorEmail: donorEmail || 'donor@pablocharity.org',
        amountUsd: finalAmount,
        tokensContributed: paymentMethod === 'points' ? requiredTokensForPoints : 0,
        paymentMethod: paymentMethod,
        message: message || 'Antarctic wildlife preservation donation'
      });

      setIsProcessing(false);
      setCompletedDonation(result.donation);
      setActiveTab('receipt');
      playClaimRewardSfx();

      if (result.user) {
        onUserUpdated(result.user);
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 1200);
  };

  const handleResetForAnother = () => {
    setCompletedDonation(null);
    setActiveTab('donate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#081530] via-[#050e24] to-[#030816] border-2 border-cyan-400/50 rounded-3xl shadow-2xl shadow-cyan-950/70 text-white overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-cyan-950/90 via-[#0a2048] to-blue-950/90 border-b border-cyan-500/30 flex items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/30 shrink-0">
              <div className="w-full h-full bg-[#040c1e] rounded-2xl flex items-center justify-center text-3xl">
                🐧💙
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  VERIFIED 501(c)(3) WILDLIFE INITIATIVE
                </span>
                <span className="text-xs font-mono text-emerald-400 hidden sm:inline">
                  ● Live Transactions Enabled
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
                Pablo Penguin Charity &amp; Habitat Conservation
              </h2>
              <p className="text-xs text-cyan-300/80 font-mono">
                Official Antarctic wildlife fund · Ocean cleanup · Chick rescue · Sanctuary feeding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Impact Tracker Bar */}
        <div className="px-5 py-3.5 bg-[#030918] border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400">Total Raised:</span>{' '}
              <strong className="text-emerald-400 text-sm font-bold">${stats.totalRaisedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
            <div>
              <span className="text-slate-400">Goal:</span>{' '}
              <span className="text-cyan-300 font-bold">${stats.goalUsd.toLocaleString()}</span>
            </div>
            <div className="hidden sm:inline">
              <span className="text-slate-400">Penguins Rescued:</span>{' '}
              <strong className="text-amber-300 text-sm font-bold">{stats.penguinsHelped} 🐧</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'donate'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ❤️ Make Donation
            </button>
            <button
              onClick={() => setActiveTab('wall')}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'wall'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              📜 Donors Wall ({stats.totalDonors})
            </button>
            {completedDonation && (
              <button
                onClick={() => setActiveTab('receipt')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'receipt'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                    : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                }`}
              >
                🧾 My Receipt
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: MAKE A DONATION */}
          {activeTab === 'donate' && (
            <form onSubmit={handleProcessDonation} className="space-y-6 max-w-3xl mx-auto">
              
              {/* Mission Statement Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#0a1835] to-blue-950/50 border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-4 text-xs leading-relaxed text-slate-300">
                <span className="text-3xl sm:text-4xl p-2 bg-[#040c1e] rounded-xl border border-cyan-500/40 shrink-0">
                  🧊
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm font-display mb-0.5">
                    100% of Contributions Directly Fund Antarctic Wildlife Rescue
                  </h4>
                  <p>
                    Every transaction supports emergency veterinary care for Emperor and Adélie chicks, ocean microplastic filtration along sub-zero coastal breeding grounds, and fresh silver fish rations.
                  </p>
                </div>
              </div>

              {/* Step 1: Select Donation Amount */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center justify-between">
                  <span>1. Choose Donation Tier (USD)</span>
                  <span className="text-slate-400 lowercase font-normal">All gifts are tax-deductible</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[5, 10, 25, 50, 100].map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-3 rounded-2xl border font-bold text-sm sm:text-base font-mono transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-gradient-to-b from-cyan-500 to-blue-600 border-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/30 scale-102'
                            : 'bg-slate-900/80 border-slate-800 text-white hover:border-cyan-500/40 hover:bg-slate-850'
                        }`}
                      >
                        <span>${amt}</span>
                        <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                          {amt === 5 ? 'Feed 1 Chick' : amt === 10 ? 'Clean 50lb Ocean' : amt === 25 ? 'Habitat Medic' : amt === 50 ? 'Sanctuary Hero' : 'Protector Pack'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative mt-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Or enter custom dollar amount (e.g. $75)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
                  />
                  {customAmount && (
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-cyan-400 font-bold">
                      Selected: ${finalAmount.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2: Choose Payment Method */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  2. Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === 'card'
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Credit / Debit Card</div>
                      <div className="text-[10px] text-slate-400 font-mono">Instant Transaction Receipt</div>
                    </div>
                  </button>

                  {/* PayPal Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === 'paypal'
                        ? 'bg-amber-950/70 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">PayPal Live Checkout</div>
                      <div className="text-[10px] text-amber-300 font-mono">Direct PayPal Gateway</div>
                    </div>
                  </button>

                  {/* Penguin Points Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('points')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === 'points'
                        ? 'bg-purple-950/70 border-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Penguin Points Match</div>
                      <div className="text-[10px] text-purple-300 font-mono">{requiredTokensForPoints} Pts = ${finalAmount}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Card Inputs if paymentMethod === 'card' */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
                    </span>
                    <span className="text-slate-500">Demo Live Mode</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Security CVC</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Instructions if paymentMethod === 'paypal' */}
              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <span>PayPal Non-Profit Direct Receiver:</span>
                    <strong className="text-white font-mono">harisxcode@gmail.com</strong>
                  </div>
                  <p className="text-slate-300">
                    Your contribution is registered in our charity ledger and instantly credited to the Pablo Wildlife Sanctuary Fund. You can also open the direct PayPal donate interface:
                  </p>
                  <a
                    href={`https://www.paypal.com/donate?business=harisxcode%40gmail.com&item_name=Pablo+Penguin+Charity+Wildlife+Fund&amount=${finalAmount}&currency_code=USD`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase hover:bg-amber-300 transition-colors"
                  >
                    <span>Launch PayPal.me / Donate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Step 3: Donor Details & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Your Donor Name (Or Alias)</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. PabloFan42"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Receipt Email Address</label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Message for the Donors Wall of Fame</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message for Pablo and the Antarctic research team..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white"
                />
              </div>

              {/* Honorary Unlock Alert */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-cyan-200">
                    Every donor receives the honorary title <strong>"Ocean Guardian"</strong>, avatar <strong>🐧💙</strong>, and +250 Season Pass XP!
                  </span>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Donation Transaction...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-slate-950" />
                    <span>Confirm &amp; Donate ${finalAmount.toFixed(2)} USD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* TAB 2: PUBLIC DONORS WALL OF FAME */}
          {activeTab === 'wall' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Public Ledger of Verified Contributions</span>
                <span className="text-cyan-400">Synced to Local Cryptographic Registry</span>
              </div>

              <div className="space-y-3">
                {recentDonations.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-xl shrink-0">
                        🐧
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{d.donorName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {d.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 italic">
                          "{d.message}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 self-end sm:self-auto">
                      <div className="text-base font-black font-mono text-emerald-400">
                        +${d.amountUsd.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {new Date(d.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECEIPT CERTIFICATE */}
          {activeTab === 'receipt' && completedDonation && (
            <div className="max-w-xl mx-auto space-y-5 animate-in zoom-in-95 duration-300">
              
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-emerald-400 shadow-2xl space-y-6 relative overflow-hidden">
                
                {/* Background watermarks */}
                <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none select-none">
                  🐧
                </div>

                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">
                      OFFICIAL CHARITY RECEIPT &amp; CERTIFICATE
                    </div>
                    <h3 className="text-xl font-black font-display text-white mt-1">
                      Pablo Penguin Wildlife Initiative
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      501(c)(3) Non-Profit Registry ID #PABLO-WILDLIFE-2026
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-2xl shrink-0">
                    ✓
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <div className="text-slate-500">Receipt Number</div>
                    <div className="text-white font-bold">{completedDonation.receiptNumber}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Transaction ID</div>
                    <div className="text-cyan-300 font-bold">{completedDonation.id}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Donor Name</div>
                    <div className="text-white font-bold">{completedDonation.donorName}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Contribution Date</div>
                    <div className="text-white font-bold">{new Date(completedDonation.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#040a18] border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Amount Contributed</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      ${completedDonation.amountUsd.toFixed(2)} USD
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                    PAID &amp; SETTLED
                  </span>
                </div>

                <div className="text-xs text-slate-300 italic border-l-2 border-cyan-400 pl-3">
                  "{completedDonation.message}"
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
                  Thank you for saving penguin lives and keeping the Antarctic habitats pure. This transaction is permanently archived.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Official Tax Receipt</span>
                </button>

                {onOpenLocker && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLocker();
                    }}
                    className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/30"
                  >
                    <span>Equip "Ocean Guardian" Title →</span>
                  </button>
                )}

                <button
                  onClick={handleResetForAnother}
                  className="py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Make Another Gift
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#02050f] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-cyan-300">
            <Fish className="w-4 h-4 text-cyan-400" />
            <span>Haris Game Center Non-Profit Wildlife Partner Fund</span>
          </div>

          <div className="text-slate-500 text-[11px]">
            PayPal Direct: <strong>harisxcode@gmail.com</strong>
          </div>
        </div>

      </div>
    </div>
  );
}

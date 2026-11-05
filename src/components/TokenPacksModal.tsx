import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Zap, 
  Star, 
  Flame, 
  Crown,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, TokenPack } from '../types';
import { TOKEN_PACKS, buyTokenPackWithUsd } from '../utils/auth';
import { playArcadeSfx } from '../utils/audio';

interface TokenPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onOpenSignIn?: () => void;
}

export function TokenPacksModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenSignIn
}: TokenPacksModalProps) {
  const [selectedPack, setSelectedPack] = useState<TokenPack>(TOKEN_PACKS[1] || TOKEN_PACKS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState<{
    txId: string;
    packName: string;
    tokensAdded: number;
    amountUsd: number;
    newBalance: number;
  } | null>(null);

  if (!isOpen) return null;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      if (onOpenSignIn) {
        onClose();
        onOpenSignIn();
      }
      return;
    }

    setIsProcessing(true);
    playArcadeSfx('click');

    setTimeout(() => {
      const res = buyTokenPackWithUsd(selectedPack.id);
      setIsProcessing(false);

      if (res.success && res.user) {
        onUserUpdated(res.user);
        playArcadeSfx('launch');

        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {}

        setPurchaseReceipt({
          txId: `TX-TOKENS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          packName: selectedPack.name,
          tokensAdded: selectedPack.tokens + selectedPack.bonusTokens,
          amountUsd: selectedPack.priceUsd,
          newBalance: res.user.penguinPoints
        });
      }
    }, 1100);
  };

  const handleReset = () => {
    setPurchaseReceipt(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#060c1d] border-2 border-amber-500/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-amber-950/70"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#12162e] via-[#0d1430] to-[#12162e] border-b border-amber-500/30 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 text-2xl shrink-0">
              🪙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  OFFICIAL ARCADE PACKS
                </span>
                <span className="text-xs text-slate-400 font-mono">Instant USD Checkout</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                In-Game Token Store
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Token Store"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Current balance reminder */}
          <div className="p-3.5 rounded-2xl bg-[#091535] border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🐧</span>
              <div>
                <div className="text-xs text-slate-300">
                  Signed in as: <strong className="text-white">{currentUser?.username || 'Guest'}</strong>
                </div>
                <div className="text-[11px] text-cyan-300 font-mono">
                  Tokens are earned starting from 0 by playing games, or boosted with USD packs!
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Current Balance</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono flex items-center justify-end gap-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{(currentUser?.penguinPoints || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {purchaseReceipt ? (
            /* Receipt Screen */
            <div className="p-6 rounded-3xl bg-[#071328] border-2 border-emerald-400/50 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  PAYMENT SUCCESSFUL
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  +{purchaseReceipt.tokensAdded.toLocaleString()} Tokens Added!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you for supporting Haris Game Center. Your tokens are ready to spend immediately.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="text-white font-bold">{purchaseReceipt.txId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pack Purchased:</span>
                  <span className="text-amber-300 font-bold">{purchaseReceipt.packName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Charged:</span>
                  <span className="text-white font-bold">${purchaseReceipt.amountUsd.toFixed(2)} USD</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-cyan-300 font-bold">
                  <span>New Token Balance:</span>
                  <span>{purchaseReceipt.newBalance.toLocaleString()} Tokens</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Buy Another Pack
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  Return to Arcade
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Token Packs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TOKEN_PACKS.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  const totalTokens = pack.tokens + pack.bonusTokens;

                  return (
                    <div
                      key={pack.id}
                      onClick={() => {
                        playArcadeSfx('click');
                        setSelectedPack(pack);
                      }}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-500/20 via-[#0a1835] to-[#060e22] border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                          : 'bg-[#071024] border-slate-800 hover:border-amber-500/40 hover:bg-[#0a1530]'
                      }`}
                    >
                      {pack.badge && (
                        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border shadow-md ${
                          pack.bestValue 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-300'
                            : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-amber-200'
                        }`}>
                          {pack.badge}
                        </span>
                      )}

                      <div>
                        <div className="text-3xl mb-2">{pack.icon}</div>
                        <h4 className="font-bold text-white text-sm font-display">{pack.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{pack.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-amber-300 font-mono">
                            {totalTokens.toLocaleString()}
                          </span>
                          <span className="text-xs font-mono text-slate-400">Tokens</span>
                        </div>
                        {pack.bonusTokens > 0 && (
                          <div className="text-[10px] font-mono text-emerald-400 font-bold">
                            Includes +{pack.bonusTokens} Bonus!
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-base font-black text-white font-mono">
                            ${pack.priceUsd.toFixed(2)} USD
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePurchase} className="p-5 rounded-2xl bg-[#091535] border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Fast 1-Click Checkout
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Selected: {selectedPack.name} (${selectedPack.priceUsd.toFixed(2)} USD)
                  </span>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'paypal'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    PayPal Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Apple / Google Pay
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">MM/YY</label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">CVC / ZIP</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 text-center font-mono">
                    Instant 1-Click checkout ready with {paymentMethod === 'paypal' ? 'PayPal' : 'Apple / Google Pay'}.
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit SSL Encrypted · Instant Token Delivery</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Processing Purchase...</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 text-slate-950" />
                        <span>Buy {selectedPack.name} (${selectedPack.priceUsd.toFixed(2)})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

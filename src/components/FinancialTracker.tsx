import React, { forwardRef, useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const FinancialTracker = forwardRef<HTMLElement>((props, ref) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const goalAmount = 2400000;
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const [copied, setCopied] = useState(false);
  const accountNumber = "7350104678";
  const bankName = "Wema Bank";
  const accountName = "Bukola D. Adewuyi";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAmountUpdate = (value: string) => {
    const numValue = parseInt(value) || 0;
    setCurrentAmount(Math.min(numValue, goalAmount));
  };

  return (
    <section ref={ref} id="partnerships" className="py-16 md:py-20 px-6 md:px-12 bg-navy-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gold mb-8 md:mb-12 text-center">
          Partnerships & Support
        </h2>
        
        <div className="bg-navy-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-gold/20">
          {/* Progress Bar Section */}
          <div className="mb-8">
            <div className="flex justify-between text-white mb-2 text-sm md:text-base">
              <span className="font-semibold">Progress: ₦{currentAmount.toLocaleString()}</span>
              <span className="font-semibold">Goal: ₦{goalAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-navy-600 rounded-full h-4 md:h-5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-gold to-gold-600 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-right text-sm text-white/60 mt-2">
              {percentage.toFixed(1)}% funded
            </p>
          </div>

          {/* Demo Input - Easily updatable */}
          <div className="mb-6">
            <label className="text-white/80 text-sm block mb-2">Update current amount (Demo):</label>
            <input 
              type="number" 
              value={currentAmount || ''}
              onChange={(e) => handleAmountUpdate(e.target.value)}
              placeholder="Enter amount in Naira"
              className="w-full bg-navy-900 text-white px-4 py-3 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition"
            />
            <p className="text-xs text-white/50 mt-1">* This is a demo input for easy amount updates</p>
          </div>

          {/* Bank Details */}
          <div className="bg-navy-900 rounded-xl p-4 md:p-6 border border-gold/10">
            <p className="text-gold font-semibold mb-3 text-sm uppercase tracking-wide">Bank Transfer Details</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <p className="font-mono text-lg md:text-xl text-gold font-bold tracking-wider">
                  {accountNumber}
                </p>
                <p className="text-white">
                  {bankName} | {accountName}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 bg-gold text-navy-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-600 transition-all transform hover:scale-105"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy Account Number'}
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {copied && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
              Account number copied!
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

FinancialTracker.displayName = 'FinancialTracker';

export default FinancialTracker;

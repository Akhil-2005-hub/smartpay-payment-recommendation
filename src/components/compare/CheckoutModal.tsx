import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Printer, 
  X, 
  Sparkles,
  TrendingUp,
  Receipt,
  Copy,
  Check
} from 'lucide-react';
import { PlatformFeeResult, ServiceCategory } from '../../utils/feeCalculator';
import { PlatformLogo } from '../common/PlatformLogo';
import { useTransactions } from '../../context/TransactionContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformFeeResult | null;
  category: ServiceCategory;
  providerName: string;
  providerId: string;
  consumerIdOrPhone: string;
  planDescription?: string;
  onSuccessComplete?: (txnId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  platform,
  category,
  providerName,
  providerId,
  consumerIdOrPhone,
  planDescription,
  onSuccessComplete,
}) => {
  const { addTransaction } = useTransactions();
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');
  const [processingPhase, setProcessingPhase] = useState<string>('Verifying Gateway...');
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [generatedTxn, setGeneratedTxn] = useState<{
    id: string;
    referenceId: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setGeneratedTxn(null);
      setCopiedTxn(false);
    }
  }, [isOpen]);

  if (!isOpen || !platform) return null;

  const handleStartPayment = () => {
    setStep('processing');
    setProcessingPhase('Verifying UPI handle & biller details...');

    setTimeout(() => {
      setProcessingPhase('Routing through zero-surcharge gateway...');
    }, 900);

    setTimeout(() => {
      setProcessingPhase('Authorizing payment with issuing bank...');
    }, 1800);

    setTimeout(() => {
      // Complete transaction and persist
      const newRecord = addTransaction({
        category,
        providerId,
        providerName,
        accountIdOrPhone: consumerIdOrPhone || 'N/A',
        baseAmount: platform.baseAmount,
        platformId: platform.platformId,
        platformName: platform.platformName,
        convenienceFee: platform.convenienceFee,
        gstAmount: platform.gstAmount,
        cashbackEarned: platform.cashback,
        netPaid: platform.netPayable,
        feesSavedVsWorst: platform.savingsVsWorst,
        paymentMethod: 'UPI',
      });

      setGeneratedTxn({
        id: newRecord.id,
        referenceId: newRecord.referenceId,
        timestamp: newRecord.timestamp,
      });

      setStep('success');
      if (onSuccessComplete) {
        onSuccessComplete(newRecord.id);
      }
    }, 2800);
  };

  const handleCopyId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative transition-all">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {step === 'success' ? 'Payment Completed' : 'Simulated Smart Checkout'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content depending on step */}
        {step === 'review' && (
          <div className="p-6 space-y-5">
            {/* Platform Selection Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformLogo type={platform.platformId} size={42} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {platform.platformName}
                    </h4>
                    {platform.isCheapest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Cheapest Option
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {platform.feeNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill summary details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Service / Provider</span>
                <span className="font-semibold text-slate-900 dark:text-white">{providerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Account / Identifier</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {consumerIdOrPhone || 'Demo Account'}
                </span>
              </div>
              {planDescription && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Selected Pack</span>
                  <span className="font-medium text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                    {planDescription}
                  </span>
                </div>
              )}
            </div>

            {/* Net Amount Breakdown Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Base Bill Amount</span>
                <span className="font-mono font-bold">₹{platform.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Platform Convenience Fee</span>
                <span className={`font-mono font-bold ${platform.convenienceFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {platform.convenienceFee === 0 ? '₹0.00 (Zero Fee)' : `+ ₹${platform.convenienceFee.toFixed(2)}`}
                </span>
              </div>
              {platform.gstAmount > 0 && (
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>GST (18% on convenience fee)</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    + ₹{platform.gstAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {platform.cashback > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Direct Cashback / Discount
                  </span>
                  <span className="font-mono font-bold">- ₹{platform.cashback.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-emerald-300/50 dark:border-emerald-700/50 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Total Net Payable
                </span>
                <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  ₹{platform.netPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Savings callout */}
            {platform.savingsVsWorst > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium">
                <TrendingUp className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  You are saving <strong className="font-mono font-bold">₹{platform.savingsVsWorst.toFixed(2)}</strong> compared to paying on higher-fee competitor platforms!
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStartPayment}
                className="w-2/3 py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Confirm & Pay ₹{platform.netPayable.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Processing animation */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Processing Payment
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                {processingPhase}
              </p>
            </div>

            <div className="max-w-xs mx-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Simulating instant zero-fee settlement via {platform.platformName}. No real bank account debited.
            </div>
          </div>
        )}

        {/* Step: Success Receipt View */}
        {step === 'success' && generatedTxn && (
          <div className="p-6 space-y-5" id="printable-receipt">
            {/* Celebration Badge */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Bill Payment Successful!
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {platform.feeNote}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
                <button
                  type="button"
                  onClick={() => handleCopyId(generatedTxn.id)}
                  className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  {generatedTxn.id}
                  {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Payment Platform</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {platform.platformName}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Provider / Bill</span>
                <span className="font-semibold text-slate-900 dark:text-white">{providerName}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Account ID</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {consumerIdOrPhone || 'Demo Account'}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>UPI Reference (UTR)</span>
                <span className="font-mono text-slate-900 dark:text-white text-[11px]">
                  {generatedTxn.referenceId}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  Total Paid
                </span>
                <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{platform.netPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="flex items-center gap-1.5 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Extra Fees Saved on this bill:
              </span>
              <span className="font-mono font-extrabold text-sm">
                ₹{(platform.savingsVsWorst + platform.cashback).toFixed(2)}
              </span>
            </div>

            {/* Print & Close */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                className="w-1/2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Lock
} from 'lucide-react';
import { CREDIT_CARD_BANKS, getSimulatedBill } from '../../data/providersData';
import { PlatformLogo } from '../common/PlatformLogo';
import { BillLookupDetails } from '../../types';

export const CreditCardSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBankId, setSelectedBankId] = useState<string>('hdfc_bank');
  const [cardNumber, setCardNumber] = useState<string>('4582 3401 9821 7654');
  const [fetchedDetails, setFetchedDetails] = useState<BillLookupDetails | null>(() =>
    getSimulatedBill('hdfc_bank', '4582 3401 9821 7654', 'creditcard')
  );
  const [paymentChoice, setPaymentChoice] = useState<'total' | 'min' | 'custom'>('total');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const currentBank = CREDIT_CARD_BANKS.find((b) => b.id === selectedBankId) || CREDIT_CARD_BANKS[0];

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleBankChange = (id: string) => {
    setSelectedBankId(id);
    const bank = CREDIT_CARD_BANKS.find((b) => b.id === id);
    if (bank) {
      setCardNumber(bank.sampleId);
      const details = getSimulatedBill(id, bank.sampleId, 'creditcard');
      setFetchedDetails(details);
    }
  };

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setTimeout(() => {
      const details = getSimulatedBill(selectedBankId, cardNumber, 'creditcard');
      setFetchedDetails(details);
      setIsFetching(false);
    }, 600);
  };

  const handleProceedToCompare = () => {
    let amount = fetchedDetails?.billAmount || 15000;
    if (paymentChoice === 'min') {
      amount = fetchedDetails?.minimumDue || Math.round(amount * 0.05);
    } else if (paymentChoice === 'custom') {
      amount = Number(customAmount) || 5000;
    }

    const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '7654';

    navigate(
      `/compare/creditcard/${amount}?provider=${selectedBankId}&account=${encodeURIComponent(
        `•••• ${last4}`
      )}&planDesc=${encodeURIComponent(`${currentBank.shortName} Card Repayment - Due ${fetchedDetails?.dueDate || 'Soon'}`)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Bank Selector Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Credit Card Bill Fee Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare processing fees across CRED, Google Pay, PhonePe, and Paytm on credit card bills.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avoid ₹15 to ₹29.50 Credit Card convenience fees</span>
          </div>
        </div>

        {/* Bank options */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select Card Issuer Bank:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CREDIT_CARD_BANKS.map((bank) => {
              const isSelected = bank.id === selectedBankId;
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleBankChange(bank.id)}
                  className={`p-3.5 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PlatformLogo type={bank.logoType} size={36} />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {bank.shortName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      Visa / Mastercard / RuPay
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Number Input Form */}
        <form onSubmit={handleFetchBill} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Card Number (16 Digits)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" /> 256-Bit Encrypted
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardInput}
                placeholder="4582 3401 9821 7654"
                maxLength={19}
                className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isFetching}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>{isFetching ? 'Verifying Card...' : 'Fetch Outstanding'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Outstanding Statement Breakdown */}
      {fetchedDetails && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Statement Balance Fetched
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Card Holder: {fetchedDetails.consumerName} | Payment Due Date: {fetchedDetails.dueDate}
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Ref: {fetchedDetails.billNumber}
            </div>
          </div>

          {/* Payment amount options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentChoice('total')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                paymentChoice === 'total'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Total Outstanding
              </p>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                ₹{fetchedDetails.billAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Recommended to avoid interest
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentChoice('min')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                paymentChoice === 'min'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Minimum Amount Due (5%)
              </p>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                ₹{(fetchedDetails.minimumDue || 850).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                Avoids late payment penalty
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentChoice('custom')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                paymentChoice === 'custom'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Custom Repayment
              </p>
              <p className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
                {customAmount ? `₹${Number(customAmount).toLocaleString('en-IN')}` : 'Enter Custom'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Choose any custom amount
              </p>
            </button>
          </div>

          {paymentChoice === 'custom' && (
            <div className="max-w-sm p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter Custom Repayment Amount (₹)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="5000"
                className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          )}

          {/* Surcharge Warning notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold">Heads Up: Massive Surcharge Discrepancies on Credit Cards</p>
              <p className="mt-0.5 text-rose-800 dark:text-rose-300/90 leading-relaxed">
                Paying a ₹15,000 credit card bill on PhonePe or Paytm can incur convenience charges of up to ₹25 + 18% GST (₹29.50 extra!). In contrast, CRED and Google Pay UPI settle the full balance with ₹0 processing surcharge.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProceedToCompare}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
            >
              <span>
                Compare Surcharges for ₹
                {paymentChoice === 'total'
                  ? fetchedDetails.billAmount.toLocaleString('en-IN')
                  : paymentChoice === 'min'
                  ? (fetchedDetails.minimumDue || 850).toLocaleString('en-IN')
                  : Number(customAmount || 5000).toLocaleString('en-IN')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


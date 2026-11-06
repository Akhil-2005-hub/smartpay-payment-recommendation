import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ELECTRICITY_PROVIDERS, getSimulatedBill } from '../../data/providersData';
import { PlatformLogo } from '../common/PlatformLogo';
import { BillLookupDetails } from '../../types';

export const ElectricitySection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProviderId, setSelectedProviderId] = useState<string>('adani_mumbai');
  const [consumerNumber, setConsumerNumber] = useState<string>('101234567');
  const [fetchedBill, setFetchedBill] = useState<BillLookupDetails | null>(() =>
    getSimulatedBill('adani_mumbai', '101234567', 'electricity')
  );
  const [customAmount, setCustomAmount] = useState<string>('');
  const [useCustomAmount, setUseCustomAmount] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const currentProvider =
    ELECTRICITY_PROVIDERS.find((p) => p.id === selectedProviderId) || ELECTRICITY_PROVIDERS[0];

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) return;
    setIsFetching(true);
    setTimeout(() => {
      const bill = getSimulatedBill(selectedProviderId, consumerNumber, 'electricity');
      setFetchedBill(bill);
      setCustomAmount(bill.billAmount.toString());
      setIsFetching(false);
    }, 600);
  };

  const handleProviderChange = (id: string) => {
    setSelectedProviderId(id);
    const prov = ELECTRICITY_PROVIDERS.find((p) => p.id === id);
    if (prov) {
      setConsumerNumber(prov.sampleId);
      const bill = getSimulatedBill(id, prov.sampleId, 'electricity');
      setFetchedBill(bill);
      setCustomAmount(bill.billAmount.toString());
    }
  };

  const handleProceedToCompare = () => {
    const finalAmount = useCustomAmount
      ? Number(customAmount) || 1000
      : fetchedBill?.billAmount || 1450;

    navigate(
      `/compare/electricity/${finalAmount}?provider=${selectedProviderId}&account=${encodeURIComponent(
        consumerNumber
      )}&planDesc=${encodeURIComponent(`${currentProvider.shortName} Power Bill - ${fetchedBill?.billingMonth || 'Current Cycle'}`)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Provider Selector Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Electricity Bill Surcharge Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your electricity board and avoid ₹3.50 to ₹6.00 processing fees on utility bills.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flat ₹25 Amazon Pay Cashback available</span>
          </div>
        </div>

        {/* Board Options */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select Electricity Distribution Board:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ELECTRICITY_PROVIDERS.map((provider) => {
              const isSelected = provider.id === selectedProviderId;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleProviderChange(provider.id)}
                  className={`p-3.5 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PlatformLogo type={provider.logoType} size={36} />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {provider.shortName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {provider.idLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Consumer Number Input Form */}
        <form onSubmit={handleFetchBill} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {currentProvider.idLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder={currentProvider.sampleId}
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
              <span>{isFetching ? 'Fetching Bill...' : 'Fetch Live Bill'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Fetched Bill Details Card */}
      {fetchedBill && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Verified Consumer Account Details
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Billing Cycle: {fetchedBill.billingMonth} | Due Date: {fetchedBill.dueDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Pay Custom Amount?
              </span>
              <button
                type="button"
                onClick={() => setUseCustomAmount(!useCustomAmount)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  useCustomAmount ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    useCustomAmount ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-600 dark:text-slate-300">Consumer Name</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-sm">
                {fetchedBill.consumerName}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-600 dark:text-slate-300">Units Consumed</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-sm font-mono">
                {fetchedBill.unitsConsumed} kWh
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-600 dark:text-slate-300">Bill Number</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-xs font-mono">
                {fetchedBill.billNumber}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                Bill Due Amount
              </p>
              <p className="font-black text-emerald-800 dark:text-emerald-200 mt-0.5 text-base font-mono">
                ₹{fetchedBill.billAmount}
              </p>
            </div>
          </div>

          {useCustomAmount && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-sm">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter Custom Payment Amount (₹)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="1000"
                className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          )}

          {/* Surcharge alert info */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold">Did you know?</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300/90 leading-relaxed">
                Platforms like Paytm levy up to ₹3.50 + GST on electricity bills, whereas Amazon Pay offers zero convenience charge plus an assured flat ₹25 cashback for bills above ₹500.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProceedToCompare}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
            >
              <span>Compare Gateway Fees for ₹{useCustomAmount ? customAmount || 1000 : fetchedBill.billAmount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


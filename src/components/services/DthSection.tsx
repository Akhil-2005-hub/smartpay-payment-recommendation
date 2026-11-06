import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tv, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  Film
} from 'lucide-react';
import { DTH_PROVIDERS, DTH_PACKS } from '../../data/providersData';
import { PlatformLogo } from '../common/PlatformLogo';

export const DthSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProviderId, setSelectedProviderId] = useState<string>('tataplay');
  const [subscriberId, setSubscriberId] = useState<string>('1098765432');
  const [selectedPackId, setSelectedPackId] = useState<string>('pack-sports-hd');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const currentProvider = DTH_PROVIDERS.find((p) => p.id === selectedProviderId) || DTH_PROVIDERS[0];
  const selectedPack = DTH_PACKS.find((p) => p.id === selectedPackId) || DTH_PACKS[1];

  const handleProviderChange = (id: string) => {
    setSelectedProviderId(id);
    const prov = DTH_PROVIDERS.find((p) => p.id === id);
    if (prov) {
      setSubscriberId(prov.sampleId);
    }
  };

  const handleProceedToCompare = () => {
    const finalAmount = isCustom ? Number(customAmount) || 300 : selectedPack.price;
    const desc = isCustom ? 'Custom DTH Recharge' : selectedPack.name;

    navigate(
      `/compare/dth/${finalAmount}?provider=${selectedProviderId}&account=${encodeURIComponent(
        subscriberId
      )}&planDesc=${encodeURIComponent(`${currentProvider.shortName} - ${desc}`)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Provider Selector Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              DTH Satellite Television Recharge
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recharge Tata Play, Airtel DTH, Dish TV, or Sun Direct with zero extra processing fee.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Set-Top Box Activation</span>
          </div>
        </div>

        {/* DTH Providers */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select DTH Provider:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DTH_PROVIDERS.map((provider) => {
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

        {/* Subscriber ID input */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {currentProvider.idLabel}
          </label>
          <div className="relative max-w-md">
            <input
              type="text"
              value={subscriberId}
              onChange={(e) => setSubscriberId(e.target.value)}
              placeholder={currentProvider.sampleId}
              className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>
      </div>

      {/* Package Selector Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Curated HD & SD Entertainment Packs
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustom(false)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                !isCustom
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Popular Packs
            </button>
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isCustom
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Custom Amount
            </button>
          </div>
        </div>

        {isCustom ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 max-w-md space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Enter Custom Recharge Amount (₹)
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 450"
              className="w-full px-4 py-2.5 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Min recharge amount is ₹50. The amount will be credited to your DTH balance immediately.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DTH_PACKS.map((pack) => {
              const isSelected = selectedPackId === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        ₹{pack.price}
                      </span>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-emerald-500 text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1">
                      {pack.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      {pack.channels}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {pack.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleProceedToCompare}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
          >
            <span>
              Compare Gateway Rates for ₹{isCustom ? customAmount || 300 : selectedPack.price}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


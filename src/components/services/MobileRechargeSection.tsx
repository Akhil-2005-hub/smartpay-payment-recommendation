import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Tv,
  Wifi,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { MOBILE_PROVIDERS, RECHARGE_PLANS } from '../../data/providersData';
import { RechargePlan } from '../../types';
import { PlatformLogo } from '../common/PlatformLogo';

const CIRCLES = [
  'Pan-India',
  'Mumbai & Goa',
  'Delhi NCR',
  'Karnataka (Bengaluru)',
  'Maharashtra',
  'Tamil Nadu & Chennai',
  'Andhra Pradesh & Telangana',
  'Gujarat',
  'Kolkata & West Bengal',
  'UP East & West',
];

export const MobileRechargeSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProviderId, setSelectedProviderId] = useState<string>('jio');
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [selectedCircle, setSelectedCircle] = useState<string>('Pan-India');
  const [planTypeFilter, setPlanTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedValidity, setSelectedValidity] = useState<number | 'all'>('all');
  const [minRating, setMinRating] = useState<number>(0);

  const currentProvider = MOBILE_PROVIDERS.find((p) => p.id === selectedProviderId) || MOBILE_PROVIDERS[0];
  const plansForProvider = RECHARGE_PLANS[selectedProviderId] || [];

  const filteredPlans = useMemo(() => {
    return plansForProvider.filter((plan) => {
      if (planTypeFilter !== 'all' && plan.planType !== planTypeFilter) {
        return false;
      }
      if (selectedValidity !== 'all' && plan.validityDays !== selectedValidity) {
        return false;
      }
      if (minRating > 0 && plan.userRating < minRating) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPrice = plan.price.toString().includes(q);
        const matchesData = plan.dataPerDay.toLowerCase().includes(q);
        const matchesDesc = plan.description.toLowerCase().includes(q);
        const matchesOtt = plan.ottApps.some((ott) => ott.toLowerCase().includes(q));
        if (!matchesPrice && !matchesData && !matchesDesc && !matchesOtt) {
          return false;
        }
      }
      return true;
    });
  }, [plansForProvider, planTypeFilter, selectedValidity, minRating, searchQuery]);

  const handleSelectPlan = (plan: RechargePlan) => {
    navigate(`/compare/mobile/${plan.price}?provider=${selectedProviderId}&account=${encodeURIComponent(mobileNumber)}&planDesc=${encodeURIComponent(plan.description)}`);
  };

  const handleCustomCompare = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = mobileNumber.replace(/\D/g, '');
    const amount = 299; // Default representative amount
    navigate(`/compare/mobile/${amount}?provider=${selectedProviderId}&account=${encodeURIComponent(cleanNum || '9876543210')}&planDesc=${encodeURIComponent('Custom Mobile Recharge')}`);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Mobile & Operator Selection Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Prepaid Mobile Recharge
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select telecom operator, circle, and compare hidden extra platform fees before you pay.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avoid ₹1 to ₹3.50 silent convenience fees</span>
          </div>
        </div>

        {/* Operator Selection Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select Telecom Operator:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MOBILE_PROVIDERS.map((provider) => {
              const isSelected = provider.id === selectedProviderId;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSelectedProviderId(provider.id)}
                  className={`p-3 rounded-2xl flex items-center gap-3 border text-left transition-all ${
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
                      {provider.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields Grid */}
        <form onSubmit={handleCustomCompare} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              10-Digit Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Telecom Circle
            </label>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {CIRCLES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-98"
            >
              <span>Instant Fee Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Plan Filters & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Plan categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Plans' },
              { id: 'unlimited', label: 'Unlimited 5G/4G' },
              { id: 'booster', label: 'Data Booster' },
              { id: 'long_validity', label: 'Long Validity (84/365d)' },
              { id: 'entertainment', label: 'Entertainment OTT' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPlanTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  planTypeFilter === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by data, price, OTT..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Secondary filters: Validity and Rating */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter by:
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedValidity('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                selectedValidity === 'all'
                  ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Any Validity
            </button>
            {[28, 70, 84, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setSelectedValidity(days)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                  selectedValidity === days
                    ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setMinRating(minRating === 4.7 ? 0 : 4.7)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                minRating > 0
                  ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.7★+ Highly Rated</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Available {currentProvider.name} Plans ({filteredPlans.length})
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-300">
            Click any plan to view fee breakdown across Google Pay, PhonePe, Paytm & BHIM
          </span>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching recharge plans found
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-extrabold text-[10px] rounded-bl-xl tracking-wide">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  {/* Top Price & Validity */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        / {plan.validityLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{plan.userRating}</span>
                      <span className="text-slate-600 dark:text-slate-300 font-normal">
                        ({(plan.userReviewsCount / 1000).toFixed(1)}k)
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Data Quota</p>
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {plan.dataPerDay}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Validity</p>
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {plan.validityDays > 1 ? `${plan.validityDays} Days` : 'Base Plan'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {plan.description}
                  </p>

                  {/* Bundled OTT Badges */}
                  {plan.ottApps.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mb-4">
                      {plan.ottApps.map((ott, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-1"
                        >
                          <Tv className="w-2.5 h-2.5" />
                          {ott}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Compare CTA */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-slate-900 dark:text-white bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 flex items-center justify-between transition-all group-hover:bg-emerald-600 group-hover:text-white"
                >
                  <span>Compare Surcharges for ₹{plan.price}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


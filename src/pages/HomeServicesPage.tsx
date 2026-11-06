import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Percent,
  Search
} from 'lucide-react';
import { ServiceCategory } from '../utils/feeCalculator';
import { MobileRechargeSection } from '../components/services/MobileRechargeSection';
import { ElectricitySection } from '../components/services/ElectricitySection';
import { DthSection } from '../components/services/DthSection';
import { CreditCardSection } from '../components/services/CreditCardSection';
import { useTransactions } from '../context/TransactionContext';

export const HomeServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { totalSaved } = useTransactions();

  const currentTab = (searchParams.get('category') as ServiceCategory) || 'mobile';

  const setTab = (cat: ServiceCategory) => {
    setSearchParams({ category: cat });
  };

  // Quick compare widget state
  const [quickAmount, setQuickAmount] = useState<string>('666');
  const [quickCategory, setQuickCategory] = useState<ServiceCategory>('mobile');

  const handleQuickCompare = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(quickAmount) || 299;
    navigate(`/compare/${quickCategory}/${amount}?planDesc=${encodeURIComponent('Quick Surcharge Calculation')}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Value Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-700/60">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Surcharge Engine for India</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Stop Paying Silent <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Platform & Convenience Fees.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Payment apps silently levy ₹1 to ₹29.50 extra on every mobile recharge, electricity bill, and credit card repayment. SmartPay compares real net payable amounts across 8 apps so you always pay the lowest bill.
          </p>

          {/* Quick Stats Ticker */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                <strong className="text-white font-mono font-bold">₹{totalSaved.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</strong> saved by users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free • No Login Required</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Surcharge Calculator widget */}
        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <form
            onSubmit={handleQuickCompare}
            className="bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="w-full sm:w-auto flex items-center gap-2 text-xs font-bold text-white shrink-0">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Quick Compare:</span>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="mobile">Mobile Recharge</option>
                <option value="electricity">Electricity Bill</option>
                <option value="dth">DTH Recharge</option>
                <option value="creditcard">Credit Card Bill</option>
              </select>
            </div>

            <div className="w-full sm:w-44 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                placeholder="666"
                className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto ml-auto py-2 px-5 rounded-xl text-xs font-black text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              <span>Compare All 8 Apps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            {
              id: 'mobile',
              label: 'Mobile Recharge',
              sub: 'Airtel, Jio, Vi, BSNL',
              icon: Smartphone,
              badge: 'Save ₹1-3',
            },
            {
              id: 'electricity',
              label: 'Electricity Bill',
              sub: 'Adani, Tata, BEST, MSEDCL',
              icon: Zap,
              badge: '₹25 Cashback',
            },
            {
              id: 'dth',
              label: 'DTH Recharge',
              sub: 'Tata Play, Airtel, Dish, Sun',
              icon: Tv,
            },
            {
              id: 'creditcard',
              label: 'Credit Card Bill',
              sub: 'HDFC, ICICI, SBI, Axis',
              icon: CreditCard,
              badge: 'Save ₹15-30',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id as ServiceCategory)}
                className={`flex-1 min-w-[210px] p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {tab.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {tab.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {tab.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Service Section View */}
        <div className="pt-2">
          {currentTab === 'mobile' && <MobileRechargeSection />}
          {currentTab === 'electricity' && <ElectricitySection />}
          {currentTab === 'dth' && <DthSection />}
          {currentTab === 'creditcard' && <CreditCardSection />}
        </div>
      </div>

      {/* Trust & Transparency Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            NPCI & BHIM UPI Standard
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We adhere strictly to official National Payments Corporation of India (NPCI) directives ensuring free peer-to-merchant UPI payments without hidden platform surcharges.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Percent className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Exact GST & Net Breakdown
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Other apps hide 18% GST inside the final summary. SmartPay transparently splits base recharge, platform commission, GST, and real cashbacks.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Save ₹300 - ₹1,200 Annually
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Paying 4 mobile recharges, monthly electricity, and 2 credit card bills silently drains over ₹800 in fees every year. SmartPay eliminates 100% of it.
          </p>
        </div>
      </div>
    </div>
  );
};


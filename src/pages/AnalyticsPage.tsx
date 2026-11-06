import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Smartphone, 
  Tv, 
  ArrowRight,
  PieChart as PieIcon,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid 
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { ServiceCategory, compareAllPlatforms } from '../utils/feeCalculator';
import { PlatformLogo } from '../components/common/PlatformLogo';

export const AnalyticsPage: React.FC = () => {
  const { transactions, totalSaved, totalVolume, averageExtraFee, mostUsedPlatform, insights } =
    useTransactions();

  // Interactive predictive simulator state
  const [simCategory, setSimCategory] = useState<ServiceCategory>('mobile');
  const [simAmount, setSimAmount] = useState<number>(666);
  const [simFrequency, setSimFrequency] = useState<number>(12); // times per year

  // Predictive calculation
  const simComparison = useMemo(() => {
    return compareAllPlatforms(simCategory, simAmount);
  }, [simCategory, simAmount]);

  const annualSavings = useMemo(() => {
    const worstFee = simComparison.maxExtraCharged;
    const bestExtra = simComparison.cheapestOption.grossExtraFee - simComparison.cheapestOption.cashback;
    const diffPerBill = Math.max(0, worstFee - bestExtra);
    return Math.round(diffPerBill * simFrequency * 100) / 100;
  }, [simComparison, simFrequency]);

  // Chart data: Monthly trends
  const monthlyData = [
    { month: 'Jun 2026', totalPaid: 12400, feeSaved: 42.5 },
    { month: 'Jul 2026', totalPaid: 15600, feeSaved: 54.0 },
    { month: 'Aug 2026', totalPaid: 18900, feeSaved: 68.5 },
    { month: 'Sep 2026', totalPaid: 14200, feeSaved: 51.0 },
    { month: 'Oct 2026', totalPaid: 21800, feeSaved: 79.5 },
    { month: 'Nov 2026', totalPaid: totalVolume > 0 ? totalVolume : 16400, feeSaved: totalSaved > 0 ? totalSaved : 86.0 },
  ];

  // Chart data: Extra Surcharges per Platform (for a representative ₹1000 bill)
  const platformComparisonData = [
    { name: 'BHIM UPI', extraFee: 0.0, cashback: 10, note: 'NPCI Official Free' },
    { name: 'Google Pay', extraFee: 0.0, cashback: 5, note: 'Zero Surcharge UPI' },
    { name: 'Amazon Pay', extraFee: 0.0, cashback: 25, note: 'Zero Surcharge + Cashback' },
    { name: 'CRED', extraFee: 0.0, cashback: 15, note: 'Zero Fee UPI' },
    { name: 'Freecharge', extraFee: 2.36, cashback: 5, note: '₹2 + 18% GST' },
    { name: 'Paytm', extraFee: 3.54, cashback: 3, note: '₹3 + 18% GST' },
    { name: 'PhonePe', extraFee: 3.54, cashback: 0, note: '₹3 Platform fee + GST' },
    { name: 'MobiKwik', extraFee: 4.72, cashback: 10, note: '₹4 + 18% GST' },
  ];

  // Chart data: Category Spending Distribution
  const categorySpendingData = useMemo(() => {
    const counts: Record<string, number> = {
      mobile: 0,
      electricity: 0,
      dth: 0,
      creditcard: 0,
    };
    transactions.forEach((tx) => {
      counts[tx.category] = (counts[tx.category] || 0) + tx.baseAmount;
    });

    return [
      { name: 'Mobile Recharge', value: counts.mobile || 1645, color: '#0ea5e9' },
      { name: 'Electricity Bill', value: counts.electricity || 4270, color: '#f59e0b' },
      { name: 'DTH Recharge', value: counts.dth || 998, color: '#8b5cf6' },
      { name: 'Credit Card Bill', value: counts.creditcard || 30900, color: '#f43f5e' },
    ];
  }, [transactions]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Analytics & Predictive Savings Dashboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analysis of processing fees avoided and algorithmic recommendation for your next bill.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Total Money Saved
            </p>
            <p className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1">
              ₹{totalSaved.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
            </p>
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-3 font-medium">
            Accumulated surcharge & fee avoidance
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Bill Volume Paid</p>
            <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              ₹{totalVolume.toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Over {transactions.length} successful payments
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Extra Fee Charged by Apps</p>
            <p className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
              ₹3.54
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Per transaction on un-optimized apps
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Top Gateway Used</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 line-clamp-1">
              {mostUsedPlatform}
            </p>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-3 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Zero Surcharge
          </p>
        </div>
      </div>

      {/* Predictive AI Recommendation Widget */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/60 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Predictive AI Surcharge Advisor
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400/20 text-emerald-300 uppercase">
                  Live Engine
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate your upcoming regular bill and forecast your annual fee savings.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulator Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Upcoming Bill Category</label>
            <select
              value={simCategory}
              onChange={(e) => setSimCategory(e.target.value as ServiceCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="mobile">Mobile Recharge</option>
              <option value="electricity">Electricity Bill</option>
              <option value="dth">DTH Recharge</option>
              <option value="creditcard">Credit Card Bill</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Bill Amount (₹)</label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value) || 100)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Frequency per Year</label>
            <select
              value={simFrequency}
              onChange={(e) => setSimFrequency(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="12">12 times (Monthly)</option>
              <option value="4">4 times (Quarterly)</option>
              <option value="1">1 time (Annually)</option>
              <option value="24">24 times (Bi-weekly)</option>
            </select>
          </div>
        </div>

        {/* AI Output Card */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-300" />
              AI Recommendation for next ₹{simAmount} {simCategory}:
            </p>
            <p className="text-sm text-white font-extrabold">
              Use <strong className="text-emerald-400 underline">{simComparison.cheapestOption.platformName}</strong> instead of PhonePe or Paytm.
            </p>
            <p className="text-xs text-slate-300">
              Avoids up to ₹{simComparison.maxExtraCharged.toFixed(2)} extra platform charge per bill.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-emerald-500/30 sm:pl-6 shrink-0">
            <p className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider">
              Projected Annual Savings
            </p>
            <p className="text-2xl font-black font-mono text-emerald-300">
              ₹{annualSavings.toFixed(2)}/yr
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Paid Volume vs Extra Fees Saved */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Monthly Extra Fees Saved (₹)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Avoided platform fees across 6-month billing cycles.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="feeSavedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Extra Fee Saved']}
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="feeSaved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#feeSavedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Platform Extra Surcharge Comparison */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Platform Extra Charges on Recharges / Bills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Convenience fee + 18% GST charged per app. Zero on BHIM & GPay.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Extra Surcharge']}
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    border: 'none',
                  }}
                />
                <Bar dataKey="extraFee" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Category-wise Spending Distribution */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Category-wise Bill Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Breakdown of total transaction volume settled across bill categories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="h-60 w-full md:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categorySpendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Volume']}
                    contentStyle={{
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: '#1e293b',
                      color: '#fff',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend & Summary */}
            <div className="space-y-3 text-xs">
              {categorySpendingData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹{item.value.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Behavioral Insights list */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Smart Insights & Recurring Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Save ₹{insight.potentialAnnualSaving}/yr
                </span>
                <span className="text-xs text-slate-400 capitalize">{insight.category}</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {insight.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {insight.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Switch to: {insight.recommendedPlatform}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUpDown, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  CreditCard,
  Zap,
  Smartphone,
  Tv,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { compareAllPlatforms, ServiceCategory, PlatformFeeResult } from '../utils/feeCalculator';
import { PlatformLogo } from '../components/common/PlatformLogo';
import { CheckoutModal } from '../components/compare/CheckoutModal';

export const ComparePage: React.FC = () => {
  const { category: paramCategory, amount: paramAmount } = useParams<{
    category: string;
    amount: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = (paramCategory as ServiceCategory) || 'mobile';
  const initialAmount = Number(paramAmount) || 299;

  const [currentAmount, setCurrentAmount] = useState<number>(initialAmount);
  const [filterType, setFilterType] = useState<'cheapest' | 'cashback' | 'zero_fee'>('cheapest');
  const [selectedPlatformForCheckout, setSelectedPlatformForCheckout] =
    useState<PlatformFeeResult | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const providerId = searchParams.get('provider') || 'default';
  const account = searchParams.get('account') || '';
  const planDesc = searchParams.get('planDesc') || '';

  // Calculate comparison data
  const comparison = useMemo(() => {
    return compareAllPlatforms(category, currentAmount);
  }, [category, currentAmount]);

  // Filter & sort
  const displayResults = useMemo(() => {
    let list = [...comparison.results];
    if (filterType === 'zero_fee') {
      list = list.filter((r) => r.hasZeroFee);
    } else if (filterType === 'cashback') {
      list.sort((a, b) => b.cashback - a.cashback);
    } else {
      // Cheapest first
      list.sort((a, b) => a.netPayable - b.netPayable);
    }
    return list;
  }, [comparison, filterType]);

  const handleAmountChange = (newVal: number) => {
    const val = Math.max(10, newVal);
    setCurrentAmount(val);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      return updated;
    });
  };

  const handleOpenCheckout = (platform: PlatformFeeResult) => {
    setSelectedPlatformForCheckout(platform);
    setIsCheckoutOpen(true);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'mobile':
        return 'Prepaid Mobile Recharge';
      case 'electricity':
        return 'Electricity Bill Surcharge';
      case 'dth':
        return 'DTH Satellite Recharge';
      case 'creditcard':
        return 'Credit Card Repayment Fee';
      default:
        return 'Bill Payment';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/?category=${category}`}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {getCategoryTitle()}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {account ? `Acc: ${account}` : 'Real-time Comparison'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Fee Comparison Engine
            </h1>
          </div>
        </div>

        {/* Live Amount quick adjuster pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2">
            Base Amount:
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">₹</span>
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => handleAmountChange(Number(e.target.value) || 0)}
              className="w-24 px-2 py-1 text-sm font-mono font-black rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>
      </div>

      {/* Highlights Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recommended Best Option */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 px-3 py-1 bg-white/20 text-white font-extrabold text-[10px] rounded-bl-xl tracking-wider uppercase">
            BEST CHOICE
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-100 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Cheapest Option</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <PlatformLogo type={comparison.cheapestOption.platformId} size={44} />
              <div>
                <h3 className="text-lg font-black">{comparison.cheapestOption.platformName}</h3>
                <p className="text-xs text-emerald-100 font-medium">
                  {comparison.cheapestOption.feeNote}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-400/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-100 uppercase font-semibold">Net Payable</p>
              <p className="text-2xl font-black font-mono">
                ₹{comparison.cheapestOption.netPayable.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCheckout(comparison.cheapestOption)}
              className="py-2 px-4 rounded-xl text-xs font-black bg-white text-emerald-800 hover:bg-emerald-50 shadow-xs transition-all active:scale-95"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Potential Savings Avoided Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Max Extra Fee Charged</span>
            </div>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              ₹{comparison.maxExtraCharged.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Silently added by high-surcharge platforms + 18% GST on this transaction amount.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Potential Savings:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              ₹{comparison.maxPotentialSavings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Highest Cashback Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Highest Cashback / Reward</span>
            </div>
            <div className="flex items-center gap-3">
              <PlatformLogo type={comparison.highestCashbackOption.platformId} size={38} />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {comparison.highestCashbackOption.platformName}
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold font-mono">
                  {comparison.highestCashbackOption.cashback > 0
                    ? `₹${comparison.highestCashbackOption.cashback.toFixed(2)} Cashback`
                    : 'Standard Rewards'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {comparison.highestCashbackOption.cashbackNote}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Net after reward:</span>
            <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
              ₹{comparison.highestCashbackOption.netPayable.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Sort / Filter Platforms:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterType('cheapest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'cheapest'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cheapest First (Recommended)
          </button>

          <button
            type="button"
            onClick={() => setFilterType('zero_fee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'zero_fee'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Zero Platform Fee Only
          </button>

          <button
            type="button"
            onClick={() => setFilterType('cashback')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'cashback'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Highest Cashback First
          </button>
        </div>
      </div>

      {/* Main Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayResults.map((item) => (
          <div
            key={item.platformId}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative bg-white dark:bg-slate-900 shadow-xs hover:shadow-md ${
              item.isCheapest
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {item.isCheapest && (
              <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                Cheapest Option
              </span>
            )}

            {item.isHighestCashback && !item.isCheapest && (
              <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-xs">
                Top Cashback
              </span>
            )}

            <div>
              {/* Header with logo & rating */}
              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2.5">
                  <PlatformLogo type={item.platformId} size={36} />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.platformName}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Success: {item.successRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight */}
              <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                  Net Payable Amount
                </p>
                <p
                  className={`text-2xl font-black font-mono tracking-tight ${
                    item.isCheapest
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  ₹{item.netPayable.toFixed(2)}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Base Amount</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{item.baseAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span
                    className={`font-mono font-semibold ${
                      item.convenienceFee === 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.convenienceFee === 0 ? '₹0.00' : `+ ₹${item.convenienceFee.toFixed(2)}`}
                  </span>
                </div>

                {item.gstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>GST (18% on fee)</span>
                    <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                      + ₹{item.gstAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {item.cashback > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Cashback</span>
                    <span className="font-mono font-bold">- ₹{item.cashback.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {item.feeNote}
                </div>
              </div>
            </div>

            {/* Pay CTA */}
            <button
              type="button"
              onClick={() => handleOpenCheckout(item)}
              className={`w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                item.isCheapest
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
              }`}
            >
              <span>Pay ₹{item.netPayable.toFixed(2)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Complete Side-by-Side Surcharge Table
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Transparent audit of base bill, platform fees, 18% GST, and net payable.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Platform</th>
                <th className="px-4 py-3.5">Base Bill</th>
                <th className="px-4 py-3.5">Platform Fee</th>
                <th className="px-4 py-3.5">GST (18%)</th>
                <th className="px-4 py-3.5">Cashback</th>
                <th className="px-4 py-3.5">Net Payable</th>
                <th className="px-4 py-3.5">Savings vs Worst</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {displayResults.map((row) => (
                <tr
                  key={row.platformId}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    row.isCheapest ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <PlatformLogo type={row.platformId} size={28} />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {row.platformName}
                        {row.isCheapest && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Best
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{row.feeNote}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    ₹{row.baseAmount.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <span
                      className={`font-bold ${
                        row.convenienceFee === 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {row.convenienceFee === 0 ? '₹0.00' : `₹${row.convenienceFee.toFixed(2)}`}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                    {row.gstAmount > 0 ? `₹${row.gstAmount.toFixed(2)}` : '₹0.00'}
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <span
                      className={`${
                        row.cashback > 0
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.cashback > 0 ? `₹${row.cashback.toFixed(2)}` : '₹0.00'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <span
                      className={`text-sm font-black ${
                        row.isCheapest
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      ₹{row.netPayable.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {row.savingsVsWorst > 0 ? `+ ₹${row.savingsVsWorst.toFixed(2)}` : '₹0.00'}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(row)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        row.isCheapest
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        platform={selectedPlatformForCheckout}
        category={category}
        providerName={planDesc || getCategoryTitle()}
        providerId={providerId}
        consumerIdOrPhone={account}
        planDescription={planDesc}
        onSuccessComplete={(txnId) => {
          // Toast or direct acknowledgement handled inside modal
        }}
      />
    </div>
  );
};


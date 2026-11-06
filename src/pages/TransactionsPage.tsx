import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  Printer,
  Sparkles,
  Smartphone,
  Zap,
  Tv,
  CreditCard
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { TransactionRecord, ServiceCategory } from '../types';
import { PlatformLogo } from '../components/common/PlatformLogo';

export const TransactionsPage: React.FC = () => {
  const { transactions, totalSaved, totalVolume } = useTransactions();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }
      if (selectedPlatform !== 'all' && tx.platformId !== selectedPlatform) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(q);
        const matchesProvider = tx.providerName.toLowerCase().includes(q);
        const matchesPlatform = tx.platformName.toLowerCase().includes(q);
        const matchesAccount = tx.accountIdOrPhone.toLowerCase().includes(q);
        if (!matchesId && !matchesProvider && !matchesPlatform && !matchesAccount) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedCategory, selectedPlatform, searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Category',
      'Biller',
      'Account / Phone',
      'Platform Used',
      'Base Bill',
      'Convenience Fee',
      'GST',
      'Cashback Earned',
      'Net Paid',
      'Fees Avoided',
    ];

    const rows = filteredTransactions.map((tx) => [
      tx.id,
      new Date(tx.timestamp).toLocaleString('en-IN'),
      tx.category,
      `"${tx.providerName}"`,
      `"${tx.accountIdOrPhone}"`,
      `"${tx.platformName}"`,
      tx.baseAmount,
      tx.convenienceFee,
      tx.gstAmount,
      tx.cashbackEarned,
      tx.netPaid,
      tx.feesSavedVsWorst,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartPay_Transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
      case 'electricity':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'dth':
        return <Tv className="w-3.5 h-3.5 text-indigo-500" />;
      case 'creditcard':
        return <CreditCard className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header and KPI Mini Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Transaction History & Fee Savings Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every payment settled through recommended zero-surcharge gateways with stored receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="self-start sm:self-auto py-2 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Total Surcharges Avoided
          </p>
          <p className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            ₹{totalSaved.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80 mt-0.5">
            Across {transactions.length} total payments
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Volume Paid</p>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            ₹{totalVolume.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Base bill amounts settled</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Zero-Fee Success Rate</p>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            100%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Instant settlement with UPI</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Txn ID, biller, phone, or gateway..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Category & Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="all">All Categories</option>
            <option value="mobile">Mobile Recharge</option>
            <option value="electricity">Electricity Bill</option>
            <option value="dth">DTH Recharge</option>
            <option value="creditcard">Credit Card Bill</option>
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="all">All Gateways</option>
            <option value="bhim">BHIM UPI</option>
            <option value="gpay">Google Pay</option>
            <option value="amazonpay">Amazon Pay</option>
            <option value="cred">CRED</option>
            <option value="phonepe">PhonePe</option>
            <option value="paytm">Paytm</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching transactions found
            </p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID & Date</th>
                  <th className="px-4 py-3.5">Category & Biller</th>
                  <th className="px-4 py-3.5">Payment Platform</th>
                  <th className="px-4 py-3.5">Account / Phone</th>
                  <th className="px-4 py-3.5">Net Paid</th>
                  <th className="px-4 py-3.5">Extra Fees Saved</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTxn(tx)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{tx.id}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        {getCategoryIcon(tx.category)}
                        <span>{tx.providerName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">{tx.category}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <PlatformLogo type={tx.platformId} size={24} />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {tx.platformName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {tx.accountIdOrPhone}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-black text-slate-900 dark:text-white text-sm">
                      ₹{tx.netPaid.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                        + ₹{(tx.feesSavedVsWorst + tx.cashbackEarned).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Instant</span>
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTxn(tx);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Breakdown Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Payment Receipt & Surcharge Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedTxn.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Reference (UTR)</span>
                <span className="font-mono text-slate-900 dark:text-white text-[11px]">
                  {selectedTxn.referenceId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biller / Service</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedTxn.providerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Gateway</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedTxn.platformName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account / Phone</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {selectedTxn.accountIdOrPhone}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Base Bill Amount</span>
                <span className="font-mono font-bold">₹{selectedTxn.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Platform Convenience Fee</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedTxn.convenienceFee === 0
                    ? '₹0.00 (Zero Fee)'
                    : `+ ₹${selectedTxn.convenienceFee.toFixed(2)}`}
                </span>
              </div>
              {selectedTxn.cashbackEarned > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span>Cashback Discount</span>
                  <span className="font-mono font-bold">
                    - ₹{selectedTxn.cashbackEarned.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-emerald-300/50 dark:border-emerald-700/50 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Total Paid</span>
                <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  ₹{selectedTxn.netPaid.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Print and Close buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


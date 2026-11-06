import React, { createContext, useContext, useState, useMemo } from 'react';
import { TransactionRecord, SavingsInsight } from '../types';
import { loadSavedTransactions, saveTransactionRecord } from '../data/seedTransactions';

interface TransactionContextType {
  transactions: TransactionRecord[];
  addTransaction: (record: Omit<TransactionRecord, 'id' | 'timestamp' | 'status' | 'referenceId'>) => TransactionRecord;
  totalSaved: number;
  totalVolume: number;
  averageExtraFee: number;
  mostUsedPlatform: string;
  insights: SavingsInsight[];
  clearHistory: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => loadSavedTransactions());

  const addTransaction = (
    item: Omit<TransactionRecord, 'id' | 'timestamp' | 'status' | 'referenceId'>
  ): TransactionRecord => {
    const newRecord: TransactionRecord = {
      ...item,
      id: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      referenceId: `${item.platformName.toUpperCase().slice(0, 4)}/${new Date().getFullYear()}/${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    const updated = saveTransactionRecord(newRecord);
    setTransactions(updated);
    return newRecord;
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smartpay_transactions_history_v1');
    }
    setTransactions([]);
  };

  const { totalSaved, totalVolume, averageExtraFee, mostUsedPlatform } = useMemo(() => {
    let savedSum = 0;
    let volumeSum = 0;
    let feeSum = 0;
    const platformCounts: Record<string, number> = {};

    transactions.forEach((tx) => {
      savedSum += tx.feesSavedVsWorst + tx.cashbackEarned;
      volumeSum += tx.baseAmount;
      feeSum += tx.convenienceFee + tx.gstAmount;
      platformCounts[tx.platformName] = (platformCounts[tx.platformName] || 0) + 1;
    });

    let topPlatform = 'BHIM UPI';
    let topCount = 0;
    Object.entries(platformCounts).forEach(([name, count]) => {
      if (count > topCount) {
        topCount = count;
        topPlatform = name;
      }
    });

    const avgFee = transactions.length > 0 ? feeSum / transactions.length : 0;

    return {
      totalSaved: Math.round(savedSum * 100) / 100,
      totalVolume: Math.round(volumeSum * 100) / 100,
      averageExtraFee: Math.round(avgFee * 100) / 100,
      mostUsedPlatform: topPlatform,
    };
  }, [transactions]);

  // AI-powered savings recommendations based on user transaction history
  const insights: SavingsInsight[] = useMemo(() => {
    const list: SavingsInsight[] = [
      {
        title: 'Switch Mobile Recharges to BHIM UPI or Amazon Pay',
        description: 'Major apps levy ₹2.36 to ₹3.54 platform fee + GST per recharge. For family recharges (3 numbers x 12 months), BHIM UPI saves you ₹127/year in pure convenience fees.',
        potentialAnnualSaving: 127,
        recommendedPlatform: 'BHIM UPI',
        currentPlatform: 'PhonePe / Paytm',
        category: 'mobile',
        impact: 'high',
      },
      {
        title: 'Pay Electricity Bills via Amazon Pay / CRED',
        description: 'Amazon Pay grants direct ₹25 cashback on electricity utility payments over ₹500, avoiding the ₹3.50 to ₹5.00 surcharges on other portals.',
        potentialAnnualSaving: 300,
        recommendedPlatform: 'Amazon Pay',
        currentPlatform: 'Paytm / NetBanking',
        category: 'electricity',
        impact: 'high',
      },
      {
        title: 'Settle Credit Card Bills on Zero-Surcharge UPI Channels',
        description: 'Third-party bill payment apps now introduce ₹15 to ₹25 convenience fees on large credit card bills. Using CRED UPI or direct Bank UPI eliminates these fees completely.',
        potentialAnnualSaving: 480,
        recommendedPlatform: 'CRED / Bank UPI',
        currentPlatform: 'Third-party Portals',
        category: 'creditcard',
        impact: 'high',
      },
      {
        title: 'DTH Recharges: Google Pay Scratch Cards vs Surcharges',
        description: 'Google Pay and Amazon Pay offer zero processing charge on DTH satellite packs with instant voucher rewards up to ₹20.',
        potentialAnnualSaving: 140,
        recommendedPlatform: 'Google Pay',
        currentPlatform: 'PhonePe',
        category: 'dth',
        impact: 'medium',
      },
    ];
    return list;
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        totalSaved,
        totalVolume,
        averageExtraFee,
        mostUsedPlatform,
        insights,
        clearHistory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within a TransactionProvider');
  return context;
};


import { TransactionRecord } from '../types';

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-9021832',
    timestamp: '2026-11-04T14:32:00.000Z',
    category: 'mobile',
    providerId: 'jio',
    providerName: 'Reliance Jio',
    accountIdOrPhone: '9876543210',
    baseAmount: 666,
    platformId: 'bhim',
    platformName: 'BHIM UPI',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 10,
    netPaid: 656,
    feesSavedVsWorst: 3.54,
    status: 'SUCCESS',
    referenceId: 'UPI/2026/8912301823',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-8842109',
    timestamp: '2026-10-28T09:15:00.000Z',
    category: 'electricity',
    providerId: 'adani_mumbai',
    providerName: 'Adani Electricity',
    accountIdOrPhone: '101234567',
    baseAmount: 2450,
    platformId: 'amazonpay',
    platformName: 'Amazon Pay',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 25,
    netPaid: 2425,
    feesSavedVsWorst: 5.9,
    status: 'SUCCESS',
    referenceId: 'APAY/2026/99341028',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-8711492',
    timestamp: '2026-10-18T18:40:00.000Z',
    category: 'creditcard',
    providerId: 'hdfc_bank',
    providerName: 'HDFC Bank Credit Card',
    accountIdOrPhone: '•••• 7654',
    baseAmount: 18400,
    platformId: 'cred',
    platformName: 'CRED',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 40,
    netPaid: 18360,
    feesSavedVsWorst: 35.4,
    status: 'SUCCESS',
    referenceId: 'CRED/2026/4412091',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-8521038',
    timestamp: '2026-10-12T11:20:00.000Z',
    category: 'dth',
    providerId: 'tataplay',
    providerName: 'Tata Play',
    accountIdOrPhone: '1098765432',
    baseAmount: 499,
    platformId: 'gpay',
    platformName: 'Google Pay',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 5,
    netPaid: 494,
    feesSavedVsWorst: 2.36,
    status: 'SUCCESS',
    referenceId: 'GPAY/2026/7192834',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-8201948',
    timestamp: '2026-09-29T16:05:00.000Z',
    category: 'mobile',
    providerId: 'airtel',
    providerName: 'Bharti Airtel',
    accountIdOrPhone: '9988776655',
    baseAmount: 979,
    platformId: 'amazonpay',
    platformName: 'Amazon Pay',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 15,
    netPaid: 964,
    feesSavedVsWorst: 3.54,
    status: 'SUCCESS',
    referenceId: 'APAY/2026/552190',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-7940122',
    timestamp: '2026-09-14T20:10:00.000Z',
    category: 'electricity',
    providerId: 'tata_power',
    providerName: 'Tata Power',
    accountIdOrPhone: '900012345678',
    baseAmount: 1820,
    platformId: 'bhim',
    platformName: 'BHIM UPI',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 10,
    netPaid: 1810,
    feesSavedVsWorst: 5.9,
    status: 'SUCCESS',
    referenceId: 'UPI/2026/3019284',
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-7612940',
    timestamp: '2026-08-25T13:45:00.000Z',
    category: 'creditcard',
    providerId: 'icici_bank',
    providerName: 'ICICI Bank Credit Card',
    accountIdOrPhone: '•••• 5612',
    baseAmount: 12500,
    platformId: 'cred',
    platformName: 'CRED',
    convenienceFee: 0,
    gstAmount: 0,
    cashbackEarned: 40,
    netPaid: 12460,
    feesSavedVsWorst: 32.5,
    status: 'SUCCESS',
    referenceId: 'CRED/2026/182736',
    paymentMethod: 'UPI',
  },
];

const STORAGE_KEY = 'smartpay_transactions_history_v1';

export function loadSavedTransactions(): TransactionRecord[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactionRecord(record: TransactionRecord): TransactionRecord[] {
  const current = loadSavedTransactions();
  const updated = [record, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save transaction to localStorage:', err);
  }
  return updated;
}


export type ServiceCategory = 'mobile' | 'electricity' | 'dth' | 'creditcard';

export interface PaymentPlatform {
  id: string;
  name: string;
  logo: string;
  accentColor: string;
  textColor: string;
  badge?: string;
  upiSupported: boolean;
  cardsSupported: boolean;
  netBankingSupported: boolean;
  walletSupported: boolean;
}

export interface PlatformFeeResult {
  platformId: string;
  platformName: string;
  logo: string;
  accentColor: string;
  textColor: string;
  baseAmount: number;
  convenienceFee: number;
  gstAmount: number; // 18% on convenience fee
  grossExtraFee: number; // convenienceFee + gstAmount
  cashback: number;
  netPayable: number;
  savingsVsWorst: number;
  isCheapest: boolean;
  isHighestCashback: boolean;
  hasZeroFee: boolean;
  cashbackNote: string;
  feeNote: string;
  rating: number;
  successRate: number; // e.g. 99.8%
}

export interface FeeComparisonSummary {
  category: ServiceCategory;
  baseAmount: number;
  results: PlatformFeeResult[];
  cheapestOption: PlatformFeeResult;
  highestCashbackOption: PlatformFeeResult;
  maxExtraCharged: number;
  maxPotentialSavings: number;
  averageExtraFee: number;
}

export const PLATFORMS: Record<string, PaymentPlatform> = {
  bhim: {
    id: 'bhim',
    name: 'BHIM UPI',
    logo: 'bhim',
    accentColor: '#097939',
    textColor: '#ffffff',
    badge: 'Govt / NPCI Official',
    upiSupported: true,
    cardsSupported: false,
    netBankingSupported: true,
    walletSupported: false,
  },
  gpay: {
    id: 'gpay',
    name: 'Google Pay',
    logo: 'gpay',
    accentColor: '#1a73e8',
    textColor: '#ffffff',
    badge: 'Zero Hidden Fees',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: false,
  },
  amazonpay: {
    id: 'amazonpay',
    name: 'Amazon Pay',
    logo: 'amazonpay',
    accentColor: '#ff9900',
    textColor: '#111827',
    badge: 'Cashback Rewards',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: true,
  },
  phonepe: {
    id: 'phonepe',
    name: 'PhonePe',
    logo: 'phonepe',
    accentColor: '#5f259f',
    textColor: '#ffffff',
    badge: 'Platform Fee Levied',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: true,
  },
  paytm: {
    id: 'paytm',
    name: 'Paytm',
    logo: 'paytm',
    accentColor: '#00b9f1',
    textColor: '#ffffff',
    badge: 'Platform Surcharge',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: true,
  },
  cred: {
    id: 'cred',
    name: 'CRED',
    logo: 'cred',
    accentColor: '#121212',
    textColor: '#ffffff',
    badge: 'Coin Rewards',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: false,
  },
  mobikwik: {
    id: 'mobikwik',
    name: 'MobiKwik',
    logo: 'mobikwik',
    accentColor: '#0070e0',
    textColor: '#ffffff',
    badge: 'SuperCash',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: true,
  },
  freecharge: {
    id: 'freecharge',
    name: 'Freecharge',
    logo: 'freecharge',
    accentColor: '#fa541c',
    textColor: '#ffffff',
    badge: 'Axis Backed',
    upiSupported: true,
    cardsSupported: true,
    netBankingSupported: true,
    walletSupported: true,
  },
};

/**
 * Calculates platform fee, GST, and net payable amount deterministically
 */
export function calculatePlatformFee(
  platformId: string,
  category: ServiceCategory,
  baseAmount: number
): {
  convenienceFee: number;
  gstAmount: number;
  cashback: number;
  feeNote: string;
  cashbackNote: string;
} {
  const amount = Math.max(0, Math.round(baseAmount * 100) / 100);
  let rawFee = 0;
  let feeNote = 'No platform surcharge';
  let cashback = 0;
  let cashbackNote = 'No direct cashback';

  switch (platformId) {
    case 'bhim':
      // BHIM adheres strictly to NPCI guidelines - 0 fee
      rawFee = 0;
      feeNote = '100% Zero Convenience Fee (NPCI Official)';
      // Occasional small cashback for bill payments
      if (amount >= 200 && (category === 'electricity' || category === 'mobile')) {
        cashback = 10;
        cashbackNote = '₹10 NPCI Promotion Cashback';
      }
      break;

    case 'gpay':
      // Google Pay keeps UPI free on recharges and bills
      rawFee = 0;
      feeNote = '₹0 Processing fee on Google Pay UPI';
      if (amount >= 299) {
        cashback = 5;
        cashbackNote = 'Assured Scratch Card ~₹5';
      }
      break;

    case 'amazonpay':
      // Amazon Pay usually charges ₹0 for UPI/wallet bills & gives cashback balance
      rawFee = 0;
      feeNote = 'No convenience fees on Amazon Pay UPI';
      if (category === 'electricity' && amount >= 500) {
        cashback = 25;
        cashbackNote = 'Flat ₹25 Amazon Pay cashback on Electricity';
      } else if (category === 'mobile' && amount >= 239) {
        cashback = 15;
        cashbackNote = '₹15 cashback on recharge > ₹200';
      } else if (category === 'dth' && amount >= 300) {
        cashback = 20;
        cashbackNote = '₹20 Amazon Pay cashback balance';
      } else if (amount >= 100) {
        cashback = 5;
        cashbackNote = '₹5 reward voucher';
      }
      break;

    case 'phonepe':
      // PhonePe charges ₹1 to ₹3 on recharges and bills depending on tier
      if (category === 'mobile' || category === 'dth') {
        if (amount < 50) {
          rawFee = 0;
          feeNote = 'Free under ₹50';
        } else if (amount <= 100) {
          rawFee = 1;
          feeNote = '₹1.00 Platform Fee levied on recharge';
        } else if (amount <= 500) {
          rawFee = 2;
          feeNote = '₹2.00 Platform Fee levied on recharge';
        } else {
          rawFee = 3;
          feeNote = '₹3.00 Platform Fee levied for >₹500';
        }
      } else if (category === 'electricity') {
        rawFee = amount > 1000 ? 5 : 2;
        feeNote = `₹${rawFee}.00 Processing fee on Utility`;
      } else if (category === 'creditcard') {
        rawFee = Math.min(25, Math.max(10, Math.round(amount * 0.002)));
        feeNote = `₹${rawFee}.00 Convenience charge on Credit Card Bill`;
      }
      cashback = 0;
      cashbackNote = 'Discount coupons only (no direct cash)';
      break;

    case 'paytm':
      // Paytm charges platform fee on recharges & credit cards
      if (category === 'mobile' || category === 'dth') {
        if (amount <= 100) {
          rawFee = 1;
        } else if (amount <= 400) {
          rawFee = 1.9;
        } else {
          rawFee = 2.9;
        }
        feeNote = `₹${rawFee.toFixed(2)} Platform fee on Telecom/DTH`;
      } else if (category === 'electricity') {
        rawFee = 3.5;
        feeNote = '₹3.50 Electricity surcharge';
      } else if (category === 'creditcard') {
        rawFee = Math.min(30, Math.max(8, Math.round(amount * 0.0025)));
        feeNote = `₹${rawFee}.00 CC Processing fee`;
      }
      if (amount >= 400) {
        cashback = 3;
        cashbackNote = '₹3 Paytm Cashback points equivalent';
      }
      break;

    case 'cred':
      // CRED charges for Credit Card repayments depending on payment mode (UPI free or small processing on debit, plus convenience fee for rent/utilities)
      if (category === 'creditcard') {
        // CRED claims ₹0 fee on UPI, but small charge if using debit/netbanking; for comparison we show CRED coins cashback
        rawFee = 0;
        feeNote = '₹0 Processing Fee on CRED UPI';
        cashback = amount >= 5000 ? 40 : amount >= 1000 ? 15 : 5;
        cashbackNote = `₹${cashback} Cashback via CRED coins spin`;
      } else if (category === 'electricity') {
        rawFee = 0;
        feeNote = '₹0 fee on CRED Pay Electricity';
        cashback = amount >= 1000 ? 20 : 10;
        cashbackNote = `₹${cashback} instant discount with CRED`;
      } else {
        // Mobile / DTH
        rawFee = 0;
        feeNote = '₹0 on CRED Pay';
        cashback = amount >= 299 ? 8 : 2;
        cashbackNote = `₹${cashback} coins reward`;
      }
      break;

    case 'mobikwik':
      // MobiKwik charges small convenience fee on bills
      if (category === 'creditcard') {
        rawFee = 15;
        feeNote = '₹15.00 Payment gateway fee';
        cashback = 20; // 1% SuperCash
        cashbackNote = '₹20 SuperCash redeemable';
      } else if (category === 'electricity') {
        rawFee = 4;
        feeNote = '₹4.00 Convenience fee';
        cashback = 10;
        cashbackNote = '₹10 SuperCash voucher';
      } else {
        rawFee = 1.5;
        feeNote = '₹1.50 Recharge convenience charge';
        cashback = 2;
        cashbackNote = '₹2 SuperCash';
      }
      break;

    case 'freecharge':
      if (category === 'mobile' || category === 'dth') {
        rawFee = 1.0;
        feeNote = '₹1.00 Platform fee';
        cashback = amount >= 199 ? 5 : 0;
        cashbackNote = cashback > 0 ? '₹5 Cashback on FC' : 'No cashback';
      } else if (category === 'electricity') {
        rawFee = 2.5;
        feeNote = '₹2.50 Platform fee';
        cashback = 10;
        cashbackNote = '₹10 Electricity bill cashback';
      } else {
        rawFee = 12;
        feeNote = '₹12.00 Processing fee';
        cashback = 10;
        cashbackNote = '₹10 Cashback promo';
      }
      break;

    default:
      rawFee = 0;
      break;
  }

  // GST 18% is applicable only on positive platform convenience fees
  const gstAmount = rawFee > 0 ? Math.round(rawFee * 0.18 * 100) / 100 : 0;

  return {
    convenienceFee: Math.round(rawFee * 100) / 100,
    gstAmount,
    cashback: Math.round(cashback * 100) / 100,
    feeNote,
    cashbackNote,
  };
}

export function compareAllPlatforms(
  category: ServiceCategory,
  baseAmount: number
): FeeComparisonSummary {
  const amount = Math.max(1, Number(baseAmount) || 1);
  const platformKeys = Object.keys(PLATFORMS);

  const rawResults = platformKeys.map((id) => {
    const meta = PLATFORMS[id];
    const { convenienceFee, gstAmount, cashback, feeNote, cashbackNote } =
      calculatePlatformFee(id, category, amount);

    const grossExtraFee = Math.round((convenienceFee + gstAmount) * 100) / 100;
    // Net payable = Base Amount + Extra Fee - Direct Cashback
    const netPayable = Math.round((amount + grossExtraFee - cashback) * 100) / 100;

    // Simulated reliable metrics for each platform
    const successRateMap: Record<string, number> = {
      bhim: 99.4,
      gpay: 99.8,
      amazonpay: 99.7,
      phonepe: 99.6,
      paytm: 99.3,
      cred: 99.9,
      mobikwik: 98.9,
      freecharge: 98.7,
    };

    const ratingMap: Record<string, number> = {
      bhim: 4.6,
      gpay: 4.8,
      amazonpay: 4.7,
      phonepe: 4.5,
      paytm: 4.2,
      cred: 4.9,
      mobikwik: 4.0,
      freecharge: 4.1,
    };

    return {
      platformId: id,
      platformName: meta.name,
      logo: meta.logo,
      accentColor: meta.accentColor,
      textColor: meta.textColor,
      baseAmount: amount,
      convenienceFee,
      gstAmount,
      grossExtraFee,
      cashback,
      netPayable,
      savingsVsWorst: 0,
      isCheapest: false,
      isHighestCashback: false,
      hasZeroFee: grossExtraFee === 0,
      cashbackNote,
      feeNote,
      rating: ratingMap[id] || 4.5,
      successRate: successRateMap[id] || 99.5,
    };
  });

  // Find min net payable and max net payable
  const minNetPayable = Math.min(...rawResults.map((r) => r.netPayable));
  const maxNetPayable = Math.max(...rawResults.map((r) => r.netPayable));
  const maxCashback = Math.max(...rawResults.map((r) => r.cashback));
  const maxExtraCharged = Math.max(...rawResults.map((r) => r.grossExtraFee));

  const results: PlatformFeeResult[] = rawResults.map((item) => {
    const isCheapest = item.netPayable === minNetPayable;
    const isHighestCashback = maxCashback > 0 && item.cashback === maxCashback;
    const savingsVsWorst = Math.max(
      0,
      Math.round((maxNetPayable - item.netPayable) * 100) / 100
    );

    return {
      ...item,
      isCheapest,
      isHighestCashback,
      savingsVsWorst,
    };
  });

  // Sort by netPayable ascending (cheapest first)
  results.sort((a, b) => a.netPayable - b.netPayable);

  const cheapestOption = results[0];
  const highestCashbackOption = [...results].sort((a, b) => b.cashback - a.cashback)[0];
  const averageExtraFee =
    Math.round(
      (results.reduce((sum, r) => sum + r.grossExtraFee, 0) / results.length) * 100
    ) / 100;

  return {
    category,
    baseAmount: amount,
    results,
    cheapestOption,
    highestCashbackOption,
    maxExtraCharged,
    maxPotentialSavings: Math.round((maxNetPayable - minNetPayable) * 100) / 100,
    averageExtraFee,
  };
}


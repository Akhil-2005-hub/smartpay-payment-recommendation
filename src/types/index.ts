import { ServiceCategory, PlatformFeeResult } from '../utils/feeCalculator';

export type { ServiceCategory, PlatformFeeResult };

export interface ProviderItem {
  id: string;
  name: string;
  category: ServiceCategory;
  shortName: string;
  color: string;
  bgLight: string;
  logoType: string;
  sampleId: string;
  idLabel: string;
  description: string;
}

export interface RechargePlan {
  id: string;
  providerId: string;
  price: number;
  validityDays: number;
  validityLabel: string;
  dataPerDay: string;
  totalData?: string;
  voice: string;
  sms: string;
  planType: 'unlimited' | 'booster' | 'long_validity' | 'entertainment';
  ottApps: string[];
  description: string;
  popular?: boolean;
  userRating: number;
  userReviewsCount: number;
}

export interface BillLookupDetails {
  consumerId: string;
  consumerName: string;
  providerId: string;
  billingMonth: string;
  dueDate: string;
  billAmount: number;
  unitsConsumed?: number;
  minimumDue?: number;
  billNumber: string;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  category: ServiceCategory;
  providerId: string;
  providerName: string;
  accountIdOrPhone: string;
  baseAmount: number;
  platformId: string;
  platformName: string;
  convenienceFee: number;
  gstAmount: number;
  cashbackEarned: number;
  netPaid: number;
  feesSavedVsWorst: number;
  status: 'SUCCESS' | 'PROCESSING' | 'FAILED';
  referenceId: string;
  paymentMethod: 'UPI' | 'Cards' | 'NetBanking' | 'Wallet';
}

export interface SavingsInsight {
  title: string;
  description: string;
  potentialAnnualSaving: number;
  recommendedPlatform: string;
  currentPlatform: string;
  category: ServiceCategory;
  impact: 'high' | 'medium' | 'low';
}


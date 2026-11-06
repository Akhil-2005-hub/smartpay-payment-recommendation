import React from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  FileText,
  Info,
  ExternalLink
} from 'lucide-react';
import { PLATFORMS } from '../utils/feeCalculator';
import { PlatformLogo } from '../components/common/PlatformLogo';

export const FeeTransparencyPage: React.FC = () => {
  const feePolicies = [
    {
      id: 'bhim',
      name: 'BHIM UPI (NPCI)',
      policy: '₹0.00 Convenience Fee on all recharges and utility bills.',
      gstCharged: 'No GST (0% fee = ₹0 GST)',
      verdict: 'Safest & Cheapest',
      verdictColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
      description:
        'Owned and operated by the National Payments Corporation of India (NPCI). Built to provide public digital payment infrastructure with zero profit markup on essential recharges and bill settlements.',
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      policy: '₹0.00 platform fee on UPI recharges & utility payments.',
      gstCharged: 'No platform GST',
      verdict: 'Zero Hidden Charges',
      verdictColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
      description:
        'Google Pay routes peer-to-merchant bills directly via UPI rails without levying platform convenience surcharges on mobile or electricity bills.',
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      policy: '₹0.00 platform fee on UPI + Guaranteed direct cashbacks.',
      gstCharged: 'No platform GST',
      verdict: 'Highest Cashbacks',
      verdictColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
      description:
        'Zero convenience fees, and frequently runs promotional flat ₹15-₹25 cashbacks added to Amazon Pay balance on recharges above ₹200 and electricity bills.',
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      policy: 'Tiered platform fee: ₹1 (₹50-100), ₹2 (₹101-500), ₹3 (>₹500).',
      gstCharged: '18% GST added on platform fee (e.g. ₹3 + ₹0.54 = ₹3.54 total)',
      verdict: 'Levies Platform Surcharge',
      verdictColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400',
      description:
        'In late 2021, PhonePe started charging a platform fee on mobile recharges as a small experiment, which has since been expanded across bills and credit card repayments.',
    },
    {
      id: 'paytm',
      name: 'Paytm',
      policy: '₹1.00 to ₹2.90 platform fee on telecom; up to ₹30 on credit cards.',
      gstCharged: '18% GST added on convenience fee',
      verdict: 'Levies Platform Surcharge',
      verdictColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400',
      description:
        'Paytm levies convenience charges on recharges and utility bills depending on operator, channel, and payment mode chosen.',
    },
    {
      id: 'cred',
      name: 'CRED',
      policy: '₹0 fee on UPI Credit Card payments; small fee on NetBanking/Debit.',
      gstCharged: '18% GST if using non-UPI channels',
      verdict: 'Best for Credit Cards',
      verdictColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
      description:
        'CRED specializes in credit card repayments and utilities, granting coin rewards and spin cashbacks while waiving platform fees on UPI repayments.',
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Platform Fee Transparency & Surcharge Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Everything you need to know about why payment apps started charging convenience fees and how to legally pay ₹0 extra.
        </p>
      </div>

      {/* Explainer Callout */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-3">
        <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Why are payment apps charging extra for recharges?</span>
        </div>
        <p className="leading-relaxed">
          Previously, telecom operators (Jio, Airtel, Vi) paid a 1.5% to 2% commission to payment apps for every recharge. When telecom companies slashed commissions to under 0.5%–0.7%, third-party payment apps introduced "Platform Fees" or "Convenience Charges" directly onto the consumer to monetize high recharge volumes.
        </p>
        <p className="leading-relaxed">
          Because convenience fees are classified as a service charge, they also attract <strong>18% Goods & Services Tax (GST)</strong>, which further inflates the final deduction from your bank account.
        </p>
      </div>

      {/* Fee Policy Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Fee Policies by Major Payment Gateway (2026 Audit)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feePolicies.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <PlatformLogo type={app.id} size={36} />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {app.name}
                      </h3>
                      <p className="text-[10px] text-slate-400">{app.gstCharged}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${app.verdictColor}`}
                  >
                    {app.verdict}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Policy:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {app.policy}
                    </p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Is BHIM UPI really 100% free forever?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Yes. BHIM is owned by the National Payments Corporation of India (NPCI) and is bound by regulatory mandates to provide free digital transaction infrastructure across India without charging consumers platform fees.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Why does SmartPay not require an account or login?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              SmartPay is designed for rapid consumer transparency. We do not store sensitive bank credentials or require passwords. All transaction audits and comparisons run instantly in your browser.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              How does SmartPay calculate the 18% GST?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Under Indian tax law, convenience fees are categorized as financial facilitation services subject to standard 18% GST. For example, a ₹2.00 fee attracts ₹0.36 in GST, resulting in ₹2.36 total extra deduction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


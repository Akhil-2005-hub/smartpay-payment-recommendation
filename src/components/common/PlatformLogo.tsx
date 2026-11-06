import React from 'react';

interface PlatformLogoProps {
  type: string;
  className?: string;
  size?: number;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ type, className = '', size = 32 }) => {
  const norm = type.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (norm) {
    case 'bhim':
    case 'bhimupi':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-700 to-green-600 text-white font-extrabold shadow-sm ${className}`}
        >
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5" fill="none">
            <rect width="40" height="40" rx="8" fill="transparent" />
            <path d="M12 10H22C26.4 10 29 12.5 29 16C29 18.5 27.5 20.2 25.2 21.1C28 22 30 24 30 27.2C30 31.2 26.5 33.5 22 33.5H12V10Z" fill="#FFFFFF" fillOpacity="0.95" />
            <path d="M16 15H21C23 15 24.5 16 24.5 17.5C24.5 19 23 20 21 20H16V15Z" fill="#097939" />
            <path d="M16 23.5H21.5C23.8 23.5 25.2 24.6 25.2 26.2C25.2 27.8 23.8 28.8 21.5 28.8H16V23.5Z" fill="#097939" />
            <path d="M28 8L34 20L28 32" stroke="#FF9933" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );

    case 'gpay':
    case 'googlepay':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-white border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-1 ${className}`}
        >
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>
      );

    case 'phonepe':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#5f259f] text-white font-black shadow-sm ${className}`}
        >
          <svg viewBox="0 0 36 36" className="w-3/5 h-3/5 fill-current">
            <path d="M18 2C9.16 2 2 9.16 2 18s7.16 16 16 16 16-7.16 16-16S26.84 2 18 2zm1.6 22.8c-2.8 0-4.8-1.6-4.8-4.4v-8.2h3.2v8c0 1.2.8 1.8 1.8 1.8 1.2 0 2-1 2-2.4v-7.4h3.2v12.2h-3.2v-1.6c-.6 1.2-1.4 2-2.2 2z"/>
          </svg>
        </div>
      );

    case 'paytm':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#002e6e] text-white font-extrabold shadow-sm ${className}`}
        >
          <div className="flex items-center text-[11px] font-black tracking-tighter">
            <span className="text-white">Pay</span>
            <span className="text-[#00b9f1]">tm</span>
          </div>
        </div>
      );

    case 'amazonpay':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#232f3e] text-[#ff9900] shadow-sm font-bold p-1 ${className}`}
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <path fill="#ffffff" d="M18 8c-4.4 0-8 3.6-8 8 0 3.2 1.9 6 4.6 7.3-.2-.7-.3-1.6-.3-2.3 0-2.8 1.6-4.8 4.3-4.8 2.2 0 3.4 1.3 3.4 3.2v6.6h2.5V19c0-3.8-2.5-6-6.5-6z"/>
            <path fill="#ff9900" d="M7 26c4.5 3 13 4 21-1 .3-.2.6.2.4.5-3.5 3.5-12 5-18.5 2-.4-.2-.2-.7.2-.8z"/>
            <path fill="#ff9900" d="M28.5 24.2c.4 1.1 1.2 2.3 1.5 2.8.2.2.1.4-.1.4-.8.1-2.4-.2-3.6-1.5-.2-.2 0-.4.2-.4.7-.2 1.4-.7 2-1.3z"/>
          </svg>
        </div>
      );

    case 'cred':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-black border border-neutral-700 text-white font-serif tracking-widest text-[10px] shadow-sm ${className}`}
        >
          <span className="font-bold tracking-wider">CRED</span>
        </div>
      );

    case 'mobikwik':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#0070e0] text-white font-black text-[10px] shadow-sm ${className}`}
        >
          <span>Mobi</span>
        </div>
      );

    case 'freecharge':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#fa541c] text-white font-black text-[9px] shadow-sm ${className}`}
        >
          <span>FC</span>
        </div>
      );

    // Operator & Biller logos
    case 'jio':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#0053a0] text-white font-extrabold text-[12px] shadow-sm ${className}`}
        >
          <span>Jio</span>
        </div>
      );

    case 'airtel':
    case 'airteldth':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#e60000] text-white font-extrabold text-[11px] shadow-sm ${className}`}
        >
          <span>airtel</span>
        </div>
      );

    case 'vi':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#e11313] text-white font-extrabold text-[12px] shadow-sm ${className}`}
        >
          <span>!Vi</span>
        </div>
      );

    case 'bsnl':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#128a38] text-white font-bold text-[10px] shadow-sm ${className}`}
        >
          <span>BSNL</span>
        </div>
      );

    case 'tataplay':
    case 'tatapower':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#024282] text-white font-bold text-[10px] shadow-sm ${className}`}
        >
          <span>TATA</span>
        </div>
      );

    case 'adani':
    case 'adanimumbai':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#0f4c81] text-white font-bold text-[10px] shadow-sm ${className}`}
        >
          <span>adani</span>
        </div>
      );

    case 'hdfc':
    case 'hdfcbank':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#004c8f] text-white font-black text-[9px] shadow-sm ${className}`}
        >
          <span>HDFC</span>
        </div>
      );

    case 'icici':
    case 'icicibank':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#9e1c1e] text-white font-black text-[9px] shadow-sm ${className}`}
        >
          <span>ICICI</span>
        </div>
      );

    case 'sbi':
    case 'sbicard':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#0083ca] text-white font-bold text-[10px] shadow-sm ${className}`}
        >
          <span>SBI</span>
        </div>
      );

    case 'axis':
    case 'axisbank':
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-[#97144d] text-white font-bold text-[9px] shadow-sm ${className}`}
        >
          <span>AXIS</span>
        </div>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs ${className}`}
        >
          {type.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};


import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Smartphone,
  Zap,
  Tv,
  CreditCard,
  ArrowUpDown,
  History,
  BarChart3,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface NavGroup {
  group: string;
  links: NavLinkItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { totalSaved, transactions } = useTransactions();

  const navItems: NavGroup[] = [
    {
      group: 'Bill Categories',
      links: [
        { to: '/?category=mobile', label: 'Mobile Recharge', icon: Smartphone, badge: 'Popular' },
        { to: '/?category=electricity', label: 'Electricity Bill', icon: Zap, badge: 'High Surcharge' },
        { to: '/?category=dth', label: 'DTH Recharge', icon: Tv },
        { to: '/?category=creditcard', label: 'Credit Card Bill', icon: CreditCard, badge: 'Highest Fee' },
      ],
    },
    {
      group: 'Fee Comparison',
      links: [
        { to: '/compare/mobile/299', label: 'Real-time Fee Engine', icon: ArrowUpDown },
        { to: '/transactions', label: 'Payment History', icon: History, count: transactions.length },
        { to: '/analytics', label: 'Savings & Analytics', icon: BarChart3 },
        { to: '/fee-rates', label: 'Platform Fee Rules', icon: HelpCircle },
      ],
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        {navItems.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {link.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              link.badge === 'Highest Fee'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                        {link.count !== undefined && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {link.count}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Cumulative Savings Card in Sidebar */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold mb-1">
          <Award className="w-4 h-4 text-emerald-200" />
          <span>Cumulative Savings</span>
        </div>
        <div className="text-2xl font-black font-mono tracking-tight text-white mb-1">
          ₹{totalSaved.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
        </div>
        <p className="text-[11px] text-emerald-100/90 leading-relaxed">
          Avoided extra charges by using recommended zero-surcharge gateways.
        </p>
        <div className="mt-3 pt-3 border-t border-emerald-500/30 flex items-center justify-between text-[11px]">
          <span className="text-emerald-100 font-medium">SmartPay Guarantee</span>
          <span className="font-bold flex items-center gap-1 text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" /> 100% Free
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};


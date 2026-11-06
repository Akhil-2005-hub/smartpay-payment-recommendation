import React from 'react';
import { NavLink } from 'react-router-dom';
import { Smartphone, ArrowUpDown, History, BarChart3, HelpCircle } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Services', icon: Smartphone },
    { to: '/compare/mobile/299', label: 'Compare', icon: ArrowUpDown },
    { to: '/transactions', label: 'History', icon: History },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/fee-rates', label: 'Rates', icon: HelpCircle },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'bg-emerald-50 dark:bg-emerald-950/60 scale-110' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};


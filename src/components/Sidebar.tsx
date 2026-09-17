import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Building2,
  TrendingUp,
  UserPlus,
  Code2,
  LogOut,
  User as UserIcon,
  Shield,
  X,
  Wallet,
  BellRing,
  Smartphone,
  HelpCircle,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLoginModal: () => void;
  onOpenGuide?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  productsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLoginModal,
  onOpenGuide,
  isOpenMobile,
  onCloseMobile,
  productsCount,
}) => {
  const isAdmin = currentUser?.Role === 'Admin';

  const navItemClass = (id: string, isRestricted = false) => {
    const isActive = activeTab === id;
    if (isRestricted) {
      return 'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 opacity-60 cursor-not-allowed';
    }
    if (isActive) {
      return 'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white shadow-sm border-l-4 border-pink-500 transition-all';
    }
    return 'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all';
  };

  const handleNavClick = (id: string, isRestricted = false) => {
    if (isRestricted) {
      alert('Sehemu hii inahitaji ruhusa ya ADMIN. Tafadhali ingia kama msimamizi.');
      return;
    }
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center space-x-3">
              <span className="text-3xl filter drop-shadow-sm">💄</span>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-pink-500 leading-none">
                  Cosmetics
                </h1>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Mfumo wa Mauzo</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Funga menyu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="px-4 py-3.5 border-b border-slate-800/60 bg-slate-900/50">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {currentUser.FullName || 'innocent simfukwe'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      @{currentUser.Username}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#dc2626] text-white uppercase shadow-xs flex-shrink-0">
                  {currentUser.Role || 'ADMIN'}
                </span>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="w-full py-1.5 px-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-xs font-bold text-white flex items-center justify-center space-x-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Ingia Kwenye Mfumo (Sign In)</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <button
              id="nav-btn-dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={navItemClass('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Dashibodi Kuu</span>
            </button>

            <button
              id="nav-btn-pos"
              onClick={() => handleNavClick('pos')}
              className={navItemClass('pos')}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Fanya Mauzo (POS)</span>
            </button>

            <button
              id="nav-btn-inventory"
              onClick={() => handleNavClick('inventory')}
              className={navItemClass('inventory')}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <div className="flex-1 flex items-center justify-between text-left">
                <span>Stoo na Bidhaa</span>
                {productsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {productsCount}
                  </span>
                )}
              </div>
            </button>

            {/* Expenses (Matumizi) - Accessible to both Cashier & Admin */}
            <button
              id="nav-btn-expenses"
              onClick={() => handleNavClick('expenses')}
              className={navItemClass('expenses')}
            >
              <Wallet className="w-4 h-4 text-orange-400" />
              <span>Matumizi ya Duka</span>
            </button>

            {/* Admin Section Divider */}
            <div className="pt-4 pb-1.5 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                <Shield className="w-3 h-3 text-slate-500 inline mr-1" />
                <span>USIMAMIZI (ADMIN)</span>
              </p>
            </div>

            <button
              id="nav-btn-branches"
              onClick={() => handleNavClick('branches', !isAdmin)}
              className={navItemClass('branches', !isAdmin)}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Matawi ya Maduka</span>
            </button>

            <button
              id="nav-btn-analytics"
              onClick={() => handleNavClick('analytics', !isAdmin)}
              className={navItemClass('analytics', !isAdmin)}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Ripoti za Faida</span>
            </button>

            <button
              id="nav-btn-sales-alert"
              onClick={() => handleNavClick('sales-alert', !isAdmin)}
              className={navItemClass('sales-alert', !isAdmin)}
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Tahadhari ya Mauzo (24h)</span>
            </button>

            <button
              id="nav-btn-users"
              onClick={() => handleNavClick('users', !isAdmin)}
              className={navItemClass('users', !isAdmin)}
            >
              <UserPlus className="w-4 h-4 text-rose-400" />
              <span>Sajili Mfanyakazi</span>
            </button>

            <button
              id="nav-btn-php-api"
              onClick={() => handleNavClick('php-api')}
              className={navItemClass('php-api')}
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>PHP API & MySQL</span>
            </button>

            {/* App Download / Guide Button */}
            {onOpenGuide && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onOpenGuide();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs hover:from-pink-700 hover:to-rose-700 transition-all text-left"
                >
                  <Smartphone className="w-4 h-4 text-pink-200 animate-bounce" />
                  <span>📲 Pakua & Mwongozo App</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0d131f] space-y-2">
          {currentUser && (
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              className="w-full flex items-center space-x-2.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Kuondoka (Logout)</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DB: cosmetics_shop</span>
            </span>
            <span className="font-mono text-slate-500">v1.2</span>
          </div>
        </div>
      </aside>
    </>
  );
};

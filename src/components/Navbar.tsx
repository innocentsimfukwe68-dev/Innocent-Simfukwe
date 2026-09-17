import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Receipt,
  Users,
  Code2,
  UserCheck,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building2,
  Lock,
} from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onOpenLoginModal: () => void;
  productsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onUserChange,
  onOpenLoginModal,
  productsCount,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allUsers = apiService.getUsers();

  const handleSwitchUser = (user: User) => {
    apiService.setCurrentUser(user);
    onUserChange(user);
    setShowUserMenu(false);
  };

  const navItems = [
    { id: 'pos', label: 'Cashier POS', icon: ShoppingBag, cashierAllowed: true },
    { id: 'inventory', label: 'Store Products', icon: Package, badge: productsCount, cashierAllowed: true },
    { id: 'sales', label: 'Sales History', icon: Receipt, cashierAllowed: true },
    { id: 'analytics', label: 'Profit & Analytics', icon: TrendingUp, cashierAllowed: false },
    { id: 'users', label: 'User Security', icon: Users, cashierAllowed: false },
    { id: 'php-api', label: 'PHP Backend (API)', icon: Code2, cashierAllowed: true },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-pink-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">Cosmetics Shop</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  <Building2 className="w-3 h-3 mr-1 text-rose-500" />
                  Duka Kuu
                </span>
              </div>
              <p className="text-xs text-slate-500">Retail POS & Store Management</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRestricted = currentUser?.Role === 'Cashier' && !item.cashierAllowed;

              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => {
                    if (isRestricted) {
                      alert('Admin privileges required to view Analytics and User Security. Please switch to Administrator.');
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : isRestricted
                      ? 'text-slate-400 hover:text-slate-500 hover:bg-slate-50 cursor-not-allowed'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={isRestricted ? 'Admin privilege required' : item.label}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-200 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {isRestricted && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
                </button>
              );
            })}
          </nav>

          {/* User Status & Controls */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.FullName.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-semibold text-slate-900">{currentUser.FullName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          currentUser.Role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {currentUser.Role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentUser.Status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      ></span>
                      <span>{currentUser.Status}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Logged in as</p>
                      <p className="text-sm font-bold text-slate-900">{currentUser.FullName}</p>
                      <p className="text-xs text-slate-600 font-mono">@{currentUser.Username}</p>
                    </div>

                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Switch Demo User
                      </p>
                      {allUsers.map((u) => (
                        <button
                          key={u.UserID}
                          id={`switch-user-${u.UserID}`}
                          onClick={() => handleSwitchUser(u)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            u.UserID === currentUser.UserID
                              ? 'bg-rose-50 text-rose-800 font-medium'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                u.Status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            />
                            <span>{u.FullName}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">{u.Role}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        id="logout-btn"
                        onClick={() => {
                          apiService.logout();
                          onUserChange(null);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isRestricted = currentUser?.Role === 'Cashier' && !item.cashierAllowed;

            return (
              <button
                key={`m-${item.id}`}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  if (isRestricted) {
                    alert('Admin privileges required.');
                    return;
                  }
                  setActiveTab(item.id);
                }}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-rose-100 text-rose-800 font-semibold'
                    : isRestricted
                    ? 'text-slate-400'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

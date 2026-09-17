import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PosView } from './components/PosView';
import { InventoryView } from './components/InventoryView';
import { BranchesView } from './components/BranchesView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { UserManagementView } from './components/UserManagementView';
import { PhpApiView } from './components/PhpApiView';
import { ExpensesView } from './components/ExpensesView';
import { SalesAlertView } from './components/SalesAlertView';
import { AppGuideModal } from './components/AppGuideModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { OfflineSyncBar } from './components/OfflineSyncBar';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { apiService } from './services/apiService';
import { Product, Category, Brand, Location, Customer, User, Sale } from './types';
import { Lock, Menu, Building2, UserCheck, ShieldCheck, ChevronDown, LogOut, Smartphone, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(apiService.getCurrentUser());
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Capture PWA install prompt for Android/Chrome
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA prompt error:', err);
        setShowDownloadModal(true);
      }
    } else {
      setShowDownloadModal(true);
    }
  };

  // Load all database entities
  const loadData = useCallback(() => {
    setProducts(apiService.getProducts());
    setCategories(apiService.getCategories());
    setBrands(apiService.getBrands());
    setLocations(apiService.getLocations());
    setCustomers(apiService.getCustomers());
    setSales(apiService.getSales());
    setCurrentUser(apiService.getCurrentUser());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaleCompleted = (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);
    setProducts(apiService.getProducts());
  };

  const handleUserChange = (user: User | null) => {
    setCurrentUser(user);
    if (
      user &&
      user.Role === 'Cashier' &&
      (activeTab === 'analytics' || activeTab === 'users' || activeTab === 'branches')
    ) {
      setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
  };

  const activeProductsCount = products.filter(
    (p) => p.ProductName.toLowerCase() !== 'total'
  ).length;

  const allUsers = apiService.getUsers();

  // If not logged in, strictly block access to the entire system
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          handleUserChange(user);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900 flex">
      {/* Left Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenGuide={() => setShowDownloadModal(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        productsCount={activeProductsCount}
      />

      {/* Main Content Area (offset on lg by sidebar width 256px / 64) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Offline Status & Sync Manager Top Bar */}
        <OfflineSyncBar onOpenDownloadModal={() => setShowDownloadModal(true)} />

        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Menu Trigger + Shop name */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Fungua Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base tracking-tight hidden sm:inline-block">
                Cosmetics Shop POS
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                <Building2 className="w-3.5 h-3.5 mr-1 text-pink-500" />
                Duka Kuu (Main Store)
              </span>
            </div>
          </div>

          {/* Right: Quick User Profile, App Download Guide & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Download / Install App Direct Button (No 3-dots) */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sakinisha / Pakua App</span>
              <span className="sm:hidden">Sakinisha</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.FullName.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {currentUser.FullName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {currentUser.Role === 'Admin' ? 'Msimamizi (Admin)' : 'Mhudumu (Cashier)'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Akaunti Iliyopo</p>
                      <p className="text-xs font-bold text-slate-800">{currentUser.FullName}</p>
                      <p className="text-[10px] font-mono text-slate-500">@{currentUser.Username}</p>
                    </div>

                    <div className="px-2 py-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Badili Mtumiaji (Demo)
                      </p>
                      {allUsers.map((u) => (
                        <button
                          key={u.UserID}
                          onClick={() => {
                            apiService.setCurrentUser(u);
                            handleUserChange(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            u.UserID === currentUser.UserID
                              ? 'bg-rose-50 text-rose-800 font-bold'
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
                          <span className="text-[10px] font-semibold text-slate-500">{u.Role}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Ondoka (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ingia Mfumo</span>
              </button>
            )}
          </div>
        </header>

        {/* Inactive Account Alert Banner */}
        {currentUser && currentUser.Status === 'Inactive' && (
          <div className="bg-rose-600 text-white px-4 py-2.5 text-xs text-center font-medium flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>
              Taarifa: Akaunti yako kwa sasa imezimwa (<strong>Inactive</strong>). Mauzo na mabadiliko
              yamefungwa hadi Msimamizi atakapoifungua tena.
            </span>
          </div>
        )}

        {/* Dynamic Views */}
        <main className="flex-1 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              sales={sales}
              currentUser={currentUser}
              locations={locations}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'pos' && (
            <PosView
              products={products}
              categories={categories}
              brands={brands}
              locations={locations}
              customers={customers}
              currentUser={currentUser}
              onSaleCompleted={handleSaleCompleted}
              onRefreshProducts={loadData}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              categories={categories}
              brands={brands}
              locations={locations}
              currentUser={currentUser}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'branches' && (
            <BranchesView
              locations={locations}
              products={products}
              currentUser={currentUser}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'sales' && (
            <SalesHistoryView sales={sales} currentUser={currentUser} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              products={products}
              categories={categories}
              sales={sales}
              currentUser={currentUser}
              onSwitchToAdmin={() => {
                const adminUser = apiService.getUsers().find((u) => u.Role === 'Admin');
                if (adminUser) {
                  handleUserChange(adminUser);
                  loadData();
                }
              }}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView currentUser={currentUser} />
          )}

          {activeTab === 'sales-alert' && (
            <SalesAlertView currentUser={currentUser} />
          )}

          {activeTab === 'users' && (
            <UserManagementView
              currentUser={currentUser}
              onRefreshUsers={loadData}
              onSwitchUser={(user) => {
                handleUserChange(user);
                loadData();
              }}
            />
          )}

          {activeTab === 'php-api' && <PhpApiView />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <p>
              Cosmetics Shop POS System • Database: <code className="text-slate-600 font-mono">cosmetics_shop</code> •
              API: <code className="text-pink-600 font-mono">http://localhost/cosmetics_shop/api.php</code>
            </p>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-emerald-600 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{activeProductsCount} SKUs Zinazopatikana</span>
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Rejesha data zote za awali kutoka kwenye SQL dump?')) {
                    apiService.resetToDump();
                    loadData();
                  }
                }}
                className="text-slate-400 hover:text-slate-600 underline"
              >
                Rejesha Data (Reset)
              </button>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => {
            handleUserChange(user);
            loadData();
          }}
        />

        {/* App Guide Modal */}
        <AppGuideModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          deferredPrompt={deferredPrompt}
          onTriggerInstall={handleTriggerInstall}
        />

        {/* Direct In-App Download & Offline Modal */}
        <DownloadAppModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          deferredPrompt={deferredPrompt}
          onTriggerInstall={handleTriggerInstall}
        />
      </div>
    </div>
  );
}

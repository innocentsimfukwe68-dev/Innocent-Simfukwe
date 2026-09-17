import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Package,
  Layers,
  MapPin,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Location, Product, User } from '../types';
import { apiService } from '../services/apiService';

interface BranchesViewProps {
  locations: Location[];
  products: Product[];
  currentUser: User | null;
  onRefresh: () => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({
  locations,
  products,
  currentUser,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const isAdmin = currentUser?.Role === 'Admin';

  // Calculate stats per location
  const locationStats = locations.map((loc) => {
    const locProducts = products.filter(
      (p) => p.LocationID === loc.LocationID && p.ProductName.toLowerCase() !== 'total'
    );
    const totalUnits = locProducts.reduce((sum, p) => sum + (Number(p.Quantity) || 0), 0);
    const totalValue = locProducts.reduce(
      (sum, p) => sum + (Number(p.Quantity) || 0) * (Number(p.SellingPrice) || 0),
      0
    );
    return {
      ...loc,
      productsCount: locProducts.length,
      totalUnits,
      totalValue,
    };
  });

  const filteredLocations = locationStats.filter(
    (loc) =>
      loc.LocationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.Description && loc.Description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    const newLoc: Location = {
      LocationID: Date.now(),
      LocationName: newLocationName.trim(),
      Description: newDescription.trim() || 'Tawi / Sehemu mpya ya duka',
    };

    const currentLocs = apiService.getLocations();
    const updated = [...currentLocs, newLoc];
    localStorage.setItem('cs_locations_v1', JSON.stringify(updated));

    setNewLocationName('');
    setNewDescription('');
    setShowAddModal(false);
    onRefresh();
  };

  const selectedLocProducts = selectedLocation
    ? products.filter(
        (p) =>
          p.LocationID === selectedLocation.LocationID && p.ProductName.toLowerCase() !== 'total'
      )
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>Matawi na Mashelfu ya Maduka</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Usimamizi wa sehemu za stoo, mashelfu, kaunta, na matawi ya kuhifadhi bidhaa.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Sajili Tawi / Shelfu Mpya</span>
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Jumla ya Sehemu & Mashelfu
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{locations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Stoo Kuu, Kaunta na Mashelfu yaliyosajiliwa</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Sehemu Yenye Mzigo Mwingi
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">
            {locationStats.sort((a, b) => b.totalUnits - a.totalUnits)[0]?.LocationName || 'N/A'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {locationStats.sort((a, b) => b.totalUnits - a.totalUnits)[0]?.totalUnits.toLocaleString() || 0} vipande
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Jumla ya Bidhaa Zilizopangwa
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {locationStats.reduce((sum, l) => sum + l.totalUnits, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Kwenye vitengo 80+ vya stoo</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tafuta jina la tawi au namba ya shelfu (mfano: Stoo Kuu, AA 01A, Counter B)..."
          className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Futa
          </button>
        )}
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLocations.map((loc) => (
          <div
            key={loc.LocationID}
            onClick={() => setSelectedLocation(loc)}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-md ${
              selectedLocation?.LocationID === loc.LocationID
                ? 'border-indigo-600 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{loc.LocationName}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{loc.Description}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Aina za Bidhaa:</span>
              <span className="font-bold text-slate-800">{loc.productsCount}</span>
            </div>

            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Jumla ya Vipande:</span>
              <span className="font-bold text-emerald-600">{loc.totalUnits.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Location Products Drawer/Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Bidhaa Zilizopo: {selectedLocation.LocationName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedLocation.Description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
              {selectedLocProducts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Hakuna bidhaa zilizopangiwa eneo hili bado.
                </div>
              ) : (
                selectedLocProducts.map((p) => (
                  <div key={p.ProductID} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{p.ProductName}</p>
                      <p className="text-[11px] text-slate-400">
                        Bei ya kuuzia: TSh {p.SellingPrice.toLocaleString()} • Barcode:{' '}
                        {p.Barcode || 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {p.Quantity} zilizopo
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLocation(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Sajili Tawi / Shelfu Mpya</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jina la Tawi au Namba ya Shelfu *
                </label>
                <input
                  type="text"
                  required
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Mfano: Tawi la Kariakoo, Shelfu CC 01"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maelezo ya Ziada (Description)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mfano: Shelfu ya mafuta ya nywele na lotion..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Hifadhi Tawi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  MapPin,
  Tag,
  Edit2,
  TrendingUp,
  Boxes,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  X,
  Layers,
} from 'lucide-react';
import { Product, Category, Brand, Location, User, canViewProfit, canAddProduct, canAdjustStock } from '../types';
import { apiService } from '../services/apiService';
import { Lock, Sparkles, Barcode as BarcodeIcon } from 'lucide-react';
import { useLanguage } from '../i18n';

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  locations: Location[];
  currentUser: User | null;
  onRefresh: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  categories,
  brands,
  locations,
  currentUser,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [filterBrand, setFilterBrand] = useState<number | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<number | 'all'>('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'stock' | 'price' | 'profit'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isAdmin = canViewProfit(currentUser?.Role);
  const canAdd = canAddProduct(currentUser?.Role);
  const canAdjust = canAdjustStock(currentUser?.Role);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(5);

  // Form State
  const [formData, setFormData] = useState({
    ProductName: '',
    Barcode: '',
    CategoryID: 1,
    BrandID: null as number | null,
    LocationID: 4 as number | null,
    SupplierID: 1,
    BuyingPrice: 0,
    SellingPrice: 0,
    Quantity: 1,
    ReorderLevel: 3,
  });

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.CategoryID === id)?.CategoryName || 'Other';
  };

  const getBrandName = (id: number | null) => {
    if (!id) return 'Unbranded';
    return brands.find((b) => b.BrandID === id)?.BrandName || 'Other';
  };

  const getLocationName = (id: number | null) => {
    if (id === null || id === undefined) return 'Stoo Kuu';
    return locations.find((l) => l.LocationID === id)?.LocationName || `Loc ${id}`;
  };

  // Inventory stats
  const validProducts = useMemo(() => {
    return products.filter((p) => p.ProductName.toLowerCase() !== 'total');
  }, [products]);

  const totalSKUs = validProducts.length;
  const totalUnits = validProducts.reduce((acc, p) => acc + (p.Quantity || 0), 0);
  const totalCostValue = validProducts.reduce((acc, p) => acc + (p.BuyingPrice || 0) * (p.Quantity || 0), 0);
  const totalRetailValue = validProducts.reduce((acc, p) => acc + (p.SellingPrice || 0) * (p.Quantity || 0), 0);
  const lowStockCount = validProducts.filter((p) => p.Quantity > 0 && p.Quantity <= p.ReorderLevel).length;
  const outOfStockCount = validProducts.filter((p) => p.Quantity === 0).length;

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    const list = validProducts.filter((p) => {
      const matchQuery =
        p.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.Barcode && p.Barcode.includes(searchTerm)) ||
        getLocationName(p.LocationID).toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = filterCategory === 'all' || p.CategoryID === filterCategory;
      const matchBrand = filterBrand === 'all' || p.BrandID === filterBrand;
      const matchLoc = filterLocation === 'all' || p.LocationID === filterLocation;

      let matchStock = true;
      if (filterStockStatus === 'low') {
        matchStock = p.Quantity > 0 && p.Quantity <= p.ReorderLevel;
      } else if (filterStockStatus === 'out') {
        matchStock = p.Quantity === 0;
      } else if (filterStockStatus === 'in') {
        matchStock = p.Quantity > p.ReorderLevel;
      }

      return matchQuery && matchCat && matchBrand && matchLoc && matchStock;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') comparison = a.ProductID - b.ProductID;
      if (sortBy === 'name') comparison = a.ProductName.localeCompare(b.ProductName);
      if (sortBy === 'stock') comparison = a.Quantity - b.Quantity;
      if (sortBy === 'price') comparison = a.SellingPrice - b.SellingPrice;
      if (sortBy === 'profit') {
        const profitA = a.SellingPrice - a.BuyingPrice;
        const profitB = b.SellingPrice - b.BuyingPrice;
        comparison = profitA - profitB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [
    validProducts,
    searchTerm,
    filterCategory,
    filterBrand,
    filterLocation,
    filterStockStatus,
    sortBy,
    sortOrder,
  ]);

  // Handle Add Product
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ProductName.trim()) return;

    apiService.addProduct({
      ProductName: formData.ProductName.trim(),
      Barcode: formData.Barcode.trim() || null,
      CategoryID: Number(formData.CategoryID),
      BrandID: formData.BrandID ? Number(formData.BrandID) : null,
      LocationID: formData.LocationID !== null ? Number(formData.LocationID) : null,
      SupplierID: Number(formData.SupplierID),
      BuyingPrice: Number(formData.BuyingPrice),
      SellingPrice: Number(formData.SellingPrice),
      CostPrice: 0,
      Quantity: Number(formData.Quantity),
      ReorderLevel: Number(formData.ReorderLevel),
      ExpiryDate: null,
    });

    setShowAddModal(false);
    onRefresh();
    setFormData({
      ProductName: '',
      Barcode: '',
      CategoryID: 1,
      BrandID: null,
      LocationID: 4,
      SupplierID: 1,
      BuyingPrice: 0,
      SellingPrice: 0,
      Quantity: 1,
      ReorderLevel: 3,
    });
  };

  // Handle Edit Product
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    apiService.updateProduct(editingProduct);
    setEditingProduct(null);
    onRefresh();
  };

  // Handle Stock Adjustment
  const handleStockAdjust = () => {
    if (!stockAdjustProduct) return;
    apiService.adjustStock(stockAdjustProduct.ProductID, stockDelta);
    setStockAdjustProduct(null);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Stats Overview */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cosmetics Store Inventory</h1>
          <p className="text-xs text-slate-500">
            Real-time stock tracking, shelf locations, wholesale buying costs, and retail prices
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canAdd && (
            <button
              id="add-product-btn"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Bidhaa Mpya (Add Product)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Products
            </span>
            <Boxes className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{totalSKUs}</span>
            <span className="text-xs text-slate-500">unique SKUs</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{totalUnits.toLocaleString()} units currently in store</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Store Retail Value
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-bold text-emerald-700">{formatTZS(totalRetailValue)}</span>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin ? (
              <>
                Wholesale Cost: <strong className="text-slate-700">{formatTZS(totalCostValue)}</strong>
              </>
            ) : (
              <span className="text-slate-400 italic flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400 inline" /> Mtaji / Faida: Siri ya Admin
              </span>
            )}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Low Stock Alert
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
          <p className="text-xs text-slate-500 mt-1">Items at or below reorder level (≤ 3)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-rose-600">{outOfStockCount}</span>
          <p className="text-xs text-slate-500 mt-1">Cosmetics needing immediate restock</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="inventory-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, barcode, shelf location (e.g. AA 01A)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.CategoryID} value={c.CategoryID}>
                  {c.CategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              id="filter-stock-status"
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Stock Statuses</option>
              <option value="low">Low Stock Only (≤ Reorder)</option>
              <option value="out">Out of Stock Only (0)</option>
              <option value="in">Normal Stock Only</option>
            </select>
          </div>

          {/* Shelf Location Filter */}
          <div>
            <select
              id="filter-location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Shelf Locations</option>
              {locations.map((l) => (
                <option key={l.LocationID} value={l.LocationID}>
                  {l.LocationName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sort Options */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <span>Showing:</span>
            <strong className="text-slate-800">{filteredProducts.length}</strong> of {totalSKUs} products
          </div>

          <div className="flex items-center space-x-2">
            <span>Sort by:</span>
            <div className="flex space-x-1">
              {(isAdmin
                ? (['id', 'name', 'stock', 'price', 'profit'] as Array<'id' | 'name' | 'stock' | 'price' | 'profit'>)
                : (['id', 'name', 'stock', 'price'] as Array<'id' | 'name' | 'stock' | 'price' | 'profit'>)
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    if (sortBy === s) {
                      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortBy(s);
                      setSortOrder('asc');
                    }
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    sortBy === s
                      ? 'bg-rose-100 text-rose-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.toUpperCase()} {sortBy === s ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 w-12">ID</th>
                <th className="px-3 py-3">Product Name</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Location / Shelf</th>
                {isAdmin && <th className="px-3 py-3 text-right">Cost (Buy)</th>}
                <th className="px-3 py-3 text-right">Selling Price</th>
                {isAdmin && <th className="px-3 py-3 text-right">Profit Margin</th>}
                <th className="px-3 py-3 text-center">Stock</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((product) => {
                const profit = product.SellingPrice - product.BuyingPrice;
                const marginPct =
                  product.SellingPrice > 0 ? ((profit / product.SellingPrice) * 100).toFixed(0) : '0';
                const isOutOfStock = product.Quantity === 0;
                const isLowStock = !isOutOfStock && product.Quantity <= product.ReorderLevel;

                return (
                  <tr
                    key={product.ProductID}
                    id={`inventory-row-${product.ProductID}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-mono text-slate-400">#{product.ProductID}</td>
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-slate-900">{product.ProductName}</p>
                      {product.Barcode && (
                        <p className="text-[10px] text-slate-400 font-mono">Barcode: {product.Barcode}</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {getCategoryName(product.CategoryID)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        <span className="font-mono text-xs">{getLocationName(product.LocationID)}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                        {formatTZS(product.BuyingPrice)}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                      {formatTZS(product.SellingPrice)}
                    </td>
                    {isAdmin && (
                      <td className="px-3 py-2.5 text-right font-mono">
                        <span className="text-emerald-700 font-semibold">+{formatTZS(profit)}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({marginPct}%)</span>
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.Quantity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setStockAdjustProduct(product);
                            setStockDelta(5);
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-colors"
                          title="Quick Restock / Stock Adjust"
                        >
                          Stock ±
                        </button>
                        {currentUser?.Role === 'Admin' && (
                          <button
                            onClick={() => setEditingProduct({ ...product })}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Edit Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjust Modal */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-slate-900">Adjust Stock Quantity</h3>
              <button
                onClick={() => setStockAdjustProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Product: <strong className="text-slate-900">{stockAdjustProduct.ProductName}</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4 flex justify-between items-center">
              <span className="text-xs text-slate-500">Current Stock:</span>
              <span className="text-sm font-bold text-slate-900">{stockAdjustProduct.Quantity} units</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Adjustment Units (+ to add, - to deduct)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={stockDelta}
                    onChange={(e) => setStockDelta(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
                  />
                  <div className="flex space-x-1">
                    {[+5, +10, +25, -1].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStockDelta(n)}
                        className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 font-mono"
                      >
                        {n > 0 ? `+${n}` : n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>New resulting stock:</span>
                <span className="font-bold text-slate-900">
                  {Math.max(0, stockAdjustProduct.Quantity + stockDelta)} units
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setStockAdjustProduct(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockAdjust}
                  className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  Save Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Available for Cashier & Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Ongeza Bidhaa Mpya Kwenye Stoo</h3>
                <p className="text-[11px] text-slate-500">
                  {isAdmin
                    ? 'Sajili bidhaa mpya kwenye kanzidata ya mfumo (Ruhusa ya Msimamizi)'
                    : 'Sajili bidhaa mpya kwenye kanzidata (Ruhusa ya Mhudumu/Cashier)'}
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Jina la Bidhaa (Product Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.ProductName}
                  onChange={(e) => setFormData({ ...formData, ProductName: e.target.value })}
                  placeholder="mfano: Carolight Cream (500ml), Nivea Lotion, Bodyspray..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700">Barcode / SKU</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomCode = '890' + Math.floor(1000000 + Math.random() * 9000000).toString();
                        setFormData((prev) => ({ ...prev, Barcode: randomCode }));
                      }}
                      className="text-[10px] text-pink-600 hover:text-pink-700 font-semibold flex items-center space-x-0.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Tengeneza Barcode</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.Barcode}
                    onChange={(e) => setFormData({ ...formData, Barcode: e.target.value })}
                    placeholder="mfano: 8901099"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Aina ya Bidhaa (Category)</label>
                  <select
                    value={formData.CategoryID}
                    onChange={(e) => setFormData({ ...formData, CategoryID: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {categories.map((c) => (
                      <option key={c.CategoryID} value={c.CategoryID}>
                        {c.CategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Brand (Chapa)</label>
                  <select
                    value={formData.BrandID ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, BrandID: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="">None / Kawaida</option>
                    {brands.map((b) => (
                      <option key={b.BrandID} value={b.BrandID}>
                        {b.BrandName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Rafu / Sehemu Stoo (Location)</label>
                  <select
                    value={formData.LocationID ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LocationID: e.target.value !== '' ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {locations.map((l) => (
                      <option key={l.LocationID} value={l.LocationID}>
                        {l.LocationName} {l.Description ? `(${l.Description})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isAdmin ? (
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Bei ya Kununua Jumla (Buying Price - TZS)
                    </label>
                    <input
                      type="number"
                      value={formData.BuyingPrice}
                      onChange={(e) => setFormData({ ...formData, BuyingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-600 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Bei ya Kununua (Admin Only)</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Itajazwa au kurekebishwa na Msimamizi/Admin baadaye.
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Bei ya Kuuza Rejareja (Selling Price - TZS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.SellingPrice}
                    onChange={(e) => setFormData({ ...formData, SellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Idadi ya Kuanzia (Quantity)</label>
                  <input
                    type="number"
                    value={formData.Quantity}
                    onChange={(e) => setFormData({ ...formData, Quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Tahadhari ya Kuisha (Reorder)</label>
                  <input
                    type="number"
                    value={formData.ReorderLevel}
                    onChange={(e) => setFormData({ ...formData, ReorderLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Ghairi (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow-xs"
                >
                  Hifadhi Kwenye Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal (Admin) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900">Edit Product #{editingProduct.ProductID}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.ProductName}
                  onChange={(e) => setEditingProduct({ ...editingProduct, ProductName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {isAdmin ? (
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Buying Price (TZS)</label>
                    <input
                      type="number"
                      value={editingProduct.BuyingPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, BuyingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center">
                    <Lock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <span>Gharama ya jumla imefichwa (Admin Only)</span>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Selling Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.SellingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, SellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono font-bold text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Shelf Location</label>
                  <select
                    value={editingProduct.LocationID ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        LocationID: e.target.value !== '' ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {locations.map((l) => (
                      <option key={l.LocationID} value={l.LocationID}>
                        {l.LocationName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.Quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, Quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

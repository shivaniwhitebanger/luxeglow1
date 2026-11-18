/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ArrowLeft,
  Search,
  Check,
  X,
  Sparkles,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { api } from '../services/api';
import { Product, AdminStats, Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, logoutUser, setIsAdminView, addToast, reloadProducts, products } = useCartWishlist();

  // Active tab: 'analytics' | 'products' | 'orders' | 'customers'
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'customers'>('analytics');

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Product management
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for add/edit product
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Skincare');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formPrice, setFormPrice] = useState<number>(2950);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(3500);
  const [formDiscount, setFormDiscount] = useState<number>(15);
  const [formStock, setFormStock] = useState<number>(50);
  const [formVolume, setFormVolume] = useState('50 ml / 1.7 fl oz');
  const [formBadge, setFormBadge] = useState<string>('New');
  const [formDescription, setFormDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formRitual, setFormRitual] = useState('');
  const [formImage, setFormImage] = useState('/images/category_skincare_serum_1793790405658.jpg');

  // Load admin data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, ordersRes, customersRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminOrders().catch(() => []),
        api.getAdminCustomers().catch(() => []),
      ]);
      setStats(statsRes);
      setOrders(ordersRes);
      setCustomers(customersRes);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Check admin rights
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-[#E8D5C4] rounded-2xl p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif text-[#493638]">Restricted Atelier Area</h2>
          <p className="text-xs text-[#745C5F]">
            This portal is strictly authorized for executive curators and administrators of ÉLIXIR BEAUTÉ.
          </p>
          <button
            onClick={() => setIsAdminView(false)}
            className="px-6 py-2.5 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325]"
          >
            Return to Boutique
          </button>
        </div>
      </div>
    );
  }

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSubtitle(product.subtitle);
    setFormCategory(product.category);
    setFormSubcategory(product.subcategory);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormDiscount(product.discountPercent);
    setFormStock(product.stock);
    setFormVolume(product.volumeOrWeight);
    setFormBadge(product.badge || 'New');
    setFormDescription(product.description);
    setFormIngredients(product.keyIngredients.join(', '));
    setFormRitual(product.ritual);
    setFormImage(product.image);
    setIsAddModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSubtitle('');
    setFormCategory('Skincare');
    setFormSubcategory('Cleansers');
    setFormPrice(2950);
    setFormOriginalPrice(3500);
    setFormDiscount(15);
    setFormStock(50);
    setFormVolume('50 ml / 1.7 fl oz');
    setFormBadge('New');
    setFormDescription('An exceptional cold-pressed botanical preparation formulated to bestow deep cellular luminescence.');
    setFormIngredients('Damask Rose Water, Squalane, Peptides, Vitamin E');
    setFormRitual('Warm 3 drops between clean palms and press gently into face every morning.');
    setFormImage('/images/category_skincare_serum_1793790405658.jpg');
    setIsAddModalOpen(true);
  };

  // Save product (Add or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Product> = {
        name: formName,
        subtitle: formSubtitle,
        category: formCategory,
        subcategory: formSubcategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercent: Number(formDiscount),
        stock: Number(formStock),
        volumeOrWeight: formVolume,
        badge: formBadge as any,
        description: formDescription,
        keyIngredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
        ritual: formRitual,
        image: formImage,
        images: [formImage],
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        addToast(`Formulation "${formName}" updated`, 'success');
      } else {
        await api.addProduct(payload);
        addToast(`New formulation "${formName}" added to catalog`, 'success');
      }

      setIsAddModalOpen(false);
      await reloadProducts();
      await loadAdminData();
    } catch (err: any) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you certain you wish to retire formulation "${name}" from the atelier catalog?`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      addToast(`Formulation retired successfully`, 'info');
      await reloadProducts();
      await loadAdminData();
    } catch (err: any) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order status updated to ${newStatus}`, 'success');
      await loadAdminData();
    } catch (err: any) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Filtered products list for product management
  const adminProducts = products.filter((p) => {
    const matchesCat = selectedProductCategory === 'All' || p.category === selectedProductCategory;
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#493638] font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#493638] text-[#FFF9F3] border-b border-[#322325] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminView(false)}
              className="flex items-center gap-1.5 text-xs text-[#E8D5C4] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Boutique</span>
            </button>
            <span className="text-[#B76E79]" aria-hidden="true">|</span>
            <div>
              <h1 className="text-base font-serif tracking-widest uppercase">
                ÉLIXIR BEAUTÉ <span className="text-[#ECC7C7] font-sans text-xs tracking-normal font-normal">Executive Dashboard</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-white">{user.name}</p>
              <p className="text-[10px] text-[#ECC7C7] uppercase tracking-wider">Authorized Curator</p>
            </div>
            <button
              onClick={() => {
                logoutUser();
                setIsAdminView(false);
              }}
              className="p-2 text-[#E8D5C4] hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 border-t border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 font-medium uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-[#B76E79] text-white bg-white/5 font-semibold'
                : 'border-transparent text-[#E8D5C4] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview & Sales</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 font-medium uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#B76E79] text-white bg-white/5 font-semibold'
                : 'border-transparent text-[#E8D5C4] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Formulations ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-medium uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#B76E79] text-white bg-white/5 font-semibold'
                : 'border-transparent text-[#E8D5C4] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-3 px-4 font-medium uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'border-[#B76E79] text-white bg-white/5 font-semibold'
                : 'border-transparent text-[#E8D5C4] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patron Directory ({customers.length})</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs">
                <div className="flex justify-between items-center text-[#745C5F] text-xs uppercase tracking-wider mb-2">
                  <span>Gross Sales</span>
                  <div className="p-2 bg-[#F6E5E5] text-[#B76E79] rounded-xl">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-light text-[#493638] tabular-nums">
                  ₹{(stats?.totalRevenue || 11135).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% compared to last cycle</span>
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs">
                <div className="flex justify-between items-center text-[#745C5F] text-xs uppercase tracking-wider mb-2">
                  <span>Total Orders</span>
                  <div className="p-2 bg-[#F6E5E5] text-[#B76E79] rounded-xl">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-light text-[#493638] tabular-nums">
                  {stats?.totalOrders || orders.length}
                </p>
                <p className="text-[11px] text-[#745C5F] mt-1">
                  Average Value: ₹{(stats?.averageOrderValue || 5567).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs">
                <div className="flex justify-between items-center text-[#745C5F] text-xs uppercase tracking-wider mb-2">
                  <span>Active Catalog</span>
                  <div className="p-2 bg-[#F6E5E5] text-[#B76E79] rounded-xl">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-light text-[#493638] tabular-nums">
                  {products.length} Formulations
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  8 Atelier categories in stock
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs">
                <div className="flex justify-between items-center text-[#745C5F] text-xs uppercase tracking-wider mb-2">
                  <span>Registered Patrons</span>
                  <div className="p-2 bg-[#F6E5E5] text-[#B76E79] rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-light text-[#493638] tabular-nums">
                  {stats?.totalCustomers || customers.length || 2}
                </p>
                <p className="text-[11px] text-[#745C5F] mt-1">
                  Verified member accounts
                </p>
              </div>
            </div>

            {/* Sales Distribution & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category Breakdown */}
              <div className="lg:col-span-5 p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-serif text-[#493638]">
                  Category Volume Distribution
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { cat: 'Serums & Elixirs', pct: 32, sales: '₹34,800' },
                    { cat: 'Lipsticks & Nectars', pct: 24, sales: '₹26,100' },
                    { cat: 'Perfumes Extraits', pct: 20, sales: '₹21,750' },
                    { cat: 'Moisturizers & Balms', pct: 14, sales: '₹15,220' },
                    { cat: 'Foundations & Powders', pct: 10, sales: '₹10,870' },
                  ].map((row) => (
                    <div key={row.cat} className="space-y-1">
                      <div className="flex justify-between text-[#745C5F]">
                        <span>{row.cat}</span>
                        <span className="font-semibold text-[#493638] tabular-nums">{row.sales} ({row.pct}%)</span>
                      </div>
                      <div className="w-full bg-[#F6E5E5] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#B76E79] h-full rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="lg:col-span-7 p-6 bg-white border border-[#E8D5C4] rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif text-[#493638]">Recent Acquisitions</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#B76E79] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 bg-[#FDF4EB] border border-[#E8D5C4] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#493638]">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-[#F6E5E5] text-[#B76E79]">
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#745C5F] mt-0.5">
                          {order.customer.name} · {order.items.length} items
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-[#493638] tabular-nums block">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#745C5F]">{order.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8D5C4]">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#745C5F]" />
                <input
                  type="text"
                  placeholder="Search formulations by name or subcategory..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-transparent border-none focus:outline-none text-[#493638]"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="bg-[#FFF9F3] border border-[#E8D5C4] text-xs rounded-xl px-3 py-2 text-[#493638] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Serums">Serums</option>
                  <option value="Moisturizers">Moisturizers</option>
                  <option value="Foundations">Foundations</option>
                  <option value="Lipsticks">Lipsticks</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Perfumes">Perfumes</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#493638] hover:bg-[#322325] text-white text-xs uppercase tracking-wider font-medium rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Formulation</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-[#E8D5C4] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#493638]">
                  <thead className="bg-[#FDF4EB] border-b border-[#E8D5C4] text-[11px] uppercase tracking-wider text-[#745C5F]">
                    <tr>
                      <th className="py-3 px-4">Formulation</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (INR)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Privilege</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D5C4]/40">
                    {adminProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-[#FDF4EB] border border-[#E8D5C4]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-semibold text-[#493638]">{p.name}</p>
                            <p className="text-[10px] text-[#745C5F]">{p.volumeOrWeight}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#745C5F] font-medium">
                          {p.category} · {p.subcategory}
                        </td>
                        <td className="py-3 px-4 font-semibold tabular-nums">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 tabular-nums">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                            p.stock > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#B76E79] font-medium">
                          {p.discountPercent}% Off
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-[#745C5F] hover:text-[#B76E79] hover:bg-[#F6E5E5] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-[#745C5F] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E8D5C4] rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 bg-[#FDF4EB] border-b border-[#E8D5C4] flex justify-between items-center text-xs">
                <span className="font-medium text-[#493638]">All Atelier Customer Orders ({orders.length})</span>
                <button
                  onClick={loadAdminData}
                  className="flex items-center gap-1 text-[#B76E79] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#493638]">
                  <thead className="bg-[#FFF9F3] border-b border-[#E8D5C4] text-[11px] uppercase tracking-wider text-[#745C5F]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Patron</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D5C4]/40">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#493638]">
                          {o.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#493638]">{o.customer?.name || o.shippingAddress?.fullName}</p>
                          <p className="text-[10px] text-[#745C5F]">{o.customer?.email || o.shippingAddress?.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#745C5F]">
                          {o.items?.map((item: any) => `${item.name} (${item.quantity})`).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-semibold tabular-nums">
                          ₹{o.total?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800">
                            {o.paymentMethod} · {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="bg-[#FFF9F3] border border-[#E8D5C4] text-xs rounded-lg px-2.5 py-1 text-[#493638] cursor-pointer focus:outline-none focus:border-[#B76E79]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CUSTOMERS DIRECTORY ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E8D5C4] rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 bg-[#FDF4EB] border-b border-[#E8D5C4] text-xs font-medium text-[#493638]">
                Registered Patrons Directory ({customers.length})
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#493638]">
                  <thead className="bg-[#FFF9F3] border-b border-[#E8D5C4] text-[11px] uppercase tracking-wider text-[#745C5F]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D5C4]/40">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#493638]">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#745C5F]">
                          <p>{c.email}</p>
                          <p className="text-[10px]">{c.phone || 'N/A'}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#745C5F] max-w-xs truncate">
                          {c.address || 'Standard Registered'}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-semibold">
                          {c.ordersCount}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#B76E79] tabular-nums">
                          ₹{c.totalSpent?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#E8D5C4]">
              <h3 className="text-xl font-serif text-[#493638]">
                {editingProduct ? 'Edit Formulation Details' : 'Create New Formulation'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#745C5F] hover:text-[#493638]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Formulation Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                    placeholder="e.g., L’Élixir Rose Squalane Serum"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                    placeholder="e.g., Cold-pressed Damask Rose lipids"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Serums">Serums</option>
                    <option value="Moisturizers">Moisturizers</option>
                    <option value="Foundations">Foundations</option>
                    <option value="Lipsticks">Lipsticks</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                    placeholder="e.g., Face Oils"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Original Price (INR)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                    Volume / Weight
                  </label>
                  <input
                    type="text"
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                    placeholder="30 ml / 1.0 fl oz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Image Path / Preset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                  />
                  <select
                    onChange={(e) => setFormImage(e.target.value)}
                    className="px-2 py-2 bg-[#FDF4EB] border border-[#E8D5C4] rounded-xl text-xs"
                  >
                    <option value="">Preset Imagery...</option>
                    <option value="/images/category_skincare_serum_1793790405658.jpg">Serum Dropper</option>
                    <option value="/images/category_lipstick_velvet_1793790406318.jpg">Velvet Lipstick</option>
                    <option value="/images/category_perfume_flacon_1793790404112.jpg">Crystal Perfume</option>
                    <option value="/images/hero_luxury_cosmetics_1793790406294.jpg">Hero Cream & Bottles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Key Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E8D5C4] rounded-full text-xs font-medium text-[#745C5F] hover:bg-[#F6E5E5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#493638] hover:bg-[#322325] text-white rounded-full text-xs uppercase tracking-wider font-medium shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

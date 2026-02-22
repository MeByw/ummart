'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../providers'; 
import { Plus, Package, DollarSign, BarChart3, Settings, Camera, Save, ShieldCheck, ArrowRight, Award, FileText } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  seller?: string;
  reviews?: number;
  rating?: number;
}

export default function SellerDashboard() {
  const { allProducts, sellerProfile, updateSellerProfile } = useCart();
  
  // NEW: Search state for the seller's specific products
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter by seller AND search query!
  const sellerProducts = allProducts.filter((p: Product) => {
    const isSellerProduct = p.seller === (sellerProfile.shopName || sellerProfile.name);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return isSellerProduct && matchesSearch;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState(sellerProfile.shopName || '');
  const [shopImage, setShopImage] = useState(sellerProfile.image || '');

  const totalSales = sellerProducts.reduce((acc: number, p: Product) => acc + (p.price * (p.reviews || 0)), 0);
  const totalOrders = sellerProducts.reduce((acc: number, p: Product) => acc + (p.reviews || 0), 0);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setShopImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (updateSellerProfile) {
        updateSellerProfile({ ...sellerProfile, shopName, image: shopImage });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans selection:bg-[#006837] selection:text-white">
      {/* Passing the search props brings the search bar back JUST for this page */}
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- HEADER & PROFILE SECTION --- */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                        {shopImage ? <img src={shopImage} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-[#006837]">{shopName.charAt(0) || 'S'}</span>}
                    </div>
                    {isEditing && (
                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <Camera className="text-white drop-shadow-md" size={24} />
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                    )}
                </div>

                <div>
                    {isEditing ? (
                        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="text-2xl md:text-3xl font-black text-gray-900 border-b-2 border-[#006837] focus:outline-none bg-transparent py-1" placeholder="Enter Shop Name" />
                    ) : (
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{shopName || 'My Shop'}</h1>
                    )}
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Verified Seller
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {isEditing ? (
                    <button onClick={handleSaveProfile} className="flex-1 md:flex-none bg-[#006837] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95">
                        <Save size={18} /> Save Profile
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                        <Settings size={18} /> Edit Profile
                    </button>
                )}
                <Link href="/seller/add" className="flex-1 md:flex-none bg-[#006837] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95">
                    <Plus size={20} /> Add Product
                </Link>
            </div>
        </div>

        {/* --- HALAL JAKIM BANNER --- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#006837] to-[#158843] rounded-3xl p-8 text-white shadow-xl shadow-green-900/10 border border-green-700/30">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10 pointer-events-none">
            <ShieldCheck size={240} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md border border-white/20 shadow-sm">
                <Award size={14} /> Kelebihan Peniaga UMMart
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">Sistem Pra-Kelayakan Halal JAKIM</h2>
              <p className="text-green-50 text-sm md:text-base leading-relaxed opacity-95">Tingkatkan jualan dan raih kepercayaan pelanggan dengan status Halal. Muat naik dokumen asas anda dan pasukan UMMart akan membimbing anda melengkapkan permohonan MYeHALAL secara percuma.</p>
            </div>
            <Link href="/seller/halal" className="group inline-flex items-center justify-center gap-2 bg-white text-[#006837] px-8 py-4 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 w-full md:w-auto">
              <FileText size={20} className="text-[#006837]" /> Mula Memohon <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                    <div className="p-2 bg-green-50 text-[#006837] rounded-lg"><DollarSign size={20} /></div>
                    <span className="font-bold text-sm uppercase tracking-wider">Total Revenue</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">RM{totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20} /></div>
                    <span className="font-bold text-sm uppercase tracking-wider">Active Products</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{sellerProducts.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><BarChart3 size={20} /></div>
                    <span className="font-bold text-sm uppercase tracking-wider">Total Orders</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{totalOrders}</p>
            </div>
        </div>

        {/* --- PRODUCTS LIST --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Your Products {searchQuery && `(Carian: "${searchQuery}")`}</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4 pl-6 font-semibold">Product</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Sold</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sellerProducts.length > 0 ? sellerProducts.map((product: Product) => (
                            <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                          <span className="font-bold text-gray-900 block mb-0.5">{product.name}</span>
                                          <span className="text-xs text-gray-500 font-medium">{product.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-900 font-bold">RM{product.price.toFixed(2)}</td>
                                <td className="p-4 text-gray-600 font-medium">{product.reviews || 0}</td>
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-[#006837] px-2.5 py-1 rounded-md text-xs font-bold border border-green-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#006837]"></span> Active
                                  </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-400 hover:text-[#006837] font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#006837] hover:bg-green-50 transition-all">
                                      Edit
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-12 text-center">
                                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                                    <Package size={32} />
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">Tiada padanan produk</h3>
                                  <p className="text-gray-500 mb-6">Cuba ubah kata kunci carian anda.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
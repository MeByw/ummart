'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/app/providers'; 
import { Plus, Package, DollarSign, BarChart3, Settings, Camera, Save, ShieldCheck, ArrowRight, Award, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function SellerDashboardPage() {
  const { allProducts, sellerProfile, updateSellerProfile } = useCart();
  
  // Search state for the seller's specific products
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter by seller AND search query
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
    <div className="min-h-screen bg-[#Fdfdfc] pb-20 font-sans selection:bg-[#0F6937] selection:text-white relative z-0">
      {/* 🌟 ISLAMIC GEOMETRIC BACKGROUND ART 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-[0.06] bg-repeat"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#0F6937]/5 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>

      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-[1400px] mx-auto px-4 py-8 space-y-8">
        
        {/* --- PREMIUM HEADER & PROFILE SECTION --- */}
        <div className="relative bg-gradient-to-r from-[#0a4b27] to-[#0F6937] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex items-center gap-6 w-full md:w-auto">
                <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border-2 border-[#D4AF37] shadow-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                        {shopImage ? (
                          <img src={shopImage} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-black text-white">{shopName.charAt(0) || 'S'}</span>
                        )}
                    </div>
                    {isEditing && (
                        <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border-2 border-[#D4AF37]">
                            <Camera className="text-white drop-shadow-md" size={28} />
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="flex-1">
                    {isEditing ? (
                        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="text-2xl md:text-3xl font-black text-white border-b-2 border-[#D4AF37] focus:outline-none bg-white/10 px-2 py-1 rounded w-full placeholder-white/50" placeholder="Nama Kedai" />
                    ) : (
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">{shopName || 'Nama Kedai'}</h1>
                    )}
                    <p className="text-[#D4AF37] font-bold mt-2 flex items-center gap-2 text-sm bg-black/20 w-fit px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> Penjual Sah UMMart
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 w-full md:w-auto shrink-0">
                {isEditing ? (
                    <button onClick={handleSaveProfile} className="flex-1 md:flex-none bg-[#D4AF37] text-[#0a4b27] px-6 py-3.5 rounded-xl font-black hover:bg-[#F9E596] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                        <Save size={18} /> Simpan
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                        <Settings size={18} /> Edit Profil
                    </button>
                )}
                <Link href="/seller/add" className="flex-1 md:flex-none bg-[#D4AF37] text-[#0a4b27] px-6 py-3.5 rounded-xl font-black hover:bg-[#F9E596] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                    <Plus size={20} strokeWidth={3} /> Tambah Produk
                </Link>
            </div>
        </div>

        {/* --- STATS GRID (Liquid Glass) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Jumlah Pendapatan', value: `RM${totalSales.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'Produk Aktif', value: sellerProducts.length, icon: Package, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Jumlah Pesanan', value: totalOrders, icon: BarChart3, color: 'text-orange-700', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#D4AF37]/50 transition-all relative overflow-hidden group">
                  <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-50 group-hover:scale-150 transition-transform duration-500 rounded-full"></div>
                  <div className="flex items-center gap-3 text-gray-500 mb-3 relative z-10">
                      <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl shadow-inner border border-white`}><stat.icon size={20} /></div>
                      <span className="font-bold text-xs uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight relative z-10">{stat.value}</p>
              </motion.div>
            ))}
        </div>

        {/* --- HALAL JAKIM BANNER --- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a4b27] to-[#158843] rounded-3xl p-8 text-white shadow-xl border border-[#D4AF37]/30">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10 pointer-events-none">
            <ShieldCheck size={240} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase backdrop-blur-md border border-[#D4AF37]/50 shadow-sm">
                <Award size={14} /> Kelebihan Peniaga UMMart
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">Sistem Pra-Kelayakan Halal JAKIM</h2>
              <p className="text-green-50/90 text-sm md:text-base leading-relaxed font-medium">Tingkatkan jualan dan raih kepercayaan pelanggan dengan status Halal. Muat naik dokumen asas anda dan pasukan UMMart akan membimbing anda melengkapkan permohonan MYeHALAL secara percuma.</p>
            </div>
            <Link href="/seller/halal" className="group inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0a4b27] px-8 py-4 rounded-xl font-black shadow-lg hover:bg-[#F9E596] active:scale-95 transition-all duration-300 shrink-0 w-full md:w-auto">
              <FileText size={20} /> Mula Memohon <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* --- PRODUCTS LIST --- */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-black text-[#0a4b27] flex items-center gap-2">
                  <Package className="text-[#D4AF37]" /> Senarai Produk Anda {searchQuery && <span className="text-gray-500 text-sm ml-2">(Carian: "{searchQuery}")</span>}
                </h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#0a4b27]/5 text-gray-600 text-xs uppercase font-bold tracking-widest">
                        <tr>
                            <th className="p-4 pl-6">Produk</th>
                            <th className="p-4">Harga</th>
                            <th className="p-4">Terjual</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sellerProducts.length > 0 ? sellerProducts.map((product: Product) => (
                            <tr key={product.id} className="hover:bg-[#0a4b27]/5 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                          <span className="font-bold text-gray-900 block mb-0.5 line-clamp-1">{product.name}</span>
                                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">{product.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-[#0F6937] font-black text-lg">RM{product.price.toFixed(2)}</td>
                                <td className="p-4 text-gray-600 font-bold">{product.reviews || 0}</td>
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-[#0F6937] px-3 py-1.5 rounded-full text-xs font-bold border border-green-100 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F6937] animate-pulse"></span> Aktif
                                  </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-500 hover:text-[#0a4b27] font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all shadow-sm">
                                      Edit
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-16 text-center">
                                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0a4b27]/5 mb-4 text-[#0F6937]">
                                    <Package size={36} />
                                  </div>
                                  <h3 className="text-xl font-black text-gray-900 mb-2">Tiada produk dijumpai</h3>
                                  <p className="text-gray-500 mb-6 font-medium">Cuba ubah kata kunci carian anda atau tambah produk baru.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
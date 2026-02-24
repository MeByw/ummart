'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/app/providers';
import { Package, TrendingUp, AlertCircle, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellerOverview() {
  const { allProducts, sellerProfile } = useCart();

  // Dynamically filter products belonging to this seller
  const myProducts = allProducts.filter(p => p.seller === sellerProfile.shopName);
  
  // Calculate mock total sales (or dynamic if you have orders tracking)
  const totalRevenue = myProducts.reduce((acc, curr) => acc + (curr.price * (curr.sold || 0)), 0);
  const itemsSold = myProducts.reduce((acc, curr) => acc + (curr.sold || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* 1. WELCOME BANNER (Glassy & Premium) */}
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-r from-[#0a4b27] to-[#0F6937] rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden border border-[#D4AF37]/30"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 border-2 border-[#D4AF37] backdrop-blur-md flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {sellerProfile.shopName.charAt(0)}
            </div>
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-1">Kembali Bertugas,</p>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{sellerProfile.shopName}</h1>
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-white/10">
                <ShieldCheck size={14} /> Status: {sellerProfile.halalCertStatus === 'approved' ? 'Disahkan Halal' : 'Menunggu Pengesahan'}
              </div>
            </div>
          </div>
          
          <Link href="/seller/add" className="bg-[#D4AF37] text-[#0a4b27] hover:bg-white hover:text-[#0F6937] px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 w-full md:w-auto">
            Tambah Produk <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      {/* 2. DASHBOARD STATS (Liquid Glass Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: 'Jumlah Produk', value: myProducts.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { title: 'Jualan Bulan Ini', value: `RM ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { title: 'Barang Terjual', value: itemsSold, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          { title: 'Pesanan Baru', value: '3', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }}
            key={i} className={`bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-sm border ${stat.border} hover:-translate-y-1 transition-transform relative overflow-hidden group`}
          >
            <div className="absolute right-[-10%] top-[-10%] w-20 h-20 bg-gradient-to-br from-white to-transparent opacity-50 group-hover:scale-150 transition-transform duration-500 rounded-full"></div>
            <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-4 border border-white shadow-inner`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-800 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* 3. QUICK ACTIONS & RECENT ACTIVITY */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions Panel */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-4">Tindakan Pantas</h2>
          <div className="space-y-3">
            <Link href="/seller/my_products" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 hover:border-[#0F6937] border border-transparent transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0F6937]"><Package size={20} /></div>
                <span className="font-bold text-gray-700 group-hover:text-[#0F6937]">Urus Inventori</span>
              </div>
              <ArrowRight size={18} className="text-gray-400 group-hover:text-[#0F6937]" />
            </Link>
            <Link href="/seller/halal" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 hover:border-[#0F6937] border border-transparent transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0F6937]"><ShieldCheck size={20} /></div>
                <span className="font-bold text-gray-700 group-hover:text-[#0F6937]">Semakan Sijil Halal</span>
              </div>
              <ArrowRight size={18} className="text-gray-400 group-hover:text-[#0F6937]" />
            </Link>
          </div>
        </motion.div>

        {/* Mini Product Preview */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-800">Produk Terkini Anda</h2>
            <Link href="/seller/my_products" className="text-sm font-bold text-[#0F6937] hover:underline">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {myProducts.length === 0 ? (
               <div className="text-center py-8 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                 Belum ada produk ditambah.
               </div>
            ) : (
               myProducts.slice(0, 3).map(product => (
                 <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                   <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-bold text-gray-800 text-sm truncate">{product.name}</p>
                     <p className="text-[#0F6937] font-black text-xs">RM {product.price.toFixed(2)}</p>
                   </div>
                 </div>
               ))
            )}
          </div>
        </motion.div>
      </div>
      
    </div>
  );
}
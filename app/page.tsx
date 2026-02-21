'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard'; 
import { useCart } from './providers';
import { 
  Menu, Smartphone, Shirt, Coffee, BookOpen, Home, Gift, 
  ShieldCheck, Heart, Calculator, Utensils, Award, ChevronRight, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // WE INCLUDED sellerProfile HERE!
  const { allProducts, sellerProfile } = useCart(); 
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Sidebar Categories (Matches exactly with Add Product page)
  const categories = [
    { name: 'Semua Kategori', value: 'Semua', icon: <Menu size={18} /> },
    { name: 'Runcit Halal', value: 'Runcit Halal', icon: <Coffee size={18} /> },
    { name: 'Fesyen Muslimah', value: 'Fesyen Muslimah', icon: <Shirt size={18} /> },
    { name: 'Elektronik & Gajet', value: 'Elektronik & Gajet', icon: <Smartphone size={18} /> },
    { name: 'Kesihatan & Kecantikan', value: 'Kesihatan & Kecantikan', icon: <Heart size={18} /> },
    { name: 'Rumah & Kehidupan', value: 'Rumah & Kehidupan', icon: <Home size={18} /> },
    { name: 'Buku & Alat Tulis', value: 'Buku & Alat Tulis', icon: <BookOpen size={18} /> },
    { name: 'Hadiah & Cenderahati', value: 'Hadiah & Cenderahati', icon: <Gift size={18} /> },
  ];

  // Widget Data (Now filtering by the exact Malay terms)
  const widgets = [
    { label: 'Pasti Halal', icon: <ShieldCheck size={28} />, action: () => setActiveCategory('Runcit Halal') }, 
    { label: 'Busana Muslim', icon: <Shirt size={28} />, action: () => setActiveCategory('Fesyen Muslimah') },     
    { label: 'Makanan', icon: <Utensils size={28} />, action: () => setActiveCategory('Runcit Halal') },        
    { label: 'Kira Zakat', icon: <Calculator size={28} />, url: '/kira_zakat' }, 
    { label: 'Kecantikan', icon: <Heart size={28} />, action: () => setActiveCategory('Kesihatan & Kecantikan') },   
    { label: 'Keperluan Rumah', icon: <Home size={28} />, action: () => setActiveCategory('Rumah & Kehidupan') },      
  ];

  // Exact Match Filtering
  const filteredProducts = activeCategory === 'Semua' || !activeCategory
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6">
        
        {/* === LEFT SIDEBAR === */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
              <Menu size={18} /> Kategori
            </div>
            <ul className="py-2">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => setActiveCategory(cat.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      activeCategory === cat.value 
                      ? 'bg-green-50 text-[#0F6937] font-bold border-l-4 border-[#0F6937]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F6937]'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                    <ChevronRight size={14} className="ml-auto opacity-30" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* === RIGHT MAIN FEED === */}
        <main className="flex-1 min-w-0">

          {/* === NEW: STORE PROFILE & TRUST BADGES BANNER === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              {sellerProfile.image ? (
                <img src={sellerProfile.image} alt={sellerProfile.shopName} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="text-gray-400" size={32} />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-black text-gray-900 mb-1">{sellerProfile.shopName}</h1>
              <p className="text-gray-500 text-sm mb-4">{sellerProfile.description || "Selamat datang ke kedai rasmi kami!"}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {sellerProfile.isMuslimOwned && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-[#0F6937] rounded-full text-xs font-bold shadow-sm">
                    <Award size={14} />
                    Pemilikan Muslim (BMF)
                  </div>
                )}
                
                {sellerProfile.halalCertStatus === 'approved' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-[#0F6937] rounded-full text-xs font-bold shadow-sm">
                    <ShieldCheck size={14} />
                    Sijil Halal JAKIM
                  </div>
                )}

                {sellerProfile.halalCertStatus === 'pending' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full text-xs font-bold shadow-sm">
                    <ShieldCheck size={14} />
                    Permohonan Halal (Dalam Proses)
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 1. HERO BANNER */}
          <div className="relative bg-[#0F6937] rounded-xl overflow-hidden shadow-md h-48 md:h-64 mb-8 flex items-center">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
             <div className="relative z-10 px-8 md:px-12 w-full flex justify-between items-center">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 bg-[#D4AF37] text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                    Kempen BME
                  </span>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-sm">
                    Sokong 100 Usahawan<br/>Baru Bumiputera
                  </h1>
                  <p className="text-green-100 text-sm mb-4">Dapatkan produk tulen dan halal terus dari sumber.</p>
                  <button className="bg-white text-[#0F6937] px-6 py-2 rounded-md text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition shadow-lg">
                    Lihat Tawaran
                  </button>
                </div>
             </div>
          </div>

          {/* 2. CUSTOM WIDGET ROW */}
          <div className="mb-10">
            <div className="flex justify-between items-start gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {widgets.map((item, idx) => {
                const WidgetContent = (
                  <>
                    <div className="relative w-16 h-16 rounded-full bg-[#0F6937] border-[3px] border-[#D4AF37] flex items-center justify-center shadow-lg shadow-green-900/10 group-hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute inset-1 rounded-full border border-white/20"></div>
                      <div className="text-[#D4AF37] drop-shadow-md">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 text-center uppercase tracking-wide leading-tight group-hover:text-[#0F6937] transition-colors">
                      {item.label}
                    </span>
                  </>
                );

                if (item.url) {
                  return (
                    <Link key={idx} href={item.url} className="flex flex-col items-center gap-3 group min-w-[80px] cursor-pointer">
                      {WidgetContent}
                    </Link>
                  );
                }

                return (
                  <button key={idx} onClick={item.action} className="flex flex-col items-center gap-3 group min-w-[80px] cursor-pointer outline-none">
                    {WidgetContent}
                  </button>
                );
              })}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-2"></div>
          </div>

          {/* 3. PRODUCT GRID */}
          <div className="mb-4 flex items-center justify-between">
             <h2 className="text-xl font-bold text-gray-800">
               {activeCategory === 'Semua' ? 'Disyorkan Untuk Anda' : `Kategori: ${activeCategory}`}
             </h2>
             <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
               {filteredProducts.length} Items
             </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Tiada produk ditemui</h3>
                <p className="text-gray-500 text-sm">Belum ada produk disenaraikan dalam kategori ini.</p>
                <Link href="/seller/add" className="text-[#0F6937] font-bold text-sm mt-4 inline-block hover:underline">
                  + Tambah Produk Di Sini
                </Link>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
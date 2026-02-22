'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard'; 
import { useCart } from './providers';
import { 
  Menu, Smartphone, Shirt, Coffee, BookOpen, Home, Gift, 
  ShieldCheck, Heart, Calculator, Utensils, Search, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { allProducts } = useCart(); 
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(''); 

  // Categories 
  const categories = [
    { name: 'Semua', value: 'Semua', icon: <Sparkles size={16} /> },
    { name: 'Runcit Halal', value: 'Runcit Halal', icon: <Coffee size={16} /> },
    { name: 'Fesyen', value: 'Fesyen Muslimah', icon: <Shirt size={16} /> },
    { name: 'Elektronik', value: 'Elektronik & Gajet', icon: <Smartphone size={16} /> },
    { name: 'Kesihatan', value: 'Kesihatan & Kecantikan', icon: <Heart size={16} /> },
    { name: 'Rumah', value: 'Rumah & Kehidupan', icon: <Home size={16} /> },
  ];

  // Quick Action Widgets
  const widgets = [
    { label: 'Pasti Halal', icon: <ShieldCheck size={24} />, action: () => setActiveCategory('Runcit Halal') }, 
    { label: 'Busana', icon: <Shirt size={24} />, action: () => setActiveCategory('Fesyen Muslimah') },     
    { label: 'Kira Zakat', icon: <Calculator size={24} />, url: '/kira_zakat' }, 
    { label: 'Keperluan', icon: <Home size={24} />, action: () => setActiveCategory('Rumah & Kehidupan') },      
  ];

  // Filtering Logic
  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-800 selection:bg-[#0F6937] selection:text-white relative z-0">
      
      {/* --- ISLAMIC GEOMETRY BACKGROUND --- */}
      {/* This sits fixed in the background, repeating across the whole screen with a soft 4% opacity */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat"></div>
      
      {/* We also add two soft blurred orbs in the far background to make the white space feel less empty */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-green-200/20 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>

      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* --- ABSTRACT HERO SECTION --- */}
        {!searchQuery && (
          <div className="relative mb-16 rounded-[2.5rem] bg-[#0F6937] overflow-hidden shadow-2xl shadow-green-900/20 isolate border border-green-800/50">
            {/* Abstract Background Elements inside the banner */}
            <div className="absolute top-[-25%] right-[-10%] w-96 h-96 bg-gradient-to-br from-[#D4AF37]/40 to-transparent rounded-full blur-3xl mix-blend-overlay -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-72 h-72 bg-gradient-to-tr from-green-400/30 to-transparent rounded-full blur-2xl mix-blend-overlay -z-10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-15 mix-blend-overlay -z-10"></div>
            
            <div className="relative z-10 p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full mb-6 shadow-sm uppercase tracking-widest">
                  <Sparkles size={14} className="text-[#D4AF37]" /> Kempen BME 2026
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-sm">
                  Sokong <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-200">Usahawan</span><br/>Bumiputera.
                </h1>
                <p className="text-green-50 text-base md:text-lg mb-8 max-w-md font-medium leading-relaxed opacity-90">
                  Ekosistem e-dagang berteraskan syariah. Dapatkan produk tulen dan diyakini halal terus dari sumber.
                </p>
                <button className="bg-white text-[#0F6937] px-8 py-3.5 rounded-full text-sm font-black hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transform hover:-translate-y-1">
                  Teroka Sekarang
                </button>
              </div>

              {/* Floating Quick Action Cards (Glassmorphism) */}
              <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-sm">
                {widgets.map((item, idx) => {
                  const CardContent = (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:-translate-y-2 shadow-lg">
                      <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold tracking-wide">{item.label}</span>
                    </div>
                  );
                  return item.url ? (
                    <Link key={idx} href={item.url}>{CardContent}</Link>
                  ) : (
                    <button key={idx} onClick={item.action} className="outline-none text-left w-full h-full block">{CardContent}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- FLOATING CATEGORY NAVIGATION --- */}
        {!searchQuery && (
          <div className="flex items-center justify-center mb-16 -mt-4 relative z-20">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 p-2 rounded-full shadow-xl shadow-green-900/5 flex overflow-x-auto scrollbar-hide max-w-full">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.value 
                    ? 'bg-[#0F6937] text-white shadow-md transform scale-105' 
                    : 'text-gray-500 hover:text-[#0F6937] hover:bg-green-50/50'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- PRODUCT FEED SECTION --- */}
        <div className="mb-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200/60 pb-4">
             <div>
               <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                 {searchQuery 
                    ? `Hasil Carian: "${searchQuery}"` 
                    : activeCategory === 'Semua' ? 'Disyorkan Untuk Anda' : activeCategory
                 }
               </h2>
               {!searchQuery && (
                 <p className="text-gray-500 mt-2 font-medium">Pilihan terbaik untuk komuniti kita hari ini.</p>
               )}
             </div>
             <span className="text-sm font-bold text-[#0F6937] bg-white border border-green-100 shadow-sm px-5 py-2 rounded-full inline-flex items-center gap-2">
               <Sparkles size={14}/> {filteredProducts.length} Penemuan
             </span>
           </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-300 shadow-sm">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Tiada Padanan</h3>
                <p className="text-gray-500 max-w-sm text-center">Kami tidak menjumpai produk untuk carian anda. Cuba gunakan kata kunci yang lebih umum.</p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 px-8 py-3 bg-[#0F6937] text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    Kosongkan Carian
                  </button>
                )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
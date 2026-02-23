'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useCart } from './providers';
import { 
  Menu, Smartphone, Shirt, Coffee, BookOpen, Home, Gift, 
  ShieldCheck, Heart, Calculator, Utensils, Search, Sparkles,
  Watch, Baby, Dumbbell, Car, Package
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
    { name: 'Fesyen Muslimah', value: 'Fesyen Muslimah', icon: <Shirt size={16} /> },
    { name: 'Pakaian Lelaki', value: 'Pakaian Lelaki', icon: <Shirt size={16} /> },
    { name: 'Keperluan Ibadah', value: 'Keperluan Ibadah', icon: <BookOpen size={16} /> },
    { name: 'Elektronik & Gajet', value: 'Elektronik & Gajet', icon: <Smartphone size={16} /> },
    { name: 'Kesihatan', value: 'Kesihatan & Kecantikan', icon: <Heart size={16} /> },
    { name: 'Rumah', value: 'Rumah & Kehidupan', icon: <Home size={16} /> },
    { name: 'Aksesori', value: 'Aksesori & Barang Kemas', icon: <Watch size={16} /> },
    { name: 'Buku & Alat Tulis', value: 'Buku & Alat Tulis', icon: <BookOpen size={16} /> },
    { name: 'Barangan Bayi', value: 'Barangan Bayi & Kanak-kanak', icon: <Baby size={16} /> },
    { name: 'Sukan & Riadah', value: 'Sukan & Riadah', icon: <Dumbbell size={16} /> },
    { name: 'Automotif', value: 'Automotif & Aksesori', icon: <Car size={16} /> },
    { name: 'Hadiah', value: 'Hadiah & Cenderahati', icon: <Gift size={16} /> },
    { name: 'Lain-lain', value: 'Lain-lain', icon: <Package size={16} /> },
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
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat"></div>
      
      {/* Soft blurred orbs for liquid glass to reflect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-green-200/40 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>

      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        
        {/* --- ABSTRACT HERO SECTION --- */}
        {!searchQuery && (
          <div className="relative mb-10 md:mb-16 rounded-[2rem] md:rounded-[2.5rem] bg-[#0F6937] overflow-hidden shadow-2xl shadow-green-900/20 isolate border border-green-800/50">
            {/* Abstract Background Elements inside the banner */}
            <div className="absolute top-[-25%] right-[-10%] w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-[#D4AF37]/40 to-transparent rounded-full blur-3xl mix-blend-overlay -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-48 h-48 md:w-72 md:h-72 bg-gradient-to-tr from-green-400/30 to-transparent rounded-full blur-2xl mix-blend-overlay -z-10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-15 mix-blend-overlay -z-10"></div>
            
            <div className="relative z-10 p-6 md:p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
              <div className="max-w-xl text-center lg:text-left">
                {/* Ultra-realistic Liquid Glass Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.1)] text-white text-[10px] md:text-xs font-bold rounded-full mb-4 md:mb-6 uppercase tracking-widest">
                  <Sparkles size={14} className="text-[#D4AF37]" /> Kempen BME 2026
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] tracking-tight drop-shadow-sm">
                  Sokong <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-200">Usahawan</span><br/>Muslim Malaysia.
                </h1>
                <p className="text-green-50 text-sm md:text-lg mb-6 md:mb-8 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                  Ekosistem e-dagang berteraskan syariah. Dapatkan produk tulen dan diyakini halal terus dari sumber.
                </p>
                <button className="w-full sm:w-auto bg-gradient-to-b from-white to-gray-50 text-[#0F6937] px-6 py-3 md:px-8 md:py-3.5 rounded-full text-sm font-black hover:from-[#D4AF37] hover:to-yellow-500 hover:text-white transition-all duration-300 shadow-[0_8px_32px_rgba(255,255,255,0.2),inset_0_2px_0_rgba(255,255,255,1)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.4),inset_0_2px_0_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                  Teroka Sekarang
                </button>
              </div>

              {/* --- ADVANCED LIQUID GLASS WIDGETS --- */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4 w-full lg:max-w-sm mt-4 lg:mt-0">
                {widgets.map((item, idx) => {
                  const CardContent = (
                    // The main glass body
                    <div className="relative overflow-hidden bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-[40px] backdrop-saturate-[200%] border border-white/20 p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center gap-2 md:gap-3 text-white transition-all duration-500 cursor-pointer group hover:-translate-y-2 hover:scale-[1.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(255,255,255,0.15)] h-full">
                      
                      {/* Thicker, brighter liquid shine animation */}
                      <div className="absolute top-0 left-[-150%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out z-10"></div>
                      
                      {/* Inner frosted icon container with 3D rotation on hover */}
                      <div className="relative z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] group-hover:bg-white/20">
                        {item.icon}
                      </div>
                      
                      {/* Deep drop shadow on text to make it pop against the shine */}
                      <span className="relative z-20 text-xs md:text-sm font-bold tracking-wide text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                  );

                  return item.url ? (
                    <Link key={idx} href={item.url} className="block w-full h-full">{CardContent}</Link>
                  ) : (
                    <button key={idx} onClick={item.action} className="outline-none text-left w-full h-full block">{CardContent}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- FLOATING CATEGORY NAVIGATION (Advanced Liquid Glass) --- */}
        {!searchQuery && (
          <div className="flex items-center justify-start lg:justify-center mb-10 md:mb-16 -mt-4 relative z-20 overflow-x-auto scrollbar-hide pb-4 lg:pb-0 px-2 lg:px-0">
            {/* Liquid Glass Container with light edge highlight */}
            <div className="bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-[40px] backdrop-saturate-[200%] border border-white/60 p-1.5 md:p-2 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_8px_32px_0_rgba(31,38,135,0.07)] flex items-center gap-1 min-w-max">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeCategory === cat.value 
                    ? 'bg-[#0F6937] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_16px_rgba(15,105,55,0.3)] transform scale-105' 
                    : 'text-gray-600 hover:text-[#0F6937] hover:bg-white/80 hover:shadow-sm'
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
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-3 md:gap-4 border-b border-gray-200/60 pb-4">
             <div>
               <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">
                 {searchQuery 
                    ? `Hasil Carian: "${searchQuery}"` 
                    : activeCategory === 'Semua' ? 'Disyorkan Untuk Anda' : activeCategory
                 }
               </h2>
               {!searchQuery && (
                 <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 font-medium">Pilihan terbaik untuk komuniti kita hari ini.</p>
               )}
             </div>
             <span className="text-xs md:text-sm font-bold text-[#0F6937] bg-white border border-green-100 shadow-sm px-4 py-1.5 md:px-5 md:py-2 rounded-full inline-flex items-center gap-1.5 md:gap-2 self-start md:self-auto">
               <Sparkles size={14}/> {filteredProducts.length} Penemuan
             </span>
           </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="hover:-translate-y-1 md:hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 md:py-32 px-4 bg-white/40 backdrop-blur-xl rounded-3xl md:rounded-[3rem] border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_0_rgba(31,38,135,0.05)] text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm border border-gray-100">
                  <Search size={28} className="text-gray-300" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-800 mb-2">Tiada Padanan</h3>
                <p className="text-xs md:text-sm text-gray-500 max-w-sm">Kami tidak menjumpai produk untuk carian anda. Cuba gunakan kata kunci yang lebih umum.</p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 px-6 md:px-8 py-2.5 md:py-3 bg-[#0F6937] text-white rounded-full text-xs md:text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
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
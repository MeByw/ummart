'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useCart } from './providers';
import { ShieldCheck, Shirt, Calculator, Package, Search, Sparkles, Moon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export default function HomePage() {
  const { allProducts } = useCart();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollY } = useScroll();
  const [hiddenHeader, setHiddenHeader] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) setHiddenHeader(true); 
    else setHiddenHeader(false); 
  });

  const categories = [
    { name: 'Semua', value: 'Semua' },
    { name: 'Runcit Halal', value: 'Runcit Halal' },
    { name: 'Fesyen Muslimah', value: 'Fesyen Muslimah' },
    { name: 'Pakaian Lelaki', value: 'Pakaian Lelaki' },
    { name: 'Keperluan Ibadah', value: 'Keperluan Ibadah' },
    { name: 'Elektronik', value: 'Elektronik & Gajet' },
    { name: 'Kesihatan', value: 'Kesihatan & Kecantikan' },
  ];

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#Fdfdfc] font-sans text-gray-800 relative z-0 pb-24"
    >
      {/* 🌟 ISLAMIC GEOMETRIC BACKGROUND ART 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-[0.06] bg-repeat"></div>
      {/* Soft glowing ambient orbs */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#0F6937]/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>

      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hiddenHeader ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 z-[60] w-full"
      >
        <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />
      </motion.div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* --- PREMIUM ISLAMIC HERO SECTION --- */}
        {!searchQuery && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="relative mb-12 md:mb-16 rounded-[2rem] md:rounded-[2.5rem] bg-[#0a4b27] overflow-hidden shadow-2xl shadow-[#0F6937]/20 border border-[#D4AF37]/30"
          >
            {/* Hero Geometric Overlays */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-[#D4AF37]/30 to-transparent rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
            
            <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black rounded-full mb-6 shadow-sm uppercase tracking-[0.2em]">
                <Moon size={14} className="fill-[#D4AF37]" /> Kempen BMF 2026
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                Sokong <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E596]">Usahawan</span><br className="hidden md:block"/> Muslim Malaysia.
              </h1>
              <p className="text-green-50/90 text-sm md:text-lg lg:text-xl mb-8 max-w-xl font-medium leading-relaxed">
                Ekosistem e-dagang berteraskan syariah. Dapatkan produk tulen, bersih, dan diyakini halal.
              </p>
            </div>
          </motion.div>
        )}

        {/* --- LUXURY LIQUID GLASS WIDGETS --- */}
        {!searchQuery && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
            className="grid grid-cols-4 lg:flex lg:justify-center gap-3 md:gap-8 mb-12 -mt-10 md:-mt-24 relative z-20 px-2 lg:px-0"
          >
            {[
              { icon: ShieldCheck, label: 'Pasti Halal', color: 'text-emerald-700', bg: 'bg-emerald-50/90', action: () => setActiveCategory('Runcit Halal') },
              { icon: Shirt, label: 'Busana', color: 'text-blue-700', bg: 'bg-blue-50/90', action: () => setActiveCategory('Fesyen Muslimah') },
              { icon: Calculator, label: 'Kira Zakat', color: 'text-purple-700', bg: 'bg-purple-50/90', link: '/kira_zakat' },
              { icon: Package, label: 'Keperluan', color: 'text-orange-700', bg: 'bg-orange-50/90', action: () => setActiveCategory('Rumah & Kehidupan') }
            ].map((item, i) => {
              const WidgetContent = (
                <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`w-16 h-16 md:w-28 md:h-28 ${item.bg} rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-gray-200/60 border-2 border-white backdrop-blur-xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50 group-hover:opacity-100 transition duration-300"></div>
                    <item.icon size={28} className={`${item.color} md:w-12 md:h-12 relative z-10`} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] md:text-sm font-bold text-gray-800 text-center">{item.label}</span>
                </motion.div>
              );
              return item.link ? <Link key={i} href={item.link}>{WidgetContent}</Link> : <div key={i} onClick={item.action}>{WidgetContent}</div>;
            })}
          </motion.div>
        )}

        {/* --- HORIZONTAL CATEGORIES --- */}
        {!searchQuery && (
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide md:justify-center mb-10">
            {categories.map((cat) => (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                key={cat.value} 
                onClick={() => setActiveCategory(cat.value)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm border ${
                  activeCategory === cat.value 
                    ? 'bg-[#0F6937] text-white border-[#0F6937] shadow-md shadow-[#0F6937]/20' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border-gray-200 hover:border-[#D4AF37] hover:text-[#0F6937]'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* --- PRODUCT FEED SECTION --- */}
        <div className="mb-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-2 border-gray-100 pb-4">
             <div>
               <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                 {searchQuery ? `Hasil Carian: "${searchQuery}"` : activeCategory === 'Semua' ? 'Disyorkan Untuk Anda' : activeCategory}
               </h2>
             </div>
             <span className="text-sm font-bold text-[#D4AF37] bg-[#0a4b27] shadow-sm px-5 py-2.5 rounded-full inline-flex items-center gap-2">
               <Sparkles size={16} className="fill-[#D4AF37]"/> {filteredProducts.length} Penemuan
             </span>
           </div>

          {/* Product Grid */}
          {allProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full aspect-square bg-gray-200/50 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200/50 rounded w-1/2 mb-4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div 
                    layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                    key={product.id} className="hover:-translate-y-2 transition-transform duration-300"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
             <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-300 shadow-sm">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border border-gray-100">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Tiada Padanan</h3>
                <p className="text-gray-500 max-w-sm text-center">Kami tidak menjumpai produk untuk carian anda. Cuba gunakan kata kunci yang lebih umum.</p>
             </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
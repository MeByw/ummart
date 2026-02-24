'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, ShieldCheck, X, Store, Calculator } from 'lucide-react';
import { useCart } from '@/app/providers';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function Navbar({ searchQuery = '', onSearch }: NavbarProps) {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Automatically hide the search bar on Checkout and Cart pages
  const hideSearch = pathname === '/checkout' || pathname === '/cart';

  return (
    <>
      <header className="relative w-full bg-gradient-to-r from-[#0a4b27] via-[#0F6937] to-[#0a4b27] shadow-xl overflow-hidden border-b-2 border-[#D4AF37]/40">
        {/* Islamic Geometric Watermark */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-green-50 hover:bg-white/10 rounded-xl transition lg:hidden"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-1">
                  UmMart <span className="text-[#D4AF37] text-4xl leading-none">.</span>
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
                  Ekosistem Halal
                </span>
              </Link>
            </div>

            {/* Desktop Search Bar (Hidden on Checkout/Cart) */}
            {!hideSearch && onSearch && (
              <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F6937]" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari produk halal, pakaian, keperluan ibadah..." 
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full bg-white/95 border-2 border-transparent pl-12 pr-4 py-3 rounded-full text-sm focus:outline-none focus:border-[#D4AF37] shadow-inner transition-all text-gray-800 font-medium placeholder-gray-400"
                />
              </div>
            )}

            {/* Icons & Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Admin Button (Desktop) */}
              <Link href="/admin/halal-reviews" className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-50 text-sm font-semibold rounded-full transition backdrop-blur-md">
                <ShieldCheck size={16} /> Admin
              </Link>

              {/* Seller Button (Desktop) */}
              <Link href="/seller" className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-full transition backdrop-blur-md">
                <Store size={16} /> Penjual
              </Link>

              {/* Cart Button */}
              <Link href="/cart" className="relative p-3 text-white hover:bg-white/10 rounded-full transition backdrop-blur-sm border border-transparent hover:border-white/20 ml-2">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-1 right-0 bg-[#D4AF37] text-[#0a4b27] text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0F6937] shadow-md"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (Hidden on Checkout/Cart) */}
          {!hideSearch && onSearch && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F6937]" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari produk halal..." 
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full bg-white/95 pl-11 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-inner text-gray-800"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- MOBILE OFF-CANVAS MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#F8F9FA] z-[80] shadow-2xl flex flex-col border-r border-[#D4AF37]/30"
            >
              {/* Drawer Header */}
              <div className="p-6 bg-[#0a4b27] flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-20 mix-blend-overlay"></div>
                <h2 className="text-xl font-black text-white relative z-10 flex items-center gap-1">
                  UmMart <span className="text-[#D4AF37]">.</span>
                </h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-white relative z-10 bg-white/10 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
                <Link href="/seller" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-white rounded-2xl font-bold text-[#0F6937] shadow-sm border border-gray-100 hover:border-[#0F6937] transition">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><Store size={20}/></div> Pusat Penjual (Seller)
                </Link>
                
                <Link href="/admin/halal-reviews" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-white rounded-2xl font-bold text-red-700 shadow-sm border border-gray-100 hover:border-red-500 transition">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><ShieldCheck size={20}/></div> Portal Admin (Halal)
                </Link>

                <Link href="/kira_zakat" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-white rounded-2xl font-bold text-purple-700 shadow-sm border border-gray-100 hover:border-purple-500 transition">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"><Calculator size={20}/></div> Kalkulator Zakat
                </Link>
              </div>
              
              {/* Drawer Footer */}
              <div className="p-6 text-center text-xs text-gray-400 font-medium">
                Sokong BMF 2026
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
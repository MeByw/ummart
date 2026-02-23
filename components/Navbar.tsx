'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/app/providers';

// 1. ADD THE PROPS INTERFACE
interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

// 2. TELL NAVBAR TO ACCEPT THE PROPS
export default function Navbar({ searchQuery, onSearch }: NavbarProps) {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to safely trigger the search update
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0F6937] rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-green-900/20">
              UM
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tight text-gray-900 hidden sm:block">UMMart</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative group">
            <input 
              type="text" 
              placeholder="Cari produk halal, pakaian, makanan..." 
              value={searchQuery || ''} // 3. CONNECT TO INPUT
              onChange={handleSearchChange} // 4. HANDLE CHANGES
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#0F6937] focus:ring-4 focus:ring-green-50 rounded-2xl py-3 pl-12 pr-4 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F6937] transition-colors" size={20} />
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <Link href="/seller/overview" className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0F6937] transition-colors">
              <User size={18} /> Pusat Penjual
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#0F6937] transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:hidden text-gray-600 hover:text-[#0F6937]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery || ''} // CONNECT MOBILE INPUT TOO
              onChange={handleSearchChange}
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#0F6937] focus:ring-2 focus:ring-green-50 rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-xl absolute w-full">
          <Link href="/seller/overview" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-bold p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-[#0F6937]">
            <User size={20} /> Pusat Penjual (Seller Center)
          </Link>
        </div>
      )}
    </nav>
  );
}
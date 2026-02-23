'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/app/providers';

interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function Navbar({ searchQuery, onSearch }: NavbarProps) {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP ROW: Logo & Actions */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-[#0F6937] to-[#0a4d28] rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-green-900/20 border border-white/20">
              UM
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter text-gray-900 hidden sm:block">UMMart</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative group">
            <input 
              type="text" 
              placeholder="Cari produk halal..." 
              value={searchQuery || ''} 
              onChange={handleSearchChange} 
              className="w-full bg-gray-100/50 border-transparent focus:bg-white focus:border-[#0F6937] focus:ring-4 focus:ring-green-50 rounded-2xl py-2.5 pl-11 pr-4 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F6937]" size={18} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            
            {/* ADMIN BUTTON - Desktop/Tablet */}
            <Link 
              href="/admin/halal-reviews" 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <ShieldAlert size={14} /> ADMIN
            </Link>

            {/* SELLER BUTTON - Desktop/Tablet */}
            <Link 
              href="/seller/overview" 
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-black border border-gray-200 hover:bg-[#0F6937] hover:text-white transition-all shadow-sm"
            >
              <LayoutDashboard size={14} /> SELLER
            </Link>

            {/* CART - Always Visible */}
            <Link href="/cart" className="relative p-2 md:p-2.5 bg-gray-50 rounded-full text-gray-600 hover:text-[#0F6937] hover:bg-green-50 transition-all">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0F6937] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle - Only Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 bg-gray-50 rounded-full text-gray-600"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari produk halal..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="w-full bg-gray-100/50 border-transparent focus:bg-white focus:border-[#0F6937] focus:ring-2 focus:ring-green-50 rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-gray-200 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-3">
            
            {/* ADMIN BUTTON - Mobile Dropdown */}
            <Link 
              href="/admin/halal-reviews" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-black shadow-sm"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={20} />
                <span>Portal Admin (Halal Review)</span>
              </div>
            </Link>

            {/* SELLER BUTTON - Mobile Dropdown */}
            <Link 
              href="/seller/overview" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 font-black shadow-sm"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                <span>Seller Center</span>
              </div>
            </Link>

            <Link 
              href="/kira_zakat" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-4 text-gray-600 font-bold"
            >
              <User size={20} />
              <span>Profil Saya</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
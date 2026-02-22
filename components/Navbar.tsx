'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Store, ShieldCheck } from 'lucide-react';
import { useCart } from '../app/providers';

interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function Navbar({ searchQuery, onSearch }: NavbarProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 bg-[#006837] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-[#006837] tracking-tight hidden sm:block">UMMart</span>
          </Link>

          {/* Search Bar - Conditionally Rendered ONLY if onSearch is provided */}
          {onSearch ? (
            <div className="flex-1 max-w-2xl relative hidden md:block group">
              <input
                type="text"
                placeholder="Cari produk halal, pakaian, keperluan harian..."
                value={searchQuery || ''}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] block pl-12 pr-4 py-3.5 transition-all shadow-inner group-hover:bg-white"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-[#006837] transition-colors" />
              </div>
            </div>
          ) : (
            <div className="flex-1"></div> // Empty spacer if no search bar
          )}

          {/* Navigation Actions */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* NEW: Admin Button */}
            <Link href="/admin/halal-reviews" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
              <ShieldCheck size={20} /> Admin
            </Link>

            <Link href="/seller" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#006837] transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
              <Store size={20} /> Pusat Peniaga
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-500 hover:text-[#006837] hover:bg-green-50 rounded-full transition-all group">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#006837] hover:text-white transition-all shadow-sm">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Conditionally Rendered */}
        {onSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery || ''}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] block pl-10 pr-4 py-3"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
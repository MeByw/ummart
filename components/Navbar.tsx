'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Store } from 'lucide-react';
import { useCart } from '../app/providers';

interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function Navbar({ searchQuery = '', onSearch }: NavbarProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center gap-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-[#0F6937] text-white flex items-center justify-center rounded-lg font-black text-xl">U</div>
          <span className="text-xl font-black text-[#0F6937] hidden md:block tracking-tight">UmMart</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative group">
          <input 
            type="text" 
            placeholder="Cari produk BMF, baju kurung, makanan halal..." 
            value={searchQuery}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-[#0F6937] focus:ring-2 focus:ring-[#0F6937]/20 border rounded-full py-2.5 pl-5 pr-12 text-sm outline-none transition-all shadow-inner group-hover:shadow-md"
          />
          <button className="absolute right-1 top-1 w-9 h-9 bg-[#0F6937] text-white rounded-full flex items-center justify-center hover:bg-[#0a4a27] transition">
            <Search size={16} />
          </button>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/seller" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#0F6937] transition">
            <Store size={18} /> Seller Centre
          </Link>
          
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#0F6937] hover:bg-green-50 rounded-full transition">
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link href="/profile" className="p-2 text-gray-600 hover:text-[#0F6937] hover:bg-green-50 rounded-full transition">
            <User size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
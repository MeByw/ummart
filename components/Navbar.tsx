'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Store, Search } from 'lucide-react';
import { useCart } from '@/app/providers'; 

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-[#0F6937] border-b border-green-800 shadow-lg font-sans">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        {/* --- PREMIUM LOGO --- */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl shadow-xl shadow-black/20 overflow-hidden group-hover:scale-105 transition-transform duration-500 flex-shrink-0 border-2 border-[#D4AF37]/50">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F6937" />
                  <stop offset="100%" stopColor="#062C18" />
                </linearGradient>
                <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F4C430" /> 
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#997C23" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" fill="url(#emeraldGradient)" />
              <g transform="translate(50, 50)">
                <circle cx="0" cy="0" r="38" fill="none" stroke="url(#goldMetal)" strokeWidth="0.5" opacity="0.5" />
                <circle cx="0" cy="0" r="35" fill="none" stroke="url(#goldMetal)" strokeWidth="1.5" />
                <g transform="translate(-20, -18)">
                    <path d="M 5 25 C 5 10, 20 5, 20 5 C 20 5, 35 10, 35 25" fill="none" stroke="url(#goldMetal)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M 20 5 V 0" stroke="url(#goldMetal)" strokeWidth="2" />
                    <path d="M 20 -4 A 3 3 0 1 1 20 0 A 3 3 0 1 0 20 -4" fill="url(#goldMetal)" transform="scale(0.8) translate(5, -2)" />
                    <path d="M 25 35 H 45 V 18 C 45 18, 45 12, 35 12" fill="none" stroke="url(#goldMetal)" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="25" y="25" width="20" height="20" rx="2" fill="url(#goldMetal)" opacity="0.2" />
                    <rect x="25" y="25" width="20" height="20" rx="2" fill="none" stroke="url(#goldMetal)" strokeWidth="2" />
                </g>
              </g>
            </svg>
          </div>
          
          <div className="hidden md:flex flex-col justify-center">
            <span className="text-2xl font-serif font-bold text-white leading-none tracking-wide drop-shadow-md">
              UmMart
            </span>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-4 bg-[#D4AF37]"></div>
                <span className="text-[9px] font-sans font-bold text-[#D4AF37] tracking-[0.2em] uppercase">
                Sejak 2025
                </span>
                <div className="h-[1px] w-4 bg-[#D4AF37]"></div>
            </div>
          </div>
        </Link>

        {/* --- SEARCH BAR --- */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Cari produk halal & toyyiban..." 
              className="w-full bg-white h-11 rounded-md pl-4 pr-12 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-inner"
            />
            <button className="absolute right-1 top-1 h-9 w-10 bg-[#0F6937] rounded-md flex items-center justify-center hover:bg-green-800 transition">
                 <Search className="text-white" size={18} />
            </button>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex items-center gap-6">
          <Link 
            href="/seller/overview" 
            className="hidden md:flex items-center gap-2 font-medium text-green-100 hover:text-white px-2 transition text-sm group"
          >
            <Store size={20} className="group-hover:text-[#D4AF37] transition" />
            <span>Pusat Penjual</span>
          </Link>

          <div className="h-6 w-px bg-white/20 hidden md:block"></div>

          <Link href="/cart" className="relative text-white hover:text-[#D4AF37] transition group">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#0F6937] shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] to-white cursor-pointer hover:scale-105 transition">
            <div className="w-full h-full rounded-full border-2 border-[#0F6937] overflow-hidden bg-white">
                 <img src="https://ui-avatars.com/api/?name=User&background=0F6937&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User, Store, Calculator, Home } from 'lucide-react';
import { useCart } from '../app/providers';

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  
  // State to control mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F6937] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-xl font-black text-[#0F6937] tracking-tight hidden sm:block">
                UmMart<span className="text-yellow-500">.</span>
              </span>
            </Link>
          </div>

          {/* Middle: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for Halal products, sellers..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition-all"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/kira_zakat" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-[#0F6937] transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-green-50">
              <Calculator size={18} />
              <span>Kira Zakat</span>
            </Link>
            <Link href="/seller" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-[#0F6937] transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-green-50">
              <Store size={18} />
              <span>Seller Centre</span>
            </Link>

            <div className="w-px h-6 bg-gray-200 hidden sm:block mx-2"></div>

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#0F6937] hover:bg-green-50 rounded-full transition-all group">
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            
            <button className="hidden sm:block p-2 text-gray-600 hover:text-[#0F6937] hover:bg-green-50 rounded-full transition-all">
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Shows only on small screens below the header) */}
        <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search UmMart..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Slide-out Sidebar */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-green-50">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-[#0F6937] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <span className="text-xl font-black text-[#0F6937] tracking-tight">UmMart.</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                <Home size={20} className="text-[#0F6937]" /> Home
              </Link>
              <Link href="/seller" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                <Store size={20} className="text-[#0F6937]" /> Seller Centre
              </Link>
              <Link href="/kira_zakat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                <Calculator size={20} className="text-[#0F6937]" /> Kira Zakat
              </Link>
              <div className="my-4 border-t border-gray-100"></div>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-left">
                <User size={20} className="text-[#0F6937]" /> My Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
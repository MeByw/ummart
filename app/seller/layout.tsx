'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, Store, CheckCircle, Menu, X } from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/seller/overview' },
    { name: 'Produk Saya', icon: Package, href: '/seller/my_products' },
    { name: 'Pesanan', icon: ShoppingBag, href: '/seller/orders' },
    { name: 'Sijil Halal', icon: CheckCircle, href: '/seller/halal' },
    { name: 'Tetapan Kedai', icon: Settings, href: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar for Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20 sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0F6937] rounded-lg flex items-center justify-center text-white font-black">UM</div>
          <span className="font-bold text-gray-900">Seller Center</span>
        </Link>
        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="text-gray-600">
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR (Hidden on mobile unless toggled open) */}
      <div className={`${isMobileNavOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 flex-col md:min-h-screen transition-all md:sticky md:top-0 h-fit md:h-screen z-10`}>
        
        <Link href="/" className="hidden md:flex items-center gap-3 mb-12 group cursor-pointer">
          <div className="w-10 h-10 bg-[#0F6937] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
            UM
          </div>
          <div>
            <h1 className="font-black text-xl text-gray-900 tracking-tight leading-none">UMMart</h1>
            <p className="text-[10px] font-bold text-[#0F6937] uppercase tracking-wider mt-1">Seller Center</p>
          </div>
        </Link>

        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3 hidden md:block">Menu Utama</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)} // Auto close menu on mobile after clicking
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0F6937] text-white shadow-md shadow-green-900/20' 
                    : 'text-gray-500 hover:bg-green-50 hover:text-[#0F6937]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-8 md:mt-auto hidden md:block">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <Store className="text-[#0F6937]" size={24} />
              <div>
                <h4 className="font-bold text-sm text-gray-900">Kedai Aktif</h4>
                <p className="text-xs text-[#0F6937] font-medium">Khairul Aming...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-gray-50/50 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
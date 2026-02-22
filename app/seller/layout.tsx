'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  PlusCircle,
  Eye
} from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/seller', icon: <LayoutDashboard size={20} /> },
    { name: 'Produk Saya', path: '/seller/my_products', icon: <Package size={20} /> },
    { name: 'Tambah Produk', path: '/seller/add', icon: <PlusCircle size={20} /> },
    { name: 'Pesanan Masuk', path: '/seller/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Tetapan Kedai', path: '/seller/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* === SIDEBAR === */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Seller Centre</h2>
          <p className="text-sm text-gray-500">Urus perniagaan anda</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-[#0F6937]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F6937]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          <div className="my-4 border-t border-gray-100 pt-4"></div>

          {/* --- NEW: VIEW PUBLIC STORE BUTTON --- */}
          <Link 
            href="/seller/store_profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors border border-transparent ${
              pathname === '/seller/store_profile'
                ? 'bg-[#0F6937] text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-[#0F6937] hover:text-[#0F6937] shadow-sm'
            }`}
          >
            <Eye size={20} />
            Lihat Kedai Awam
          </Link>
        </nav>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}
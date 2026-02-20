'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Package, LayoutDashboard, PlusCircle, ShoppingBag, Menu, X, Home } from 'lucide-react';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/seller' },
  { name: 'My Products', icon: Package, path: '/seller/products' },
  { name: 'Add Product', icon: PlusCircle, path: '/seller/add' },
  { name: 'Orders', icon: ShoppingBag, path: '/seller/orders' },
  { name: 'Store Profile', icon: Store, path: '/seller/settings' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Extracted Sidebar Content to avoid repeating code
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0F6937] rounded-lg flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Seller Centre</span>
        </Link>
        {/* Close Button on Mobile Sidebar */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-800 p-1"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-white">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)} // Auto-close on mobile
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-[#0F6937] text-white shadow-md shadow-green-900/10' 
                  : 'text-gray-600 hover:bg-green-50 hover:text-[#0F6937]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-green-100' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
        >
          <Home size={20} className="text-gray-400" />
          Back to UmMart
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* MOBILE HEADER (Only visible on small screens) */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0F6937] rounded-lg flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">Seller Centre</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* --- SIDEBAR DRAWER & DESKTOP MENU --- */}
      {/* Dark Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col 
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-x-hidden w-full">
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
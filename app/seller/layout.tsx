'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Package, PlusCircle, ClipboardList, ShieldCheck, Home, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update the first item in this list:
  const navItems = [
    { name: 'Dashboard', href: '/seller', icon: Store }, // <-- Changed to /seller
    { name: 'Produk Saya', href: '/seller/my_products', icon: Package },
    { name: 'Tambah Produk', href: '/seller/add', icon: PlusCircle },
    { name: 'Pesanan (Orders)', href: '/seller/orders', icon: ClipboardList },
    { name: 'Status Halal', href: '/seller/halal', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#Fdfdfc] flex relative overflow-hidden font-sans">
      {/* 🌟 ISLAMIC GEOMETRIC BACKGROUND ART 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-[0.04] bg-repeat"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#0F6937]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white/70 backdrop-blur-xl border-r border-[#D4AF37]/30 shadow-xl z-20 sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
             <span className="text-2xl font-black text-[#0a4b27] tracking-tight flex items-center gap-1">
                Pusat Penjual <span className="text-[#D4AF37] text-3xl leading-none">.</span>
             </span>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">UMMart Ekosistem</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#0a4b27] to-[#0F6937] text-white shadow-lg shadow-[#0F6937]/20 border border-[#D4AF37]/40 scale-105' 
                    : 'text-gray-600 hover:bg-green-50 hover:text-[#0F6937] border border-transparent'
                }`}>
                  <item.icon size={20} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 transition">
            <LogOut size={20} /> Kembali ke Kedai
          </Link>
        </div>
      </aside>

      {/* --- MOBILE HEADER & MENU --- */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-black text-[#0a4b27]">Seller Center</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-full text-[#0a4b27]">
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm md:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col md:hidden">
              <div className="p-6 bg-[#0a4b27] flex justify-between items-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] opacity-20 mix-blend-overlay"></div>
                 <h2 className="text-xl font-black text-white relative z-10">Menu Penjual</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-white bg-white/20 p-2 rounded-full relative z-10"><X size={20}/></button>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition ${pathname === item.href ? 'bg-[#0F6937] text-white' : 'bg-gray-50 text-gray-700'}`}>
                    <item.icon size={20} /> {item.name}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                 <Link href="/" className="flex items-center gap-3 p-4 rounded-xl font-bold text-red-600 bg-red-50"><Home size={20}/> Utama</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 relative z-10 w-full md:w-auto pt-16 md:pt-0 overflow-y-auto h-screen">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </motion.div>
      </main>
    </div>
  );
}
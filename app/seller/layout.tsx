'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, Store, ClipboardList, UserCircle } from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const menuItems = [
        { name: 'Overview', href: '/seller/overview', icon: LayoutDashboard },
        { name: 'My Products', href: '/seller/products', icon: Package },
        { name: 'Orders', href: '/seller/orders', icon: ClipboardList },
        // Added the new Profile Setting button here
        { name: 'Profile Setting', href: '/seller/settings', icon: UserCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-6">
                
                {/* SIDEBAR */}
                <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit p-4 hidden md:block shrink-0">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#006837]">
                            <Store size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 leading-tight">Seller Centre</h2>
                            <p className="text-xs text-gray-500">Manage Shop</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm
                                    ${active 
                                        ? 'bg-[#006837] text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon size={18} /> {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* PAGE CONTENT */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>

            </div>
        </div>
    );
}
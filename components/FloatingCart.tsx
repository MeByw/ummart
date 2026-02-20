'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/providers'; 

export default function FloatingCart() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || cart.length === 0) return null;

  return (
    <Link 
      href="/cart"
      className="fixed bottom-8 right-6 z-[999] bg-[#006837] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 border-4 border-white ring-2 ring-green-100 flex items-center justify-center group"
    >
      <ShoppingCart size={24} className="group-hover:animate-bounce" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
        {cart.length}
      </span>
    </Link>
  );
}
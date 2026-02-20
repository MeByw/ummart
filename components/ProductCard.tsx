'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, CheckCircle } from 'lucide-react';
import { useCart } from '@/app/providers';

// FIX: We updated this interface to include the missing fields (seller, rating, etc.)
// so it matches the 'Product' type expected by addToCart.
interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image?: string;
  seller: string;      // Added
  rating: number;      // Added
  reviews: number;     // Added
  description: string; // Added
  [key: string]: any;  // Allows for other extra properties
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up if we were to wrap the whole card
    e.stopPropagation(); 
    // We cast to 'any' here as a safeguard if the types still slightly mismatch,
    // but the interface above should fix the main error.
    addToCart(product as any, 1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group relative h-full">
      
      {/* 1. PRODUCT IMAGE (Clickable) */}
      <Link href={`/product/${product.id}`} className="aspect-square bg-gray-100 relative overflow-hidden block">
        <img 
          src={product.image || "https://placehold.co/400"} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
          LARIS
        </span>
      </Link>

      {/* 2. PRODUCT DETAILS */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        
        {/* Title (Clickable) */}
        <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug mb-2 min-h-[2.5em] group-hover:text-[#0F6937] transition-colors">
            {product.name}
            </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-[#0F6937]">RM{product.price}</span>
            <span className="text-xs text-gray-400 line-through">RM{(product.price * 1.2).toFixed(0)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
              <CheckCircle size={10} className="text-[#0F6937]" />
              <span className="text-[9px] font-bold text-[#0F6937] uppercase">JAKIM</span>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#0F6937] hover:text-white transition shadow-sm z-20"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
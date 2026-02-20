'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
// FIX: Import the Product type directly to ensure consistency
import { useCart, Product } from '../../providers'; 
import { useParams } from 'next/navigation';
import { Store, Star, MapPin, ShieldCheck, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
  const params = useParams();
  const { allProducts, addToCart } = useCart();
  
  // Decode the seller name
  const sellerName = decodeURIComponent(params.slug as string);

  // Filter products belonging to this seller
  const shopProducts = allProducts.filter((p) => p.seller === sellerName);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      {/* --- Shop Header --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-6">
            
            {/* Shop Logo */}
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                <img 
                    src={`https://ui-avatars.com/api/?name=${sellerName}&background=006837&color=fff&size=150`} 
                    alt={sellerName}
                    className="w-full h-full object-cover" 
                />
            </div>

            {/* Shop Info */}
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-black text-gray-900 mb-1">{sellerName}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={16}/> Kuala Lumpur, MY</span>
                    <span className="flex items-center gap-1 text-[#006837] bg-green-50 px-2 py-0.5 rounded-full font-bold">
                        <ShieldCheck size={14}/> Verified Seller
                    </span>
                    <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400"/> 4.9 (1.2k Ratings)</span>
                </div>
            </div>

            {/* Shop Stats */}
            <div className="flex gap-8 text-center bg-gray-50 p-4 rounded-xl">
                <div>
                    <p className="text-2xl font-black text-gray-900">{shopProducts.length}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">Products</p>
                </div>
                <div>
                    <p className="text-2xl font-black text-gray-900">98%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">Response</p>
                </div>
            </div>
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Store className="text-[#006837]" /> All Products
        </h2>

        {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shopProducts.map((product: Product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                        <Link href={`/product/${product.id}`} className="block relative h-48 bg-gray-50 p-4">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300" 
                            />
                        </Link>
                        
                        <div className="p-4">
                            <div className="flex items-center gap-1 mb-2">
                                <span className="bg-green-100 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    {product.category}
                                </span>
                            </div>

                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-bold text-gray-900 truncate hover:text-[#006837] transition mb-1">
                                    {product.name}
                                </h3>
                            </Link>
                            
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-black text-gray-900">RM{product.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => addToCart(product, 1)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#006837] hover:text-white transition"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Store size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">This shop hasn't listed any products yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
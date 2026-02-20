'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../../providers'; // Fixed path
import { MapPin, Star, Package, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PublicStorePage() {
    const { allProducts, sellerProfile } = useCart();
    const params = useParams();
    const router = useRouter();
    
    const urlName = decodeURIComponent(params.name as string);
    const isMe = sellerProfile.shopName === urlName || sellerProfile.name === urlName;

    const storeInfo = isMe ? sellerProfile : {
        shopName: urlName,
        location: "Kuala Lumpur, MY",
        description: "A trusted seller on Ummart.",
        image: "",
        rating: 4.8
    };

    const storeProducts = allProducts.filter((p: any) => p.seller === storeInfo.shopName);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* STORE HEADER */}
            <div className="bg-white border-b border-gray-200 pb-8">
                <div className="max-w-7xl mx-auto px-6 pt-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
                        <ArrowLeft size={18} /> Back
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                            <img src={storeInfo.image || "https://placehold.co/150"} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-black text-gray-900">{storeInfo.shopName}</h1>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm font-medium text-gray-600">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} className="text-[#006837]"/> {storeInfo.location || "Location not set"}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1 text-yellow-600">
                                    <Star size={16} fill="currentColor"/> {storeInfo.rating || 4.5} Rating
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                    <Package size={16}/> {storeProducts.length} Products
                                </span>
                            </div>

                            <p className="mt-4 text-gray-500 max-w-2xl">{storeInfo.description || "Welcome to my shop!"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="font-bold text-xl text-gray-900 mb-6">All Products</h2>
                
                {storeProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {storeProducts.map((p: any) => (
                            <Link href={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group block">
                                <div className="aspect-square bg-gray-100 relative">
                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{p.name}</h3>
                                    <p className="text-[#006837] font-black mt-1">RM{p.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p>This store has no products yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
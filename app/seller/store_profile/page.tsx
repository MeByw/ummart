'use client';

import React, { useState } from 'react';
// FIX 1: Two dots to go up two folder levels to reach providers!
import { useCart } from '../../providers'; 
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'next/navigation';
import { 
  MapPin, ShoppingBag, ShieldCheck, Award, 
  Star, BadgeCheck, Share2, MessageCircle, Info, Grid, UserPlus, MoreHorizontal, ArrowLeft
} from 'lucide-react';

export default function StoreProfilePage() {
  const { allProducts, sellerProfile } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'about'>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-[#0F6937] selection:text-white">
      
      {/* --- 1. MINIMALIST HEADER BAR (WITH BACK BUTTON) --- */}
      <div className="h-32 bg-gradient-to-b from-green-100 to-gray-50 relative flex justify-between p-4">
        <button 
          onClick={() => router.back()} 
          className="w-9 h-9 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition shadow-sm">
            <Share2 size={18} />
          </button>
          <button className="w-9 h-9 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition shadow-sm">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* --- 2. TIKTOK-STYLE CENTERED PROFILE --- */}
      <div className="max-w-2xl mx-auto px-4 relative -mt-16 flex flex-col items-center text-center z-10">
        
        {/* Avatar */}
        <div className="w-28 h-28 bg-white rounded-full p-1 shadow-md mb-3">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
            {sellerProfile?.image ? (
              <img src={sellerProfile.image} alt={sellerProfile.shopName} className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="text-gray-300" size={32} />
            )}
          </div>
        </div>

        {/* Shop Name & Verified Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-xl font-black text-gray-900">{sellerProfile?.shopName || "Kedai UmMart"}</h1>
          <BadgeCheck className="text-blue-500" size={20} fill="white" />
        </div>
        
        <p className="text-sm text-gray-500 mb-5 flex items-center justify-center gap-1">
          <MapPin size={14} /> {sellerProfile?.location || "Malaysia"}
        </p>

        {/* Stats Row (Followers / Rating / Products) */}
        <div className="flex items-center justify-center gap-8 w-full mb-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900">12.4K</span>
            <span className="text-xs text-gray-500 font-medium mt-0.5">Pengikut</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900 flex items-center gap-1">
              {sellerProfile?.rating || "5.0"} <Star size={14} className="text-amber-500" fill="currentColor" />
            </span>
            <span className="text-xs text-gray-500 font-medium mt-0.5">Penilaian</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900">{allProducts.length}</span>
            <span className="text-xs text-gray-500 font-medium mt-0.5">Produk</span>
          </div>
        </div>

        {/* Action Buttons (Follow & Message) */}
        <div className="flex items-center justify-center gap-3 w-full max-w-sm mb-6">
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
              isFollowing 
              ? 'bg-gray-200 text-gray-800' 
              : 'bg-[#0F6937] text-white shadow-md'
            }`}
          >
            {isFollowing ? 'Diikuti' : <><UserPlus size={18} /> Ikuti</>}
          </button>
          <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <MessageCircle size={18} /> Mesej
          </button>
        </div>

        {/* Trust Badges (Pills) */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {sellerProfile?.isMuslimOwned && (
            <span className="px-3 py-1 bg-green-50 text-[#0F6937] rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 flex items-center gap-1">
              <Award size={12} /> BMF
            </span>
          )}
          {sellerProfile?.halalCertStatus === 'approved' && (
            <span className="px-3 py-1 bg-green-50 text-[#0F6937] rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 flex items-center gap-1">
              <ShieldCheck size={12} /> Halal JAKIM
            </span>
          )}
        </div>
        
        {/* Shop Bio */}
        <p className="text-sm text-gray-600 px-4 leading-relaxed whitespace-pre-wrap max-w-md">
          {sellerProfile?.description || "Selamat datang ke kedai rasmi kami! Kami menyediakan pelbagai produk berkualiti khas untuk anda."}
        </p>
      </div>

      {/* --- 3. STICKY TABS --- */}
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-md z-40 mt-6 border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === 'products' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Grid size={18} /> Kedai
            {activeTab === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === 'about' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Info size={18} /> Info
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* --- 4. TAB CONTENT (GRID) --- */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-3">
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* FIX 2: Added 'any' so TypeScript stops complaining */}
            {allProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto mt-2">
            <h3 className="font-bold text-gray-900 mb-5">Maklumat Penjual</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-gray-800">Lokasi Penghantaran</p>
                  <p className="text-sm text-gray-500 mt-1">{sellerProfile?.location || "Malaysia"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-gray-800">Status Kedai</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {sellerProfile?.isMuslimOwned ? "Pemilikan Muslim (BMF)" : "Peniaga Tempatan"}
                    {sellerProfile?.halalCertStatus === 'approved' ? " • Mempunyai Sijil Halal JAKIM" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
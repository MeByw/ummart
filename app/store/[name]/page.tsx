'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../providers'; 
import ProductCard from '@/components/ProductCard';
import { 
  MapPin, ShoppingCart, Star, Package, MessageCircle, 
  Calendar, Check, ArrowLeft, ChevronRight, Award, ShieldCheck
} from 'lucide-react';

export default function PublicStorePage() {
  const params = useParams();
  const router = useRouter();
  const { allProducts, sellerProfile } = useCart();
  const [activeTab, setActiveTab] = useState<'products' | 'bumiputera' | 'ratings'>('products');

  const storeName = sellerProfile?.shopName || "Dapur Ummi";
  const location = sellerProfile?.location || "Penang, Malaysia";

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-[#0F6937] selection:text-white pb-20">
      
      {/* --- 1. DARK GREEN HEADER AREA (Responsive Banner) --- */}
      <div className="bg-gradient-to-b from-[#0F6937] to-[#0A4A27] pt-6 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 relative rounded-b-[2rem] lg:rounded-b-[3rem] transition-all">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center text-white mb-6 max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition flex items-center gap-2">
            <ArrowLeft size={24} />
            <span className="hidden lg:block font-medium">Back to Product</span>
          </button>
          {/* Centered title on mobile, hidden on desktop where the big name shows */}
          <h1 className="font-bold text-lg tracking-wide lg:hidden">{storeName}</h1>
          <button className="p-2 -mr-2 hover:bg-white/10 rounded-full transition relative flex items-center gap-2">
            <span className="hidden lg:block font-medium">Cart</span>
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute top-0 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-[#0A4A27]"></span>
            </div>
          </button>
        </div>

        {/* Profile Info (Flex row on all, but bigger on Desktop) */}
        <div className="flex items-center gap-4 lg:gap-8 max-w-7xl mx-auto lg:mt-8">
          {/* Avatar */}
          <div className="w-16 h-16 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white overflow-hidden shadow-xl shrink-0 transition-all">
            {sellerProfile?.image ? (
              <img src={sellerProfile.image} alt={storeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#0F6937] font-black text-2xl lg:text-4xl">
                {storeName.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & Muslim-Owned Status */}
          <div className="flex-1">
            <h2 className="font-bold text-xl lg:text-4xl text-white mb-1 lg:mb-3">{storeName}</h2>
            <div className="flex items-center text-xs lg:text-sm text-green-100 gap-1 lg:gap-2 font-medium bg-white/10 w-max px-2.5 lg:px-4 py-1 rounded-full backdrop-blur-sm">
              <Check size={14} className="lg:w-4 lg:h-4" /> Muslim-Owned Certified
            </div>
          </div>

          {/* Official Store Gold Badge */}
          <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 p-[2px] lg:p-1 rounded-lg lg:rounded-xl shadow-lg shrink-0">
            <div className="bg-[#0A4A27] px-2 py-1.5 lg:px-4 lg:py-3 rounded-md lg:rounded-lg flex flex-col items-center justify-center">
              <Star size={12} className="text-yellow-400 mb-0.5 lg:w-5 lg:h-5 lg:mb-1" fill="currentColor" />
              <span className="text-[9px] lg:text-xs font-black text-yellow-400 uppercase tracking-wider leading-none">Official</span>
              <span className="text-[9px] lg:text-xs font-bold text-white uppercase tracking-wider leading-none mt-0.5">Store</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. OVERLAPPING FLOATING STATS CARD (Expands on Desktop) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-16 relative z-10 transition-all">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
          
          {/* Stats: Rating / Sold / Response */}
          <div className="flex items-center justify-between text-center lg:flex-1 lg:justify-start lg:gap-12">
            <div className="flex flex-col items-center lg:items-start flex-1 lg:flex-none border-r border-gray-100 lg:border-none lg:pr-8 lg:border-r">
              <div className="flex items-center gap-1 font-black text-gray-800 text-lg lg:text-2xl">
                <Star size={16} className="text-amber-400 lg:w-6 lg:h-6" fill="currentColor" /> 4.9
              </div>
              <div className="text-xs lg:text-sm text-gray-400 font-medium mt-0.5">Store Rating</div>
            </div>
            <div className="flex flex-col items-center lg:items-start flex-1 lg:flex-none border-r border-gray-100 lg:border-none lg:pr-8 lg:border-r">
              <div className="flex items-center gap-1 font-black text-gray-800 text-lg lg:text-2xl">
                <Package size={16} className="text-amber-600 lg:w-6 lg:h-6" /> 5,000+
              </div>
              <div className="text-xs lg:text-sm text-gray-400 font-medium mt-0.5">Products Sold</div>
            </div>
            <div className="flex flex-col items-center lg:items-start flex-1 lg:flex-none">
              <div className="flex items-center gap-1 font-black text-gray-800 text-lg lg:text-2xl">
                <MessageCircle size={16} className="text-blue-500 lg:w-6 lg:h-6" /> 99%
              </div>
              <div className="text-xs lg:text-sm text-gray-400 font-medium mt-0.5">Response Rate</div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 lg:hidden"></div>

          {/* Location & Age (Aligns right on desktop) */}
          <div className="flex flex-row lg:flex-col items-center justify-between lg:items-end lg:justify-center gap-2 px-2 lg:px-0 lg:pl-8 lg:border-l border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 font-medium text-sm lg:text-base">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <MapPin size={14} className="lg:w-4 lg:h-4" />
              </div>
              {location}
            </div>
            <div className="flex items-center gap-2 text-gray-600 font-medium text-sm lg:text-base">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Calendar size={14} className="lg:w-4 lg:h-4" />
              </div>
              2 Years on UmMart
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. TRUSTED CERTIFICATIONS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 lg:text-xl">Trusted Certifications</h3>
          <button className="text-xs lg:text-sm font-bold text-[#0F6937] hover:underline flex items-center gap-0.5">
            View All Certificates <ChevronRight size={16} className="lg:w-5 lg:h-5" />
          </button>
        </div>
        
        {/* Certification Badges Grid (4 on mobile, up to 8 on desktop if you add more) */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 lg:gap-4">
          {/* Halal JAKIM */}
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-green-300 transition-colors rounded-lg p-3 shadow-sm">
            <ShieldCheck size={28} className="text-[#0F6937] mb-2 lg:w-8 lg:h-8" />
            <span className="text-[10px] lg:text-xs font-bold text-gray-800 text-center leading-tight">JAKIM<br/>Certified</span>
          </div>
          {/* MeSTI */}
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-red-300 transition-colors rounded-lg p-3 shadow-sm">
            <Award size={28} className="text-red-500 mb-2 lg:w-8 lg:h-8" />
            <span className="text-[10px] lg:text-xs font-bold text-gray-800 text-center leading-tight">MeSTI<br/>Certified</span>
          </div>
          {/* Buatan Malaysia */}
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-blue-300 transition-colors rounded-lg p-3 shadow-sm">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-900 border-2 border-yellow-400 flex items-center justify-center mb-2">
              <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-[10px] lg:text-xs font-bold text-gray-800 text-center leading-tight">Buatan<br/>Malaysia</span>
          </div>
          {/* GMP */}
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-green-300 transition-colors rounded-lg p-3 shadow-sm">
            <ShieldCheck size={28} className="text-green-500 mb-2 lg:w-8 lg:h-8" />
            <span className="text-[10px] lg:text-xs font-bold text-gray-800 text-center leading-tight">GMP<br/>Certified</span>
          </div>
        </div>
      </div>

      {/* --- 4. TABS --- */}
      <div className="sticky top-0 bg-[#F8F9FA]/95 backdrop-blur-md z-40 mt-8 lg:mt-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 lg:gap-10">
          <button 
            onClick={() => setActiveTab('products')}
            className={`py-4 text-sm lg:text-base font-bold transition-all relative ${activeTab === 'products' ? 'text-[#0F6937]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Products
            {activeTab === 'products' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 lg:h-1 bg-[#0F6937] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('bumiputera')}
            className={`py-4 text-sm lg:text-base font-bold transition-all relative ${activeTab === 'bumiputera' ? 'text-[#0F6937]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Bumiputera Certified
            {activeTab === 'bumiputera' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 lg:h-1 bg-[#0F6937] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('ratings')}
            className={`py-4 text-sm lg:text-base font-bold transition-all relative ${activeTab === 'ratings' ? 'text-[#0F6937]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Ratings & Reviews
            {activeTab === 'ratings' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 lg:h-1 bg-[#0F6937] rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {/* --- 5. PRODUCT GRID (Responsive Grid) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {allProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {activeTab !== 'products' && (
          <div className="py-20 lg:py-32 flex flex-col items-center justify-center text-gray-400">
            <Package size={64} className="mb-4 opacity-20 lg:w-20 lg:h-20" />
            <p className="font-medium text-sm lg:text-lg">More information coming soon.</p>
          </div>
        )}
      </div>

    </div>
  );
}
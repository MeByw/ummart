'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../providers';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  ShoppingCart, Star, ShieldCheck, Store, 
  MapPin, ChevronRight, Heart, Award, ArrowLeft, Share2, 
  CheckCircle, Minus, Plus, Truck
} from 'lucide-react';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  
  const { addToCart, sellerProfile } = useCart();
  
  // 1. Safely extract and PARSE variants from the database
  let productVariants: any[] = [];
  try {
    if (typeof product?.variants === 'string') {
      // If Supabase sends it as a raw string, force it into a JSON array
      productVariants = JSON.parse(product.variants);
    } else if (Array.isArray(product?.variants)) {
      // If it's already an array, use it directly
      productVariants = product.variants;
    }
  } catch (error) {
    console.error("Could not parse product variants:", error);
  }

  const [isWishlist, setIsWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const [selectedVariant, setSelectedVariant] = useState<any>(
    productVariants.length > 0 ? productVariants[0] : null
  ); 
  
  const [activeImage, setActiveImage] = useState<string | undefined>(
    productVariants.length > 0 && productVariants[0]?.image 
      ? productVariants[0].image 
      : product?.image
  );

  useEffect(() => {
    if (product) {
      setActiveImage(selectedVariant?.image || product?.image);
    }
  }, [product, selectedVariant]);

  const handleSelectVariant = (variant: any) => {
    setSelectedVariant(variant);
    if (variant?.image) {
      setActiveImage(variant.image);
    } else if (product?.image) {
      setActiveImage(product.image);
    }
  };

  const storeUrl = `/store/${sellerProfile?.shopName ? sellerProfile.shopName.toLowerCase().replace(/\s+/g, '-') : 'ummart'}`;

  // Safe gallery mapping
  const galleryImages = Array.from(new Set([
    product?.image, 
    ...productVariants.map((v: any) => v?.image)
  ])).filter(Boolean);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant?.name);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant?.name);
    router.push('/cart');
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Failsafe: if product is somehow still missing, show a loading/empty state
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-[#0F6937] selection:text-white pb-24 lg:pb-10 relative">
      
      {showNotification && (
        <div className="fixed top-20 lg:top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0F6937] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce w-max max-w-[90vw]">
          <CheckCircle size={20} className="shrink-0" />
          <span className="font-bold text-sm truncate">
            {quantity}x {product?.name} {selectedVariant ? `(${selectedVariant.name})` : ''} ditambah!
          </span>
        </div>
      )}

      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-4 lg:hidden pointer-events-none">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm pointer-events-auto">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm">
            <Share2 size={20} />
          </button>
          <button onClick={() => router.push('/cart')} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm relative">
            <ShoppingCart size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto lg:px-8 lg:py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24 h-fit z-0">
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#0F6937]">Laman Utama</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900">{product?.category}</span>
          </div>

          <div className="relative w-full aspect-square lg:rounded-[2rem] overflow-hidden bg-white border-b lg:border border-gray-100 lg:shadow-sm mb-4">
            <img 
              src={activeImage || undefined} 
              alt={product?.name} 
              className="w-full h-full object-cover lg:hover:scale-105 transition-transform duration-700"
            />
            {product?.category?.includes('Halal') && (
              <div className="absolute bottom-10 lg:bottom-auto lg:top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#0F6937] shadow-md flex items-center gap-1 z-10">
                <ShieldCheck size={16} /> Dijamin Halal
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="hidden lg:flex gap-3 px-2">
              {galleryImages.map((img: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#0F6937] opacity-100 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 px-4 lg:px-0 -mt-6 lg:mt-0 relative z-10">
          <div className="bg-white lg:bg-transparent rounded-t-3xl lg:rounded-none p-5 lg:p-0 shadow-[0_-8px_20px_-15px_rgba(0,0,0,0.1)] lg:shadow-none">
            
            <div className="mb-6">
              <div className="text-3xl lg:text-5xl font-black text-[#0F6937] mb-3 tracking-tight">
                RM {Number(product?.price || 0).toFixed(2)}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                {product?.name}
              </h1>
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center text-amber-500 gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-amber-100">
                  <Star size={16} fill="currentColor" /> {product?.rating || "4.9"}
                </div>
                <div className="text-sm text-gray-500 font-medium px-2 py-1.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-bold">{product?.sold || "0"}</span> Terjual
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            {productVariants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Pilihan Variasi</h3>
                <div className="flex flex-wrap gap-3">
                  {productVariants.map((v: any) => (
                    <button
                      key={v.id || v.name}
                      onClick={() => handleSelectVariant(v)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all flex items-center gap-2 ${
                        selectedVariant?.name === v.name 
                        ? 'border-[#0F6937] bg-green-50 text-[#0F6937]' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {v.image && (
                         <img src={v.image} alt={v.name} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                      )}
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-700 ml-2">Kuantiti</span>
              <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-sm">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-black text-gray-900 w-6 text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <Truck className="text-blue-600" size={20} />
                <span><strong className="text-gray-900">Penghantaran Percuma</strong> untuk pesanan melebihi RM50.</span>
              </div>
            </div>

            <Link href={storeUrl} className="block bg-[#F8F9FA] hover:bg-green-50/50 rounded-2xl p-4 mb-8 border border-gray-200/60 hover:border-[#0F6937]/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {sellerProfile?.image ? (
                      <img src={sellerProfile.image} alt={sellerProfile.shopName} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="text-gray-300" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-base line-clamp-1">
                      {sellerProfile?.shopName || "Kedai UmMart"}
                      {sellerProfile?.isMuslimOwned && <Award size={16} className="text-[#0F6937] shrink-0" />}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                      <MapPin size={12} className="shrink-0" /> <span className="truncate">{sellerProfile?.location || "Semenanjung Malaysia"}</span>
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#0F6937] group-hover:text-white group-hover:border-[#0F6937] transition-colors shadow-sm">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>

            <div className="mb-10">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Penerangan Produk</h3>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {product?.description || "Tiada penerangan disediakan."}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-4 mt-8 sticky bottom-4 z-20 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-gray-100">
              <button onClick={() => setIsWishlist(!isWishlist)} className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 ${isWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}>
                <Heart size={24} fill={isWishlist ? "currentColor" : "none"} />
              </button>
              <button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-[#0F6937] text-[#0F6937] py-4 rounded-2xl font-black text-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={22} /> Tambah ke Troli
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-[#0F6937] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 hover:bg-[#0A4A27] transition-all">
                Beli Terus
              </button>
            </div>

          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 pb-safe z-50 lg:hidden shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => setIsWishlist(!isWishlist)} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shrink-0 ${isWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <Heart size={22} fill={isWishlist ? "currentColor" : "none"} />
          </button>
          <button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-[#0F6937] text-[#0F6937] py-3 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5">
            <ShoppingCart size={16} /> Tambah
          </button>
          <button onClick={handleBuyNow} className="flex-1 bg-[#0F6937] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 active:scale-95 transition-all">
            Beli Terus
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../providers'; 
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, ChevronLeft, Minus, Plus, ShoppingBag, ShieldCheck, CheckCircle, X, Store, MapPin } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  
  // GET GLOBAL STATE
  const { addToCart, allProducts, sellerProfile } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState('');
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // 1. FIND PRODUCT
  useEffect(() => {
    if (params?.id && allProducts.length > 0) {
        const found = allProducts.find((p: any) => p.id === Number(params.id));

        if (found) {
            setProduct(found);
            setActiveImg(found.image);
            if (found.colors?.[0]) setSelectedColor(found.colors[0]);
            if (found.sizes?.[0]) setSelectedSize(found.sizes[0]);
        }
        setLoading(false);
    }
  }, [params, allProducts]);

  // 2. HANDLE COLOR CHANGE (Update Image)
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
        const newImg = product.colorImages[selectedColor];
        if (newImg) setActiveImg(newImg);
    }
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const queryParams = new URLSearchParams({
        mode: 'buy_now',
        id: product.id.toString(),
        qty: quantity.toString(),
        color: selectedColor,
        size: selectedSize
    });
    router.push(`/checkout?${queryParams.toString()}`); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#006837] animate-pulse">Loading Product...</div>;
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Product not found 😔</h1>
        <Link href="/" className="bg-[#006837] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00552b] transition">Return Home</Link>
    </div>
  );

  const thumbnails = product.colorImages ? Object.values(product.colorImages) : [product.image];

  // --- 3. DYNAMIC SELLER PROFILE LOGIC ---
  const productSellerName = product.seller || "Ummart Official";
  const isMyProduct = productSellerName === (sellerProfile.shopName || sellerProfile.name);

  const sellerImage = isMyProduct && sellerProfile.image 
                      ? sellerProfile.image 
                      : (product.sellerImage || `https://ui-avatars.com/api/?name=${productSellerName}&background=006837&color=fff`);

  // determine location (if it's me, use my profile location, else generic for demo)
  const sellerLocation = isMyProduct ? (sellerProfile.location || "Location not set") : "Kuala Lumpur, MY";

  return (
    <div className="min-h-screen pb-20 bg-[#f9f9f9] relative font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-gray-900/90 backdrop-blur text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-gray-700">
                <div className="bg-[#006837] rounded-full p-1"><CheckCircle size={20} className="text-white" /></div>
                <div><h4 className="font-bold text-sm">Added to Cart!</h4><p className="text-xs text-gray-300">{quantity} item(s) added.</p></div>
                <button onClick={() => setShowToast(false)} className="ml-auto text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-gray-600 hover:text-[#006837] transition bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <ChevronLeft size={18}/> Back
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition group">
                <ShoppingBag size={24} className="text-gray-700 group-hover:text-[#006837]"/>
            </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            
            {/* LEFT: IMAGE GALLERY */}
            <div className="flex flex-col gap-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                    <img src={activeImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                {thumbnails.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {thumbnails.map((img: any, i: number) => (
                            <button key={i} onClick={() => setActiveImg(img)} className={`w-16 h-16 relative rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImg === img ? 'border-[#006837] ring-2 ring-green-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: PRODUCT DETAILS */}
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-[#006837] bg-green-50 border border-green-100 px-2 py-1 rounded-md uppercase tracking-wider">{product.category || 'General'}</span>
                        {product.rating && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-1 rounded-md">
                                <Star size={10} fill="currentColor" /> {product.rating}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Price</span>
                        <div className="text-4xl font-black text-[#006837]">RM{product.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                        <div className="font-bold text-gray-900">{product.reviews ? `${product.reviews} Sold` : 'In Stock'}</div>
                    </div>
                </div>

                {/* Options: Color & Size */}
                <div className="space-y-6 mb-8">
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Color</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((c: string) => (
                                    <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${selectedColor === c ? 'border-[#006837] bg-[#006837] text-white shadow-lg shadow-green-900/20' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{c}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Size</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s: string) => (
                                    <button key={s} onClick={() => setSelectedSize(s)} className={`w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold border-2 transition-all ${selectedSize === s ? 'border-[#006837] bg-[#006837] text-white shadow-lg shadow-green-900/20' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- SELLER PROFILE (NOW WITH LOCATION) --- */}
                <div className="mt-auto mb-8 bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition">
                    <div className="w-14 h-14 rounded-full bg-gray-200 p-0.5 border-2 border-[#006837]">
                         <img 
                            src={sellerImage} 
                            alt={productSellerName}
                            className="w-full h-full object-cover rounded-full"
                          />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{productSellerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                                <ShieldCheck size={10} fill="currentColor"/> Verified
                            </p>
                            {/* DISPLAY LOCATION HERE */}
                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5">
                                <MapPin size={10}/> {sellerLocation}
                            </p>
                        </div>
                    </div>
                    <Link href={`/store/${encodeURIComponent(productSellerName)}`} className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition flex items-center gap-1">
                        <Store size={14}/> Visit Shop
                    </Link>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-200">
                         <span className="text-xs font-bold text-gray-500 pl-2">QUANTITY</span>
                         <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-lg border shadow-sm">
                            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-1 hover:bg-gray-100 rounded"><Minus size={16} className="text-gray-600"/></button>
                            <span className="font-black w-6 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(q => q+1)} className="p-1 hover:bg-gray-100 rounded"><Plus size={16} className="text-gray-600"/></button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleAddToCart} className="flex-1 bg-white text-[#006837] border-2 border-[#006837] h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition active:scale-[0.98]">
                            <ShoppingBag size={20}/> Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="flex-1 bg-[#006837] text-white h-14 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-[#00552b] transition active:scale-[0.98] flex items-center justify-center gap-2">
                            Buy Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}
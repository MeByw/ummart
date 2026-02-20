'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../providers'; 
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CheckSquare, Square, ArrowLeft, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // --- SAFE ID & VALUE HELPERS ---
  // Fix: Prefer 'cartId' (unique) over 'id' (product ID) to avoid conflicts
  const getCartId = (item: any) => item.cartId || item.id;
  const getQty = (item: any) => item.quantity || item.qty || 1;
  const getPrice = (item: any) => Number(item.price) || 0;

  // --- SELECTION STATE (By ID now, not index) ---
  const [selectedIds, setSelectedIds] = useState<any[]>([]);

  // Default: Select all items when cart loads
  useEffect(() => {
    if (cart.length > 0 && selectedIds.length === 0) {
        setSelectedIds(cart.map((item) => getCartId(item)));
    }
  }, [cart.length]);

  const toggleItem = (id: any) => {
    selectedIds.includes(id) 
        ? setSelectedIds(selectedIds.filter(i => i !== id))
        : setSelectedIds([...selectedIds, id]);
  };

  const toggleAll = () => {
    selectedIds.length === cart.length 
        ? setSelectedIds([]) 
        : setSelectedIds(cart.map((item) => getCartId(item)));
  };

  // --- TOTAL CALCULATION ---
  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
        const id = getCartId(item);
        return selectedIds.includes(id) ? acc + (getPrice(item) * getQty(item)) : acc;
    }, 0);
  }, [cart, selectedIds]);

  const selectedCount = selectedIds.length;

  // --- ACTIONS ---
  const handleCheckout = () => {
      if (selectedCount === 0) return;
      // Pass IDs instead of indices
      const idsString = selectedIds.join(',');
      router.push(`/checkout?mode=cart&selected=${idsString}`);
  };

  // FIX: Robust Delete Handler
  const handleDelete = (item: any) => {
      if (window.confirm("Remove this item?")) {
          const id = getCartId(item);
          removeFromCart(id);
          // Cleanup selection if deleted
          setSelectedIds(prev => prev.filter(i => i !== id));
      }
  };

  // FIX: Robust Quantity Handler
  const handleQuantityChange = (item: any, change: number) => {
      const id = getCartId(item);
      const currentQty = getQty(item);
      const newQty = Math.max(1, currentQty + change);
      updateQuantity(id, newQty);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-center px-4 relative">
        <Link href="/" className="absolute top-6 right-6 p-2 bg-white rounded-full text-gray-400 hover:text-gray-800 shadow-sm border border-gray-100 transition"><X size={24} /></Link>
        <div className="bg-white p-6 rounded-full shadow-sm mb-6"><ShoppingBag size={48} className="text-gray-300" /></div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <Link href="/" className="bg-[#006837] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#00552b] transition active:scale-95 flex items-center gap-2 justify-center mt-4">
          <ArrowLeft size={20} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#006837] transition font-bold text-sm group">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 group-hover:border-[#006837] shadow-sm"><ArrowLeft size={16}/></div>
                Continue Shopping
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Link href="/" className="hover:text-[#006837]">Home</Link><ChevronRight size={12}/>
                <span className="text-[#006837] font-bold">My Cart</span>
            </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            My Cart <span className="text-sm font-bold text-[#006837] bg-green-100 px-3 py-1 rounded-full border border-green-200">{cart.length} items</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 cursor-pointer" onClick={toggleAll}>
                    <button className="text-[#006837]">
                         {selectedIds.length === cart.length ? <CheckSquare size={24} fill="#e6f4ea" /> : <Square size={24} className="text-gray-300"/>}
                    </button>
                    <span className="font-bold text-gray-700 text-sm">Select All Items</span>
                </div>

                {cart.map((item: any) => {
                    const id = getCartId(item);
                    const isSelected = selectedIds.includes(id);
                    const qty = getQty(item);
                    
                    return (
                        <div key={id} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all duration-300 relative ${isSelected ? 'border-[#006837] ring-1 ring-green-50 z-10' : 'border-gray-100 opacity-90'}`}>
                            <div className="flex gap-4 items-center">
                                <button onClick={() => toggleItem(id)} className="text-[#006837] flex-shrink-0">
                                    {isSelected ? <CheckSquare size={24} fill="#e6f4ea" /> : <Square size={24} className="text-gray-300"/>}
                                </button>
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 relative">
                                    <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 truncate pr-2 text-sm sm:text-base">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{item.selectedColor} {item.selectedSize && `• ${item.selectedSize}`}</p>
                                        </div>
                                        {/* FIX: Pass whole item to delete handler */}
                                        <button onClick={() => handleDelete(item)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="font-bold text-[#006837]">RM{getPrice(item).toFixed(2)}</div>
                                        
                                        {/* FIX: Use local handler for quantity */}
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => handleQuantityChange(item, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#006837] disabled:opacity-50" disabled={qty <= 1}><Minus size={14} /></button>
                                            <span className="text-xs font-bold w-4 text-center select-none">{qty}</span>
                                            <button onClick={() => handleQuantityChange(item, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#006837]"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SUMMARY */}
            <div className="lg:sticky lg:top-10 h-fit">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-xl mb-6 text-gray-800">Summary</h3>
                    <div className="flex justify-between text-gray-500 text-sm mb-2"><span>Selected Items</span><span className="font-medium text-gray-900">{selectedCount} items</span></div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed border-gray-300 mb-6">
                        <span className="font-bold text-lg text-gray-700">Total</span>
                        <span className="font-black text-2xl text-[#006837]">RM{total.toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} disabled={selectedCount === 0} className="w-full bg-[#006837] text-white h-14 rounded-xl font-bold shadow-lg hover:bg-[#00552b] transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Checkout <ArrowRight size={18}/>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
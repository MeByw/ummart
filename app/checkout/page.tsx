'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useCart } from '../providers'; 
import Link from 'next/link';
import { ArrowLeft, CreditCard, MapPin, ShieldCheck, CheckCircle, Heart, Loader2, Wallet, Home, Briefcase, Plus, X, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#006837] font-bold gap-2"><Loader2 className="animate-spin"/> Loading Checkout...</div>}>
        <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { cart, clearCart, allProducts } = useCart();
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => { setHasMounted(true); }, []);

  const mode = searchParams.get('mode'); 
  const isBuyNow = mode === 'buy_now';

  // --- ADDRESS BOOK STATE ---
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, label: 'Home', name: 'Ali Bin Abu', phone: '+60 12 345 6789', address: 'No 12, Jalan Damai, 50000 Kuala Lumpur' },
    { id: 2, label: 'Office', name: 'Ali (Work)', phone: '+60 12 345 6789', address: 'Level 23, Menara 1, 59200 Kuala Lumpur' }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [newAddress, setNewAddress] = useState({ label: 'Home', name: '', phone: '', address: '' });

  const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  const handleSaveNewAddress = () => {
      if (!newAddress.name || !newAddress.phone || !newAddress.address) {
          alert("Please fill in all address fields.");
          return;
      }
      const newId = savedAddresses.length + 1;
      setSavedAddresses([...savedAddresses, { ...newAddress, id: newId }]);
      setSelectedAddressId(newId); 
      setIsAddingNew(false); 
      setShowAddressModal(false);
      setNewAddress({ label: 'Home', name: '', phone: '', address: '' });
  };

  // --- HELPERS ---
  const getCartId = (item: any) => item.cartId || item.id;
  const getQty = (item: any) => item?.quantity || item?.qty || 1;
  const getPrice = (item: any) => Number(item?.price) || 0;

  // --- CHECKOUT ITEM LOGIC (Fixed Selection) ---
  const checkoutItems = useMemo(() => {
    if (!hasMounted) return [];

    if (isBuyNow) {
        const id = Number(searchParams.get('id'));
        const found = allProducts.find(p => p.id === id);
        if (found) {
             return [{
                ...found,
                quantity: Number(searchParams.get('qty')) || 1,
                selectedColor: searchParams.get('color'),
                selectedSize: searchParams.get('size'),
                image: (found as any).colorImages && searchParams.get('color') 
                    ? (found as any).colorImages[searchParams.get('color') as string] 
                    : found.image
             }];
        }
        return [];
    }

    // Fix: Filter by matching IDs (converted to string to be safe)
    const selectedParam = searchParams.get('selected'); 
    if (selectedParam) {
        const selectedIds = selectedParam.split(',');
        return cart.filter((item: any) => selectedIds.includes(String(getCartId(item))));
    }

    return cart;
  }, [isBuyNow, searchParams, cart, allProducts, hasMounted]);

  // --- CALCULATIONS ---
  const calculatedSubtotal = checkoutItems.reduce((acc, item) => acc + (getPrice(item) * getQty(item)), 0);
  const [infaqAmount, setInfaqAmount] = useState(0);
  const [customInfaq, setCustomInfaq] = useState('');
  const finalTotal = calculatedSubtotal + infaqAmount;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('duitnow');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        if (!isBuyNow) clearCart(); 
        window.scrollTo(0, 0); 
    }, 2000);
  };

  if (success) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4 text-center">
            <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce-in"><CheckCircle size={64} className="text-[#006837]" /></div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8 max-w-md">Thank you. Your order will be shipped to:<br/><span className="font-bold text-gray-800">{activeAddress.address}</span></p>
            <Link href="/" className="bg-[#006837] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#00552b] transition active:scale-95">Back to Home</Link>
        </div>
    );
  }

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN */}
        <div>
            <Link href={isBuyNow ? "/" : "/cart"} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"><ArrowLeft size={20} /> Back</Link>
            <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">Checkout {isBuyNow && <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded border border-orange-200 uppercase tracking-wide">Buy Now</span>}</h1>

            <form onSubmit={handlePlaceOrder} className="space-y-8">
                
                {/* 1. SHIPPING ADDRESS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2"><MapPin size={20} className="text-[#006837]" /> Shipping Address</h2>
                        {!isAddingNew && (
                            <button type="button" onClick={() => setShowAddressModal(!showAddressModal)} className="text-xs font-bold text-[#006837] hover:bg-green-50 px-3 py-1.5 rounded-full border border-green-200 transition">{showAddressModal ? 'Close' : 'Change Address'}</button>
                        )}
                    </div>

                    {isAddingNew ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-green-200 animate-in fade-in zoom-in-95">
                             <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">Add New Address</h3><button type="button" onClick={() => setIsAddingNew(false)}><X size={18} className="text-gray-400 hover:text-red-500"/></button></div>
                             <div className="space-y-3">
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase">Label</label>
                                     <div className="flex gap-2 mt-1">
                                         {['Home', 'Office', 'Other'].map(l => (
                                             <button key={l} type="button" onClick={() => setNewAddress({...newAddress, label: l})} className={`px-3 py-1 rounded-full text-xs font-bold border ${newAddress.label === l ? 'bg-[#006837] text-white border-[#006837]' : 'bg-white text-gray-600 border-gray-200'}`}>{l}</button>
                                         ))}
                                     </div>
                                 </div>
                                 <div><label className="text-xs font-bold text-gray-500 uppercase">Receiver Name</label><input type="text" className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006837] text-sm" placeholder="e.g. Ali Bin Abu" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})}/></div>
                                 <div><label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label><input type="tel" className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006837] text-sm" placeholder="e.g. +60 12 345 6789" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})}/></div>
                                 <div><label className="text-xs font-bold text-gray-500 uppercase">Full Address</label><textarea rows={3} className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006837] text-sm resize-none" placeholder="Unit No, Street, City, Postcode..." value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})}/></div>
                                 <button type="button" onClick={handleSaveNewAddress} className="w-full bg-[#006837] text-white py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#00552b] transition flex items-center justify-center gap-2"><Save size={16}/> Save & Use Address</button>
                             </div>
                        </div>
                    ) : showAddressModal ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} onClick={() => { setSelectedAddressId(addr.id); setShowAddressModal(false); }} className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${selectedAddressId === addr.id ? 'border-[#006837] bg-green-50/50 ring-1 ring-[#006837]' : 'border-gray-200 hover:border-green-300'}`}>
                                    <div className="flex gap-3">
                                        <div className={`mt-1 ${selectedAddressId === addr.id ? 'text-[#006837]' : 'text-gray-400'}`}>{addr.label === 'Home' ? <Home size={18} /> : <Briefcase size={18} />}</div>
                                        <div><p className="font-bold text-sm text-gray-800">{addr.name} <span className="text-xs font-normal text-gray-500">({addr.label})</span></p><p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p><p className="text-xs text-gray-600 mt-1 line-clamp-1">{addr.address}</p></div>
                                    </div>
                                    {selectedAddressId === addr.id && <CheckCircle size={18} className="text-[#006837]" />}
                                </div>
                            ))}
                            <button type="button" onClick={() => setIsAddingNew(true)} className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:text-[#006837] hover:border-[#006837] hover:bg-green-50 transition flex items-center justify-center gap-2"><Plus size={16}/> Add New Address</button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4 items-start">
                            <div className="mt-1 text-gray-400">{activeAddress.label === 'Home' ? <Home size={20}/> : <Briefcase size={20}/>}</div>
                            <div><p className="font-bold text-gray-900 text-sm">{activeAddress.name}</p><p className="text-xs text-gray-500 mb-1">{activeAddress.phone}</p><p className="text-sm text-gray-700 leading-snug">{activeAddress.address}</p></div>
                        </div>
                    )}
                </div>

                {/* 2. PAYMENT METHOD */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><CreditCard size={20} className="text-[#006837]" /> Payment Method</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['duitnow', 'fpx', 'ewallet', 'card'].map((m) => (
                             <div key={m} onClick={() => setPaymentMethod(m)} className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition h-24 ${paymentMethod === m ? 'border-[#006837] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className={`w-10 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold shadow-sm ${m === 'duitnow' ? 'bg-pink-600' : m === 'fpx' ? 'bg-orange-500' : m === 'ewallet' ? 'bg-blue-500' : 'bg-indigo-600'}`}>{m === 'ewallet' ? <Wallet size={12}/> : m === 'card' ? 'VISA' : m === 'duitnow' ? 'DuitNow' : 'FPX'}</div>
                                <span className="text-[10px] font-bold text-gray-700 capitalize">{m === 'duitnow' ? 'QR Pay' : m === 'fpx' ? 'Banking' : m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. INFAQ */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-[#006837]"><Heart size={20} fill="currentColor" /> Infaq & Sadaqah</h2>
                    <div className="flex flex-wrap gap-2 mb-3">{[2, 5, 10, 50].map((amount) => (<button key={amount} type="button" onClick={() => {setInfaqAmount(amount); setCustomInfaq('');}} className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${infaqAmount === amount && customInfaq === '' ? 'border-[#006837] bg-green-600 text-white' : 'border-gray-200 hover:border-green-500'}`}>RM{amount}</button>))}</div>
                    <input type="number" placeholder="Other amount (RM)" value={customInfaq} onChange={(e) => {setCustomInfaq(e.target.value); setInfaqAmount(Number(e.target.value) || 0);}} className="w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:border-[#006837] text-sm"/>
                </div>

                <button disabled={loading} className="w-full bg-[#006837] text-white h-16 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-[#00552b] transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">{loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin"/> Processing...</div> : `Pay RM${finalTotal.toFixed(2)}`}</button>
            </form>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:sticky lg:top-10 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-xl mb-6 border-b pb-4 text-gray-800">Order Summary</h3>
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {checkoutItems.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <img src={item.image || "https://placehold.co/100"} className="w-16 h-16 rounded-lg bg-gray-100 object-cover border"/>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-1">x{getQty(item)} {item.selectedSize && `• ${item.selectedSize}`}</p>
                            </div>
                            <p className="font-bold text-sm text-gray-900">RM{(getPrice(item) * getQty(item)).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>RM{calculatedSubtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span className="text-green-600 font-bold">Free</span></div>
                    {infaqAmount > 0 && <div className="flex justify-between text-sm text-[#006837] font-bold"><span>Infaq</span><span>RM{infaqAmount.toFixed(2)}</span></div>}
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed border-gray-300">
                        <span className="font-bold text-lg text-gray-700">Total</span>
                        <span className="font-black text-2xl text-[#006837]">RM{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-6 bg-green-50 p-4 rounded-xl flex gap-3 items-start border border-green-100">
                    <ShieldCheck className="text-[#006837] flex-shrink-0" size={20} />
                    <p className="text-xs text-[#006837] font-medium leading-relaxed">Secure 256-bit SSL encrypted payment.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
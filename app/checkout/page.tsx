'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../providers';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Truck, CreditCard, ShieldCheck, 
  CheckCircle, ChevronRight, Wallet, Receipt
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, removeFromCart } = useCart();
  
  // --- DIRECT BUY & SELECTION LOGIC ---
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  
  const isDirectBuy = searchParams.get('direct') === 'true';
  const selectedParam = searchParams.get('selected'); // <--- Brings back the cart checkbox logic

  useEffect(() => {
    if (isDirectBuy) {
      // 1. If it's a direct buy, pull the specific item from temporary memory!
      const savedItem = sessionStorage.getItem('directBuyItem');
      if (savedItem) {
        setCheckoutItems([JSON.parse(savedItem)]);
      }
    } else {
      // 2. Normal Cart Checkout
      let itemsToCheckout = cart;

      // 3. SMART FILTER: If they checked specific boxes in the cart, only keep those!
      if (selectedParam) {
        const selectedIds = selectedParam.split(',');
        itemsToCheckout = cart.filter(item => {
           // Safe matching for unique cart IDs
           const itemId = String(item.cartId || item.id);
           return selectedIds.includes(itemId);
        });
      }

      // Format them slightly so they match the direct buy structure
      const formattedCart = itemsToCheckout.map(item => ({
        product: item,
        quantity: item.qty || 1,
        variantName: [item.selectedColor, item.selectedSize].filter(Boolean).join(' | ')
      }));
      setCheckoutItems(formattedCart);
    }
  }, [cart, isDirectBuy, selectedParam]);

  // --- STATE ---
  const [paymentMethod, setPaymentMethod] = useState('fpx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate Totals based on our new checkoutItems array
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.00; // Free shipping over RM50!
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Fake processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Cleanup Logic After Purchase
      if (!isDirectBuy) {
        if (selectedParam) {
          // Only remove the specific items they bought from the cart
          const selectedIds = selectedParam.split(',');
          selectedIds.forEach(id => removeFromCart(id));
        } else {
          // If they bought everything, clear the whole cart
          clearCart(); 
        }
      }
      sessionStorage.removeItem('directBuyItem'); // Clean up Beli Terus memory
    }, 2000);
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-[#0F6937] selection:text-white">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-100 text-[#0F6937] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Alhamdulillah!</h1>
          <p className="text-gray-500 mb-8 text-lg">Pesanan anda telah berjaya diterima dan sedang diproses.</p>
          
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500">No. Pesanan</span>
              <span className="font-bold text-gray-900">#UM{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500">Jumlah Dibayar</span>
              <span className="font-bold text-[#0F6937]">RM{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Kaedah Pembayaran</span>
              <span className="font-bold text-gray-900 uppercase">{paymentMethod}</span>
            </div>
          </div>

          <Link href="/" className="block w-full bg-[#0F6937] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#0A4A27] transition-all">
            Kembali ke Laman Utama
          </Link>
        </div>
      </div>
    );
  }

  // --- SAFETY CHECK ---
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <Receipt size={64} className="text-gray-300 mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Tiada Item Untuk Dibayar</h2>
          <p className="text-gray-500 mb-8 max-w-md">Sila tambah produk ke troli atau gunakan butang Beli Terus.</p>
          <button onClick={() => router.back()} className="px-8 py-3 bg-[#0F6937] text-white rounded-full font-bold shadow-md hover:bg-[#0A4A27] transition-all">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans selection:bg-[#0F6937] selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm border border-gray-200 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Pembayaran</h1>
            <p className="text-sm text-gray-500 font-medium">Selesaikan pesanan anda dengan selamat.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <MapPin className="text-[#0F6937]" size={20} /> Alamat Penghantaran
                </h3>
                <button className="text-sm font-bold text-[#0F6937] hover:underline">Tukar</button>
              </div>
              <div className="pl-7 border-l-2 border-gray-100 ml-2">
                <p className="font-bold text-gray-900 mb-1">Ahmad Zaki <span className="text-gray-400 font-normal ml-2">012-3456789</span></p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No 12, Jalan Merdeka 1/2,<br />
                  Taman Sri Aman,<br />
                  43000 Kajang, Selangor
                </p>
              </div>
            </div>

            {/* Items Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg mb-6 border-b border-gray-50 pb-4">
                <Truck className="text-[#0F6937]" size={20} /> Maklumat Pesanan
              </h3>
              
              <div className="space-y-6">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-snug">{item.product.name}</h4>
                      {item.variantName && (
                        <p className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md mt-2 w-max">
                          {item.variantName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-[#0F6937]">RM{item.product.price.toFixed(2)}</span>
                        <span className="text-sm font-bold text-gray-500">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg mb-6 border-b border-gray-50 pb-4">
                <CreditCard className="text-[#0F6937]" size={20} /> Kaedah Pembayaran
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['fpx', 'duitnow', 'card', 'ewallet'].map((method) => (
                  <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all h-28 ${
                      paymentMethod === method 
                      ? 'border-[#0F6937] bg-green-50 text-[#0F6937]' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {method === 'fpx' && <div className="font-black text-xl italic tracking-tighter">FPX</div>}
                    {method === 'duitnow' && <div className="font-black text-pink-600 text-lg">DuitNow</div>}
                    {method === 'card' && <CreditCard size={28} />}
                    {method === 'ewallet' && <Wallet size={28} />}
                    
                    <span className="text-xs font-bold uppercase tracking-wider">{method}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Summary Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Ringkasan</h3>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({checkoutItems.length} item)</span>
                  <span className="text-gray-900">RM{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Kos Penghantaran</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold uppercase text-xs px-2 py-0.5 bg-green-50 rounded-full">Percuma</span>
                  ) : (
                    <span className="text-gray-900">RM{shipping.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-8 flex justify-between items-end">
                <span className="font-bold text-gray-900">Jumlah Besar</span>
                <span className="text-3xl font-black text-[#0F6937]">RM{total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#0F6937] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 hover:bg-[#0A4A27] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Sila Tunggu...' : 'Buat Pesanan'}
                {!isProcessing && <ChevronRight size={20} />}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <ShieldCheck size={16} /> Pembayaran Disulitkan & Selamat
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
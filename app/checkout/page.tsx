'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../providers';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Truck, CreditCard, ShieldCheck, 
  CheckCircle, ChevronRight, Wallet, Receipt, HeartHandshake,
  Plus, X
} from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  postcode: string;
  city: string;
  state: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, removeFromCart } = useCart();
  
  // --- DIRECT BUY & SELECTION LOGIC ---
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const isDirectBuy = searchParams.get('direct') === 'true';
  const selectedParam = searchParams.get('selected');

  useEffect(() => {
    if (isDirectBuy) {
      const savedItem = sessionStorage.getItem('directBuyItem');
      if (savedItem) setCheckoutItems([JSON.parse(savedItem)]);
    } else {
      let itemsToCheckout = cart;
      if (selectedParam) {
        const selectedIds = selectedParam.split(',');
        itemsToCheckout = cart.filter(item => selectedIds.includes(String(item.cartId || item.id)));
      }
      const formattedCart = itemsToCheckout.map(item => ({
        product: item,
        quantity: item.qty || 1,
        variantName: [item.selectedColor, item.selectedSize].filter(Boolean).join(' | ')
      }));
      setCheckoutItems(formattedCart);
    }
  }, [cart, isDirectBuy, selectedParam]);

  // --- ADDRESS STATE ---
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Ahmad Zaki',
      phone: '012-3456789',
      street: 'No 12, Jalan Merdeka 1/2, Taman Sri Aman',
      postcode: '43000',
      city: 'Kajang',
      state: 'Selangor'
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', street: '', postcode: '', city: '', state: '' });

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.street) return;
    const newId = Math.random().toString(36).substring(7);
    const addedAddress = { id: newId, ...newAddress };
    
    setAddresses([...addresses, addedAddress]);
    setSelectedAddressId(newId);
    setIsAddingNew(false);
    setIsEditingAddress(false);
    setNewAddress({ name: '', phone: '', street: '', postcode: '', city: '', state: '' });
  };

  // --- CHECKOUT STATE ---
  const [paymentMethod, setPaymentMethod] = useState('fpx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [infaqAmount, setInfaqAmount] = useState<number>(0);

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.00; 
  const total = subtotal + shipping + infaqAmount;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (!isDirectBuy) {
        if (selectedParam) {
          selectedParam.split(',').forEach(id => removeFromCart(id));
        } else {
          clearCart(); 
        }
      }
      sessionStorage.removeItem('directBuyItem');
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
            {infaqAmount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <span className="font-bold text-[#0F6937] text-sm">Semoga infaq RM{infaqAmount} anda diberkati.</span>
              </div>
            )}
          </div>
          <Link href="/" className="block w-full bg-[#0F6937] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#0A4A27] transition-all">
            Kembali ke Laman Utama
          </Link>
        </div>
      </div>
    );
  }

  // --- EMPTY CART CHECK ---
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <Receipt size={64} className="text-gray-300 mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Tiada Item Untuk Dibayar</h2>
          <p className="text-gray-500 mb-8 max-w-md">Sila tambah produk ke troli atau gunakan butang Beli Terus.</p>
          <button onClick={() => router.back()} className="px-8 py-3 bg-[#0F6937] text-white rounded-full font-bold shadow-md hover:bg-[#0A4A27] transition-all">Kembali</button>
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
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <MapPin className="text-[#0F6937]" size={20} /> Alamat Penghantaran
                </h3>
                {!isEditingAddress && (
                  <button onClick={() => setIsEditingAddress(true)} className="text-sm font-bold text-[#0F6937] hover:underline px-3 py-1.5 bg-green-50 rounded-lg">
                    Tukar
                  </button>
                )}
              </div>

              {/* View Active Address */}
              {!isEditingAddress && activeAddress && (
                <div className="pl-7 border-l-2 border-green-200 ml-2 animate-in fade-in">
                  <p className="font-bold text-gray-900 mb-1">{activeAddress.name} <span className="text-gray-400 font-normal ml-2">{activeAddress.phone}</span></p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {activeAddress.street},<br />
                    {activeAddress.postcode} {activeAddress.city}, {activeAddress.state}
                  </p>
                </div>
              )}

              {/* Edit/Select Address Mode */}
              {isEditingAddress && !isAddingNew && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#0F6937] bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">{addr.name} <span className="text-gray-500 font-normal ml-2">{addr.phone}</span></p>
                          <p className="text-sm text-gray-500">{addr.street}, {addr.postcode} {addr.city}, {addr.state}</p>
                        </div>
                        {selectedAddressId === addr.id && <CheckCircle className="text-[#0F6937] shrink-0" size={20} />}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsAddingNew(true)} className="flex-1 border-2 border-dashed border-gray-300 text-gray-600 rounded-2xl p-4 font-bold flex justify-center items-center gap-2 hover:border-[#0F6937] hover:text-[#0F6937] hover:bg-green-50 transition-all">
                      <Plus size={20} /> Tambah Alamat Baru
                    </button>
                    <button onClick={() => setIsEditingAddress(false)} className="px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                      Selesai
                    </button>
                  </div>
                </div>
              )}

              {/* Add New Address Form */}
              {isAddingNew && (
                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Alamat Baru</h4>
                    <button onClick={() => setIsAddingNew(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nama Penerima</label>
                      <input type="text" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]" placeholder="Cth: Ahmad Zaki" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">No. Telefon</label>
                      <input type="text" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]" placeholder="Cth: 0123456789" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap (No Rumah, Jalan, Taman)</label>
                      <input type="text" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]" placeholder="Cth: No 12, Jalan Merdeka 1/2" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Poskod</label>
                      <input type="text" value={newAddress.postcode} onChange={e => setNewAddress({...newAddress, postcode: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]" placeholder="Cth: 43000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Bandar</label>
                      <input type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]" placeholder="Cth: Kajang" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Negeri</label>
                      <select value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-[#0F6937] focus:border-[#0F6937]">
                        <option value="">Pilih Negeri</option>
                        <option value="Selangor">Selangor</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Johor">Johor</option>
                        <option value="Penang">Pulau Pinang</option>
                        <option value="Perak">Perak</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Pahang">Pahang</option>
                        <option value="Sabah">Sabah</option>
                        <option value="Sarawak">Sarawak</option>
                        <option value="Kelantan">Kelantan</option>
                        <option value="Perlis">Perlis</option>
                        <option value="Terengganu">Terengganu</option>
                        <option value="Negeri Sembilan">Negeri Sembilan</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveNewAddress} 
                    disabled={!newAddress.name || !newAddress.street || !newAddress.phone}
                    className="w-full mt-4 bg-[#0F6937] text-white py-3.5 rounded-xl font-bold hover:bg-[#0A4A27] transition-all disabled:opacity-50"
                  >
                    Simpan & Guna Alamat Ini
                  </button>
                </div>
              )}
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

            {/* Infaq Box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 rounded-3xl border border-green-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#0F6937] mb-2 flex items-center gap-2">
                <HeartHandshake size={20} /> Tabung Infaq UMMart
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Sumbangan anda akan disalurkan kepada golongan asnaf dan pembangunan usahawan baru. <span className="italic">"Tidak akan berkurang harta kerana bersedekah."</span>
              </p>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[0, 2, 5, 10].map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setInfaqAmount(amt)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${infaqAmount === amt ? 'bg-[#0F6937] text-white border-[#0F6937] shadow-lg shadow-green-900/20 scale-105' : 'bg-white text-gray-600 border-green-200 hover:border-[#0F6937] hover:text-[#0F6937]'}`}
                  >
                    {amt === 0 ? 'Tiada' : `RM${amt}`}
                  </button>
                ))}
              </div>
              {infaqAmount > 0 && (
                <p className="text-xs text-[#0F6937] font-bold animate-pulse">
                  Alhamdulillah, sumbangan RM{infaqAmount} telah ditambah!
                </p>
              )}
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
                {infaqAmount > 0 && (
                  <div className="flex justify-between text-[#0F6937] font-bold p-2 bg-green-50 rounded-lg">
                    <span>Tabung Infaq</span> 
                    <span>+ RM{infaqAmount.toFixed(2)}</span>
                  </div>
                )}
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
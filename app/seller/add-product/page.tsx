'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCart } from '../../providers';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Package, ImageIcon, Tag, AlignLeft, DollarSign } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const { sellerProfile } = useCart();

  // --- FORM STATE ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makanan (Halal)');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- DYNAMIC VARIANTS STATE ---
  // Start with one empty variant row by default
  const [variants, setVariants] = useState([{ name: '', image: '' }]);

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', image: '' }]);
  };

  const handleVariantChange = (index: number, field: 'name' | 'image', value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // --- SUBMIT TO SUPABASE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // 1. Clean up variants (remove any that have an empty name)
    const cleanedVariants = variants.filter(v => v.name.trim() !== '');

    // 2. Prepare the product object
    const newProduct = {
      name,
      price: parseFloat(price),
      category,
      description,
      image: mainImage,
      seller: sellerProfile?.shopName || 'Unknown Seller',
      variants: cleanedVariants.length > 0 ? cleanedVariants : null, // Send as JSON array natively!
      rating: 5.0, // Default rating for new products
      reviews: 0,
      sold: 0
    };

    try {
      // 3. Insert directly into Supabase
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      // 4. Success! Send them back to the dashboard
      router.push('/seller');
      router.refresh(); // Force next.js to grab the fresh data
    } catch (err: any) {
      console.error('Error adding product:', err);
      setErrorMsg(err.message || 'Gagal menambah produk. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm border border-gray-200 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Tambah Produk Baru</h1>
            <p className="text-sm text-gray-500 font-medium">Isi maklumat produk anda di bawah</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- BASIC INFO --- */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="text-[#0F6937]" size={20} /> Maklumat Asas
            </h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Produk *</label>
              <input 
                type="text" 
                required
                placeholder="Cth: Sambal Nyet Berapi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex text-sm font-bold text-gray-700 mb-1.5 items-center gap-1">
   Harga (RM) *
</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">RM</span>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition"
                >
                  <option value="Makanan (Halal)">Makanan (Halal)</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Kesihatan & Kecantikan">Kesihatan & Kecantikan</option>
                  <option value="Aksesori">Aksesori</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Pautan Gambar Utama (URL) *</label>
              <input 
                type="url" 
                required
                placeholder="https://..."
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Penerangan Produk</label>
              <textarea 
                rows={4}
                placeholder="Ceritakan tentang produk anda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F6937]/20 focus:border-[#0F6937] transition resize-none"
              />
            </div>
          </div>

          {/* --- VARIANTS BUILDER --- */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="text-[#0F6937]" size={20} /> Pilihan Variasi (Pilihan)
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">Warna, Saiz, dll.</span>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      placeholder="Nama Variasi (Cth: Merah, Saiz L)"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F6937]"
                    />
                    <input 
                      type="url" 
                      placeholder="Pautan Gambar Variasi (URL - Pilihan)"
                      value={variant.image}
                      onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F6937]"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveVariant(index)}
                    className="w-10 h-10 shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleAddVariant}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-[#0F6937] hover:text-[#0F6937] hover:bg-green-50 transition"
            >
              <Plus size={18} /> Tambah Variasi
            </button>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0F6937] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#0A4A27] transition shadow-xl shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sedang Menyimpan...' : (
              <><Save size={22} /> Simpan Produk</>
            )}
          </button>

        </form>

      </main>
    </div>
  );
}
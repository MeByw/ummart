'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../providers';
import { Save, Store, Mail, MapPin, ShieldCheck, Award, Upload, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
  const { sellerProfile, updateSellerProfile } = useCart();
  const [formData, setFormData] = useState(sellerProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(sellerProfile);
  }, [sellerProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --- NEW: IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); 
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tetapan Kedai</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        
        {/* --- NEW: PROFILE PICTURE UPLOAD --- */}
        <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full border-4 border-gray-50 bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
            {formData.image ? (
              <img src={formData.image} alt="Store Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-400" size={32} />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 mb-1">Logo Kedai</h3>
            <p className="text-sm text-gray-500 mb-3">Muat naik logo perniagaan anda. Resolusi disyorkan: 500x500px.</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold text-sm rounded-lg cursor-pointer hover:bg-gray-200 transition">
              <Upload size={16} /> Pilih Gambar
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Maklumat Asas</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kedai</label>
            <div className="relative">
              <Store className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F6937] outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F6937] outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F6937] outline-none" placeholder="Contoh: Kuala Lumpur, MY" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Penerangan Kedai</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F6937] outline-none" placeholder="Ceritakan sedikit tentang kedai anda..."></textarea>
          </div>
        </div>

        {/* Trust Badges Settings */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Pengesahan & Kepercayaan</h2>
          
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input type="checkbox" name="isMuslimOwned" checked={formData.isMuslimOwned || false} onChange={handleChange} className="w-5 h-5 accent-[#0F6937]" />
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <Award size={18} className="text-[#0F6937]" /> Pemilikan Muslim (BMF)
              </div>
              <p className="text-sm text-gray-500">Papar lencana ini jika perniagaan ini 100% milik bumiputera/muslim.</p>
            </div>
          </label>

          <div className="p-4 border border-gray-200 rounded-lg">
            <label className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#0F6937]" /> Status Sijil Halal JAKIM
            </label>
            <select name="halalCertStatus" value={formData.halalCertStatus || 'none'} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F6937] outline-none">
              <option value="none">Tiada Sijil / Tidak Berkaitan</option>
              <option value="pending">Permohonan Dalam Proses (Pending)</option>
              <option value="approved">Disahkan Halal (Approved)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex items-center gap-4">
          <button type="submit" className="flex items-center gap-2 bg-[#0F6937] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0a4a27] transition shadow-md">
            <Save size={18} /> Simpan Tetapan
          </button>
          {isSaved && <span className="text-green-600 font-bold text-sm">Tetapan berjaya disimpan!</span>}
        </div>
      </form>
    </div>
  );
}
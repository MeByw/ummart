'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../providers';
import { Save, Camera, Store, Mail, MapPin, AlignLeft, ShieldCheck, Award, AlertCircle } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { sellerProfile, updateSellerProfile } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    location: '', 
    description: '',
    image: '',
    isMuslimOwned: false,
    halalCertStatus: 'none' as 'none' | 'pending' | 'approved'
  });

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile data when page opens
  useEffect(() => {
    if (sellerProfile) {
      setFormData({
        shopName: sellerProfile.shopName || sellerProfile.name || '',
        email: sellerProfile.email || '',
        location: sellerProfile.location || '',
        description: sellerProfile.description || '',
        image: sellerProfile.image || '',
        isMuslimOwned: sellerProfile.isMuslimOwned || false,
        halalCertStatus: sellerProfile.halalCertStatus || 'none'
      });
    }
  }, [sellerProfile]);

  // Handle Text Input Changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Image File Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Function
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Update the global state
    updateSellerProfile(formData);
    
    // Fake delay for better UX
    setTimeout(() => {
        setIsSaving(false);
        alert("Profile & Badges updated successfully!");
    }, 600);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Store Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your shop details, logo, and UmMart certifications.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-8">
            
          {/* --- TOP SECTION: IMAGE & BASIC INFO --- */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Store Logo Uploader */}
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-32 h-32 rounded-full border-4 border-gray-50 bg-gray-100 shadow-inner flex items-center justify-center overflow-hidden relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.image ? (
                   <img src={formData.image} alt="Shop Logo" className="w-full h-full object-cover group-hover:opacity-50 transition" />
                ) : (
                   <Store size={40} className="text-gray-300" />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
              >
                Upload Logo
              </button>
            </div>

            {/* --- FORM FIELDS --- */}
            <div className="flex-1 grid grid-cols-1 gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shop Name</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      name="shopName" type="text" required 
                      value={formData.shopName} onChange={handleTextChange}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition font-medium" 
                      placeholder="e.g. Zul's Mart" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      name="email" type="email" required 
                      value={formData.email} onChange={handleTextChange}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition font-medium" 
                      placeholder="seller@ummart.com" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    name="location" type="text" required 
                    value={formData.location} onChange={handleTextChange}
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition font-medium" 
                    placeholder="e.g. Shah Alam, Selangor" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shop Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea 
                    name="description" rows={3} 
                    value={formData.description} onChange={handleTextChange}
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition resize-none font-medium" 
                    placeholder="Tell buyers about your products..." 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- STORE BADGES & CERTIFICATIONS --- */}
          <div className="border-t border-gray-100 pt-8 mt-4">
            <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">Store Badges & Certifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Muslim Owned Badge */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${formData.isMuslimOwned ? 'border-[#006837] bg-green-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Award className={formData.isMuslimOwned ? 'text-[#006837]' : 'text-gray-400'} size={24} />
                    <h4 className="font-bold text-gray-900">Muslim-Owned Business</h4>
                  </div>
                  {/* Beautiful Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.isMuslimOwned}
                      onChange={(e) => setFormData(prev => ({ ...prev, isMuslimOwned: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006837]"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">Display the "BMF" badge on your store profile to build trust with our buyers.</p>
              </div>

              {/* 2. Halal Certification Lead Generation */}
              <div className="p-5 rounded-2xl border-2 border-gray-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className={formData.halalCertStatus === 'approved' ? 'text-[#006837]' : 'text-gray-400'} size={24} />
                    <h4 className="font-bold text-gray-900">JAKIM Halal Permit</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Integrate your official Halal Certificate, or let UmMart agents assist you in applying for one.</p>
                </div>
                
                {/* Dynamic Button Based on Status */}
                {formData.halalCertStatus === 'none' && (
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, halalCertStatus: 'pending' }))}
                    className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2c] text-white text-sm font-bold rounded-xl transition shadow-md shadow-yellow-900/10 flex items-center justify-center gap-2"
                  >
                    Apply via UmMart Now
                  </button>
                )}
                {formData.halalCertStatus === 'pending' && (
                  <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-50 text-yellow-700 text-sm font-bold rounded-xl border border-yellow-200">
                    <AlertCircle size={18} /> Application in Progress
                  </div>
                )}
                {formData.halalCertStatus === 'approved' && (
                  <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-50 text-[#006837] text-sm font-bold rounded-xl border border-green-200">
                    <ShieldCheck size={18} /> Officially Halal Certified
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SAVE BAR --- */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-[#006837] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#00552b] transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Save size={18} />
            )}
            {isSaving ? 'Saving Updates...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
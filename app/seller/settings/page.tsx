'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../providers'; 
import { Save, Camera, Store, Mail, MapPin, AlignLeft } from 'lucide-react';

export default function ProfileSettingsPage() {
    const { sellerProfile, updateSellerProfile } = useCart();
    
    // Form State
    const [formData, setFormData] = useState({
        shopName: '',
        email: '',
        location: '', // Added Location
        description: '',
        image: ''
    });
    
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load existing profile data when page opens
    useEffect(() => {
        if (sellerProfile) {
            setFormData({
                shopName: sellerProfile.shopName || sellerProfile.name || '',
                email: sellerProfile.email || '',
                location: sellerProfile.location || '', // Load Location
                description: sellerProfile.description || '',
                image: sellerProfile.image || ''
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
            alert("Profile updated successfully!");
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your public shop profile and branding</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSave} className="p-8 space-y-8">
                    
                    {/* --- PROFILE PICTURE SECTION --- */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        
                        {/* Image Preview */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                                <img 
                                    src={formData.image || "https://placehold.co/100"} 
                                    className="w-full h-full object-cover" 
                                    alt="Shop Logo"
                                />
                            </div>
                            {/* Overlay Camera Icon */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-sm"
                            >
                                <Camera className="text-white" size={32} />
                            </div>
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-gray-900">Store Logo</h3>
                            <p className="text-sm text-gray-500 mb-4">Recommended: Square JPG or PNG, max 2MB.</p>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                            >
                                Upload New Picture
                            </button>
                        </div>
                    </div>

                    {/* --- FORM FIELDS --- */}
                    <div className="grid grid-cols-1 gap-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shop Name</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="shopName"
                                        type="text" 
                                        required
                                        value={formData.shopName}
                                        onChange={handleTextChange}
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
                                        name="email"
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={handleTextChange}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition font-medium"
                                        placeholder="seller@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NEW LOCATION FIELD */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Store Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    name="location"
                                    type="text" 
                                    required
                                    value={formData.location}
                                    onChange={handleTextChange}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition font-medium"
                                    placeholder="e.g. Kuala Lumpur, Malaysia"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shop Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea 
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleTextChange}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-1 focus:ring-[#006837] outline-none transition resize-none"
                                    placeholder="Tell customers what you sell..."
                                />
                            </div>
                        </div>

                    </div>

                    {/* --- SAVE BUTTON --- */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95
                            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#006837] hover:bg-[#00552b]'}`}
                        >
                            <Save size={18} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
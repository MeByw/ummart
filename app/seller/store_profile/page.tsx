'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../../providers'; // Note the double dot ../../ to go back
import { Store, Save, ArrowLeft, Upload, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StoreProfilePage() {
    const { sellerProfile, updateSellerProfile } = useCart();
    const router = useRouter();

    // Local state for the form
    const [formData, setFormData] = useState({
        shopName: '',
        description: '',
        image: ''
    });

    // Load data when page opens
    useEffect(() => {
        if (sellerProfile) {
            setFormData({
                shopName: sellerProfile.shopName || '',
                description: sellerProfile.description || '',
                image: sellerProfile.image || ''
            });
        }
    }, [sellerProfile]);

    // Handle standard text changes
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Image Upload - STANDARD METHOD
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSellerProfile(formData);
        alert("Store Profile Updated Successfully!");
        router.push('/seller'); // Go back to dashboard after save
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="max-w-2xl mx-auto w-full p-6">
                
                {/* Header with Back Button */}
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/seller" className="p-2 bg-white rounded-full border hover:bg-gray-100 transition">
                        <ArrowLeft size={20} className="text-gray-600"/>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Edit Store Profile</h1>
                        <p className="text-sm text-gray-500">Update your shop logo and details</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSave} className="p-8 space-y-8">
                        
                        {/* 1. PROFILE PICTURE SECTION */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-900">Store Logo</label>
                            
                            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                {/* Preview */}
                                <div className="shrink-0 relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                                        <img 
                                            src={formData.image || "https://placehold.co/100"} 
                                            className="w-full h-full object-cover" 
                                            alt="Preview"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-[#006837] text-white p-2 rounded-full border-2 border-white">
                                        <Camera size={16} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="w-full">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Upload a new photo</p>
                                    {/* STANDARD VISIBLE INPUT - NO TRICKS */}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-bold
                                        file:bg-green-50 file:text-[#006837]
                                        hover:file:bg-green-100 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Recommended: Square JPG or PNG, max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. TEXT FIELDS */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Shop Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Store size={18} className="text-gray-400"/>
                                    </div>
                                    <input 
                                        name="shopName"
                                        type="text" 
                                        required
                                        value={formData.shopName}
                                        onChange={handleTextChange}
                                        className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] font-medium"
                                        placeholder="e.g. Zul's Mart"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                                <textarea 
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleTextChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] resize-none"
                                    placeholder="Tell your customers about your shop..."
                                />
                            </div>
                        </div>

                        {/* 3. SAVE BUTTON */}
                        <div className="pt-4 border-t border-gray-100">
                            <button 
                                type="submit" 
                                className="w-full bg-[#006837] text-white h-12 rounded-xl font-bold shadow-lg hover:bg-[#00552b] transition flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Save size={18} /> Save Profile
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
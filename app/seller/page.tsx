'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../providers'; 
import { Plus, Package, DollarSign, BarChart3, Settings, Camera, Save } from 'lucide-react';
import Link from 'next/link';

// We need to define the Type locally or import it to fix 'any' errors
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  seller?: string;
  reviews?: number;
  rating?: number;
}

export default function SellerDashboard() {
  // 1. Get allProducts instead of sellerProducts
  const { allProducts, sellerProfile, updateSellerProfile } = useCart();
  
  // 2. Filter to find ONLY this seller's products
  const sellerProducts = allProducts.filter((p: Product) => 
    p.seller === (sellerProfile.shopName || sellerProfile.name)
  );
  
  // Local state for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState(sellerProfile.shopName || '');
  const [shopImage, setShopImage] = useState(sellerProfile.image || '');

  // 3. Fix the "implicit any" errors by typing the accumulator (acc) and product (p)
  const totalSales = sellerProducts.reduce((acc: number, p: Product) => acc + (p.price * (p.reviews || 0)), 0);
  const totalOrders = sellerProducts.reduce((acc: number, p: Product) => acc + (p.reviews || 0), 0);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (updateSellerProfile) {
        updateSellerProfile({ ...sellerProfile, shopName, image: shopImage });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- HEADER & PROFILE SECTION --- */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                
                {/* Profile Picture Upload */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                        {shopImage ? (
                            <img src={shopImage} alt="Shop Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-[#006837]">{shopName.charAt(0)}</span>
                        )}
                    </div>
                    
                    {/* Edit Overlay (Only visible when editing) */}
                    {isEditing && (
                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
                            <Camera className="text-white" size={24} />
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                    )}
                </div>

                <div>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="text-3xl font-black text-gray-900 border-b-2 border-green-500 focus:outline-none bg-transparent"
                        />
                    ) : (
                        <h1 className="text-3xl font-black text-gray-900">{shopName}</h1>
                    )}
                    <p className="text-gray-500 font-medium">Seller Dashboard</p>
                </div>
            </div>

            <div className="flex gap-3">
                {isEditing ? (
                    <button 
                        onClick={handleSaveProfile}
                        className="bg-[#006837] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center gap-2"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2"
                    >
                        <Settings size={18} /> Edit Profile
                    </button>
                )}
                
                <Link href="/seller/add-product" className="bg-[#006837] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center gap-2 shadow-lg shadow-green-900/20">
                    <Plus size={20} /> Add Product
                </Link>
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <DollarSign size={20} /> <span className="font-bold text-sm uppercase">Total Revenue</span>
                </div>
                <p className="text-3xl font-black text-gray-900">RM{totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <Package size={20} /> <span className="font-bold text-sm uppercase">Active Products</span>
                </div>
                <p className="text-3xl font-black text-gray-900">{sellerProducts.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <BarChart3 size={20} /> <span className="font-bold text-sm uppercase">Total Orders</span>
                </div>
                <p className="text-3xl font-black text-gray-900">{totalOrders}</p>
            </div>
        </div>

        {/* --- PRODUCTS LIST --- */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Your Products</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 pl-6">Product</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Sold</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sellerProducts.length > 0 ? sellerProducts.map((product: Product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">RM{product.price.toFixed(2)}</td>
                                <td className="p-4 text-gray-600">{product.reviews || 0}</td>
                                <td className="p-4"><span className="bg-green-100 text-[#006837] px-2 py-1 rounded text-xs font-bold uppercase">Active</span></td>
                                <td className="p-4">
                                    <button className="text-gray-400 hover:text-[#006837] font-bold text-sm">Edit</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No products found. Start selling now!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

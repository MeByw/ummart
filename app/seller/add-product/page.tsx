'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '../../providers';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, sellerProfile } = useCart();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // Stores the Base64 image string
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Convert to Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProduct = {
      id: Date.now(), // Generate a unique ID
      name,
      price: parseFloat(price),
      category,
      seller: sellerProfile.shopName || "My Shop", // Use dynamic shop name
      rating: 0,
      reviews: 0,
      image: image || "https://via.placeholder.com/300", // Use uploaded image or fallback
      description,
    };

    // Simulate network delay
    setTimeout(() => {
      addProduct(newProduct);
      setIsSubmitting(false);
      router.push('/seller'); 
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/seller" className="flex items-center gap-2 text-gray-500 hover:text-[#006837] mb-6 transition">
            <ChevronLeft size={20} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- NEW IMAGE UPLOAD SECTION --- */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative group">
                        
                        {image ? (
                            <div className="relative h-64 w-full">
                                <img 
                                    src={image} 
                                    alt="Preview" 
                                    className="w-full h-full object-contain rounded-lg" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setImage('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center h-48">
                                <div className="w-16 h-16 bg-green-50 text-[#006837] rounded-full flex items-center justify-center mb-3">
                                    <Upload size={24} />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Click to upload image</span>
                                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sambal Nyet"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] transition font-medium"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Price (RM)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] transition font-medium"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] transition font-medium appearance-none"
                        >
                            <option>Food</option>
                            <option>Fashion</option>
                            <option>Electronics</option>
                            <option>Beauty</option>
                            <option>Home</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your product..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006837] transition"
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#006837] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-[#00552b] transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Saving...' : (
                            <><Save size={20} /> Add Product</>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
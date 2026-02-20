'use client';

import React, { useState } from 'react';
import { useCart } from '../../providers';
import { Search, Plus, Trash2, Upload, X } from 'lucide-react';

export default function MyProductsPage() {
  const { allProducts, addProduct, deleteProduct, sellerProfile } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Food', image: '' });

  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return alert("Please fill all fields");

    addProduct({
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: "New Item",
        seller: sellerProfile.shopName || sellerProfile.name,
        rating: 0, reviews: 0
    });
    setIsModalOpen(false);
    setFormData({ name: '', price: '', category: 'Food', image: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Inventory Management</h1>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input 
                        type="text" placeholder="Search products..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006837]"
                    />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#006837] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#00552b]">
                    <Plus size={18}/> Add Product
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border overflow-hidden"><img src={product.image} className="w-full h-full object-cover"/></div>
                            <span className="font-bold text-sm">{product.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 font-bold text-sm">RM{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* MODAL */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Add Product</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
                    </div>
                    <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center relative hover:bg-gray-50 cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                            {formData.image ? <img src={formData.image} className="h-full w-full object-contain p-2"/> : <Upload className="text-gray-400"/>}
                        </div>
                        <input required placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg"/>
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="number" step="0.01" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg"/>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg bg-white"><option>Food</option><option>Clothing</option><option>Electronics</option></select>
                        </div>
                        <button type="submit" className="w-full bg-[#006837] text-white py-3 rounded-xl font-bold">Create</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
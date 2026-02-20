'use client';

import React, { useState } from 'react';
import { useCart } from '../../providers'; 
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function SellerProductsPage() {
  const { allProducts, deleteProduct, sellerProfile } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filter products for this seller
  const sellerProducts = allProducts.filter((p: any) => 
    p.seller === (sellerProfile.shopName || sellerProfile.name)
  );

  // 2. Handle Search Filter
  const filteredProducts = sellerProducts.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory and pricing.</p>
        </div>
        <Link 
          href="/seller/add" 
          className="bg-[#006837] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#00552b] transition shadow-lg shadow-green-900/10"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] outline-none transition"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        />
                        <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#006837]">
                      RM{p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {p.sold || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-[#006837] hover:bg-green-50 rounded-lg transition">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    {searchTerm ? 'No products match your search.' : 'You haven\'t added any products yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
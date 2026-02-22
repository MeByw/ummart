'use client';

import React, { useState } from 'react';
import { useCart } from '../../providers';
import { Search, Plus, Trash2, Edit, PackageOpen, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyProductsPage() {
  const { allProducts, deleteProduct } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  // Search logic for Seller Dashboard
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20 max-w-6xl mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produk Saya</h1>
          <p className="text-gray-500 text-sm">Urus dan kemas kini senarai produk kedai anda.</p>
        </div>
        <Link 
          href="/seller/add"
          className="bg-[#0F6937] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-[#0a4a27] transition flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Tambah Produk Baru
        </Link>
      </div>

      {/* Control Bar (Search & Filter) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama produk atau kategori..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F6937]/50 focus:border-[#0F6937] text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 font-medium">
          <PackageOpen size={18} /> {filteredProducts.length} Produk
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <PackageOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-bold text-gray-800 mb-1">Tiada produk ditemui.</p>
            <p className="text-sm">Cuba carian lain atau tambah produk baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                  <th className="p-4 rounded-tl-xl">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga (RM)</th>
                  <th className="p-4">Jualan</th>
                  <th className="p-4 text-right rounded-tr-xl">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-green-50/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex gap-1 items-center">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{product.category}</span>
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0F6937]">
                      {product.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">
                      {product.sold || 0} Terjual
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Adakah anda pasti mahu memadam produk ini?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Padam"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
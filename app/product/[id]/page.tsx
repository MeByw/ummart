import React from 'react';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';
import { Package } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; 

async function getProduct(id: number) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Package size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-4">Produk Tidak Ditemui</h1>
        <Link href="/" className="px-6 py-2 bg-[#0F6937] text-white rounded-full font-bold">
          Kembali ke Laman Utama
        </Link>
      </div>
    );
  }

  // Passes the fetched product safely to the Client file below
  return <ProductDetailClient product={product} />;
}
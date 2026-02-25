'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from './products';
import { supabase } from '../lib/supabase';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

// --- SHARED TYPES ---
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  seller: string; 
  rating: number;
  reviews: number;
  description: string;
  colorImages?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  sold?: number;
  variants?: { id?: string; name: string; image?: string }[];
}

export interface CartItem extends Product {
  cartId: string;
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
  variantImage?: string; // ADDED: Stores the specific color image
}

export interface SellerProfile {
  id?: number;            // <--- FIXED: TypeScript error solved
  name: string;
  email: string;
  shopName: string;
  image: string; 
  description?: string; 
  rating?: number;       
  location?: string;
  isMuslimOwned?: boolean;
  halalCertStatus?: 'none' | 'pending' | 'approved';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty: number, color?: string, size?: string, variantImage?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  allProducts: Product[];
  addProduct: (newProduct: Product) => void;
  deleteProduct: (id: number) => void;
  sellerProfile: SellerProfile;
  updateSellerProfile: (newProfile: Partial<SellerProfile>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Default Profile Data (Used as a fallback)
const DEFAULT_SELLER: SellerProfile = {
    id: 1, 
    name: "Seller Name",
    email: "seller@store.com",
    shopName: "Store Name",
    image: "", 
    description: "Welcome to my official shop!",
    rating: 0.0,
    location: "Malaysia",
    isMuslimOwned: true,
    halalCertStatus: 'none'
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(DEFAULT_SELLER);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // THE MAGIC LOCK
  const [isInitialized, setIsInitialized] = useState(false);

  // 🌟 NEW NOTIFICATION STATE 🌟
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Auto-hide after 3 seconds
  }, []);

  // --- 1. LOAD DATA ON INITIAL RENDER ---
  useEffect(() => {
    // 1. First, pull Cart from local storage safely
    const savedCart = localStorage.getItem('ummart-cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // 2. Load Supabase Data (Products & Seller Profile)
    const loadDatabase = async () => {
        
        // A. Load Products
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!productsError && productsData && productsData.length > 0) {
            setAllProducts(productsData);
        } else if (productsData && productsData.length === 0) {
            const productsToInsert = initialProducts.map(({ id, hasVariants, isHalal, ...rest }: any) => rest);
            const { data: insertedData } = await supabase.from('products').insert(productsToInsert).select();
            if (insertedData) setAllProducts(insertedData);
        }

        // B. Load Seller Profile from Database
        const { data: profileData } = await supabase
            .from('seller_profile')
            .select('*')
            .eq('id', 1)
            .single();

        if (profileData) {
            setSellerProfile(profileData); 
        } else {
            const savedProfile = localStorage.getItem('ummart-seller-profile');
            if (savedProfile) setSellerProfile(JSON.parse(savedProfile));
        }

        // 3. UNLOCK saving only after data is securely loaded from DB
        setIsInitialized(true);
    };

    loadDatabase();
  }, []);

  // --- 2. ALWAYS SAVE TO LOCAL STORAGE (IF UNLOCKED) ---
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ummart-cart', JSON.stringify(cart));
      localStorage.setItem('ummart-seller-profile', JSON.stringify(sellerProfile));
    }
  }, [cart, sellerProfile, isInitialized]);

  // --- ACTIONS ---
  const addToCart = (product: Product, qty: number, color?: string, size?: string, variantImage?: string) => {
    setCart((prev) => {
      const uniqueId = `${product.id}-${color || 'def'}-${size || 'def'}`;
      const existing = prev.find((item) => item.cartId === uniqueId);
      if (existing) {
        return prev.map((item) => item.cartId === uniqueId ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, cartId: uniqueId, qty, selectedColor: color, selectedSize: size, variantImage }];
    });
    showNotification(`${product.name} ditambah ke troli!`);
  };

  const removeFromCart = (cartId: string) => {
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
      showNotification('Produk dibuang dari troli.');
  };

  const updateQuantity = (cartId: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, qty } : item)));
  };

  const clearCart = () => setCart([]);

  const addProduct = async (newProduct: Product) => {
      const { id, ...productData } = newProduct;
      setAllProducts((prev) => [newProduct, ...prev]);
      const { data } = await supabase.from('products').insert([productData]).select();
      if (data) setAllProducts((prev) => prev.map(p => p.id === newProduct.id ? data[0] : p));
      showNotification('Produk berjaya ditambah!');
  };

  const deleteProduct = async (id: number) => {
      setAllProducts((prev) => prev.filter(p => p.id !== id));
      await supabase.from('products').delete().eq('id', id);
      showNotification('Produk telah dibuang.');
  };

  // --- SYNC SELLER PROFILE GLOBALLY ---
  const updateSellerProfile = async (newDetails: Partial<SellerProfile>) => {
      const oldShopName = sellerProfile.shopName;
      const newShopName = newDetails.shopName;

      // 1. Update UI Immediately
      setSellerProfile((prev) => ({ ...prev, ...newDetails }));

      // 2. Push Update to Database!
      await supabase.from('seller_profile').update(newDetails).eq('id', 1);

      // 3. Update related products' seller names
      if (newShopName && newShopName !== oldShopName) {
          setAllProducts((prev) => prev.map(p => p.seller === oldShopName ? { ...p, seller: newShopName } : p));
          await supabase.from('products').update({ seller: newShopName }).eq('seller', oldShopName);
      }
      showNotification('Profil berjaya dikemaskini!');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, 
        allProducts, addProduct, deleteProduct, sellerProfile, updateSellerProfile 
    }}>
      {children}

      {/* 🌟 REPAIRED MOBILE-FRIENDLY NOTIFICATION 🌟 */}
      {notification && (
        <div className="fixed z-[9999] left-0 right-0 mx-auto w-[90%] max-w-sm bottom-24 md:bottom-10 md:right-10 md:left-auto md:mx-0 bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle className="text-[#0F6937]" size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800 truncate">{notification}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link 
              href="/cart" 
              onClick={() => setNotification(null)} 
              className="text-xs font-black bg-[#0F6937] text-white px-4 py-2.5 rounded-xl hover:bg-[#0A4A27] transition-colors whitespace-nowrap"
            >
              Lihat Troli
            </Link>
            <button 
              onClick={() => setNotification(null)} 
              className="p-2.5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
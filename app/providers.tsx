'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from './products';
import { supabase } from '../lib/supabase';

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
  variantImage?: string;
}

export interface SellerProfile {
  id?: number;
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
  const [isInitialized, setIsInitialized] = useState(false);

  // --- 1. LOAD DATA ON INITIAL RENDER ---
  useEffect(() => {
    // Pull CART from local storage
    const savedCart = localStorage.getItem('ummart-cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load Supabase Data (Products & Seller Profile)
    const loadDatabase = async () => {
        
        // A. Load Products
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!productsError && productsData.length > 0) {
            setAllProducts(productsData);
        } else if (productsData && productsData.length === 0) {
            const productsToInsert = initialProducts.map(({ id, hasVariants, isHalal, ...rest }: any) => rest);
            const { data: insertedData } = await supabase.from('products').insert(productsToInsert).select();
            if (insertedData) setAllProducts(insertedData);
        }

        // B. Load Seller Profile from Database
        const { data: profileData, error: profileError } = await supabase
            .from('seller_profile')
            .select('*')
            .eq('id', 1)
            .single();

        if (profileData) {
            setSellerProfile(profileData); // DB is the source of truth!
        } else if (profileError) {
            // Fallback to local storage if DB is unreachable temporarily
            const savedProfile = localStorage.getItem('ummart-seller-profile');
            if (savedProfile) setSellerProfile(JSON.parse(savedProfile));
        }

        setIsInitialized(true);
    };

    loadDatabase();
  }, []);

  // --- 2. SAVE CART ---
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ummart-cart', JSON.stringify(cart));
      localStorage.setItem('ummart-seller-profile', JSON.stringify(sellerProfile)); // Keep as local backup
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
  };

  const removeFromCart = (cartId: string) => setCart((prev) => prev.filter((item) => item.cartId !== cartId));

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
  };

  const deleteProduct = async (id: number) => {
      setAllProducts((prev) => prev.filter(p => p.id !== id));
      await supabase.from('products').delete().eq('id', id);
  };

  // --- UPDATED: SYNC SELLER PROFILE GLOBALLY ---
  const updateSellerProfile = async (newDetails: Partial<SellerProfile>) => {
      const oldShopName = sellerProfile.shopName;
      const newShopName = newDetails.shopName;

      // 1. Update UI Immediately
      setSellerProfile((prev) => ({ ...prev, ...newDetails }));

      // 2. Push Update to Database! (Everyone sees this now)
      await supabase.from('seller_profile').update(newDetails).eq('id', 1);

      // 3. Update related products' seller names
      if (newShopName && newShopName !== oldShopName) {
          setAllProducts((prev) => prev.map(p => p.seller === oldShopName ? { ...p, seller: newShopName } : p));
          await supabase.from('products').update({ seller: newShopName }).eq('seller', oldShopName);
      }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, 
        allProducts, addProduct, deleteProduct, sellerProfile, updateSellerProfile 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
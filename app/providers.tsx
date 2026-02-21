'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from './products';
import { supabase } from '../lib/supabase'; // <-- WE ARE IMPORTING YOUR DATABASE HERE

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
}

export interface CartItem extends Product {
  cartId: string;
  qty: number; 
  selectedColor?: string;
  selectedSize?: string;
}

export interface SellerProfile {
  name: string;
  email: string;
  shopName: string;
  image: string; 
  description?: string; 
  rating?: number;      
  location?: string;
  // --- NEW BADGE FIELDS ---
  isMuslimOwned?: boolean;
  halalCertStatus?: 'none' | 'pending' | 'approved';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty: number, color?: string, size?: string) => void;
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

// Default Profile Data
const DEFAULT_SELLER: SellerProfile = {
    name: "Khairul Aming",
    email: "ka@sambalnyet.com",
    shopName: "Khairul Aming Official",
    image: "", 
    description: "Welcome to my official shop!",
    rating: 5.0,
    location: "Kuala Lumpur, MY",
    isMuslimOwned: true, // Defaulting to true for demo
    halalCertStatus: 'approved' // Defaulting to approved for demo
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(DEFAULT_SELLER);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LOAD DATA FROM SUPABASE ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // We still keep Cart and Profile in local storage (perfect for unlogged users)
        const savedCart = localStorage.getItem('ummart-cart');
        const savedProfile = localStorage.getItem('ummart-seller-profile');
        
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedProfile) setSellerProfile(JSON.parse(savedProfile));

        // THE MAGIC: Fetch products from Supabase Cloud!
        const loadDatabase = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching products:", error);
                return;
            }

            // If the database is completely empty, automatically seed it with our defaults!
            if (data.length === 0) {
                console.log("Database is empty! Uploading default products to the cloud...");
                
                // Remove the local IDs and fields not in our database schema
                const productsToInsert = initialProducts.map(({ id, hasVariants, isHalal, ...rest }: any) => rest);
                
                const { data: insertedData, error: insertError } = await supabase
                    .from('products')
                    .insert(productsToInsert)
                    .select();
                    
                if (insertError) {
                    console.error("Error seeding database:", insertError);
                } else if (insertedData) {
                    setAllProducts(insertedData);
                }
            } else {
                setAllProducts(data);
            }
            setIsLoaded(true);
        };

        loadDatabase();
    }
  }, []);

  // --- 2. SAVE LOCAL DATA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ummart-cart', JSON.stringify(cart));
      localStorage.setItem('ummart-seller-profile', JSON.stringify(sellerProfile));
      // NOTE: We no longer save products to localStorage! They live in the cloud now.
    }
  }, [cart, sellerProfile, isLoaded]);

  // --- ACTIONS ---
  const addToCart = (product: Product, qty: number, color?: string, size?: string) => {
    setCart((prev) => {
      const uniqueId = `${product.id}-${color || 'def'}-${size || 'def'}`;
      const existing = prev.find((item) => item.cartId === uniqueId);
      if (existing) {
        return prev.map((item) => item.cartId === uniqueId ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, cartId: uniqueId, qty, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (cartId: string) => setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  const updateQuantity = (cartId: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, qty } : item)));
  };
  const clearCart = () => setCart([]);

  // --- DATABASE WRITES ---
  const addProduct = async (newProduct: Product) => {
      // Remove temporary local ID so Supabase generates a real one
      const { id, ...productData } = newProduct;
      
      // 1. Show it instantly on screen (Optimistic UI)
      setAllProducts((prev) => [newProduct, ...prev]);

      // 2. Save it permanently to the cloud
      const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

      if (error) {
          console.error("Error saving product to Supabase:", error);
      } else if (data) {
          // Replace the temporary screen product with the real Database product
          setAllProducts((prev) => prev.map(p => p.id === newProduct.id ? data[0] : p));
      }
  };

  const deleteProduct = async (id: number) => {
      // 1. Remove from screen instantly
      setAllProducts((prev) => prev.filter(p => p.id !== id));
      
      // 2. Delete from cloud
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error("Error deleting product:", error);
  };

  const updateSellerProfile = (newDetails: Partial<SellerProfile>) => {
      setSellerProfile((prev) => {
          const updated = { ...prev, ...newDetails };
          // Note: In a full app, we would update the product seller names in the DB here too!
          return updated;
      });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, 
        allProducts, addProduct, deleteProduct,
        sellerProfile, updateSellerProfile 
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
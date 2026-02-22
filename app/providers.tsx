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
    isMuslimOwned: true,
    halalCertStatus: 'approved'
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(DEFAULT_SELLER);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LOAD DATA FROM SUPABASE ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('ummart-cart');
        const savedProfile = localStorage.getItem('ummart-seller-profile');
        
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedProfile) setSellerProfile(JSON.parse(savedProfile));

        const loadDatabase = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching products:", error);
                return;
            }

            if (data.length === 0) {
                console.log("Database is empty! Uploading default products to the cloud...");
                
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
      const { id, ...productData } = newProduct;
      
      setAllProducts((prev) => [newProduct, ...prev]);

      const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

      if (error) {
          console.error("Error saving product to Supabase:", error);
      } else if (data) {
          setAllProducts((prev) => prev.map(p => p.id === newProduct.id ? data[0] : p));
      }
  };

  const deleteProduct = async (id: number) => {
      setAllProducts((prev) => prev.filter(p => p.id !== id));
      
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error("Error deleting product:", error);
  };

  // --- UPDATE SELLER PROFILE & SYNC PRODUCTS ---
  const updateSellerProfile = async (newDetails: Partial<SellerProfile>) => {
      const oldShopName = sellerProfile.shopName;
      const newShopName = newDetails.shopName;

      // Update the profile state instantly
      setSellerProfile((prev) => ({ ...prev, ...newDetails }));

      // If the shop name changed, update the products in the database so they don't go missing!
      if (newShopName && newShopName !== oldShopName) {
          
          // Instantly update products on the screen
          setAllProducts((prev) => 
              prev.map(p => p.seller === oldShopName ? { ...p, seller: newShopName } : p)
          );

          // Update the real database (Supabase) in the background
          const { error } = await supabase
              .from('products')
              .update({ seller: newShopName })
              .eq('seller', oldShopName);

          if (error) {
              console.error("Error updating product seller names in Supabase:", error);
          }
      }
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
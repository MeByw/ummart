'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from './products'; 

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
    location: "Kuala Lumpur, MY"
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(DEFAULT_SELLER);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('ummart-cart');
        const savedProducts = localStorage.getItem('ummart-products');
        const savedProfile = localStorage.getItem('ummart-seller-profile');
        
        if (savedCart) setCart(JSON.parse(savedCart));
        
        let currentProfile = DEFAULT_SELLER;
        if (savedProfile) {
            currentProfile = JSON.parse(savedProfile);
            setSellerProfile(currentProfile);
        } else {
             setSellerProfile(DEFAULT_SELLER);
        }

        let loadedProducts: Product[] = [];
        if (savedProducts) {
            loadedProducts = JSON.parse(savedProducts);
        }

        // THE FIX: If storage crashed or has fewer items than our defaults, force a reset.
        // Also, force ALL default products to match currentProfile.shopName so the dashboard doesn't hide them!
        if (loadedProducts.length >= (initialProducts?.length || 7)) {
            setAllProducts(loadedProducts);
        } else {
            const seeded = (initialProducts || []).map(p => ({ 
                ...p, 
                seller: currentProfile.shopName 
            }));
            setAllProducts(seeded);
            // Instantly save the fixed products to storage
            localStorage.setItem('ummart-products', JSON.stringify(seeded));
        }
        
        setIsLoaded(true);
    }
  }, []);

  // --- 2. SAVE DATA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ummart-cart', JSON.stringify(cart));
      localStorage.setItem('ummart-products', JSON.stringify(allProducts));
      localStorage.setItem('ummart-seller-profile', JSON.stringify(sellerProfile));
    }
  }, [cart, allProducts, sellerProfile, isLoaded]);

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

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, qty } : item)));
  };

  const clearCart = () => setCart([]);

  const addProduct = (newProduct: Product) => {
      setAllProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (id: number) => {
      setAllProducts((prev) => prev.filter(p => p.id !== id));
  };

  const updateSellerProfile = (newDetails: Partial<SellerProfile>) => {
      setSellerProfile((prev) => {
          const updated = { ...prev, ...newDetails };
          const oldName = prev.shopName || prev.name;
          const newName = updated.shopName || updated.name;

          if (oldName !== newName) {
             setTimeout(() => {
                 setAllProducts(currentProducts => 
                   currentProducts.map(p => 
                     (p.seller === oldName || p.seller === prev.name) ? { ...p, seller: newName } : p
                   )
                 );
             }, 0);
          }
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
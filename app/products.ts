export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  seller: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  hasVariants?: boolean;
  colors?: string[];
  sizes?: string[];
  isHalal?: boolean;
  colorImages?: Record<string, string>; 
}

export const products: Product[] = [
  { 
    id: 1, 
    name: "Sambal Nyet Berapi (Original)", 
    price: 13.99, 
    category: "Food", 
    seller: "Khairul Aming", 
    rating: 5.0, 
    reviews: 15400, 
    image: "/sambal.jpg", 
    description: "The viral spicy sambal. A must-have for every meal. 100% Fresh Chilies.", 
    hasVariants: false,
    isHalal: true
  },
  { 
    id: 2, 
    name: "Naelofar Premium Printed Hijab", 
    price: 89.00, 
    category: "Fashion", 
    seller: "Naelofar", 
    rating: 4.9, 
    reviews: 3200, 
    image: "/hijab-black.jpg", 
    description: "Elegant premium hijab with a non-slip finish. Breathable and easy to style.",
    hasVariants: true,
    colors: ["Black", "Cream", "Brown", "Purple", "Beige"],
    sizes: ["Free Size"],
    colorImages: {
        "Black": "/hijab-black.jpg",
        "Cream": "/hijab-cream.jpg",
        "Brown": "/hijab-brown.jpg",
        "Purple": "/hijab-purple.jpg",
        "Beige": "/hijab-beige.jpg"
    }
  },
  { 
    id: 3, 
    name: "Baju Melayu Slim Fit (Cekak Musang)", 
    price: 189.00, 
    category: "Men's Fashion", 
    seller: "Bulan Bintang", 
    rating: 4.8, 
    reviews: 2500, 
    image: "/baju-black.jpg", 
    description: "Premium quality Baju Melayu with sleek cutting and comfortable fabric.",
    hasVariants: true,
    colors: ["Baby Blue", "Mint Green", "Black", "Maroon"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colorImages: {
        "Baby Blue": "/baju-babyblue.jpg",
        "Mint Green": "/baju-mintgreen.jpg",
        "Black": "/baju-black.jpg",
        "Maroon": "/baju-maroon.jpg"
    }
  },
  { 
    id: 4, 
    name: "Telekung Siti Khadijah (Signature)", 
    price: 145.00, 
    category: "Prayer", 
    seller: "Siti Khadijah", 
    rating: 4.9, 
    reviews: 5800, 
    image: "/telekung-black.jpg", 
    description: "Cooling cotton material, perfect for daily prayers.",
    hasVariants: true,
    colors: ["Black", "Green Powder", "Ash Mocha", "Fig"],
    sizes: ["Standard"],
    colorImages: {
        "Black": "/telekung-black.jpg",
        "Green Powder": "/telekung-greenpowder.jpg",
        "Ash Mocha": "/telekung-ashmocha.jpg",
        "Fig": "/telekung-fig.jpg"
    }
  },
  {
    id: 5,
    name: "Kurma Ajwa Al-Madinah (500g)",
    price: 35.00,
    category: "Food",
    seller: "Yusuf Taiyoob",
    rating: 4.7,
    reviews: 1200,
    image: "/kurma-ajwa.jpg",
    description: "Premium dates from Madinah. Soft and sweet.",
    hasVariants: false,
    isHalal: true
  },
  {
    id: 6,
    name: "Minyak Masak Saji (5kg)",
    price: 32.50,
    category: "Groceries",
    seller: "FGV",
    rating: 4.8,
    reviews: 8900,
    image: "/minyak-saji.jpg",
    description: "High quality cooking oil for all your frying needs.",
    hasVariants: false,
    isHalal: true
  },
  {
    id: 7,
    name: "Sejadah King Size (Thick)",
    price: 45.00,
    category: "Prayer", 
    seller: "Iman Shoppe",
    rating: 4.6,
    reviews: 450,
    image: "/sejadah-green.jpg",
    description: "Extra thick memory foam sejadah for knee comfort.",
    hasVariants: true,
    colors: ["Green", "Red", "Blue"],
    sizes: ["King Size"],
    colorImages: {
        "Green": "/sejadah-green.jpg",
        "Red": "/sejadah-red.jpg",
        "Blue": "/sejadah-blue.jpg"
    }
  }
];
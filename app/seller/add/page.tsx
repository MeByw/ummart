'use client';

import React, { useState, useRef } from 'react';
import { useCart } from '../../providers'; 
import { ArrowLeft, Upload, X, Image as ImageIcon, Save, DollarSign, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. ADD THIS: The exact categories used on your Homepage
const UMMART_CATEGORIES = [
    'Runcit Halal',
    'Fesyen Muslimah',
    'Elektronik & Gajet',
    'Kesihatan & Kecantikan',
    'Rumah & Kehidupan',
    'Buku & Alat Tulis',
    'Hadiah & Cenderahati'
];

export default function AddProductPage() {
    const { addProduct, sellerProfile } = useCart();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: UMMART_CATEGORIES[0], // 2. UPDATE THIS: Default to the first Malay category
        description: '',
        image: ''
    });

    // --- VARIANTS STATE ---
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [colorImages, setColorImages] = useState<Record<string, string>>({});

    // Temporary inputs for adding variants
    const [tempColor, setTempColor] = useState('');
    const [tempSize, setTempSize] = useState('');
    
    // --- HELPER: COMPRESS IMAGE ---
    // Shrinks the image to a max width of 600px and reduces quality to 60%
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 600; // Max width to save space
                    const scaleSize = maxWidth / img.width;
                    
                    // Only scale down if the image is wider than maxWidth
                    if (img.width > maxWidth) {
                        canvas.width = maxWidth;
                        canvas.height = img.height * scaleSize;
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }
                    
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Convert to JPEG with 60% quality (drastically reduces file size)
                    resolve(canvas.toDataURL('image/jpeg', 0.6)); 
                };
            };
        });
    };

    // --- HANDLERS ---

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 1. MAIN IMAGE UPLOAD (COMPRESSED)
    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const compressedBase64 = await compressImage(file);
            setFormData(prev => ({ ...prev, image: compressedBase64 }));
        }
    };

    // 2. ADD COLOR VARIANT
    const addColor = () => {
        if (tempColor && !colors.includes(tempColor)) {
            const newColor = tempColor.trim();
            setColors([...colors, newColor]);
            setTempColor('');
        }
    };

    const removeColor = (colorToRemove: string) => {
        setColors(colors.filter(c => c !== colorToRemove));
        // Also remove the associated image if exists
        const newImages = { ...colorImages };
        delete newImages[colorToRemove];
        setColorImages(newImages);
    };

    // 3. UPLOAD IMAGE FOR SPECIFIC COLOR (COMPRESSED)
    const handleColorImageUpload = async (color: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const compressedBase64 = await compressImage(file);
            setColorImages(prev => ({ ...prev, [color]: compressedBase64 }));
        }
    };

    // 4. ADD SIZE VARIANT
    const addSize = () => {
        if (tempSize && !sizes.includes(tempSize)) {
            const newSize = tempSize.trim();
            setSizes([...sizes, newSize]);
            setTempSize('');
        }
    };

    // 5. SUBMIT FORM
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked!"); // For debugging in your browser console

        try {
            // Basic Validation
            if (!formData.name || !formData.price || !formData.image) {
                alert("Please fill in the product name, price, and upload a main image.");
                return;
            }

            // Safely create the product (added ? marks to prevent crashes if profile is missing)
            const newProduct = {
                id: Date.now(), 
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                description: formData.description,
                image: formData.image,
                seller: sellerProfile?.shopName || sellerProfile?.name || "Ummart Seller", // Safely linked
                rating: 0,
                reviews: 0,
                sold: 0,
                colors: colors.length > 0 ? colors : undefined,
                sizes: sizes.length > 0 ? sizes : undefined,
                colorImages: Object.keys(colorImages).length > 0 ? colorImages : undefined
            };

            console.log("Saving product:", newProduct); // Log what is being saved
            
            addProduct(newProduct);
        alert("Product Added Successfully!");
        
        // CLIENT-SIDE REDIRECT: Changes page smoothly WITHOUT wiping React's memory
        router.push('/seller');

        } catch (error) {
            console.error("Crash during submit:", error);
            alert("Something went wrong! Check the browser console (Right Click -> Inspect -> Console).");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/seller" className="p-2 bg-white rounded-full border hover:bg-gray-100 transition text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
                    <p className="text-gray-500 text-sm">Fill in the details below to list your item.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
                
                {/* SECTION 1: BASIC INFO & IMAGES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* LEFT: IMAGE UPLOADER */}
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Image</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden bg-white
                            ${formData.image ? 'border-[#006837]' : 'border-gray-300 hover:border-[#006837] hover:bg-green-50'}`}
                        >
                            {formData.image ? (
                                <img src={formData.image} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-green-100 text-[#006837] rounded-full flex items-center justify-center mb-3">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-600">Upload Cover</p>
                                    <p className="text-xs text-gray-400 mt-1">Click to browse</p>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} accept="image/*" className="hidden" />
                        </div>
                    </div>

                    {/* RIGHT: BASIC FIELDS */}
                    <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                            <input 
                                name="name" type="text" placeholder="e.g. Sambal Nyet Berapi" required
                                value={formData.name} onChange={handleTextChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] outline-none font-medium transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (RM)</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                    <input 
                                        name="price" type="number" step="0.01" placeholder="0.00" required
                                        value={formData.price} onChange={handleTextChange}
                                        className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] outline-none font-medium transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                <div className="relative">
                                    <Layers size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                    
                                    {/* 3. UPDATE THIS: Now maps the actual UMMART_CATEGORIES */}
                                    <select 
                                        name="category" value={formData.category} onChange={handleTextChange}
                                        className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] outline-none font-medium transition appearance-none"
                                    >
                                        {UMMART_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>

                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <textarea 
                                name="description" rows={4} placeholder="Describe your product..."
                                value={formData.description} onChange={handleTextChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006837] outline-none resize-none transition"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: VARIANTS (COLORS & SIZES) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-8">
                    
                    {/* A. COLORS */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                            Color Variants
                        </h3>
                        
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" placeholder="Add a color (e.g. Red, Blue)" 
                                value={tempColor} onChange={(e) => setTempColor(e.target.value)}
                                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                            />
                            <button type="button" onClick={addColor} className="px-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">Add</button>
                        </div>

                        {/* List of added colors */}
                        <div className="space-y-3">
                            {colors.map(color => (
                                <div key={color} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        {/* Mini Image Uploader for this Color */}
                                        <label className="w-10 h-10 rounded-lg border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white hover:border-blue-500 transition overflow-hidden bg-gray-100 relative group">
                                            {colorImages[color] ? (
                                                <img src={colorImages[color]} className="w-full h-full object-cover"/>
                                            ) : (
                                                <ImageIcon size={16} className="text-gray-400 group-hover:text-blue-500"/>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleColorImageUpload(color, e)} />
                                        </label>
                                        
                                        <div>
                                            <p className="font-bold text-gray-700">{color}</p>
                                            <p className="text-[10px] text-gray-400">
                                                {colorImages[color] ? 'Image uploaded' : 'Click box to add image'}
                                            </p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeColor(color)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><X size={18}/></button>
                                </div>
                            ))}
                            {colors.length === 0 && <p className="text-sm text-gray-400 italic">No colors added yet.</p>}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* B. SIZES */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
                            Size Variants
                        </h3>
                        
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" placeholder="Add a size (e.g. S, M, XL)" 
                                value={tempSize} onChange={(e) => setTempSize(e.target.value)}
                                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                            />
                            <button type="button" onClick={addSize} className="px-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">Add</button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sizes.map(size => (
                                <div key={size} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <span className="font-bold text-gray-700">{size}</span>
                                    <button type="button" onClick={() => setSizes(sizes.filter(s => s !== size))} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                                </div>
                            ))}
                            {sizes.length === 0 && <p className="text-sm text-gray-400 italic">No sizes added yet.</p>}
                        </div>
                    </div>

                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        className="bg-[#006837] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#00552b] transition flex items-center gap-2 active:scale-[0.98]"
                    >
                        <Save size={20} /> Publish Product
                    </button>
                </div>

            </form>
        </div>
    );
}
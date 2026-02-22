'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCart } from '../../providers';
import { ArrowLeft, CheckCircle, FileText, Upload, ShieldCheck, Building2, AlertCircle, Loader2 } from 'lucide-react';

export default function HalalApplicationPage() {
  const { sellerProfile } = useCart();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form text data
  const [formData, setFormData] = useState({
    companyName: '',
    ssmNumber: '',
    category: 'Makanan & Minuman (Premis)',
  });

  // --- FILE STATES ---
  const [ssmFile, setSsmFile] = useState<File | null>(null);
  const [ingredientsFile, setIngredientsFile] = useState<File | null>(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // --- SUBMIT AND UPLOAD LOGIC ---
  const submitApplication = async () => {
    // Make sure they uploaded both files before submitting!
    if (!ssmFile || !ingredientsFile) {
      setErrorMsg('Sila muat naik Sijil SSM dan Senarai Ramuan sebelum meneruskan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let ssmUrl = '';
      let ingredientsUrl = '';

      // 1. Upload SSM File to Supabase Storage
      if (ssmFile) {
        const fileExt = ssmFile.name.split('.').pop();
        const fileName = `${Date.now()}_ssm_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('halal_application') // UPDATED BUCKET NAME
          .upload(fileName, ssmFile);

        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage.from('halal_application').getPublicUrl(fileName); // UPDATED BUCKET NAME
        ssmUrl = publicUrlData.publicUrl;
      }

      // 2. Upload Ingredients File to Supabase Storage
      if (ingredientsFile) {
        const fileExt = ingredientsFile.name.split('.').pop();
        const fileName = `${Date.now()}_ingredients_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('halal_application') // UPDATED BUCKET NAME
          .upload(fileName, ingredientsFile);

        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage.from('halal_application').getPublicUrl(fileName); // UPDATED BUCKET NAME
        ingredientsUrl = publicUrlData.publicUrl;
      }

      // 3. Save everything (with real file URLs) into the database!
      const newApplication = {
        seller_id: sellerProfile?.shopName || 'Unknown Seller',
        company_name: formData.companyName,
        ssm_number: formData.ssmNumber,
        category: formData.category,
        status: 'Pending Review',
        documents_url: { 
          ssm: ssmUrl, 
          ingredients: ingredientsUrl 
        }
      };

      const { error: dbError } = await supabase
        .from('halal_applications')
        .insert([newApplication]);

      if (dbError) throw dbError;

      // Success! Move to the final step
      setStep(3);
    } catch (err: any) {
      // JSON.stringify forces the hidden Supabase error to reveal itself!
      console.error("Error submitting halal app:", JSON.stringify(err, null, 2));
      setErrorMsg(err.message || 'Gagal menghantar permohonan. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans selection:bg-[#0F6937] selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm border border-gray-200 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-[#0F6937]" size={32} />
              Permohonan Halal JAKIM
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Sistem Pra-Kelayakan UMMart untuk Peniaga</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0F6937] rounded-full z-0 transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

            {[
              { num: 1, label: "Maklumat Syarikat" },
              { num: 2, label: "Muat Naik Dokumen" },
              { num: 3, label: "Semakan" }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${step >= s.num ? 'bg-[#0F6937] border-green-100 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
                  {step > s.num ? <CheckCircle size={20} /> : s.num}
                </div>
                <span className={`text-xs font-bold ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Building2 className="text-[#0F6937]" size={20} /> Langkah 1: Profil Perniagaan
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Syarikat (Seperti dalam SSM) *</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Cth: UMMart Enterprise" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0F6937] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombor Pendaftaran SSM *</label>
                  <input 
                    type="text" 
                    value={formData.ssmNumber}
                    onChange={(e) => setFormData({...formData, ssmNumber: e.target.value})}
                    placeholder="Cth: 202301234567" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0F6937] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori Industri *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0F6937] transition"
                  >
                    <option>Makanan & Minuman (Premis)</option>
                    <option>Produk Pengguna (Kosmetik/Kesihatan)</option>
                    <option>Rumah Sembelihan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleNext} 
                  disabled={!formData.companyName || !formData.ssmNumber}
                  className="bg-[#0F6937] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#0A4A27] transition shadow-lg shadow-green-900/20 disabled:opacity-50"
                >
                  Seterusnya
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <FileText className="text-[#0F6937]" size={20} /> Langkah 2: Muat Naik Dokumen Utama
              </h2>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-800 font-medium">Sila pastikan dokumen jelas dan dalam format PDF atau imej (JPG/PNG). Pasukan kami akan menyemak dokumen ini sebelum dihantar ke JAKIM.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SSM FILE UPLOAD */}
                <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${ssmFile ? 'border-[#0F6937] bg-green-50' : 'border-gray-300 hover:border-[#0F6937] hover:bg-gray-50'}`}>
                  {ssmFile ? <FileText className="text-[#0F6937] mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className={`font-bold text-sm ${ssmFile ? 'text-[#0F6937]' : 'text-gray-700'}`}>
                    {ssmFile ? ssmFile.name : 'Sijil SSM'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{ssmFile ? 'Klik untuk tukar fail' : 'Klik untuk muat naik (PDF/Imej)'}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,image/*" 
                    onChange={(e) => setSsmFile(e.target.files?.[0] || null)} 
                  />
                </label>

                {/* INGREDIENTS FILE UPLOAD */}
                <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${ingredientsFile ? 'border-[#0F6937] bg-green-50' : 'border-gray-300 hover:border-[#0F6937] hover:bg-gray-50'}`}>
                  {ingredientsFile ? <FileText className="text-[#0F6937] mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className={`font-bold text-sm ${ingredientsFile ? 'text-[#0F6937]' : 'text-gray-700'}`}>
                    {ingredientsFile ? ingredientsFile.name : 'Senarai Ramuan/Bahan'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{ingredientsFile ? 'Klik untuk tukar fail' : 'Sertakan Sijil Halal Pembekal'}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,image/*" 
                    onChange={(e) => setIngredientsFile(e.target.files?.[0] || null)} 
                  />
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 mt-6">
                <button onClick={handleBack} className="text-gray-500 font-bold px-6 py-3 hover:bg-gray-50 rounded-xl transition" disabled={isSubmitting}>Kembali</button>
                <button 
                  onClick={submitApplication} 
                  disabled={isSubmitting}
                  className="bg-[#0F6937] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#0A4A27] transition shadow-lg shadow-green-900/20 flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin"/> Sedang Memuat Naik...</> : 'Hantar untuk Semakan'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-[#0F6937] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Dokumen Berjaya Diterima!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed text-sm md:text-base">
                Pasukan pematuhan Halal UMMart akan menyemak dokumen anda dalam masa 3-5 hari bekerja. Kami akan menghubungi anda jika terdapat dokumen yang perlu diperbaiki sebelum didaftarkan ke MYeHALAL.
              </p>
              <Link href="/seller" className="inline-flex items-center justify-center bg-[#0F6937] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#0A4A27] transition-all">
                Kembali ke Dashboard
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
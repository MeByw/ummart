'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Calculator, Info, DollarSign, Coins, Briefcase, 
  Building2, Wallet, MapPin, ChevronDown, CheckCircle, 
  Users, Heart, GraduationCap, Stethoscope, ArrowRight,
  Baby, AlertCircle, AlertTriangle, FileText, Calendar
} from 'lucide-react';

// --- CONSTANTS & RATES (Estimates 2025/2026) ---
const ZAKAT_CENTRES = {
  'wilayah': { name: 'PPZ - MAIWP (KL/Putrajaya)', url: 'https://www.zakat.com.my/bayar-zakat/', nisab: 24305, uruf: 800 },
  'selangor': { name: 'Lembaga Zakat Selangor', url: 'https://fpx.zakatselangor.com.my/', nisab: 24305, uruf: 800 },
  'johor': { name: 'MAINJ (Johor)', url: 'https://epayment.maij.gov.my/', nisab: 23000, uruf: 850 },
  'melaka': { name: 'Zakat Melaka', url: 'https://www.izakat.com/', nisab: 23000, uruf: 180 },
  'negeri_sembilan': { name: 'PZNS (N. Sembilan)', url: 'https://www.zakatns.com.my/', nisab: 23000, uruf: 200 },
  'pahang': { name: 'Zakat Pahang', url: 'https://ezakat.zakatpahang.my/', nisab: 23000, uruf: 500 },
  'perak': { name: 'MAIPk (Perak)', url: 'https://ezakat.maiamp.gov.my/', nisab: 23000, uruf: 500 },
  'kedah': { name: 'LZNK (Kedah)', url: 'https://jom.zakatkedah.com.my/', nisab: 23500, uruf: 170 },
  'pulau_pinang': { name: 'Zakat Pulau Pinang', url: 'https://zakatpenang2u.com/', nisab: 24000, uruf: 165 },
  'perlis': { name: 'MAIPs (Perlis)', url: 'https://www.maips.gov.my/', nisab: 22000, uruf: 850 },
  'terengganu': { name: 'MAIDAM (Terengganu)', url: 'https://ezakat.maidam.gov.my/', nisab: 22500, uruf: 850 },
  'kelantan': { name: 'MAIK (Kelantan)', url: 'https://zakat.e-maik.my/', nisab: 22000, uruf: 0 }, 
  'sabah': { name: 'Bahagian Zakat MUIS', url: 'https://appszakat.sabah.gov.my/', nisab: 21000, uruf: 152 },
  'sarawak': { name: 'Tabung Baitulmal Sarawak', url: 'https://pelanggan.tbs.org.my/', nisab: 21000, uruf: 90 },
};

const HK_RATES = {
  SELF: 12000,
  WIFE: 5000,
  CHILD_UNI: 7000,
  CHILD_SCHOOL: 5000,
  CHILD_SMALL: 3000,
};

type StateKey = keyof typeof ZAKAT_CENTRES;

export default function ZakatPage() {
  const [activeTab, setActiveTab] = useState('pendapatan');
  const [selectedState, setSelectedState] = useState<StateKey>('wilayah');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' }));
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [inputs, setInputs] = useState({
    gajiTahunan: 0,
    elaun: 0,
    lainLain: 0, 
    status: 'bujang' as 'bujang' | 'berkahwin', 
    wivesCount: 0,
    childUni: 0,
    childSchool: 0,
    childSmall: 0,
    parentsContribution: 0,
    kwsp: 0,
    medication: 0,
    educationOwn: 0,
    savingsBalance: 0,
    savingsInterest: 0,
    goldWearable: 0,
    goldInvest: 0,
    assets: 0,
    liabilities: 0,
    equityShare: 100,
    kwspWithdrawal: 0,
  });

  const [calcResult, setCalcResult] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    zakatableAmount: 0,
    zakatDue: 0,
  });

  const STATE_DATA = ZAKAT_CENTRES[selectedState];
  const NISAB = STATE_DATA.nisab;
  const URUF = STATE_DATA.uruf;
  const GOLD_PRICE = 380; 

  const handleStatusChange = (newStatus: 'bujang' | 'berkahwin') => {
    if (newStatus === 'bujang') {
        setInputs(prev => ({
            ...prev,
            status: 'bujang',
            wivesCount: 0,
            childUni: 0,
            childSchool: 0,
            childSmall: 0
        }));
    } else {
        setInputs(prev => ({ ...prev, status: 'berkahwin' }));
    }
  };

  useEffect(() => {
    let totalIncome = 0;
    let totalDeduction = 0;
    let zakatableAmount = 0;
    let zakatDue = 0;

    switch (activeTab) {
      case 'pendapatan':
        totalIncome = inputs.gajiTahunan + inputs.elaun + inputs.lainLain;
        totalDeduction += HK_RATES.SELF; 
        if (inputs.status === 'berkahwin') {
            totalDeduction += (inputs.wivesCount * HK_RATES.WIFE);
            totalDeduction += (inputs.childUni * HK_RATES.CHILD_UNI);
            totalDeduction += (inputs.childSchool * HK_RATES.CHILD_SCHOOL);
            totalDeduction += (inputs.childSmall * HK_RATES.CHILD_SMALL);
        }
        totalDeduction += inputs.parentsContribution;
        totalDeduction += inputs.kwsp;
        totalDeduction += inputs.medication;
        totalDeduction += inputs.educationOwn;
        
        zakatableAmount = totalIncome - totalDeduction;
        if (totalIncome > NISAB && zakatableAmount > 0) {
            zakatDue = zakatableAmount * 0.025;
        }
        break;

      case 'simpanan':
        totalIncome = inputs.savingsBalance; 
        const halalBalance = inputs.savingsBalance - inputs.savingsInterest;
        if (halalBalance >= NISAB) {
            zakatableAmount = halalBalance;
            zakatDue = halalBalance * 0.025;
        }
        break;

      case 'emas':
        const taxableWearable = inputs.goldWearable > URUF ? (inputs.goldWearable - URUF) : 0;
        const totalGoldHeld = inputs.goldWearable + inputs.goldInvest;
        if (totalGoldHeld >= 85) {
            const valueWearable = taxableWearable * GOLD_PRICE;
            const valueInvest = inputs.goldInvest * GOLD_PRICE;
            zakatableAmount = valueWearable + valueInvest;
            zakatDue = zakatableAmount * 0.025;
        }
        break;

      case 'perniagaan':
        const netAssets = inputs.assets - inputs.liabilities;
        const muslimPortion = netAssets * (inputs.equityShare / 100);
        if (muslimPortion >= NISAB) {
            zakatableAmount = muslimPortion;
            zakatDue = muslimPortion * 0.025;
        }
        break;
        
      case 'kwsp':
        if (inputs.kwspWithdrawal > 0) {
            zakatableAmount = inputs.kwspWithdrawal;
            zakatDue = inputs.kwspWithdrawal * 0.025;
        }
        break;
    }

    setCalcResult({
        totalIncome,
        totalDeduction,
        zakatableAmount: zakatableAmount < 0 ? 0 : zakatableAmount,
        zakatDue: zakatDue < 0 ? 0 : zakatDue,
    });
  }, [inputs, activeTab, selectedState, NISAB, URUF, GOLD_PRICE]);

  const handleInput = (field: string, val: number) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
                <h1 className="text-2xl font-bold text-[#0F6937] flex items-center gap-2">
                    <Calculator className="text-[#D4AF37]" strokeWidth={2.5} /> 
                    Kalkulator Zakat Komprehensif
                </h1>
                <p className="text-xs text-gray-400 mt-1 ml-9">Dikemaskini: {currentDate}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pusat Pungutan</p>
                    <p className="text-sm font-bold text-gray-800">{STATE_DATA.name}</p>
                </div>
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all border ${
                            isDropdownOpen 
                            ? 'bg-green-50 border-[#0F6937] text-[#0F6937]' 
                            : 'bg-gray-100 border-transparent hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        <MapPin size={16} className="text-[#0F6937]" />
                        <span className="truncate max-w-[150px]">{selectedState.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                            <div className="p-2 bg-gray-50 border-b border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase px-2">Pilih Pusat Zakat</p>
                            </div>
                            {Object.entries(ZAKAT_CENTRES).map(([key, data]) => (
                                <button 
                                    key={key}
                                    onClick={() => {
                                        setSelectedState(key as StateKey);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors ${
                                        selectedState === key 
                                        ? 'bg-green-50 text-[#0F6937] font-bold' 
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <span className="font-bold block text-[10px] uppercase text-gray-400 mb-0.5">{key.replace('_', ' ')}</span>
                                    {data.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'pendapatan', icon: <Briefcase size={16}/>, label: 'Pendapatan' },
                        { id: 'simpanan', icon: <DollarSign size={16}/>, label: 'Wang Simpanan' },
                        { id: 'emas', icon: <Coins size={16}/>, label: 'Emas & Perak' },
                        { id: 'perniagaan', icon: <Building2 size={16}/>, label: 'Perniagaan' },
                        { id: 'kwsp', icon: <Wallet size={16}/>, label: 'KWSP' },
                    ].map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => { setActiveTab(t.id); }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all border ${
                                activeTab === t.id 
                                ? 'bg-[#0F6937] text-white border-[#0F6937] shadow-lg shadow-green-900/10' 
                                : 'bg-white text-gray-500 border-gray-200 hover:border-[#0F6937] hover:text-[#0F6937]'
                            }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
                    {activeTab === 'pendapatan' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                            <section>
                                <h3 className="text-sm font-bold text-[#0F6937] uppercase mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">1</span>
                                    Sumber Pendapatan (Setahun)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input currency label="Gaji Dasar Tahunan" value={inputs.gajiTahunan} onChange={(v) => handleInput('gajiTahunan', v)} />
                                    <Input currency label="Elaun / Bonus / Gratuiti" value={inputs.elaun} onChange={(v) => handleInput('elaun', v)} />
                                    <Input currency label="Lain-lain (Sewa/Freelance)" value={inputs.lainLain} onChange={(v) => handleInput('lainLain', v)} />
                                </div>
                            </section>
                            <hr className="border-gray-100" />
                            <section>
                                <h3 className="text-sm font-bold text-[#0F6937] uppercase mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">2</span>
                                    Tolakan & Hadal Kifayah
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Status Perkahwinan</label>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleStatusChange('bujang')} 
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                                    inputs.status === 'bujang' 
                                                    ? 'bg-white shadow-sm border border-gray-200 text-[#0F6937]' 
                                                    : 'text-gray-400 hover:bg-white/50'
                                                }`}
                                            >
                                                <Users size={16} /> Bujang
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange('berkahwin')} 
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                                    inputs.status === 'berkahwin' 
                                                    ? 'bg-white shadow-sm border border-gray-200 text-[#0F6937]' 
                                                    : 'text-gray-400 hover:bg-white/50'
                                                }`}
                                            >
                                                <Heart size={16} /> Berkahwin
                                            </button>
                                        </div>
                                    </div>

                                    {inputs.status === 'berkahwin' ? (
                                        <div className="bg-green-50/50 p-5 rounded-xl border border-green-100 space-y-4 animate-in fade-in slide-in-from-top-1">
                                            <h4 className="text-xs font-bold text-green-800 uppercase flex items-center gap-2">
                                                <Baby size={14} /> Tanggungan Keluarga
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <Input label="Bilangan Isteri" value={inputs.wivesCount} onChange={(v) => handleInput('wivesCount', v)} />
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <Input label="Anak IPT/Universiti" hint="> 18 Tahun" value={inputs.childUni} onChange={(v) => handleInput('childUni', v)} icon={<GraduationCap size={16}/>} />
                                                <Input label="Anak Sekolah" hint="7 - 17 Tahun" value={inputs.childSchool} onChange={(v) => handleInput('childSchool', v)} />
                                                <Input label="Anak Kecil" hint="< 7 Tahun" value={inputs.childSmall} onChange={(v) => handleInput('childSmall', v)} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                                            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                                                <Info size={14}/> Individu bujang hanya layak menuntut tolakan diri sendiri & ibu bapa.
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                                        <Input currency label="Pemberian Ibu Bapa (Setahun)" value={inputs.parentsContribution} onChange={(v) => handleInput('parentsContribution', v)} icon={<Heart size={16}/>} />
                                        <Input currency label="Caruman KWSP (Pekerja)" value={inputs.kwsp} onChange={(v) => handleInput('kwsp', v)} />
                                        <Input currency label="Kos Perubatan Kronik" value={inputs.medication} onChange={(v) => handleInput('medication', v)} icon={<Stethoscope size={16}/>} />
                                        <Input currency label="Kos Pendidikan Sendiri" value={inputs.educationOwn} onChange={(v) => handleInput('educationOwn', v)} />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'emas' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-4">
                                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg h-fit"><Info size={20}/></div>
                                <div className="text-xs text-yellow-800 space-y-1">
                                    <p><strong>Uruf Emas {STATE_DATA.name}: {URUF} gram.</strong></p>
                                    <p>Emas Pakai hanya dikenakan zakat jika berat melebihi Uruf. Emas Simpanan dikira sepenuhnya jika jumlah semua emas &gt; 85g.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Coins className="text-yellow-600"/> Emas Perhiasan (Dipakai)</h4>
                                    <Input label="Berat (Gram)" value={inputs.goldWearable} onChange={(v) => handleInput('goldWearable', v)} />
                                </div>
                                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase className="text-yellow-600"/> Emas Simpanan (Pelaburan)</h4>
                                    <Input label="Berat (Gram)" value={inputs.goldInvest} onChange={(v) => handleInput('goldInvest', v)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'simpanan' && (
                         <div className="space-y-6 max-w-lg">
                            <Input currency label="Baki Terendah Dalam Tempoh Setahun" value={inputs.savingsBalance} onChange={(v) => handleInput('savingsBalance', v)} />
                            <Input currency label="Tolak: Faedah Bank (Riba/Konvensional)" value={inputs.savingsInterest} onChange={(v) => handleInput('savingsInterest', v)} />
                         </div>
                    )}
                    
                    {activeTab === 'perniagaan' && (
                        <div className="space-y-4 max-w-lg">
                            <Input currency label="Aset Semasa" value={inputs.assets} onChange={(v) => handleInput('assets', v)} />
                            <Input currency label="Liabiliti Semasa" value={inputs.liabilities} onChange={(v) => handleInput('liabilities', v)} />
                            <Input label="Peratusan Pegangan Muslim (%)" value={inputs.equityShare} onChange={(v) => handleInput('equityShare', v)} max={100} />
                        </div>
                    )}

                    {activeTab === 'kwsp' && (
                        <div className="space-y-4 max-w-lg">
                            <Input currency label="Jumlah Pengeluaran KWSP" value={inputs.kwspWithdrawal} onChange={(v) => handleInput('kwspWithdrawal', v)} />
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
                        <div className="bg-[#0F6937] p-6 text-white text-center">
                            <h2 className="font-bold text-lg uppercase tracking-wide">Rumusan Taksiran</h2>
                            <p className="text-green-200 text-xs mt-1">{STATE_DATA.name}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Jumlah Pendapatan/Harta</span>
                                <span className="font-bold">RM {calcResult.totalIncome.toLocaleString()}</span>
                            </div>
                            {calcResult.totalDeduction > 0 && (
                                <div className="flex justify-between text-sm text-red-500">
                                    <span>Tolak: Hadal Kifayah</span>
                                    <span className="font-bold">- RM {calcResult.totalDeduction.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="h-px bg-gray-100 my-2"></div>
                            <div className="flex justify-between text-sm font-bold text-gray-800">
                                <span>Jumlah Layak Zakat</span>
                                <span>RM {calcResult.zakatableAmount.toLocaleString()}</span>
                            </div>
                            <div className={`mt-4 p-3 rounded-lg text-center text-xs font-bold flex flex-col items-center justify-center gap-1 ${calcResult.zakatableAmount > 0 && (activeTab !== 'pendapatan' || calcResult.totalIncome > NISAB) ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {calcResult.zakatableAmount > 0 ? (
                                    <>
                                        <div className="flex items-center gap-1">
                                            {activeTab === 'pendapatan' && calcResult.totalIncome <= NISAB ? (
                                                 <><AlertCircle size={14}/> TIDAK MELEPASI NISAB</>
                                            ) : (
                                                <><CheckCircle size={14}/> WAJIB ZAKAT</>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <><span className="flex items-center gap-1"><AlertCircle size={14}/> TIDAK DIKENAKAN ZAKAT</span></>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Zakat Perlu Dibayar</p>
                            <div className="text-4xl font-black text-[#0F6937] mb-6">
                                RM {calcResult.zakatDue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <button 
                                onClick={() => window.open(STATE_DATA.url, '_blank')}
                                disabled={calcResult.zakatDue <= 0}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                                    calcResult.zakatDue > 0 
                                    ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Bayar Sekarang <ArrowRight size={16}/>
                            </button>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800">
                         <p className="font-bold mb-1 flex items-center gap-2"><Info size={14}/> Nota Rujukan</p>
                         <p>Kadar Nisab <strong>{selectedState.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong> semasa ialah <strong>RM {NISAB.toLocaleString()}</strong>.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12 mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5 items-start">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">PENAFIAN & NOTIS PENTING</h4>
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
                    Kalkulator ini disediakan sebagai alat bantuan anggaran awal sahaja dan dibangunkan berdasarkan parameter umum hukum syarak serta kadar semasa yang ditetapkan oleh pihak berwajib negeri-negeri di Malaysia.
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><FileText size={12}/> Data anda tidak disimpan.</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={12}/> Kadar dikemaskini: 2025/2026</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
interface InputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  currency?: boolean;
  hint?: string;
  icon?: ReactNode;
  max?: number;
}

function Input({ label, value, onChange, currency, hint, icon, max }: InputProps) {
    return (
        <div className="w-full">
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 flex justify-between">
                {label}
                {icon && <span className="text-gray-400">{icon}</span>}
            </label>
            <div className="relative">
                {currency && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">RM</span>}
                <input 
                    type="number"
                    min="0"
                    max={max}
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-white border border-gray-200 rounded-lg h-10 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0F6937] focus:ring-1 focus:ring-[#0F6937] transition ${currency ? 'pl-10 pr-3' : 'px-3'}`}
                    placeholder="0"
                />
            </div>
            {hint && <p className="text-[10px] text-gray-400 mt-1 italic">{hint}</p>}
        </div>
    )
}
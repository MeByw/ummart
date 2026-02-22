'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, FileText, Clock, ExternalLink, ShieldCheck, LockKeyhole, AlertCircle } from 'lucide-react';

export default function HalalAdminReviews() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Set your secret admin password here!
  const ADMIN_PASSWORD = "1234567890";

  // --- DATA STATE ---
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Start false until authenticated

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchApplications(); // Only fetch data AFTER logging in
    } else {
      setAuthError('Katalaluan tidak sah. Sila cuba lagi.');
      setPasswordInput('');
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('halal_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching applications:", error);
    else setApplications(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('halal_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Gagal mengemaskini status!");
    } else {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    }
  };

  // --- LOGIN SCREEN UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col selection:bg-[#006837] selection:text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LockKeyhole size={40} />
            </div>
            <h1 className="text-2xl font-black text-center text-gray-900 mb-2">Akses Admin</h1>
            <p className="text-center text-gray-500 mb-8 text-sm">Sila masukkan katalaluan admin untuk mengurus permohonan Halal.</p>
            
            {authError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
                <AlertCircle size={18} /> {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan Katalaluan..." 
                className="w-full bg-gray-50 border border-gray-200 text-center text-lg tracking-widest rounded-xl px-4 py-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={!passwordInput}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
              >
                Log Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={36} className="text-gray-900" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">Semakan Halal JAKIM</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Panel Pengurusan UMMart Admin</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">
            Log Keluar
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-gray-400">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#006837] rounded-full animate-spin mb-4"></div>
              <p className="font-bold">Memuatkan pangkalan data...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-gray-400">
              <CheckCircle size={48} className="mb-4 text-green-200" />
              <p className="font-bold text-lg text-gray-900">Tiada permohonan baru</p>
              <p>Semua permohonan telah disemak.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Syarikat & SSM</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Dokumen Sokongan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-gray-900 text-base">{app.company_name}</p>
                        <p className="text-sm text-gray-500">{app.ssm_number}</p>
                        <p className="text-xs font-bold text-[#006837] mt-1.5 bg-green-50 w-max px-2 py-0.5 rounded">ID: {app.seller_id}</p>
                      </td>
                      <td className="p-4"><span className="text-sm font-medium text-gray-700">{app.category}</span></td>
                      <td className="p-4 space-y-2">
                        <a href={app.documents_url?.ssm} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                          <FileText size={16} /> Sijil SSM <ExternalLink size={12} />
                        </a>
                        <a href={app.documents_url?.ingredients} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                          <FileText size={16} /> Senarai Ramuan <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="p-4">
                        {app.status === 'Pending Review' && <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><Clock size={14} /> Menunggu</span>}
                        {app.status === 'Approved' && <span className="inline-flex items-center gap-1.5 bg-green-50 text-[#006837] px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle size={14} /> Diluluskan</span>}
                        {app.status === 'Rejected' && <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><XCircle size={14} /> Ditolak</span>}
                      </td>
                      <td className="p-4 text-right pr-6">
                        {app.status === 'Pending Review' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateStatus(app.id, 'Approved')} className="bg-[#006837] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 transition shadow-sm active:scale-95">Lulus</button>
                            <button onClick={() => updateStatus(app.id, 'Rejected')} className="bg-white text-red-600 border-2 border-red-100 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition active:scale-95">Tolak</button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
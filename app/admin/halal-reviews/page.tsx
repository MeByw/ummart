'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Search, FileText, CheckCircle, XCircle, Eye, 
  Building2, Clock, ShieldAlert, ArrowLeft, Download, Loader2 
} from 'lucide-react';

export default function AdminHalalDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- CONNECT TO SUPABASE ---
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('halal_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Badge Color Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ready for JAKIM': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Certified': return 'bg-green-100 text-green-700 border-green-200';
      case 'Revisions Needed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- UPDATE SUPABASE STATUS ---
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('halal_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state instantly
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      
      setSelectedApp(null); // Close modal
      alert(`Berjaya dikemaskini kepada: ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Gagal mengemaskini status.");
    }
  };

  const filteredApps = applications.filter(app => 
    app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.ssm_number?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#0F6937] selection:text-white pb-20">
      
      {/* Top Admin Navbar */}
      <div className="bg-[#0F6937] text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              <ShieldAlert size={24} /> UMMart Admin Center
            </h1>
            <p className="text-xs text-green-100 opacity-80">Pengurusan Pra-Kelayakan Halal</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-bold mb-1">Total Permohonan</p>
            <p className="text-3xl font-black text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
            <p className="text-gray-500 text-sm font-bold mb-1">Perlu Disemak</p>
            <p className="text-3xl font-black text-amber-600">
              {applications.filter(a => a.status === 'Pending Review').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
            <p className="text-gray-500 text-sm font-bold mb-1">Sedia (JAKIM)</p>
            <p className="text-3xl font-black text-blue-600">
              {applications.filter(a => a.status === 'Ready for JAKIM').length}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900">Senarai Syarikat</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Syarikat atau SSM..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0F6937] shadow-sm"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-bold">Syarikat & Kategori</th>
                  <th className="p-4 font-bold">No SSM</th>
                  <th className="p-4 font-bold">Tarikh Mohon</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <Loader2 size={24} className="animate-spin mx-auto text-[#0F6937] mb-2" /> Memuat turun data...
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Tiada permohonan dijumpai.</td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400"/> {app.company_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{app.category}</div>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700">{app.ssm_number}</td>
                      <td className="p-4 text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                        <Clock size={14}/> {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition inline-flex items-center gap-1 text-sm font-bold"
                        >
                          <Eye size={16} /> Semak
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* --- MODAL: ADMIN REVIEW PANEL --- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{selectedApp.company_name}</h3>
                <p className="text-gray-500 text-sm mt-1">SSM: {selectedApp.ssm_number} • Kategori: {selectedApp.category}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border shadow-sm">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-[#0F6937]" size={20} /> Dokumen Dimuat Naik
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:border-[#0F6937] transition cursor-pointer bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Sijil SSM</p>
                      <p className="text-xs text-gray-500 truncate max-w-[100px]">{selectedApp.documents_url?.ssm || 'ssm.pdf'}</p>
                    </div>
                  </div>
                  <Download size={18} className="text-gray-400 group-hover:text-[#0F6937]" />
                </div>

                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:border-[#0F6937] transition cursor-pointer bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Senarai Ramuan</p>
                      <p className="text-xs text-gray-500 truncate max-w-[100px]">{selectedApp.documents_url?.ingredients || 'ingredients.pdf'}</p>
                    </div>
                  </div>
                  <Download size={18} className="text-gray-400 group-hover:text-[#0F6937]" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Tindakan Admin</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateStatus(selectedApp.id, 'Revisions Needed')}
                    className="w-full py-3.5 border-2 border-red-200 text-red-600 bg-red-50 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Minta Baiki Dokumen
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedApp.id, 'Ready for JAKIM')}
                    className="w-full py-3.5 bg-[#0F6937] text-white rounded-xl font-bold hover:bg-[#0A4A27] transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Sedia Untuk JAKIM
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
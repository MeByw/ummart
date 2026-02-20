'use client';

import React from 'react';
import { useCart } from '../../providers';
import Link from 'next/link';
import { TrendingUp, Package, ClipboardList, AlertCircle, Check } from 'lucide-react';

// Reusing MOCK DATA for display consistency
const MOCK_ORDERS = [
    { id: 'ORD-7782', customer: 'Ali Abu', item: 'Sambal Nyet Berapi', qty: 2, total: 39.98, status: 'Pending' },
    { id: 'ORD-7783', customer: 'Siti Aminah', item: 'Dendeng Nyet', qty: 1, total: 14.90, status: 'Shipped' },
    { id: 'ORD-7784', customer: 'Ah Chong', item: 'Sambal Nyet Berapi', qty: 5, total: 99.95, status: 'Delivered' },
];

export default function SellerOverviewPage() {
  const { allProducts } = useCart();

  const totalRevenue = MOCK_ORDERS.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-black text-gray-900 capitalize">Dashboard Overview</h1>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Revenue" value={`RM${totalRevenue.toFixed(2)}`} icon={<TrendingUp size={24} className="text-white"/>} color="bg-green-500" trend="+12% this week" />
            <MetricCard title="Total Products" value={allProducts.length.toString()} icon={<Package size={24} className="text-white"/>} color="bg-blue-500" />
            <MetricCard title="Total Orders" value={MOCK_ORDERS.length.toString()} icon={<ClipboardList size={24} className="text-white"/>} color="bg-orange-500" />
            <MetricCard title="Pending Orders" value={pendingOrders.toString()} icon={<AlertCircle size={24} className="text-white"/>} color="bg-red-500" />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-gray-800">Recent Orders</h2>
                <Link href="/seller/orders" className="text-sm text-[#006837] font-bold hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCK_ORDERS.slice(0, 3).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                                <td className="px-6 py-4 font-bold text-sm">{order.customer}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-sm text-right">RM{order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

// Simple internal component for this page
function MetricCard({ title, value, icon, color, trend }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition">
             <div className={`absolute top-4 right-4 w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                {icon}
             </div>
             <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
             <p className="text-3xl font-black text-gray-900">{value}</p>
             {trend && <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={14}/> {trend}</p>}
        </div>
    );
}
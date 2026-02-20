'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

const INITIAL_ORDERS = [
    { id: 'ORD-7782', customer: 'Ali Abu', item: 'Sambal Nyet Berapi', qty: 2, total: 39.98, status: 'Pending' },
    { id: 'ORD-7783', customer: 'Siti Aminah', item: 'Dendeng Nyet', qty: 1, total: 14.90, status: 'Shipped' },
    { id: 'ORD-7784', customer: 'Ah Chong', item: 'Sambal Nyet Berapi', qty: 5, total: 99.95, status: 'Delivered' },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleStatusChange = (id: string, newStatus: string) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
        <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                            <td className="px-6 py-4 font-bold text-sm">{order.customer}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.qty}x {order.item}</td>
                            <td className="px-6 py-4 font-bold text-sm">RM{order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {order.status === 'Pending' && <button onClick={() => handleStatusChange(order.id, 'Shipped')} className="text-xs bg-[#006837] text-white px-3 py-1.5 rounded-lg hover:bg-[#00552b]">Ship Order</button>}
                                {order.status === 'Shipped' && <button onClick={() => handleStatusChange(order.id, 'Delivered')} className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100">Mark Done</button>}
                                {order.status === 'Delivered' && <span className="text-gray-400 text-xs flex items-center justify-end gap-1"><Check size={14}/> Completed</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
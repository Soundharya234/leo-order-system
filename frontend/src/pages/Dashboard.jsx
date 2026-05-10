import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PackageOpen, TrendingUp, AlertTriangle, IndianRupee, Users, Award, Zap, Phone, MapPin, Truck } from 'lucide-react';

function KPICard({ title, value, icon, trend, alert, color = "teal" }) {
  const colorClasses = {
    teal: "text-teal-400 bg-teal-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
    blue: "text-blue-400 bg-blue-500/10"
  };

  return (
    <div className={`bg-slate-900 border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg ${alert ? 'border-red-500/50' : 'border-slate-800'}`}>
      <div className="flex justify-between items-start mb-4 relative z-10 w-full">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 w-full">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        
        <div className="h-6 mt-2">
          {trend && (
            <p className="text-teal-400 text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wide">
              <TrendingUp size={14} /> {trend}
            </p>
          )}
          {alert && (
            <p className="text-red-400 text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle size={14} /> {alert}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalRevenue: 0, outstandingBalance: 0, loyalCustomers: 0, dailyOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        
        // Parallel Fetch
        const [summaryRes, ordersRes, salesRes] = await Promise.all([
            axios.get('https://leo-order-system-1.onrender.com/api/analytics/dashboard-summary', config),
            axios.get('https://leo-order-system-1.onrender.com/api/orders/all', config),
            axios.get('https://leo-order-system-1.onrender.com/api/analytics/daily-sales', config)
        ]);

        console.log("DASHBOARD LIVE UPDATE:", {
            summary: summaryRes.data,
            ordersCount: ordersRes.data.length,
            salesTrend: salesRes.data
        });

        setSummary(summaryRes.data);
        setOrders(ordersRes.data);
        setSalesData(salesRes.data);

      } catch (error) {
        console.error('DASHBOARD FETCH ERROR:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-8 text-center flex flex-col items-center justify-center gap-4 h-[60vh]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-teal-400 font-bold tracking-widest uppercase text-xs">Real-Time Sync Active...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl w-full gap-6">
        <div className="flex items-center gap-4">
            <img src="/leo-logo.png" alt="LEO Smart Order" className="w-20 h-20 object-contain" />
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter italic whitespace-nowrap">LEO Smart Order</h1>
                <p className="text-teal-400 mt-1 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> ADMIN: P. LEO FRANKLINE TERMINAL
                </p>
            </div>
        </div>
        <div className="bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Integrity</p>
            <p className="text-sm font-bold text-white flex items-center gap-2 justify-end">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Main Operations Live
            </p>
        </div>
      </header>

      {/* Real Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        <KPICard 
            title="Total Revenue (7d)" 
            value={`₹${summary.totalRevenue?.toLocaleString() || 0}`} 
            icon={<IndianRupee size={22} />} 
            trend="+12% Forecast" 
            color="teal" 
        />
        <KPICard 
          title="Outstanding Kadan" 
          value={`₹${summary.outstandingBalance?.toLocaleString() || 0}`} 
          icon={<AlertTriangle size={22} />} 
          alert={summary.outstandingBalance > 10000 ? "Debt Risk" : null} 
          color="red"
        />
        <KPICard 
          title="Loyalty Base" 
          value={summary.loyalCustomers || 0} 
          icon={<Award size={22} />} 
          trend="Regular Buyers" 
          color="amber"
        />
        <KPICard 
          title="Daily Traffic" 
          value={summary.dailyOrders || 0} 
          icon={<TrendingUp size={22} />} 
          trend="Order Momentum" 
          color="blue"
        />
      </div>

      {/* Massive Order Feed */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full">
         <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3 italic">
              <PackageOpen className="text-teal-400" /> Massive Order Feed
            </h2>
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Showing Latest {orders.slice(0, 10).length} Entries
            </div>
         </div>

         <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr className="bg-slate-950 text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer Info</th>
                        <th className="px-6 py-4">Logistics</th>
                        <th className="px-6 py-4">Items Summary</th>
                        <th className="px-6 py-4">Financials</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                    {orders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-slate-800/20 transition-all font-medium text-xs text-slate-300">
                            <td className="px-6 py-6">
                                <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
                                    {order.orderNumber || order._id.slice(-6).toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-6 font-black text-white uppercase tracking-tight">
                                {order.customerName}
                                <div className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1 italic"><Phone size={10} className="text-teal-400"/> {order.phone}</div>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 w-fit ${order.deliveryMethod === 'Home Delivery' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    <Truck size={10} /> {order.deliveryMethod}
                                </span>
                                <div className="text-[9px] text-slate-500 mt-1 max-w-[150px] truncate">{order.address}</div>
                            </td>
                            <td className="px-6 py-6 font-bold text-slate-100 italic">
                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                            </td>
                            <td className="px-6 py-6">
                                <span className="text-lg font-black text-teal-400 font-mono italic">₹{order.finalAmount?.toLocaleString()}</span>
                                <div className={`text-[9px] font-black uppercase mt-1 ${order.paymentStatus === 'Paid' ? 'text-teal-500' : 'text-red-500'}`}>
                                    {order.paymentStatus} via {order.paymentMethod}
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    order.status === 'Delivered' ? 'bg-teal-500/10 text-teal-400' : 
                                    order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                                    'bg-slate-800 text-slate-400'
                                }`}>
                                    {order.status || 'Pending'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan="6" className="px-6 py-20 text-center text-slate-600 font-black uppercase tracking-widest text-xs">Waiting for incoming transactions...</td></tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

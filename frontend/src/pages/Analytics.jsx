import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, AlertCircle, IndianRupee, 
  ArrowUpRight, ArrowDownRight, Package, Clock, ShieldCheck
} from 'lucide-react';

const COLORS = ['#14b8a6', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState({ dailySales: [], topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        
        const [summaryRes, trendsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/summary', config),
          axios.get('http://localhost:5000/api/analytics/trends', config)
        ]);

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-8 text-center flex flex-col items-center justify-center gap-4 h-[60vh]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-teal-400 font-bold tracking-widest uppercase text-xs">Architecting BI Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">Business Intelligence</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Real-time Performance Metrics — Subra Rice Shop</p>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-400" />
            <span className="text-[10px] font-black text-teal-400 uppercase">Secure Cloud Sync</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Gross Revenue" value={`₹${summary?.totalRevenue.toLocaleString()}`} icon={<IndianRupee />} trend="+14.2%" color="teal" />
        <MetricCard title="Successful Orders" value={summary?.totalOrders} icon={<ShoppingBag />} trend="+8.1%" color="blue" />
        <MetricCard title="Active Customers" value={summary?.totalCustomers} icon={<Users />} trend="+12" color="amber" />
        <MetricCard title="Pending Kadan" value={`₹${summary?.pendingPayments.toLocaleString()}`} icon={<AlertCircle />} trend="-3.4%" color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Daily Sales Chart */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-teal-400" /> Daily Revenue Momentum
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} />
                <Line type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={4} dot={{ fill: '#14b8a6', r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
            <Package size={16} className="text-blue-400" /> High-Performance Grains
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} />
                <Bar dataKey="qty" fill="#0ea5e9" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical Alerts Stream */}
      <section className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
         <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} className="text-red-400" /> Critical Operations Alerts
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AlertItem 
                title="Inventory Crisis" 
                msg={`${summary?.lowStockCount} varieties are below 20kg threshold.`} 
                level={summary?.lowStockCount > 0 ? "high" : "low"} 
            />
            <AlertItem 
                title="Finance Exposure" 
                msg={`₹${summary?.pendingPayments.toLocaleString()} is currently locked in pending payments.`} 
                level={summary?.pendingPayments > 5000 ? "mid" : "low"} 
            />
            <AlertItem 
                title="Customer Growth" 
                msg={`Success! ${summary?.totalCustomers} registered active buyers logged.`} 
                level="success" 
            />
         </div>
      </section>

    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }) {
    const colorClasses = {
        teal: "text-teal-400 bg-teal-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        amber: "text-amber-400 bg-amber-500/10",
        red: "text-red-400 bg-red-500/10"
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:bg-slate-800/50 transition-all cursor-default group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>{icon}</div>
                <div className="flex items-center gap-1 text-[10px] font-black text-teal-400 bg-teal-500/5 px-2 py-1 rounded-full group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={10} /> {trend}
                </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-3xl font-black text-white italic">{value}</h4>
        </div>
    );
}

function AlertItem({ title, msg, level }) {
    const levels = {
        high: "border-red-500/20 bg-red-500/5 text-red-400",
        mid: "border-amber-500/20 bg-amber-500/5 text-amber-400",
        low: "border-slate-800 bg-slate-950 text-slate-500",
        success: "border-teal-500/20 bg-teal-500/5 text-teal-400"
    };

    return (
        <div className={`p-5 rounded-2xl border ${levels[level]} flex flex-col gap-2`}>
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${level === 'high' ? 'bg-red-500 animate-pulse' : 'bg-current'}`}></div> {title}
            </span>
            <p className="text-xs font-bold leading-relaxed">{msg}</p>
        </div>
    );
}

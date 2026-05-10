import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, Receipt, Banknote, Calendar } from 'lucide-react';

const API_ORDERS = "http://localhost:5000/api/orders";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_ORDERS}/${userInfo._id}`, config);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-slate-100 font-bold animate-pulse">Loading order history...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div>
           <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic">
            <Receipt className="text-teal-500" /> My Purchases
          </h1>
          <p className="text-slate-500 mt-1 font-bold">Track your rice orders and balance history</p>
        </div>
        <div className="bg-slate-900 px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-500">
                <Banknote size={24} />
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Current Balance</p>
                <p className="text-2xl font-black text-white">₹{userInfo.balance || 0}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-slate-100 shadow-lg flex flex-col items-center justify-center text-center">
            <Package size={100} className="text-slate-100 mb-6" />
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">No orders found</h3>
            <p className="text-slate-400 mt-2 max-w-xs font-medium">You haven't placed any orders yet. Visit our store or call for door delivery!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group hover:shadow-2xl transition-all duration-500">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black text-teal-400 uppercase leading-none mb-1">{new Date(order.createdAt).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-black text-white leading-none">{new Date(order.createdAt).getDate()}</span>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Order #{order._id.slice(-6).toUpperCase()} 
                            <span className={`text-[10px] px-3 py-1 rounded-full border ${order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {order.paymentStatus}
                            </span>
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> {order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                    <div className="text-center md:text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Items Cost</p>
                        <p className="text-xl font-black text-slate-900">₹{order.itemsTotal.toLocaleString()}</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Remaining</p>
                        <p className={`text-xl font-black ${order.remainingBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>₹{order.remainingBalance.toLocaleString()}</p>
                    </div>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-white border-t border-slate-100">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-dotted border-slate-100 last:border-0">
                            <span className="text-xs font-bold text-slate-600 uppercase flex-1 truncate pr-4">{item.name}</span>
                            <span className="text-xs font-black text-slate-900 whitespace-nowrap">{item.quantity} x ₹{item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Bill Details: Items (₹{order.itemsTotal}) + Old Balance (₹{order.previousBalance}) = Grand Total ₹{order.finalAmount}
                     </div>
                     <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Download Receipt</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

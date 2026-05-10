import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, MapPin, Phone, IndianRupee, Plus, X, Package, UserCheck, ShieldCheck } from 'lucide-react';

const API_PROCUREMENT = "http://localhost:5000/api/procurement/loads";
const API_SUPPLIERS = "http://localhost:5000/api/suppliers";
const API_DELIVERY = "http://localhost:5000/api/delivery";

export default function Logistics() {
  const [suppliers, setSuppliers] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [loadData, setLoadData] = useState({ supplierId: '', riceType: '', quantity: '', rate: '', transportCharge: '', amountPaid: '' });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchData = async () => {
    try {
      const [suppRes, delRes, loadsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/suppliers', config),
        axios.get('http://localhost:5000/api/delivery', config),
        axios.get('http://localhost:5000/api/procurement/loads', config)
      ]);
      setSuppliers(suppRes.data);
      setDeliveryStaff(delRes.data);
      setLoads(loadsRes.data);
    } catch (error) {
      console.error("Error fetching logistics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/procurement/load", loadData, config);
      setShowLoadForm(false);
      setLoadData({ supplierId: '', riceType: '', quantity: '', rate: '', transportCharge: '', amountPaid: '' });
      fetchData();
    } catch (error) {
      alert("Error logging load");
    }
  };

  if (loading) return <div className="p-8 text-center text-teal-400">Loading Logistics Hub...</div>;

  return (
    <div className="space-y-10 w-full animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <Truck className="text-teal-400" size={40} /> Logistics & Supply Chain
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage Inward Procurement and Outward Door Delivery</p>
        </div>
        <button 
          onClick={() => setShowLoadForm(!showLoadForm)}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
        >
          {showLoadForm ? <X size={20} /> : <Plus size={20} />}
          {showLoadForm ? 'Close' : 'Log New Rice Load'}
        </button>
      </div>

      {/* New Load Form */}
      {showLoadForm && (
        <div className="bg-slate-900 border border-teal-500/30 p-8 rounded-3xl shadow-2xl animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Package className="text-teal-400" /> Procurement Entry (Mandi / Mill Load)
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleLoadSubmit}>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Supplier (Mandi/Mill)</label>
                <select 
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.supplierId}
                    onChange={(e) => setLoadData({...loadData, supplierId: e.target.value})}
                    required
                >
                    <option value="">Select Mill</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.mandiName || s.name} ({s.location})</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Rice Variety</label>
                <input 
                    type="text" placeholder="e.g. BPT 5204"
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.riceType}
                    onChange={(e) => setLoadData({...loadData, riceType: e.target.value})}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Quantity (Kg)</label>
                <input 
                    type="number" placeholder="1000"
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.quantity}
                    onChange={(e) => setLoadData({...loadData, quantity: e.target.value})}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Rate per Kg (₹)</label>
                <input 
                    type="number" placeholder="45"
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.rate}
                    onChange={(e) => setLoadData({...loadData, rate: e.target.value})}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Transport Charge (₹)</label>
                <input 
                    type="number" placeholder="2000"
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.transportCharge}
                    onChange={(e) => setLoadData({...loadData, transportCharge: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Advance Paid (₹)</label>
                <input 
                    type="number" placeholder="5000"
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-teal-500"
                    value={loadData.amountPaid}
                    onChange={(e) => setLoadData({...loadData, amountPaid: e.target.value})}
                />
            </div>
            <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-teal-500 text-slate-950 font-black px-10 py-3 rounded-xl uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
                    Register Load & update Inventory
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Suppliers Section (Mills/Mandis) */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <MapPin className="text-teal-400" /> Inward Suppliers (Mills)
            </h2>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {suppliers.length > 0 ? suppliers.map(s => (
                    <div key={s._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/30 transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-400 transition-colors uppercase tracking-tight">{s.mandiName || s.name}</h3>
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {s.location}</span>
                                    <span className="flex items-center gap-1"><Phone size={12} /> {s.phone}</span>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${s.isAvailable ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400'}`}>
                                {s.isAvailable ? 'Active Supplier' : 'Inactive'}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-end border-t border-slate-800 pt-4">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Outstanding (Shop Debt)</p>
                                <p className={`text-2xl font-black ${s.totalOwed > 10000 ? 'text-red-400' : 'text-white'}`}>₹ {s.totalOwed?.toLocaleString()}</p>
                            </div>
                            <button className="text-xs font-black text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg hover:bg-teal-500 hover:text-slate-950 transition-all uppercase tracking-widest">Pay Vendor</button>
                        </div>
                    </div>
                )) : <div className="p-10 text-center text-slate-600 border border-slate-800 border-dashed rounded-3xl uppercase font-bold text-sm">No suppliers registered. Add Mills first.</div>}
            </div>
        </div>

        {/* Delivery Staff Section */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserCheck className="text-teal-400" /> Outward Delivery Staff
            </h2>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {deliveryStaff.length > 0 ? deliveryStaff.map(d => (
                    <div key={d._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 text-xl">
                                    {d.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-tight">{d.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">{d.phone}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${d.status === 'Available' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                {d.status}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-4 px-1">
                            <div className="text-center bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Orders</p>
                                <p className="text-lg font-black text-white">{d.totalDeliveries}</p>
                            </div>
                            <div className="text-center bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Rating</p>
                                <p className="text-lg font-black text-amber-400">★ {d.rating}</p>
                            </div>
                            <div className="text-center bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Cash</p>
                                <p className="text-lg font-black text-teal-400">₹{d.balance}</p>
                            </div>
                        </div>
                    </div>
                )) : <div className="p-10 text-center text-slate-600 border border-slate-800 border-dashed rounded-3xl uppercase font-bold text-sm">No delivery staff registered.</div>}
            </div>
            <button className="w-full border-2 border-dashed border-slate-800 p-4 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-xs hover:border-teal-500 hover:text-teal-400 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Hire New Delivery Personnel
            </button>
        </div>
      </div>

       {/* Recent Activity Table */}
       <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 bg-slate-950/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <ShieldCheck className="text-teal-400" /> Recent Inward Loads (Procurement Log)
            </h2>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
                  <th className="px-8 py-4 font-black">Received Date</th>
                  <th className="px-8 py-4 font-black">Supplier (Mill)</th>
                  <th className="px-8 py-4 font-black">Variety</th>
                  <th className="px-8 py-4 font-black">Qty (Kg)</th>
                  <th className="px-8 py-4 font-black">Rate</th>
                  <th className="px-8 py-4 font-black">Outstanding Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {loads.map((load) => (
                  <tr key={load._id} className="hover:bg-slate-950/50 transition-colors group">
                    <td className="px-8 py-5 text-slate-400 font-medium">
                        {new Date(load.receivedAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white uppercase tracking-tight">{load.supplier?.mandiName || load.supplier?.name}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{load.supplier?.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-teal-400 text-xs uppercase">{load.riceType}</td>
                    <td className="px-8 py-5 font-mono text-white text-base font-bold">{load.quantityInKg} <span className="text-xs text-slate-600 font-normal">Kg</span></td>
                    <td className="px-8 py-5 text-slate-400 font-medium">₹{load.ratePerKg}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-tighter ${load.amountDue > 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'}`}>
                        ₹ {load.amountDue?.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

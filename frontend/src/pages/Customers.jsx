import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit2, Trash2, X, Check, Search, Phone, MapPin, CreditCard, RotateCcw, Calendar, AlertTriangle } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    totalPurchase: 0,
    visitCount: 0,
    balance: 0,
    creditDueDate: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` }
  };

  const fetchData = async () => {
    try {
      const [customersRes, analyticsRes] = await Promise.all([
        axios.get('https://leo-order-system-1.onrender.com/api/customers', config),
        axios.get('https://leo-order-system-1.onrender.com/api/customers/analytics', config)
      ]);
      setCustomers(customersRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load customer data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://leo-order-system-1.onrender.com/api/customers/${editingId}`, formData, config);
        setMessage({ type: 'success', text: 'Customer updated successfully!' });
      } else {
        await axios.post('https://leo-order-system-1.onrender.com/api/customers', formData, config);
        setMessage({ type: 'success', text: 'Customer added successfully!' });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', phone: '', address: '', totalPurchase: 0, visitCount: 0, balance: 0, creditDueDate: '' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Action failed.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`https://leo-order-system-1.onrender.com/api/customers/${id}`, config);
        setMessage({ type: 'success', text: 'Customer deleted successfully!' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: 'Delete failed.' });
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
      totalPurchase: customer.totalPurchase,
      visitCount: customer.visitCount,
      balance: customer.balance || 0,
      creditDueDate: customer.creditDueDate ? new Date(customer.creditDueDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  if (loading) return <div className="p-8 text-center text-teal-400">Loading Customers...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-slate-400">Manage retail customers, loyalty, and credit (kadan)</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', phone: '', address: '', totalPurchase: 0, visitCount: 0, balance: 0, creditDueDate: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Analytics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Customers</p>
          <p className="text-3xl font-extrabold text-white mt-1">{analytics?.totalCount || 0}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">Frequent (&gt;10 visits)</p>
          <p className="text-3xl font-extrabold text-teal-400 mt-1">{analytics?.stats?.frequentCount || 0}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-red-500">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Total Kadan (Credit)</p>
          <p className="text-3xl font-extrabold text-white mt-1">₹{customers.reduce((acc, curr) => acc + (curr.balance || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Total Purchase</th>
                <th className="px-6 py-4">Credit (Balance)</th>
                <th className="px-6 py-4">Visit Count</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCustomers.map(customer => {
                  const isOverdue = customer.balance > 0 && customer.creditDueDate && new Date(customer.creditDueDate) < new Date();
                  return (
                    <tr key={customer._id} className="hover:bg-teal-500/5 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 font-bold border border-slate-700">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-100">{customer.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone size={12} /> {customer.phone}
                            </p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-200">
                        <CreditCard size={14} className="text-slate-500" />
                        <span className="font-semibold">₹{customer.totalPurchase.toLocaleString()}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className={`flex flex-col ${customer.balance > 0 ? (isOverdue ? 'text-red-400' : 'text-amber-400') : 'text-slate-500'}`}>
                            <div className="flex items-center gap-2 font-bold">
                                <CreditCard size={14} />
                                <span>₹{(customer.balance || 0).toLocaleString()}</span>
                            </div>
                            {customer.balance > 0 && customer.creditDueDate && (
                                <span className="text-[10px] mt-1 flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(customer.creditDueDate).toLocaleDateString()}
                                    {isOverdue && <AlertTriangle size={10} className="animate-pulse" />}
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-200">
                        <RotateCcw size={14} className="text-slate-500" />
                        <span>{customer.visitCount} visits</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                        <button 
                            onClick={() => handleEdit(customer)}
                            className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(customer._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                        </div>
                    </td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-red-500 uppercase flex items-center gap-1"><CreditCard size={12}/> Credit Balance (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none" 
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1"><Calendar size={12}/> Payment Due Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={formData.creditDueDate}
                    onChange={(e) => setFormData({...formData, creditDueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none h-20" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Total Purchase (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.totalPurchase}
                    onChange={(e) => setFormData({...formData, totalPurchase: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Visit Count</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.visitCount}
                    onChange={(e) => setFormData({...formData, visitCount: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs">
                  {editingId ? 'Update & Save' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

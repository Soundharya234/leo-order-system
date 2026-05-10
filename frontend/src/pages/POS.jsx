import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ShoppingBag, CreditCard, Search, User, Receipt, Wallet, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_CUSTOMERS = "http://localhost:5000/api/customers";
const API_ORDERS = "http://localhost:5000/api/orders";

export default function POS() {
  const { cart, addToCart, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [orderData, setOrderData] = useState({
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    amountPaid: 0
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          axios.get(API_PRODUCTS, config),
          axios.get(API_CUSTOMERS, config)
        ]);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
      } catch (error) {
        console.error("Error fetching POS data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // When subtotal changes or customer changes, default amountPaid for "Paid" status
    if (orderData.paymentStatus === 'Paid') {
        setOrderData(prev => ({ ...prev, amountPaid: totalPrice }));
    }
  }, [totalPrice, orderData.paymentStatus]);

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    const customer = customers.find(c => c._id === custId);
    setSelectedCustomer(customer || null);
  };

  const previousBalance = selectedCustomer?.balance || 0;
  const finalTotal = totalPrice + previousBalance;
  const remainingBalance = finalTotal - orderData.amountPaid;

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) return alert("Please select a customer");

    try {
      const payload = {
        customerId: selectedCustomer._id,
        customerName: selectedCustomer.name,
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          total: item.price * item.qty
        })),
        itemsTotal: totalPrice,
        previousBalance: previousBalance,
        finalAmount: finalTotal,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        remainingBalance: remainingBalance
      };

      await axios.post(API_ORDERS, payload, config);
      alert("Order Placed & Bill Generated!");
      clearCart();
      setSelectedCustomer(null);
      setOrderData({ paymentMethod: 'Cash', paymentStatus: 'Paid', amountPaid: 0 });
    } catch (error) {
      alert("Error placing order: " + error.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full w-full max-w-[1600px] mx-auto p-4">
      {/* Products Selection Section */}
      <div className="flex-1 bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col min-h-[700px]">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ShoppingBag className="text-teal-500" /> Rice Varieties
            </h2>
            <div className="relative w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search rice varieties..." 
                    className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
            <button 
              key={product._id}
              onClick={() => addToCart(product)}
              className="bg-slate-50 border-2 border-transparent p-6 rounded-3xl hover:border-teal-500/20 hover:bg-white hover:shadow-xl text-left transition-all flex flex-col justify-between h-48 group"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{product.type || 'Rice'}</span>
                <h3 className="font-black text-lg text-slate-800 mt-2 line-clamp-2 leading-tight">{product.name}</h3>
              </div>
              <div className="flex justify-between items-end w-full">
                <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                <span className="text-[10px] text-slate-400 font-black">STOCK: {product.stock}kg</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Billing Section */}
      <div className="w-full lg:w-[450px] bg-slate-900 rounded-3xl p-8 flex flex-col shadow-2xl border border-slate-800 relative">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
            <Receipt className="text-teal-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Order Bill</h2>
        </div>
        
        {/* Customer Selection */}
        <div className="space-y-4 mb-8">
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Select Customer
                </label>
                <select 
                    className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500/50"
                    onChange={handleCustomerChange}
                    value={selectedCustomer?._id || ''}
                >
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
                </select>
            </div>
            
            {selectedCustomer && (
                <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Previous Balance</span>
                    <span className="text-xl font-black text-white">₹{previousBalance.toLocaleString()}</span>
                </div>
            )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-700 flex-col gap-4 opacity-50">
              <ShoppingBag size={64} />
              <p className="font-black uppercase tracking-widest text-xs">Empty Bag</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-black text-slate-100 uppercase truncate leading-none">{item.name}</h4>
                  <p className="text-teal-400 font-black mt-2">₹{item.price} <span className="text-slate-600 font-normal lowercase">x {item.qty}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-900 rounded-xl overflow-hidden border border-slate-700 items-center">
                    <button onClick={() => updateQty(item._id, -1)} className="px-3 py-1 text-slate-400 hover:bg-slate-700">-</button>
                    <span className="px-3 text-xs font-black text-teal-400">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, 1)} className="px-3 py-1 text-slate-400 hover:bg-slate-700">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500/30 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Billing Calculations */}
        <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-slate-500 font-black uppercase tracking-widest text-[10px]">
            <span>Items Total</span>
            <span className="text-slate-200">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
            <span>Old Balance</span>
            <span className="text-slate-200">₹{previousBalance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-teal-400 font-black uppercase tracking-tighter text-sm">Amount to Pay</span>
            <span className="text-4xl font-black text-white tracking-tighter">₹{finalTotal.toLocaleString()}</span>
          </div>

          {/* Payment Options */}
          <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Method</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setOrderData({...orderData, paymentMethod: 'Cash'})}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${orderData.paymentMethod === 'Cash' ? 'bg-teal-500 border-teal-500 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Banknote size={18} />
                        <span className="text-[10px] font-black uppercase">Cash</span>
                    </button>
                    <button 
                        onClick={() => setOrderData({...orderData, paymentMethod: 'GPay'})}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${orderData.paymentMethod === 'GPay' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Wallet size={18} />
                        <span className="text-[10px] font-black uppercase">GPay</span>
                    </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Status</label>
                <select 
                    className="w-full bg-slate-800 border-none p-4 rounded-2xl text-white text-xs font-black uppercase outline-none"
                    value={orderData.paymentStatus}
                    onChange={(e) => setOrderData({...orderData, paymentStatus: e.target.value})}
                >
                    <option value="Paid">Fully Paid</option>
                    <option value="Pending">Kadan / Pending</option>
                </select>
              </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Amount Customer Paid Now</label>
            <input 
                type="number"
                className="w-full bg-slate-950 border-none p-4 rounded-2xl text-white text-xl font-black outline-none focus:ring-2 focus:ring-teal-500/20"
                value={orderData.amountPaid}
                onChange={(e) => setOrderData({...orderData, amountPaid: Number(e.target.value)})}
            />
          </div>

          <div className="flex justify-between items-center py-4 px-6 bg-slate-950 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">New Remaining Balance</span>
              <span className={`text-xl font-black ${remainingBalance > 0 ? 'text-red-500' : 'text-teal-400'}`}>₹{remainingBalance.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-20 shadow-2xl shadow-teal-500/30"
            disabled={cart.length === 0}
          >
            <CreditCard size={20} /> Generate Bill & Save Order
          </button>
        </div>
      </div>
    </div>
  );
}

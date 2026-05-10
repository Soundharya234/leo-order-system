import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, CreditCard, RotateCcw, ShoppingCart, Package, 
  AlertCircle, Check, Info, ArrowRight, Zap, History, 
  Star, Users, Heart, Share2, Plus, Minus, X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { cart, addToCart } = useCart();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` }
  };

  const fetchData = async () => {
    try {
      const [profileRes, stockRes] = await Promise.all([
        axios.get('http://localhost:5000/api/customer/profile', config),
        axios.get('http://localhost:5000/api/customer/stock', config)
      ]);
      setProfile(profileRes.data);
      setProducts(stockRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMessage({ type: 'error', text: 'Error loading store details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage({ type: 'success', text: `Added to cart!` });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handlePayment = async () => {
    const amount = prompt("Enter amount to pay (₹):", profile.balance);
    if (!amount || isNaN(amount) || amount <= 0) return;

    try {
      const { data } = await axios.put(`http://localhost:5000/api/customers/${userInfo._id}/payment`, { amountPaid: Number(amount) }, config);
      setMessage({ type: 'success', text: `Payment of ₹${amount} successful! New Balance: ₹${data.newBalance}` });
      fetchData(); // Refresh UI
    } catch (error) {
      setMessage({ type: 'error', text: 'Payment failed.' });
    }
  };

  const getRating = (reviews) => {
    if (!reviews?.length) return 4.5; // default for new items
    return (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-teal-600 font-bold">Loading Premium Storefront...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Financial Health Banner */}
      {profile?.balance > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-rose-500 p-6 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl animate-pulse">
                <AlertCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black">Notice: Pending Balance ₹{profile.balance.toLocaleString()}</h2>
                <p className="text-white/80 font-medium text-sm">Clear your dues to continue enjoying premium benefits.</p>
              </div>
           </div>
           <button 
            onClick={handlePayment}
            className="px-10 py-4 bg-white text-rose-600 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10"
           >
              Pay Kadan Now
           </button>
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <CreditCard size={200} />
           </div>
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
           <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
              <History size={28} />
           </div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Spent</p>
              <p className="text-2xl font-black text-slate-800">₹{profile?.totalPurchase?.toLocaleString()}</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Users size={28} />
           </div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Visits</p>
              <p className="text-2xl font-black text-slate-800">{profile?.visitCount} Times</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
           <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Zap size={28} />
           </div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
              <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">Premium Customer</p>
           </div>
        </div>
      </div>

      {/* Meesho Style Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
              <Package className="text-teal-600" /> Top Picks For You
           </h2>
           <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-bold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">See all</button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {products.map(product => (
             <div key={product._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden group">
                {/* Image Section */}
                <div className="h-64 overflow-hidden relative">
                   <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                         <Star size={14} className="text-amber-500 fill-amber-500" />
                         <span className="text-xs font-black text-slate-800">{getRating(product.reviews)}</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-black text-slate-500">
                         {product.purchaseCount}+ Sold
                      </div>
                   </div>
                   <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 shadow-sm hover:scale-110 transition-all">
                      <Heart size={20} />
                   </button>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                   <div className="flex-1">
                      <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1 italic">Best Quality</p>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors truncate">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {product.description || "Premium quality grains sourced directly from the finest fields."}
                      </p>
                   </div>

                   <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                         <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                         <span className="text-xs text-slate-400 font-bold ml-1">/kg</span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                         <Plus size={14} strokeWidth={4} /> Add to Cart
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Floating Cart Indicator */}
      {cart.length > 0 && (
         <div className="fixed bottom-24 right-8 z-40 animate-in slide-in-from-right-10">
            <Link to="/cart" className="bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 hover:scale-105 transition-all">
               <div className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900">{cart.length}</span>
               </div>
               <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400">View Cart</p>
                  <p className="text-sm font-black">₹{cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toLocaleString()}</p>
               </div>
               <ArrowRight size={20} className="text-teal-500" />
            </Link>
         </div>
      )}

      {/* Global Message Toast */}
      {message.text && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl flex items-center gap-4 border shadow-2xl animate-in slide-in-from-top-10 z-50 ${message.type === 'success' ? 'bg-teal-600 text-white border-teal-500' : 'bg-red-600 text-white border-red-500'} font-black italic`}>
          {message.type === 'success' ? <Check size={24} /> : <AlertCircle size={24} />}
          <span>{message.text}</span>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;

import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, CreditCard, ChevronLeft, Truck, Store, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Checkout State
  const [deliveryMethod, setDeliveryMethod] = useState('Store Pickup');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (deliveryMethod === 'Home Delivery' && !address) return alert("Please provide a delivery address.");
    if (!phone) return alert("Please provide a contact phone number.");

    try {
      setIsOrdering(true);
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      const orderPayload = {
        customerId: userInfo._id,
        customerName: userInfo.name,
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          total: item.price * item.qty
        })),
        itemsTotal: totalPrice,
        previousBalance: userInfo.balance || 0,
        finalAmount: totalPrice + (userInfo.balance || 0),
        paymentMethod,
        paymentStatus: paymentMethod === 'GPay' ? 'Paid' : 'Pending',
        remainingBalance: paymentMethod === 'Cash' ? (totalPrice + (userInfo.balance || 0)) : 0,
        deliveryMethod,
        address: deliveryMethod === 'Home Delivery' ? address : 'Store Pickup Location',
        phone
      };

      console.log("Sending Order Payload:", orderPayload);
      const response = await axios.post("http://localhost:5000/api/orders", orderPayload, config);
      console.log("Order Response:", response.data);
      
      alert(`Order placed successfully! 🎉\n${paymentMethod === 'GPay' ? 'Please complete payment to 8667897907' : ''}`);
      
      // Sync Local User Data with new balance
      const updatedUser = { ...userInfo, balance: orderPayload.remainingBalance };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      clearCart();
      navigate('/customer-purchases');
    } catch (error) {
      console.error("DETAILED ORDER ERROR:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error occurred";
      alert("Error placing order: " + errorMsg);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8 text-white">
        <Link to="/customer-stock" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
            <h1 className="text-3xl font-black tracking-tight italic">Subra Rice Shop</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Secure Checkout — Admin: Kayalvizhi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Items & Logistics */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cart Items */}
          <section className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl overflow-hidden">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShoppingBag size={16} className="text-teal-400"/> Your Selected Grains
            </h2>
            {cart.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-slate-600 font-bold uppercase text-xs">Your bag is empty</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-800">
                    {cart.map(item => (
                        <div key={item._id} className="py-6 flex items-center gap-6 group">
                            <div className="flex-1">
                                <h3 className="font-black text-white uppercase tracking-tight">{item.name}</h3>
                                <p className="text-teal-400 font-black text-xs mt-1">₹{item.price} / kg</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                                    <button onClick={() => updateQty(item._id, -1)} className="px-3 py-1 text-slate-500 hover:text-white">-</button>
                                    <span className="px-3 py-1 text-xs font-black text-white flex items-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item._id, 1)} className="px-3 py-1 text-slate-500 hover:text-white">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="text-red-500/30 hover:text-red-500 p-2 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </section>

          {/* Logistics Selection */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Method */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Delivery Method</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setDeliveryMethod('Store Pickup')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'Store Pickup' ? 'border-teal-500 bg-teal-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                        <Store size={20} />
                        <span className="text-[10px] font-black uppercase">Pickup</span>
                    </button>
                    <button 
                        onClick={() => setDeliveryMethod('Home Delivery')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'Home Delivery' ? 'border-teal-500 bg-teal-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                        <Truck size={20} />
                        <span className="text-[10px] font-black uppercase">Delivery</span>
                    </button>
                 </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Payment Selection</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setPaymentMethod('Cash')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Cash' ? 'border-teal-500 bg-teal-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                        <CreditCard size={20} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Post Paid (Cash)</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('GPay')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'GPay' ? 'border-teal-500 bg-teal-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                        <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center font-black text-[10px] text-slate-900">G</div>
                        <span className="text-[10px] font-black uppercase tracking-tight">GPay Pre-paid</span>
                    </button>
                 </div>
                 {paymentMethod === 'GPay' && (
                    <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-center animate-bounce">
                        <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest italic">Pay to: 8667897907</p>
                    </div>
                 )}
            </div>
          </section>

          {/* Address & Info */}
          <section className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Phone size={12} className="text-teal-400"/> Contact Phone</label>
                    <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter mobile number" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-teal-500 transition-colors font-bold text-sm"
                    />
                </div>
                {deliveryMethod === 'Home Delivery' && (
                    <div className="space-y-4 animate-in slide-in-from-right-10">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} className="text-teal-400"/> Delivery Address</label>
                        <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="2"
                            placeholder="Street, Landmark, City..." 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-teal-500 transition-colors font-bold text-sm"
                        />
                    </div>
                )}
             </div>
          </section>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 h-fit sticky top-24">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl -mr-10 -mt-10"></div>
                
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Checkout Summary</h2>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">Selected Grains</span>
                        <span className="text-white font-black">₹{totalPrice.toLocaleString()}</span>
                    </div>
                    {deliveryMethod === 'Home Delivery' && (
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">Delivery Fee</span>
                            <span className="text-teal-400 font-bold uppercase text-[10px] tracking-widest underline underline-offset-4 decoration-teal-500/30">Complimentary</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">Previous Kadan</span>
                        <span className="text-red-400 font-bold">₹{userInfo?.balance || 0}</span>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-800 mt-2">
                        <div className="flex justify-between items-baseline mb-8">
                            <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Total Due</span>
                            <span className="text-4xl font-black text-teal-400 tracking-tighter italic">₹{(totalPrice + (userInfo?.balance || 0)).toLocaleString()}</span>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0 || isOrdering}
                            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-20 text-slate-950 font-black uppercase tracking-widest p-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 group"
                        >
                            {isOrdering ? 'Securing Order...' : 'Confirm Shop Order'}
                            <CheckCircle2 size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center mt-8 leading-relaxed">
                    By confirming, you agree to Subra Rice Shop's premium delivery terms.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

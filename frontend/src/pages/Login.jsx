import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, AlertCircle, Phone, User as UserIcon, ArrowRight } from 'lucide-react';

const Login = () => {
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'customer'
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // for customer password-less login
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = 'http://localhost:5000/api/auth/login';
      let payload = { identifier, password };

      if (loginType === 'customer') {
        endpoint = 'http://localhost:5000/api/customer/login';
        payload = { phone };
      }

      const { data } = await axios.post(endpoint, payload);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      if (data.role === 'admin' || data.role === 'user') {
        navigate('/');
      } else if (data.role === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
        
        <div className="text-center relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter italic">LEO Smart <span className="text-teal-400">Order</span></h2>
          <p className="mt-2 text-slate-500 font-medium">Digital Logistics & Retail Terminal</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-950 rounded-2xl border border-slate-800 relative z-10">
          <button 
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'admin' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            <UserIcon size={16} /> Admin Hub
          </button>
          <button 
            type="button"
            onClick={() => setLoginType('customer')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'customer' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            <Phone size={16} /> Customer
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2 text-xs font-bold relative z-10">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleLogin}>
          <div className="space-y-4">
            {loginType === 'admin' ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-teal-500 outline-none transition-all text-slate-100 font-medium placeholder:text-slate-700"
                      placeholder="admin@smartrice.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Security PIN / Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-teal-500 outline-none transition-all text-slate-100 font-medium placeholder:text-slate-700"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1 animate-in slide-in-from-right duration-500">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Registered Phone No.</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-teal-500 outline-none transition-all text-slate-100 font-medium placeholder:text-slate-700"
                    placeholder="Enter your 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-2 ml-1 italic font-medium">OTP simulation active for verified numbers.</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-2xl shadow-teal-500/20 disabled:opacity-50 transform active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? 'Validating Access...' : (
              <>
                {loginType === 'customer' ? 'Launch Storefront' : 'Secure Sign In'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] font-black uppercase tracking-widest pt-4 relative z-10">
          <span className="text-slate-600 font-bold">New Employee? </span>
          <Link to="/signup" className="text-teal-500 hover:text-teal-400 underline underline-offset-4">
            Register for Branch Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

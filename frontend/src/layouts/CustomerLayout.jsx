import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Home, Search, Heart, Briefcase } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CustomerLayout = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/customer-dashboard', icon: <Home size={20} /> },
    { name: 'Shop Rice', path: '/customer-stock', icon: <Package size={20} /> },
    { name: 'My Orders', path: '/customer-purchases', icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar - Meesho Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/customer-dashboard" className="flex items-center gap-3 group">
            <img src="/leo-logo.png" alt="LEO Smart Order" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black text-slate-900 tracking-tighter">LEO<span className="text-teal-600 italic"> Smart Order</span></span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for Sona Masoori, Basmati, or Brown Rice..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-400 group"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'text-teal-600 bg-teal-50' 
                        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-2 md:gap-4 font-bold text-slate-700">
               <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
                  <Heart size={22} />
               </button>
               <Link to="/cart" className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
                  <ShoppingCart size={22} />
                  {totalItems > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-teal-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{totalItems}</span>}
               </Link>
               <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-widest leading-none">Vanakkam</p>
                    <p className="text-sm font-black text-slate-900 truncate max-w-[100px]">{userInfo?.name || 'Customer'}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                    <LogOut size={20} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
           <Outlet />
        </div>
      </main>

      {/* Simplified Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-teal-600 font-bold' : 'text-slate-400'}`}>
                {item.icon}
                <span className="text-[10px] uppercase font-black">{item.name}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400">
             <LogOut size={20} />
             <span className="text-[10px] uppercase font-black">Out</span>
          </button>
      </nav>
    </div>
  );
};

export default CustomerLayout;

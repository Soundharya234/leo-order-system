import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, TrendingUp, Users, Mic, MessageSquare, LogOut, Truck, Bell, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import VoiceCommand from '../components/VoiceCommand';
import { useCart } from '../context/CartContext';

function Sidebar() {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/notifications', config);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    if (userInfo?.token) fetchNotifications();
  }, [userInfo?.token]);

  if (!userInfo) return null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'POS / Billing', path: '/pos', icon: <ShoppingCart size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <TrendingUp size={20} /> },
    { name: 'Logistics', path: '/logistics', icon: <Truck size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-2xl shrink-0 relative">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <img src="/leo-logo.png" alt="LEO Smart Order" className="w-12 h-12 object-contain rounded-xl" />
            <div>
                <h1 className="text-xl font-extrabold text-teal-400 tracking-tight italic leading-none whitespace-nowrap">LEO Smart</h1>
                <p className="text-[10px] text-slate-400 mt-1 font-medium underline decoration-teal-500/30">ORDER SYSTEM</p>
            </div>
        </div>
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-teal-400 transition-all relative"
            >
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
                <div className="absolute left-0 mt-4 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-3xl z-50 animate-in slide-in-from-top-2 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-950 font-black text-[10px] tracking-widest uppercase text-slate-500">Live Alert Stream</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-600 text-[10px] font-black uppercase">No active alerts</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} className="p-4 border-b border-slate-800 hover:bg-slate-950 transition-colors">
                                    <div className="flex gap-3">
                                        {n.type === 'order' ? (
                                            <ShoppingCart size={14} className="text-teal-400" />
                                        ) : (
                                            <AlertTriangle size={14} className={n.priority === 'high' ? 'text-red-500' : 'text-amber-500'} />
                                        )}
                                        <div>
                                            <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 w-full rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.name === 'POS / Billing' && totalItems > 0 && (
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-4">
        <div className="flex justify-center gap-4">
          <VoiceCommand />
          <button className="p-3 bg-teal-500/10 text-teal-400 rounded-full hover:bg-teal-500/20 transition-colors shadow-lg" title="AI Assistant Chatbot">
            <MessageSquare size={20} />
          </button>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto bg-slate-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

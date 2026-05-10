import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Package, Users, TrendingUp } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/CustomerOrders';
import Cart from './pages/Cart';
import Analytics from './pages/Analytics';
import Logistics from './pages/Logistics';

import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Layout & Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>

          {/* Customer Layout & Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route element={<CustomerLayout />}>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/customer-stock" element={<CustomerDashboard />} />
              <Route path="/customer-purchases" element={<CustomerOrders />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Route>

          {/* Generic Protected Routes (Admin / User) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/products" element={<Inventory />} />
              <Route path="/my-data" element={<div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 h-fit mt-20"><h2 className="text-3xl font-black text-teal-400">My Profile Settings</h2><p className="text-slate-400 mt-2">Personal data management coming soon.</p></div>} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Filter, Edit2, Trash2, X, Check } from 'lucide-react';

const API_URL = "http://localhost:5000/api/products";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    description: '', 
    imageUrl: '', 
    reorderLevel: 20 
  });

  const [editId, setEditId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_URL, config);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, config);
      setFormData({ name: '', price: '', stock: '', description: '', imageUrl: '', reorderLevel: 20 });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      alert("Error adding product");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        fetchProducts();
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  // Edit Product (Start)
  const startEdit = (product) => {
    setEditId(product._id);
    setFormData({ 
        name: product.name, 
        price: product.price, 
        stock: product.stock,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        reorderLevel: product.reorderLevel || 20
    });
  };

  // Update Product
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, formData, config);
      setEditId(null);
      setFormData({ name: '', price: '', stock: '', description: '', imageUrl: '', reorderLevel: 20 });
      fetchProducts();
    } catch (error) {
      alert("Error updating product");
    }
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <Package className="text-teal-400" /> Smart Inventory
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Real-time MongoDB Product Management</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-500 text-slate-950 font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editId) && (
        <div className="bg-slate-900 border border-teal-500/30 p-6 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 w-full">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={editId ? (e) => e.preventDefault() : handleAddProduct}>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Name</label>
                <input 
                type="text" 
                placeholder="Product Name" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Price (₹)</label>
                <input 
                type="number" 
                placeholder="Price (₹)" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Stock (kg)</label>
                <input 
                type="number" 
                placeholder="Stock (kg)" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
                />
            </div>
            
            <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Description (Meesho Style)</label>
                <input 
                type="text" 
                placeholder="Premium quality grains, aged 12 months..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Low Stock Alert (kg)</label>
                <input 
                type="number" 
                placeholder="20" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                />
            </div>

            <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">Rice Photo URL</label>
                <input 
                type="text" 
                placeholder="https://images.unsplash.com/photo-..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
              {editId ? (
                <button 
                  type="button"
                  onClick={handleUpdateProduct}
                  className="bg-teal-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                >
                  Update Inventory
                </button>
              ) : (
                <button 
                  type="submit"
                  className="bg-teal-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                >
                  Save to Catalog
                </button>
              )}
            </div>
          </form>
        </div>
      )}


      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Price (₹)</th>
                <th className="px-6 py-4 font-semibold text-center">Stock (kg)</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-500">Loading from Database...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-500">No products found. Add your first product above!</td></tr>
              ) : (
                products.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 font-medium text-white">₹{item.price}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded font-mono text-slate-300">
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => startEdit(item)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(item._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

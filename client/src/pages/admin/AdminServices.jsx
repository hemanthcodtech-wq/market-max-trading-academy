import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';

const AdminServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', desc: '', points: '' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/services`);
      setItems(res.data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title || '',
        tag: item.tag || '',
        desc: item.desc || '',
        points: Array.isArray(item.points) ? item.points.join('\n') : Array.isArray(item.features) ? item.features.join('\n') : ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', tag: '', desc: '', points: '' });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        tag: formData.tag,
        desc: formData.desc,
        points: formData.points.split('\n').map(point => point.trim()).filter(Boolean)
      };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/services/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/services`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchItems();
      } catch (err) {
        console.error('Error deleting:', err);
        alert('Failed to delete item.');
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 font-inter bg-[#0B0F19] min-h-screen text-gray-300">
      <div className="bg-[#131722]/80 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-8 border border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            CMS Content
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white font-outfit tracking-tight">Manage Services</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all flex items-center gap-2.5 w-max text-sm group">
          <FaPlus size={12} className="group-hover:rotate-90 transition-transform" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="bg-[#131722]/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider pl-4">Title</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider">Tag</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider">Description</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">No records found.</td></tr>
                ) : items.map((item) => (
                  <tr key={item._id} className="border-b border-gray-800 hover:bg-[#1A202C]/50 transition-colors group">
                    <td className="py-4 pl-4">
                      <div className="font-bold text-gray-200">{item.title}</div>
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-400">{item.tag}</td>
                    <td className="py-4 text-sm font-medium text-gray-400">{item.desc}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(item)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors" title="Delete">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#131722] rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0B0F19]">
                <h3 className="text-xl font-bold text-white">{editingId ? 'Edit' : 'Add'} Service</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><FaTimes size={14}/></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
                  
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. One-to-One Trading Mentorship" className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tag</label>
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} placeholder="e.g. Personal Guidance" className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Description *</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} required placeholder="Explain what this service provides and who it is for." className="w-full resize-y rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" rows="6"></textarea>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Points</label>
                    <textarea name="points" value={formData.points} onChange={handleChange} placeholder={'Strict risk-to-reward setups\nLive market updates\nPractical trading guidance'} className="w-full resize-y rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" rows="5"></textarea>
                    <p className="mt-1 text-xs text-gray-500">Add one service point per line.</p>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-800 bg-[#0B0F19] flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" form="serviceForm" disabled={submitting} className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-70 flex items-center gap-2">
                  {submitting && <div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div>}
                  {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;

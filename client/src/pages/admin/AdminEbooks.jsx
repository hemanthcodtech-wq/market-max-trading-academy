import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';

const AdminEbooks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', rating: '', category: '', language: '', description: '', topics: '', downloadUrl: '' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ebooks`);
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
        subtitle: item.subtitle || '',
        rating: item.rating || '',
        category: item.category || '',
        language: item.language || '',
        description: item.description || '',
        topics: Array.isArray(item.topics) ? item.topics.join(', ') : '',
        downloadUrl: item.downloadUrl || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', subtitle: '', rating: '', category: '', language: '', description: '', topics: '', downloadUrl: '' });
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
        ...formData,
        topics: formData.topics ? formData.topics.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/ebooks/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ebooks`, payload, {
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
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/ebooks/${id}`, {
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
    <div className="p-4 md:p-8 space-y-6 font-inter bg-transparent min-h-screen text-gray-300">
      <div className="bg-white/[0.045] backdrop-blur-xl rounded-3xl p-5 lg:p-7 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3D36A] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D4AF37]/20">
            CMS Content
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white font-outfit tracking-tight">Manage E-Books</h1>
          <p className="text-sm text-gray-500 mt-1">Publish downloadable learning resources for your students.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#D4AF37] hover:bg-[#F3D36A] text-[#0B0F19] font-bold py-3 px-5 rounded-xl shadow-[0_8px_22px_rgba(212,175,55,0.18)] transition-all flex items-center gap-2.5 w-max text-sm group">
          <FaPlus size={12} className="group-hover:rotate-90 transition-transform" />
          <span>Add E-Book</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7">
          {items.map(item => (
            <motion.article key={item._id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.045] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:border-[#D4AF37]/40 transition-all duration-300 p-6 flex flex-col min-w-0 group">
              <div className="flex items-start justify-between gap-3 mb-5"><div className="min-w-0"><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F3D36A]">{item.category || 'Learning Resource'}</span><h2 className="mt-2 text-lg font-black text-white leading-snug break-words">{item.title}</h2></div><div className="flex items-center gap-1.5 shrink-0"><button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#F3D36A] hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-all" title="Edit"><FaEdit size={12} /></button><button onClick={() => handleDelete(item._id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all" title="Delete"><FaTrash size={12} /></button></div></div>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.subtitle || item.description || 'No subtitle provided.'}</p>
              <div className="mt-auto pt-5 mt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-xs"><div><span className="block text-[10px] uppercase tracking-wider text-gray-500">Language</span><span className="font-bold text-gray-200">{item.language || 'English'}</span></div><div><span className="block text-[10px] uppercase tracking-wider text-gray-500">Rating</span><span className="font-bold text-[#F3D36A]">{item.rating || 'N/A'}</span></div></div>
            </motion.article>
          ))}
          {items.length === 0 && <div className="col-span-full py-16 text-center text-gray-500 bg-[#0B0F19]/40 rounded-3xl border border-dashed border-gray-700">No e-books found. Click "Add E-Book" to create one.</div>}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="relative w-full max-w-2xl h-full bg-[#131722] border-l border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#0B0F19]">
                <h3 className="text-xl font-bold text-white">{editingId ? 'Edit' : 'Add'} Ebook</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><FaTimes size={14}/></button>
              </div>
              <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar">
                <form id="ebookForm" onSubmit={handleSubmit} className="space-y-5">
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Subtitle</label>
                    <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange}  placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange}  placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rating</label>
                    <input type="text" name="rating" value={formData.rating} onChange={handleChange}  placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Language</label>
                    <input type="text" name="language" value={formData.language} onChange={handleChange}  placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}  className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" rows="4"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">PDF Google Drive Link</label>
                    <input type="url" name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} required placeholder="https://drive.google.com/file/d/.../view" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                    <p className="mt-1 text-xs text-gray-500">Set the PDF permission to “Anyone with the link”, then paste the view link here.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Topics (comma separated)</label>
                    <input type="text" name="topics" value={formData.topics} onChange={handleChange}  placeholder="" className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                </form>
              </div>
              <div className="p-5 md:p-6 border-t border-white/10 bg-[#0B0F19] flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" form="ebookForm" disabled={submitting} className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-70 flex items-center gap-2">
                  {submitting && <div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div>}
                  {editingId ? 'Save Changes' : 'Create Ebook'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEbooks;

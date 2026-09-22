import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTelegramPlane, 
  FaInstagram, FaFacebookF, FaPaperPlane, FaCheckCircle, 
  FaTwitter, FaYoutube
} from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiBase}/contact/submit`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        queryType: 'Contact Page Inquiry',
        message: formData.message
      });

      if (res.data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We will reply to your email shortly.'
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: res.data.message || 'Failed to send message. Please try Telegram or calling us directly.'
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Could not send message right now. Please reach us via Telegram or Phone.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F19] pb-16 min-h-screen font-inter text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full inline-block mb-3">
            MarketMax Support & Admissions
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 font-outfit">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about our trading strategies, courses, or live sessions? We are here to help you navigate your trading journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#131722] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
          
          {/* Left Column: Contact & Campus Info (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 sm:p-10 md:p-12 text-white relative overflow-hidden flex flex-col justify-between border-r border-gray-800">
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-10 right-10 w-40 h-40 bg-[#16A34A]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-outfit">Contact Information</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Connect directly with our trading mentors and support team.
                </p>
              </div>
              
              <div className="space-y-6 pt-2">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E293B] flex items-center justify-center shrink-0 border border-gray-700 shadow-xs">
                    <FaPhoneAlt size={16} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Us</p>
                    <a href="tel:+919652357824" className="font-bold text-sm sm:text-base text-white hover:text-[#D4AF37] transition-colors block mt-0.5">
                      +91 96523 57824
                    </a>
                    <span className="text-[11px] text-gray-500 block mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM IST</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E293B] flex items-center justify-center shrink-0 border border-gray-700 shadow-xs">
                    <FaEnvelope size={16} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Us</p>
                    <a href="mailto:support@marketmaxtradingacademy.com" className="font-bold text-sm sm:text-base text-white hover:text-[#D4AF37] transition-colors block mt-0.5">
                      support@marketmaxtradingacademy.com
                    </a>
                    <span className="text-[11px] text-gray-500 block mt-0.5">24/7 Electronic Helpdesk Support</span>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E293B] flex items-center justify-center shrink-0 border border-gray-700 shadow-xs">
                    <FaMapMarkerAlt size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Headquarters</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-300 leading-relaxed mt-1">
                      B Block - 505, Northface Grandeur Apartments,<br />
                      Hyderabad, Telangana - 500001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels in Contact Card */}
            <div className="relative z-10 pt-8 border-t border-gray-700 mt-8 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Official Social Channels</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="https://www.instagram.com/marketmaxtradingacademy?stkn=MWxuaWViNnJmeXAz" target="_blank" rel="noreferrer" title="Instagram" className="w-10 h-10 rounded-2xl bg-[#1E293B] hover:bg-[#E1306C] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 border border-gray-700">
                  <FaInstagram size={17} />
                </a>
                <a href="https://www.facebook.com/share/19FotYbrnd/" target="_blank" rel="noreferrer" title="Facebook" className="w-10 h-10 rounded-2xl bg-[#1E293B] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 border border-gray-700">
                  <FaFacebookF size={15} />
                </a>
                <a href="https://t.me/MarketMaxTradingAcademy" target="_blank" rel="noreferrer" title="Telegram" className="w-10 h-10 rounded-2xl bg-[#1E293B] hover:bg-[#0088cc] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 border border-gray-700">
                  <FaTelegramPlane size={18} />
                </a>
                <a href="https://x.com/MarketMaxTradin" target="_blank" rel="noreferrer" title="Twitter" className="w-10 h-10 rounded-2xl bg-[#1E293B] hover:bg-[#1DA1F2] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 border border-gray-700">
                  <FaTwitter size={15} />
                </a>
                <a href="https://www.youtube.com/@MarketMaxTradingAcademy" target="_blank" rel="noreferrer" title="YouTube" className="w-10 h-10 rounded-2xl bg-[#1E293B] hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 border border-gray-700">
                  <FaYoutube size={17} />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white tracking-tight font-outfit">Send us a Message</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Fill in your details below. Our team will get back to you promptly.</p>
            </div>

            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-3 ${
                    status.type === 'success' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {status.type === 'success' && <FaCheckCircle className="text-green-500 shrink-0 text-base" />}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Rahul Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-gray-700 rounded-xl focus:bg-[#0F172A] focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm text-white font-medium transition-all"
                  />
                </div>
                
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                  <input 
                    type="tel"
                    placeholder="e.g. 9652357824"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-gray-700 rounded-xl focus:bg-[#0F172A] focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm text-white font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-700 rounded-xl focus:bg-[#0F172A] focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm text-white font-medium transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message *</label>
                <textarea 
                  required 
                  rows="4"
                  placeholder="How can we assist you with your trading journey?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-700 rounded-xl focus:bg-[#0F172A] focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm text-white font-medium transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0F19] font-extrabold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={14} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

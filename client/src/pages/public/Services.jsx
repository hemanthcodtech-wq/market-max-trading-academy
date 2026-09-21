import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';


import axios from 'axios';
import SEO from '../../components/common/SEO';

const getServiceIcon = (title = '') => {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('call') || normalizedTitle.includes('signal')) return FaIcons.FaSignal;
  if (normalizedTitle.includes('account') || normalizedTitle.includes('portfolio')) return FaIcons.FaBriefcase;
  if (normalizedTitle.includes('tool') || normalizedTitle.includes('indicator')) return FaIcons.FaChartLine;
  if (normalizedTitle.includes('journal') || normalizedTitle.includes('tracker')) return FaIcons.FaClipboardList;
  if (normalizedTitle.includes('community')) return FaIcons.FaUsers;
  if (normalizedTitle.includes('live')) return FaIcons.FaVideo;
  if (normalizedTitle.includes('doubt')) return FaIcons.FaQuestionCircle;
  if (normalizedTitle.includes('book') || normalizedTitle.includes('study')) return FaIcons.FaBookOpen;
  return FaIcons.FaChalkboardTeacher;
};

const Services = () => {
  const [SERVICES, setSERVICES] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCat, setSelectedCat] = useState('All');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/services`);
        setSERVICES(res.data.data);
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="min-h-screen bg-[#06080e] text-gray-300 font-inter pt-24 pb-20">
      <SEO
        title="Trading Services & Support | MarketMax Trading Academy"
        description="Explore our full suite of professional trading services: Premium Calls, One-to-One Mentorship, Live Market Sessions, Trading Tools, and Community Support."
      />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaIcons.FaMagic /> Complete Trader Support Ecosystem
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-outfit text-white tracking-tight leading-tight">
            OUR PROFESSIONAL <br />
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
              TRADING SERVICES
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mt-4 leading-relaxed font-medium">
            From live market floor trading and personalized 1-on-1 mentorship to institutional indicators and VIP signals, we provide everything you need to trade with complete confidence.
          </p>
        </div>

        {/* Services Grid (10 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <div className="col-span-full text-center py-10">Loading...</div> : SERVICES.map((svc, index) => {
            const Icon = getServiceIcon(svc.title);
            return (
              <motion.div
                key={svc._id || svc.id || svc.num || svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glossy-card group flex min-h-[300px] flex-col justify-between rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/50"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="text-2xl font-black text-gray-600 transition-colors group-hover:text-[#D4AF37]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-black uppercase text-[#D4AF37]">
                      {svc.tag}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-700 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-xl text-[#D4AF37] shadow-md">
                      <Icon />
                    </div>
                    <h3 className="font-outfit text-xl font-black leading-snug text-white transition-colors group-hover:text-[#D4AF37]">
                      {svc.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {svc.desc}
                  </p>
                  {((svc.points || svc.features || []).length > 0) && (
                    <div className="mt-6 space-y-2 border-t border-gray-800/80 pt-4">
                      {(svc.points || svc.features || []).map((point, pointIndex) => (
                        <div key={`${svc._id || svc.title}-point-${pointIndex}`} className="flex items-start gap-2 text-sm text-gray-300">
                          <FaIcons.FaCheckCircle className="mt-0.5 shrink-0 text-[12px] text-emerald-400" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-800/80 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">MarketMax service</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Contact & Consultation Banner */}
        <div className="mt-16 glossy-black rounded-3xl p-8 md:p-12 border border-[#D4AF37]/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <span className="text-xs uppercase font-black text-[#D4AF37] tracking-wider mb-2 block">
              Direct Desk Assistance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
              Need Help Choosing the Right Service?
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Speak directly with our senior trading counselors. We will evaluate your current experience, available capital, and recommend the best roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-[#D4AF37] text-[#0B0F19] font-black text-sm text-center hover:bg-[#F3E5AB] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
            >
              Contact Support
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
            >
              <FaIcons.FaWhatsapp size={16} /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

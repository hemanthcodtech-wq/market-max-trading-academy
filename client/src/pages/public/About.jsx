import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaChartLine, FaChartPie, FaGlobe, FaAward, FaUsers,
  FaBookOpen, FaHandsHelping, FaShieldAlt, FaArrowRight,
  FaCheckCircle, FaSun, FaMoon, FaBrain
} from 'react-icons/fa';

const About = () => {
  const { t } = useLanguage();

  const [siteStats, setSiteStats] = useState({
    studentsCount: 15000,
    studentsSuffix: '+',
    studentsLabel: 'Profitable Traders',
    coursesCount: 25,
    coursesSuffix: '+',
    coursesLabel: 'Trading Strategies',
    lineageRate: 100,
    lineageSuffix: '%',
    lineageLabel: 'Practical Market Setups',
    communitiesCount: 15,
    communitiesSuffix: '+',
    communitiesLabel: 'Global Communities'
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/settings/stats`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setSiteStats(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { value: `${siteStats.studentsCount?.toLocaleString('en-IN') || '15,000'}${siteStats.studentsSuffix || '+'}`, label: siteStats.studentsLabel || 'Profitable Traders', icon: FaUsers },
    { value: `${siteStats.coursesCount || '25'}${siteStats.coursesSuffix || '+'}`, label: siteStats.coursesLabel || 'Trading Strategies', icon: FaBookOpen },
    { value: `${siteStats.lineageRate || '100'}${siteStats.lineageSuffix || '%'}`, label: siteStats.lineageLabel || 'Practical Market Setups', icon: FaAward },
    { value: `${siteStats.communitiesCount || '15'}${siteStats.communitiesSuffix || '+'}`, label: siteStats.communitiesLabel || 'Global Communities', icon: FaGlobe }
  ];

  const pillars = [
    {
      title: 'Technical Analysis',
      desc: 'Master price action, support & resistance, and advanced candlestick patterns.',
      icon: FaChartLine,
      color: 'from-[#16A34A]/10 to-[#16A34A]/5 text-[#16A34A] border-[#16A34A]/20'
    },
    {
      title: 'Trading Psychology',
      desc: 'Develop the emotional discipline and mindset required for consistent profitability.',
      icon: FaBrain,
      color: 'from-[#D4AF37]/10 to-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/20'
    },
    {
      title: 'Risk Management',
      desc: 'Learn strict position sizing and capital preservation techniques to protect your portfolio.',
      icon: FaShieldAlt,
      color: 'from-[#DC2626]/10 to-[#DC2626]/5 text-[#DC2626] border-[#DC2626]/20'
    },
    {
      title: 'Options Strategies',
      desc: 'Advanced options buying and selling strategies for consistent monthly income.',
      icon: FaChartPie,
      color: 'from-blue-500/10 to-blue-500/5 text-blue-500 border-blue-500/20'
    }
  ];

  return (
    <div className="bg-[#0B0F19] text-gray-300 font-inter min-h-screen overflow-hidden">
      
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 lg:pt-32 lg:pb-32 overflow-hidden border-b border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#16A34A]/10 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Content */}
            <div className="text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 shadow-xs"
              >
                <FaChartLine className="text-[#D4AF37] text-base animate-pulse" />
                <span>LEARN | ANALYZE | TRADE | GROW</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-white tracking-tight leading-tight"
              >
                About MarketMax <br className="hidden lg:block"/> Trading Academy
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-32 h-1.5 bg-gradient-to-r from-[#16A34A] via-[#D4AF37] to-[#DC2626] mx-auto lg:mx-0 rounded-full my-6"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Empowering traders with professional stock market education, live market analysis, and proven strategies to achieve financial independence.
              </motion.p>
            </div>

            {/* Hero Image / Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800"
            >
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" 
                alt="Trading Charts" 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80 mix-blend-lighten"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/20" />
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-20 max-w-6xl mx-auto z-20 relative"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#1E293B] p-6 rounded-3xl border border-gray-700 shadow-sm flex flex-col items-center justify-center text-center hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-xl mb-3">
                    <Icon />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white font-outfit">{stat.value}</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">{stat.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Pillars Section ──────────────── */}
      <section className="py-20 lg:py-32 bg-[#0F172A] relative border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full mb-3">
              <FaChartLine /> Core Framework
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-outfit text-white tracking-tight">
              The Four Pillars of Trading
            </h2>
            <div className="w-20 h-1 bg-[#16A34A] mx-auto rounded-full my-4"></div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Our comprehensive curriculum is built on these four fundamental pillars to ensure you receive a well-rounded and actionable trading education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${pillar.color} p-7 rounded-[2rem] border shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] shadow-xs flex items-center justify-center text-2xl mb-5">
                      <Icon />
                    </div>
                    <h3 className="text-xl font-bold font-outfit text-white mb-3">{pillar.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{pillar.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── Mission & Vision Visual Storytelling ─────────────────── */}
      <section className="py-20 lg:py-32 bg-[#0B0F19] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
             <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-[350px] lg:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800"
            >
              <img 
                src="https://images.unsplash.com/photo-1642543492481-44e81e3914a5?q=80&w=2070&auto=format&fit=crop" 
                alt="Mission & Vision" 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-90" />
              <div className="absolute bottom-10 left-10 right-10">
                <blockquote className="text-xl sm:text-2xl font-serif italic font-bold text-white leading-relaxed">
                  "Trading is not about predicting the market, but reacting to it with discipline, strategy, and impeccable risk management."
                </blockquote>
              </div>
            </motion.div>

            <div className="space-y-8">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#131722] rounded-[2rem] p-8 sm:p-10 shadow-xl border border-gray-800 group hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-black uppercase tracking-wider mb-4">
                  <FaSun /> Purpose & Action
                </div>
                <h3 className="text-2xl font-black font-outfit text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  To democratize professional trading education by providing retail traders with the institutional-grade tools, knowledge, and strategies required to succeed in the stock market.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] rounded-[2rem] p-8 sm:p-10 shadow-xl border border-gray-800 group hover:border-[#16A34A]/50 transition-colors"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-xs font-black uppercase tracking-wider mb-4">
                  <FaGlobe /> Global Aspiration
                </div>
                <h3 className="text-2xl font-black font-outfit text-white mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  To build a global community of financially independent individuals who navigate the markets with discipline, objective analysis, and a winning mindset.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action (CTA) ─────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#0F172A] relative overflow-hidden border-t border-[#D4AF37]/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#16A34A] rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tight text-white">
            Ready to Start Trading?
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of traders who have transformed their financial journey with our structured strategies and live mentorship.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-gray-900 hover:bg-[#F3E5AB] font-extrabold rounded-2xl text-base sm:text-lg shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Explore Our Courses</span>
              <FaArrowRight size={14} />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#1E293B] hover:bg-[#334155] text-white border border-gray-600 font-bold rounded-2xl text-base sm:text-lg transition-all flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;

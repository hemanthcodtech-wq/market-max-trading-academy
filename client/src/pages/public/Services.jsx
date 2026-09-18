import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSignal, FaUserCheck, FaChartPie, FaBook, FaTools,
  FaBookOpen, FaUserTie, FaVideo, FaQuestionCircle, FaUsers,
  FaCheckCircle, FaArrowRight, FaWhatsapp, FaShieldAlt, FaMagic
} from 'react-icons/fa';
import SEO from '../../components/common/SEO';

const SERVICES = [
  {
    id: 'premium-calls',
    num: '01',
    title: 'Premium Calls Group',
    icon: FaSignal,
    tag: 'High Precision',
    color: 'from-emerald-500/20 to-emerald-950/10',
    borderColor: 'border-emerald-500/30',
    desc: 'Actionable intraday & swing trading setups in NIFTY, BANK NIFTY and high-beta equities with exact entry, stop loss, and tiered target levels.',
    features: [
      'Strict 1:2 to 1:3 Risk-Reward setups',
      'Real-time Telegram & WhatsApp trade alerts',
      'Live SL trailing & target hit updates',
      'Zero gambling — backed by SMC & price action logic'
    ],
    cta: 'Inquire for VIP Access'
  },
  {
    id: 'account-services',
    num: '02',
    title: 'Trading Account Services',
    icon: FaUserCheck,
    tag: 'Priority Onboarding',
    color: 'from-blue-500/20 to-blue-950/10',
    borderColor: 'border-blue-500/30',
    desc: 'Hassle-free account opening and setup with India’s top discount brokerages (Zerodha, Dhan, Angel One, Fyers) plus exclusive algorithmic API integrations.',
    features: [
      'Lowest margin & zero AMC account assistance',
      'TradingView webhook and algo terminal linking',
      'Direct priority broker support channels',
      'Pre-configured chart layout and layout templates'
    ],
    cta: 'Open Partner Account'
  },
  {
    id: 'portfolio-education',
    num: '03',
    title: 'Portfolio/Market Education Support',
    icon: FaChartPie,
    tag: 'Wealth Building',
    color: 'from-purple-500/20 to-purple-950/10',
    borderColor: 'border-purple-500/30',
    desc: 'Comprehensive educational reviews for your existing equity portfolio, multi-asset allocation frameworks, and hedging long-term holdings using derivatives.',
    features: [
      'Sector rotation & market cycle analysis',
      'Equity portfolio health audits & beta checks',
      'Hedging strategies using Index Put Options',
      'Fundamental scorecard on top holdings'
    ],
    cta: 'Request Portfolio Audit'
  },
  {
    id: 'ebooks-materials',
    num: '04',
    title: 'E-books & Study Materials',
    icon: FaBook,
    tag: 'Digital Library',
    color: 'from-amber-500/20 to-amber-950/10',
    borderColor: 'border-amber-500/30',
    desc: 'Curated library of high-impact PDF playbooks, candlestick cheat sheets, options adjustment guides, and NISM exam practice question banks.',
    features: [
      '15+ downloadable strategy playbooks',
      'High-resolution candlestick & chart pattern cards',
      'Options Greeks & adjustment blueprints',
      'Available in English & Telugu languages'
    ],
    cta: 'Browse E-Books'
  },
  {
    id: 'trading-tools',
    num: '05',
    title: 'Trading Tools & Indicators',
    icon: FaTools,
    tag: 'Institutional Edge',
    color: 'from-teal-500/20 to-teal-950/10',
    borderColor: 'border-teal-500/30',
    desc: 'Custom TradingView Pine Script indicators, liquidity level plotters, automated order block finders, and institutional volume flow screeners.',
    features: [
      'Proprietary SMC Order Block Indicator',
      'Multi-timeframe fair value gap (FVG) scanner',
      'Automated Fibonacci swing retracement tool',
      'Lifetime script access with future updates'
    ],
    cta: 'Explore Trading Tools'
  },
  {
    id: 'trade-journal',
    num: '06',
    title: 'Trade Journal / Trading Tracker',
    icon: FaBookOpen,
    tag: 'Discipline & Metric',
    color: 'from-rose-500/20 to-rose-950/10',
    borderColor: 'border-rose-500/30',
    desc: 'Automated analytical trade logging software designed to audit your win rate, expectancy, drawdown ceiling, and psychological error patterns.',
    features: [
      'Daily P&L, Sharpe ratio, and profit factor analytics',
      'Psychology leak tracker (FOMO, early exit, revenge)',
      'Automated trade screenshot & setup categorization',
      'Exportable tax-compliant trading performance reports'
    ],
    cta: 'Get Trading Journal'
  },
  {
    id: 'one-to-one-mentorship',
    num: '07',
    title: 'One-to-One Mentorship',
    icon: FaUserTie,
    tag: 'Personalized Coaching',
    color: 'from-yellow-500/20 to-yellow-950/10',
    borderColor: 'border-yellow-500/30',
    desc: 'Direct private desk coaching with senior SEBI/NISM certified faculty. Tailored to your capital size, risk tolerance, and trading schedule.',
    features: [
      'Dedicated 1-on-1 weekly Zoom screen reviews',
      'Personalized trading plan & risk blueprint creation',
      'Real-time live market trade audit & corrections',
      'Direct WhatsApp lifeline to mentor for live doubts'
    ],
    cta: 'Book Mentorship Call'
  },
  {
    id: 'live-sessions',
    num: '08',
    title: 'Live Market Sessions',
    icon: FaVideo,
    tag: 'Real-time Execution',
    color: 'from-red-500/20 to-red-950/10',
    borderColor: 'border-red-500/30',
    desc: 'Trade side-by-side with seasoned mentors during NSE opening hours (9:15 AM – 11:30 AM). Witness real order execution, market structure, and live adjustments.',
    features: [
      'Daily pre-market prep from 9:00 AM IST',
      'Live screen sharing of NIFTY & BANK NIFTY charts',
      'Immediate commentary on live order flow & OI changes',
      'Interactive microphone access for student questions'
    ],
    cta: 'Join Live Trading Floor'
  },
  {
    id: 'doubt-clearing',
    num: '09',
    title: 'Doubt-Clearing Sessions',
    icon: FaQuestionCircle,
    tag: 'Every Weekend',
    color: 'from-cyan-500/20 to-cyan-950/10',
    borderColor: 'border-cyan-500/30',
    desc: 'Comprehensive weekend interactive workshops dedicated to breaking down student trades, analyzing errors, and answering theoretical concepts.',
    features: [
      'Every Saturday interactive 2-hour Zoom workshop',
      'In-depth review of student trade logs & setups',
      'Case studies on top weekly market turning points',
      'Open mic session — no question left unanswered'
    ],
    cta: 'Attend Next Doubt Session'
  },
  {
    id: 'community-group',
    num: '10',
    title: 'Community / Discussion Group',
    icon: FaUsers,
    tag: 'Traders Network',
    color: 'from-indigo-500/20 to-indigo-950/10',
    borderColor: 'border-indigo-500/30',
    desc: 'Connect with a thriving network of 15,000+ passionate retail and institutional traders. Share charts, discuss setups, and grow together.',
    features: [
      'Categorized Discord & Telegram channels',
      'Separate breakout rooms for Equity, F&O, and Crypto',
      'Daily watchlist and sentiment polls',
      'Strict spam-free and respectful moderation'
    ],
    cta: 'Join Traders Community'
  }
];

const Services = () => {
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
            <FaMagic /> Complete Trader Support Ecosystem
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
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`glossy-card rounded-2xl p-6 border flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 ${svc.borderColor}`}
              >
                <div>
                  {/* Top bar with number and tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-outfit text-gray-600">
                      {svc.num}
                    </span>
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                      {svc.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-gray-700 flex items-center justify-center text-[#D4AF37] text-xl shadow-md">
                      <Icon />
                    </div>
                    <h3 className="text-xl font-black text-white font-outfit leading-snug">
                      {svc.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">
                    {svc.desc}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2 mb-6 border-t border-gray-800/80 pt-4">
                    {svc.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0 text-[11px]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <Link
                  to="/contact"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C99C29] text-[#0B0F19] font-black text-xs text-center flex items-center justify-center gap-2 hover:from-[#F3E5AB] hover:to-[#D4AF37] transition-all shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  {svc.cta} <FaArrowRight size={10} />
                </Link>
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
              <FaWhatsapp size={16} /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

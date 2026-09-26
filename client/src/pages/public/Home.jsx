import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaClock, FaStar, FaArrowRight, FaCheckCircle, FaAward,
  FaChalkboardTeacher, FaGraduationCap, FaChartLine, FaChartPie,
  FaShieldAlt, FaBrain, FaPlayCircle, FaBolt, FaFire, FaEye,
  FaSearchPlus, FaUsers, FaArrowUp, FaArrowDown, FaCompass,
  FaExchangeAlt, FaRegLightbulb, FaTimes, FaCalendarAlt
} from 'react-icons/fa';
import { useLanguage, useAutoTranslate } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';
import TradingViewWidget from '../../components/common/TradingViewWidget';
import LiveMarketCards from '../../components/common/LiveMarketCards';
import HomeLiveInsights from '../../components/common/HomeLiveInsights';

// ──────────────────────────────────────────────────────────────────
// 1. ANIMATED COUNTER
// ──────────────────────────────────────────────────────────────────
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }) => {
  const nodeRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (hasAnimated && nodeRef.current) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeProgress * (to - from) + from);

        if (nodeRef.current) {
          nodeRef.current.textContent = currentVal.toLocaleString('en-IN') + suffix;
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [from, to, duration, suffix, hasAnimated]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
};

// ──────────────────────────────────────────────────────────────────
// 2. LIVE COUNTDOWN TO 9:15 AM MARKET OPEN
// ──────────────────────────────────────────────────────────────────
const MarketSessionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isOpen: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Indian Standard Time
      const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const istDate = new Date(istString);

      const day = istDate.getDay();
      const isWeekend = (day === 0 || day === 6);

      const openTime = new Date(istDate);
      openTime.setHours(9, 15, 0, 0);

      const closeTime = new Date(istDate);
      closeTime.setHours(15, 30, 0, 0);

      if (!isWeekend && istDate >= openTime && istDate <= closeTime) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isOpen: true });
        return;
      }

      let target = new Date(istDate);
      if (istDate > closeTime || isWeekend) {
        let daysToAdd = 1;
        if (day === 5 && istDate > closeTime) daysToAdd = 3;
        else if (day === 6) daysToAdd = 2;
        else if (day === 0) daysToAdd = 1;
        target.setDate(target.getDate() + daysToAdd);
      }
      target.setHours(9, 15, 0, 0);

      const diff = Math.max(0, target.getTime() - istDate.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isOpen: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#131722]/80 backdrop-blur-md border border-gray-800 text-xs">
      <span className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${timeLeft.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
        <span className="font-bold text-gray-300">
          {timeLeft.isOpen ? 'LIVE FLOOR ACTIVE' : 'NEXT LIVE FLOOR SESSION'}
        </span>
      </span>
      <span className="text-gray-500">|</span>
      {timeLeft.isOpen ? (
        <span className="font-black text-emerald-400">MARKET IS OPEN NOW</span>
      ) : (
        <span className="font-mono font-bold text-[#D4AF37]">
          {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 3. PRO TRADING SETUP CARD WITH HOVER PIC PREVIEW EFFECT
// ──────────────────────────────────────────────────────────────────
const TRADING_SETUPS = [
  {
    id: 'smc-orderblock',
    title: 'Bullish Order Block & Retest (SMC)',
    badge: 'INSTITUTIONAL SMC',
    badgeColor: 'from-emerald-500 to-teal-600',
    winRate: '78%',
    riskReward: '1 : 3.5',
    timeframe: '15m / 1 Hour',
    assetClass: 'Nifty, BankNifty, Stocks',
    description: 'Pinpoints institutional footprint accumulation where smart money absorbs sell orders before expanding upward.',
    image: '/images/setup_orderblock.jpg',
    levels: { entry: '₹25,340', sl: '₹25,280 (-60 pts)', tp1: '₹25,550 (+210 pts)', tp2: '₹25,760 (+420 pts)' },
    features: ['Institutional Footprint Trap', 'Clean Stop Invalidation', 'Multi-target Partial Booking']
  },
  {
    id: 'options-gamma-scalp',
    title: 'Zero-to-Hero Expiry Options Scalp',
    badge: 'OPTIONS BUYING',
    badgeColor: 'from-amber-500 to-yellow-600',
    winRate: '74%',
    riskReward: '1 : 4.2',
    timeframe: '3m / 5m Scalping',
    assetClass: 'BankNifty & FinNifty Expiry',
    description: 'Harnesses aggressive post-1:30 PM gamma explosion and short-covering momentum with strictly capped capital risk.',
    image: '/images/setup_options_scalp.jpg',
    levels: { entry: 'Strike CE 52,200 @ ₹28', sl: '₹14 (Strict -50%)', tp1: '₹65 (+132%)', tp2: '₹115 (+310%)' },
    features: ['Gamma Acceleration Filter', 'Zero Overnight Risk', 'Rule-based Capital Capping']
  },
  {
    id: 'fvg-liquidity-sweep',
    title: 'Fair Value Gap (FVG) Liquidity Sweep',
    badge: 'PRICE ACTION',
    badgeColor: 'from-cyan-500 to-blue-600',
    winRate: '79%',
    riskReward: '1 : 3.0',
    timeframe: '5m / 15m Intraday',
    assetClass: 'Indices & US Tech Futures',
    description: 'Exploits algorithmic market imbalances where rapid order velocity left unmitigated orders ready for sniper retests.',
    image: '/images/setup_smc_fvg.jpg',
    levels: { entry: '4173.00 Demand Zone', sl: '4163.50 Below Wick', tp1: '4215.00 (+42 pts)', tp2: '4240.00 (+67 pts)' },
    features: ['3-Candle Imbalance Trap', 'False Breakout Reversal', 'High Asymmetry Edge']
  },
  {
    id: 'live-trading-floor',
    title: 'Live 9:15 AM Floor Execution Desk',
    badge: 'MENTORSHIP DESK',
    badgeColor: 'from-purple-500 to-indigo-600',
    winRate: '82%',
    riskReward: 'Systematic Trailing',
    timeframe: 'Market Hours (9:15 - 11:30 AM)',
    assetClass: 'Live Indian Equities & F&O',
    description: 'Trade screen-to-screen alongside registered mentors with live microphone commentary, market depth, and risk audits.',
    image: '/images/trading_floor_mentor.jpg',
    levels: { entry: 'Live Voice Stream', sl: 'Portfolio Max 1.5%', tp1: 'Trailing Profit Lock', tp2: 'Daily Target Hit' },
    features: ['Screen Share with Voice', 'Pre-Market Bias Briefing', 'Live Psychological Guardrails']
  }
];

const SetupHoverCard = ({ setup, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-gradient-to-b from-[#131722] to-[#0D111A] rounded-2xl border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] flex flex-col"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 8}deg) rotateX(${-(mousePos.y - 0.5) * 8}deg)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
        transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Top Banner with Image Preview on Hover */}
      <div className="relative w-full h-56 bg-[#0B0F19] overflow-hidden cursor-pointer" onClick={() => onOpenModal(setup)}>
        {/* Background Image with Zoom and Brightness Shift */}
        <img
          src={setup.image}
          alt={setup.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-80 opacity-90'
          }`}
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-black/40 pointer-events-none" />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white bg-gradient-to-r ${setup.badgeColor} shadow-md`}>
            {setup.badge}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-gray-300 border border-gray-700 backdrop-blur-md">
            {setup.timeframe}
          </span>
        </div>

        {/* Hover Inspect Indicator */}
        <div className={`absolute top-3 right-3 z-10 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#D4AF37] text-[#0B0F19] shadow-lg">
            <FaSearchPlus className="text-xs" /> Click to Inspect
          </span>
        </div>

        {/* Floating Setup Metric Strip inside Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-700/60 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-medium">Win:</span>
            <span className="font-extrabold text-emerald-400">{setup.winRate}</span>
          </div>
          <div className="h-3 w-[1px] bg-gray-700" />
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-medium">R:R:</span>
            <span className="font-extrabold text-[#D4AF37] whitespace-nowrap">{setup.riskReward}</span>
          </div>
          <div className="h-3 w-[1px] bg-gray-700" />
          <div className="flex items-center gap-1 truncate max-w-[100px]">
            <span className="text-gray-400 font-medium">Asset:</span>
            <span className="font-bold text-gray-200 truncate">{setup.assetClass}</span>
          </div>
        </div>

        {/* Animated Crosshair Lens on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/50 flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-outfit mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {setup.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
            {setup.description}
          </p>

          {/* Key Trade Levels Telemetry */}
          <div className="bg-[#0B0F19] rounded-xl p-3 border border-gray-800/80 mb-4 space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Entry Zone:</span>
              <span className="font-mono font-bold text-blue-400">{setup.levels.entry}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Stop Invalidation:</span>
              <span className="font-mono font-bold text-rose-400">{setup.levels.sl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Target 1 & 2:</span>
              <span className="font-mono font-bold text-emerald-400">{setup.levels.tp1}</span>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-1.5 mb-4">
            {setup.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <FaCheckCircle className="text-[#D4AF37] text-[10px] flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onOpenModal(setup)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#161F2E] hover:from-[#D4AF37] hover:to-[#E5C158] hover:text-[#0B0F19] text-gray-300 border border-gray-700 hover:border-transparent font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
        >
          <FaEye className="text-xs" /> View Full Chart Blueprint & Rules
        </button>
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 4. SETUP DETAIL MODAL (LIGHTBOX ZOOM)
// ──────────────────────────────────────────────────────────────────
const SetupModal = ({ setup, onClose }) => {
  if (!setup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#131722] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-[#0B0F19] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white bg-gradient-to-r ${setup.badgeColor}`}>
              {setup.badge}
            </span>
            <h3 className="text-lg font-bold text-white font-outfit">{setup.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative bg-black w-full max-h-[500px] overflow-hidden flex items-center justify-center">
          <img src={setup.image} alt={setup.title} className="w-full h-auto object-contain max-h-[480px]" />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#D4AF37] font-bold border border-[#D4AF37]/30">
            Strategy Blueprint • Win Rate {setup.winRate} • R:R {setup.riskReward}
          </div>
        </div>

        {/* Footer Details */}
        <div className="p-5 bg-[#0D111A] border-t border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#131722] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">Optimal Timeframe</span>
            <span className="font-bold text-white text-sm">{setup.timeframe}</span>
          </div>
          <div className="bg-[#131722] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">Entry Trigger</span>
            <span className="font-bold text-blue-400 text-sm">{setup.levels.entry}</span>
          </div>
          <div className="bg-[#131722] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">Stop Invalidation</span>
            <span className="font-bold text-rose-400 text-sm">{setup.levels.sl}</span>
          </div>
          <div className="bg-[#131722] p-3 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">Profit Targets</span>
            <span className="font-bold text-emerald-400 text-sm">{setup.levels.tp1}</span>
          </div>
        </div>

        <div className="p-4 bg-[#0B0F19] flex justify-between items-center border-t border-gray-800">
          <span className="text-xs text-gray-400">Master this setup with live market guidance in our courses</span>
          <Link
            to="/courses"
            className="px-6 py-2 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0F19] font-bold text-xs transition-all shadow-md"
          >
            Enroll to Unlock Full Playbook →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 5. FEATURED COURSE CARD
// ──────────────────────────────────────────────────────────────────
const FeaturedCourseCard = ({ course, navigate }) => {
  const { t } = useLanguage();
  const titleTe = useAutoTranslate(course.title, course.title_te);
  const descTe = useAutoTranslate(course.description, course.description_te);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-[#161F2E] to-[#0F1724] rounded-2xl p-5 shadow-xl border border-gray-800 flex flex-col h-full transform-gpu transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_12px_30px_rgba(212,175,55,0.15)]"
    >
      <div className="w-full h-44 rounded-xl overflow-hidden mb-4 relative bg-[#0B0F19]">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/50 bg-[#D4AF37]/5 font-bold text-xs">
            MarketMax Mentorship
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 bg-[#0B0F19]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
          {course.category || 'Professional Trading'}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white mb-2 font-outfit line-clamp-2">{titleTe}</h3>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{descTe}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1.5"><FaClock className="text-[#D4AF37]" /> {course.duration || '4 Weeks'}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold"><FaAward /> Certified</span>
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 line-through mr-1.5">₹{(course.price ? course.price * 2 : 9999).toLocaleString('en-IN')}</span>
              <span className="text-lg font-black text-white">₹{(course.price || 4999).toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="text-[#0f172a] font-bold text-xs bg-[#D4AF37] hover:bg-[#F3E5AB] px-4 py-2 rounded-full transition-all shadow-md shadow-[#D4AF37]/20"
            >
              {t('featured_book_now')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 6. MAIN HOME PAGE COMPONENT
// ──────────────────────────────────────────────────────────────────
const Home = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const navigate = useNavigate();
  const { t } = useLanguage();

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [activeSetupTab, setActiveSetupTab] = useState('all');

  // Parallax floating pills based on scroll
  const parallaxY1 = useTransform(scrollY, [0, 600], [0, -60]);
  const parallaxY2 = useTransform(scrollY, [0, 600], [0, -100]);

  const platformStats = {
    studentsCount: 15420,
    studentsSuffix: '+',
    studentsLabel: 'Traders Mentored',
    coursesCount: 28,
    coursesSuffix: '+',
    coursesLabel: 'Tested Strategies',
    instructorsCount: 12,
    instructorsSuffix: '+',
    instructorsLabel: 'SEBI/NISM Certified Mentors',
    satisfactionRate: 98,
    satisfactionSuffix: '%',
    satisfactionLabel: 'Positive Feedback'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/public`);
        const list = response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
        setFeaturedCourses(Array.isArray(list) ? list.slice(0, 4) : []);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredSetups = activeSetupTab === 'all'
    ? TRADING_SETUPS
    : TRADING_SETUPS.filter(s => s.badge.toLowerCase().includes(activeSetupTab.toLowerCase()));

  return (
    <div className="bg-[#0B0F19] overflow-x-hidden text-gray-300 font-inter relative">
      <SEO
        title="MarketMax Trading Academy | Master the Markets with Live Institutional Mentorship"
        description="Learn professional Indian stock market trading, live F&O strategies, price action, SMC order blocks, and risk management with MarketMax Trading Academy."
        keywords="Stock market academy, Nifty options trading, SMC trading, Price action, BankNifty scalping, Live market trading room, MarketMax, marketmaxtradingacademy"
        url="https://marketmaxtradingacademy.com"
      />

      {/* ── TOP SCROLL PROGRESS BAR ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D4AF37] via-amber-300 to-emerald-400 origin-left z-50 shadow-[0_0_12px_rgba(212,175,55,0.7)]"
      />

      {/* ── LIVE TICKER TAPE (Using symbols that render 100% cleanly with zero TradingView restrictions) ── */}
      <div className="sticky top-18 md:top-20 z-40 w-full border-b border-gray-800/80 bg-[#0B0F19]">
        <TradingViewWidget
          type="ticker"
          theme="dark"
          symbols={[
            { description: 'SENSEX', proName: 'BSE:SENSEX' },
            { description: 'GOLD (COMEX)', proName: 'TVC:GOLD' },
            { description: 'CRUDE OIL', proName: 'TVC:USOIL' },
            { description: 'SILVER', proName: 'TVC:SILVER' },
            { description: 'USD / INR', proName: 'FX:USDINR' },
            { description: 'BITCOIN', proName: 'BINANCE:BTCUSDT' },
            { description: 'ETHEREUM', proName: 'BINANCE:ETHUSDT' },
            { description: 'SOLANA', proName: 'BINANCE:SOLUSDT' },
          ]}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: ADVANCED HERO SECTION (2-COLUMN ON DESKTOP)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#0A0D14]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Countdown / Session Badge */}
              <div className="mb-6">
                <MarketSessionCountdown />
              </div>

              {/* Sub-headline Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs md:text-sm font-bold tracking-wider uppercase mb-6 shadow-sm">
                <FaAward className="text-[#D4AF37]" /> SEBI & NISM Certified Mentorship
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-black font-outfit text-white mb-6 tracking-tight leading-[1.1]">
                BUILD KNOWLEDGE. <br className="hidden md:block lg:hidden" />
                <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent drop-shadow-sm">
                  BUILD CONFIDENCE.
                </span>
              </h1>

              {/* Tagline Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mb-8 leading-relaxed font-medium">
                Master Price Action, Smart Money Concepts (SMC), and Options Greeks. Learn alongside seasoned traders in live market conditions with strict capital protection rules.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md lg:max-w-none mb-10">
                <Link
                  to="/courses"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] text-[#0B0F19] px-8 py-4 rounded-xl font-black text-base hover:from-[#F3E5AB] hover:to-[#D4AF37] transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)] inline-flex items-center justify-center gap-2"
                >
                  Explore Pro Programs <FaArrowRight className="text-sm" />
                </Link>
                <a
                  href="#live-market-section"
                  className="bg-[#131722]/80 backdrop-blur-md text-white border border-gray-700 hover:border-[#D4AF37] hover:bg-[#1A202C] px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <FaChartPie className="text-emerald-400" /> Live Market Tickers
                </a>
              </div>

              {/* Quick Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-gray-800/80">
                <div>
                  <div className="text-xl md:text-2xl font-black text-white font-outfit">15k+</div>
                  <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Traders</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-emerald-400 font-outfit">78%</div>
                  <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Win Rate</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-[#D4AF37] font-outfit">1:3+</div>
                  <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Risk:Reward</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-blue-400 font-outfit">9:15 AM</div>
                  <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Live Room</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Advanced 3D Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block h-[550px] w-full"
              style={{ perspective: 1000 }}
            >
              <motion.div 
                className="w-full h-full relative"
                whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Main Image Container */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#131722]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent z-10" />
                  <img 
                    src="/images/trading_floor_mentor.jpg" 
                    alt="Live Trading Floor" 
                    className="w-full h-full object-cover object-center opacity-90 transition-all duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop'; }}
                  />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-3xl z-20 opacity-40"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-emerald-500 rounded-br-3xl z-20 opacity-40"></div>
                </div>

                {/* Floating UI Elements Overlaid on Image */}
                <motion.div 
                  className="absolute bottom-16 -left-6 bg-[#131722]/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-emerald-500/40 shadow-2xl z-30 flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold text-[11px] mb-0.5 tracking-widest uppercase">Nifty Institutional Demand</div>
                    <div className="font-black text-emerald-400 font-mono text-lg">+140 Pts Captured</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute top-16 -right-6 bg-[#131722]/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-[#D4AF37]/40 shadow-2xl z-30 flex items-center gap-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, type: "spring" }}
                  style={{ transform: "translateZ(60px)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                    <FaBolt className="text-[#D4AF37] text-xl" />
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold text-[11px] mb-0.5 tracking-widest uppercase">Average Risk:Reward</div>
                    <div className="font-black text-[#D4AF37] font-mono text-lg">1 : 3.5 Target</div>
                  </div>
                </motion.div>
                
                {/* Status Indicator */}
                <div 
                  className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-600/50"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Live Trading Floor Active</span>
                </div>
              </motion.div>
              
              {/* Outer glowing backdrops */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-[#D4AF37]/20 rounded-[2.5rem] blur-2xl -z-10 opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: REAL-TIME LIVE MARKET CARDS (REPLACING BROKEN TV WIDGETS)
      ───────────────────────────────────────────────────────────── */}
      <section id="live-market-section" className="py-12 bg-[#0E131F] border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time 1-Second Tick Stream
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
                Live Market Pulse & Benchmark Indices
              </h2>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Real-time price ticks across Indian indices, global commodities & crypto. No delay, zero broker locks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/live-market"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#0B0F19] font-black text-xs hover:bg-[#F3E5AB] transition-all shadow-lg shadow-[#D4AF37]/20 hover:scale-105"
              >
                <FaChartPie className="text-xs" /> Open Interactive Charts
              </Link>
            </div>
          </div>

          {/* Real-time 1-second streaming cards */}
          <div className="mb-6">
            <LiveMarketCards filter="indices" compact={true} onSelectSymbol={(sym) => navigate('/live-market')} />
          </div>

        </div>
      </section>
        <HomeLiveInsights />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: PRO TRADING SETUPS & PLAYBOOK (HOVER PIC VISIBLE EFFECT)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0B0F19] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold mb-3">
                <FaRegLightbulb /> Institutional Trade Playbook
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-outfit tracking-tight">
                PRO TRADING SETUPS & BLUEPRINTS
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl">
                Hover over any trade setup to inspect real chart geometry, key invalidation levels, and risk-reward profiles taught inside our live trading rooms.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Setups' },
                { id: 'smc', label: 'SMC & Order Blocks' },
                { id: 'options', label: 'Options Scalping' },
                { id: 'price', label: 'Price Action' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSetupTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSetupTab === tab.id
                      ? 'bg-[#D4AF37] text-[#0B0F19] shadow-md shadow-[#D4AF37]/20'
                      : 'bg-[#131722] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid with 3D Tilt and Hover Image Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSetups.map(setup => (
              <SetupHoverCard
                key={setup.id}
                setup={setup}
                onOpenModal={(s) => setSelectedSetup(s)}
              />
            ))}
          </div>

          {/* Interactive Callout Banner below Setups */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#131722] via-[#1A2333] to-[#131722] border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center text-xl flex-shrink-0">
                <FaChalkboardTeacher />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-outfit">Want to master these setups with live screen sharing?</h4>
                <p className="text-xs text-gray-400 mt-0.5">Our mentors execute these exact setups live every morning from 9:15 AM to 11:30 AM IST.</p>
              </div>
            </div>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0F19] font-black text-xs transition-all duration-300 whitespace-nowrap shadow-lg shadow-[#D4AF37]/20 hover:scale-105"
            >
              Book a Free Demo Class →
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: 4-STAGE TRADER TRANSFORMATION ROADMAP (SCROLL REVEAL)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0E131F] border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-3">
              <FaCompass /> Structured Learning Pathway
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-outfit">
              FROM BEGINNER TO FUNDED TRADER
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-3">
              A disciplined, step-by-step curriculum engineered to transform retail market participants into systematic, profitable traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Market Mechanics & Risk Math',
                duration: 'Weeks 1 - 2',
                focus: 'Foundational Base',
                desc: 'Understand market auction theory, bid-ask depth, position sizing arithmetic, and the 1% maximum capital rule.',
                icon: <FaShieldAlt className="text-blue-400" />,
                skills: ['Candlestick Anatomy', 'Order Types & Slippage', 'Capital Preservation Math']
              },
              {
                step: '02',
                title: 'Price Action & SMC Order Flow',
                duration: 'Weeks 3 - 5',
                focus: 'Technical Dominance',
                desc: 'Learn institutional footprints, Fair Value Gaps (FVG), order blocks, liquidity sweeps, and multi-timeframe alignment.',
                icon: <FaChartLine className="text-emerald-400" />,
                skills: ['Institutional Liquidity', 'FVG & Imbalances', 'High-Probability Entry Triggers']
              },
              {
                step: '03',
                title: 'Options Greeks & Hedging',
                duration: 'Weeks 6 - 8',
                focus: 'Advanced Derivatives',
                desc: 'Master Delta, Gamma scalping, Theta decay, and non-directional hedging strategies (Iron Condors, Spreads, Straddles).',
                icon: <FaBolt className="text-[#D4AF37]" />,
                skills: ['Gamma Explosion Scalping', 'Hedging Architectures', 'Volatility IV Crush Mastery']
              },
              {
                step: '04',
                title: 'Live Floor Mentorship & Funding',
                duration: 'Ongoing',
                focus: 'Execution & Scale',
                desc: 'Trade live with registered mentors every market morning. Review trade journals, conquer emotions, and scale capital.',
                icon: <FaAward className="text-purple-400" />,
                skills: ['Screen-to-Screen Live Calls', 'Psychology & Bias Audit', 'Funded Capital Roadmaps']
              }
            ].map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-gradient-to-b from-[#131722] to-[#0B0F19] rounded-2xl p-6 border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-outfit text-gray-700 group-hover:text-[#D4AF37] transition-colors">
                      {stage.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-gray-800 flex items-center justify-center text-lg">
                      {stage.icon}
                    </div>
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] mb-2">
                    {stage.duration}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-outfit group-hover:text-white">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    {stage.desc}
                  </p>
                </div>

                <div className="border-t border-gray-800/80 pt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Key Competencies</span>
                  {stage.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <FaCheckCircle className="text-emerald-400 text-[10px] flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: WHY MARKETMAX (RETAIL GAMBLING VS. INSTITUTIONAL SYSTEM)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0B0F19] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-outfit">
              WHY 90% OF RETAIL TRADERS LOSE<br />
              <span className="text-[#D4AF37]">AND HOW MARKETMAX FIXES IT</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-3">
              We replace guesswork and Telegram tips with institutional risk rules and real-time screen-share discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Retail Trap */}
            <div className="bg-gradient-to-b from-rose-950/20 to-[#0B0F19] border border-rose-900/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                  ✕
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-outfit">The Typical Retail Trap</h3>
                  <p className="text-xs text-rose-400 font-medium">Why 9 out of 10 traders blow up their accounts</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-rose-900/20">
                  <span className="text-rose-500 font-bold">✗</span>
                  <div>
                    <span className="font-bold text-white block">Blind Telegram Tips & Calls</span>
                    <span className="text-xs text-gray-400">Buying random options without knowing entry logic, theta decay, or exit levels.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-rose-900/20">
                  <span className="text-rose-500 font-bold">✗</span>
                  <div>
                    <span className="font-bold text-white block">Zero Risk Management (Averaging Down)</span>
                    <span className="text-xs text-gray-400">Holding losing trades hoping for a rebound until 50%+ capital vanishes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-rose-900/20">
                  <span className="text-rose-500 font-bold">✗</span>
                  <div>
                    <span className="font-bold text-white block">Overtrading & Revenge Trading</span>
                    <span className="text-xs text-gray-400">Taking 20+ trades daily driven by frustration, feeding brokers immense brokerage fees.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The MarketMax Institutional Edge */}
            <div className="bg-gradient-to-b from-emerald-950/20 to-[#0B0F19] border border-emerald-900/40 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-outfit">The MarketMax Institutional Edge</h3>
                  <p className="text-xs text-emerald-400 font-medium">How professional traders extract consistent profits</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <span className="font-bold text-white block">Systematic 1:3+ Risk-to-Reward Ratio</span>
                    <span className="text-xs text-gray-400">Even with a 50% win rate, math ensures long-term compounding profitability.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <span className="font-bold text-white block">Live Market Screen-to-Screen Mentorship</span>
                    <span className="text-xs text-gray-400">Daily live commentary during 9:15 AM - 11:30 AM market hours with real-time level markups.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <span className="font-bold text-white block">Psychology & Strict Capital Guardrails</span>
                    <span className="text-xs text-gray-400">Maximum 2-3 high-probability setups per day. Max 1.5% daily drawdown threshold.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5.5: COMPREHENSIVE TRADING SERVICES WE PROVIDE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-[#0A0D14] via-[#06080e] to-[#0A0D14] border-t border-gray-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold mb-3">
                <FaBolt /> Complete Trading Ecosystem
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-outfit">
                SERVICES WE PROVIDE
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl">
                From real-time floor execution and personalized mentorship to quantitative indicator suites and accredited community support.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-bold hover:text-white transition-colors text-sm"
            >
              Explore All 10 Services <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Premium Calls Group', desc: 'Real-time high R:R intraday & swing alerts with strict SL & targets.' },
              { num: '02', title: 'Trading Account Services', desc: 'Zero AMC onboarding, API linkages & discounted institutional terminals.' },
              { num: '03', title: 'Portfolio Education Support', desc: 'Strategic asset allocation, beta balancing & index put hedging.' },
              { num: '04', title: 'E-books & Study Materials', desc: '15+ strategy playbooks, candlestick cheat sheets in English & Telugu.' },
              { num: '05', title: 'Trading Tools & Indicators', desc: 'Custom Pine Script SMC order block scanners and liquidity plotters.' },
              { num: '06', title: 'Trade Journal / Tracker', desc: 'Analytical performance audit software tracking win-rates and psychology.' },
              { num: '07', title: 'One-to-One Mentorship', desc: 'Direct private desk coaching customized to your capital and schedule.' },
              { num: '08', title: 'Live Market Sessions', desc: 'Trade live side-by-side with mentors every morning from 9:15 AM IST.' },
              { num: '09', title: 'Doubt-Clearing Sessions', desc: 'Every weekend interactive Zoom workshops analyzing student trade logs.' },
              { num: '10', title: 'Community Discussion', desc: 'VIP network of 15,000+ active traders sharing daily setups and charts.' },
            ].map((svc) => (
              <Link
                key={svc.num}
                to="/services"
                className="glossy-card rounded-2xl p-5 border border-white/10 hover:border-[#D4AF37]/50 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-[#D4AF37] transition-colors">
                    #{svc.num}
                  </span>
                  <h3 className="text-sm font-black text-white font-outfit mt-2 mb-1.5 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-[#D4AF37] font-bold">
                  <span>Learn More</span>
                  <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: FEATURED ACADEMY COURSES
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0E131F] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold mb-3">
                <FaGraduationCap /> Structured Programs
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-outfit">
                FEATURED MENTORSHIPS
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-2">
                Lifetime community access, daily market morning rooms, and verified certification.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-bold hover:text-white transition-colors text-sm"
            >
              Browse All Courses & Bundles <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-gray-400">Loading verified courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <FeaturedCourseCard key={course._id} course={course} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: ANIMATED PLATFORM STATISTICS & CREDENTIALS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#131722] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">
                <AnimatedCounter from={0} to={platformStats.studentsCount} suffix={platformStats.studentsSuffix} duration={2} />
              </div>
              <div className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-widest uppercase">{platformStats.studentsLabel}</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">
                <AnimatedCounter from={0} to={platformStats.coursesCount} suffix={platformStats.coursesSuffix} duration={2} />
              </div>
              <div className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-widest uppercase">{platformStats.coursesLabel}</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">
                <AnimatedCounter from={0} to={platformStats.instructorsCount} suffix={platformStats.instructorsSuffix} duration={2} />
              </div>
              <div className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-widest uppercase">{platformStats.instructorsLabel}</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">
                <AnimatedCounter from={0} to={platformStats.satisfactionRate} suffix={platformStats.satisfactionSuffix} duration={2} />
              </div>
              <div className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-widest uppercase">{platformStats.satisfactionLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: FINAL CTA BANNER (JOIN DEMO CLASS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 relative bg-gradient-to-b from-[#0B0F19] to-[#070A10] border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-6">
            <FaUsers /> Limited Cohort Seats Available
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white font-outfit mb-6 tracking-tight">
            READY TO LEVEL UP YOUR TRADING CAREER?
          </h2>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Reserve your complimentary seat for our upcoming Live Market Masterclass. Experience our screen-share execution and market levels in action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D4AF37] text-[#0B0F19] font-black text-base hover:bg-[#F3E5AB] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105"
            >
              Reserve Your Free Demo Seat →
            </Link>
            <Link
              to="/live-market"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#131722] text-white border border-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37] font-bold text-base transition-all duration-300"
            >
              View Live Market Pulse
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal when a setup card is clicked */}
      {selectedSetup && (
        <SetupModal setup={selectedSetup} onClose={() => setSelectedSetup(null)} />
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBook, FaInfoCircle, FaUser, FaGlobe, FaArrowLeft, FaTimes, FaBars, FaChartLine, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { lang, setLang, t } = useLanguage();

  const isCourseDetails = location.pathname.startsWith('/courses/') && location.pathname !== '/courses';
  const isCourseList = location.pathname === '/courses';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Services', path: '/services' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'E-Books', path: '/ebooks' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
  ];

  const moreNavLinks = [
    { name: 'Certificates', path: '/certificates' },
    { name: 'E-Books', path: '/ebooks' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isMoreActive = moreNavLinks.some(link => isActive(link.path));

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center h-18 md:h-20 ${
          isScrolled
            ? 'bg-[#06080e]/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
            : 'bg-[#06080e]/80 backdrop-blur-md border-b border-white/5 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center w-full relative">
            
            {/* Left Side: Back Button & Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {isCourseDetails || isCourseList ? (
                <button onClick={() => navigate(-1)} className="md:hidden flex items-center gap-1.5 text-[#D4AF37] p-2 -ml-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors">
                  <FaArrowLeft size={17} />
                </button>
              ) : null}

              <Link to="/" className="flex flex-shrink-0 items-center gap-2">
                <img src="/logo.png" alt="MarketMax Logo" className="h-12 md:h-14 w-auto object-contain mix-blend-lighten" />
                <span className="font-outfit font-black text-base md:text-lg text-white hidden xl:block tracking-wide">
                  MARKET<span className="text-[#D4AF37]">MAX</span>
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-4 xl:space-x-5">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-outfit font-bold text-[13px] xl:text-[14px] transition-colors ${
                    isActive(link.path) ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    />
                  )}
                </Link>
              ))}

              {/* More Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button className={`relative font-outfit font-bold text-[13px] xl:text-[14px] transition-colors flex items-center gap-1 ${
                  isMoreActive ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-white'
                }`}>
                  More <FaChevronDown size={10} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
                  {isMoreActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    />
                  )}
                </button>
                
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
                      className="absolute top-full right-0 mt-4 w-48 bg-[#0F172A] border border-gray-800 rounded-xl shadow-2xl py-2 flex flex-col z-50"
                    >
                      {moreNavLinks.map(link => (
                          <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setIsMoreOpen(false)}
                            className={`px-4 py-2 hover:bg-[#1E293B] text-sm transition-colors ${
                              isActive(link.path) ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/5' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            {link.name}
                          </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Market Pulsing Button */}
              <Link
                to="/live-market"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                  isActive('/live-market')
                    ? 'bg-[#D4AF37] text-[#0B0F19] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Market</span>
              </Link>
            </div>

            {/* Right side: Language + Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Select Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-700 bg-[#1E293B] hover:bg-[#334155] transition-colors">
                <FaGlobe className="text-[#D4AF37] text-xs" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-sm font-bold text-gray-300 font-outfit outline-none cursor-pointer pr-1"
                >
                  <option value="en">EN</option>
                  <option value="te">TE</option>
                </select>
              </div>

              {/* Auth Buttons */}
              {token ? (
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0f172a] font-bold font-outfit text-sm hover:bg-[#F3E5AB] transition-all shadow-[0_4px_14px_0_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5"
                >
                  {t('nav_dashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/login" className="font-outfit font-semibold text-gray-300 hover:text-white transition-colors px-2">
                    {t('nav_login')}
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0f172a] font-bold font-outfit text-sm hover:bg-[#F3E5AB] transition-all shadow-[0_4px_14px_0_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5">
                    {t('nav_register')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Language + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-700 bg-[#1E293B]">
                <FaGlobe className="text-[#D4AF37] text-[10px]" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-300 font-outfit outline-none cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="te">TE</option>
                </select>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-[#D4AF37] focus:outline-none ml-2"
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0F172A] border-t border-gray-800 shadow-2xl absolute top-full left-0 w-full"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-3 rounded-md font-outfit font-medium text-base ${
                      isActive(link.path) ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-300 hover:bg-[#1E293B]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col space-y-3">
                  {token ? (
                    <Link
                      to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      className="w-full text-center px-4 py-3 rounded-full bg-[#D4AF37] text-[#0f172a] font-bold font-outfit"
                    >
                      {t('nav_dashboard')}
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="w-full text-center px-4 py-3 rounded-full border border-gray-600 text-gray-300 hover:text-white font-bold font-outfit">
                        {t('nav_login')}
                      </Link>
                      <Link to="/register" className="w-full text-center px-4 py-3 rounded-full bg-[#D4AF37] text-[#0f172a] font-bold font-outfit">
                        {t('nav_register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Bottom Navbar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0B0F19]/95 backdrop-blur-md border-t border-gray-800 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center pt-3 pb-4 px-2">
          <Link to="/" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/') ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
            <FaHome className="text-xl" />
            <span className="text-[11px] font-outfit font-bold tracking-wide">{t('nav_bottom_home')}</span>
          </Link>
          <Link to="/courses" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/courses') ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
            <FaBook className="text-xl" />
            <span className="text-[11px] font-outfit font-bold tracking-wide">{t('nav_bottom_classes')}</span>
          </Link>
          <Link to="/live-market" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/live-market') ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
            <FaChartLine className="text-xl" />
            <span className="text-[11px] font-outfit font-bold tracking-wide">Live</span>
          </Link>
          <Link to="/about" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/about') ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
            <FaInfoCircle className="text-xl" />
            <span className="text-[11px] font-outfit font-bold tracking-wide">{t('nav_bottom_about')}</span>
          </Link>
          <Link to={token ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} className={`flex flex-col items-center gap-1.5 transition-colors ${location.pathname.includes('/dashboard') || location.pathname.includes('/login') ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
            <FaUser className="text-xl" />
            <span className="text-[11px] font-outfit font-bold tracking-wide">{token ? t('nav_dashboard') : t('nav_bottom_login')}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;


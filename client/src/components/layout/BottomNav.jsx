import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaUser, FaGraduationCap, FaEllipsisH, FaTimes, FaCog, FaHistory, FaHeart, FaHeadset, FaCertificate } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isProfileActive = [
    '/dashboard/profile',
    '/dashboard/settings',
    '/dashboard/payment-history',
    '/dashboard/wishlist',
    '/dashboard/support',
    '/dashboard/certificates'
  ].some(route => pathname.startsWith(route));

  const isLearningActive = pathname.startsWith('/dashboard/learning');
  const isCoursesActive = pathname.startsWith('/courses');
  const isHomeActive = pathname === '/dashboard';

  const navItems = [
    { name: t('dash_nav_home'), path: '/dashboard', icon: FaHome, active: isHomeActive },
    { name: t('dash_nav_courses'), path: '/courses', icon: FaGraduationCap, active: isCoursesActive },
    { name: t('dash_nav_learning'), path: '/dashboard/learning', icon: FaBookOpen, active: isLearningActive },
    { name: t('dash_nav_profile'), path: '/dashboard/profile', icon: FaUser, active: isProfileActive },
  ];

  const moreItems = [
    { name: 'Certificates', path: '/dashboard/certificates', icon: FaCertificate },
    { name: 'Payment History', path: '/dashboard/payment-history', icon: FaHistory },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: FaHeart },
    { name: 'Support', path: '/dashboard/support', icon: FaHeadset },
    { name: 'Settings', path: '/dashboard/settings', icon: FaCog },
  ];

  const isMoreActive = moreItems.some(item => pathname.startsWith(item.path));

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-t border-gray-800 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] z-50 md:hidden">
      <div className="flex items-center h-16 pb-1 px-1">
        {navItems.map((item) => {
          const isActive = item.active;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full py-1 space-y-1 transition-all ${
                isActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400 hover:text-gray-200 font-medium'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={isActive ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
                className="relative"
              >
                <item.icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  />
                )}
              </motion.div>
              <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center w-full h-full py-1 space-y-1 transition-all ${isMoreActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400 hover:text-gray-200 font-medium'}`}
          aria-label="Open more dashboard options"
        >
          <motion.div whileTap={{ scale: 0.88 }} animate={isMoreActive ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }} className="relative">
            <FaEllipsisH size={20} />
            {isMoreActive && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />}
          </motion.div>
          <span className={`text-[10px] leading-none tracking-tight ${isMoreActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400'}`}>More</span>
        </button>
      </div>

      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:hidden">
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMoreOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close menu" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.35 }} className="relative z-10 w-full rounded-t-[2rem] border-t border-white/10 bg-[#131722] p-5 pb-8 shadow-[0_-15px_45px_rgba(0,0,0,0.45)]">
              <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Dashboard</p><h2 className="mt-1 text-lg font-black text-white">More options</h2></div><button type="button" onClick={() => setIsMoreOpen(false)} className="rounded-full bg-white/5 p-2.5 text-gray-400 hover:text-white" aria-label="Close more options"><FaTimes size={14} /></button></div>
              <div className="grid grid-cols-2 gap-3">
                {moreItems.map(item => <NavLink key={item.path} to={item.path} onClick={() => setIsMoreOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition-colors ${isActive || pathname.startsWith(item.path) ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3D36A]' : 'border-white/10 bg-white/[0.035] text-gray-300 hover:bg-white/[0.08]'}`}><item.icon size={16} /><span>{item.name}</span></NavLink>)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BottomNav;

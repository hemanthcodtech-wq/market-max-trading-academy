import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaUser, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const pathname = location.pathname;

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

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-t border-gray-800 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16 pb-1 px-1">
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
      </div>
    </div>
  );
};

export default BottomNav;

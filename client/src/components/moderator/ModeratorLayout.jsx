import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaShieldAlt, FaSignOutAlt, 
  FaExternalLinkAlt, FaUserShield, FaBars, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ModeratorLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const rawUser = localStorage.getItem('moderatorUser');
  const moderator = rawUser ? JSON.parse(rawUser) : { name: 'Moderator' };

  const handleLogout = () => {
    localStorage.removeItem('moderatorToken');
    localStorage.removeItem('moderatorUser');
    navigate('/moderator/login');
  };

  const navItems = [
    { name: 'Governance Dashboard', path: '/moderator/dashboard', icon: FaTachometerAlt },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F19] font-inter overflow-hidden relative text-gray-300">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:static inset-y-0 left-0 w-64 lg:w-72 bg-[#0F172A]/90 backdrop-blur-2xl text-gray-300 flex-col shadow-[4px_0_30px_rgba(0,0,0,0.5)] z-30 shrink-0 border-r border-gray-800">
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-[#0B0F19]/40 sticky top-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MarketMax Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-white">MODERATOR PANEL</span>
              <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest">Governance Unit</span>
            </div>
          </div>
        </div>

        {/* Moderator Badge */}
        <div className="p-4 mx-4 my-4 bg-[#1E293B] border border-gray-700 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-black text-sm shadow-xs">
              {moderator.name ? moderator.name.charAt(0).toUpperCase() : <FaShieldAlt />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">{moderator.name || 'Staff Moderator'}</div>
              <div className="text-[11px] text-gray-400 font-extrabold truncate">Platform Moderator</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.05)] border border-[#D4AF37]/20 font-bold' 
                    : 'text-gray-400 hover:bg-[#1E293B] hover:text-[#D4AF37] font-semibold border border-transparent hover:border-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? "text-[#D4AF37]" : "text-gray-500"} />
                  <span className="text-sm tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-6 px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Quick Links</div>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-400 hover:bg-[#1E293B] hover:text-[#D4AF37] border border-transparent hover:border-gray-700 font-semibold transition-all text-sm group"
          >
            <FaExternalLinkAlt size={14} className="text-gray-500 group-hover:text-[#D4AF37]" />
            <span>Public Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#0B0F19]/40">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 font-bold transition-all text-sm cursor-pointer"
          >
            <FaSignOutAlt size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F19] relative overflow-hidden">
        
        {/* Mobile & Desktop Header */}
        <header className="h-16 md:h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 md:px-8 z-20 shrink-0 shadow-lg sticky top-0">
          
          {/* Mobile Left: Menu Toggle & Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-gray-300 transition-colors border border-gray-700"
              aria-label="Open menu"
            >
              <FaBars size={16} />
            </button>
            <img src="/logo.png" alt="MarketMax Logo" className="h-10 w-auto object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h2 className="text-base lg:text-lg font-extrabold text-white tracking-tight">
              MarketMax Trading Academy • Moderator Workspace
            </h2>
          </div>

          {/* User Status / Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-[11px] sm:text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>Moderator Active</span>
            </div>

            <div 
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 pl-2 border-l border-gray-700 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-black text-xs shadow-md">
                {moderator.name ? moderator.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">{moderator.name || 'Moderator'}</span>
                <span className="text-[10px] font-semibold text-gray-400 truncate max-w-[120px]">Trust & Safety</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 xl:p-10 pb-24 md:pb-10">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0F172A]/95 backdrop-blur-2xl border-t border-gray-800 px-6 py-2.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
          <NavLink
            to="/moderator/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <FaTachometerAlt size={18} />
            <span>Dashboard</span>
          </NavLink>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-200 transition-all"
          >
            <FaExternalLinkAlt size={16} />
            <span>Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-500 transition-all cursor-pointer"
          >
            <FaSignOutAlt size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="relative w-4/5 max-w-xs bg-[#0F172A] border-r border-gray-800 h-full shadow-2xl z-10 flex flex-col p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="MarketMax Logo" className="h-9 w-auto" />
                  <div className="flex flex-col">
                    <span className="font-black text-xs text-white">MODERATOR PANEL</span>
                    <span className="text-[9px] text-[#D4AF37] uppercase font-bold">Governance Unit</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1E293B] border border-gray-700 flex items-center justify-center text-gray-400"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              {/* Profile Card in Drawer */}
              <div className="p-4 bg-[#1E293B] border border-gray-700 rounded-2xl mb-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm">
                    {moderator.name ? moderator.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-white truncate">{moderator.name || 'Moderator'}</div>
                    <div className="text-xs text-gray-400 font-bold truncate">Platform Oversight</div>
                  </div>
                </div>
                {moderator.emailOrPhone && (
                  <div className="text-[11px] text-gray-500 truncate pt-1 border-t border-gray-700">
                    📧 {moderator.emailOrPhone}
                  </div>
                )}
                {moderator.phone && (
                  <div className="text-[11px] text-gray-500 truncate">
                    📞 {moderator.phone}
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 flex-1">
                <NavLink
                  to="/moderator/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm' : 'text-gray-400 hover:bg-[#1E293B] border border-transparent hover:border-gray-700'
                    }`
                  }
                >
                  <FaTachometerAlt />
                  <span>Governance Dashboard</span>
                </NavLink>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-[#1E293B] border border-transparent hover:border-gray-700 transition-all"
                >
                  <FaExternalLinkAlt />
                  <span>Public Site ↗</span>
                </Link>
              </div>

              {/* Drawer Footer Sign Out */}
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ModeratorLayout;

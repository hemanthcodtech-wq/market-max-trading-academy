import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBook, FaBookOpen, FaUsers, FaSignOutAlt, FaFolderOpen,
  FaExternalLinkAlt, FaShieldAlt, FaAward, FaEllipsisH, FaTimes
} from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Courses', path: '/admin/courses', icon: FaBook },
    { name: 'Materials', path: '/admin/materials', icon: FaFolderOpen },
    { name: 'Blogs', path: '/admin/blogs', icon: FaBookOpen },
    { name: 'E-Books', path: '/admin/ebooks', icon: FaBook },
    { name: 'Services', path: '/admin/services', icon: FaShieldAlt },
    { name: 'Certificates & Invoices', path: '/admin/records', icon: FaAward },
    { name: 'Learners', path: '/admin/users', icon: FaUsers },
  ];

  const mobileNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  return (
    <div className="flex h-screen bg-[#0B0F19] font-inter overflow-hidden relative text-gray-300">

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex md:static inset-y-0 left-0 w-64 lg:w-72 bg-[#131722]/90 backdrop-blur-2xl text-gray-300 flex-col shadow-[4px_0_30px_rgba(0,0,0,0.8)] z-30 shrink-0 border-r border-gray-800">
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-[#0B0F19]/40 sticky top-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MarketMax Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-white">MarketMax ADMIN</span>
              <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest">Management Hub</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600/10 text-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.05)] border border-blue-600/20 font-bold' 
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
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-400 hover:bg-[#1E293B] hover:text-[#D4AF37] font-semibold transition-all text-sm group border border-transparent hover:border-gray-700"
          >
            <FaExternalLinkAlt size={14} className="text-gray-500 group-hover:text-[#D4AF37]" />
            <span>View Public Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#0B0F19]/40">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 font-bold transition-all text-sm border border-transparent hover:border-red-500/20"
          >
            <FaSignOutAlt size={16} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F19] relative overflow-hidden">
        
        {/* Ambient liquid background orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#131722]/40 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 md:h-20 bg-[#131722]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 md:px-8 z-20 shrink-0 shadow-lg sticky top-0">
          
          {/* Mobile centered logo */}
          <div className="md:hidden flex items-center justify-center w-full relative">
            <img src="/logo.png" alt="MarketMax Logo" className="h-12 w-auto drop-shadow-sm" />
          </div>

          {/* Desktop Left */}
          <div className="hidden md:flex items-center gap-3">
            <h2 className="text-base lg:text-lg font-extrabold text-white tracking-tight">MarketMax Trading Academy Admin Portal</h2>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>System Live</span>
            </div>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-700">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-black text-xs shadow-md">
                SA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">Administrator</span>
                <span className="text-[10px] font-semibold text-gray-400">Super User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 pb-24 md:pb-10">
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
      </div>

      {/* Mobile Bottom Navigation (Sticky) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#131722]/95 backdrop-blur-xl border-t border-gray-800 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] z-50 md:hidden">
        <div className="flex items-center h-16 px-1">
          {mobileNavItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400 hover:text-white font-medium'}`}>
              {({ isActive }) => <><item.icon size={20} className={isActive ? 'text-[#D4AF37]' : ''} /><span className={`text-[10px] font-semibold ${isActive ? 'text-[#D4AF37] font-bold' : ''}`}>{item.name}</span></>}
            </NavLink>
          ))}
          <button type="button" onClick={() => setIsMoreOpen(true)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${moreNavItems.some(item => window.location.pathname.startsWith(item.path)) ? 'text-[#D4AF37] font-bold' : 'text-gray-400 hover:text-white font-medium'}`} aria-label="Open more admin options">
            <FaEllipsisH size={20} />
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </div>

        <AnimatePresence>
          {isMoreOpen && (
            <div className="fixed inset-0 z-50 flex items-end md:hidden">
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMoreOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close menu" />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.35 }} className="relative z-10 w-full rounded-t-[2rem] border-t border-white/10 bg-[#131722] p-5 pb-8 shadow-[0_-15px_45px_rgba(0,0,0,0.45)]">
                <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Admin Portal</p><h2 className="mt-1 text-lg font-black text-white">More options</h2></div><button type="button" onClick={() => setIsMoreOpen(false)} className="rounded-full bg-white/5 p-2.5 text-gray-400 hover:text-white" aria-label="Close more options"><FaTimes size={14} /></button></div>
                <div className="grid grid-cols-2 gap-3">
                  {moreNavItems.map(item => <NavLink key={item.path} to={item.path} onClick={() => setIsMoreOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition-colors ${isActive || window.location.pathname.startsWith(item.path) ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3D36A]' : 'border-white/10 bg-white/[0.035] text-gray-300 hover:bg-white/[0.08]'}`}><item.icon size={16} /><span>{item.name}</span></NavLink>)}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
};

export default AdminLayout;

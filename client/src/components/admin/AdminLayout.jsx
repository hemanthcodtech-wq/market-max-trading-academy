import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBook, FaUsers, FaCalendarAlt, FaSignOutAlt, 
  FaFolderOpen, FaExternalLinkAlt, FaShieldAlt, FaAward, 
  FaChalkboardTeacher, FaUserShield 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Courses', path: '/admin/courses', icon: FaBook },
    { name: 'Instructors', path: '/admin/instructors', icon: FaChalkboardTeacher },
    { name: 'Moderators', path: '/admin/moderators', icon: FaUserShield },
    { name: 'Materials', path: '/admin/materials', icon: FaFolderOpen },
    { name: 'Certificates & Invoices', path: '/admin/records', icon: FaAward },
    { name: 'Learners', path: '/admin/users', icon: FaUsers },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden relative text-slate-600">

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex md:static inset-y-0 left-0 w-64 lg:w-72 bg-white/90 backdrop-blur-2xl text-slate-600 flex-col shadow-[4px_0_30px_rgba(0,0,0,0.5)] z-30 shrink-0 border-r border-slate-100">
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-[#F8FAFC]/40 sticky top-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MarketMax Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-slate-800">MarketMax ADMIN</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Management Hub</span>
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
                    ? 'bg-blue-600/10 text-blue-600 shadow-[0_8px_20px_rgba(212,175,55,0.05)] border border-blue-600/20 font-bold' 
                    : 'text-slate-500 hover:bg-white hover:text-blue-600 font-semibold border border-transparent hover:border-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? "text-blue-600" : "text-gray-500"} />
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
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:bg-white hover:text-blue-600 font-semibold transition-all text-sm group border border-transparent hover:border-slate-200"
          >
            <FaExternalLinkAlt size={14} className="text-gray-500 group-hover:text-blue-600" />
            <span>View Public Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC]/40">
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
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] relative overflow-hidden">
        
        {/* Ambient liquid background orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-20 shrink-0 shadow-lg sticky top-0">
          
          {/* Mobile centered logo */}
          <div className="md:hidden flex items-center justify-center w-full relative">
            <img src="/logo.png" alt="MarketMax Logo" className="h-12 w-auto drop-shadow-sm" />
          </div>

          {/* Desktop Left */}
          <div className="hidden md:flex items-center gap-3">
            <h2 className="text-base lg:text-lg font-extrabold text-slate-800 tracking-tight">MarketMax Trading Academy Admin Portal</h2>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>System Live</span>
            </div>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-600/30 text-blue-600 flex items-center justify-center font-black text-xs shadow-md">
                SA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">Administrator</span>
                <span className="text-[10px] font-semibold text-slate-500">Super User</span>
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
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] z-50 md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-gray-200 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-blue-600' : ''} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600 font-bold' : ''}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default AdminLayout;

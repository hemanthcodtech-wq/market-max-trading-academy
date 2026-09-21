import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { PiCertificate, PiHeart, PiBookOpen, PiCreditCard, PiGearSix, PiQuestion, PiSignOut } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: 'Anjali',
    lastName: 'Sharma',
    emailOrPhone: 'anjali@example.com'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const menuItems = [
    { title: 'My Wishlist', icon: PiHeart, path: '/dashboard/wishlist' },
    { title: 'My Enrollments', icon: PiBookOpen, path: '/dashboard/learning' },
    { title: 'Payment History', icon: PiCreditCard, path: '/dashboard/payment-history' },
    { title: 'My Certificates', icon: PiCertificate, path: '/dashboard/certificates' },
    { title: 'Settings', icon: PiGearSix, path: '/dashboard/settings' },
    { title: 'Help & Support', icon: PiQuestion, path: '/dashboard/support' },
    { title: 'Logout', icon: PiSignOut, path: '/login', action: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } 
    }
  ];

  const fullName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : 'Student';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 pt-5 pb-24 font-inter text-gray-300 sm:px-6 md:px-8 md:pt-8 md:pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3 md:mb-8">
          <button onClick={() => navigate(-1)} className="rounded-full border border-gray-700 bg-[#131722] p-2.5 text-gray-400 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] md:hidden" aria-label="Go back">
            <FaArrowLeft size={15} />
          </button>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">Account</p>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Your profile</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-gray-800 bg-[#111722] shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
        >
          <div className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-br from-[#182335] via-[#131722] to-[#0F141E] px-6 py-7 md:px-10 md:py-9">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-xl font-black text-[#F3D675] shadow-[0_0_30px_rgba(212,175,55,0.12)] md:h-20 md:w-20 md:text-2xl">
                  {initials}
                </div>
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active learner
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">{fullName}</h2>
                  <p className="mt-1 text-sm text-gray-400">{profile.emailOrPhone || 'Add your contact details'}</p>
                </div>
              </div>
              <button onClick={() => navigate('/dashboard/settings')} className="w-full rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-bold text-[#F3D675] transition-colors hover:bg-[#D4AF37] hover:text-[#0B0F19] sm:w-auto">
                Edit profile
              </button>
            </div>
          </div>

          <div className="grid gap-8 p-5 md:grid-cols-[0.85fr_1.5fr] md:p-8">
            <div className="rounded-2xl border border-gray-800 bg-[#0D131D] p-5 md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Member snapshot</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <span className="text-sm text-gray-400">Account type</span>
                  <span className="text-sm font-bold text-white">Student</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <span className="text-sm text-gray-400">Learning hub</span>
                  <span className="text-sm font-bold text-[#D4AF37]">MarketMax</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Next step</span>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-white">Continue your learning journey and keep your progress moving.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Workspace</p>
                  <h3 className="mt-1 text-xl font-black text-white">Account shortcuts</h3>
                </div>
                <span className="hidden text-xs text-gray-500 sm:block">Manage your learning space</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={item.title}
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.path !== '#') navigate(item.path);
                    }}
                    className={`group flex min-h-[74px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${item.title === 'Logout' ? 'border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10 sm:col-span-2' : 'border-gray-800 bg-[#151D2A] hover:border-[#D4AF37]/40 hover:bg-[#192334]'}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.title === 'Logout' ? 'bg-red-500/10 text-red-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                      <item.icon size={20} />
                    </span>
                    <span className={`flex-1 text-sm font-bold ${item.title === 'Logout' ? 'text-red-400' : 'text-gray-200'}`}>{item.title}</span>
                    <FaChevronRight size={12} className="text-gray-600 transition-colors group-hover:text-[#D4AF37]" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileMenu;

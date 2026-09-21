import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaClock, FaAward, FaPlay, FaChevronRight, FaBookOpen, FaUser, FaBlog, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const coursesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/payments/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (coursesRes.data.success) {
          setEnrolledCount(coursesRes.data.data.length);
        }

        const classesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/classes/student`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (classesRes.data.success) {
          const now = new Date();
          const futureClasses = classesRes.data.data.filter(cls => {
            const classTime = new Date(`${cls.date.split('T')[0]}T${cls.time}:00`);
            return classTime > now;
          }).sort((a, b) => {
            const aTime = new Date(`${a.date.split('T')[0]}T${a.time}:00`);
            const bTime = new Date(`${b.date.split('T')[0]}T${b.time}:00`);
            return aTime - bTime;
          });
          if (futureClasses.length > 0) setUpcomingClass(futureClasses[0]);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const displayName = user?.name || user?.emailOrPhone?.split('@')[0] || 'Trader';

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCount, icon: FaGraduationCap, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    { label: 'Hours Learned', value: '0', icon: FaClock, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Certificates Earned', value: '0', icon: FaAward, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#0A0D14] pt-24 pb-20 md:pb-12 md:pt-28 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-[#D4AF37]">{displayName}</span> <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Continue your journey of learning and growth.</p>
          </div>
          <button onClick={() => navigate('/courses')} className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] px-6 py-2.5 rounded-full font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all w-max">
            Explore Courses
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-[#131722]/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-100">{stat.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero / Next Class Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] group border border-gray-800"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[#0A0D14] w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
              </div>
              
              <div className="absolute inset-0 z-20 p-8 md:p-10 flex flex-col justify-center text-left">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 backdrop-blur-md px-3 py-1 rounded-full w-max mb-4 border border-[#D4AF37]/20">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]"></span>
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Up Next</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white max-w-lg leading-tight mb-2">
                  {upcomingClass ? (upcomingClass.title || upcomingClass.course?.title || 'Live Class Session') : 'Welcome to MarketMax'}
                </h2>
                <p className="text-gray-300 mb-8 max-w-md line-clamp-2">
                  {upcomingClass ? `Join your upcoming session on ${new Date(upcomingClass.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} at ${upcomingClass.time}.` : 'Explore our premium institutional trading catalog and start a new journey today.'}
                </p>
                
                <button 
                  onClick={() => upcomingClass?.zoomLink ? window.open(upcomingClass.zoomLink, '_blank') : navigate('/dashboard/learning')} 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-bold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] w-max transition-all hover:scale-105 flex items-center gap-2"
                >
                  <FaPlay size={12}/> {upcomingClass?.zoomLink ? 'Join Live Session' : 'Go to Classes'}
                </button>
              </div>
            </motion.div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Resume Learning Card */}
            <div className="bg-[#131722]/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Resume Learning</h3>
              </div>

              <div className="group cursor-pointer" onClick={() => navigate('/dashboard/learning')}>
                <div className="w-full h-32 rounded-xl bg-[#0B0F19] overflow-hidden mb-4 relative border border-gray-800">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                  <div className="w-full h-full bg-[#1A202C] flex items-center justify-center">
                    <FaBookOpen className="text-[#D4AF37] opacity-40" size={40}/>
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#131722]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform">
                      <FaPlay className="text-[#D4AF37] ml-1" size={14}/>
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-gray-100 text-base leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors">Advanced Price Action</h4>
                <p className="text-xs text-gray-500 mb-3">Module 3: Institutional Order Flow</p>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#0B0F19] rounded-full overflow-hidden border border-gray-800">
                    <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">65%</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#131722]/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => navigate('/dashboard/learning')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0F19] transition-colors group border border-transparent hover:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                      <FaBookOpen size={16}/>
                    </div>
                    <span className="font-semibold text-gray-300 group-hover:text-[#D4AF37] transition-colors">My Courses</span>
                  </div>
                  <FaChevronRight className="text-gray-500 group-hover:text-[#D4AF37] text-xs"/>
                </button>

                <button onClick={() => navigate('/ebooks')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0F19] transition-colors group border border-transparent hover:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                      <FaBook size={16}/>
                    </div>
                    <span className="font-semibold text-gray-300 group-hover:text-[#D4AF37] transition-colors">E-Books</span>
                  </div>
                  <FaChevronRight className="text-gray-500 group-hover:text-[#D4AF37] text-xs"/>
                </button>

                <button onClick={() => navigate('/blog')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0F19] transition-colors group border border-transparent hover:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                      <FaBlog size={16}/>
                    </div>
                    <span className="font-semibold text-gray-300 group-hover:text-[#D4AF37] transition-colors">Read Blogs</span>
                  </div>
                  <FaChevronRight className="text-gray-500 group-hover:text-[#D4AF37] text-xs"/>
                </button>
                
                <button onClick={() => navigate('/dashboard/profile')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0F19] transition-colors group border border-transparent hover:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center text-gray-400 border border-gray-800">
                      <FaUser size={16}/>
                    </div>
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">Edit Profile</span>
                  </div>
                  <FaChevronRight className="text-gray-500 group-hover:text-white text-xs"/>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

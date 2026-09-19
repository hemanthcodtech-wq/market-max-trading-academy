import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaShieldAlt, FaLock, FaEnvelope, FaEye, FaEyeSlash, 
  FaArrowLeft, FaCheckCircle, FaAward, FaCloud, FaServer,
  FaKey, FaTimes, FaSyncAlt
} from 'react-icons/fa';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot / Reset Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Password, 3: Success
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        emailOrPhone: formData.email.trim(),
        password: formData.password
      });

      if (response.data.success) {
        if (response.data.role !== 'admin') {
          setError('Access Denied: Administrative privileges required.');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify({ email: response.data.emailOrPhone, role: response.data.role }));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Forgot Password Modal
  const handleOpenForgotModal = () => {
    setForgotStep(1);
    setForgotEmail(formData.email || '');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotMessage('');
    setIsForgotModalOpen(true);
  };

  // Step 1: Send OTP to Admin Email
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      return setForgotError('Please enter your administrative email address.');
    }
    setForgotError('');
    setForgotLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        emailOrPhone: forgotEmail.trim()
      });

      if (res.data.success) {
        setForgotMessage(res.data.message || '6-digit verification code sent to your email.');
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP & Set New Password
  const handleResetAdminPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length < 6) {
      return setForgotError('Please enter the 6-digit OTP code sent to your email.');
    }
    if (forgotNewPassword.length < 6) {
      return setForgotError('Password must be at least 6 characters long.');
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      return setForgotError('Passwords do not match.');
    }

    setForgotError('');
    setForgotLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        emailOrPhone: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword
      });

      if (res.data.success) {
        setForgotStep(3);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 md:p-8 font-inter relative overflow-hidden">
      
      {/* Background Ambient Liquid Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#131722]/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container Grid */}
      <div className="w-full max-w-5xl z-10">
        
        {/* Back Link */}
        <div className="mb-6 flex justify-between items-center px-2">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors bg-[#131722]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 shadow-xs"
          >
            <FaArrowLeft size={11} /> Return to Public Portal
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#D4AF37] bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            System Live & Verified
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#131722]/80 backdrop-blur-2xl border border-gray-800 shadow-[0_20px_70px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Institutional Branding Panel (Desktop Only) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1A2235] via-[#131722] to-[#0B0F19] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Top Brand Info */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 backdrop-blur-md border border-gray-800/20 rounded-full text-[10px] font-extrabold tracking-widest uppercase text-[#D4AF37]">
                <FaShieldAlt /> Authorized Personnel Only
              </div>

              <div className="space-y-2">
                <div className="bg-[#0B0F19] p-3.5 rounded-2xl inline-block shadow-md mb-2">
                  <img src="/logo.png" alt="MarketMax Logo" className="h-10 w-auto" />
                </div>
                <h2 className="text-xl lg:text-2xl font-black tracking-tight leading-tight">
                  MarketMax Trading Academy
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Academy of Trading, Technical Analysis & Financial Market Sciences
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/10 space-y-3.5 text-xs text-gray-300 font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <FaLock size={12} />
                  </div>
                  <span>256-Bit Encrypted Administrative Session</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <FaAward size={12} />
                  </div>
                  <span>Watermarked Certificate & Invoice Infrastructure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <FaCloud size={12} />
                  </div>
                  <span>Cloudinary Verified Master Vault</span>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 pt-8 mt-8 border-t border-gray-800/10 flex items-center justify-between text-[11px] text-gray-500">
              <span>MarketMax Portal v2.4</span>
              <span>Hyderabad Central Server</span>
            </div>
          </div>

          {/* Right Login Authentication Console */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center relative">
            
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#C99C29] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Executive Portal
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">System Sign In</h1>
              <p className="text-gray-400 text-xs lg:text-sm mt-1">
                Enter your administrative credentials to access the central LMS controller.
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-xs"
                >
                  <FaShieldAlt className="text-red-500 shrink-0" size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Admin Email */}
              <div className="space-y-1.5">
                <label className="block text-gray-300 text-xs font-extrabold uppercase tracking-wider">
                  Admin Account Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter administrative email (e.g. admin@sdf.com)"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#131722]/80 border border-gray-700 rounded-2xl text-sm font-medium text-white placeholder-gray-400 focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#0A4F2A]/20 focus:border-[#0A4F2A] outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-gray-300 text-xs font-extrabold uppercase tracking-wider">
                    Administrative Password
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="text-xs text-[#D4AF37] font-extrabold hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter administrative password"
                    className="w-full pl-11 pr-12 py-3.5 bg-[#131722]/80 border border-gray-700 rounded-2xl text-sm font-medium text-white placeholder-gray-400 focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#0A4F2A]/20 focus:border-[#0A4F2A] outline-none transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-extrabold py-4 rounded-2xl shadow-lg shadow-[#0A4F2A]/25 hover:shadow-[#0A4F2A]/40 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 text-sm tracking-wide mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    <span>Authorize & Open Controller</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span>Encrypted SSL Gateway</span>
              <span>MarketMax Trading Academy © 2026</span>
            </div>

          </div>

        </motion.div>
      </div>

      {/* ADMIN FORGOT PASSWORD / RESET PASSWORD MODAL */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsForgotModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0B0F19] w-full max-w-md rounded-[2.5rem] p-6 lg:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-lg">
                    <FaKey />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {forgotStep === 1 && 'Reset Admin Password'}
                      {forgotStep === 2 && 'Verify 6-Digit OTP'}
                      {forgotStep === 3 && 'Password Reset Complete!'}
                    </h2>
                    <p className="text-xs text-gray-400">Secure administrative account recovery</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-all"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              {forgotError && (
                <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold rounded-2xl">
                  {forgotError}
                </div>
              )}

              {forgotMessage && forgotStep === 2 && (
                <div className="mb-4 p-3.5 bg-[#D4AF37]/10 border border-blue-600/30 text-[#D4AF37] text-xs font-bold rounded-2xl flex items-center gap-2">
                  <FaCheckCircle /> {forgotMessage}
                </div>
              )}

              {/* STEP 1: Enter Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                      Registered Admin Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@sdf.com"
                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-2xl text-sm font-medium focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-blue-600 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">
                      We will send a 6-digit verification code to your registered email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-extrabold text-xs rounded-2xl shadow-md disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <span>Send 6-Digit OTP Code</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter OTP & New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetAdminPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-2xl text-center text-xl font-mono tracking-widest font-black text-[#C99C29] focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-2xl text-sm font-medium focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-blue-600 outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
                      >
                        {showForgotNewPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-2xl text-sm font-medium focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-gray-400 hover:underline font-bold"
                    >
                      ← Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-extrabold text-xs rounded-2xl shadow-md disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <span>Reset & Save New Password</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3: Success Screen */}
              {forgotStep === 3 && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                    <FaCheckCircle size={28} />
                  </div>
                  <p className="text-xs text-gray-400">
                    Your administrative password has been updated securely. You can now log in with your new password.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ email: forgotEmail, password: '' });
                      setIsForgotModalOpen(false);
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    Sign In with New Password →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminLogin;

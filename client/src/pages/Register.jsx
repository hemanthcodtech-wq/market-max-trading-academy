import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('FORM'); // 'FORM' | 'OTP'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Resend OTP Countdown
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      return setError('Please enter your full name.');
    }
    if (!formData.phone.trim()) {
      return setError('Please enter your phone number.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return setError('Please enter a valid email address.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!agreed) {
      return setError('Please agree to the Terms & Conditions and Privacy Policy.');
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register-send-otp`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.data.success) {
        setStep('OTP');
        setCountdown(60);
        setSuccessMsg(`A 6-digit verification code has been sent to ${formData.email.trim()}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      return setError('Please enter the complete 6-digit verification code.');
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register-verify-otp`, {
        email: formData.email.trim(),
        otp: otp.trim()
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          emailOrPhone: response.data.emailOrPhone,
          role: response.data.role
        }));

        setSuccessMsg('Account verified successfully! Redirecting...');
        
        const searchParams = new URLSearchParams(location.search);
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        
        setTimeout(() => {
          navigate(redirectUrl);
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register-send-otp`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.data.success) {
        setCountdown(60);
        setSuccessMsg(`A fresh verification code was sent to ${formData.email.trim()}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#0A0D14] flex flex-col items-center justify-center relative overflow-hidden font-inter py-10 px-4">
      
      {/* Background Refraction Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center z-10">
        
        {/* Glassmorphism Card */}
        <div className="w-full bg-[#131722]/80 backdrop-blur-xl border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-7 md:p-9 flex flex-col items-center">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-5 w-full">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl shadow-lg border border-gray-700/50">
              <img src="/logo.png" alt="MarketMax Trading Academy" className="w-40 h-auto object-contain brightness-110" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ─── STEP 1: REGISTRATION FORM ─── */}
            {step === 'FORM' && (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <div className="text-center mb-6 w-full">
                  <span className="inline-block px-4 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[11px] font-bold uppercase tracking-wider mb-2">
                    Student Enrollment
                  </span>
                  <h2 className="text-2xl font-black font-outfit text-white tracking-tight">Create an Account</h2>
                  <p className="text-[13px] text-gray-400 mt-1 font-medium">Join the global Market & institutional learning community</p>
                </div>

                {error && (
                  <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-3.5">
                  
                  {/* Full Name */}
                  <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-inner">
                    <FaUser className="text-gray-500 mr-3 shrink-0" size={14} />
                    <input 
                      name="name"
                      type="text"
                      placeholder="Full Legal Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-inner">
                    <FaPhone className="text-gray-500 mr-3 shrink-0" size={14} />
                    <input 
                      name="phone"
                      type="tel"
                      placeholder="Phone Number (e.g. 9876543210)"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-inner">
                    <FaEnvelope className="text-gray-500 mr-3 shrink-0" size={14} />
                    <input 
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium"
                    />
                  </div>
                  
                  {/* Password */}
                  <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 relative transition-all shadow-inner">
                    <FaLock className="text-gray-500 mr-3 shrink-0" size={14} />
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create Password (min 6 chars)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium pr-8"
                    />
                    <button 
                      type="button"
                      className="absolute right-4 text-gray-500 hover:text-[#D4AF37] cursor-pointer transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 relative transition-all shadow-inner">
                    <FaLock className="text-gray-500 mr-3 shrink-0" size={14} />
                    <input 
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium pr-8"
                    />
                    <button 
                      type="button"
                      className="absolute right-4 text-gray-500 hover:text-[#D4AF37] cursor-pointer transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>

                  {/* Terms and Privacy Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer select-none mt-1">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-gray-700 bg-[#0B0F19] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer" 
                    />
                    <span className="leading-snug font-medium">
                      I agree to the <Link to="/terms" target="_blank" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline">Terms & Conditions</Link>, <Link to="/privacy" target="_blank" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline">Privacy Policy</Link>, and <Link to="/refund-policy" target="_blank" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline">Refund Policy</Link>.
                    </span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C99C29] text-[#0B0F19] font-black text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:scale-[1.02] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div> Sending Verification Code...</>
                    ) : 'Verify Email & Register →'}
                  </button>
                </form>

                {/* Sign In Link */}
                <p className="text-[13px] text-gray-400 text-center mt-6 font-medium">
                  Already have an account? <Link to="/login" className="text-[#D4AF37] font-bold hover:underline">Login here</Link>
                </p>
              </motion.div>
            )}

            {/* ─── STEP 2: 6-DIGIT EMAIL OTP VERIFICATION ─── */}
            {step === 'OTP' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FaShieldAlt size={28} />
                </div>

                <h2 className="text-2xl font-black font-outfit text-white tracking-tight mb-2">Verify Your Email</h2>
                <p className="text-[13px] text-gray-400 mb-2 font-medium">
                  We've sent a 6-digit verification code to:
                </p>
                <p className="text-[13px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-block mb-6">
                  {formData.email}
                </p>

                {successMsg && (
                  <div className="w-full mb-4 p-3 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold text-center">
                    {successMsg}
                  </div>
                )}

                {error && (
                  <div className="w-full mb-4 p-3 bg-red-900/40 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                      Enter 6-Digit Code
                    </label>
                    <input 
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full py-4 bg-[#0B0F19] border-2 border-gray-700 focus:border-[#D4AF37] focus:bg-[#0B0F19] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl text-center text-3xl font-mono font-black tracking-[12px] text-[#D4AF37] outline-none transition-all shadow-inner"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C99C29] text-[#0B0F19] font-black text-[15px] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform hover:scale-[1.02] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <><div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div> Verifying Account...</>
                    ) : 'Confirm & Complete Registration'}
                  </button>

                  {/* Resend OTP & Back Action */}
                  <div className="pt-4 border-t border-gray-700/50 flex flex-col items-center gap-3 text-[13px]">
                    {countdown > 0 ? (
                      <span className="text-gray-400 font-medium">
                        Resend code in <strong className="text-emerald-400">{countdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[#D4AF37] font-bold hover:underline cursor-pointer"
                      >
                        Resend Verification Code
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setStep('FORM');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-gray-500 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FaArrowLeft size={10} /> Edit Details / Change Email
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Register;

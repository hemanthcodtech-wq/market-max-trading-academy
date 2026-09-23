import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaApple } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '844742458800-el1l2d3uogbp2vdg4b4k794e1cemqf47.apps.googleusercontent.com';

const Login = () => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const googleButtonRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      emailOrPhone: data.emailOrPhone,
      name: data.name,
      avatar: data.avatar,
      role: data.role
    }));
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    navigate(redirectUrl);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, formData, { timeout: 10000 });
      if (response.data.success) {
        redirectAfterLogin(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Identity Services callback
  const handleGoogleResponse = async (response) => {
    if (!agreed) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    setIsGoogleLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
        credential: response.credential,
      });
      if (res.data.success) {
        redirectAfterLogin(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Load Google Identity Services script and initialize
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-identity-script')) {
        initGoogle();
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    };

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
          use_fedcm_for_prompt: false,
        });
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 360
          });
        }
      }
    };

    loadGoogleScript();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#0A0D14] flex flex-col items-center justify-center relative overflow-hidden font-inter py-12 px-4">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md flex flex-col items-center z-10">
        
        {/* Glassmorphism Card */}
        <div className="w-full bg-[#131722]/80 backdrop-blur-xl border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center relative z-10">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6 w-full drop-shadow-sm">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl shadow-lg border border-gray-700/50">
              <img src="/logo.png" alt="MarketMax Trading Academy" className="w-40 h-auto object-contain brightness-110" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8 w-full">
            <h2 className="text-2xl md:text-3xl font-black font-outfit text-white mb-2 tracking-tight">{t('login_welcome')}</h2>
            <p className="text-[14px] text-gray-400 font-medium">{t('login_subtitle')}</p>
          </div>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-inner">
              <input 
                name="emailOrPhone"
                type="text"
                placeholder="Email Address or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium"
              />
            </div>
            
            <div className="flex items-center px-4 py-3.5 bg-[#0B0F19] border border-gray-700 rounded-2xl focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 relative transition-all shadow-inner">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white font-medium pr-10"
              />
              <button 
                type="button"
                className="absolute right-4 text-gray-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            <div className="flex justify-end items-center mt-[-8px]">
              <Link to="/forgot-password" className="text-[13px] text-gray-400 font-semibold hover:text-[#D4AF37] hover:underline transition-colors">{t('login_forgot')}</Link>
            </div>

            {/* Terms and Privacy Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer select-none">
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
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C99C29] text-[#0B0F19] font-black text-[16px] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:scale-[1.02] transition-all duration-300 flex justify-center items-center"
            >
              {isLoading ? t('login_loading') : t('login_btn')}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center w-full">
            <p className="text-[14px] text-gray-400 font-medium">
              {t('login_no_account')} <Link to="/register" className="text-[#D4AF37] font-bold hover:underline transition-colors">{t('login_signup')}</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center space-x-4 mt-6 mb-6">
            <div className="h-[1px] bg-gray-700 flex-1"></div>
            <span className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">{t('login_or')}</span>
            <div className="h-[1px] bg-gray-700 flex-1"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col justify-center gap-4 mb-2 w-full">
            <div className="w-full min-h-12 flex items-center justify-center overflow-hidden" ref={googleButtonRef} />
            <button className="w-full h-12 rounded-xl bg-[#0B0F19] border border-gray-700 flex items-center justify-center gap-3 hover:border-gray-500 hover:bg-gray-800 transition-all duration-300">
              <FaApple size={22} className="text-white" />
              <span className="text-gray-300 font-semibold text-[14px]">{t('login_apple')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

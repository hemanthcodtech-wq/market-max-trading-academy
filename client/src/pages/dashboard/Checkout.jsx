import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLock, FaShieldAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [email, setEmail] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr).emailOrPhone || '';
      }
    } catch(e) {}
    return '';
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/public/${id}`);
        setCourse(data.data);
      } catch (error) {
        console.error('Error fetching course for checkout:', error);
        setLoadError(error.response?.data?.message || 'This course is not available for checkout.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please accept the Terms & Conditions and Refund Policy to proceed with checkout.');
      return;
    }
    setProcessing(true);

    try {
      // 1. Create order on server
      const token = localStorage.getItem('token');
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payments/create-order`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order, key } = orderRes.data;

      // 2. Initialize Razorpay checkout
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'MarketMax Trading Academy',
        description: `Enrollment for ${course.title}`,
        image: '/logo.png',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on server
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
                amountPaid: course.price,
                studentEmail: email
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => {
                navigate(`/dashboard/learning/${course._id}`);
              }, 2500);
            }
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          email: email,
          contact: ''
        },
        theme: {
          color: '#297838'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Error initializing checkout');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19]">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-6 text-center font-inter">
        <div className="max-w-md rounded-3xl border border-gray-800 bg-[#131722] p-8 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"><FaLock size={20} /></div>
          <h1 className="mt-5 text-2xl font-black text-white">Checkout unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{loadError || 'We could not load this course. Please return to the course catalogue and try again.'}</p>
          <button onClick={() => navigate('/courses')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#0B0F19]"><FaArrowLeft size={12} /> Back to courses</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl border border-gray-800 bg-[#131722] p-8 text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <FaCheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">You have been enrolled into {course?.title}. Redirecting you to your schedule...</p>
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 py-8 font-inter text-gray-300 sm:px-6 lg:px-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
            <FaLock size={16} />
          </div>
          <h1 className="text-2xl font-black text-white">Secure Checkout</h1>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-800 bg-[#131722] shadow-[0_25px_70px_rgba(0,0,0,0.3)] md:flex-row">
          
          {/* Payment Form */}
          <div className="flex-1 p-6 sm:p-8 md:p-12">
            <h2 className="text-xl font-bold text-white mb-6">Payment Information</h2>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Registered Student Account</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="student@example.com" className="w-full p-4 bg-[#0F172A] border border-gray-700 rounded-xl focus:bg-[#1E293B] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all outline-none text-sm font-medium" />
              </div>

              {/* Payment Terms Agreement Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer select-none bg-[#0F172A]/80 p-3.5 rounded-xl border border-gray-700">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer" 
                />
                <span className="leading-relaxed">
                  I have read and agree to the <Link to="/terms" target="_blank" className="text-[#D4AF37] font-bold hover:underline">Terms of Service</Link>, <Link to="/privacy" target="_blank" className="text-[#D4AF37] font-bold hover:underline">Privacy Policy</Link>, and <Link to="/refund-policy" target="_blank" className="text-[#D4AF37] font-bold hover:underline">Refund & Cancellation Policy</Link>.
                </span>
              </label>

              <div className="pt-2">
                <button disabled={processing} type="submit" className="w-full py-4 bg-[#D4AF37] hover:bg-[#D4AF37]-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50 transition-all duration-300 disabled:opacity-70 flex justify-center items-center gap-3">
                  {processing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</> : (
                    <>
                      Proceed to Pay ₹{course?.price}
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4 font-medium">
                <FaShieldAlt className="text-green-600" /> 256-bit SSL encrypted • Instant course access
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col border-t border-gray-800 bg-[#0F172A] p-6 sm:p-8 md:w-96 md:border-l md:border-t-0 md:p-12">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="flex gap-4 mb-8">
              <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                {course?.thumbnailUrl ? <img src={course.thumbnailUrl} className="w-full h-full object-cover" /> : null}
              </div>
              <div>
                <h4 className="font-bold text-white line-clamp-2 leading-tight text-sm">{course?.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{course?.instructor}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex justify-between text-gray-400">
                <span>Original Price</span>
                <span>₹{course?.price}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>-₹0.00</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold">Total</span>
                <span className="text-3xl font-black text-white">₹{course?.price}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;

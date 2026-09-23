import React from 'react';
import { Link } from 'react-router-dom';
import { FaUndoAlt, FaArrowLeft, FaClock, FaCheckCircle, FaMoneyCheckAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 font-inter py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-white transition-colors">
          <FaArrowLeft size={12} />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-gray-800 bg-gradient-to-br from-[#121722] to-[#0B0F19] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-bold uppercase tracking-[0.18em] mb-4">
            <FaUndoAlt size={12} /> Payment & Cancellation Terms
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-outfit">Refund & Cancellation Policy</h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Last Updated: September 22, 2026 • MarketMax Trading Academy
          </p>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-800 text-xs font-bold text-gray-300">
            <Link to="/terms" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Contact Support</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-gray-800 bg-[#101722]/90 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 text-gray-300 leading-relaxed"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-5">
              <FaClock className="text-[#D4AF37] text-xl mb-2" />
              <h4 className="font-extrabold text-white text-sm">Cancellation Window</h4>
              <p className="text-xs text-gray-400 mt-1">Up to 24 hours before the first live session.</p>
              <span className="text-[#D4AF37] text-[11px] font-bold mt-3 block">Refund or Batch Transfer</span>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-5">
              <FaMoneyCheckAlt className="text-[#D4AF37] text-xl mb-2" />
              <h4 className="font-extrabold text-white text-sm">Refund Timeline</h4>
              <p className="text-xs text-gray-400 mt-1">Refunds are processed back to the original payment method.</p>
              <span className="text-[#D4AF37] text-[11px] font-bold mt-3 block">5-7 business days</span>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-5">
              <FaCheckCircle className="text-[#D4AF37] text-xl mb-2" />
              <h4 className="font-extrabold text-white text-sm">Digital Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">All services are digital with instant access after payment.</p>
              <span className="text-[#D4AF37] text-[11px] font-bold mt-3 block">Instant access granted</span>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">1</span>
              Nature of Services
            </h2>
            <p className="text-sm text-gray-300">
              MarketMax Trading Academy offers digital educational services, live learning sessions, mentoring, and recorded study modules. Because class seats are limited and mentors allocate time and resources per batch, our cancellation and refund policy is designed to be fair to both learners and instructors. These services are for educational access and learning support, not for brokerage, trading execution, or investment account management.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">2</span>
              Cancellation Before Batch Start
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5 text-gray-300">
              <li>If you cancel before the first live session starts, you may be eligible for a full refund or a transfer to a future batch.</li>
              <li>If the cancellation is requested within 24 hours of the first session, we may offer a batch transfer rather than a direct refund.</li>
              <li>Requests are reviewed on a case-by-case basis based on the exact timing and status of the enrollment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">3</span>
              After Course Begins
            </h2>
            <p className="text-sm text-gray-300">
              Once a course or live learning batch has started, direct refunds are generally not provided. However, in cases of genuine hardship, medical situations, or documented emergencies, we may allow a credit transfer or extended access to recorded educational content. This does not apply to any trading or investment service, as no such service is provided by the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">4</span>
              Payment Processing & Refund Timeline
            </h2>
            <p className="text-sm text-gray-300">
              Approved refunds are returned to the original payment method through the payment provider used at checkout. The exact settlement time depends on the payment provider and banking partner. In most cases, refunds reflect within 5 to 7 business days. Fees relate only to educational content and services purchased through the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">5</span>
              Digital Goods & Instant Delivery
            </h2>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
              <p className="font-bold flex items-center gap-2 mb-2"><FaCheckCircle className="text-emerald-400" /> No physical shipping</p>
              <p>
                All services are digital and delivered instantly after successful payment verification. Students receive dashboard access, course access links, and class-related details without delay. Because digital access is provided immediately, cash refunds are generally not available after content access has begun unless approved under exceptional circumstances. The platform delivers educational access only and does not provide trading or brokerage services.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">6</span>
              How to Request Refund or Transfer
            </h2>
            <p className="text-sm text-gray-300">
              To request a refund, transfer, or cancellation review, please email your registered email address, order ID, course name, and reason for the request to our support team. We will respond within the time promised by our helpdesk process and guide you to the next available option.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="mailto:support@marketmaxtradingacademy.com?subject=Refund%20Request" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#D4AF37] text-[#0B0F19] text-xs font-bold hover:bg-[#F3E5AB] transition-all shadow-lg shadow-[#D4AF37]/20">
                <FaEnvelope /> support@marketmaxtradingacademy.com
              </a>
              <Link to="/dashboard/support" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-700 bg-gray-800 text-gray-200 text-xs font-bold hover:text-white transition-colors">
                Submit Ticket <FaArrowRight size={10} />
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;

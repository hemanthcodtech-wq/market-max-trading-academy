import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaArrowLeft, FaLock, FaDatabase, FaCookieBite, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            <FaUserShield size={12} /> User Data Protection
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-outfit">Privacy Policy</h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Last Updated: September 22, 2026 • MarketMax Trading Academy
          </p>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-800 text-xs font-bold text-gray-300">
            <Link to="/terms" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Terms & Conditions</Link>
            <Link to="/refund-policy" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Refund Policy</Link>
            <Link to="/contact" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Contact Support</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-gray-800 bg-[#101722]/90 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 text-gray-300 leading-relaxed"
        >
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">1</span>
              Our Commitment
            </h2>
            <p className="text-sm text-gray-300">
              MarketMax respects the privacy of every student, visitor, learner, and client. This Privacy Policy explains how we collect, process, store, and protect personal information when you interact with our educational website, learning programs, live classes, study resources, and digital services. This is an educational platform and does not provide brokerage, trading, custody, or investment account services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">2</span>
              Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-4">
                <div className="font-bold text-white flex items-center gap-2 mb-2"><FaDatabase className="text-[#D4AF37]" /> Account Information</div>
                <p className="text-gray-400">Name, email, phone number, profile details, preferred language, and account activity for course access and learning support.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-4">
                <div className="font-bold text-white flex items-center gap-2 mb-2"><FaLock className="text-[#D4AF37]" /> Payment Information</div>
                <p className="text-gray-400">Transaction IDs, payment status, order value, and invoice records for educational program purchases. We do not store sensitive card or UPI credentials.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-4">
                <div className="font-bold text-white flex items-center gap-2 mb-2"><FaUserShield className="text-[#D4AF37]" /> Learning Activity</div>
                <p className="text-gray-400">Course enrollment, attendance, study progress, purchase history, certificates, and support requests.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0E131C] p-4">
                <div className="font-bold text-white flex items-center gap-2 mb-2"><FaCookieBite className="text-[#D4AF37]" /> Technical Data</div>
                <p className="text-gray-400">IP address, device/browser information, timezone, and session cookies required for secure access.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">3</span>
              Payment & Security
            </h2>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
              <p className="font-bold flex items-center gap-2 mb-2"><FaLock className="text-emerald-400" /> Secure Payment Processing</p>
              <p>
                Payments are processed securely through Razorpay and other approved payment gateways. Sensitive card details and UPI credentials are never retained on our servers. We use secure encryption and third-party payment processing standards to protect all transactions.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">4</span>
              How We Use Your Information
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5 text-gray-300">
              <li>To grant access to your enrolled courses, digital study resources, and learning dashboard.</li>
              <li>To send course updates, reminders, session links, educational communication, and payment receipts.</li>
              <li>To support learner queries, onboarding, technical troubleshooting, and student assistance.</li>
              <li>To detect fraud, prevent misuse, and maintain platform security for educational services.</li>
              <li>To generate certificates, maintain academic records, and support the delivery of learning programs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">5</span>
              Third Parties & Data Sharing
            </h2>
            <p className="text-sm text-gray-300">
              We do not sell or rent your personal information. We may share it only with trusted service providers that are necessary to operate the educational platform, such as payment gateways, video conferencing platforms, cloud hosting providers, and support systems. Any such sharing is limited to what is necessary for those services and does not extend to trading, brokerage, or investment management operations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">6</span>
              Your Rights
            </h2>
            <p className="text-sm text-gray-300">
              You may request access, updates, corrections, or deletion of your data through your account dashboard or by contacting our support team. We will process such requests in compliance with applicable privacy laws and platform requirements.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D131D] p-6 rounded-2xl">
            <div>
              <h4 className="font-extrabold text-white text-sm">Privacy Contact</h4>
              <p className="text-xs text-gray-400 mt-1">For privacy or data-related requests, contact our support desk.</p>
            </div>
            <a href="mailto:support@marketmaxtradingacademy.com" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0B0F19] text-xs font-bold rounded-xl hover:bg-[#F3E5AB] transition-all shadow-lg shadow-[#D4AF37]/20">
              <FaEnvelope size={11} /> support@marketmaxtradingacademy.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

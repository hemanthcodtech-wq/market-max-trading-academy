import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaArrowLeft, FaShieldAlt, FaCreditCard, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 font-inter py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-white transition-colors"
        >
          <FaArrowLeft size={12} />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-gray-800 bg-gradient-to-br from-[#121722] to-[#0B0F19] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-bold uppercase tracking-[0.18em] mb-4">
            <FaFileContract size={12} /> Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-outfit">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Last Updated: September 22, 2026 • MarketMax Trading Academy
          </p>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-800 text-xs font-bold text-gray-300">
            <Link to="/privacy-policy" className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-[#D4AF37] hover:text-[#0B0F19] transition-colors">Privacy Policy</Link>
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
              Acceptance of Terms
            </h2>
            <p className="text-sm text-gray-300">
              Welcome to <strong className="text-white">MarketMax Trading Academy</strong> (“MarketMax”, “we”, “our”, or “us”). By visiting <a href="https://marketmaxtradingacademy.com" className="text-[#D4AF37] underline">marketmaxtradingacademy.com</a>, creating an account, enrolling in a course, joining a live trading room, or using any digital services offered by MarketMax, you agree to these Terms & Conditions. If you do not agree, please do not access or use our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">2</span>
              Educational Purpose Only
            </h2>
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-amber-200">
              <p className="font-bold flex items-center gap-2 mb-2"><FaExclamationTriangle className="text-amber-400" /> Important Notice</p>
              <p>
                All learning content, market commentary, trade ideas, educational videos, strategies, and live sessions are provided strictly for educational and informational purposes only. They do not constitute investment advice, financial advice, or a solicitation to buy or sell securities, derivatives, or cryptocurrencies. MarketMax does not guarantee profits or outcomes from any strategy or educational program.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">3</span>
              Enrollment, Accounts & Access
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5 text-gray-300">
              <li>Students must provide accurate details while registering and keep login credentials secure.</li>
              <li>Access to courses, classes, live rooms, materials, and downloadable content is granted only for the active enrolled user.</li>
              <li>Account sharing, credential transfer, or unauthorized access to live sessions is strictly prohibited.</li>
              <li>We reserve the right to suspend or terminate access for misuse, abuse, or violation of these terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">4</span>
              Fees, Payments & Razorpay
            </h2>
            <div className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-4">
              <div className="flex items-center gap-2 font-bold text-[#F3D36A] mb-2">
                <FaCreditCard /> Payment Processing
              </div>
              <p className="text-sm text-gray-300">
                All course fees are payable in INR unless explicitly stated otherwise. Payments are processed through Razorpay or other approved payment gateways. By making a payment via a payment gateway, you consent to the gateway’s terms, privacy policy, and processing of your payment information. MarketMax does not store full debit card, credit card, or UPI credentials on its servers. We use secure payment processing services in compliance with applicable security standards.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">5</span>
              Course Access & Materials
            </h2>
            <p className="text-sm text-gray-300">
              The platform may include recordings, live class access, study notes, strategy PDFs, dashboards, charts, and community resources. These are licensed for personal educational use only. Reproduction, resale, redistribution, unauthorized sharing, or commercial use is not permitted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">6</span>
              Intellectual Property
            </h2>
            <p className="text-sm text-gray-300">
              All content published on the platform, including training modules, logos, strategy frameworks, videos, course materials, designs, and branding, remains the intellectual property of MarketMax Trading Academy and may not be copied, modified, sold, or distributed without prior written authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">7</span>
              Code of Conduct
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5 text-gray-300">
              <li>Students must conduct themselves respectfully in all live sessions, groups, and communication channels.</li>
              <li>Harassment, abusive language, spam, hate speech, or promotional activity may result in removal from the platform.</li>
              <li>Any illegal, deceptive, or fraudulent activity is strictly prohibited.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">8</span>
              Liability & Disclaimers
            </h2>
            <p className="text-sm text-gray-300">
              MarketMax is not liable for any loss, financial damage, emotional distress, or business interruption arising from the use of educational content, strategies, or third-party market tools referenced on the website. Trading and investing involve risk, and all users must use judgment and risk management.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#0B0F19] text-xs flex items-center justify-center font-black">9</span>
              Governing Law & Jurisdiction
            </h2>
            <p className="text-sm text-gray-300">
              These Terms are governed by the laws of India, and any dispute will be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D131D] p-6 rounded-2xl">
            <div>
              <h4 className="font-extrabold text-white text-sm">Need help with a legal or payment question?</h4>
              <p className="text-xs text-gray-400 mt-1">Our support team can help with policy clarifications and payment concerns.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0B0F19] text-xs font-bold rounded-xl hover:bg-[#F3E5AB] transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              Contact Support <FaArrowRight size={10} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FaAward, FaIdCard, FaSearch, FaShieldAlt,
  FaExternalLinkAlt, FaGraduationCap, FaExclamationTriangle,
  FaQrcode, FaCheck, FaTimes
} from 'react-icons/fa';
import SEO from '../../components/common/SEO';

const Certificates = () => {
  const [searchId, setSearchId] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    const cleaned = searchId.trim().toUpperCase();
    if (!cleaned) return;

    setSearched(true);
    setResult(null);
    setVerifying(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/verify-certificate/${encodeURIComponent(cleaned)}`);
      const certificate = response.data?.data;
      setResult({
        id: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseTitle || 'Course Completion Program',
        issuedDate: certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not available',
        status: certificate.status || 'Authentic & Verified',
        grade: 'Course Completion',
        type: 'Institutional Course Completion Certificate',
        certificateUrl: certificate.certificateUrl
      });
    } catch {
      setResult(null);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-gray-300 font-inter pt-24 pb-20">
      <SEO
        title="Certificates & Digital Verification | MarketMax Trading Academy"
        description="Verify official Course Completion Certificates issued by MarketMax Trading Academy with unique certificate IDs and tamper-proof records."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaAward /> Verified Academic Credentials
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-outfit text-white tracking-tight leading-tight">
            ACADEMY CERTIFICATIONS & <br />
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
              DIGITAL VERIFICATION
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mt-4 leading-relaxed font-medium">
            Every enrolled student who successfully finishes course curriculum, practical backtesting assignments, and risk audits earns a verifiable Course Completion Certificate.
          </p>
        </div>

        {/* ── MANDATORY REGULATORY COMPLIANCE NOTICE ── */}
        <div className="mb-12 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <FaExclamationTriangle className="text-amber-400 text-xl shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed font-medium">
            <strong className="text-amber-300 font-bold block mb-1">
              Important Compliance & Transparency Notice:
            </strong>
            Certificates issued by MarketMax Trading Academy are institutional <strong>Course Completion Certificates</strong> acknowledging individual academic achievement and practical curriculum completion. They are not issued by SEBI, NISM, or any government agency. NISM Series VIII and Series XV modules offered here are preparatory educational programs; official NISM regulatory certifications must be taken directly at accredited NISM test centers.
          </div>
        </div>

        {/* 4 Pillars of Certification */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Course Completion Certificate',
              icon: FaGraduationCap,
              tag: 'Pillar 1',
              desc: 'Official institutional recognition awarded after passing practical trading exams and submitting verified trade logs.'
            },
            {
              title: 'Unique Certificate ID',
              icon: FaIdCard,
              tag: 'Pillar 2',
              desc: 'Every certificate contains an unforgeable serialized alphanumeric ID (e.g. MM-2026-FND-101) registered in our database.'
            },
            {
              title: 'Digital Certificate Verification',
              icon: FaShieldAlt,
              tag: 'Pillar 3',
              desc: 'Employers, brokerages, and prop desks can instantly verify credential authenticity 24/7 using our online verification portal.'
            },
            {
              title: 'Course-Wise Specializations',
              icon: FaAward,
              tag: 'Pillar 4',
              desc: 'Specialized credentials available for Technical Analysis, Price Action, Options Trading, Risk Management, and NISM prep.'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glossy-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                      {pillar.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-gray-700 flex items-center justify-center text-[#D4AF37]">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-white font-outfit mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DIGITAL VERIFICATION TOOL SECTION ── */}
        <div className="glossy-black rounded-3xl p-6 md:p-12 border border-[#D4AF37]/30 shadow-2xl max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] inline-block mb-3">
              <FaQrcode size={24} />
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
              Verify a Certificate
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-2">
              Enter the unique Certificate ID found at the bottom of the MarketMax certificate.
            </p>
          </div>

          <form onSubmit={handleVerify} className="max-w-xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter Certificate ID (e.g. MM-2026-FND-101)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#131722] border border-gray-700 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C99C29] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0B0F19] font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                {verifying ? 'Checking...' : 'Verify ID'}
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-gray-500 mb-8">Verification checks the live certificate registry.</p>

          {/* Verification Result Card */}
          <AnimatePresence>
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-xl mx-auto"
              >
                {result ? (
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0B0F19] to-emerald-950/20 border border-emerald-500/40 p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                          <FaCheck size={14} />
                        </span>
                        <div>
                          <p className="text-emerald-400 font-black text-sm">Official Record Verified</p>
                          <p className="text-[10px] text-gray-400 font-mono">Status: Authenticated in Registry</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {result.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Student Name:</span>
                        <span className="font-bold text-white text-sm">{result.studentName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Course Title:</span>
                        <span className="font-bold text-[#D4AF37]">{result.courseName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Certificate Classification:</span>
                        <span className="font-medium text-gray-300">{result.type}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Performance Assessment:</span>
                        <span className="font-medium text-emerald-400">{result.grade}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Date Issued:</span>
                        <span className="font-mono text-gray-300">{result.issuedDate}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Certificate ID:</span>
                        <span className="font-mono font-bold text-white">{result.id}</span>
                      </div>
                      {result.certificateUrl && (
                        <a href={result.certificateUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F3D36A] hover:text-white">
                          <FaExternalLinkAlt size={10} /> View Certificate PDF
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-rose-950/30 border border-rose-500/30 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
                      <FaTimes size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-rose-300">No Certificate Found</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      Certificate ID "{searchId}" was not found in our verified registry. Please check the spelling or contact academic support.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Certificates;

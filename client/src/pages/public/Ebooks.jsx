import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaDownload, FaEye, FaFilePdf, FaStar, FaSearch, FaLock, FaCheckCircle } from 'react-icons/fa';
import SEO from '../../components/common/SEO';

const EBOOKS = [
  {
    id: 'price-action-bible',
    title: 'The Price Action Master Playbook',
    subtitle: 'High-Probability Candlestick & Liquidity Structures',
    pages: '124 Pages',
    rating: '4.9/5',
    category: 'Price Action',
    language: 'English & Telugu',
    description: 'A complete breakdown of institutional order blocks, fair value gaps, dynamic market structure, and entry triggers without lagging indicators.',
    topics: ['Candlestick Anatomy', 'Order Blocks & FVG', 'Break of Structure (BOS)', 'High-Probability Entry Triggers'],
    downloadUrl: '#'
  },
  {
    id: 'options-greeks-handbook',
    title: 'Options Greeks & Adjustment Handbook',
    subtitle: 'Practical Guide to Delta, Theta Decay & Iron Condors',
    pages: '98 Pages',
    rating: '4.8/5',
    category: 'Derivatives',
    language: 'English & Telugu',
    description: 'Master weekly options selling, credit spreads, theta harvesting, IV crush strategies, and real-time defensive adjustments when trades go wrong.',
    topics: ['The 4 Greeks Explained', 'Directional vs Non-Directional Spreads', 'Expiry Day Playbook', 'Firefighting Tested Adjustments'],
    downloadUrl: '#'
  },
  {
    id: 'risk-management-manual',
    title: 'Risk Management & Psychology Manual',
    subtitle: 'From Gambler to Systematic Trader',
    pages: '76 Pages',
    rating: '5.0/5',
    category: 'Psychology',
    language: 'English & Telugu',
    description: 'The definitive blueprint for capital preservation, position sizing formulas, overcoming FOMO, revenge trading, and auditing trading journals.',
    topics: ['The 1% Capital Rule', 'Drawdown Recovery Matrix', 'Trading Biases & Mental Traps', 'Trade Journaling Architecture'],
    downloadUrl: '#'
  },
  {
    id: 'nism-viii-exam-guide',
    title: 'NISM Series VIII Equity Derivatives Exam Guide',
    subtitle: 'Complete Syllabus, Summary Notes & 300+ Mock MCQs',
    pages: '160 Pages',
    rating: '4.9/5',
    category: 'NISM Prep',
    language: 'English',
    description: 'Official curriculum summary notes, regulatory guidelines, margin frameworks, and 3 full-length solved practice exam papers with explanations.',
    topics: ['SEBI & Regulatory Environment', 'Futures & Options Accounting', 'Clearing & Settlement Mechanics', '300+ Practice MCQs'],
    downloadUrl: '#'
  },
  {
    id: 'intraday-setup-cards',
    title: 'Intraday Trading Quick-Reference Flashcards',
    subtitle: 'ORB, VWAP Reclaim & Momentum Scalping Setups',
    pages: '45 Pages',
    rating: '4.8/5',
    category: 'Intraday',
    language: 'English & Telugu',
    description: 'Pocket-sized printable flashcards for morning prep: 5-min ORB rules, VWAP pullback filters, intraday risk limits, and trailing SL rules.',
    topics: ['9:00 AM Pre-Market Scan', 'VWAP Dynamic Zones', '1-Min Index Scalping Rules', 'Daily Loss Kill-Switch'],
    downloadUrl: '#'
  },
  {
    id: 'nism-xv-research-handbook',
    title: 'NISM Series XV Research Analyst Study Notes',
    subtitle: 'Financial Statement Modeling & Company Valuation',
    pages: '142 Pages',
    rating: '4.9/5',
    category: 'NISM Prep',
    language: 'English',
    description: 'In-depth guide to equity research methodology, qualitative management audits, DCF valuation models, and drafting institutional research reports.',
    topics: ['EIC Top-Down Framework', 'Cash Flow & Ratio Analysis', 'Valuation Multiples (P/E, EV/EBITDA)', 'Drafting Research Notes'],
    downloadUrl: '#'
  }
];

const Ebooks = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = EBOOKS.filter(b => {
    const matchesCat = selectedCat === 'All' || b.category === selectedCat;
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06080e] text-gray-300 font-inter pt-24 pb-20">
      <SEO
        title="Trading E-Books & Study Materials | MarketMax Trading Academy"
        description="Download free and pro trading e-books, candlestick cheat sheets, SMC blueprints, and NISM exam preparation study materials."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaBook /> Comprehensive Digital Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
            E-BOOKS & <br />
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
              STUDY MATERIALS
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Deepen your technical mastery with our structured study manuals, cheat sheets, and regulatory exam handbooks written by certified institutional trainers.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto hide-scrollbar">
            {['All', 'Price Action', 'Derivatives', 'Psychology', 'NISM Prep', 'Intraday'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? 'bg-[#D4AF37] text-[#0B0F19] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#121622] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Search books, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#121622] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glossy-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold">
                    <FaStar size={11} /> {book.rating}
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 text-lg shrink-0">
                    <FaFilePdf />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-outfit leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                      {book.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {book.description}
                </p>

                <div className="space-y-1.5 mb-5 border-t border-gray-800/80 pt-3">
                  {book.topics.map((top, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <FaCheckCircle className="text-emerald-400 shrink-0 text-[9px]" />
                      <span>{top}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
                <span className="text-[10px] text-gray-500 font-mono">
                  {book.language}
                </span>
                <a
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0F19] font-black text-xs transition-all flex items-center gap-1.5 shadow-md"
                >
                  <FaDownload size={10} /> Access PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ebooks;

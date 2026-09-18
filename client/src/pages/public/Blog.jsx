import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaClock, FaUser, FaTag, FaArrowRight, FaSearch, FaFire, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const ARTICLES = [
  {
    id: 'smc-order-blocks-guide',
    title: 'How Smart Money Concepts (SMC) Reveal Institutional Footprints on NSE',
    excerpt: 'Retail traders look at support and resistance lines; banks look at liquidity pools. Discover how Order Blocks and Fair Value Gaps create high-probability intraday turning points in NIFTY.',
    category: 'Price Action',
    readTime: '6 min read',
    date: 'March 14, 2026',
    author: 'Chief Market Strategist',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    tags: ['SMC', 'NIFTY 50', 'Order Blocks']
  },
  {
    id: 'options-theta-decay-mastery',
    title: 'Why 90% of Option Buyers Lose Money and How to Harvest Theta Decay Like a Pro',
    excerpt: 'Time decay is the silent killer of naked call and put buyers. Learn how constructing defined-risk credit spreads allows you to profit even when the market moves sideways or slightly against you.',
    category: 'Options Trading',
    readTime: '8 min read',
    date: 'March 11, 2026',
    author: 'Derivatives Desk Lead',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    tags: ['Options Greeks', 'Theta Decay', 'Credit Spreads']
  },
  {
    id: 'risk-of-ruin-psychology',
    title: 'The Mathematics of Capital Preservation: Why the 1% Risk Rule Saves Careers',
    excerpt: 'A trader who loses 50% of their account needs a 100% gain just to break even. Explore the statistical Risk of Ruin matrix and how to systematically eliminate revenge trading.',
    category: 'Risk Management',
    readTime: '5 min read',
    date: 'March 08, 2026',
    author: 'Psychology Coach',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=80',
    tags: ['Capital Preservation', 'Drawdown', 'Discipline']
  },
  {
    id: 'nism-viii-preparation-tips',
    title: 'How to Clear NISM Series VIII (Equity Derivatives) Certification on Your First Try',
    excerpt: 'Detailed exam breakdown, key scoring topics (accounting, clearing, regulations), time allocation strategies, and the most common trap questions tested by the National Institute of Securities Markets.',
    category: 'NISM Guide',
    readTime: '7 min read',
    date: 'March 04, 2026',
    author: 'NISM Certified Trainer',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    tags: ['NISM VIII', 'SEBI Compliance', 'Exam Prep']
  },
  {
    id: 'intraday-premarket-routine',
    title: 'The 15-Minute Pre-Market Routine Every Indian Day Trader Must Follow',
    excerpt: 'Between 9:00 AM and 9:15 AM IST, markets telegraph institutional bias. Follow this exact 5-step checklist covering GIFT Nifty, US bond yields, crude oil, and sector heatmaps before market open.',
    category: 'Intraday Trading',
    readTime: '4 min read',
    date: 'February 26, 2026',
    author: 'Floor Trader',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    tags: ['Pre-Market', 'Watchlist', 'Routine']
  },
  {
    id: 'technical-indicators-myth',
    title: 'Indicator Overload: Why 10 Indicators on Your Chart Are Destroying Your Execution',
    excerpt: 'When RSI, MACD, Bollinger Bands, and Stochastic give conflicting signals, paralysis analysis sets in. Learn how naked candlestick charts combined with volume profile provide clearer market context.',
    category: 'Technical Analysis',
    readTime: '6 min read',
    date: 'February 20, 2026',
    author: 'CMT Specialist',
    image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80',
    tags: ['Chart Cleanliness', 'Price Action', 'Execution']
  }
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchQuery = a.title.toLowerCase().includes(query.toLowerCase()) ||
                       a.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#06080e] text-gray-300 font-inter pt-24 pb-20">
      <SEO
        title="Free Trading Blog & Market Learning | MarketMax Trading Academy"
        description="Free educational articles, trading setup breakdowns, options Greeks tutorials, and NISM preparation guides by MarketMax Trading Academy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaBookOpen /> Free Learning & Market Knowledge
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
            TRADING ACADEMY <br />
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
              INSIGHTS & BLOG
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Practical, no-fluff educational articles written by full-time traders. Learn price action mechanics, options mathematics, and institutional risk management for free.
          </p>
        </div>

        {/* Category Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto hide-scrollbar">
            {['All', 'Price Action', 'Options Trading', 'Risk Management', 'NISM Guide', 'Intraday Trading'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
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
              placeholder="Search articles, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#121622] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glossy-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B0F19]/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-[#D4AF37] uppercase tracking-wider border border-[#D4AF37]/30">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2 font-mono">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FaClock size={10} /> {article.readTime}</span>
                  </div>

                  <h3 className="text-lg font-black text-white font-outfit mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800/80">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-800/60 text-gray-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
                >
                  Explore Related Course <FaArrowRight size={10} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

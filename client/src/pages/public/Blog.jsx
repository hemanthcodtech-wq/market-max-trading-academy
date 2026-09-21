import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaSearch, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';


import axios from 'axios';
import SEO from '../../components/common/SEO';

const Blog = () => {
  const [ARTICLES, setARTICLES] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCat, setSelectedCat] = useState('All');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/blogs`);
        setARTICLES(res.data.data);
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchQuery = (a.title || '').toLowerCase().includes(query.toLowerCase()) ||
               (a.excerpt || '').toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#06080e] pb-20 pt-20 font-inter text-gray-300 sm:pt-24">
      <SEO
        title="Free Trading Blog & Market Learning | MarketMax Trading Academy"
        description="Free educational articles, trading setup breakdowns, options Greeks tutorials, and NISM preparation guides by MarketMax Trading Academy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaBookOpen /> Free Learning & Market Knowledge
          </div>
          <h1 className="font-outfit text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
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
        <div className="mb-8 flex flex-col items-stretch justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
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
          {loading ? <div className="col-span-full text-center py-10">Loading...</div> : filtered.map(article => (
            <motion.article
              key={article._id || article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glossy-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-800">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#172033] to-[#0B0F19] text-5xl font-black text-[#D4AF37]/30">MM</div>
                  )}
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

                  {article.content && (
                    <p className="mb-4 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-gray-500">{article.content}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800/80">
                    {(article.tags || []).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-800/60 text-gray-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link to={`/blog/${article.slug || article._id}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] transition-colors hover:text-[#F3D675]">
                    Read full article <FaArrowRight size={10} />
                  </Link>
                </div>
              </div>

            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

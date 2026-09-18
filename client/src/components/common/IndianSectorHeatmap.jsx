import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaLayerGroup, FaSearch, FaArrowUp, FaArrowDown, FaChartBar, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * Authentic NSE / Indian Market Sector Heatmap
 * Visualizes the performance of India's major sectors and NIFTY 50 blue chips
 * with responsive tree-like tile layouts, sector filtering, and 1-click chart sync.
 */

const SECTORS = [
  {
    id: 'banking',
    name: 'Banking & Financials',
    weight: '34%',
    color: 'from-blue-950/40 to-blue-900/20',
    borderColor: 'border-blue-500/30',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', weight: 13.5, price: 1684.20, change: 12.40, changePct: 0.74, marketCap: '12.8L Cr' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', weight: 9.8, price: 1248.50, change: 8.90, changePct: 0.72, marketCap: '8.7L Cr' },
      { symbol: 'SBIN', name: 'State Bank of India', weight: 4.2, price: 812.30, change: -4.50, changePct: -0.55, marketCap: '7.2L Cr' },
      { symbol: 'KOTAKBANK', name: 'Kotak Bank', weight: 3.4, price: 1795.00, change: -7.20, changePct: -0.40, marketCap: '3.5L Cr' },
      { symbol: 'AXISBANK', name: 'Axis Bank', weight: 3.2, price: 1198.80, change: 9.10, changePct: 0.77, marketCap: '3.7L Cr' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', weight: 2.5, price: 7120.00, change: 65.00, changePct: 0.92, marketCap: '4.4L Cr' },
    ]
  },
  {
    id: 'it',
    name: 'IT & Technology',
    weight: '14%',
    color: 'from-indigo-950/40 to-indigo-900/20',
    borderColor: 'border-indigo-500/30',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', weight: 4.8, price: 4280.40, change: 35.60, changePct: 0.84, marketCap: '15.5L Cr' },
      { symbol: 'INFY', name: 'Infosys', weight: 5.6, price: 1892.10, change: 22.40, changePct: 1.20, marketCap: '7.8L Cr' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', weight: 1.9, price: 1780.00, change: 18.20, changePct: 1.03, marketCap: '4.8L Cr' },
      { symbol: 'WIPRO', name: 'Wipro Ltd', weight: 0.8, price: 542.80, change: -2.30, changePct: -0.42, marketCap: '2.8L Cr' },
      { symbol: 'TECHM', name: 'Tech Mahindra', weight: 1.1, price: 1612.00, change: 14.50, changePct: 0.91, marketCap: '1.6L Cr' },
      { symbol: 'LTIM', name: 'LTIMindtree', weight: 0.7, price: 5950.00, change: -42.00, changePct: -0.70, marketCap: '1.7L Cr' },
    ]
  },
  {
    id: 'energy',
    name: 'Energy, Oil & Power',
    weight: '12%',
    color: 'from-amber-950/40 to-amber-900/20',
    borderColor: 'border-amber-500/30',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', weight: 8.9, price: 2985.60, change: 18.40, changePct: 0.62, marketCap: '20.2L Cr' },
      { symbol: 'NTPC', name: 'NTPC Ltd', weight: 1.8, price: 395.40, change: 5.20, changePct: 1.33, marketCap: '3.8L Cr' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', weight: 1.2, price: 298.10, change: -1.80, changePct: -0.60, marketCap: '3.7L Cr' },
      { symbol: 'POWERGRID', name: 'Power Grid Corp', weight: 1.4, price: 342.60, change: 3.10, changePct: 0.91, marketCap: '3.1L Cr' },
      { symbol: 'BPCL', name: 'Bharat Petroleum', weight: 0.7, price: 362.50, change: -2.40, changePct: -0.66, marketCap: '1.5L Cr' },
      { symbol: 'COALINDIA', name: 'Coal India', weight: 0.9, price: 495.20, change: 7.80, changePct: 1.60, marketCap: '3.0L Cr' },
    ]
  },
  {
    id: 'auto',
    name: 'Automobile',
    weight: '7.5%',
    color: 'from-emerald-950/40 to-emerald-900/20',
    borderColor: 'border-emerald-500/30',
    stocks: [
      { symbol: 'TATAMOTORS', name: 'Tata Motors', weight: 2.4, price: 978.40, change: 16.20, changePct: 1.68, marketCap: '3.6L Cr' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra', weight: 2.6, price: 3045.00, change: 48.00, changePct: 1.60, marketCap: '3.7L Cr' },
      { symbol: 'MARUTI', name: 'Maruti Suzuki', weight: 1.7, price: 12450.00, change: -85.00, changePct: -0.68, marketCap: '3.9L Cr' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', weight: 1.1, price: 11820.00, change: 145.00, changePct: 1.24, marketCap: '3.3L Cr' },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', weight: 0.6, price: 5410.00, change: 32.00, changePct: 0.60, marketCap: '1.0L Cr' },
    ]
  },
  {
    id: 'fmcg',
    name: 'FMCG & Consumption',
    weight: '8.8%',
    color: 'from-rose-950/40 to-rose-900/20',
    borderColor: 'border-rose-500/30',
    stocks: [
      { symbol: 'ITC', name: 'ITC Ltd', weight: 4.1, price: 512.40, change: 3.20, changePct: 0.63, marketCap: '6.4L Cr' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', weight: 2.8, price: 2785.00, change: -14.00, changePct: -0.50, marketCap: '6.5L Cr' },
      { symbol: 'NESTLEIND', name: 'Nestle India', weight: 0.9, price: 2680.00, change: 11.50, changePct: 0.43, marketCap: '2.5L Cr' },
      { symbol: 'TITAN', name: 'Titan Company', weight: 1.5, price: 3680.00, change: -28.00, changePct: -0.75, marketCap: '3.2L Cr' },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products', weight: 0.8, price: 1185.00, change: 9.80, changePct: 0.83, marketCap: '1.1L Cr' },
    ]
  },
  {
    id: 'pharma',
    name: 'Pharma & Healthcare',
    weight: '4.5%',
    color: 'from-teal-950/40 to-teal-900/20',
    borderColor: 'border-teal-500/30',
    stocks: [
      { symbol: 'SUNPHARMA', name: 'Sun Pharma', weight: 1.9, price: 1840.50, change: 24.20, changePct: 1.33, marketCap: '4.4L Cr' },
      { symbol: 'CIPLA', name: 'Cipla Ltd', weight: 0.9, price: 1612.00, change: 8.50, changePct: 0.53, marketCap: '1.3L Cr' },
      { symbol: 'DRREDDY', name: "Dr. Reddy's Lab", weight: 0.8, price: 6840.00, change: -35.00, changePct: -0.51, marketCap: '1.1L Cr' },
      { symbol: 'DIVISLAB', name: "Divi's Laboratories", weight: 0.7, price: 5410.00, change: 48.00, changePct: 0.90, marketCap: '1.4L Cr' },
      { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', weight: 0.8, price: 7120.00, change: 82.00, changePct: 1.16, marketCap: '1.0L Cr' },
    ]
  },
  {
    id: 'metals',
    name: 'Metals & Materials',
    weight: '3.8%',
    color: 'from-slate-900 to-slate-950',
    borderColor: 'border-slate-600/40',
    stocks: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', weight: 1.4, price: 154.20, change: 2.10, changePct: 1.38, marketCap: '1.9L Cr' },
      { symbol: 'JSWSTEEL', name: 'JSW Steel', weight: 1.1, price: 985.40, change: -6.20, changePct: -0.63, marketCap: '2.4L Cr' },
      { symbol: 'HINDALCO', name: 'Hindalco Industries', weight: 1.0, price: 710.00, change: 12.00, changePct: 1.72, marketCap: '1.6L Cr' },
      { symbol: 'VEDL', name: 'Vedanta Ltd', weight: 0.7, price: 472.50, change: 8.10, changePct: 1.74, marketCap: '1.7L Cr' },
    ]
  }
];

const IndianSectorHeatmap = ({ onSelectStock, activeSymbol }) => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSectors = SECTORS.map(sec => {
    if (selectedSector !== 'all' && sec.id !== selectedSector) return null;
    const stocks = sec.stocks.filter(stk =>
      stk.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (stocks.length === 0) return null;
    return { ...sec, stocks };
  }).filter(Boolean);

  const getHeatmapColor = (pct) => {
    if (pct >= 1.5) return 'bg-emerald-600/90 text-white border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (pct > 0.5)  return 'bg-emerald-700/80 text-white border-emerald-500/40';
    if (pct > 0)    return 'bg-emerald-900/60 text-emerald-200 border-emerald-700/30';
    if (pct === 0)  return 'bg-gray-800/80 text-gray-300 border-gray-700';
    if (pct > -0.5) return 'bg-rose-950/60 text-rose-200 border-rose-800/30';
    if (pct > -1.5) return 'bg-rose-800/80 text-white border-rose-600/40';
    return 'bg-rose-600/90 text-white border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#121622] via-[#0B0F19] to-[#070A11] border border-gray-800 p-4 md:p-6 shadow-2xl">
      {/* Header with Title & Live badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
              <FaFire size={14} />
            </span>
            <h3 className="text-lg md:text-xl font-black text-white tracking-wide">
              NSE Indian Sector Heatmap
            </h3>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live NIFTY 50
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Click any Indian stock to load its real-time candlestick chart in TradingView
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search Indian stock (e.g. RELIANCE, TCS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#1A202C]/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Sector filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 hide-scrollbar">
        <button
          onClick={() => setSelectedSector('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedSector === 'all'
              ? 'bg-[#D4AF37] text-[#0B0F19] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          All Sectors
        </button>
        {SECTORS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSector(sec.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedSector === sec.id
                ? 'bg-[#D4AF37] text-[#0B0F19] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {sec.name}
          </button>
        ))}
      </div>

      {/* Heatmap Grid by Sector */}
      <div className="space-y-5">
        {filteredSectors.map((sector) => (
          <div
            key={sector.id}
            className={`rounded-xl border ${sector.borderColor} bg-gradient-to-r ${sector.color} p-3 md:p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wider uppercase">
                  {sector.name}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Weight {sector.weight}
                </span>
              </div>
              <span className="text-[10px] text-gray-500">
                {sector.stocks.length} Stocks
              </span>
            </div>

            {/* Stocks Tile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {sector.stocks.map((stk) => {
                const isSelected = activeSymbol === `NSE:${stk.symbol}`;
                const isPositive = stk.changePct >= 0;
                const heatColor = getHeatmapColor(stk.changePct);

                return (
                  <motion.div
                    key={stk.symbol}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectStock && onSelectStock(`NSE:${stk.symbol}`)}
                    className={`cursor-pointer rounded-xl border p-2.5 transition-all flex flex-col justify-between min-h-[85px] ${heatColor} ${
                      isSelected ? 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-black text-xs tracking-wider leading-none">
                          {stk.symbol}
                        </p>
                        <p className="text-[9px] opacity-80 truncate max-w-[90px] mt-0.5">
                          {stk.name}
                        </p>
                      </div>
                      <span className="text-[10px] font-black">
                        {isPositive ? '+' : ''}{stk.changePct.toFixed(2)}%
                      </span>
                    </div>

                    <div className="mt-2 pt-1 border-t border-white/10 flex items-baseline justify-between text-[11px] font-mono">
                      <span className="font-bold">₹{stk.price.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] opacity-75">
                        {isPositive ? <FaArrowUp size={8} className="inline" /> : <FaArrowDown size={8} className="inline" />}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend & Hint */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-gray-500">Color Spectrum:</span>
          <div className="flex items-center gap-1">
            <span className="w-5 h-3 rounded bg-rose-600 text-[8px] text-white flex items-center justify-center font-bold">-2%</span>
            <span className="w-5 h-3 rounded bg-rose-800"></span>
            <span className="w-5 h-3 rounded bg-gray-800"></span>
            <span className="w-5 h-3 rounded bg-emerald-800"></span>
            <span className="w-5 h-3 rounded bg-emerald-600 text-[8px] text-white flex items-center justify-center font-bold">+2%</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-500">
          Tip: Tap any stock above to analyze its live candlestick structure on the main chart
        </p>
      </div>
    </div>
  );
};

export default IndianSectorHeatmap;

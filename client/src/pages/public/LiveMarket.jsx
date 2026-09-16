import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartLine, FaChartBar, FaCoins, FaBolt, FaFire, FaGlobe,
  FaChartPie, FaNewspaper, FaCalendarAlt, FaClock, FaShieldAlt
} from 'react-icons/fa';
import SEO from '../../components/common/SEO';
import TradingViewWidget from '../../components/common/TradingViewWidget';
import LiveMarketCards from '../../components/common/LiveMarketCards';
import LiveRealtimeChart from '../../components/common/LiveRealtimeChart';


// ──────────────────────────────────────────────────────────────────
// Tab button
// ──────────────────────────────────────────────────────────────────
const TabButton = ({ id, label, icon: Icon, active, onClick, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
      active
        ? 'bg-[#D4AF37] text-[#0B0F19] shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
        : 'bg-[#1E293B] text-gray-400 hover:bg-[#263248] hover:text-white border border-gray-700'
    }`}
  >
    <Icon size={14} />
    {label}
    {badge && (
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-black animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

// ──────────────────────────────────────────────────────────────────
// Interval Button
// ──────────────────────────────────────────────────────────────────
const IntervalBtn = ({ label, value, active, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
      active
        ? 'bg-[#D4AF37] text-[#0B0F19]'
        : 'bg-[#1E293B] text-gray-400 hover:bg-[#263248] border border-gray-700'
    }`}
  >
    {label}
  </button>
);

// ──────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────
const LiveMarket = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartSymbol, setChartSymbol] = useState('NSE:NIFTY');
  const [chartInterval, setChartInterval] = useState('15');
  const [foSymbol, setFoSymbol] = useState('NSE:NIFTY');
  const [foInterval, setFoInterval] = useState('15');
  const [cryptoSymbol, setCryptoSymbol] = useState('BINANCE:BTCUSDT');
  const [cryptoInterval, setCryptoInterval] = useState('15');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const isMarketOpen = () => {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const totalMin = h * 60 + m;
    return totalMin >= 555 && totalMin <= 930; // 9:15 – 15:30 IST
  };

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: FaGlobe },
    { id: 'intraday', label: 'Intraday', icon: FaBolt, badge: 'LIVE' },
    { id: 'fo', label: 'F & O', icon: FaChartPie },
    { id: 'crypto', label: 'Crypto', icon: FaCoins },
  ];

  const intradaySymbols = [
    { label: 'NIFTY 50', value: 'NSE:NIFTY' },
    { label: 'BANK NIFTY', value: 'NSE:BANKNIFTY' },
    { label: 'SENSEX', value: 'BSE:SENSEX' },
    { label: 'FIN NIFTY', value: 'NSE:FINNIFTY' },
    { label: 'RELIANCE', value: 'NSE:RELIANCE' },
    { label: 'TCS', value: 'NSE:TCS' },
    { label: 'HDFC BANK', value: 'NSE:HDFCBANK' },
    { label: 'ICICI BANK', value: 'NSE:ICICIBANK' },
  ];

  const foSymbols = [
    { label: 'NIFTY 50', value: 'NSE:NIFTY' },
    { label: 'BANK NIFTY', value: 'NSE:BANKNIFTY' },
    { label: 'FIN NIFTY', value: 'NSE:FINNIFTY' },
    { label: 'RELIANCE', value: 'NSE:RELIANCE' },
    { label: 'HDFC BANK', value: 'NSE:HDFCBANK' },
    { label: 'ICICI BANK', value: 'NSE:ICICIBANK' },
    { label: 'TCS', value: 'NSE:TCS' },
    { label: 'INFOSYS', value: 'NSE:INFY' },
    { label: 'SBIN', value: 'NSE:SBIN' },
  ];

  const cryptoSymbols = [
    { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
    { label: 'ETH/USDT', value: 'BINANCE:ETHUSDT' },
    { label: 'BNB/USDT', value: 'BINANCE:BNBUSDT' },
    { label: 'SOL/USDT', value: 'BINANCE:SOLUSDT' },
    { label: 'XRP/USDT', value: 'BINANCE:XRPUSDT' },
    { label: 'ADA/USDT', value: 'BINANCE:ADAUSDT' },
  ];

  const intervals = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '30m', value: '30' },
    { label: '1H', value: '60' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
  ];

  const miniCards = [
    { name: 'NIFTY 50', symbol: 'NSE:NIFTY', tvSymbol: 'NSE:NIFTY' },
    { name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY', tvSymbol: 'NSE:BANKNIFTY' },
    { name: 'SENSEX', symbol: 'BSE:SENSEX', tvSymbol: 'BSE:SENSEX' },
    { name: 'INDIA VIX', symbol: 'NSE:INDIAVIX', tvSymbol: 'NSE:INDIAVIX' },
    { name: 'FIN NIFTY', symbol: 'NSE:FINNIFTY', tvSymbol: 'NSE:FINNIFTY' },
    { name: 'MIDCAP NIFTY', symbol: 'NSE:MIDCPNIFTY', tvSymbol: 'NSE:MIDCPNIFTY' },
  ];

  const cryptoMiniCards = [
    { name: 'Bitcoin', symbol: 'BTC/USDT', tvSymbol: 'BINANCE:BTCUSDT' },
    { name: 'Ethereum', symbol: 'ETH/USDT', tvSymbol: 'BINANCE:ETHUSDT' },
    { name: 'BNB', symbol: 'BNB/USDT', tvSymbol: 'BINANCE:BNBUSDT' },
    { name: 'Solana', symbol: 'SOL/USDT', tvSymbol: 'BINANCE:SOLUSDT' },
    { name: 'XRP', symbol: 'XRP/USDT', tvSymbol: 'BINANCE:XRPUSDT' },
    { name: 'Cardano', symbol: 'ADA/USDT', tvSymbol: 'BINANCE:ADAUSDT' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 font-inter">
      <SEO
        title="Live Market Dashboard | MarketMax Trading Academy"
        description="Real-time live market charts for stocks, F&O, intraday trading and crypto powered by TradingView. Track NIFTY, BANKNIFTY, SENSEX, BTC and more."
        keywords="Live Market, NIFTY, BANKNIFTY, Intraday, F&O, Options, Crypto, Bitcoin, TradingView"
        url="https://marketmaxtrading.com/live-market"
      />

      {/* ── TICKER TAPE ── */}
      <div className="w-full bg-[#0B0F19] border-b border-gray-800">
        <TradingViewWidget type="ticker" theme="dark" />
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-outfit flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMarketOpen() ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className={`relative inline-flex rounded-full h-4 w-4 ${isMarketOpen() ? 'bg-green-500' : 'bg-red-500'}`} />
              </span>
              Live Market Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isMarketOpen() ? '🟢 NSE Market Open' : '🔴 Market Closed'} · {formatTime(currentTime)} IST · Powered by TradingView
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#131722] rounded-xl border border-gray-700">
              <FaClock className="text-[#D4AF37] text-xs" />
              <span className="text-sm font-mono text-white font-bold">{formatTime(currentTime)}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${isMarketOpen() ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isMarketOpen() ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {isMarketOpen() ? 'Market Open' : 'Market Closed'}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              onClick={setActiveTab}
              badge={tab.badge}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TAB: MARKET OVERVIEW
        ═══════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Live Market Cards — fetched from Yahoo Finance via backend proxy */}
              <LiveMarketCards
                filter="indices"
                activeSymbol={chartSymbol}
                onSelectSymbol={(sym) => {
                  setChartSymbol(sym);
                  setActiveTab('intraday');
                }}
              />

              {/* Market Overview + Heatmap Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaGlobe className="text-[#D4AF37]" />
                    Market Overview
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="market-overview" theme="dark" height="500px" width="100%" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaFire className="text-[#D4AF37]" />
                    NSE Sector Heatmap
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="heatmap" theme="dark" height="500px" width="100%" exchange="NSE" />
                  </div>
                </div>
              </div>

              {/* Economic Calendar + News Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-[#D4AF37]" />
                    Economic Calendar
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="economic-calendar" theme="dark" height="500px" width="100%" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaNewspaper className="text-[#D4AF37]" />
                    Market News Feed
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="news" theme="dark" height="500px" width="100%" market="india" />
                  </div>
                </div>
              </div>

              {/* India Stock Screener */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartBar className="text-[#D4AF37]" />
                  NSE / BSE Stock Screener
                </h2>
                <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                  <TradingViewWidget type="screener" theme="dark" height="550px" width="100%" market="india" exchange="NSE" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB: INTRADAY
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'intraday' && (
            <motion.div
              key="intraday"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Symbol + Interval selector */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#131722] rounded-2xl border border-gray-800">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Symbol</p>
                  <div className="flex flex-wrap gap-2">
                    {intradaySymbols.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setChartSymbol(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          chartSymbol === s.value
                            ? 'bg-[#D4AF37] text-[#0B0F19]'
                            : 'bg-[#1E293B] text-gray-400 hover:bg-[#263248] border border-gray-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Interval</p>
                  <div className="flex flex-wrap gap-2">
                    {intervals.map((i) => (
                      <IntervalBtn
                        key={i.value}
                        label={i.label}
                        value={i.value}
                        active={chartInterval === i.value}
                        onClick={setChartInterval}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Status & Info Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#131722] rounded-xl border border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white tracking-wide">{chartSymbol.replace('NSE:', '').replace('BSE:', '')}</span>
                  <span className="text-gray-400">· {chartInterval === 'D' ? 'Daily' : `${chartInterval}m`} Timeframe</span>
                  <span className="bg-[#1E293B] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                    {isMarketOpen() ? 'NSE LIVE' : 'NSE CLOSED'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 hidden sm:inline">Advanced Candlestick Chart</span>
                  <a
                    href={`https://in.tradingview.com/symbols/${chartSymbol.replace(':', '-')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1 font-semibold"
                  >
                    TradingView ↗
                  </a>
                </div>
              </div>

              {/* Main Realtime Chart */}
              <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                <TradingViewWidget
                  type="chart"
                  symbol={chartSymbol}
                  interval={chartInterval}
                  height="580px"
                  theme="dark"
                />
              </div>

              {/* Live Market Cards — indices */}
              <LiveMarketCards
                filter="indices"
                compact
                activeSymbol={chartSymbol}
                onSelectSymbol={setChartSymbol}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB: F & O
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'fo' && (
            <motion.div
              key="fo"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* F&O Info Banner */}
              <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-2xl border border-[#D4AF37]/20 p-5 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <FaShieldAlt className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Expiry</p>
                    <p className="text-white font-bold text-sm">Weekly & Monthly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FaChartPie className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Lot Size</p>
                    <p className="text-white font-bold text-sm">NIFTY: 75 | BNF: 30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FaClock className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Segment</p>
                    <p className="text-white font-bold text-sm">NSE F&O · 9:15 – 15:30</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center">
                  <span className="text-xs text-gray-500 italic">Live futures data via TradingView. Use with a registered broker for actual trading.</span>
                </div>
              </div>

              {/* Symbol + Interval selector */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#131722] rounded-2xl border border-gray-800">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">F&O Symbol</p>
                  <div className="flex flex-wrap gap-2">
                    {foSymbols.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setFoSymbol(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          foSymbol === s.value
                            ? 'bg-[#D4AF37] text-[#0B0F19]'
                            : 'bg-[#1E293B] text-gray-400 hover:bg-[#263248] border border-gray-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Interval</p>
                  <div className="flex flex-wrap gap-2">
                    {intervals.map((i) => (
                      <IntervalBtn
                        key={i.value}
                        label={i.label}
                        value={i.value}
                        active={foInterval === i.value}
                        onClick={setFoInterval}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Status & Info Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#131722] rounded-xl border border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white tracking-wide">{foSymbol.replace('NSE:', '').replace('BSE:', '')}</span>
                  <span className="text-gray-400">· {foInterval === 'D' ? 'Daily' : `${foInterval}m`} Timeframe</span>
                  <span className="bg-[#1E293B] text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                    F&O DERIVATIVES
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 hidden sm:inline">Futures & Options Analytics</span>
                  <a
                    href={`https://in.tradingview.com/symbols/${foSymbol.replace(':', '-')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1 font-semibold"
                  >
                    TradingView ↗
                  </a>
                </div>
              </div>

              {/* F&O Futures Realtime Chart */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartPie className="text-[#D4AF37]" />
                  Futures & Options Chart
                </h2>
                <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mb-6">
                  <TradingViewWidget
                    type="chart"
                    symbol={foSymbol}
                    interval={foInterval}
                    height="580px"
                    theme="dark"
                  />
                </div>
                <LiveMarketCards
                  filter="indices"
                  compact
                  activeSymbol={foSymbol}
                  onSelectSymbol={setFoSymbol}
                />
              </div>

              {/* Options Stock Screener */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaChartBar className="text-[#D4AF37]" />
                    F&O Stocks Screener
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="screener" theme="dark" height="500px" width="100%" market="india" exchange="NSE" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaNewspaper className="text-[#D4AF37]" />
                    F&O Market News
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="news" theme="dark" height="500px" width="100%" market="india" />
                  </div>
                </div>
              </div>

              {/* Live F&O instrument prices */}
              <LiveMarketCards filter="indices" />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB: CRYPTO
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'crypto' && (
            <motion.div
              key="crypto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Crypto Info Banner */}
              <div className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] rounded-2xl border border-yellow-500/20 p-5 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <FaCoins className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Market</p>
                    <p className="text-white font-bold text-sm">24/7 Crypto</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <FaGlobe className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Exchange</p>
                    <p className="text-white font-bold text-sm">Binance · Coinbase</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-gray-500 italic">Crypto prices are volatile. Trade responsibly.</span>
                </div>
              </div>

              {/* Live Crypto Cards — from backend proxy */}
              <LiveMarketCards filter="crypto" />

              {/* Crypto Symbol + Interval selector */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#131722] rounded-2xl border border-gray-800">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Crypto Pair</p>
                  <div className="flex flex-wrap gap-2">
                    {cryptoSymbols.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setCryptoSymbol(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          cryptoSymbol === s.value
                            ? 'bg-[#D4AF37] text-[#0B0F19]'
                            : 'bg-[#1E293B] text-gray-400 hover:bg-[#263248] border border-gray-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Interval</p>
                  <div className="flex flex-wrap gap-2">
                    {intervals.map((i) => (
                      <IntervalBtn
                        key={i.value}
                        label={i.label}
                        value={i.value}
                        active={cryptoInterval === i.value}
                        onClick={setCryptoInterval}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Status & Info Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#131722] rounded-xl border border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white tracking-wide">{cryptoSymbol.replace('BINANCE:', '')}</span>
                  <span className="text-gray-400">· {cryptoInterval === 'D' ? 'Daily' : `${cryptoInterval}m`} Timeframe</span>
                  <span className="bg-[#1E293B] text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                    24/7 GLOBAL CRYPTO
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 hidden sm:inline">Binance Real-Time Spot Feed</span>
                  <a
                    href={`https://in.tradingview.com/symbols/${cryptoSymbol.replace(':', '-')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1 font-semibold"
                  >
                    TradingView ↗
                  </a>
                </div>
              </div>

              {/* Crypto Main Realtime Chart */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-[#D4AF37]" />
                  Crypto Chart
                </h2>
                <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mb-6">
                  <TradingViewWidget
                    type="chart"
                    symbol={cryptoSymbol}
                    interval={cryptoInterval}
                    height="580px"
                    theme="dark"
                  />
                </div>
                <LiveMarketCards
                  filter="crypto"
                  compact
                  activeSymbol={cryptoSymbol}
                  onSelectSymbol={setCryptoSymbol}
                />
              </div>

              {/* Crypto Screener + News */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaChartBar className="text-[#D4AF37]" />
                    Crypto Screener
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="crypto-screener" theme="dark" height="500px" width="100%" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaNewspaper className="text-[#D4AF37]" />
                    Crypto News
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <TradingViewWidget type="news" theme="dark" height="500px" width="100%" market="crypto" locale="en" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="mt-12 py-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ⚠️ <strong className="text-gray-500">Disclaimer:</strong> All market data, charts and information on this page are powered by TradingView and are for <strong className="text-gray-500">educational purposes only</strong>. MarketMax Trading Academy does not provide investment advice. Past performance is not indicative of future results. Trading involves significant risk of loss.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveMarket;

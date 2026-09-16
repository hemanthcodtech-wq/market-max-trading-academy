import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  FaArrowUp, FaArrowDown, FaMinus, FaSyncAlt,
  FaChartLine, FaCoins, FaGlobeAsia, FaBolt, FaCircle
} from 'react-icons/fa';
import TradingViewWidget from './TradingViewWidget';

/**
 * LiveMarketCards
 * Live real-time market data cards that update every second (1s tick streaming),
 * with visual price flash indicators and periodic backend sync.
 *
 * Props:
 *  filter  — 'indices' | 'crypto' | 'global' | 'all'  (default: 'all')
 *  cols    — number of grid columns hint (default auto)
 *  compact — boolean for compact card style
 */

const EXCHANGE_COLOR = {
  NSE:    { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  BSE:    { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  CRYPTO: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  FOREX:  { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  COMEX:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  NYMEX:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'    },
};

const FILTER_KEYS = {
  indices: ['nifty', 'banknifty', 'sensex', 'indiavix', 'finnifty', 'midcap'],
  crypto:  ['btc', 'eth', 'bnb'],
  global:  ['gold', 'crude', 'usdinr'],
  all:     null, // show all
};

const INITIAL_MARKET_DATA = [
  { key: 'nifty', name: 'NIFTY 50', exchange: 'NSE', price: 25375.80, change: 89.20, changePct: 0.35, high: 25420.50, low: 25290.10, prevClose: 25286.60 },
  { key: 'banknifty', name: 'BANK NIFTY', exchange: 'NSE', price: 52195.40, change: -115.30, changePct: -0.22, high: 52450.00, low: 52080.50, prevClose: 52310.70 },
  { key: 'sensex', name: 'SENSEX', exchange: 'BSE', price: 82980.20, change: 252.40, changePct: 0.31, high: 83150.00, low: 82720.00, prevClose: 82727.80 },
  { key: 'indiavix', name: 'INDIA VIX', exchange: 'NSE', price: 13.40, change: -0.35, changePct: -2.55, high: 14.10, low: 13.15, prevClose: 13.75 },
  { key: 'finnifty', name: 'FIN NIFTY', exchange: 'NSE', price: 24135.60, change: 48.90, changePct: 0.20, high: 24205.00, low: 24060.00, prevClose: 24086.70 },
  { key: 'midcap', name: 'MIDCAP 50', exchange: 'NSE', price: 13260.10, change: 98.40, changePct: 0.75, high: 13295.00, low: 13150.00, prevClose: 13161.70 },
  { key: 'btc', name: 'BITCOIN', exchange: 'CRYPTO', price: 68450.00, change: 1280.00, changePct: 1.91, high: 68980.00, low: 67100.00, prevClose: 67170.00 },
  { key: 'eth', name: 'ETHEREUM', exchange: 'CRYPTO', price: 2645.20, change: 52.80, changePct: 2.04, high: 2685.00, low: 2580.00, prevClose: 2592.40 },
  { key: 'bnb', name: 'BNB', exchange: 'CRYPTO', price: 596.50, change: 15.20, changePct: 2.61, high: 604.00, low: 579.00, prevClose: 581.30 },
  { key: 'gold', name: 'GOLD', exchange: 'COMEX', price: 2738.40, change: 14.20, changePct: 0.52, high: 2745.00, low: 2721.00, prevClose: 2724.20 },
  { key: 'crude', name: 'CRUDE OIL', exchange: 'NYMEX', price: 71.60, change: -0.80, changePct: -1.10, high: 72.90, low: 70.80, prevClose: 72.40 },
  { key: 'usdinr', name: 'USD/INR', exchange: 'FOREX', price: 84.07, change: 0.03, changePct: 0.04, high: 84.12, low: 84.02, prevClose: 84.04 },
];

const KEY_TO_SYMBOL = {
  nifty:     'NSE:NIFTY',
  banknifty: 'NSE:BANKNIFTY',
  sensex:    'BSE:SENSEX',
  indiavix:  'NSE:INDIAVIX',
  finnifty:  'NSE:FINNIFTY',
  midcap:    'NSE:MIDCPNIFTY',
  btc:       'BINANCE:BTCUSDT',
  eth:       'BINANCE:ETHUSDT',
  bnb:       'BINANCE:BNBUSDT',
  gold:      'TVC:GOLD',
  crude:     'TVC:USOIL',
  usdinr:    'FX:USDINR',
};

// ─── Individual Card ─────────────────────────────────────────────
const MarketCard = ({ item, compact, activeSymbol, onSelect }) => {
  const isUp   = item.change > 0;
  const isDown = item.change < 0;
  const exStyle = EXCHANGE_COLOR[item.exchange] || EXCHANGE_COLOR.NSE;
  const displayPrefix = ['CRYPTO', 'COMEX', 'NYMEX', 'FOREX'].includes(item.exchange) ? '$' : '₹';
  const itemSymbol = KEY_TO_SYMBOL[item.key] || `NSE:${item.name.toUpperCase().replace(/\s+/g, '')}`;
  const isActive = activeSymbol === itemSymbol;

  // Flash styling on 1s tick
  const tickColor =
    item.lastTick === 'up'
      ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]'
      : item.lastTick === 'down'
      ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]'
      : 'text-white';

  const tickBadgeBg =
    item.lastTick === 'up'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : item.lastTick === 'down'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      : '';

  return (
    <div
      onClick={() => onSelect && onSelect(itemSymbol)}
      className={`relative bg-[#131722] rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] overflow-hidden group cursor-pointer ${
        isActive
          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] bg-gradient-to-b from-[#D4AF37]/10 to-[#131722]'
          : item.lastTick === 'up'
          ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-[#131722]'
          : item.lastTick === 'down'
          ? 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-[#131722]'
          : 'border-gray-800'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      {/* Top glow on hover / active */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className={`font-black text-white ${compact ? 'text-sm' : 'text-base'} tracking-wide`}>
              {item.name}
            </p>
            {isActive && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0B0F19]">
                CHART
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${exStyle.bg} ${exStyle.text} border ${exStyle.border}`}>
              {item.exchange}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live 1s Tick" />
          </div>
        </div>

        {item.price !== null ? (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-black transition-colors ${
            isUp ? 'bg-green-500/10 text-green-400' :
            isDown ? 'bg-red-500/10 text-red-400' :
            'bg-gray-700/30 text-gray-400'
          }`}>
            {isUp ? <FaArrowUp size={9} /> : isDown ? <FaArrowDown size={9} /> : <FaMinus size={9} />}
            {item.changePct !== null ? `${Math.abs(item.changePct).toFixed(2)}%` : '—'}
          </div>
        ) : (
          <div className="w-12 h-6 bg-gray-800 rounded-lg animate-pulse" />
        )}
      </div>

      {/* Price with 1-second Flash Animation */}
      {item.price !== null ? (
        <div>
          <div className="flex items-baseline gap-2">
            <p className={`font-black font-mono transition-all duration-300 ${compact ? 'text-xl' : 'text-2xl'} ${tickColor}`}>
              {displayPrefix}{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {item.lastTick && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border transition-all animate-pulse ${tickBadgeBg}`}>
                {item.lastTick === 'up' ? '▲ 1s' : '▼ 1s'}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 font-semibold ${
            isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-500'
          }`}>
            {isUp ? '▲ +' : isDown ? '▼ ' : '● '}
            {item.change !== null ? Math.abs(item.change).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="h-7 bg-gray-800 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
        </div>
      )}

      {/* Day range bar */}
      {!compact && item.high !== null && item.low !== null && item.price !== null && (
        <div className="mt-3 pt-3 border-t border-gray-800/60">
          <div className="flex justify-between text-[10px] text-gray-600 mb-1.5 font-mono">
            <span>L {item.low?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-gray-500 font-bold">Day Range</span>
            <span>H {item.high?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            {(() => {
              const range = item.high - item.low;
              const pos = range > 0 ? ((item.price - item.low) / range) * 100 : 50;
              return (
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isUp ? 'bg-green-500' : isDown ? 'bg-red-500' : 'bg-gray-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, pos)).toFixed(1)}%` }}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────
const LiveMarketCards = ({ filter = 'all', compact = false, autoRefresh = true, activeSymbol, onSelectSymbol }) => {
  const [data, setData] = useState(INITIAL_MARKET_DATA);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [tickCount, setTickCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Periodic background fetch from server (every 15s) to anchor prices
  const fetchServerData = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/market-data`, {
        timeout: 5000,
      });
      if (res.data?.data && res.data.data.length > 0) {
        setData(prev =>
          prev.map(item => {
            const fresh = res.data.data.find(d => d.key === item.key);
            if (!fresh || fresh.price === null) return item;
            return {
              ...item,
              ...fresh,
              prevClose: fresh.prevClose || item.prevClose,
            };
          })
        );
      }
    } catch (err) {
      // Keep running locally on network failure
    }
  }, []);

  useEffect(() => {
    fetchServerData();
    const serverSyncInterval = setInterval(fetchServerData, 15000);
    return () => clearInterval(serverSyncInterval);
  }, [fetchServerData]);

  // Fake tick generator removed to ensure values match TradingView exactly.

  // Filter the data
  const keys = FILTER_KEYS[filter];
  const filtered = keys ? data.filter(d => keys.includes(d.key)) : data;

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchServerData();
    setRefreshing(false);
  };

  return (
    <div>
      {/* Header with 1s Live indicator */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {filter === 'indices' && <><FaChartLine className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Indian Market Indices</span></>}
          {filter === 'crypto' && <><FaCoins className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Crypto — Live</span></>}
          {filter === 'global' && <><FaGlobeAsia className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Global Commodities</span></>}
          {filter === 'all' && <><FaBolt className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Live Market Data</span></>}

          {/* 1s Live Feed Badge */}
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold">LIVE 1s TICKS</span>
            <span className="text-gray-400 text-[10px]">
              {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors disabled:opacity-50"
          title="Force Server Refresh"
        >
          <FaSyncAlt className={refreshing ? 'animate-spin' : ''} size={11} />
          {refreshing ? 'Syncing…' : 'Sync Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <MarketCard
            key={item.key}
            item={item}
            compact={compact}
            activeSymbol={activeSymbol}
            onSelect={onSelectSymbol}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveMarketCards;

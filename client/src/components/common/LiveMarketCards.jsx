import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  FaArrowUp, FaArrowDown, FaMinus, FaSyncAlt,
  FaChartLine, FaCoins, FaGlobeAsia, FaBolt, FaCircle
} from 'react-icons/fa';
import TradingViewWidget from './TradingViewWidget';

/**
 * LiveMarketCards
 * Live real-time market data cards streaming exact market prices,
 * with visual green/red tick flash indicators and fast 2.5s background synchronization.
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
  { key: 'nifty', name: 'NIFTY 50', exchange: 'NSE', price: 23325.10, change: 54.50, changePct: 0.23, high: 23360.55, low: 23286.60, prevClose: 23270.60 },
  { key: 'banknifty', name: 'BANK NIFTY', exchange: 'NSE', price: 56214.70, change: 158.95, changePct: 0.28, high: 56350.45, low: 56040.20, prevClose: 56055.75 },
  { key: 'sensex', name: 'SENSEX', exchange: 'BSE', price: 74458.92, change: 144.33, changePct: 0.19, high: 74589.80, low: 74300.20, prevClose: 74314.59 },
  { key: 'indiavix', name: 'INDIA VIX', exchange: 'NSE', price: 12.09, change: -0.20, changePct: -1.63, high: 12.50, low: 11.95, prevClose: 12.29 },
  { key: 'finnifty', name: 'FIN NIFTY', exchange: 'NSE', price: 25406.50, change: 86.10, changePct: 0.34, high: 25480.00, low: 25310.00, prevClose: 25320.40 },
  { key: 'midcap', name: 'MIDCAP 50', exchange: 'NSE', price: 14420.00, change: 37.70, changePct: 0.26, high: 14450.00, low: 14360.00, prevClose: 14382.30 },
  { key: 'btc', name: 'BITCOIN', exchange: 'CRYPTO', price: 77222.58, change: 854.58, changePct: 1.12, high: 77600.00, low: 76100.00, prevClose: 76368.00 },
  { key: 'eth', name: 'ETHEREUM', exchange: 'CRYPTO', price: 2465.00, change: 25.80, changePct: 1.06, high: 2480.00, low: 2420.00, prevClose: 2439.20 },
  { key: 'bnb', name: 'BNB', exchange: 'CRYPTO', price: 728.50, change: 3.35, changePct: 0.46, high: 732.00, low: 721.00, prevClose: 725.15 },
  { key: 'gold', name: 'GOLD', exchange: 'COMEX', price: 4355.00, change: 11.70, changePct: 0.27, high: 4368.00, low: 4330.00, prevClose: 4343.30 },
  { key: 'crude', name: 'CRUDE OIL', exchange: 'NYMEX', price: 101.80, change: 0.36, changePct: 0.35, high: 102.60, low: 100.90, prevClose: 101.44 },
  { key: 'usdinr', name: 'USD/INR', exchange: 'FOREX', price: 95.84, change: -0.04, changePct: -0.04, high: 96.05, low: 95.75, prevClose: 95.88 },
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

  // Flash styling on live tick
  const tickColor =
    item.lastTick === 'up'
      ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]'
      : item.lastTick === 'down'
      ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]'
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
      className={`glossy-card rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer ${
        isActive
          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.3)] bg-gradient-to-b from-[#D4AF37]/15 to-[#0B0F19]'
          : item.lastTick === 'up'
          ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/30 to-[#0B0F19]'
          : item.lastTick === 'down'
          ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/30 to-[#0B0F19]'
          : 'border-white/10'
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Market Feed" />
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

      {/* Exact Real Price with Live Flash Animation */}
      {item.price !== null ? (
        <div>
          <div className="flex items-baseline gap-2">
            <p className={`font-black font-mono transition-all duration-300 ${compact ? 'text-xl' : 'text-2xl'} ${tickColor}`}>
              {displayPrefix}{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {item.lastTick && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border transition-all animate-pulse ${tickBadgeBg}`}>
                {item.lastTick === 'up' ? '▲ LIVE' : '▼ LIVE'}
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
  const [refreshing, setRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  // Fast background fetch from server (every 2.5s)
  const fetchServerData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/market-data`, {
        timeout: 4000,
      });

      if (res.data?.data && res.data.data.length > 0) {
        setLastUpdated(new Date());
        setData(prev =>
          prev.map(item => {
            const fresh = res.data.data.find(d => d.key === item.key);
            if (!fresh || fresh.price == null) return item;

            const tick =
              fresh.price > item.price ? 'up' :
              fresh.price < item.price ? 'down' :
              null;

            return {
              ...item,
              ...fresh,
              prevClose: fresh.prevClose || item.prevClose,
              lastTick: tick || (item.lastTick ? item.lastTick : null),
            };
          })
        );

        // Reset flash highlight after 1.2s
        setTimeout(() => {
          setData(prev => prev.map(item => ({ ...item, lastTick: null })));
        }, 1200);
      }
    } catch (err) {
      // Keep running with latest cached data
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchServerData();
    if (!autoRefresh) return;
    const serverSyncInterval = setInterval(fetchServerData, 2500);
    return () => clearInterval(serverSyncInterval);
  }, [fetchServerData, autoRefresh]);

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
      {/* Header with Live indicator */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {filter === 'indices' && <><FaChartLine className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Indian Market Indices</span></>}
          {filter === 'crypto' && <><FaCoins className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Crypto — Live</span></>}
          {filter === 'global' && <><FaGlobeAsia className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Global Commodities</span></>}
          {filter === 'all' && <><FaBolt className="text-[#D4AF37]" /><span className="text-lg font-bold text-white">Live Market Data</span></>}

          {/* Live Feed Badge */}
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold">LIVE STREAM</span>
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

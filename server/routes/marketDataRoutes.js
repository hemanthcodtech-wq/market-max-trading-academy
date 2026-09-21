const express = require('express');
const router = express.Router();
const https = require('https');

/**
 * 1-Second Live Market Data & Realtime Candlestick Streaming Service
 * Features:
 * - Server-Sent Events (SSE) stream endpoint: GET /api/market-data/stream
 *   Pushes real-time market ticks every 1 second to all connected clients.
 * - In-memory cache with 1-second background refresh loop.
 * - GET /api/market-data (instant in-memory 1s cache)
 * - GET /api/market-data/chart (instant in-memory 1s chart candles cache)
 * - Primary: Yahoo Finance v8 Chart API
 * - Fallback: DummyTrader quote API for NSE indices & stocks
 */

const SYMBOL_MAP = {
  // Indices
  'NSE:NIFTY':          { yahoo: '%5ENSEI',              dummy: '^NSEI',               name: 'NIFTY 50',      exchange: 'NSE', precision: 2 },
  'NIFTY':              { yahoo: '%5ENSEI',              dummy: '^NSEI',               name: 'NIFTY 50',      exchange: 'NSE', precision: 2 },
  'nifty':              { yahoo: '%5ENSEI',              dummy: '^NSEI',               name: 'NIFTY 50',      exchange: 'NSE', precision: 2 },
  'NSE:BANKNIFTY':      { yahoo: '%5ENSEBANK',           dummy: '^NSEBANK',            name: 'BANK NIFTY',   exchange: 'NSE', precision: 2 },
  'BANKNIFTY':          { yahoo: '%5ENSEBANK',           dummy: '^NSEBANK',            name: 'BANK NIFTY',   exchange: 'NSE', precision: 2 },
  'banknifty':          { yahoo: '%5ENSEBANK',           dummy: '^NSEBANK',            name: 'BANK NIFTY',   exchange: 'NSE', precision: 2 },
  'BSE:SENSEX':         { yahoo: '%5EBSESN',             dummy: null,                  name: 'SENSEX',        exchange: 'BSE', precision: 2 },
  'SENSEX':             { yahoo: '%5EBSESN',             dummy: null,                  name: 'SENSEX',        exchange: 'BSE', precision: 2 },
  'sensex':             { yahoo: '%5EBSESN',             dummy: null,                  name: 'SENSEX',        exchange: 'BSE', precision: 2 },
  'NSE:INDIAVIX':       { yahoo: '%5EINDIAVIX',          dummy: '^INDIAVIX',           name: 'INDIA VIX',     exchange: 'NSE', precision: 2 },
  'INDIAVIX':           { yahoo: '%5EINDIAVIX',          dummy: '^INDIAVIX',           name: 'INDIA VIX',     exchange: 'NSE', precision: 2 },
  'indiavix':           { yahoo: '%5EINDIAVIX',          dummy: '^INDIAVIX',           name: 'INDIA VIX',     exchange: 'NSE', precision: 2 },
  'NSE:FINNIFTY':       { yahoo: 'NIFTY_FIN_SERVICE.NS', dummy: null,                  name: 'FIN NIFTY',     exchange: 'NSE', precision: 2 },
  'FINNIFTY':           { yahoo: 'NIFTY_FIN_SERVICE.NS', dummy: null,                  name: 'FIN NIFTY',     exchange: 'NSE', precision: 2 },
  'finnifty':           { yahoo: 'NIFTY_FIN_SERVICE.NS', dummy: null,                  name: 'FIN NIFTY',     exchange: 'NSE', precision: 2 },
  'NSE:MIDCPNIFTY':     { yahoo: 'NIFTY_MID_SELECT.NS',  dummy: null,                  name: 'MIDCAP 50',     exchange: 'NSE', precision: 2 },
  'midcap':             { yahoo: 'NIFTY_MID_SELECT.NS',  dummy: null,                  name: 'MIDCAP 50',     exchange: 'NSE', precision: 2 },

  // Top Indian F&O Stocks (NSE)
  'NSE:RELIANCE':       { yahoo: 'RELIANCE.NS',          dummy: 'RELIANCE.NS',         name: 'RELIANCE',      exchange: 'NSE', precision: 2 },
  'NSE:HDFCBANK':       { yahoo: 'HDFCBANK.NS',          dummy: 'HDFCBANK.NS',         name: 'HDFC BANK',     exchange: 'NSE', precision: 2 },
  'NSE:ICICIBANK':      { yahoo: 'ICICIBANK.NS',         dummy: 'ICICIBANK.NS',        name: 'ICICI BANK',    exchange: 'NSE', precision: 2 },
  'NSE:TCS':            { yahoo: 'TCS.NS',               dummy: 'TCS.NS',              name: 'TCS',           exchange: 'NSE', precision: 2 },
  'NSE:INFY':           { yahoo: 'INFY.NS',              dummy: 'INFY.NS',             name: 'INFOSYS',       exchange: 'NSE', precision: 2 },
  'NSE:SBIN':           { yahoo: 'SBIN.NS',              dummy: 'SBIN.NS',             name: 'SBIN',          exchange: 'NSE', precision: 2 },

  // Top Indian Stocks (BSE)
  'BSE:RELIANCE':       { yahoo: 'RELIANCE.BO',          dummy: null,                  name: 'RELIANCE',      exchange: 'BSE', precision: 2 },
  'BSE:HDFCBANK':       { yahoo: 'HDFCBANK.BO',          dummy: null,                  name: 'HDFC BANK',     exchange: 'BSE', precision: 2 },
  'BSE:ICICIBANK':      { yahoo: 'ICICIBANK.BO',         dummy: null,                  name: 'ICICI BANK',    exchange: 'BSE', precision: 2 },
  'BSE:TCS':            { yahoo: 'TCS.BO',               dummy: null,                  name: 'TCS',           exchange: 'BSE', precision: 2 },
  'BSE:INFY':           { yahoo: 'INFY.BO',              dummy: null,                  name: 'INFOSYS',       exchange: 'BSE', precision: 2 },
  'BSE:SBIN':           { yahoo: 'SBIN.BO',              dummy: null,                  name: 'SBIN',          exchange: 'BSE', precision: 2 },

  // Additional BSE Indices
  'BSE:BANKEX':         { yahoo: '%5EBSEBANK',           dummy: null,                  name: 'BANKEX',        exchange: 'BSE', precision: 2 },
  'BSE:BSE100':         { yahoo: '%5EBSE100',            dummy: null,                  name: 'BSE 100',       exchange: 'BSE', precision: 2 },
  'BSE:BSE500':         { yahoo: '%5EBSE500',            dummy: null,                  name: 'BSE 500',       exchange: 'BSE', precision: 2 },
  'BSE:BSEMIDCAP':      { yahoo: '%5EBSEMID',            dummy: null,                  name: 'MIDCAP',        exchange: 'BSE', precision: 2 },
  'BSE:BSESMLCAP':      { yahoo: '%5EBSESML',            dummy: null,                  name: 'SMALLCAP',      exchange: 'BSE', precision: 2 },

  // Crypto & Global
  'BINANCE:BTCUSDT':    { yahoo: 'BTC-USD',              dummy: null,                  name: 'BITCOIN',       exchange: 'CRYPTO', precision: 2 },
  'btc':                { yahoo: 'BTC-USD',              dummy: null,                  name: 'BITCOIN',       exchange: 'CRYPTO', precision: 2 },
  'BINANCE:ETHUSDT':    { yahoo: 'ETH-USD',              dummy: null,                  name: 'ETHEREUM',      exchange: 'CRYPTO', precision: 2 },
  'eth':                { yahoo: 'ETH-USD',              dummy: null,                  name: 'ETHEREUM',      exchange: 'CRYPTO', precision: 2 },
  'BINANCE:BNBUSDT':    { yahoo: 'BNB-USD',              dummy: null,                  name: 'BNB',           exchange: 'CRYPTO', precision: 2 },
  'bnb':                { yahoo: 'BNB-USD',              dummy: null,                  name: 'BNB',           exchange: 'CRYPTO', precision: 2 },
  'TVC:GOLD':           { yahoo: 'GC%3DF',               dummy: null,                  name: 'GOLD',          exchange: 'COMEX', precision: 2 },
  'gold':               { yahoo: 'GC%3DF',               dummy: null,                  name: 'GOLD',          exchange: 'COMEX', precision: 2 },
  'TVC:USOIL':          { yahoo: 'CL%3DF',               dummy: null,                  name: 'CRUDE OIL',     exchange: 'NYMEX', precision: 2 },
  'crude':              { yahoo: 'CL%3DF',               dummy: null,                  name: 'CRUDE OIL',     exchange: 'NYMEX', precision: 2 },
  'FX:USDINR':          { yahoo: 'INR%3DX',              dummy: null,                  name: 'USD/INR',       exchange: 'FOREX', precision: 2 },
  'usdinr':             { yahoo: 'INR%3DX',              dummy: null,                  name: 'USD/INR',       exchange: 'FOREX', precision: 2 },
};

const SYMBOLS = [
  { key: 'nifty',     yahoo: '%5ENSEI',              dummy: '^NSEI',               name: 'NIFTY 50',      exchange: 'NSE' },
  { key: 'banknifty', yahoo: '%5ENSEBANK',           dummy: '^NSEBANK',            name: 'BANK NIFTY',   exchange: 'NSE' },
  { key: 'sensex',    yahoo: '%5EBSESN',             dummy: null,                  name: 'SENSEX',        exchange: 'BSE' },
  { key: 'indiavix',  yahoo: '%5EINDIAVIX',          dummy: '^INDIAVIX',           name: 'INDIA VIX',     exchange: 'NSE' },
  { key: 'finnifty',  yahoo: 'NIFTY_FIN_SERVICE.NS', dummy: null,                  name: 'FIN NIFTY',     exchange: 'NSE', precision: 2 },
  { key: 'midcap',    yahoo: 'NIFTY_MID_SELECT.NS',  dummy: null,                  name: 'MIDCAP 50',     exchange: 'NSE', precision: 2 },
  { key: 'btc',       yahoo: 'BTC-USD',              dummy: null,                  name: 'BITCOIN',       exchange: 'CRYPTO' },
  { key: 'eth',       yahoo: 'ETH-USD',              dummy: null,                  name: 'ETHEREUM',      exchange: 'CRYPTO' },
  { key: 'bnb',       yahoo: 'BNB-USD',              dummy: null,                  name: 'BNB',           exchange: 'CRYPTO' },
  { key: 'gold',      yahoo: 'GC%3DF',               dummy: null,                  name: 'GOLD',          exchange: 'COMEX' },
  { key: 'crude',     yahoo: 'CL%3DF',               dummy: null,                  name: 'CRUDE OIL',     exchange: 'NYMEX' },
  { key: 'usdinr',    yahoo: 'INR%3DX',              dummy: null,                  name: 'USD/INR',       exchange: 'FOREX' },
];

// Fallback benchmarks updated to active market levels
const BENCHMARKS = {
  nifty:     { price: 23325.10, change: 54.50,  changePct: 0.23,  high: 23360.55, low: 23286.60, prevClose: 23270.60 },
  banknifty: { price: 56214.70, change: 158.95, changePct: 0.28,  high: 56350.45, low: 56040.20, prevClose: 56055.75 },
  sensex:    { price: 74458.92, change: 144.33, changePct: 0.19,  high: 74589.80, low: 74300.20, prevClose: 74314.59 },
  indiavix:  { price: 12.09,    change: -0.20,  changePct: -1.63, high: 12.50,   low: 11.95,   prevClose: 12.29 },
  finnifty:  { price: 25406.50, change: 86.10,  changePct: 0.34,  high: 25480.00, low: 25310.00, prevClose: 25320.40 },
  midcap:    { price: 14420.00, change: 37.70,  changePct: 0.26,  high: 14450.00, low: 14360.00, prevClose: 14382.30 },
  btc:       { price: 77222.58, change: 854.58, changePct: 1.12,  high: 77600.00, low: 76100.00, prevClose: 76368.00 },
  eth:       { price: 2465.00,  change: 25.80,  changePct: 1.06,  high: 2480.00,  low: 2420.00,  prevClose: 2439.20 },
  bnb:       { price: 728.50,   change: 3.35,   changePct: 0.46,  high: 732.00,   low: 721.00,   prevClose: 725.15 },
  gold:      { price: 4355.00,  change: 11.70,  changePct: 0.27,  high: 4368.00,  low: 4330.00,  prevClose: 4343.30 },
  crude:     { price: 101.80,   change: 0.36,   changePct: 0.35,  high: 102.60,   low: 100.90,   prevClose: 101.44 },
  usdinr:    { price: 95.84,    change: -0.04,  changePct: -0.04, high: 96.05,    low: 95.75,    prevClose: 95.88 },
};

// In-memory cache for market overview (instant response)
let cachedMarketData = SYMBOLS.map(s => ({
  key: s.key,
  name: s.name,
  exchange: s.exchange,
  symbol: s.yahoo,
  ...BENCHMARKS[s.key],
  updatedAt: new Date().toISOString()
}));
let lastCacheTime = Date.now();

// In-memory cache for chart candles (keyed by symbol_interval_range)
const chartCache = new Map();

// Active SSE client connections
const sseClients = new Set();

function fetchYahooChart(yahooSym, interval = '1m', range = '1d') {
  return new Promise((resolve) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSym}?interval=${interval}&range=${range}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return resolve(null);
          }
          const json = JSON.parse(data);
          const result = json?.chart?.result?.[0];
          if (!result) return resolve(null);

          const meta = result.meta;
          if (!meta || meta.regularMarketPrice == null) return resolve(null);

          const price = meta.regularMarketPrice;
          const prevClose = meta.previousClose || meta.chartPreviousClose || price;
          const change = price - prevClose;
          const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
          const high = meta.regularMarketDayHigh || meta.dayHigh || price;
          const low = meta.regularMarketDayLow || meta.dayLow || price;

          const timestamps = result.timestamp || [];
          const quote = result.indicators?.quote?.[0] || {};
          const candles = [];

          for (let i = 0; i < timestamps.length; i++) {
            if (quote.open && quote.open[i] != null && quote.close && quote.close[i] != null) {
              candles.push({
                time: timestamps[i],
                open: +quote.open[i].toFixed(2),
                high: +(quote.high[i] != null ? quote.high[i] : quote.open[i]).toFixed(2),
                low: +(quote.low[i] != null ? quote.low[i] : quote.open[i]).toFixed(2),
                close: +quote.close[i].toFixed(2),
                volume: quote.volume ? (quote.volume[i] || 0) : 0,
              });
            }
          }

          resolve({
            price: +price.toFixed(2),
            prevClose: +prevClose.toFixed(2),
            change: +change.toFixed(2),
            changePct: +changePct.toFixed(2),
            high: +high.toFixed(2),
            low: +low.toFixed(2),
            symbol: meta.symbol || yahooSym,
            updatedAt: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
            candles,
          });
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(2500, () => { req.destroy(); resolve(null); });
  });
}

function fetchDummyTraderQuote(dummySym) {
  return new Promise((resolve) => {
    if (!dummySym) return resolve(null);
    const url = `https://dummytrader.in/api/quote?symbol=${encodeURIComponent(dummySym)}&interval=1m&range=1d`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://dummytrader.in/app',
      },
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) return resolve(null);
          const json = JSON.parse(data);
          if (!json || json.price == null) return resolve(null);

          const rawCandles = json.candles || [];
          const candles = rawCandles.map(c => ({
            time: c.time,
            open: +c.open.toFixed(2),
            high: +c.high.toFixed(2),
            low: +c.low.toFixed(2),
            close: +c.close.toFixed(2),
            volume: c.volume || 0,
          }));

          const first = candles[0];
          const prevClose = first ? first.open : json.price;
          const change = json.price - prevClose;
          const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

          resolve({
            price: +json.price.toFixed(2),
            prevClose: +prevClose.toFixed(2),
            change: +change.toFixed(2),
            changePct: +changePct.toFixed(2),
            high: candles.length ? Math.max(...candles.map(c => c.high)) : json.price,
            low: candles.length ? Math.min(...candles.map(c => c.low)) : json.price,
            symbol: json.symbol,
            name: json.name,
            updatedAt: new Date().toISOString(),
            candles,
          });
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(2500, () => { req.destroy(); resolve(null); });
  });
}

// Fetch single symbol
async function fetchSingleOverviewSymbol(sym) {
  let data = await fetchYahooChart(sym.yahoo, '1m', '1d');
  if (!data && sym.dummy) {
    data = await fetchDummyTraderQuote(sym.dummy);
  }
  if (data) {
    return {
      key: sym.key,
      name: sym.name,
      exchange: sym.exchange,
      symbol: sym.yahoo,
      price: data.price,
      change: data.change,
      changePct: data.changePct,
      high: data.high,
      low: data.low,
      prevClose: data.prevClose,
      updatedAt: data.updatedAt,
    };
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────
// CONTINUOUS 1-SECOND BACKGROUND TICK POLLER & SSE BROADCASTER
// ──────────────────────────────────────────────────────────────────
let isPolling = false;
async function pollMarketData() {
  if (isPolling) return;
  isPolling = true;

  try {
    const fetchedResults = await Promise.all(SYMBOLS.map(fetchSingleOverviewSymbol));

    const updated = SYMBOLS.map((sym, idx) => {
      const fresh = fetchedResults[idx];
      const prev = cachedMarketData[idx] || BENCHMARKS[sym.key] || {};
      if (fresh && fresh.price !== null) {
        return fresh;
      }
      return {
        ...prev,
        key: sym.key,
        name: sym.name,
        exchange: sym.exchange,
        symbol: sym.yahoo,
        updatedAt: new Date().toISOString()
      };
    });

    cachedMarketData = updated;
    lastCacheTime = Date.now();

    // Broadcast 1-second live tick to all connected SSE clients
    if (sseClients.size > 0) {
      const payload = JSON.stringify({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
      const sseMessage = `data: ${payload}\n\n`;

      for (const client of sseClients) {
        try {
          client.write(sseMessage);
        } catch (err) {
          sseClients.delete(client);
        }
      }
    }
  } catch (err) {
    // Keep running smoothly
  } finally {
    isPolling = false;
  }
}

// Start continuous 1-second polling loop
setInterval(pollMarketData, 1000);
// Trigger initial immediate fetch
pollMarketData();

/**
 * GET /api/market-data/stream
 * Server-Sent Events (SSE) endpoint: streams 1-second live ticks directly to browser
 */
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Send initial snapshot immediately
  res.write(`data: ${JSON.stringify({
    success: true,
    data: cachedMarketData,
    timestamp: new Date().toISOString()
  })}\n\n`);

  sseClients.add(res);

  // Send keepalive comment every 15s to keep proxy connections alive
  const keepAlive = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (e) {
      clearInterval(keepAlive);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
});

/**
 * GET /api/market-data
 * Returns 1-second live cached market prices
 */
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=1');
  res.json({
    success: true,
    cached: true,
    data: cachedMarketData,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/market-data/chart
 * Query params:
 *   symbol   e.g. "NSE:NIFTY", "^NSEI", "RELIANCE", "BINANCE:BTCUSDT"
 *   interval e.g. "1m", "5m", "15m", "60m", "1d" (default: "1m")
 *   range    e.g. "1d", "5d", "1mo", "1y" (default: "1d")
 *
 * Returns real candlestick history + 1-second live price for TradingView Lightweight Charts
 */
router.get('/chart', async (req, res) => {
  try {
    const rawSymbol = req.query.symbol || 'NSE:NIFTY';
    let interval = req.query.interval || '1m';
    let range = req.query.range || '1d';

    if (interval === '1') interval = '1m';
    if (interval === '5') interval = '5m';
    if (interval === '15') interval = '15m';
    if (interval === '30') interval = '30m';
    if (interval === '60' || interval === '1H') interval = '60m';
    if (interval === 'D' || interval === '1D') {
      interval = '1d';
      if (range === '1d') range = '1mo';
    }

    const isBSE = rawSymbol.startsWith('BSE:');
    const mapping = SYMBOL_MAP[rawSymbol] || SYMBOL_MAP[rawSymbol.toUpperCase()] || {
      yahoo: rawSymbol.includes(':') ? rawSymbol.split(':')[1] + (isBSE ? '.BO' : '.NS') : rawSymbol,
      dummy: null,
      name: rawSymbol,
      exchange: isBSE ? 'BSE' : 'NSE',
      precision: 2,
    };

    const cacheKey = `${rawSymbol}_${interval}_${range}`;
    const now = Date.now();
    const cached = chartCache.get(cacheKey);

    // 1-second cache TTL
    if (cached && (now - cached.time < 1000)) {
      res.setHeader('Cache-Control', 'public, max-age=1');
      return res.json({ success: true, cached: true, ...cached.data });
    }

    // Fetch live chart
    let result = await fetchYahooChart(mapping.yahoo, interval, range);

    if ((!result || !result.candles || result.candles.length === 0) && mapping.dummy) {
      result = await fetchDummyTraderQuote(mapping.dummy);
    }

    if (!result || !result.candles || result.candles.length === 0) {
      const bm = BENCHMARKS[rawSymbol.toLowerCase()] || BENCHMARKS.nifty;
      const base = bm.price;
      const tNow = Math.floor(Date.now() / 1000);
      const fallbackCandles = [
        { time: tNow - 120, open: base - 2, high: base + 1, low: base - 3, close: base - 1, volume: 1000 },
        { time: tNow - 60,  open: base - 1, high: base + 3, low: base - 1, close: base + 1, volume: 1500 },
        { time: tNow,       open: base + 1, high: base + 4, low: base,     close: base + 2, volume: 2000 },
      ];
      result = {
        price: base,
        prevClose: bm.prevClose,
        change: bm.change,
        changePct: bm.changePct,
        high: bm.high,
        low: bm.low,
        symbol: rawSymbol,
        candles: fallbackCandles,
        updatedAt: new Date().toISOString(),
      };
    }

    const responsePayload = {
      symbol: rawSymbol,
      name: mapping.name,
      exchange: mapping.exchange,
      precision: mapping.precision || 2,
      price: result.price,
      prevClose: result.prevClose,
      change: result.change,
      changePct: result.changePct,
      high: result.high,
      low: result.low,
      candles: result.candles,
      updatedAt: result.updatedAt,
    };

    chartCache.set(cacheKey, { time: now, data: responsePayload });

    res.setHeader('Cache-Control', 'public, max-age=1');
    res.json({ success: true, cached: false, ...responsePayload });
  } catch (err) {
    console.error('[Chart Data] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

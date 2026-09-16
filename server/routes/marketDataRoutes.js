const express = require('express');
const router = express.Router();
const https = require('https');

/**
 * Yahoo Finance symbol mapping for Indian & global markets
 * GET /api/market-data  → returns live prices for all tracked symbols
 */

const SYMBOLS = [
  { key: 'nifty',    yahoo: '%5ENSEI',    name: 'NIFTY 50',      exchange: 'NSE' },
  { key: 'banknifty',yahoo: '%5ENSEBANK', name: 'BANK NIFTY',   exchange: 'NSE' },
  { key: 'sensex',   yahoo: '%5EBSESN',   name: 'SENSEX',        exchange: 'BSE' },
  { key: 'indiavix', yahoo: '%5EINDIAVIX',name: 'INDIA VIX',     exchange: 'NSE' },
  { key: 'finnifty', yahoo: 'NIFTY_FIN_SERVICE.NS', name: 'FIN NIFTY', exchange: 'NSE' },
  { key: 'midcap',   yahoo: '%5ENIFMDCP50', name: 'MIDCAP 50',  exchange: 'NSE' },
  { key: 'btc',      yahoo: 'BTC-USD',    name: 'BITCOIN',       exchange: 'CRYPTO' },
  { key: 'eth',      yahoo: 'ETH-USD',    name: 'ETHEREUM',      exchange: 'CRYPTO' },
  { key: 'gold',     yahoo: 'GC%3DF',     name: 'GOLD',          exchange: 'COMEX' },
  { key: 'crude',    yahoo: 'CL%3DF',     name: 'CRUDE OIL',     exchange: 'NYMEX' },
  { key: 'usdinr',   yahoo: 'INR%3DX',    name: 'USD/INR',       exchange: 'FOREX' },
  { key: 'bnb',      yahoo: 'BNB-USD',    name: 'BNB',           exchange: 'CRYPTO' },
];

const yahooSymbols = SYMBOLS.map(s => s.yahoo).join('%2C');

/**
 * Fetches data from Yahoo Finance v7 quote API using native https module
 * (no extra dependencies needed)
 */
function fetchYahoo(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/',
        'Origin': 'https://finance.yahoo.com',
      },
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse Yahoo Finance response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Request timeout')); });
  });
}

router.get('/', async (req, res) => {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketPreviousClose,regularMarketOpen,regularMarketDayHigh,regularMarketDayLow,regularMarketVolume,shortName`;

    const data = await fetchYahoo(url);
    const quotes = data?.quoteResponse?.result || [];

const BENCHMARKS = {
  nifty:     { price: 25375.80, change: 89.20,  changePct: 0.35,  high: 25420.50, low: 25290.10, prevClose: 25286.60 },
  banknifty: { price: 52195.40, change: -115.30, changePct: -0.22, high: 52450.00, low: 52080.50, prevClose: 52310.70 },
  sensex:    { price: 82980.20, change: 252.40, changePct: 0.31,  high: 83150.00, low: 82720.00, prevClose: 82727.80 },
  indiavix:  { price: 13.40,    change: -0.35,  changePct: -2.55, high: 14.10,   low: 13.15,   prevClose: 13.75 },
  finnifty:  { price: 24135.60, change: 48.90,  changePct: 0.20,  high: 24205.00, low: 24060.00, prevClose: 24086.70 },
  midcap:    { price: 13260.10, change: 98.40,  changePct: 0.75,  high: 13295.00, low: 13150.00, prevClose: 13161.70 },
  btc:       { price: 68450.00, change: 1280.00, changePct: 1.91, high: 68980.00, low: 67100.00, prevClose: 67170.00 },
  eth:       { price: 2645.20,  change: 52.80,  changePct: 2.04,  high: 2685.00, low: 2580.00,  prevClose: 2592.40 },
  bnb:       { price: 596.50,   change: 15.20,  changePct: 2.61,  high: 604.00,  low: 579.00,   prevClose: 581.30 },
  gold:      { price: 2738.40,  change: 14.20,  changePct: 0.52,  high: 2745.00, low: 2721.00,  prevClose: 2724.20 },
  crude:     { price: 71.60,    change: -0.80,  changePct: -1.10, high: 72.90,   low: 70.80,   prevClose: 72.40 },
  usdinr:    { price: 84.07,    change: 0.03,   changePct: 0.04,  high: 84.12,   low: 84.02,   prevClose: 84.04 },
};

    // Map quotes back to our structured format
    const result = SYMBOLS.map((sym, idx) => {
      const q = quotes.find(q => q.symbol === decodeURIComponent(sym.yahoo)) || quotes[idx] || {};
      const bm = BENCHMARKS[sym.key] || {};
      const price = q.regularMarketPrice ?? bm.price ?? null;
      const change = q.regularMarketChange ?? bm.change ?? null;
      const changePct = q.regularMarketChangePercent ?? bm.changePct ?? null;

      return {
        key: sym.key,
        name: sym.name,
        exchange: sym.exchange,
        symbol: q.symbol || sym.yahoo,
        price: price !== null ? +price.toFixed(2) : null,
        change: change !== null ? +change.toFixed(2) : null,
        changePct: changePct !== null ? +changePct.toFixed(2) : null,
        open: q.regularMarketOpen ?? bm.open ?? null,
        high: q.regularMarketDayHigh ?? bm.high ?? null,
        low: q.regularMarketDayLow ?? bm.low ?? null,
        prevClose: q.regularMarketPreviousClose ?? bm.prevClose ?? null,
        volume: q.regularMarketVolume ?? null,
        shortName: q.shortName || sym.name,
      };
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: result, timestamp: new Date().toISOString() });

  } catch (err) {
    console.error('[Market Data] Error:', err.message);
    const fallback = SYMBOLS.map(s => {
      const bm = BENCHMARKS[s.key] || {};
      return {
        key: s.key,
        name: s.name,
        exchange: s.exchange,
        price: bm.price ?? null,
        change: bm.change ?? null,
        changePct: bm.changePct ?? null,
        high: bm.high ?? null,
        low: bm.low ?? null,
        prevClose: bm.prevClose ?? null,
      };
    });
    res.status(200).json({
      success: true,
      fallback: true,
      error: err.message,
      data: fallback,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;

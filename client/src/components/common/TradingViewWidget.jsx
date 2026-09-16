import React, { useEffect, useRef } from 'react';

/**
 * TradingViewWidget — Universal wrapper for all TradingView embed widgets.
 *
 * Props:
 *  type            — widget type (see switch below)
 *  symbol          — trading symbol e.g. "NSE:NIFTY"
 *  symbols         — array of symbols for multi-symbol widgets
 *  interval        — chart interval e.g. "5", "15", "D"
 *  height          — CSS height string or number
 *  width           — CSS width string
 *  theme           — "dark" | "light"
 *  locale          — locale code, default "in"
 *  allowSymbolChange — boolean, lets user switch symbols in chart
 *  market          — market filter e.g. "india", "crypto"
 *  exchange        — exchange filter e.g. "NSE", "BSE"
 */
const TradingViewWidget = ({
  type = 'ticker',
  symbol = 'NSE:NIFTY',
  symbols,
  interval = '15',
  height = '100%',
  width = '100%',
  theme = 'dark',
  locale = 'in',
  allowSymbolChange = true,
  market = 'india',
  exchange = 'NSE',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    switch (type) {
      // ─────────────────────────────────────────────
      // 1. Ticker Tape (scrolling price strip)
      // ─────────────────────────────────────────────
      case 'ticker':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.innerHTML = JSON.stringify({
          symbols: symbols || [
            { description: 'NIFTY 50', proName: 'NSE:NIFTY' },
            { description: 'BANK NIFTY', proName: 'NSE:BANKNIFTY' },
            { description: 'SENSEX', proName: 'BSE:SENSEX' },
            { description: 'RELIANCE', proName: 'NSE:RELIANCE' },
            { description: 'HDFCBANK', proName: 'NSE:HDFCBANK' },
            { description: 'TCS', proName: 'NSE:TCS' },
            { description: 'GOLD', proName: 'TVC:GOLD' },
            { description: 'CRUDE OIL', proName: 'TVC:USOIL' },
            { description: 'BTC/USDT', proName: 'BINANCE:BTCUSDT' },
            { description: 'ETH/USDT', proName: 'BINANCE:ETHUSDT' },
          ],
          showSymbolLogo: true,
          isTransparent: true,
          displayMode: 'adaptive',
          colorTheme: theme,
          locale,
        });
        break;

      // ─────────────────────────────────────────────
      // 2. Advanced Chart (full candlestick chart)
      // ─────────────────────────────────────────────
      case 'chart':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.innerHTML = JSON.stringify({
          width,
          height,
          symbol,
          interval,
          timezone: 'Asia/Kolkata',
          theme,
          style: '1',
          locale,
          allow_symbol_change: allowSymbolChange,
          studies: ['STD;RSI', 'STD;MACD', 'STD;Volume'],
          calendar: false,
          support_host: 'https://www.tradingview.com',
        });
        break;

      // ─────────────────────────────────────────────
      // 3. Market Overview (indices + sectors)
      // ─────────────────────────────────────────────
      case 'market-overview':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.innerHTML = JSON.stringify({
          colorTheme: theme,
          dateRange: '12M',
          showChart: true,
          locale,
          width,
          height,
          largeChartUrl: '',
          isTransparent: false,
          showSymbolLogo: true,
          showFloatingTooltip: false,
          plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
          plotLineColorFalling: 'rgba(41, 98, 255, 1)',
          gridLineColor: 'rgba(240, 243, 250, 0)',
          scaleFontColor: 'rgba(106, 109, 120, 1)',
          belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
          belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
          belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
          belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
          symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
          tabs: [
            {
              title: 'Indices',
              symbols: [
                { s: 'NSE:NIFTY', d: 'NIFTY 50' },
                { s: 'NSE:BANKNIFTY', d: 'BANK NIFTY' },
                { s: 'BSE:SENSEX', d: 'SENSEX' },
                { s: 'NSE:FINNIFTY', d: 'FIN NIFTY' },
                { s: 'NSE:MIDCPNIFTY', d: 'MIDCAP NIFTY' },
                { s: 'NSE:INDIAVIX', d: 'INDIA VIX' },
              ],
              originalTitle: 'Indices',
            },
            {
              title: 'F&O Stocks',
              symbols: [
                { s: 'NSE:RELIANCE', d: 'RELIANCE' },
                { s: 'NSE:TCS', d: 'TCS' },
                { s: 'NSE:HDFCBANK', d: 'HDFC BANK' },
                { s: 'NSE:ICICIBANK', d: 'ICICI BANK' },
                { s: 'NSE:INFY', d: 'INFOSYS' },
                { s: 'NSE:SBIN', d: 'SBI' },
              ],
              originalTitle: 'F&O Stocks',
            },
            {
              title: 'Global',
              symbols: [
                { s: 'SP:SPX', d: 'S&P 500' },
                { s: 'NASDAQ:NDX', d: 'NASDAQ 100' },
                { s: 'TVC:GOLD', d: 'GOLD' },
                { s: 'TVC:SILVER', d: 'SILVER' },
                { s: 'TVC:USOIL', d: 'CRUDE OIL' },
                { s: 'FX:USDINR', d: 'USD/INR' },
              ],
              originalTitle: 'Global',
            },
          ],
        });
        break;

      // ─────────────────────────────────────────────
      // 4. Stock Screener
      // ─────────────────────────────────────────────
      case 'screener':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.innerHTML = JSON.stringify({
          width,
          height,
          defaultColumn: 'overview',
          defaultScreen: 'most_capitalized',
          market,
          showToolbar: true,
          colorTheme: theme,
          locale,
        });
        break;

      // ─────────────────────────────────────────────
      // 5. Stock Heatmap
      // ─────────────────────────────────────────────
      case 'heatmap':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.innerHTML = JSON.stringify({
          exchanges: [exchange],
          dataSource: 'SENSEX',
          grouping: 'sector',
          blockSize: 'market_cap_basic',
          blockColor: 'change',
          locale,
          symbolUrl: '',
          colorTheme: theme,
          hasTopBar: false,
          isDataSetEnabled: false,
          isZoomEnabled: true,
          hasSymbolTooltip: true,
          isMonoSize: false,
          width,
          height,
        });
        break;

      // ─────────────────────────────────────────────
      // 6. Crypto Market (top cryptos)
      // ─────────────────────────────────────────────
      case 'crypto-market':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.innerHTML = JSON.stringify({
          width,
          height,
          defaultColumn: 'overview',
          defaultScreen: 'crypto_hot',
          market: 'crypto',
          showToolbar: true,
          colorTheme: theme,
          locale,
        });
        break;

      // ─────────────────────────────────────────────
      // 7. Economic Calendar
      // ─────────────────────────────────────────────
      case 'economic-calendar':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
        script.innerHTML = JSON.stringify({
          colorTheme: theme,
          isTransparent: false,
          width,
          height,
          locale,
          importanceFilter: '0,1',
          countryFilter: 'in,us,eu,gb,cn,jp',
        });
        break;

      // ─────────────────────────────────────────────
      // 8. News Feed
      // ─────────────────────────────────────────────
      case 'news':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.innerHTML = JSON.stringify({
          feedMode: 'market',
          market,
          isTransparent: false,
          displayMode: 'regular',
          width,
          height,
          colorTheme: theme,
          locale,
        });
        break;

      // ─────────────────────────────────────────────
      // 9. Symbol Info (price bar)
      // ─────────────────────────────────────────────
      case 'symbol-info':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
        script.innerHTML = JSON.stringify({
          symbol,
          width,
          locale,
          colorTheme: theme,
          isTransparent: false,
        });
        break;

      // ─────────────────────────────────────────────
      // 10. Mini Chart (compact sparkline)
      // ─────────────────────────────────────────────
      case 'mini-chart':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
        script.innerHTML = JSON.stringify({
          symbol,
          width,
          height,
          locale,
          dateRange: '1D',
          colorTheme: theme,
          trendLineColor: 'rgba(41, 98, 255, 1)',
          underLineColor: 'rgba(41, 98, 255, 0.3)',
          underLineBottomColor: 'rgba(41, 98, 255, 0)',
          isTransparent: false,
          autosize: false,
          largeChartUrl: '',
        });
        break;

      // ─────────────────────────────────────────────
      // 11. Crypto Screener
      // ─────────────────────────────────────────────
      case 'crypto-screener':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.innerHTML = JSON.stringify({
          width,
          height,
          defaultColumn: 'overview',
          defaultScreen: 'general',
          market: 'crypto',
          showToolbar: true,
          colorTheme: theme,
          locale: 'en',
        });
        break;

      // ─────────────────────────────────────────────
      // 12. Forex Heat Map
      // ─────────────────────────────────────────────
      case 'forex-heatmap':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
        script.innerHTML = JSON.stringify({
          width,
          height,
          currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'INR'],
          isTransparent: false,
          colorTheme: theme,
          locale,
        });
        break;

      // ─────────────────────────────────────────────
      // 13. Single Quote
      // ─────────────────────────────────────────────
      case 'single-quote':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
        script.innerHTML = JSON.stringify({
          symbol,
          width: '100%',
          colorTheme: theme,
          isTransparent: true,
          locale,
        });
        break;

      default:
        break;
    }

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [type, symbol, symbols, interval, height, width, theme, locale, allowSymbolChange, market, exchange]);

  const containerStyle =
    type === 'ticker'
      ? { width, height: 'auto' }
      : { width, height };

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={containerStyle}
    />
  );
};

export default TradingViewWidget;

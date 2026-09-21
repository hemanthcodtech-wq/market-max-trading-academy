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
  symbol = 'BSE:SENSEX',
  symbols,
  interval = '15',
  height = '100%',
  width = '100%',
  theme = 'dark',
  locale = 'in',
  allowSymbolChange = true,
  market = 'india',
  exchange = 'BSE',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous widget and ensure the inner widget container exists
    containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>';

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
            { description: 'SENSEX', proName: 'BSE:SENSEX' },
            { description: 'BSE 500', proName: 'BSE:BSE500' },
            { description: 'RELIANCE', proName: 'BSE:RELIANCE' },
            { description: 'HDFCBANK', proName: 'BSE:HDFCBANK' },
            { description: 'TCS', proName: 'BSE:TCS' },
            { description: 'INFY', proName: 'BSE:INFY' },
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
          autosize: true,
          symbol,
          interval,
          timezone: 'Asia/Kolkata',
          theme,
          style: '1',
          locale,
          allow_symbol_change: allowSymbolChange,
          calendar: false,
          details: false,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_volume: false,
          hotlist: false,
          save_image: true,
          withdateranges: true,
          backgroundColor: '#0F0F0F',
          gridColor: 'rgba(242, 242, 242, 0.2)',
          support_host: 'https://www.tradingview.com',
        });
        break;

      case 'market-overview':
        containerRef.current.innerHTML = `
          <tv-market-overview 
            symbol-sectors='[
              {
                "sectionName": "Indices",
                "symbols": ["BSE:SENSEX", "BSE:BSE500", "BSE:BSE100"]
              },
              {
                "sectionName": "Stocks",
                "symbols": ["BSE:RELIANCE", "BSE:HDFCBANK", "BSE:TCS", "BSE:ICICIBANK", "BSE:INFY"]
              }
            ]'
            theme="${theme}"
          ></tv-market-overview>
        `;
        script.type = 'module';
        script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-overview.js';
        script.innerHTML = '';
        break;

      // ─────────────────────────────────────────────
      // 3.5. Technical Analysis (Web Component)
      // ─────────────────────────────────────────────
      case 'technical-analysis':
        containerRef.current.innerHTML = `
          <tv-technical-analysis 
            symbol="${symbol || 'BSE:SENSEX'}" 
            theme="${theme}"
            width="100%"
            height="100%"
          ></tv-technical-analysis>
        `;
        script.type = 'module';
        script.src = 'https://widgets.tradingview-widget.com/w/en/tv-technical-analysis.js';
        script.innerHTML = '';
        break;

      // ─────────────────────────────────────────────
      // 4. Stock Screener
      // ─────────────────────────────────────────────
      case 'screener':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.innerHTML = `
        {
          "market": "india",
          "showToolbar": true,
          "defaultColumn": "overview",
          "defaultScreen": "most_capitalized",
          "isTransparent": false,
          "locale": "en",
          "colorTheme": "${theme}",
          "width": "${width}",
          "height": "${height}"
        }`;
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
          importanceFilter: '-1,0,1',
          countryFilter: 'in',
        });
        break;

      // ─────────────────────────────────────────────
      case 'news':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.innerHTML = JSON.stringify({
          feedMode: 'symbol',
          symbol: 'BSE:SENSEX',
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

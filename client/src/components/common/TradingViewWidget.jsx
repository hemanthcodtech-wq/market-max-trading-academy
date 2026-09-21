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
    // We only use direct DOM injection for Web Component based widgets.
    // All other widgets (external-embedding scripts) are now rendered via isolated iframes.
    if (type !== 'market-overview' && type !== 'technical-analysis') return;
    
    if (!containerRef.current) return;
    
    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;

    if (type === 'market-overview') {
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
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-overview.js';
    } else if (type === 'technical-analysis') {
      containerRef.current.innerHTML = `
        <tv-technical-analysis 
          symbol="${symbol || 'BSE:SENSEX'}" 
          theme="${theme}"
          width="100%"
          height="100%"
        ></tv-technical-analysis>
      `;
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-technical-analysis.js';
    }

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [type, symbol, theme]);

  const containerStyle = type === 'ticker' ? { width, height: 'auto' } : { width, height };

  // Native React Rendering for Web Components
  if (type === 'market-overview' || type === 'technical-analysis') {
    return (
      <div className="tradingview-widget-container" ref={containerRef} style={containerStyle} />
    );
  }

  // --- Iframe Sandbox for External Embedding Scripts ---
  let scriptSrc = '';
  let config = {};

  switch (type) {
    case 'ticker':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      config = {
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
      };
      break;
    case 'chart':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      config = {
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
      };
      break;
    case 'screener':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      config = {
        market: 'india',
        showToolbar: true,
        defaultColumn: 'overview',
        defaultScreen: 'most_capitalized',
        isTransparent: false,
        locale: 'en',
        colorTheme: theme,
        width: '100%',
        height: '100%',
      };
      break;
    case 'heatmap':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
      config = {
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
        width: '100%',
        height: '100%',
      };
      break;
    case 'crypto-market':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      config = {
        width: '100%',
        height: '100%',
        defaultColumn: 'overview',
        defaultScreen: 'crypto_hot',
        market: 'crypto',
        showToolbar: true,
        colorTheme: theme,
        locale,
      };
      break;
    case 'economic-calendar':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      config = {
        colorTheme: theme,
        isTransparent: false,
        width: '100%',
        height: '100%',
        locale,
        importanceFilter: '-1,0,1',
        countryFilter: 'in',
      };
      break;
    case 'news':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      config = {
        feedMode: 'all_symbols',
        isTransparent: false,
        displayMode: 'regular',
        width: '100%',
        height: '100%',
        colorTheme: theme,
        locale,
      };
      break;
    case 'symbol-info':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      config = {
        symbol,
        width: '100%',
        locale,
        colorTheme: theme,
        isTransparent: false,
      };
      break;
    case 'mini-chart':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      config = {
        symbol,
        width: '100%',
        height: '100%',
        locale,
        dateRange: '1M',
        colorTheme: theme,
        isTransparent: false,
        autosize: true,
        largeChartUrl: '',
      };
      break;
    case 'single-quote':
      scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      config = {
        symbol,
        width: '100%',
        colorTheme: theme,
        isTransparent: true,
        locale,
      };
      break;
    default:
      break;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: transparent; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      </style>
    </head>
    <body>
      <div class="tradingview-widget-container" style="width: 100%; height: 100%;">
        <div class="tradingview-widget-container__widget" style="width: 100%; height: 100%;"></div>
        <script type="text/javascript" src="${scriptSrc}" async>
        ${JSON.stringify(config)}
        </script>
      </div>
    </body>
    </html>
  `;

  return (
    <div style={containerStyle}>
      <iframe
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
        title={`TradingView ${type}`}
      />
    </div>
  );
};

export default TradingViewWidget;

import React, { memo } from 'react';

function TradingViewScreener({ theme = 'dark', height = '550px' }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: transparent; }
      </style>
    </head>
    <body>
      <!-- TradingView Widget BEGIN -->
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js" async>
        {
          "market": "india",
          "showToolbar": true,
          "defaultColumn": "overview",
          "defaultScreen": "most_capitalized",
          "isTransparent": false,
          "locale": "en",
          "colorTheme": "dark",
          "width": "100%",
          "height": 550
        }
        </script>
      </div>
      <!-- TradingView Widget END -->
    </body>
    </html>
  `;

  return (
    <div style={{ width: '100%', height }}>
      <iframe
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
        title="TradingView Stock Screener"
      />
    </div>
  );
}

export default memo(TradingViewScreener);

import React, { useEffect, useRef, memo } from 'react';

function TrendlyneWidget({ url, theme = 'light' }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear the container
    container.current.innerHTML = '';
    
    // Create the blockquote
    const bq = document.createElement('blockquote');
    bq.className = 'trendlyne-widgets';
    bq.setAttribute('data-get-url', url);
    bq.setAttribute('data-theme', theme);
    container.current.appendChild(bq);
    
    // Append the Trendlyne script
    const script = document.createElement('script');
    script.src = 'https://cdn-static.trendlyne.com/static/js/webwidgets/tl-widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    container.current.appendChild(script);
    
  }, [url, theme]);

  return <div ref={container} className="w-full" style={{ minHeight: '300px' }} />;
}

export default memo(TrendlyneWidget);

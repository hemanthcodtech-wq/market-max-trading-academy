import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AreaSeries, CandlestickSeries, ColorType, createChart } from 'lightweight-charts';

const GiftNiftyChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [points, setPoints] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 360,
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#94A3B8',
        fontFamily: 'sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.08)' },
      },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.12)' },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.12)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { mode: 1 },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#D4AF37',
      topColor: 'rgba(212,175,55,0.25)',
      bottomColor: 'rgba(212,175,55,0.02)',
      lineWidth: 2,
      priceLineColor: '#D4AF37',
      lastValueVisible: true,
      priceLineVisible: true,
    });
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#F43F5E',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#F43F5E',
      priceLineVisible: true,
    });
    chartRef.current = chart;
    seriesRef.current = areaSeries;
    candleSeriesRef.current = candleSeries;

    const resizeObserver = new ResizeObserver(([entry]) => {
      chart.applyOptions({ width: Math.floor(entry.contentRect.width) });
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !candleSeriesRef.current) return;
    if (points.length) {
      candleSeriesRef.current.setData([]);
      seriesRef.current.setData(points);
      chartRef.current?.timeScale().fitContent();
    } else if (history.length) {
      seriesRef.current.setData([]);
      candleSeriesRef.current.setData(history);
      chartRef.current?.timeScale().fitContent();
    }
  }, [history, points]);

  useEffect(() => {
    let active = true;

    const fetchGiftNifty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/market-data/gift-nifty`,
          { timeout: 8000 },
        );
        if (!active || !response.data?.success) return;

        const seriesPoints = (response.data.series || []).flatMap((series) =>
          (series.data || []).map((point) => {
            const rawTime = Array.isArray(point) ? point[0] : point.x;
            const rawValue = Array.isArray(point) ? point[1] : point.y;
            const timestamp = typeof rawTime === 'number' ? rawTime : Date.parse(rawTime);
            return { time: Math.floor(timestamp / 1000), value: Number(rawValue) };
          }).filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value)),
        );
        const uniquePoints = [...new Map(seriesPoints.map((point) => [point.time, point])).values()]
          .sort((a, b) => a.time - b.time);

        setQuote(response.data);
        setPoints(uniquePoints);
        setHistory(response.data.history || []);
        setError(false);
      } catch {
        if (active) setError(true);
      }
    };

    fetchGiftNifty();
    const intervalId = setInterval(fetchGiftNifty, 20000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const change = Number(quote?.change || 0);
  const changePct = Number(quote?.changePct || 0);
  const hasChartData = points.length > 0 || history.length > 0;
  const previousClose = Number(quote?.previousClose);
  const latestPrice = Number(quote?.price);
  const hasComparison = Number.isFinite(previousClose) && Number.isFinite(latestPrice);
  const comparisonPadding = hasComparison
    ? Math.max(Math.abs(latestPrice - previousClose) * 0.4, latestPrice * 0.0005)
    : 0;
  const comparisonMinimum = hasComparison
    ? Math.min(previousClose, latestPrice) - comparisonPadding
    : 0;
  const comparisonMaximum = hasComparison
    ? Math.max(previousClose, latestPrice) + comparisonPadding
    : 1;
  const comparisonY = (price) => 250 - ((price - comparisonMinimum) / (comparisonMaximum - comparisonMinimum)) * 180;
  const previousCloseY = comparisonY(previousClose);
  const latestPriceY = comparisonY(latestPrice);
  const comparisonColor = latestPrice >= previousClose ? '#10B981' : '#F43F5E';
  const gridValues = [
    comparisonMaximum,
    (comparisonMaximum + comparisonMinimum) / 2,
    comparisonMinimum,
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-800 bg-[#131722] shadow-2xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-[#0E131F] px-4 py-3">
        <div>
          <h3 className="font-bold text-white">GIFT Nifty 50 Index Futures</h3>
          <p className="text-xs text-gray-500">NSE International Exchange · {quote?.expiry || 'Near-month futures'}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-bold text-white">
            {quote ? `${quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : 'Loading quote…'}
          </p>
          {quote && (
            <p className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
            </p>
          )}
        </div>
      </header>
      <div className="relative">
        <div
          ref={containerRef}
          aria-hidden={!hasChartData}
          className={`h-[360px] w-full ${hasChartData ? '' : 'pointer-events-none opacity-0'}`}
        />
        {!hasChartData && hasComparison && (
          <div className="absolute inset-0 px-3 pt-3">
            <svg
              viewBox="0 0 400 360"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Previous close ${previousClose.toFixed(2)} USD, latest quote ${latestPrice.toFixed(2)} USD`}
              className="h-full w-full"
            >
              <defs>
                <linearGradient id="gift-nifty-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={comparisonColor} stopOpacity="0.24" />
                  <stop offset="100%" stopColor={comparisonColor} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {gridValues.map((value, index) => {
                const y = [70, 160, 250][index];
                return (
                  <g key={index}>
                    <line x1="58" x2="380" y1={y} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 5" />
                    <text x="54" y={y + 4} textAnchor="end" fill="#7C8798" fontSize="10">
                      {value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </text>
                  </g>
                );
              })}
              <path
                d={`M 76 ${previousCloseY} L 340 ${latestPriceY} L 340 250 L 76 250 Z`}
                fill="url(#gift-nifty-fill)"
              />
              <path
                d={`M 76 ${previousCloseY} L 340 ${latestPriceY}`}
                fill="none"
                stroke={comparisonColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="76" cy={previousCloseY} r="5" fill={comparisonColor} stroke="#131722" strokeWidth="2" />
              <circle cx="340" cy={latestPriceY} r="6" fill={comparisonColor} stroke="#131722" strokeWidth="2" />
              <text x="76" y={Math.max(22, previousCloseY - 13)} fill="#E2E8F0" fontSize="11" fontWeight="600">
                {previousClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </text>
              <text x="340" y={Math.max(22, latestPriceY - 13)} textAnchor="end" fill="#E2E8F0" fontSize="11" fontWeight="600">
                {latestPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </text>
              <text x="76" y="292" fill="#94A3B8" fontSize="11">Previous close</text>
              <text x="340" y="292" textAnchor="end" fill="#94A3B8" fontSize="11">Latest quote</text>
              <text x="76" y="326" fill="#64748B" fontSize="10">Official quote comparison · NSEIX</text>
            </svg>
          </div>
        )}
        {!hasChartData && !hasComparison && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="max-w-sm text-sm text-gray-500">
              {error ? 'Live GIFT Nifty data is temporarily unavailable.' : 'Connecting to NSEIX market data…'}
            </p>
          </div>
        )}
      </div>
      {history.length > 0 && !points.length && (
        <footer className="border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
          Daily OHLC candles · Official NSEIX Session 2 bhavcopy
        </footer>
      )}
    </section>
  );
};

export default GiftNiftyChart;

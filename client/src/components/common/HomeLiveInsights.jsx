import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowDown, FaArrowUp, FaChartLine, FaLayerGroup, FaShieldAlt } from 'react-icons/fa';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/market-data/home-insights`;

const formatLevel = (value) => value.toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const HomeLiveInsights = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadInsights = async () => {
      try {
        const response = await axios.get(API_URL, { timeout: 10000 });
        if (active && response.data?.success) {
          setData(response.data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    };

    loadInsights();
    const intervalId = setInterval(loadInsights, 60000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const sectors = data?.sectors || [];
  const advancingSectors = sectors.filter((sector) => sector.changePct > 0).length;
  const advanceAngle = sectors.length ? (advancingSectors / sectors.length) * 360 : 0;
  const vix = data?.vix?.price;
  const vixLabel = vix == null ? 'Unavailable' : vix < 15 ? 'LOW VOLATILITY' : vix < 25 ? 'MODERATE VOLATILITY' : 'ELEVATED VOLATILITY';
  const vixColor = vix == null ? 'text-gray-400' : vix < 15 ? 'text-emerald-400' : vix < 25 ? 'text-cyan-300' : 'text-rose-400';
  const pivotRows = data?.pivots ? [
    { label: 'R2', value: data.pivots.r2, type: 'resistance' },
    { label: 'R1', value: data.pivots.r1, type: 'resistance' },
    { label: 'PIVOT', value: data.pivots.pivot, type: 'pivot' },
    { label: 'S1', value: data.pivots.s1, type: 'support' },
    { label: 'S2', value: data.pivots.s2, type: 'support' },
  ] : [];
  const sourceUpdatedAt = data?.nifty?.updatedAt
    ? new Date(data.nifty.updatedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    : null;

  return (
    <section className="border-y border-gray-800 bg-[#0B0F19] py-14" aria-labelledby="home-live-insights-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Market data · auto-refreshes every minute</p>
            <h2 id="home-live-insights-title" className="font-outfit text-2xl font-black text-white md:text-3xl">
              Live Market Intelligence
            </h2>
          </div>
          <div className="text-xs text-gray-500" aria-live="polite">
            {sourceUpdatedAt ? `NIFTY source updated ${sourceUpdatedAt} IST` : error ? 'Market feed unavailable' : 'Connecting to market feeds…'}
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.95fr_0.9fr_1.15fr]">
          <article className="rounded-2xl border border-cyan-400/40 bg-[#111722] p-5 shadow-[0_0_28px_rgba(34,211,238,0.07)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                <FaChartLine className="text-cyan-300" /> Support &amp; Resistance
              </h3>
              <span className="rounded-full border border-gray-700 px-2.5 py-1 text-[10px] font-bold text-gray-400">FLOOR PIVOTS</span>
            </div>
            <div className="space-y-2">
              {pivotRows.length ? pivotRows.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between rounded-lg border-l-[3px] bg-[#0B0F19] px-3.5 py-3 ${
                    row.type === 'resistance' ? 'border-rose-500 text-rose-400' :
                    row.type === 'pivot' ? 'border-cyan-400 text-cyan-300' :
                    'border-emerald-400 text-emerald-400'
                  }`}
                >
                  <span className="text-xs font-black tracking-[0.12em]">{row.label}</span>
                  <span className="font-mono text-lg font-semibold text-gray-100">{formatLevel(row.value)}</span>
                </div>
              )) : (
                <p className="py-12 text-center text-sm text-gray-500">{error ? 'NIFTY data unavailable' : 'Loading daily levels…'}</p>
              )}
            </div>
            <p className="mt-3 text-[11px] text-gray-500">
              NIFTY 50 · Calculated from the previous completed daily candle{data?.pivots?.sourceDate ? ` (${data.pivots.sourceDate})` : ''}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/40 bg-[#111722] p-5 shadow-[0_0_28px_rgba(16,185,129,0.07)]">
            <div className="mb-5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              <FaShieldAlt className="text-emerald-400" /> Risk Engine
            </div>
            <div className="mb-5 flex items-end justify-between gap-3 border-b border-gray-800 pb-5">
              <div>
                <p className="mb-1 text-xs text-gray-500">India VIX</p>
                <p className={`font-mono text-4xl font-black ${vixColor}`}>
                  {vix == null ? '—' : vix.toFixed(2)}
                </p>
              </div>
              <span className={`pb-1 text-xs font-extrabold tracking-[0.12em] ${vixColor}`}>{vixLabel}</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-lg bg-[#0B0F19] px-3 py-2.5">
                <span className="text-sm font-semibold text-emerald-300">Sector breadth</span>
                <span className="text-sm text-gray-200">
                  {sectors.length ? `${advancingSectors}/${sectors.length} advancing` : 'Needs data'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#0B0F19] px-3 py-2.5">
                <span className="text-sm font-semibold text-cyan-300">PCR (OI)</span>
                <span className="text-xs font-bold text-gray-500">Needs data</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#0B0F19] px-3 py-2.5">
                <span className="text-sm font-semibold text-rose-300">FII flow</span>
                <span className="text-xs font-bold text-gray-500">Needs data</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-500">VIX is a volatility input, not a composite risk score.</p>
          </article>

          <article className="rounded-2xl border border-rose-400/40 bg-[#111722] p-5 shadow-[0_0_28px_rgba(244,63,94,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                <FaLayerGroup className="text-gray-200" /> Sector Sentiment
              </h3>
              <span className="rounded-full border border-gray-700 px-2.5 py-1 text-[10px] font-bold text-gray-400">NIFTY INDICES</span>
            </div>
            <div className="mb-5 flex items-center justify-center gap-6 sm:justify-start">
              <div
                className="relative h-28 w-28 shrink-0 rounded-full p-2"
                style={{ background: `conic-gradient(#22c55e 0deg ${advanceAngle}deg, #f43f5e ${advanceAngle}deg 360deg)` }}
                role="img"
                aria-label={`${advancingSectors} of ${sectors.length} sectors advancing`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#0B0F19]">
                  <span className="font-mono text-2xl font-black text-white">{sectors.length ? `${advancingSectors}/${sectors.length}` : '—'}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-500">sectors up</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2"><FaArrowUp className="text-emerald-400" /> Advancing</p>
                <p className="flex items-center gap-2"><FaArrowDown className="text-rose-400" /> Declining</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              {sectors.length ? sectors.map((sector) => {
                const advancing = sector.changePct >= 0;
                return (
                  <div key={sector.key} className="flex items-center justify-between border-t border-gray-800 py-2.5">
                    <span className="text-xs font-semibold text-gray-300">{sector.name}</span>
                    <span className={`flex items-center gap-1 font-mono text-xs font-bold ${advancing ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {advancing ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
                      {Math.abs(sector.changePct).toFixed(2)}%
                    </span>
                  </div>
                );
              }) : (
                <p className="col-span-2 py-5 text-center text-sm text-gray-500">{error ? 'Sector data unavailable' : 'Loading sector data…'}</p>
              )}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">Sector-index daily change · source timestamps vary by index</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default HomeLiveInsights;

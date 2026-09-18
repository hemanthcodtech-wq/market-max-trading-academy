import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaBalanceScale, FaPercentage, FaChartLine,
  FaArrowRight, FaCoins, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa';
import SEO from '../../components/common/SEO';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('position');

  // 1. Position Sizing & Risk Calculator State
  const [capital, setCapital] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1.5);
  const [entryPrice, setEntryPrice] = useState(1650);
  const [stopLoss, setStopLoss] = useState(1620);
  const [targetPrice, setTargetPrice] = useState(1710);

  // Position Sizing Calculations
  const riskAmount = (capital * riskPercent) / 100;
  const perShareRisk = Math.abs(entryPrice - stopLoss);
  const sharesQuantity = perShareRisk > 0 ? Math.floor(riskAmount / perShareRisk) : 0;
  const totalTradeValue = sharesQuantity * entryPrice;
  const perShareReward = Math.abs(targetPrice - entryPrice);
  const potentialProfit = sharesQuantity * perShareReward;
  const riskRewardRatio = perShareRisk > 0 ? (perShareReward / perShareRisk).toFixed(2) : '0.00';

  // 2. Profit & Loss Calculator State
  const [pnlBuyPrice, setPnlBuyPrice] = useState(500);
  const [pnlSellPrice, setPnlSellPrice] = useState(540);
  const [pnlQuantity, setPnlQuantity] = useState(200);
  const [tradeType, setTradeType] = useState('equity'); // equity | fno

  const grossPnl = (pnlSellPrice - pnlBuyPrice) * pnlQuantity;
  const turnover = (pnlBuyPrice + pnlSellPrice) * pnlQuantity;
  // Estimated STT, exchange, and brokerage charges (~0.08% for intraday/F&O)
  const estimatedCharges = +(turnover * 0.0008).toFixed(2);
  const netPnl = +(grossPnl - estimatedCharges).toFixed(2);
  const roiPct = pnlBuyPrice * pnlQuantity > 0 ? +((netPnl / (pnlBuyPrice * pnlQuantity)) * 100).toFixed(2) : 0;

  // 3. Option Payoff Calculator State
  const [optionType, setOptionType] = useState('call'); // call | put
  const [positionType, setPositionType] = useState('buy'); // buy | sell
  const [strikePrice, setStrikePrice] = useState(23500);
  const [premium, setPremium] = useState(120);
  const [lotSize, setLotSize] = useState(25); // NIFTY lot size
  const [numberOfLots, setNumberOfLots] = useState(2);

  const totalOptionQty = lotSize * numberOfLots;
  const totalPremiumPaid = premium * totalOptionQty;
  const callBreakEven = strikePrice + premium;
  const putBreakEven = strikePrice - premium;
  const activeBreakEven = optionType === 'call' ? callBreakEven : putBreakEven;

  // 4. Compounding / Growth Calculator State
  const [compInitial, setCompInitial] = useState(50000);
  const [monthlyReturn, setMonthlyReturn] = useState(5);
  const [monthsDuration, setMonthsDuration] = useState(12);

  const futureValue = compInitial * Math.pow(1 + monthlyReturn / 100, monthsDuration);
  const totalGrowth = futureValue - compInitial;

  return (
    <div className="min-h-screen bg-[#06080e] text-gray-300 font-inter pt-24 pb-20">
      <SEO
        title="Trading Calculators & Tools | MarketMax Trading Academy"
        description="Free institutional trading tools: Position Sizing Calculator, Option Payoff Calculator, Risk-Reward Calculator, and Profit & Loss Estimator."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <FaCalculator /> Quantitative Desk Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
            TRADING TOOLS & <br />
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
              CALCULATORS
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Eliminate guesswork. Compute exact lot sizes, risk-to-reward ratios, and option break-even levels with mathematical precision before placing any order.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#121622] border border-gray-800 shadow-xl">
            {[
              { id: 'position', label: 'Position Sizing & Risk', icon: FaBalanceScale },
              { id: 'pnl', label: 'Profit & Loss', icon: FaCoins },
              { id: 'options', label: 'Option Payoff', icon: FaChartLine },
              { id: 'compounding', label: 'Capital Compounding', icon: FaPercentage },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-[#0B0F19] shadow-md shadow-[#D4AF37]/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CALCULATOR PANELS ── */}
        <div className="max-w-4xl mx-auto">
          {/* TAB 1: Position Sizing & Risk Calculator */}
          {activeTab === 'position' && (
            <div className="glossy-card rounded-3xl p-6 md:p-10 border border-white/10">
              <div className="mb-6 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white font-outfit">Position Size & Risk-Reward Calculator</h3>
                  <p className="text-xs text-gray-400 mt-1">Never risk more than your predefined account percentage on any trade.</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  R:R Rule Enforced
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Total Trading Capital (₹)</label>
                    <input
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Account Risk Per Trade (%)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="flex-1 accent-[#D4AF37]"
                      />
                      <span className="font-mono text-white text-sm font-bold w-12 text-right">{riskPercent}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Entry (₹)</label>
                      <input
                        type="number"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Stop Loss (₹)</label>
                      <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-rose-500/40 text-rose-300 font-mono text-xs focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Target (₹)</label>
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-emerald-500/40 text-emerald-300 font-mono text-xs focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="rounded-2xl bg-gradient-to-br from-[#121828] to-[#090D16] border border-gray-800 p-6 flex flex-col justify-between">
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Total Capital at Risk:</span>
                      <span className="font-mono font-bold text-rose-400 text-sm">₹{riskAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Recommended Shares / Qty:</span>
                      <span className="font-mono font-black text-[#D4AF37] text-lg">{sharesQuantity.toLocaleString('en-IN')} Units</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Total Position Value:</span>
                      <span className="font-mono text-gray-300">₹{totalTradeValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Estimated Profit on Target:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">+₹{potentialProfit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Risk-to-Reward Ratio:</span>
                      <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${+riskRewardRatio >= 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        1 : {riskRewardRatio}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500 text-center">
                    {+riskRewardRatio >= 2 ? '✓ High quality institutional setup with favourable R:R' : '⚠️ Warning: Standard trading rules suggest a minimum 1:2 Risk to Reward'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Profit & Loss Calculator */}
          {activeTab === 'pnl' && (
            <div className="glossy-card rounded-3xl p-6 md:p-10 border border-white/10">
              <div className="mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-xl font-black text-white font-outfit">Profit & Loss Estimator (with Brokerage & STT)</h3>
                <p className="text-xs text-gray-400 mt-1">Compute your net real-world take-home profit after regulatory exchange fees.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Buy Price (₹)</label>
                    <input
                      type="number"
                      value={pnlBuyPrice}
                      onChange={(e) => setPnlBuyPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Sell Price (₹)</label>
                    <input
                      type="number"
                      value={pnlSellPrice}
                      onChange={(e) => setPnlSellPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      value={pnlQuantity}
                      onChange={(e) => setPnlQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#121828] to-[#090D16] border border-gray-800 p-6 flex flex-col justify-between">
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Gross Turnover:</span>
                      <span className="font-mono text-gray-300">₹{turnover.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Gross P&L:</span>
                      <span className={`font-mono font-bold ${grossPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {grossPnl >= 0 ? '+' : ''}₹{grossPnl.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Estimated Taxes & Brokerage:</span>
                      <span className="font-mono text-gray-400">₹{estimatedCharges.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-white text-sm">Net Realized P&L:</span>
                      <span className={`font-mono font-black text-xl ${netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {netPnl >= 0 ? '+' : ''}₹{netPnl.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Return on Capital (ROI):</span>
                      <span className={`font-mono font-bold ${roiPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {roiPct >= 0 ? '+' : ''}{roiPct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Option Payoff Calculator */}
          {activeTab === 'options' && (
            <div className="glossy-card rounded-3xl p-6 md:p-10 border border-white/10">
              <div className="mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-xl font-black text-white font-outfit">Option Payoff & Break-Even Calculator</h3>
                <p className="text-xs text-gray-400 mt-1">Calculate exact break-even points, max risk, and leverage for Indian Index Options.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Option Type</label>
                      <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-gray-700">
                        <button
                          onClick={() => setOptionType('call')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${optionType === 'call' ? 'bg-[#D4AF37] text-[#0B0F19]' : 'text-gray-400'}`}
                        >
                          CALL (CE)
                        </button>
                        <button
                          onClick={() => setOptionType('put')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${optionType === 'put' ? 'bg-[#D4AF37] text-[#0B0F19]' : 'text-gray-400'}`}
                        >
                          PUT (PE)
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Position</label>
                      <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-gray-700">
                        <button
                          onClick={() => setPositionType('buy')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${positionType === 'buy' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
                        >
                          BUY
                        </button>
                        <button
                          onClick={() => setPositionType('sell')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${positionType === 'sell' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                        >
                          SELL
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Strike Price (₹)</label>
                      <input
                        type="number"
                        value={strikePrice}
                        onChange={(e) => setStrikePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Premium (₹)</label>
                      <input
                        type="number"
                        value={premium}
                        onChange={(e) => setPremium(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Lot Size</label>
                      <input
                        type="number"
                        value={lotSize}
                        onChange={(e) => setLotSize(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">No. of Lots</label>
                      <input
                        type="number"
                        value={numberOfLots}
                        onChange={(e) => setNumberOfLots(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#121828] to-[#090D16] border border-gray-800 p-6 flex flex-col justify-between">
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Total Contract Quantity:</span>
                      <span className="font-mono font-bold text-white">{totalOptionQty} Qty</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Total Capital / Premium:</span>
                      <span className="font-mono font-bold text-[#D4AF37]">₹{totalPremiumPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Expiry Break-Even Price:</span>
                      <span className="font-mono font-black text-white text-base">₹{activeBreakEven.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Maximum Potential Loss:</span>
                      <span className="font-mono font-bold text-rose-400">
                        {positionType === 'buy' ? `₹${totalPremiumPaid.toLocaleString('en-IN')} (Premium Paid)` : 'Unlimited without hedge'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Maximum Potential Profit:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {positionType === 'buy' ? 'Unlimited beyond BEP' : `₹${totalPremiumPaid.toLocaleString('en-IN')} (Premium Received)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Compounding Growth Calculator */}
          {activeTab === 'compounding' && (
            <div className="glossy-card rounded-3xl p-6 md:p-10 border border-white/10">
              <div className="mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-xl font-black text-white font-outfit">Capital Compounding & Growth Projection</h3>
                <p className="text-xs text-gray-400 mt-1">Visualize the statistical compounding power of steady monthly gains with zero emotional overtrading.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Starting Capital (₹)</label>
                    <input
                      type="number"
                      value={compInitial}
                      onChange={(e) => setCompInitial(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Realistic Monthly Target Return (%)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="2"
                        max="15"
                        step="1"
                        value={monthlyReturn}
                        onChange={(e) => setMonthlyReturn(Number(e.target.value))}
                        className="flex-1 accent-[#D4AF37]"
                      />
                      <span className="font-mono text-white text-sm font-bold w-12 text-right">{monthlyReturn}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Duration (Months)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="3"
                        max="36"
                        step="3"
                        value={monthsDuration}
                        onChange={(e) => setMonthsDuration(Number(e.target.value))}
                        className="flex-1 accent-[#D4AF37]"
                      />
                      <span className="font-mono text-white text-sm font-bold w-16 text-right">{monthsDuration} Mo</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#121828] to-[#090D16] border border-gray-800 p-6 flex flex-col justify-between">
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Starting Portfolio:</span>
                      <span className="font-mono text-white">₹{compInitial.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Total Capital Accumulated:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">+₹{Math.round(totalGrowth).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-white text-sm">Projected Portfolio Value:</span>
                      <span className="font-mono font-black text-2xl text-[#D4AF37]">
                        ₹{Math.round(futureValue).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Net Percentage Growth:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{Math.round((totalGrowth / compInitial) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-800 text-center">
                    Rule of compounding: Small, consistent edge compound dramatically over 12–24 months without needing high-risk leverage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;

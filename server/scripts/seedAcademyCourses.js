const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Course = require('../models/Course');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sdf_lms';

const academyCourses = [
  {
    title: 'Stock Market Foundation',
    title_te: 'స్టాక్ మార్కెట్ ఫౌండేషన్ కోర్స్',
    slug: 'stock-market-foundation',
    description: 'Master the fundamentals of Indian equities, market mechanics, order types, demat account operations, and financial literacy from ground zero.',
    description_te: 'భారతీయ ఈక్విటీల ప్రాథమిక అంశాలు, మార్కెట్ మెకానిక్స్, ఆర్డర్ రకాలు మరియు డీమ్యాట్ ఖాతా నిర్వహణను సులభంగా నేర్చుకోండి.',
    category: 'Foundation',
    instructor: 'MarketMax Senior Faculty',
    durationMonths: 1,
    level: 'Beginner',
    language: 'English & Telugu',
    price: 1999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Introduction to Financial Markets (NSE & BSE)',
      'Primary vs Secondary Markets (IPO Mechanics)',
      'Order Types: Market, Limit, SL, SL-M, GTT',
      'Corporate Actions: Dividends, Splits, Bonus & Buybacks',
      'Fundamental Factors & Market Cycles'
    ],
    topics_te: [
      'ఫైనాన్షియల్ మార్కెట్స్ పరిచయం (NSE & BSE)',
      'ప్రైమరీ vs సెకండరీ మార్కెట్లు (IPO)',
      'ఆర్డర్ రకాలు: Market, Limit, SL, GTT',
      'కార్పొరేట్ చర్యలు: డివిడెండ్లు, స్ప్లిట్లు',
      'ఫండమెంటల్ అంశాలు & మార్కెట్ సైకిల్స్'
    ],
    whatYouWillLearn: [
      'Understand how stock exchanges and clearing corporations work',
      'Execute buy/sell orders with proper risk limits',
      'Read company balance sheets and key ratios',
      'Avoid beginner pitfalls and emotional traps'
    ],
    isPublished: true,
  },
  {
    title: 'Derivatives – Futures & Options',
    title_te: 'డెరివేటివ్స్ – ఫ్యూచర్స్ & ఆప్షన్స్',
    slug: 'derivatives-futures-options',
    description: 'Comprehensive mastery of Indian derivative contracts. Understand futures pricing, cash-and-carry arbitrage, open interest, and options fundamentals.',
    description_te: 'డెరివేటివ్స్ కాంట్రాక్టులు, ఫ్యూచర్స్ ప్రైసింగ్, ఓపెన్ ఇంట్రెస్ట్ మరియు ఆప్షన్స్ ప్రాథమిక భావనలను సమగ్రంగా నేర్చుకోండి.',
    category: 'Derivatives',
    instructor: 'Lead Derivatives Strategist',
    durationMonths: 2,
    level: 'Intermediate',
    language: 'English & Telugu',
    price: 3999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Forward vs Futures Contracts & Contract Specifications',
      'Futures Margin System (SPAN + Exposure) & Mark to Market',
      'Open Interest (OI) & Volume Interpretation',
      'Introduction to Calls & Puts (Moneyness: ITM, ATM, OTM)',
      'Futures Hedging for Stock Portfolios'
    ],
    topics_te: [
      'ఫ్యూచర్స్ కాంట్రాక్టుల ప్రత్యేకతలు',
      'మార్జిన్ విధానం మరియు మార్క్ టు మార్కెట్',
      'ఓపెన్ ఇంట్రెస్ట్ (OI) మరియు వాల్యూమ్ విశ్లేషణ',
      'కాల్స్ మరియు పుట్స్ పరిచయం',
      'హెడ్జింగ్ వ్యూహాలు'
    ],
    whatYouWillLearn: [
      'Master the mathematics of futures leverage and rollover',
      'Analyze OI build-up to identify long build-up and short covering',
      'Differentiate between buying and selling options contracts',
      'Construct basic risk-hedged futures positions'
    ],
    isPublished: true,
  },
  {
    title: 'NISM Series VIII – Equity Derivatives',
    title_te: 'NISM సిరీస్ VIII – ఈక్విటీ డెరివేటివ్స్ సర్టిఫికేషన్ ప్రిపరేషన్',
    slug: 'nism-series-viii-equity-derivatives',
    description: 'Targeted preparation module for the NISM Series VIII Certification Exam. Includes official syllabus coverage, regulatory frameworks, mock tests, and practice question banks.',
    description_te: 'NISM సిరీస్ VIII సర్టిఫికేషన్ పరీక్ష కోసం సమగ్ర ప్రిపరేషన్ కోర్సు. అధికారిక సిలబస్, మోడల్ పేపర్లు మరియు మాక్ టెస్టులు ఉన్నాయి.',
    category: 'NISM Certification',
    instructor: 'SEBI & NISM Certified Trainer',
    durationMonths: 2,
    level: 'Intermediate',
    language: 'English & Telugu',
    price: 4499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Regulatory Environment (SEBI, SCRA & PMLA Frameworks)',
      'Accounting & Taxation of Derivative Transactions',
      'Clearing, Settlement & Risk Management Protocols',
      'Code of Conduct for Derivative Dealers & Brokers',
      'Full-Length Mock Exams with Explanation Keys'
    ],
    topics_te: [
      'SEBI నిబంధనలు మరియు చట్టపరమైన ఫ్రేమ్‌వర్క్',
      'డెరివేటివ్స్ అకౌంటింగ్ మరియు టాక్సేషన్',
      'క్లియరింగ్, సెటిల్‌మెంట్ & రిస్క్ మేనేజ్‌మెంట్',
      'డీలర్స్ కోడ్ ఆఫ్ కండక్ట్',
      'పూర్తి స్థాయి మోడల్ పరీక్షలు మరియు విశ్లేషణ'
    ],
    whatYouWillLearn: [
      'Clear the NISM Series VIII exam on your first attempt',
      'Master the regulatory and operational guidelines for brokerages',
      'Understand client margins, VaR margins, and liquidation rules',
      'Qualify for professional trading terminal operations'
    ],
    isPublished: true,
  },
  {
    title: 'NISM Series XV – Research Analyst',
    title_te: 'NISM సిరీస్ XV – రీసెర్చ్ అనలిస్ట్ సర్టిఫికేషన్ ప్రిపరేషన్',
    slug: 'nism-series-xv-research-analyst',
    description: 'Curriculum structured for passing NISM Series XV. Learn institutional equity research, financial modeling, macro-economic indicators, qualitative analysis, and valuation methods.',
    description_te: 'NISM సిరీస్ XV రీసెర్చ్ అనలిస్ట్ పరీక్ష కోసం అత్యుత్తమ కోర్సు. ఫైనాన్షియల్ మోడలింగ్, ఈక్విటీ రీసెర్చ్ మరియు కంపెనీ వాల్యుయేషన్ నేర్చుకోండి.',
    category: 'NISM Certification',
    instructor: 'Senior Equity Research Head',
    durationMonths: 2,
    level: 'Advanced',
    language: 'English & Telugu',
    price: 4999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    topics: [
      'SEBI (Research Analysts) Regulations, 2014 & Disclosures',
      'Top-Down Economic, Industry & Company (EIC) Framework',
      'Financial Statement Analysis: Cash Flows, EPS, DCF',
      'Valuation Methodologies: P/E, EV/EBITDA, P/B Multiples',
      'Drafting Institutional Equity Research Reports'
    ],
    topics_te: [
      'SEBI రీసెర్చ్ అనలిస్ట్ నిబంధనలు & నిబంధనలు',
      'EIC ఫ్రేమ్‌వర్క్ (ఎకానమీ, ఇండస్ట్రీ, కంపెనీ)',
      'ఫైనాన్షియల్ స్టేట్‌మెంట్ ఎనాలిసిస్ & క్యాష్ ఫ్లోస్',
      'వాల్యుయేషన్ పద్ధతులు (P/E, DCF, EV/EBITDA)',
      'రీసెర్చ్ రిపోర్ట్ తయారీ'
    ],
    whatYouWillLearn: [
      'Pass NISM-XV certification to qualify as a registered analyst',
      'Perform thorough qualitative and quantitative company audits',
      'Calculate intrinsic enterprise value using DCF & relative ratios',
      'Synthesize macroeconomic indicators into market outlooks'
    ],
    isPublished: true,
  },
  {
    title: 'Technical Analysis',
    title_te: 'టెక్నికల్ అనాలిసిస్ మాస్టరీ',
    slug: 'technical-analysis',
    description: 'Complete technical chart study. Learn trendlines, support/resistance, classical chart patterns, moving averages, RSI, MACD, Fibonacci retracements, and multi-timeframe correlation.',
    description_te: 'ట్రెండ్‌లైన్స్, సపోర్ట్/రెసిస్టెన్స్, చార్ట్ ప్యాటర్న్లు, మూవింగ్ యావరేజెస్, RSI, MACD మరియు మల్టీ-టైమ్‌ఫ్రేమ్ అనాలిసిస్ సంపూర్ణంగా నేర్చుకోండి.',
    category: 'Technical Analysis',
    instructor: 'Certified CMT Professional',
    durationMonths: 2,
    level: 'Beginner to Advanced',
    language: 'English & Telugu',
    price: 3499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Dow Theory, Trend Structure & Market Phases',
      'Dynamic Support & Resistance, Horizontal Zones',
      'Chart Patterns: Head & Shoulders, Double Tops, Flags & Triangles',
      'Leading & Lagging Indicators: RSI Divergence, EMA Clouds, MACD',
      'Multi-Timeframe Top-Down Analysis (Daily -> 1H -> 5M)'
    ],
    topics_te: [
      'డౌ థియరీ మరియు మార్కెట్ దశలు',
      'సపోర్ట్ & రెసిస్టెన్స్ జోన్లు గుర్తించడం',
      'హెడ్ & షోల్డర్స్, ఫ్లాగ్స్ వంటి కీలక చార్ట్ ప్యాటర్న్లు',
      'RSI డైవర్జెన్స్ మరియు ఇండికేటర్ల ఖచ్చితమైన వినియోగం',
      'మల్టీ-టైమ్‌ఫ్రేమ్ విశ్లేషణ పద్ధతులు'
    ],
    whatYouWillLearn: [
      'Identify high-probability market turns before they happen',
      'Detect bullish and bearish momentum divergences with RSI',
      'Plot accurate Fibonacci golden retracement levels (0.5 - 0.618)',
      'Execute objective entries with defined risk-to-reward ratios'
    ],
    isPublished: true,
  },
  {
    title: 'Options Trading Strategies',
    title_te: 'ఆప్షన్స్ ట్రేడింగ్ స్ట్రాటజీస్ & గ్రీక్స్',
    slug: 'options-trading-strategies',
    description: 'Master Options Greeks (Delta, Gamma, Theta, Vega), directional credit spreads, iron condors, straddles, strangles, adjustment playbooks, and IV crush trading.',
    description_te: 'డెల్టా, గామా, తీటా, వేగా వంటి ఆప్షన్ గ్రీక్స్, క్రెడిట్ స్ప్రెడ్స్, ఐరన్ కాండర్ మరియు స్ట్రాటజీ అడ్జస్ట్‌మెంట్లను ప్రాక్టికల్ గా నేర్చుకోండి.',
    category: 'Options Trading',
    instructor: 'Pro Options Desk Trader',
    durationMonths: 2,
    level: 'Advanced',
    language: 'English & Telugu',
    price: 4999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    topics: [
      'The 4 Option Greeks: Delta, Theta Decay, Gamma Risk, Vega',
      'Directional Spreads: Bull Call, Bear Put, Ratio Spreads',
      'Non-Directional Strategies: Short Straddle, Strangle, Iron Condor',
      'Expiry Day Zero-to-Hero & Scalping Setups',
      'Defensive Firefighting: Adjusting Tested Spreads in Live Market'
    ],
    topics_te: [
      'ఆప్షన్ గ్రీక్స్: డెల్టా, తీటా డికే, గామా, వేగా',
      'బుల్ కాల్ & బేర్ పుట్ స్ప్రెడ్స్',
      'ఐరన్ కాండర్ & షార్ట్ స్ట్రాడిల్ స్ట్రాటజీలు',
      'ఎక్స్‌పైరీ డే స్పెషల్ ట్రేడింగ్ సెటప్స్',
      'లైవ్ మార్కెట్ లో ఆప్షన్స్ అడ్జస్ట్‌మెంట్స్'
    ],
    whatYouWillLearn: [
      'Construct defined-risk hedged option positions in NIFTY & BANK NIFTY',
      'Harness theta time decay for consistent weekly cash-flow',
      'Manage gamma risk on expiry days without panic',
      'Defend and repair losing positions to reach break-even'
    ],
    isPublished: true,
  },
  {
    title: 'Risk Management & Trading Psychology',
    title_te: 'రిస్క్ మేనేజ్‌మెంట్ & ట్రేడింగ్ సైకాలజీ',
    slug: 'risk-management-trading-psychology',
    description: 'Transform your mindset from gambler to professional. Master position sizing, drawdown control, risk of ruin, overcoming revenge trading, and emotional discipline.',
    description_te: 'గ్యాంబ్లింగ్ మైండ్‌సెట్ నుండి ప్రొఫెషనల్ ట్రేడర్ గా మారండి. పొజిషన్ సైజింగ్, డ్రాడౌన్ కంట్రోల్ మరియు ఎమోషనల్ డిసిప్లిన్ నేర్చుకోండి.',
    category: 'Risk Management',
    instructor: 'Mindset & Risk Coach',
    durationMonths: 1,
    level: 'All Levels',
    language: 'English & Telugu',
    price: 2499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=80',
    topics: [
      'The 1% - 2% Capital Rule & Position Sizing Formulae',
      'Risk of Ruin Matrix and Maximum Drawdown Ceiling',
      'Trading Biases: FOMO, Greed, Fear, Confirmation & Loss Aversion',
      'Trade Journal Architecture: Auditing Mental Mistakes',
      'Building a Professional Rule-Based Execution Routine'
    ],
    topics_te: [
      '1%-2% క్యాపిటల్ రిస్క్ రూల్ & పొజిషన్ సైజింగ్',
      'డ్రాడౌన్ నివారణ మరియు క్యాపిటల్ ప్రొటెక్షన్',
      'FOMO, దురాశ, భయం వంటి భావోద్వేగాలను నియంత్రించడం',
      'ట్రేడింగ్ జర్నల్ రాయడం మరియు తప్పులను విశ్లేషించడం',
      'నియమబద్ధమైన ట్రేడింగ్ పద్ధతులు'
    ],
    whatYouWillLearn: [
      'Calculate precise lot sizes to never lose more than your predefined risk',
      'Eliminate revenge trading and overtrading completely',
      'Maintain peak focus during high-volatility market sessions',
      'Maintain an analytical trade log that uncovers psychological leaks'
    ],
    isPublished: true,
  },
  {
    title: 'Price Action & Chart Reading',
    title_te: 'ప్రైస్ యాక్షన్ & చార్ట్ రీడింగ్',
    slug: 'price-action-chart-reading',
    description: 'Clean chart trading without lagging indicators. Master Japanese candlestick psychology, liquidity grabs, fair value gaps (FVG), order blocks, and market maker footprints.',
    description_te: 'ఇండికేటర్స్ లేకుండా క్లీన్ చార్ట్ ట్రేడింగ్. క్యాండిల్ స్టిక్స్ సైకాలజీ, లిక్విడిటీ హంట్స్, ఆర్డర్ బ్లాక్స్ మరియు FVG నేర్చుకోండి.',
    category: 'Technical Analysis',
    instructor: 'Price Action Specialist',
    durationMonths: 2,
    level: 'Intermediate',
    language: 'English & Telugu',
    price: 3999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Candlestick Anatomy & Rejection Wicks (Pinbars, Engulfing)',
      'Market Structure: Higher Highs, Higher Lows, CHoCH & BOS',
      'Smart Money Concepts (SMC): Institutional Order Blocks',
      'Fair Value Gaps (FVG) and Imbalance Fill Areas',
      'Liquidity Traps: Identifying Buy-Side & Sell-Side Sweeps'
    ],
    topics_te: [
      'క్యాండిల్ స్టిక్స్ సైకాలజీ మరియు రిజెక్షన్ విక్స్',
      'మార్కెట్ స్ట్రక్చర్: Break of Structure (BOS) & CHoCH',
      'స్మార్ట్ మనీ కాన్సెప్ట్స్ (SMC) & ఆర్డర్ బ్లాక్స్',
      'ఫెయిర్ వాల్యూ గ్యాప్స్ (FVG) విశ్లేషణ',
      'లిక్విడిటీ స్వీప్స్ మరియు ట్రాప్స్ గుర్తించడం'
    ],
    whatYouWillLearn: [
      'Read pure price movement without reliance on any lagging indicator',
      'Spot institutional accumulation and distribution zones',
      'Trade false breakouts alongside institutional smart money',
      'Target high-precision entries with microscopic stop losses'
    ],
    isPublished: true,
  },
  {
    title: 'Intraday Trading',
    title_te: 'ఇంట్రాడే ట్రేడింగ్ మాస్టరీ',
    slug: 'intraday-trading',
    description: 'Master intraday momentum in Indian indices and high-beta equities. Learn opening range breakout (ORB), VWAP reclaim setups, quick scalping, and intraday risk parameters.',
    description_te: 'నిఫ్టీ, బ్యాంక్ నిఫ్టీ మరియు స్టాక్స్ లో ఇంట్రాడే మొమెంటం ట్రేడింగ్. ORB, VWAP సెటప్స్, స్కాల్పింగ్ వ్యూహాలు సులభంగా నేర్చుకోండి.',
    category: 'Intraday Trading',
    instructor: 'Full-time Day Trader',
    durationMonths: 2,
    level: 'Intermediate to Advanced',
    language: 'English & Telugu',
    price: 4499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Pre-Market Routine (9:00 AM - 9:15 AM) & Global Sentiment Scan',
      'Opening Range Breakout (ORB: 5-min & 15-min)',
      'VWAP & Anchor VWAP Pullback Entries',
      'Index Scalping on 1-Minute & 3-Minute Ticks',
      'Strict Intraday Cut-off Times & Daily Loss Kill-Switch'
    ],
    topics_te: [
      'ప్రీ-మార్కెట్ రూటీన్ (9:00 AM - 9:15 AM)',
      'ఓపెనింగ్ రేంజ్ బ్రేక్‌అవుట్ (ORB) సెటప్స్',
      'VWAP పుల్‌బ్యాక్ ఎంట్రీలు',
      '1-నిమిషం & 3-నిమిషాల ఇండెక్స్ స్కాల్పింగ్',
      'ఇంట్రాడే రిస్క్ కంట్రోల్ & కట్-ఆఫ్ సమయాలు'
    ],
    whatYouWillLearn: [
      'Prepare a daily watchlist before 9:15 AM opening bell',
      'Capture intraday trend days with low drawdown',
      'Leverage VWAP as dynamic support and resistance for quick scalps',
      'Protect intraday profits with trailing stop loss rules'
    ],
    isPublished: true,
  },
  {
    title: 'Trading Strategy & Backtesting',
    title_te: 'ట్రేడింగ్ స్ట్రాటజీ డెవలప్‌మెంట్ & బ్యాక్‌టెస్టింగ్',
    slug: 'trading-strategy-backtesting',
    description: 'Build, optimize, and statistically validate your own edge. Master quantitative backtesting, expectancy ratios, maximum drawdown simulation, and algorithmic automation.',
    description_te: 'మీ స్వంత ట్రేడింగ్ స్ట్రాటజీని రూపొందించండి, బ్యాక్‌టెస్ట్ చేయండి. విన్-రేట్, ఎక్స్‌పెక్టెన్సీ మరియు ఆల్గో ఆటోమేషన్ పద్ధతులు నేర్చుకోండి.',
    category: 'Trading Strategy',
    instructor: 'Quant Strategist & Algo Developer',
    durationMonths: 2,
    level: 'Advanced',
    language: 'English & Telugu',
    price: 4999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    topics: [
      'Formulating Quantifiable Trading Rules (Entry, Exit, Filter)',
      'Historical Backtesting on 5+ Years of NSE Tick Data',
      'Key Metric Evaluation: Sharpe Ratio, Win Rate, Profit Factor',
      'Avoiding Overfitting & Curve-Fitting in Strategy Optimization',
      'Introduction to Algo Execution via Broker APIs'
    ],
    topics_te: [
      'నియమబద్ధమైన ట్రేడింగ్ రూల్స్ తయారీ',
      'NSE హిస్టారికల్ డేటాతో బ్యాక్‌టెస్టింగ్',
      'షార్ప్ రేషియో, విన్ రేట్ మరియు ప్రాఫిట్ ఫ్యాక్టర్ విశ్లేషణ',
      'కర్వ్-ఫిట్టింగ్ నివారణ మరియు రియలిస్టిక్ టెస్టింగ్',
      'బ్రోకర్ APIలతో ఆల్గో ఎగ్జిక్యూషన్ పరిచయం'
    ],
    whatYouWillLearn: [
      'Turn intuitive trading ideas into strict, backtestable logic',
      'Statistically prove your trading edge before risking live capital',
      'Compute risk-adjusted returns and drawdown recovery periods',
      'Deploy rule-based mechanical systems with zero emotional hesitation'
    ],
    isPublished: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove existing courses and insert the 10 Trading Academy courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    const created = await Course.insertMany(academyCourses);
    console.log(`Successfully seeded ${created.length} Trading Academy courses:`);
    created.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title} [${c.category}] - ₹${c.price} (${c.slug})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error seeding courses:', err);
    process.exit(1);
  }
}

seed();

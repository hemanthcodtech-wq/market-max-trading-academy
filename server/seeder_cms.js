const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const Blog = require('./models/Blog');
const Ebook = require('./models/Ebook');
const Service = require('./models/Service');

const ARTICLES = [
  {
    title: 'How Smart Money Concepts (SMC) Reveal Institutional Footprints on NSE',
    excerpt: 'Retail traders look at support and resistance lines; banks look at liquidity pools. Discover how Order Blocks and Fair Value Gaps create high-probability intraday turning points in NIFTY.',
    category: 'Price Action',
    readTime: '6 min read',
    author: 'Chief Market Strategist',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    tags: ['SMC', 'NIFTY 50', 'Order Blocks']
  },
  {
    title: 'Why 90% of Option Buyers Lose Money and How to Harvest Theta Decay Like a Pro',
    excerpt: 'Time decay is the silent killer of naked call and put buyers. Learn how constructing defined-risk credit spreads allows you to profit even when the market moves sideways or slightly against you.',
    category: 'Options Trading',
    readTime: '8 min read',
    author: 'Derivatives Desk Lead',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    tags: ['Options Greeks', 'Theta Decay', 'Credit Spreads']
  },
  {
    title: 'The Mathematics of Capital Preservation: Why the 1% Risk Rule Saves Careers',
    excerpt: 'A trader who loses 50% of their account needs a 100% gain just to break even. Explore the statistical Risk of Ruin matrix and how to systematically eliminate revenge trading.',
    category: 'Risk Management',
    readTime: '5 min read',
    author: 'Psychology Coach',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=80',
    tags: ['Capital Preservation', 'Drawdown', 'Discipline']
  }
];

const EBOOKS = [
  {
    title: 'The Price Action Master Playbook',
    subtitle: 'High-Probability Candlestick & Liquidity Structures',
    pages: '124 Pages',
    rating: '4.9/5',
    category: 'Price Action',
    language: 'English & Telugu',
    description: 'A complete breakdown of institutional order blocks, fair value gaps, dynamic market structure, and entry triggers without lagging indicators.',
    topics: ['Candlestick Anatomy', 'Order Blocks & FVG', 'Break of Structure (BOS)', 'High-Probability Entry Triggers'],
    downloadUrl: '#'
  },
  {
    title: 'Options Greeks & Adjustment Handbook',
    subtitle: 'Practical Guide to Delta, Theta Decay & Iron Condors',
    pages: '98 Pages',
    rating: '4.8/5',
    category: 'Derivatives',
    language: 'English & Telugu',
    description: 'Master weekly options selling, credit spreads, theta harvesting, IV crush strategies, and real-time defensive adjustments when trades go wrong.',
    topics: ['The 4 Greeks Explained', 'Directional vs Non-Directional Spreads', 'Expiry Day Playbook', 'Firefighting Tested Adjustments'],
    downloadUrl: '#'
  }
];

const SERVICES = [
  {
    title: 'Premium Calls Group',
    tag: 'High Precision',
    color: 'from-emerald-500/20 to-emerald-950/10',
    borderColor: 'border-emerald-500/30',
    desc: 'Actionable intraday & swing trading setups in NIFTY, BANK NIFTY and high-beta equities with exact entry, stop loss, and tiered target levels.',
    features: [
      'Strict 1:2 to 1:3 Risk-Reward setups',
      'Real-time Telegram & WhatsApp trade alerts',
      'Live SL trailing & target hit updates',
      'Zero gambling — backed by SMC & price action logic'
    ],
    cta: 'Inquire for VIP Access',
    iconName: 'FaSignal'
  },
  {
    title: 'Trading Account Services',
    tag: 'Priority Onboarding',
    color: 'from-blue-500/20 to-blue-950/10',
    borderColor: 'border-blue-500/30',
    desc: 'Hassle-free account opening and setup with India’s top discount brokerages (Zerodha, Dhan, Angel One, Fyers) plus exclusive algorithmic API integrations.',
    features: [
      'Lowest margin & zero AMC account assistance',
      'TradingView webhook and algo terminal linking',
      'Direct priority broker support channels',
      'Pre-configured chart layout and layout templates'
    ],
    cta: 'Open Partner Account',
    iconName: 'FaUserCheck'
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/trade_academy';
    await mongoose.connect(mongoUri);

    console.log('MongoDB Connected...');

    await Blog.deleteMany();
    await Ebook.deleteMany();
    await Service.deleteMany();

    await Blog.insertMany(ARTICLES);
    await Ebook.insertMany(EBOOKS);
    await Service.insertMany(SERVICES);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();

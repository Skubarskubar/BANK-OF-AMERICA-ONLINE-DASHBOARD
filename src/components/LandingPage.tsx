import React, { useState } from 'react';
import {
  Lock,
  Search,
  MapPin,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  Landmark,
  TrendingUp,
  Home,
  Car,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  HelpCircle,
  KeyRound,
  Calculator,
  Building2,
} from 'lucide-react';
import { BankLogo } from './BankLogo';

interface LandingPageProps {
  onLoginSuccess: (username: string) => void;
}

const PRODUCT_TABS = [
  {
    id: 'checking',
    label: 'Checking',
    icon: Landmark,
    headline: 'Bank of America Advantage Banking',
    subhead: 'Flexible checking that grows with you — plus earn a $200 cash offer when you open a new eligible account online.',
    bullets: [
      'No overdraft fees with SafeBalance Banking®',
      'Balance Connect® for overdraft protection',
      'Access to 3,800+ financial centers and 15,000+ ATMs nationwide',
    ],
    cta: 'Explore Checking Solutions',
    badge: '$200 Online Offer',
  },
  {
    id: 'savings',
    label: 'Savings & CDs',
    icon: ShieldCheck,
    headline: 'Grow your savings with confidence',
    subhead: 'Lock in competitive rates with Featured CDs up to 4.50% APY or build automatic savings with Keep the Change®.',
    bullets: [
      'Featured 7-month and 13-month CD terms available',
      'Preferred Rewards members earn a 5% to 20% interest rate booster',
      'FDIC insured up to applicable legal limits',
    ],
    cta: 'Compare Savings & CD Rates',
    badge: 'Up to 4.50% APY',
  },
  {
    id: 'credit-cards',
    label: 'Credit Cards',
    icon: CreditCard,
    headline: 'Customized Cash Rewards — 3% back in the category you choose',
    subhead: 'Earn a $200 online cash rewards bonus after making at least $1,000 in purchases in the first 90 days.',
    bullets: [
      '3% cash back in your choice category: Gas, Online Shopping, Dining, Travel, Drug Stores, or Home Improvement',
      '2% cash back at grocery stores and wholesale clubs',
      '1% unlimited cash back on all other purchases with $0 annual fee',
    ],
    cta: 'Compare All Credit Cards',
    badge: '0% Intro APR for 15 Billing Cycles',
  },
  {
    id: 'home-loans',
    label: 'Home Loans',
    icon: Home,
    headline: 'Digital Mortgage Experience® — simple, fast, guided',
    subhead: 'Apply online at your own pace and get a custom rate quote or prequalification letter in minutes.',
    bullets: [
      'Up to $7,500 in closing cost credits through America’s Home Grant®',
      'Preferred Rewards members save up to $600 on origination fees',
      'Dedicated lending specialists in every state',
    ],
    cta: 'Check Today’s Mortgage Rates',
    badge: 'Low Down Payment Options',
  },
  {
    id: 'auto-loans',
    label: 'Auto Loans',
    icon: Car,
    headline: 'Finance your next vehicle or refinance your current auto loan',
    subhead: 'Know your financing terms before you visit the dealership with an online approval decision in seconds.',
    bullets: [
      'Competitive fixed rates for dealer, private party, and lease buyouts',
      'Up to 0.50% rate discount for Preferred Rewards members',
      'No application fee and no prepayment penalties',
    ],
    cta: 'Calculate Auto Payments',
    badge: 'Decisions in 60 Seconds',
  },
  {
    id: 'investing',
    label: 'Investing',
    icon: TrendingUp,
    headline: 'Merrill® & Bank of America — banking and investing under one roof',
    subhead: 'Trade stocks and ETFs with $0 online commissions or work with an advisor to plan your long-term wealth.',
    bullets: [
      '$0 online stock and ETF trades with Merrill Edge® Self-Directed',
      'Seamless real-time transfers between Bank of America and Merrill accounts',
      'Balances count toward Preferred Rewards tier qualification',
    ],
    cta: 'Explore Merrill Investing',
    badge: 'Up to $1,000 Cash Bonus',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveUserId, setSaveUserId] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeProductTab, setActiveProductTab] = useState('credit-cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showLocatorModal, setShowLocatorModal] = useState(false);
  const [zipSearch, setZipSearch] = useState('28202');

  // Cash Rewards Calculator State
  const [selected3PctCategory, setSelected3PctCategory] = useState('Online Shopping');
  const [monthly3PctSpend, setMonthly3PctSpend] = useState(800);
  const [monthlyGrocerySpend, setMonthlyGrocerySpend] = useState(600);
  const [monthlyOtherSpend, setMonthlyOtherSpend] = useState(1100);
  const [preferredTierMultiplier, setPreferredTierMultiplier] = useState(1.75); // Platinum Honors +75%

  const baseAnnualRewards =
    (monthly3PctSpend * 0.03 + monthlyGrocerySpend * 0.02 + monthlyOtherSpend * 0.01) * 12;
  const boostedAnnualRewards = baseAnnualRewards * preferredTierMultiplier;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const normalizedUser = userId.trim().toLowerCase();
    if (!normalizedUser || !password) {
      setErrorMsg('Please enter both your User ID and Password to sign in.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      if (normalizedUser === 'shawn' && password === 'Pass2235') {
        onLoginSuccess('shawn');
      } else {
        setErrorMsg(
          'The User ID or Password you entered does not match our records. For this replica, please use User ID "shawn" and Password "Pass2235".'
        );
      }
    }, 450);
  };

  const fillDemoCredentials = () => {
    setUserId('shawn');
    setPassword('Pass2235');
    setErrorMsg(null);
  };

  const currentTabInfo =
    PRODUCT_TABS.find((t) => t.id === activeProductTab) || PRODUCT_TABS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8] text-[#1a1a1a] font-sans">
      {/* Top FDIC Official Notice Strip */}
      <div className="bg-[#eceae4] border-b border-gray-300 py-1.5 px-4 text-xs text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#012169] tracking-tight italic text-sm">
              FDIC
            </span>
            <span>
              Bank of America deposit products:{' '}
              <strong className="font-semibold text-gray-900">FDIC Insured</strong> - Backed
              by the full faith and credit of the U.S. Government
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-600">
            <span className="bg-[#012169]/10 text-[#012169] px-2 py-0.5 rounded font-medium">
              Demo Login: User ID <strong>shawn</strong> / Password <strong>Pass2235</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Utility Navigation Bar */}
      <div className="bg-[#f2f2f2] border-b border-gray-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 overflow-x-auto">
          <div className="flex items-center space-x-5 whitespace-nowrap">
            <button className="font-bold text-[#012169] border-b-2 border-[#dc1431] h-9 px-1">
              Personal
            </button>
            <button
              onClick={() => setActiveProductTab('checking')}
              className="text-gray-600 hover:text-[#012169] transition-colors"
            >
              Small Business
            </button>
            <button
              onClick={() => setActiveProductTab('investing')}
              className="text-gray-600 hover:text-[#012169] transition-colors"
            >
              Wealth Management
            </button>
            <button
              onClick={() => setActiveProductTab('home-loans')}
              className="text-gray-600 hover:text-[#012169] transition-colors hidden sm:inline"
            >
              Businesses &amp; Institutions
            </button>
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-gray-600 hover:text-[#012169] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#012169]" />
              Security
            </button>
          </div>

          <div className="flex items-center space-x-4 whitespace-nowrap text-gray-600">
            <button
              onClick={() => setShowLocatorModal(true)}
              className="hover:text-[#012169] flex items-center gap-1 font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#dc1431]" />
              <span>Locations</span>
            </button>
            <button
              onClick={() => setShowForgotModal(true)}
              className="hover:text-[#012169] hidden sm:inline"
            >
              Contact Us
            </button>
            <button
              onClick={() => setShowForgotModal(true)}
              className="hover:text-[#012169] flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
            <span className="text-gray-400">|</span>
            <button className="hover:text-[#012169]">En Español</button>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <a href="#top" className="focus:outline-none">
              <BankLogo />
            </a>
            <button
              onClick={fillDemoCredentials}
              className="sm:hidden text-xs bg-[#dc1431] text-white px-3 py-1.5 rounded font-semibold"
            >
              Fill Shawn Login
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80 md:w-96">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) setSearchModalOpen(true);
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="How can we help you today?"
                className="w-full pl-3.5 pr-10 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:border-[#012169] bg-gray-50/70"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-[#012169] hover:bg-[#00174f] text-white px-3.5 py-2 rounded-r border border-[#012169] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Primary Product Navigation Bar */}
        <nav className="max-w-7xl mx-auto px-4 border-t border-gray-100">
          <ul className="flex items-center overflow-x-auto no-scrollbar -mb-px">
            {PRODUCT_TABS.map((tab) => {
              const isActive = activeProductTab === tab.id;
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    onClick={() => setActiveProductTab(tab.id)}
                    className={`px-4 md:px-5 py-3.5 text-sm md:text-[15px] font-semibold transition-all border-b-3 ${
                      isActive
                        ? 'text-[#012169] border-[#dc1431] bg-blue-50/30'
                        : 'text-gray-700 border-transparent hover:text-[#012169] hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Main Hero Section: Red Sign-In Module (Left) + Promotional Showcase (Right) */}
      <main className="flex-1">
        <div className="bg-gradient-to-b from-white via-white to-[#f5f6f8] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT: Iconic Bank of America Crimson Sign-In Box */}
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
                <div className="bg-[#dc1431] text-white rounded shadow-md overflow-hidden flex-1 flex flex-col justify-between">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <Lock className="w-4 h-4 text-white/90" />
                        <span>Online Banking</span>
                      </h2>
                      <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded font-medium">
                        Secure Sign-In
                      </span>
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="mb-3.5 bg-white text-[#b3001b] p-3 rounded text-xs font-medium flex items-start gap-2 shadow-sm border-l-4 border-[#012169]"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc1431]" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                      <div>
                        <label
                          htmlFor="bofa-userid"
                          className="block text-xs font-semibold uppercase tracking-wider text-white/95 mb-1"
                        >
                          User ID
                        </label>
                        <input
                          id="bofa-userid"
                          type="text"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          placeholder="Enter User ID"
                          autoComplete="username"
                          className="w-full px-3 py-2 bg-white text-gray-900 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#012169] placeholder:text-gray-400"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveUserId}
                            onChange={(e) => setSaveUserId(e.target.checked)}
                            className="rounded border-white/40 text-[#012169] focus:ring-0 w-3.5 h-3.5"
                          />
                          <span className="text-white/95">Save this User ID</span>
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="bofa-password"
                          className="block text-xs font-semibold uppercase tracking-wider text-white/95 mb-1"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="bofa-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            autoComplete="current-password"
                            className="w-full pl-3 pr-9 py-2 bg-white text-gray-900 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#012169] placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full bg-[#012169] hover:bg-[#00164a] active:bg-[#001038] text-white font-bold py-2.5 px-4 rounded text-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{isAuthenticating ? 'Signing In...' : 'Log In'}</span>
                      </button>
                    </form>

                    {/* Quick 1-Click Auto-Fill for Shawn's Credentials */}
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="w-full text-left bg-white/15 hover:bg-white/25 transition-colors rounded px-2.5 py-2 text-xs flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span>
                            Use Demo ID: <strong>shawn</strong> / <strong>Pass2235</strong>
                          </span>
                        </span>
                        <span className="underline font-semibold text-[11px]">Auto-Fill</span>
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-white/95">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="block hover:underline text-left"
                      >
                        Forgot ID/Password?
                      </button>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="hover:underline"
                        >
                          Security &amp; Help
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={fillDemoCredentials}
                          className="hover:underline font-semibold"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA inside Sign-In Box */}
                  <div className="bg-[#b50e26] px-5 py-3 text-xs flex items-center justify-between">
                    <span className="font-medium">New to Online Banking?</span>
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="font-bold underline hover:text-white/90 flex items-center gap-0.5"
                    >
                      <span>Open an Account</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: Featured Hero Banner & Interactive Product Spotlight */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center p-6 md:p-8 gap-6 bg-gradient-to-r from-[#012169]/5 via-white to-[#dc1431]/5 flex-1">
                  {/* Text Offer */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#012169] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{currentTabInfo.badge}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#012169] leading-tight">
                      {currentTabInfo.headline}
                    </h1>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {currentTabInfo.subhead}
                    </p>

                    <ul className="space-y-2 pt-1">
                      {currentTabInfo.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#dc1431] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={fillDemoCredentials}
                        className="bg-[#012169] hover:bg-[#00164a] text-white font-bold text-sm px-5 py-2.5 rounded shadow-sm transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{currentTabInfo.cta}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setUserId('shawn');
                          setPassword('Pass2235');
                          onLoginSuccess('shawn');
                        }}
                        className="border border-[#012169] text-[#012169] hover:bg-[#012169]/5 font-semibold text-sm px-4 py-2.5 rounded transition-colors"
                      >
                        Instant Demo Sign-In as Shawn
                      </button>
                    </div>
                  </div>

                  {/* Realistic Bank of America Cash Rewards Card Graphic */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[310px] aspect-[1.58/1] rounded-xl bg-gradient-to-br from-[#e31837] via-[#c4122d] to-[#8a0a1d] p-5 text-white shadow-xl relative overflow-hidden border border-white/20">
                      {/* Decorative Flag Stripes */}
                      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold tracking-widest text-xs uppercase">
                          BANK OF AMERICA
                        </span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold">
                          Cash Rewards
                        </span>
                      </div>

                      {/* EMV Gold Chip */}
                      <div className="my-4 flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-amber-600/40 shadow-inner flex items-center justify-center">
                          <div className="w-6 h-4 border border-amber-700/40 rounded-xs" />
                        </div>
                        <div className="text-white/80 text-xs font-mono tracking-widest">
                          ))))
                        </div>
                      </div>

                      <div className="font-mono text-sm sm:text-base tracking-[0.18em] text-white/95 mb-3">
                        4465 •••• •••• 7312
                      </div>

                      <div className="flex items-end justify-between text-[11px]">
                        <div>
                          <div className="text-[9px] uppercase text-white/70">Cardholder</div>
                          <div className="font-semibold tracking-wider uppercase">
                            SHAWN ANDERSON
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold italic text-base leading-none tracking-tight">
                            VISA
                          </div>
                          <div className="text-[9px] text-white/80">Signature</div>
                        </div>
                      </div>
                    </div>

                    {/* Offer Highlight Pill */}
                    <div className="mt-4 text-center">
                      <div className="text-xs font-bold text-[#012169]">
                        $200 Online Cash Rewards Bonus Offer
                      </div>
                      <div className="text-[11px] text-gray-500">
                        No annual fee • Contactless chip enabled
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4-Column Quick Rates & Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200 bg-gray-50/70">
                  <button
                    onClick={() => setActiveProductTab('checking')}
                    className="p-3.5 text-left hover:bg-white transition-colors"
                  >
                    <div className="text-xs font-bold text-[#012169] flex items-center justify-between">
                      <span>Advantage Checking</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dc1431]" />
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">$200 Bonus</div>
                    <div className="text-[11px] text-gray-500">Online new account offer</div>
                  </button>

                  <button
                    onClick={() => setActiveProductTab('savings')}
                    className="p-3.5 text-left hover:bg-white transition-colors"
                  >
                    <div className="text-xs font-bold text-[#012169] flex items-center justify-between">
                      <span>Featured CDs</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dc1431]" />
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">4.50% APY</div>
                    <div className="text-[11px] text-gray-500">7-month fixed term CD</div>
                  </button>

                  <button
                    onClick={() => setActiveProductTab('credit-cards')}
                    className="p-3.5 text-left hover:bg-white transition-colors"
                  >
                    <div className="text-xs font-bold text-[#012169] flex items-center justify-between">
                      <span>Custom Cash Card</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dc1431]" />
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">3% Cash Back</div>
                    <div className="text-[11px] text-gray-500">In your choice category</div>
                  </button>

                  <button
                    onClick={() => setActiveProductTab('investing')}
                    className="p-3.5 text-left hover:bg-white transition-colors"
                  >
                    <div className="text-xs font-bold text-[#012169] flex items-center justify-between">
                      <span>Merrill Edge®</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dc1431]" />
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">$0 Trades</div>
                    <div className="text-[11px] text-gray-500">Online stock &amp; ETF trades</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Customized Cash Rewards Estimator Section */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#dc1431] mb-1">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Rewards Estimator</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#012169]">
                  See how much Cash Back you can earn with Preferred Rewards®
                </h2>
                <p className="text-sm text-gray-600">
                  Choose your 3% category and adjust your monthly spending to calculate your annual cash rewards.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">Preferred Rewards Booster:</span>
                <select
                  value={preferredTierMultiplier}
                  onChange={(e) => setPreferredTierMultiplier(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1.5 text-xs font-bold text-[#012169] bg-blue-50/40"
                >
                  <option value={1}>Standard (No Booster)</option>
                  <option value={1.25}>Gold (+25% Rewards)</option>
                  <option value={1.5}>Platinum (+50% Rewards)</option>
                  <option value={1.75}>Platinum Honors (+75% Rewards)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    1. Select Your 3% Choice Category (Changeable once each month):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Online Shopping',
                      'Dining',
                      'Travel',
                      'Gas & EV Charging',
                      'Home Improvement',
                      'Drug Stores',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelected3PctCategory(cat)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                          selected3PctCategory === cat
                            ? 'bg-[#012169] text-white border-[#012169]'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-[#012169]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>3% Category ({selected3PctCategory}) Monthly Spend</span>
                      <span className="text-[#012169] font-bold">${monthly3PctSpend}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2500}
                      step={50}
                      value={monthly3PctSpend}
                      onChange={(e) => setMonthly3PctSpend(Number(e.target.value))}
                      className="w-full accent-[#dc1431]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>2% Grocery Stores &amp; Wholesale Clubs Monthly Spend</span>
                      <span className="text-[#012169] font-bold">${monthlyGrocerySpend}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={monthlyGrocerySpend}
                      onChange={(e) => setMonthlyGrocerySpend(Number(e.target.value))}
                      className="w-full accent-[#dc1431]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>1% All Other Everyday Purchases Monthly Spend</span>
                      <span className="text-[#012169] font-bold">${monthlyOtherSpend}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={4000}
                      step={100}
                      value={monthlyOtherSpend}
                      onChange={(e) => setMonthlyOtherSpend(Number(e.target.value))}
                      className="w-full accent-[#012169]"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#012169] to-[#001542] text-white rounded-lg p-6 shadow-md">
                <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  Estimated First-Year Value (Including $200 Bonus)
                </div>
                <div className="text-4xl font-extrabold mt-2 text-white">
                  ${(boostedAnnualRewards + 200).toFixed(2)}
                </div>
                <div className="mt-4 pt-4 border-t border-white/15 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Base Annual Cash Rewards:</span>
                    <span className="font-semibold">${baseAnnualRewards.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Preferred Rewards Bonus Boost:</span>
                    <span className="font-semibold text-emerald-300">
                      +${(boostedAnnualRewards - baseAnnualRewards).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">New Cardmember Online Bonus:</span>
                    <span className="font-semibold text-amber-300">+$200.00</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="mt-5 w-full bg-[#dc1431] hover:bg-[#b50e26] text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
                >
                  Sign In as Shawn to View Your Active Rewards
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Information Grid: Mobile App, Erica®, Financial Centers */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#012169]/10 text-[#012169] flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#012169] mb-2">
                  Meet Erica®, your virtual financial assistant
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get personalized insights, track recurring subscriptions, check your FICO® Score for free, and transfer money with Zelle® right inside Online Banking.
                </p>
              </div>
              <button
                onClick={fillDemoCredentials}
                className="mt-4 text-xs font-bold text-[#012169] hover:underline flex items-center gap-1"
              >
                <span>Try Erica® Inside Shawn’s Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#dc1431]/10 text-[#dc1431] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#012169] mb-2">
                  Total Security Protection®
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  With our $0 Liability Guarantee, you’re not responsible for unauthorized transactions on your consumer debit or credit cards when reported promptly.
                </p>
              </div>
              <button
                onClick={() => setShowForgotModal(true)}
                className="mt-4 text-xs font-bold text-[#012169] hover:underline flex items-center gap-1"
              >
                <span>Explore the Security Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#012169]/10 text-[#012169] flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#012169] mb-2">
                  Connect with us in person
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Find a nearby Financial Center or ATM, or schedule an appointment to meet one-on-one with a specialist on your schedule.
                </p>
              </div>
              <button
                onClick={() => setShowLocatorModal(true)}
                className="mt-4 text-xs font-bold text-[#012169] hover:underline flex items-center gap-1"
              >
                <span>Find a Location or Schedule an Appointment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Authentic Bank of America Footer */}
      <footer className="bg-[#012169] text-white pt-10 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <BankLogo variant="white" />
            <div className="flex flex-wrap gap-4 text-white/85">
              <button onClick={() => setShowLocatorModal(true)} className="hover:underline">
                Locations
              </button>
              <button onClick={() => setShowForgotModal(true)} className="hover:underline">
                Contact Us
              </button>
              <button onClick={() => setShowForgotModal(true)} className="hover:underline">
                Help &amp; Support
              </button>
              <button onClick={() => setShowForgotModal(true)} className="hover:underline">
                Accessible Banking
              </button>
              <button onClick={() => setShowForgotModal(true)} className="hover:underline">
                Privacy &amp; Security
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded p-4 text-[11px] text-white/90 leading-relaxed space-y-2">
            <div className="font-bold text-white">
              Investment and insurance products:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-semibold text-white">
              <div className="border border-white/25 rounded p-2 text-center">
                Are Not FDIC Insured
              </div>
              <div className="border border-white/25 rounded p-2 text-center">
                Are Not Bank Guaranteed
              </div>
              <div className="border border-white/25 rounded p-2 text-center">
                May Lose Value
              </div>
            </div>
          </div>

          <div className="text-[11px] text-white/75 space-y-1.5">
            <p>
              Bank of America, N.A. Member FDIC. Equal Housing Lender. © 2025 Bank of America
              Corporation. All rights reserved.
            </p>
            <p>
              Demo Environment Note: Sign in with User ID <strong>shawn</strong> and Password{' '}
              <strong>Pass2235</strong> to access the interactive Online Banking portal.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal: Help / Forgot ID & Password */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-[#012169] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#dc1431]" />
                <span>Online Banking Sign-In Help</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-sm text-gray-700">
              <p>
                This interactive Bank of America replica is configured with the following
                credentials:
              </p>
              <div className="bg-gray-100 p-3.5 rounded border border-gray-300 font-mono text-xs space-y-1">
                <div>
                  <span className="text-gray-500">User ID:</span>{' '}
                  <strong className="text-[#012169]">shawn</strong>
                </div>
                <div>
                  <span className="text-gray-500">Password:</span>{' '}
                  <strong className="text-[#dc1431]">Pass2235</strong>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  fillDemoCredentials();
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-[#012169] text-white rounded hover:bg-[#00164a]"
              >
                Auto-Fill &amp; Return to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Financial Center & ATM Locator */}
      {showLocatorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-[#012169] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dc1431]" />
                <span>Find a Financial Center or ATM</span>
              </h3>
              <button
                onClick={() => setShowLocatorModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipSearch}
                  onChange={(e) => setZipSearch(e.target.value)}
                  placeholder="Enter ZIP code or city"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <button className="bg-[#012169] text-white px-4 py-2 rounded text-xs font-bold">
                  Search
                </button>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                <div className="p-3 border border-gray-200 rounded bg-gray-50 flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-[#012169]">
                      Bank of America Corporate Center Branch
                    </div>
                    <div className="text-xs text-gray-600">
                      100 N Tryon St, Charlotte, NC {zipSearch || '28202'}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Open Today • Lobby 9:00 AM – 5:00 PM • 24-Hr Drive-Up ATM
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">0.4 mi</span>
                </div>
                <div className="p-3 border border-gray-200 rounded bg-gray-50 flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-[#012169]">
                      South End Financial Center &amp; Merrill Office
                    </div>
                    <div className="text-xs text-gray-600">
                      1520 South Blvd, Charlotte, NC {zipSearch || '28203'}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Open Today • Cardless ATM &amp; Safe Deposit Boxes
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">1.2 mi</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLocatorModal(false)}
                className="px-4 py-2 text-xs font-bold bg-[#012169] text-white rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-[#012169]">
                Help Results for “{searchQuery}”
              </h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs text-gray-700 space-y-2">
              <p className="font-semibold text-gray-900">Top matching topics:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Sign in to Shawn’s Online Banking dashboard (User ID: shawn)</li>
                <li>Send &amp; receive money with Zelle® with zero transfer fees</li>
                <li>View routing number (026009593) and direct deposit forms</li>
                <li>Redeem Customized Cash Rewards into Checking or Savings</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSearchModalOpen(false)}
                className="px-4 py-1.5 bg-[#012169] text-white text-xs font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  LogOut,
  Bell,
  ShieldCheck,
  ArrowRightLeft,
  Send,
  FileText,
  Sparkles,
  Search,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  ChevronRight,
  DollarSign,
  PlusCircle,
  Calendar,
  Filter,
} from 'lucide-react';
import { BankLogo } from './BankLogo';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BILLS,
  STATEMENTS_LIST,
  BankAccount,
  Transaction,
  ScheduledBill,
} from '../data/mockBankingData';

interface DashboardProps {
  username: string;
  onSignOut: () => void;
}

type NavTab = 'accounts' | 'transfer' | 'rewards' | 'security' | 'statements';

export const Dashboard: React.FC<DashboardProps> = ({ username, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('accounts');
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [bills, setBills] = useState<ScheduledBill[]>(INITIAL_BILLS);

  // Selected Account for ledger filter
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [txSearch, setTxSearch] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('All');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);

  // Transfer State
  const [fromAccountId, setFromAccountId] = useState('acc-checking');
  const [toAccountId, setToAccountId] = useState('acc-savings');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);

  // Zelle State
  const [zelleRecipient, setZelleRecipient] = useState('Michael Carter (michael.c@email.com)');
  const [zelleAmount, setZelleAmount] = useState('');
  const [zelleNote, setZelleNote] = useState('Dinner split');
  const [zelleFeedback, setZelleFeedback] = useState<string | null>(null);

  // Cash Rewards & BankAmeriDeals State
  const [cashRewardsBalance, setCashRewardsBalance] = useState(348.65);
  const [choiceCategory, setChoiceCategory] = useState('Online Shopping');
  const [rewardsFeedback, setRewardsFeedback] = useState<string | null>(null);
  const [deals, setDeals] = useState([
    { id: 'd1', brand: 'Starbucks', offer: '10% Cash Back', expires: '14 days left', added: true },
    { id: 'd2', brand: 'Home Depot', offer: '5% Cash Back (up to $25)', expires: '21 days left', added: false },
    { id: 'd3', brand: 'Chipotle', offer: '10% Cash Back', expires: '9 days left', added: true },
    { id: 'd4', brand: 'Marriott Bonvoy', offer: '$50 Back on $250+', expires: '29 days left', added: false },
  ]);

  // Erica Assistant Drawer State
  const [ericaOpen, setEricaOpen] = useState(false);
  const [ericaInput, setEricaInput] = useState('');
  const [ericaMessages, setEricaMessages] = useState<
    { sender: 'erica' | 'user'; text: string }[]
  >([
    {
      sender: 'erica',
      text: 'Hi Shawn! I’m Erica®, your virtual financial assistant. You have $142,650.75 in total Bank of America deposits and $348.65 in redeemable Cash Rewards. How can I help you today?',
    },
  ]);

  // Statement Preview Modal
  const [previewStatement, setPreviewStatement] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);

  // Totals calculation
  const totalDeposits = useMemo(
    () =>
      accounts
        .filter((a) => a.type === 'checking' || a.type === 'savings')
        .reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );

  const totalInvestments = useMemo(
    () =>
      accounts
        .filter((a) => a.type === 'investment')
        .reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );

  const totalCreditDebt = useMemo(
    () =>
      accounts
        .filter((a) => a.type === 'credit')
        .reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );

  const netWorth = totalDeposits + totalInvestments - totalCreditDebt;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesAccount =
        selectedAccountId === 'all' || tx.accountId === selectedAccountId;
      const matchesQuery =
        !txSearch.trim() ||
        tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.category.toLowerCase().includes(txSearch.toLowerCase());
      const matchesCategory =
        txCategoryFilter === 'All' || tx.category === txCategoryFilter;
      return matchesAccount && matchesQuery && matchesCategory;
    });
  }, [transactions, selectedAccountId, txSearch, txCategoryFilter]);

  // Internal Transfer Handler
  const handleInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferFeedback(null);
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferFeedback('Please enter a valid dollar amount greater than $0.00.');
      return;
    }
    if (fromAccountId === toAccountId) {
      setTransferFeedback('Please choose two different accounts for your transfer.');
      return;
    }

    const sourceAcc = accounts.find((a) => a.id === fromAccountId);
    const destAcc = accounts.find((a) => a.id === toAccountId);
    if (!sourceAcc || !destAcc) return;

    if (sourceAcc.balance < amt) {
      setTransferFeedback('Insufficient available funds in the selected source account.');
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccountId) {
          return {
            ...acc,
            balance: acc.balance - amt,
            availableBalance: acc.availableBalance - amt,
          };
        }
        if (acc.id === toAccountId) {
          // If paying credit card, reduce credit card balance owed
          if (acc.type === 'credit') {
            return {
              ...acc,
              balance: Math.max(0, acc.balance - amt),
              availableBalance: acc.availableBalance + amt,
            };
          }
          return {
            ...acc,
            balance: acc.balance + amt,
            availableBalance: acc.availableBalance + amt,
          };
        }
        return acc;
      })
    );

    const memoSuffix = transferMemo.trim() ? ` - ${transferMemo.trim().toUpperCase()}` : '';
    const newTxOut: Transaction = {
      id: `tx-${Date.now()}-1`,
      accountId: fromAccountId,
      date: 'Just Now',
      description: `ONLINE TRANSFER TO ${destAcc.name.toUpperCase()}${memoSuffix}`,
      category: 'Transfers',
      amount: -amt,
      status: 'Posted',
    };
    const newTxIn: Transaction = {
      id: `tx-${Date.now()}-2`,
      accountId: toAccountId,
      date: 'Just Now',
      description: `ONLINE TRANSFER FROM ${sourceAcc.name.toUpperCase()}${memoSuffix}`,
      category: 'Transfers',
      amount: amt,
      status: 'Posted',
    };

    setTransactions((prev) => [newTxOut, newTxIn, ...prev]);
    setTransferAmount('');
    setTransferMemo('');
    setTransferFeedback(
      `Confirmation #BOFA-${Math.floor(100000 + Math.random() * 900000)}: Successfully transferred ${formatCurrency(amt)} from ${sourceAcc.name} to ${destAcc.name}.`
    );
  };

  // Zelle Payment Handler
  const handleZelleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setZelleFeedback(null);
    const amt = parseFloat(zelleAmount);
    if (isNaN(amt) || amt <= 0) {
      setZelleFeedback('Please enter a valid Zelle® amount.');
      return;
    }

    const checking = accounts.find((a) => a.id === 'acc-checking');
    if (!checking || checking.balance < amt) {
      setZelleFeedback('Insufficient funds in Advantage Plus Banking (•••• 4829).');
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === 'acc-checking'
          ? {
              ...acc,
              balance: acc.balance - amt,
              availableBalance: acc.availableBalance - amt,
            }
          : acc
      )
    );

    const newZelleTx: Transaction = {
      id: `tx-zelle-${Date.now()}`,
      accountId: 'acc-checking',
      date: 'Just Now',
      description: `ZELLE PAYMENT TO ${zelleRecipient.split('(')[0].trim().toUpperCase()} (${zelleNote.toUpperCase()})`,
      category: 'Transfers',
      amount: -amt,
      status: 'Posted',
    };

    setTransactions((prev) => [newZelleTx, ...prev]);
    setZelleAmount('');
    setZelleFeedback(
      `Zelle® payment of ${formatCurrency(amt)} sent to ${zelleRecipient} immediately.`
    );
  };

  // Pay Scheduled Bill Handler
  const handlePayBillNow = (bill: ScheduledBill) => {
    if (bill.status === 'Paid') return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === 'acc-checking'
          ? {
              ...acc,
              balance: acc.balance - bill.amount,
              availableBalance: acc.availableBalance - bill.amount,
            }
          : acc
      )
    );
    setBills((prev) =>
      prev.map((b) => (b.id === bill.id ? { ...b, status: 'Paid' } : b))
    );
    const billTx: Transaction = {
      id: `tx-bill-${Date.now()}`,
      accountId: 'acc-checking',
      date: 'Just Now',
      description: `BILL PAY: ${bill.payee.toUpperCase()}`,
      category: 'Utilities',
      amount: -bill.amount,
      status: 'Posted',
    };
    setTransactions((prev) => [billTx, ...prev]);
  };

  // Redeem Cash Rewards Handler
  const handleRedeemRewards = () => {
    if (cashRewardsBalance <= 0) return;
    const redeemed = cashRewardsBalance;
    setCashRewardsBalance(0);
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === 'acc-checking'
          ? {
              ...acc,
              balance: acc.balance + redeemed,
              availableBalance: acc.availableBalance + redeemed,
            }
          : acc
      )
    );
    const rewardTx: Transaction = {
      id: `tx-rew-${Date.now()}`,
      accountId: 'acc-checking',
      date: 'Just Now',
      description: 'BOFA CUSTOMIZED CASH REWARDS REDEMPTION (+75% PLATINUM HONORS BONUS)',
      category: 'Rewards & Cash Back',
      amount: redeemed,
      status: 'Posted',
    };
    setTransactions((prev) => [rewardTx, ...prev]);
    setRewardsFeedback(
      `Success! ${formatCurrency(redeemed)} has been deposited directly into your Advantage Plus Banking (•••• 4829) account.`
    );
  };

  // Toggle Card Lock
  const toggleCardLock = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, cardLocked: !acc.cardLocked } : acc
      )
    );
  };

  // Erica Chat Handler
  const handleEricaSubmit = (questionText?: string) => {
    const query = (questionText ?? ericaInput).trim();
    if (!query) return;

    const qLower = query.toLowerCase();
    let reply =
      'I can help you check your balances, routing number (026009593), FICO® Score (812), or transfer money between your accounts.';

    if (qLower.includes('balance') || qLower.includes('checking')) {
      const chk = accounts.find((a) => a.id === 'acc-checking');
      const sav = accounts.find((a) => a.id === 'acc-savings');
      reply = `Your Advantage Plus Checking (•••• 4829) has ${formatCurrency(
        chk?.balance || 0
      )} and your Advantage Savings (•••• 9104) has ${formatCurrency(sav?.balance || 0)}.`;
    } else if (qLower.includes('routing') || qLower.includes('account number')) {
      reply =
        'Your Bank of America ABA Routing Number for electronic & ACH transfers is 026009593. Your Checking account number is 3810 4920 4829.';
    } else if (qLower.includes('fico') || qLower.includes('credit score')) {
      reply =
        'Your latest TransUnion® FICO® Score 8 is 812 (Exceptional), updated May 2025. Your credit utilization is only 6.5%.';
    } else if (qLower.includes('reward') || qLower.includes('cash back')) {
      reply = `You currently have ${formatCurrency(
        cashRewardsBalance
      )} in Customized Cash Rewards, boosted by +75% as a Preferred Rewards Platinum Honors member.`;
    }

    setEricaMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'erica', text: reply },
    ]);
    setEricaInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f5f8] text-gray-900 font-sans">
      {/* Top FDIC & Security Status Strip */}
      <div className="bg-[#012169] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Online Banking Session Encrypted</span>
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-blue-100">
              Preferred Rewards® <strong>Platinum Honors</strong> Member
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-100">
              Signed in as: <strong className="text-white uppercase">{username}</strong> (Shawn Anderson)
            </span>
          </div>
        </div>
      </div>

      {/* Main Authenticated Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('accounts');
                setSelectedAccountId('all');
              }}
              className="focus:outline-none text-left"
            >
              <BankLogo />
            </button>
            <span className="hidden md:inline-block h-6 w-px bg-gray-300" />
            <div className="hidden md:block">
              <div className="text-xs font-bold text-[#012169] uppercase tracking-wider">
                Personal &amp; Wealth Management
              </div>
              <div className="text-[11px] text-gray-500">
                Last sign-in: Today at 9:14 AM ET from Charlotte, NC
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setEricaOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#dc1431]/10 hover:bg-[#dc1431]/20 text-[#dc1431] px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Erica®</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-[#012169]" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="bg-[#dc1431] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                2
              </span>
            </button>

            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 bg-[#012169] hover:bg-[#00164a] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Authenticated Primary Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-100">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar -mb-px">
            {[
              { id: 'accounts', label: 'Accounts', icon: DollarSign },
              { id: 'transfer', label: 'Pay & Transfer (Zelle®)', icon: ArrowRightLeft },
              { id: 'rewards', label: 'Rewards & Deals', icon: Award },
              { id: 'security', label: 'Security & FICO® Score', icon: ShieldCheck },
              { id: 'statements', label: 'Statements & Documents', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-3 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#dc1431] text-[#012169] bg-blue-50/40'
                      : 'border-transparent text-gray-600 hover:text-[#012169] hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Welcome & Net Worth Summary Bar */}
      <div className="bg-gradient-to-r from-[#012169] via-[#062d89] to-[#012169] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Preferred Rewards Platinum Honors • +75% Rewards Bonus Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, Shawn Anderson
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                User ID: <span className="font-mono font-semibold text-white">shawn</span> • All
                accounts in good standing
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white/10 p-4 rounded-lg border border-white/15 backdrop-blur-xs">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-200">
                  Total Cash Deposits
                </div>
                <div className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {formatCurrency(totalDeposits)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-200">
                  Merrill® Investments
                </div>
                <div className="text-lg sm:text-xl font-extrabold mt-0.5 text-emerald-300">
                  {formatCurrency(totalInvestments)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-200">
                  Credit Card Balance
                </div>
                <div className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {formatCurrency(totalCreditDebt)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-amber-200">
                  Total Relationship
                </div>
                <div className="text-lg sm:text-xl font-extrabold mt-0.5 text-white">
                  {formatCurrency(netWorth)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {/* TAB 1: ACCOUNTS & ACTIVITY LEDGER */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Account Cards */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#012169] uppercase tracking-wider">
                  Your Accounts
                </h2>
                <button
                  onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                  className="text-xs font-semibold text-[#012169] hover:underline flex items-center gap-1"
                >
                  {showAccountNumbers ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Mask Account #</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal Account &amp; Routing #</span>
                    </>
                  )}
                </button>
              </div>

              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() =>
                      setSelectedAccountId(isSelected ? 'all' : acc.id)
                    }
                    className={`bg-white rounded-lg border transition-all cursor-pointer p-5 shadow-xs ${
                      isSelected
                        ? 'border-[#012169] ring-2 ring-[#012169]/20'
                        : 'border-gray-200 hover:border-[#012169]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#dc1431]">
                            {acc.type === 'checking' && 'Personal Checking'}
                            {acc.type === 'savings' && 'High-Yield Savings'}
                            {acc.type === 'credit' && 'Visa Signature® Card'}
                            {acc.type === 'investment' && 'Merrill Edge® Investing'}
                          </span>
                          {acc.cardLocked && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              CARD LOCKED
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#012169] mt-0.5">
                          {acc.name}
                        </h3>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          {showAccountNumbers
                            ? `Acct: ${acc.fullAccountNumber} ${
                                acc.routingNumber !== 'N/A'
                                  ? `• ABA Routing: ${acc.routingNumber}`
                                  : ''
                              }`
                            : acc.accountNumberMasked}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-gray-900">
                          {formatCurrency(acc.balance)}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {acc.type === 'credit'
                            ? `Available Credit: ${formatCurrency(acc.availableBalance)}`
                            : `Available Balance • ${acc.interestRate}`}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#012169] flex items-center gap-1">
                        <span>
                          {isSelected ? 'Showing Only This Account' : 'Filter Activity'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setFromAccountId(
                              acc.type === 'credit' ? 'acc-checking' : acc.id
                            );
                            setToAccountId(
                              acc.type === 'credit' ? acc.id : 'acc-savings'
                            );
                            setActiveTab('transfer');
                          }}
                          className="text-[#012169] hover:underline font-semibold"
                        >
                          {acc.type === 'credit' ? 'Make Payment' : 'Transfer'}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setActiveTab('statements')}
                          className="text-gray-600 hover:text-[#012169] font-medium"
                        >
                          Statements
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Rewards Card */}
              <div className="bg-gradient-to-br from-[#dc1431] to-[#9e0b22] text-white rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-white/85">
                      Customized Cash Rewards Available
                    </div>
                    <div className="text-2xl font-extrabold mt-1">
                      {formatCurrency(cashRewardsBalance)}
                    </div>
                    <div className="text-xs text-white/85 mt-1">
                      3% Choice Category: <strong>{choiceCategory}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className="bg-white text-[#dc1431] hover:bg-gray-100 px-3.5 py-2 rounded text-xs font-bold shadow-xs"
                  >
                    Redeem Cash
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Transactions & Activity Feed */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-lg font-bold text-[#012169]">
                      Recent Transactions &amp; Activity
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedAccountId === 'all'
                        ? 'Showing activity across all Shawn Anderson accounts'
                        : `Filtered by: ${
                            accounts.find((a) => a.id === selectedAccountId)?.name
                          }`}
                    </p>
                  </div>

                  {selectedAccountId !== 'all' && (
                    <button
                      onClick={() => setSelectedAccountId('all')}
                      className="text-xs font-bold text-[#dc1431] hover:underline self-start sm:self-auto"
                    >
                      Show All Accounts
                    </button>
                  )}
                </div>

                {/* Search & Category Filter Bar */}
                <div className="py-3 flex flex-col sm:flex-row gap-2.5 border-b border-gray-100">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      placeholder="Search by merchant, payroll, Zelle, or amount..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#012169]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-500" />
                    <select
                      value={txCategoryFilter}
                      onChange={(e) => setTxCategoryFilter(e.target.value)}
                      className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium text-gray-700"
                    >
                      <option value="All">All Categories</option>
                      <option value="Payroll & Income">Payroll &amp; Income</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Transfers">Transfers &amp; Zelle®</option>
                      <option value="Dining & Restaurants">Dining</option>
                      <option value="Travel">Travel</option>
                      <option value="Online Shopping">Online Shopping</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
                  {filteredTransactions.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500">
                      No transactions match your current filter criteria.
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const accountObj = accounts.find((a) => a.id === tx.accountId);
                      const isPositive = tx.amount > 0;
                      return (
                        <div
                          key={tx.id}
                          className="py-3.5 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {tx.description}
                              </span>
                              {tx.status === 'Pending' && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                                  Pending
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span className="font-medium text-[#012169]">
                                {accountObj?.name} ({accountObj?.accountNumberMasked})
                              </span>
                              <span>•</span>
                              <span className="bg-gray-100 px-1.5 py-0.2 rounded text-gray-600">
                                {tx.category}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div
                              className={`text-sm font-bold ${
                                isPositive ? 'text-emerald-700' : 'text-gray-900'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {formatCurrency(tx.amount)}
                            </div>
                            {tx.runningBalance !== undefined && (
                              <div className="text-[11px] text-gray-400">
                                Bal: {formatCurrency(tx.runningBalance)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAY & TRANSFER (INTERNAL TRANSFERS, ZELLE, BILL PAY) */}
        {activeTab === 'transfer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Internal Transfer Between Accounts */}
            <div className="lg:col-span-6 bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <ArrowRightLeft className="w-5 h-5 text-[#012169]" />
                <div>
                  <h2 className="text-lg font-bold text-[#012169]">
                    Transfer Between Your Accounts
                  </h2>
                  <p className="text-xs text-gray-500">
                    Instant transfers between Checking, Savings, Credit Card, and Merrill®
                  </p>
                </div>
              </div>

              {transferFeedback && (
                <div className="my-4 p-3.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{transferFeedback}</span>
                </div>
              )}

              <form onSubmit={handleInternalTransfer} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Transfer From
                  </label>
                  <select
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-medium"
                  >
                    {accounts
                      .filter((a) => a.type !== 'credit')
                      .map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({acc.accountNumberMasked}) — Available:{' '}
                          {formatCurrency(acc.balance)}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Transfer To / Pay Account
                  </label>
                  <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-medium"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.accountNumberMasked}) — Current:{' '}
                        {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Memo / Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={transferMemo}
                      onChange={(e) => setTransferMemo(e.target.value)}
                      placeholder="e.g., Monthly Savings"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#012169] hover:bg-[#00164a] text-white font-bold py-2.5 px-4 rounded text-sm transition-colors cursor-pointer"
                >
                  Complete Transfer Now
                </button>
              </form>
            </div>

            {/* Right Column: Zelle® + Bill Pay */}
            <div className="lg:col-span-6 space-y-6">
              {/* Send Money with Zelle */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#6d1ed4]" />
                    <div>
                      <h2 className="text-lg font-bold text-[#012169]">
                        Send Money with Zelle®
                      </h2>
                      <p className="text-xs text-gray-500">
                        Send money to friends and family with $0 fee
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#6d1ed4] text-white text-xs font-extrabold px-2.5 py-1 rounded">
                    Zelle®
                  </span>
                </div>

                {zelleFeedback && (
                  <div className="my-4 p-3 rounded bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#6d1ed4] shrink-0 mt-0.5" />
                    <span>{zelleFeedback}</span>
                  </div>
                )}

                <form onSubmit={handleZelleSend} className="space-y-3.5 pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Select Recipient or Enter Email/Mobile
                    </label>
                    <select
                      value={zelleRecipient}
                      onChange={(e) => setZelleRecipient(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="Michael Carter (michael.c@email.com)">
                        Michael Carter (michael.c@email.com)
                      </option>
                      <option value="Sarah Jenkins (704-555-0192)">
                        Sarah Jenkins (704-555-0192)
                      </option>
                      <option value="Lauren Brooks (lauren.brooks@email.com)">
                        Lauren Brooks (lauren.brooks@email.com)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={zelleAmount}
                        onChange={(e) => setZelleAmount(e.target.value)}
                        placeholder="50.00"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Message
                      </label>
                      <input
                        type="text"
                        value={zelleNote}
                        onChange={(e) => setZelleNote(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6d1ed4] hover:bg-[#5815b0] text-white font-bold py-2.5 rounded text-sm transition-colors cursor-pointer"
                  >
                    Send with Zelle®
                  </button>
                </form>
              </div>

              {/* Scheduled Bill Pay Center */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h3 className="text-base font-bold text-[#012169] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#dc1431]" />
                    <span>Upcoming eBills &amp; AutoPay</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 mt-2">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {bill.payee}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due {bill.dueDate} • {bill.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {formatCurrency(bill.amount)}
                          </div>
                          <div
                            className={`text-[10px] font-bold uppercase ${
                              bill.status === 'Paid'
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {bill.status}
                          </div>
                        </div>
                        {bill.status !== 'Paid' ? (
                          <button
                            onClick={() => handlePayBillNow(bill)}
                            className="bg-[#012169] hover:bg-[#00164a] text-white text-xs font-bold px-3 py-1.5 rounded"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Paid
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REWARDS & DEALS */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#dc1431]">
                    Customized Cash Rewards Visa Signature® (•••• 7312)
                  </span>
                  <h2 className="text-xl font-bold text-[#012169] mt-0.5">
                    Manage Your 3% Choice Category &amp; Redeem Cash Back
                  </h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded text-right">
                  <div className="text-[11px] font-bold text-[#012169] uppercase">
                    Available Rewards
                  </div>
                  <div className="text-2xl font-extrabold text-[#dc1431]">
                    {formatCurrency(cashRewardsBalance)}
                  </div>
                </div>
              </div>

              {rewardsFeedback && (
                <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rewardsFeedback}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Your Active 3% Cash Back Category (5.25% Effective Rate with Platinum Honors):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                      onClick={() => setChoiceCategory(cat)}
                      className={`p-3 rounded border text-left text-xs font-bold transition-all ${
                        choiceCategory === cat
                          ? 'bg-[#012169] text-white border-[#012169] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#012169]'
                      }`}
                    >
                      <div>{cat}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          choiceCategory === cat ? 'text-amber-300' : 'text-gray-400'
                        }`}
                      >
                        {choiceCategory === cat ? '✓ Active Category' : 'Select for next month'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRedeemRewards}
                  disabled={cashRewardsBalance <= 0}
                  className="bg-[#dc1431] hover:bg-[#b50e26] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded text-sm transition-colors cursor-pointer"
                >
                  {cashRewardsBalance > 0
                    ? `Redeem ${formatCurrency(cashRewardsBalance)} into Advantage Checking`
                    : 'All Cash Rewards Redeemed'}
                </button>
              </div>
            </div>

            {/* BankAmeriDeals */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#012169] mb-1">
                BankAmeriDeals® Cash Back Offers
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Select deals to earn automatic cash back when you pay with your Bank of America debit or credit card.
              </p>
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3.5 rounded border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">{deal.brand}</div>
                      <div className="text-xs font-semibold text-[#dc1431]">
                        {deal.offer}
                      </div>
                      <div className="text-[11px] text-gray-400">{deal.expires}</div>
                    </div>
                    <button
                      onClick={() =>
                        setDeals((prev) =>
                          prev.map((d) =>
                            d.id === deal.id ? { ...d, added: !d.added } : d
                          )
                        )
                      }
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 ${
                        deal.added
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#012169] text-white'
                      }`}
                    >
                      {deal.added ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Activated</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add Deal</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY CENTER, CARD LOCKS & FICO SCORE */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* FICO Score Panel */}
            <div className="lg:col-span-6 bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#012169]">
                    Better Money Habits® Credit Health
                  </span>
                  <h2 className="text-xl font-bold text-[#012169]">
                    Shawn’s Free FICO® Score
                  </h2>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Exceptional (800–850)
                </span>
              </div>

              <div className="py-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-36 h-36 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center shrink-0 bg-emerald-50/30">
                  <span className="text-4xl font-extrabold text-[#012169]">812</span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    FICO® Score 8
                  </span>
                </div>
                <div className="space-y-2.5 text-xs text-gray-700 flex-1">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-semibold">Payment History (35%)</span>
                    <span className="text-emerald-700 font-bold">100% On-Time</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-semibold">Credit Usage (30%)</span>
                    <span className="text-emerald-700 font-bold">6.5% ($1,642 / $25,000)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-semibold">Length of Credit History</span>
                    <span className="text-[#012169] font-bold">11 Years, 4 Months</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-semibold">Recent Inquiries</span>
                    <span className="text-[#012169] font-bold">0 in last 12 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Lock / Unlock Controls */}
            <div className="lg:col-span-6 bg-white rounded-lg border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#012169]">
                  Card Lock &amp; Security Controls
                </h2>
                <p className="text-xs text-gray-500">
                  Temporarily lock misplaced cards to block new purchases while allowing recurring bills to continue.
                </p>
              </div>

              {accounts
                .filter((a) => a.type === 'checking' || a.type === 'credit')
                .map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-lg border border-gray-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#012169]">
                        {acc.type === 'checking'
                          ? 'Bank of America® Visa® Debit Card'
                          : acc.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        Card ending in {acc.accountNumberMasked}
                      </div>
                      <div className="text-xs mt-1 font-semibold">
                        Status:{' '}
                        {acc.cardLocked ? (
                          <span className="text-amber-700">Locked for new purchases</span>
                        ) : (
                          <span className="text-emerald-700">Active &amp; Unlocked</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCardLock(acc.id)}
                      className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        acc.cardLocked
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {acc.cardLocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlock Card</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Lock Card</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: STATEMENTS & DOCUMENTS */}
        {activeTab === 'statements' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-[#012169]">
                  Statements &amp; Tax Documents
                </h2>
                <p className="text-xs text-gray-500">
                  Paperless delivery is active for shawn@bankofamerica-demo.com
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {STATEMENTS_LIST.map((stmt) => (
                <div
                  key={stmt.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-[#012169]">
                      {stmt.period} — {stmt.type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stmt.accountName} • Issued {stmt.dateIssued} • PDF ({stmt.size})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPreviewStatement(`${stmt.period} (${stmt.accountName})`)
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#012169] text-[#012169] hover:bg-blue-50 text-xs font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Statement Summary</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Erica® Virtual Assistant Slide-Over Drawer */}
      {ericaOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="bg-[#012169] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#dc1431] flex items-center justify-center font-bold">
                  E
                </div>
                <div>
                  <div className="text-sm font-bold">Erica® Virtual Financial Assistant</div>
                  <div className="text-[11px] text-blue-200">
                    Personalized for Shawn Anderson
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEricaOpen(false)}
                className="text-white/80 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {ericaMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#012169] text-white'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">
                  Quick prompts:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'What is my checking balance?',
                    'What is my routing number?',
                    'Check my FICO® Score',
                    'How much cash rewards do I have?',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleEricaSubmit(prompt)}
                      className="text-[11px] bg-white border border-[#012169]/30 text-[#012169] hover:bg-blue-50 px-2.5 py-1 rounded-full font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEricaSubmit();
              }}
              className="p-3 border-t border-gray-200 bg-white flex gap-2"
            >
              <input
                type="text"
                value={ericaInput}
                onChange={(e) => setEricaInput(e.target.value)}
                placeholder="Ask Erica about your accounts..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#012169]"
              />
              <button
                type="submit"
                className="bg-[#dc1431] hover:bg-[#b50e26] text-white px-4 py-2 rounded text-xs font-bold"
              >
                Ask
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Statement Preview Modal */}
      {previewStatement && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-[#012169]">{previewStatement}</h3>
              <button
                onClick={() => setPreviewStatement(null)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs text-gray-700 space-y-2.5 font-mono bg-gray-50 p-4 rounded my-3 border border-gray-200">
              <div className="font-bold text-[#012169]">
                BANK OF AMERICA, N.A. — OFFICIAL ACCOUNT SUMMARY
              </div>
              <div>Account Holder: SHAWN ANDERSON</div>
              <div>Preferred Rewards Tier: PLATINUM HONORS</div>
              <div>ABA Routing Number: 026009593</div>
              <div className="pt-2 border-t border-gray-200">
                Current Checking Balance: {formatCurrency(accounts[0].balance)}
              </div>
              <div>Current Savings Balance: {formatCurrency(accounts[1].balance)}</div>
              <div>Merrill Edge CMA Balance: {formatCurrency(accounts[3].balance)}</div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewStatement(null)}
                className="px-4 py-2 bg-[#012169] text-white text-xs font-bold rounded"
              >
                Close Statement Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

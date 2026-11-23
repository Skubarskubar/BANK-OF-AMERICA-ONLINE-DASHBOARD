export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  amount: number; // negative for debit, positive for credit/deposit
  status: 'Posted' | 'Pending';
  runningBalance?: number;
  merchantLocation?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumberMasked: string;
  fullAccountNumber: string;
  routingNumber: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  availableBalance: number;
  interestRate?: string;
  creditLimit?: number;
  minimumPaymentDue?: number;
  paymentDueDate?: string;
  cardLocked?: boolean;
}

export interface ScheduledBill {
  id: string;
  payee: string;
  category: string;
  dueDate: string;
  amount: number;
  autoPay: boolean;
  status: 'Scheduled' | 'Paid' | 'Due Soon';
}

export interface StatementDoc {
  id: string;
  period: string;
  accountName: string;
  dateIssued: string;
  size: string;
  type: 'Monthly Statement' | 'Tax Document (1099-INT)' | 'Year-End Summary';
}

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-checking',
    name: 'Advantage Plus Banking',
    accountNumberMasked: '•••• 4829',
    fullAccountNumber: '3810 4920 4829',
    routingNumber: '026009593',
    type: 'checking',
    balance: 28450.75,
    availableBalance: 28450.75,
    interestRate: '0.02% APY',
    cardLocked: false,
  },
  {
    id: 'acc-savings',
    name: 'Advantage Savings — Platinum Honors',
    accountNumberMasked: '•••• 9104',
    fullAccountNumber: '3810 8831 9104',
    routingNumber: '026009593',
    type: 'savings',
    balance: 114200.00,
    availableBalance: 114200.00,
    interestRate: '3.85% APY',
    cardLocked: false,
  },
  {
    id: 'acc-credit',
    name: 'Bank of America® Customized Cash Rewards Visa Signature®',
    accountNumberMasked: '•••• 7312',
    fullAccountNumber: '4465 9201 8842 7312',
    routingNumber: 'N/A',
    type: 'credit',
    balance: 1642.38,
    availableBalance: 23357.62,
    creditLimit: 25000.00,
    minimumPaymentDue: 35.00,
    paymentDueDate: 'May 28, 2025',
    interestRate: '18.24% Variable APR',
    cardLocked: false,
  },
  {
    id: 'acc-merrill',
    name: 'Merrill Edge® Self-Directed Individual CMA',
    accountNumberMasked: '•••• 5580',
    fullAccountNumber: '884-2945580',
    routingNumber: '026009593',
    type: 'investment',
    balance: 186940.12,
    availableBalance: 14250.00,
    interestRate: '+14.8% YTD',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    accountId: 'acc-checking',
    date: 'Today',
    description: 'WHOLE FOODS MARKET #10428',
    category: 'Groceries',
    amount: -142.86,
    status: 'Pending',
    runningBalance: 28450.75,
    merchantLocation: 'Charlotte, NC',
  },
  {
    id: 'tx-102',
    accountId: 'acc-checking',
    date: 'Yesterday',
    description: 'DIRECT DEPOSIT - ACME GLOBAL TECH PAYROLL',
    category: 'Payroll & Income',
    amount: 4850.00,
    status: 'Posted',
    runningBalance: 28593.61,
    merchantLocation: 'ACH Electronic Credit',
  },
  {
    id: 'tx-103',
    accountId: 'acc-checking',
    date: 'May 12, 2025',
    description: 'ZELLE PAYMENT TO SARAH JENKINS',
    category: 'Transfers',
    amount: -225.00,
    status: 'Posted',
    runningBalance: 23743.61,
    merchantLocation: 'Online / Mobile App',
  },
  {
    id: 'tx-104',
    accountId: 'acc-checking',
    date: 'May 10, 2025',
    description: 'DUKE ENERGY - BILL PAY AUTO DRAFT',
    category: 'Utilities',
    amount: -168.40,
    status: 'Posted',
    runningBalance: 23968.61,
    merchantLocation: 'Charlotte, NC',
  },
  {
    id: 'tx-105',
    accountId: 'acc-checking',
    date: 'May 08, 2025',
    description: 'SHELL OIL 57442910',
    category: 'Gas & Fuel',
    amount: -54.12,
    status: 'Posted',
    runningBalance: 24137.01,
    merchantLocation: 'Charlotte, NC',
  },
  {
    id: 'tx-106',
    accountId: 'acc-checking',
    date: 'May 03, 2025',
    description: 'MORTGAGE SERVICING - BOFA HOME LOANS',
    category: 'Home & Mortgage',
    amount: -2410.00,
    status: 'Posted',
    runningBalance: 24191.13,
    merchantLocation: 'Automated Payment',
  },
  // Savings transactions
  {
    id: 'tx-201',
    accountId: 'acc-savings',
    date: 'May 01, 2025',
    description: 'INTEREST PAYMENT - PLATINUM HONORS BOOSTER',
    category: 'Interest Income',
    amount: 361.45,
    status: 'Posted',
    runningBalance: 114200.00,
  },
  {
    id: 'tx-202',
    accountId: 'acc-savings',
    date: 'Apr 15, 2025',
    description: 'ONLINE BANKING TRANSFER FROM CHK 4829',
    category: 'Transfer',
    amount: 2500.00,
    status: 'Posted',
    runningBalance: 113838.55,
  },
  // Credit Card transactions
  {
    id: 'tx-301',
    accountId: 'acc-credit',
    date: 'Today',
    description: 'DELTA AIR LINES ATLANTA GA',
    category: 'Travel',
    amount: -486.20,
    status: 'Pending',
    runningBalance: 1642.38,
  },
  {
    id: 'tx-302',
    accountId: 'acc-credit',
    date: 'May 11, 2025',
    description: 'AMAZON.COM*MK82L104 AMZN.COM/BILL',
    category: 'Online Shopping',
    amount: -119.45,
    status: 'Posted',
    runningBalance: 1156.18,
  },
  {
    id: 'tx-303',
    accountId: 'acc-credit',
    date: 'May 09, 2025',
    description: 'CAPITAL GRILLE #8014 CHARLOTTE',
    category: 'Dining & Restaurants',
    amount: -214.80,
    status: 'Posted',
    runningBalance: 1036.73,
  },
  {
    id: 'tx-304',
    accountId: 'acc-credit',
    date: 'May 05, 2025',
    description: 'APPLE.COM/BILL CUPERTINO CA',
    category: 'Online Shopping',
    amount: -29.99,
    status: 'Posted',
    runningBalance: 821.93,
  },
  // Merrill Edge transactions
  {
    id: 'tx-401',
    accountId: 'acc-merrill',
    date: 'May 12, 2025',
    description: 'DIVIDEND REINVESTMENT - VANGUARD S&P 500 ETF (VOO)',
    category: 'Dividends',
    amount: 412.80,
    status: 'Posted',
    runningBalance: 186940.12,
  },
  {
    id: 'tx-402',
    accountId: 'acc-merrill',
    date: 'May 02, 2025',
    description: 'BUY 15 SHS MICROSOFT CORP (MSFT) @ $418.50',
    category: 'Equity Trade',
    amount: -6277.50,
    status: 'Posted',
    runningBalance: 186527.32,
  },
];

export const INITIAL_BILLS: ScheduledBill[] = [
  {
    id: 'bill-1',
    payee: 'AT&T Fiber & Wireless',
    category: 'Telecom & Internet',
    dueDate: 'May 22, 2025',
    amount: 148.50,
    autoPay: true,
    status: 'Due Soon',
  },
  {
    id: 'bill-2',
    payee: 'BofA Customized Cash Rewards (••7312)',
    category: 'Credit Card',
    dueDate: 'May 28, 2025',
    amount: 450.00,
    autoPay: false,
    status: 'Scheduled',
  },
  {
    id: 'bill-3',
    payee: 'Mecklenburg County Water & Sewer',
    category: 'Utilities',
    dueDate: 'Jun 02, 2025',
    amount: 64.20,
    autoPay: true,
    status: 'Scheduled',
  },
];

export const STATEMENTS_LIST: StatementDoc[] = [
  {
    id: 'stmt-1',
    period: 'April 2025 Statement',
    accountName: 'Advantage Plus Banking (•••• 4829)',
    dateIssued: 'Apr 30, 2025',
    size: '248 KB',
    type: 'Monthly Statement',
  },
  {
    id: 'stmt-2',
    period: 'April 2025 Statement',
    accountName: 'Advantage Savings (•••• 9104)',
    dateIssued: 'Apr 30, 2025',
    size: '195 KB',
    type: 'Monthly Statement',
  },
  {
    id: 'stmt-3',
    period: 'April 2025 Statement',
    accountName: 'Customized Cash Rewards Visa (•••• 7312)',
    dateIssued: 'Apr 28, 2025',
    size: '312 KB',
    type: 'Monthly Statement',
  },
  {
    id: 'stmt-4',
    period: '2024 Form 1099-INTConsolidated',
    accountName: 'All Deposit Accounts',
    dateIssued: 'Jan 31, 2025',
    size: '410 KB',
    type: 'Tax Document (1099-INT)',
  },
];

export type ThemeName = 'dark' | 'light';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  plan: string;
  createdAt: string;
  phone?: string;
  isAdmin?: boolean;
  blocked?: boolean;
};

export type MonthKey = 'abril' | 'marco' | 'fevereiro';

export type KpiTone = 'green' | 'blue' | 'red' | 'amber' | 'accent';

export type Kpi = {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down' | 'flat';
  tone: KpiTone;
};

export type Transaction = {
  icon: string;
  category: KpiTone;
  name: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
};

// --- Real transaction/category data model (used by src/services/transactions.ts) ---

export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tone: KpiTone;
  type: TransactionType;
  /** Optional monthly budget limit for expense categories. */
  limit?: number;
};

export type TransactionRecord = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  notes?: string;
  /** ISO date, e.g. 2026-07-10 */
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionInput = {
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  notes?: string;
  date: string;
};

export type BudgetItem = {
  icon: string;
  name: string;
  spent: number;
  limit: number;
};

export type Goal = {
  icon: string;
  name: string;
  current: number;
  target: number;
};

export type Insight = {
  icon: string;
  title: string;
  text: string;
};

export type ChartSeries = {
  labels: string[];
  receitas: number[];
  gastos: number[];
};

export type DonutItem = {
  label: string;
  value: number;
  color: string;
};

export type FinanceMonth = {
  kpis: Kpi[];
  line: ChartSeries;
  donut: DonutItem[];
  transactions: Transaction[];
  budget: BudgetItem[];
  goals: Goal[];
  insights: Insight[];
};

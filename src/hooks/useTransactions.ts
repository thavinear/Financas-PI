import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoriesByType, CATEGORIES, getCategory } from '@/services/categories';
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  monthKeyOf,
  subscribe,
  updateTransaction,
} from '@/services/transactions';
import { TransactionInput, TransactionRecord } from '@/types';

function monthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, (month ?? 1) - 1, 1);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Single source of truth for transaction data on any screen. Every consumer
 * re-renders automatically whenever a transaction is added, edited or
 * removed anywhere in the app (dashboard, forms, future reports/goals
 * screens), so balance, charts, categories and lists never drift apart.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => getTransactions());

  useEffect(() => subscribe(() => setTransactions(getTransactions())), []);

  const months = useMemo(() => {
    const keys = new Set(transactions.map((tx) => monthKeyOf(tx.date)));
    const current = monthKeyOf(new Date().toISOString());
    keys.add(current);
    return Array.from(keys)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((key) => ({ key, label: monthLabel(key) }));
  }, [transactions]);

  const add = useCallback((input: TransactionInput) => addTransaction(input), []);
  const edit = useCallback((id: string, input: TransactionInput) => updateTransaction(id, input), []);
  const remove = useCallback((id: string) => deleteTransaction(id), []);

  return { transactions, months, add, edit, remove };
}

export type MonthSummary = ReturnType<typeof summarizeMonth>;

/** Derives every dashboard figure (KPIs, category split, budgets, recent list) from real transactions. */
export function summarizeMonth(transactions: TransactionRecord[], monthKey: string) {
  const monthTx = transactions.filter((tx) => monthKeyOf(tx.date) === monthKey);
  const income = monthTx.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expense = monthTx.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const byCategory = categoriesByType('expense')
    .map((category) => ({
      category,
      value: monthTx.filter((tx) => tx.type === 'expense' && tx.categoryId === category.id).reduce((sum, tx) => sum + tx.amount, 0),
    }))
    .filter((entry) => entry.value > 0);

  const budget = categoriesByType('expense')
    .filter((category) => typeof category.limit === 'number')
    .map((category) => ({
      category,
      spent: monthTx.filter((tx) => tx.type === 'expense' && tx.categoryId === category.id).reduce((sum, tx) => sum + tx.amount, 0),
      limit: category.limit as number,
    }));

  const recent = [...monthTx].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt.localeCompare(a.createdAt))).slice(0, 8);

  return { income, expense, balance, savingsRate, byCategory, budget, recent, count: monthTx.length };
}

/** Builds the "last 6 months" income vs expense series used by the evolution chart. */
export function last6MonthsSeries(transactions: TransactionRecord[]) {
  const now = new Date();
  const keys: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const labels = keys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(year, month - 1, 1)).replace('.', '');
  });

  const receitas = keys.map((key) =>
    transactions.filter((tx) => tx.type === 'income' && monthKeyOf(tx.date) === key).reduce((sum, tx) => sum + tx.amount, 0),
  );
  const gastos = keys.map((key) =>
    transactions.filter((tx) => tx.type === 'expense' && monthKeyOf(tx.date) === key).reduce((sum, tx) => sum + tx.amount, 0),
  );

  return { labels, receitas, gastos };
}

export { CATEGORIES, categoriesByType, getCategory };

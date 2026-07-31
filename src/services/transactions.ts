import { TransactionInput, TransactionRecord } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'finzy_transactions';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * Subscribe to any change in the transactions store (add/update/delete).
 * Every screen that reads transactions (dashboard, reports, goals, budgets...)
 * should subscribe through `useTransactions` so they all stay in sync
 * automatically, instead of holding their own disconnected copies of the data.
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readAll(): TransactionRecord[] {
  const raw = storage.get(STORAGE_KEY);
  if (!raw) {
    return seedIfEmpty();
  }

  try {
    const parsed = JSON.parse(raw) as TransactionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: TransactionRecord[]) {
  storage.set(STORAGE_KEY, JSON.stringify(records));
  notify();
}

function makeId() {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns all transactions, most recent first. */
export function getTransactions(): TransactionRecord[] {
  return [...readAll()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt.localeCompare(a.createdAt)));
}

export function getTransaction(id: string): TransactionRecord | undefined {
  return readAll().find((tx) => tx.id === id);
}

export function addTransaction(input: TransactionInput): TransactionRecord {
  const now = new Date().toISOString();
  const record: TransactionRecord = {
    id: makeId(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  writeAll([...readAll(), record]);
  return record;
}

export function updateTransaction(id: string, input: TransactionInput): TransactionRecord | undefined {
  const all = readAll();
  const index = all.findIndex((tx) => tx.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: TransactionRecord = { ...all[index], ...input, updatedAt: new Date().toISOString() };
  const next = [...all];
  next[index] = updated;
  writeAll(next);
  return updated;
}

export function deleteTransaction(id: string) {
  writeAll(readAll().filter((tx) => tx.id !== id));
}

/** yyyy-mm from an ISO date string. */
export function monthKeyOf(date: string) {
  return date.slice(0, 7);
}

function seedIfEmpty(): TransactionRecord[] {
  const now = new Date();
  const iso = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  };
  const ts = new Date().toISOString();

  const seed: TransactionRecord[] = [
    { id: makeId(), type: 'expense', amount: 1200, categoryId: 'moradia', description: 'Aluguel', date: iso(9), createdAt: ts, updatedAt: ts },
    { id: makeId(), type: 'income', amount: 5000, categoryId: 'salario', description: 'Salário', date: iso(5), createdAt: ts, updatedAt: ts },
    { id: makeId(), type: 'expense', amount: 320, categoryId: 'alimentacao', description: 'Supermercado', date: iso(6), createdAt: ts, updatedAt: ts },
    { id: makeId(), type: 'expense', amount: 89.9, categoryId: 'saude', description: 'Academia', date: iso(3), createdAt: ts, updatedAt: ts },
    { id: makeId(), type: 'expense', amount: 55, categoryId: 'lazer', description: 'Cinema', date: iso(2), createdAt: ts, updatedAt: ts },
    { id: makeId(), type: 'expense', amount: 120, categoryId: 'transporte', description: 'Combustível', date: iso(1), createdAt: ts, updatedAt: ts },
  ];

  storage.set(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

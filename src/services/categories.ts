import { Category, TransactionType } from '@/types';

/**
 * Fixed category catalogue. In a future iteration (custom categories, Premium
 * plan limits) this can be moved to per-user storage without changing the
 * shape consumed by the rest of the app.
 */
export const CATEGORIES: Category[] = [
  // Despesas
  { id: 'alimentacao', name: 'Alimentação', icon: '🍕', color: '#f59e0b', tone: 'amber', type: 'expense', limit: 1200 },
  { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#3b82f6', tone: 'blue', type: 'expense', limit: 1200 },
  { id: 'lazer', name: 'Lazer', icon: '🎮', color: '#7c6af7', tone: 'accent', type: 'expense', limit: 500 },
  { id: 'saude', name: 'Saúde', icon: '🏋️', color: '#22c87a', tone: 'green', type: 'expense', limit: 600 },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#f05252', tone: 'red', type: 'expense', limit: 400 },
  { id: 'outros_despesa', name: 'Outros', icon: '📦', color: '#6b7280', tone: 'accent', type: 'expense', limit: 300 },
  // Receitas
  { id: 'salario', name: 'Salário', icon: '💰', color: '#22c87a', tone: 'green', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💼', color: '#3b82f6', tone: 'blue', type: 'income' },
  { id: 'outros_receita', name: 'Outros', icon: '➕', color: '#6b7280', tone: 'accent', type: 'income' },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function categoriesByType(type: TransactionType): Category[] {
  return CATEGORIES.filter((category) => category.type === type);
}

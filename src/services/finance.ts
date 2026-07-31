import { FinanceMonth, MonthKey } from '@/types';

export const MONTHS: { key: MonthKey; label: string }[] = [
  { key: 'abril', label: 'Abril 2025' },
  { key: 'marco', label: 'Março 2025' },
  { key: 'fevereiro', label: 'Fevereiro 2025' },
];

const marco: FinanceMonth = {
  kpis: [
    { label: 'Saldo atual', value: 'R$ 4.310', change: '↑ 5% vs. mês anterior', direction: 'up', tone: 'green' },
    { label: 'Receitas', value: 'R$ 8.500', change: '= mesmo período', direction: 'flat', tone: 'blue' },
    { label: 'Gastos', value: 'R$ 3.400', change: '↑ 3% vs. mês anterior', direction: 'up', tone: 'red' },
    { label: 'Economizado', value: '40%', change: '= Meta atingida', direction: 'flat', tone: 'amber' },
  ],
  line: {
    labels: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'],
    receitas: [6000, 6800, 7200, 7700, 8000, 8500],
    gastos: [2900, 3100, 3000, 3300, 3200, 3400],
  },
  donut: [
    { label: 'Alimentação', value: 900, color: '#f59e0b' },
    { label: 'Moradia', value: 1200, color: '#3b82f6' },
    { label: 'Lazer', value: 500, color: '#7c6af7' },
    { label: 'Saúde', value: 320, color: '#22c87a' },
    { label: 'Transporte', value: 280, color: '#f05252' },
    { label: 'Outros', value: 200, color: '#6b7280' },
  ],
  transactions: [
    { icon: '🏠', category: 'blue', name: 'Aluguel', date: '01 mar', amount: '-R$ 1.200', type: 'expense' },
    { icon: '💰', category: 'green', name: 'Salário', date: '05 mar', amount: '+R$ 5.000', type: 'income' },
    { icon: '🍕', category: 'amber', name: 'Supermercado', date: '08 mar', amount: '-R$ 320', type: 'expense' },
    { icon: '🏋️', category: 'green', name: 'Academia', date: '10 mar', amount: '-R$ 89,90', type: 'expense' },
    { icon: '🎮', category: 'accent', name: 'Cinema', date: '15 mar', amount: '-R$ 55', type: 'expense' },
    { icon: '🚗', category: 'red', name: 'Ônibus', date: '20 mar', amount: '-R$ 120', type: 'expense' },
  ],
  budget: [
    { icon: '🍕', name: 'Alimentação', spent: 900, limit: 1200 },
    { icon: '🏠', name: 'Moradia', spent: 1200, limit: 1200 },
    { icon: '🎮', name: 'Lazer', spent: 500, limit: 500 },
    { icon: '🏋️', name: 'Saúde', spent: 320, limit: 600 },
    { icon: '🚗', name: 'Transporte', spent: 280, limit: 400 },
  ],
  goals: [
    { icon: '✈️', name: 'Viagem Europa', current: 2500, target: 8000 },
    { icon: '🏠', name: 'Entrada apê', current: 11000, target: 30000 },
    { icon: '📱', name: 'iPhone novo', current: 400, target: 1200 },
    { icon: '🎓', name: 'Pós-graduação', current: 2000, target: 5000 },
  ],
  insights: [
    { icon: '✅', title: 'Lazer dentro do limite', text: 'Lazer exatamente no limite. Mês equilibrado no controle de gastos.' },
    { icon: '🎯', title: 'Meta de 40% atingida', text: 'Taxa de poupança de 40% atingida. Mantenha a consistência!' },
    { icon: '💡', title: 'Dica: Fundo de emergência', text: 'Considere separar 3 a 6 meses de despesas fixas para uma reserva.' },
  ],
};

export const financeData: Record<MonthKey, FinanceMonth> = {
  abril: {
    kpis: [
      { label: 'Saldo atual', value: 'R$ 4.820', change: '↑ 12% vs. mês anterior', direction: 'up', tone: 'green' },
      { label: 'Receitas', value: 'R$ 8.500', change: '= mesmo período', direction: 'flat', tone: 'blue' },
      { label: 'Gastos', value: 'R$ 3.680', change: '↑ 8% vs. mês anterior', direction: 'down', tone: 'red' },
      { label: 'Economizado', value: '43%', change: '↑ Meta: 40%', direction: 'up', tone: 'amber' },
    ],
    line: {
      labels: ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'],
      receitas: [6200, 7100, 7500, 8000, 8200, 8500],
      gastos: [3100, 3400, 3200, 3600, 3400, 3680],
    },
    donut: [
      { label: 'Alimentação', value: 980, color: '#f59e0b' },
      { label: 'Moradia', value: 1200, color: '#3b82f6' },
      { label: 'Lazer', value: 620, color: '#7c6af7' },
      { label: 'Saúde', value: 380, color: '#22c87a' },
      { label: 'Transporte', value: 290, color: '#f05252' },
      { label: 'Outros', value: 210, color: '#6b7280' },
    ],
    transactions: [
      { icon: '🏠', category: 'blue', name: 'Aluguel', date: '01 abr', amount: '-R$ 1.200', type: 'expense' },
      { icon: '🍕', category: 'amber', name: 'iFood', date: '03 abr', amount: '-R$ 68,50', type: 'expense' },
      { icon: '💰', category: 'green', name: 'Salário', date: '05 abr', amount: '+R$ 5.000', type: 'income' },
      { icon: '🏋️', category: 'green', name: 'Academia', date: '07 abr', amount: '-R$ 89,90', type: 'expense' },
      { icon: '🎮', category: 'accent', name: 'Steam', date: '10 abr', amount: '-R$ 49,90', type: 'expense' },
      { icon: '🚗', category: 'red', name: 'Combustível', date: '12 abr', amount: '-R$ 180', type: 'expense' },
    ],
    budget: [
      { icon: '🍕', name: 'Alimentação', spent: 980, limit: 1200 },
      { icon: '🏠', name: 'Moradia', spent: 1200, limit: 1200 },
      { icon: '🎮', name: 'Lazer', spent: 620, limit: 500 },
      { icon: '🏋️', name: 'Saúde', spent: 380, limit: 600 },
      { icon: '🚗', name: 'Transporte', spent: 290, limit: 400 },
    ],
    goals: [
      { icon: '✈️', name: 'Viagem Europa', current: 3200, target: 8000 },
      { icon: '🏠', name: 'Entrada apê', current: 12000, target: 30000 },
      { icon: '📱', name: 'iPhone novo', current: 800, target: 1200 },
      { icon: '🎓', name: 'Pós-graduação', current: 2500, target: 5000 },
    ],
    insights: [
      { icon: '⚠️', title: 'Lazer acima do limite', text: 'Você gastou R$ 120 a mais que o orçamento de lazer.' },
      { icon: '🎯', title: 'Meta de economia atingida', text: '43% de taxa de economia, acima da sua meta de 40%.' },
      { icon: '💡', title: 'Dica: Regra 50/30/20', text: 'Necessidades 50%, desejos 30%, poupança 20%.' },
    ],
  },
  marco,
  fevereiro: marco,
};

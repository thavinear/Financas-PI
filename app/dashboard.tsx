import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { getCurrentUser } from '@/services/auth';
import { financeData } from '@/services/finance';
import { money, toBRDate } from '@/utils/format';
import { AppShell } from '@/components/AppShell';
import { Card, FinzyText, PrimaryButton, ProgressBar, toneBackground, toneColor } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { generatePDF } from '@/services/pdf';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getCategory, last6MonthsSeries, summarizeMonth, useTransactions } from '@/hooks/useTransactions';
import { confirmAsync } from '@/utils/confirm';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useFinzyTheme();
  const { transactions, months, remove } = useTransactions();
  const [month, setMonth] = useState(() => months[0]?.key ?? '');
  const activeMonth = months.find((item) => item.key === month) ?? months[0];
  const summary = useMemo(() => summarizeMonth(transactions, activeMonth?.key ?? month), [transactions, activeMonth, month]);
  const line = useMemo(() => last6MonthsSeries(transactions), [transactions]);

  // Metas e insights ainda não têm CRUD próprio nesta fase; usam dados de exemplo.
  const staticExtras = financeData.abril;

  const columns = width > 1180 ? 4 : 2;
  const chartColumns = width > 980 ? 'row' : 'column';
  const maxLineValue = useMemo(() => Math.max(1, ...line.receitas, ...line.gastos), [line]);
  const donutTotal = summary.byCategory.reduce((sum, item) => sum + item.value, 0);

  const kpis = [
    { label: 'Saldo atual', value: money(summary.balance), tone: summary.balance >= 0 ? ('green' as const) : ('red' as const) },
    { label: 'Receitas', value: money(summary.income), tone: 'blue' as const },
    { label: 'Gastos', value: money(summary.expense), tone: 'red' as const },
    { label: 'Economizado', value: `${summary.savingsRate}%`, tone: 'amber' as const },
  ];

  const pdfData = {
    kpis: kpis.map((kpi) => ({ label: kpi.label, value: kpi.value, change: '', direction: 'flat' as const, tone: kpi.tone })),
    line,
    donut: summary.byCategory.map((item) => ({ label: item.category.name, value: item.value, color: item.category.color })),
    transactions: summary.recent.map((tx) => {
      const category = getCategory(tx.categoryId);
      return {
        icon: category?.icon ?? '💳',
        category: category?.tone ?? ('accent' as const),
        name: tx.description,
        date: toBRDate(tx.date),
        amount: `${tx.type === 'income' ? '+' : '-'}${money(tx.amount)}`,
        type: tx.type,
      };
    }),
    budget: summary.budget.map((item) => ({ icon: item.category.icon, name: item.category.name, spent: item.spent, limit: item.limit })),
    goals: staticExtras.goals,
    insights: staticExtras.insights,
  };

  async function handleDelete(id: string, description: string) {
    const confirmed = await confirmAsync('Excluir transação?', `"${description}" será removida permanentemente.`);
    if (confirmed) {
      remove(id);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell user={getCurrentUser()}>
        <View style={styles.topBar}>
          <View>
            <FinzyText variant="title">Dashboard</FinzyText>
            <FinzyText style={{ color: colors.muted }}>Resumo financeiro do período</FinzyText>
          </View>
          <View style={styles.topActions}>
            <View style={[styles.monthTabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {months.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setMonth(item.key)}
                  style={[styles.monthTab, month === item.key && { backgroundColor: colors.accentD }]}>
                  <FinzyText style={{ color: month === item.key ? colors.accent : colors.muted }}>{item.label}</FinzyText>
                </Pressable>
              ))}
            </View>
            <PrimaryButton variant="secondary" onPress={() => generatePDF(pdfData, activeMonth?.label ?? '', getCurrentUser()?.name ?? 'Usuário')}>
              Exportar PDF
            </PrimaryButton>
            <PrimaryButton onPress={() => router.push('/transacao/form' as never)}>+ Nova transação</PrimaryButton>
          </View>
        </View>

        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <Card key={kpi.label} style={[styles.kpi, { width: `${100 / columns - 1.5}%`, borderTopColor: toneColor(kpi.tone, colors), borderTopWidth: 2 }]}>
              <FinzyText variant="label" style={{ color: colors.muted }}>
                {kpi.label}
              </FinzyText>
              <FinzyText variant="title" style={{ color: toneColor(kpi.tone, colors), marginTop: 10 }}>
                {kpi.value}
              </FinzyText>
            </Card>
          ))}
        </View>

        <View style={[styles.chartRow, { flexDirection: chartColumns }]}>
          <Card style={[styles.cardFlex, chartColumns === 'row' && { flex: 2 }]}>
            <View style={styles.cardHeader}>
              <View>
                <FinzyText variant="section">Evolução mensal</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted }}>Receitas vs Gastos - 6 meses</FinzyText>
              </View>
              <View style={styles.legend}>
                <Legend color={colors.blue} label="Receitas" />
                <Legend color={colors.red} label="Gastos" />
              </View>
            </View>
            <View style={styles.lineChart}>
              {line.labels.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.lineColumn}>
                  <View style={styles.barPair}>
                    <View style={[styles.chartBar, { height: `${(line.receitas[index] / maxLineValue) * 100}%`, backgroundColor: colors.blue }]} />
                    <View style={[styles.chartBar, { height: `${(line.gastos[index] / maxLineValue) * 100}%`, backgroundColor: colors.red }]} />
                  </View>
                  <FinzyText variant="small" style={{ color: colors.muted }}>{label}</FinzyText>
                </View>
              ))}
            </View>
          </Card>

          <Card style={[styles.cardFlex, chartColumns === 'row' && { flex: 1 }]}>
            <View style={styles.cardHeader}>
              <View>
                <FinzyText variant="section">Por categoria</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted }}>Distribuição dos gastos</FinzyText>
              </View>
            </View>
            {summary.byCategory.length === 0 ? (
              <FinzyText variant="small" style={{ color: colors.muted }}>Nenhuma despesa neste mês ainda.</FinzyText>
            ) : (
              <View style={styles.categoryList}>
                {summary.byCategory.map((item) => (
                  <View key={item.category.id} style={styles.categoryItem}>
                    <Legend color={item.category.color} label={item.category.name} />
                    <View style={styles.categoryBarWrap}>
                      <ProgressBar pct={(item.value / donutTotal) * 100} color={item.category.color} />
                    </View>
                    <FinzyText variant="small" style={{ color: colors.muted }}>{Math.round((item.value / donutTotal) * 100)}%</FinzyText>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>

        <View style={styles.insights}>
          {staticExtras.insights.map((insight) => (
            <Card key={insight.title} style={[styles.insightCard, { backgroundColor: colors.surface2 }]}>
              <FinzyText style={styles.insightIcon}>{insight.icon}</FinzyText>
              <View style={styles.insightText}>
                <FinzyText style={{ fontWeight: '700' }}>{insight.title}</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted, lineHeight: 18 }}>{insight.text}</FinzyText>
              </View>
            </Card>
          ))}
        </View>

        <View style={[styles.bottomRow, { flexDirection: width > 980 ? 'row' : 'column' }]}>
          <Card style={styles.cardFlex}>
            <View style={styles.cardHeader}>
              <View>
                <FinzyText variant="section">Últimas transações</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted }}>{activeMonth?.label}</FinzyText>
              </View>
            </View>
            {summary.recent.length === 0 ? (
              <FinzyText variant="small" style={{ color: colors.muted }}>Nenhuma transação neste mês. Toque em “+ Nova transação” para começar.</FinzyText>
            ) : (
              <View>
                {summary.recent.map((transaction) => {
                  const category = getCategory(transaction.categoryId);
                  return (
                    <Pressable
                      key={transaction.id}
                      onPress={() => router.push({ pathname: '/transacao/form' as never, params: { id: transaction.id } })}
                      style={styles.transaction}>
                      <View style={[styles.txIcon, { backgroundColor: toneBackground(category?.tone ?? 'accent', colors) }]}>
                        <FinzyText>{category?.icon ?? '💳'}</FinzyText>
                      </View>
                      <View style={styles.txInfo}>
                        <FinzyText style={{ fontWeight: '700' }}>{transaction.description}</FinzyText>
                        <FinzyText variant="small" style={{ color: colors.muted }}>{toBRDate(transaction.date)} · {category?.name}</FinzyText>
                      </View>
                      <FinzyText style={{ color: transaction.type === 'income' ? colors.green : colors.red, fontWeight: '800' }}>
                        {transaction.type === 'income' ? '+' : '-'}{money(transaction.amount)}
                      </FinzyText>
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation();
                          handleDelete(transaction.id, transaction.description);
                        }}
                        style={styles.txDelete}>
                        <FinzyText style={{ color: colors.muted }}>✕</FinzyText>
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Card>

          <Card style={styles.cardFlex}>
            <View style={styles.cardHeader}>
              <View>
                <FinzyText variant="section">Orçamento mensal</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted }}>Limite por categoria</FinzyText>
              </View>
            </View>
            <View style={[styles.score, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
              <View style={[styles.scoreRing, { borderColor: colors.green }]}>
                <FinzyText variant="section" style={{ color: colors.green }}>{Math.max(0, Math.min(100, summary.savingsRate))}</FinzyText>
              </View>
              <View style={styles.scoreText}>
                <FinzyText style={{ fontWeight: '700' }}>
                  {summary.savingsRate >= 20 ? 'Score financeiro: Bom' : 'Score financeiro: Atenção'}
                </FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted, lineHeight: 18 }}>
                  {summary.savingsRate >= 20
                    ? 'Sua taxa de economia está saudável neste mês.'
                    : 'Sua taxa de economia está baixa neste mês — vale revisar os gastos.'}
                </FinzyText>
              </View>
            </View>
            <View style={styles.budgetList}>
              {summary.budget.map((item) => {
                const pct = Math.min((item.spent / item.limit) * 100, 100);
                const color = pct >= 100 ? colors.red : pct >= 85 ? colors.amber : colors.green;
                return (
                  <View key={item.category.id} style={styles.budgetItem}>
                    <View style={styles.budgetTop}>
                      <FinzyText>{item.category.icon} {item.category.name}</FinzyText>
                      <FinzyText variant="small" style={{ color: colors.muted }}>{money(item.spent)} / {money(item.limit)}</FinzyText>
                    </View>
                    <ProgressBar pct={pct} color={color} />
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <View>
              <FinzyText variant="section">Metas financeiras</FinzyText>
              <FinzyText variant="small" style={{ color: colors.muted }}>Progresso das suas metas de poupança</FinzyText>
            </View>
            <FinzyText style={{ color: colors.accent }}>Ver todas →</FinzyText>
          </View>
          {staticExtras.goals.map((goal) => {
            const pct = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <View key={goal.name} style={[styles.goal, { borderColor: colors.border }]}>
                <View style={[styles.goalIcon, { backgroundColor: colors.accentD }]}>
                  <FinzyText>{goal.icon}</FinzyText>
                </View>
                <View style={styles.goalInfo}>
                  <FinzyText style={{ fontWeight: '700' }}>{goal.name}</FinzyText>
                  <FinzyText variant="small" style={{ color: colors.muted }}>{money(goal.current)} de {money(goal.target)}</FinzyText>
                  <ProgressBar pct={pct} color={colors.green} />
                </View>
                <FinzyText style={{ color: colors.accent, fontWeight: '800' }}>{Math.round(pct)}%</FinzyText>
              </View>
            );
          })}
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <FinzyText variant="small" style={{ color: colors.muted }}>{label}</FinzyText>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  monthTabs: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthTab: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  kpi: {
    minWidth: 150,
    padding: 22,
  },
  change: {
    marginTop: 10,
    fontSize: 12,
  },
  chartRow: {
    gap: 14,
  },
  bottomRow: {
    gap: 14,
  },
  cardFlex: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lineChart: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  lineColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barPair: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  chartBar: {
    width: 10,
    minHeight: 8,
    borderRadius: 99,
  },
  categoryList: {
    gap: 13,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryBarWrap: {
    flex: 1,
  },
  insights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  insightCard: {
    flex: 1,
    minWidth: 230,
    flexDirection: 'row',
    gap: 11,
    padding: 14,
  },
  insightIcon: {
    fontSize: 18,
  },
  insightText: {
    flex: 1,
    gap: 3,
  },
  transaction: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    minWidth: 0,
  },
  txDelete: {
    marginLeft: 10,
    padding: 6,
  },
  score: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  scoreRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    flex: 1,
    gap: 3,
  },
  budgetList: {
    gap: 14,
  },
  budgetItem: {
    gap: 7,
  },
  budgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  goal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfo: {
    flex: 1,
    gap: 5,
  },
});
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { ADMIN_USER, blockUser, deleteUser, getCurrentUser, getUsers, logout, unblockUser } from '@/services/auth';
import { financeData, MONTHS } from '@/services/finance';
import { User } from '@/types';
import { AppShell } from '@/components/AppShell';
import { Card, FinzyText, PrimaryButton, toneColor } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminDashboardScreen() {
  const { colors } = useFinzyTheme();
  const { width } = useWindowDimensions();
  const [users, setUsers] = useState<User[]>(getUsers().filter((u) => !u.isAdmin));
  const [selectedMonth, setSelectedMonth] = useState('abril');
  const data = financeData[selectedMonth as keyof typeof financeData];
  const totalUsers = users.length;
  const totalBalance = data.kpis.find((k) => k.label === 'Saldo atual')?.value ?? 'R$ 0';
  const totalReceitas = data.kpis.find((k) => k.label === 'Receitas')?.value ?? 'R$ 0';
  const totalGastos = data.kpis.find((k) => k.label === 'Gastos')?.value ?? 'R$ 0';

  function handleBlockUser(userId: string) {
    blockUser(userId);
    setUsers(getUsers().filter((u) => !u.isAdmin));
  }

  function handleUnblockUser(userId: string) {
    unblockUser(userId);
    setUsers(getUsers().filter((u) => !u.isAdmin));
  }

  function handleDeleteUser(userId: string) {
    deleteUser(userId);
    setUsers(getUsers().filter((u) => !u.isAdmin));
  }

  function handleLogout() {
    logout();
    router.replace('/admin/login' as never);
  }

  return (
    <ProtectedRoute>
      <AppShell user={getCurrentUser() ?? ADMIN_USER}>
        <View style={styles.topBar}>
          <View>
            <FinzyText variant="title">Admin Dashboard</FinzyText>
            <FinzyText style={{ color: colors.muted }}>Painel de controle administrativo</FinzyText>
          </View>
          <PrimaryButton variant="secondary" onPress={handleLogout}>
            Sair
          </PrimaryButton>
        </View>

        <View style={styles.kpiGrid}>
          <Card style={styles.kpi}>
            <FinzyText variant="label" style={{ color: colors.muted }}>Total de Usuários</FinzyText>
            <FinzyText variant="title" style={{ color: colors.accent, marginTop: 10 }}>{totalUsers}</FinzyText>
          </Card>
          <Card style={styles.kpi}>
            <FinzyText variant="label" style={{ color: colors.muted }}>Saldo Total</FinzyText>
            <FinzyText variant="title" style={{ color: toneColor('green', colors), marginTop: 10 }}>{totalBalance}</FinzyText>
          </Card>
          <Card style={styles.kpi}>
            <FinzyText variant="label" style={{ color: colors.muted }}>Receitas Totais</FinzyText>
            <FinzyText variant="title" style={{ color: toneColor('blue', colors), marginTop: 10 }}>{totalReceitas}</FinzyText>
          </Card>
          <Card style={styles.kpi}>
            <FinzyText variant="label" style={{ color: colors.muted }}>Gastos Totais</FinzyText>
            <FinzyText variant="title" style={{ color: toneColor('red', colors), marginTop: 10 }}>{totalGastos}</FinzyText>
          </Card>
        </View>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <FinzyText variant="section">Usuários Cadastrados</FinzyText>
            <FinzyText style={{ color: colors.muted }}>{totalUsers} usuários</FinzyText>
          </View>
          <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            {users.map((user) => (
              <View key={user.id} style={[styles.userRow, { borderBottomColor: colors.border }]}>
                <View style={styles.userInfo}>
                  <View style={[styles.userAvatar, { backgroundColor: colors.accent }]}>
                    <FinzyText style={styles.avatarText}>{user.avatar}</FinzyText>
                  </View>
                  <View>
                    <FinzyText style={{ fontWeight: '700' }}>{user.name}</FinzyText>
                    <FinzyText variant="small" style={{ color: colors.muted }}>{user.email}</FinzyText>
                  </View>
                </View>
                <View style={styles.userActions}>
                  {user.blocked ? (
                    <PrimaryButton variant="secondary" onPress={() => handleUnblockUser(user.id)}>
                      Desbloquear
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton variant="secondary" onPress={() => handleBlockUser(user.id)}>
                      Bloquear
                    </PrimaryButton>
                  )}
                  <PrimaryButton variant="ghost" onPress={() => handleDeleteUser(user.id)}>
                    Remover
                  </PrimaryButton>
                </View>
              </View>
            ))}
          </ScrollView>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <FinzyText variant="section">Dados Financeiros</FinzyText>
          </View>
          <View style={styles.monthTabs}>
            {MONTHS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setSelectedMonth(item.key)}
                style={[styles.monthTab, selectedMonth === item.key && { backgroundColor: colors.accentD }]}>
                <FinzyText style={{ color: selectedMonth === item.key ? colors.accent : colors.muted, fontSize: 12 }}>
                  {item.label}
                </FinzyText>
              </Pressable>
            ))}
          </View>
          <View style={styles.financialGrid}>
            {data.transactions.map((t) => (
              <View key={`${t.name}-${t.date}`} style={[styles.financialItem, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <FinzyText>{t.icon}</FinzyText>
                <View style={styles.financialInfo}>
                  <FinzyText style={{ fontWeight: '600' }}>{t.name}</FinzyText>
                  <FinzyText variant="small" style={{ color: colors.muted }}>{t.date}</FinzyText>
                </View>
                <FinzyText style={{ color: t.type === 'income' ? colors.green : colors.red, fontWeight: '700' }}>
                  {t.amount}
                </FinzyText>
              </View>
            ))}
          </View>
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 20,
  },
  kpi: {
    flex: 1,
    minWidth: 150,
    padding: 22,
  },
  section: {
    padding: 22,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  monthTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  monthTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  financialGrid: {
    gap: 10,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  financialInfo: {
    flex: 1,
  },
});
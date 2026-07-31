import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '@/services/auth';
import { Card, FinzyText, PrimaryButton } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';

export default function IndexScreen() {
  const { colors } = useFinzyTheme();
  const [status, setStatus] = useState('Verificando sessão...');

  useEffect(() => {
    const user = getCurrentUser();
    const destination = user ? '/dashboard' : '/login';
    setStatus(user ? 'Sessão encontrada. Abrindo dashboard...' : 'Redirecionando para o login...');
    const timeout = setTimeout(() => router.replace(destination as never), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Card style={styles.card}>
        <FinzyText variant="title" style={styles.logo}>
          finzy<FinzyText variant="title" style={{ color: colors.accent }}>.</FinzyText>
        </FinzyText>
        <FinzyText style={[styles.status, { color: colors.muted }]}>{status}</FinzyText>
        <View style={styles.actions}>
          <PrimaryButton onPress={() => router.replace('/login' as never)}>Entrar</PrimaryButton>
          <PrimaryButton variant="secondary" onPress={() => router.replace('/dashboard' as never)}>
            Abrir dashboard
          </PrimaryButton>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 36,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  status: {
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: 10,
  },
});

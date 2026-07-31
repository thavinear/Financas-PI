import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ADMIN_USER, saveSession } from '@/services/auth';
import { Card, FinzyText, PrimaryButton } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';

export default function AdminLoginScreen() {
  const { colors } = useFinzyTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    setError('');
    
    if (email.toLowerCase() !== ADMIN_USER.email.toLowerCase() || password !== ADMIN_USER.password) {
      setError('Credenciais de administrador inválidas.');
      return;
    }

    saveSession(ADMIN_USER);
    router.replace('/admin/dashboard' as never);
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={styles.keyboard}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <FinzyText variant="title">
              finzy Admin<FinzyText variant="title" style={{ color: colors.purple }}>.</FinzyText>
            </FinzyText>
            <FinzyText style={{ color: colors.muted }}>Área administrativa</FinzyText>
          </View>

          <View style={styles.field}>
            <FinzyText style={styles.label}>E-mail</FinzyText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="admin@finzy.com"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
            />
          </View>

          <View style={styles.field}>
            <FinzyText style={styles.label}>Senha</FinzyText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
            />
          </View>

          {error ? (
            <View style={[styles.error, { backgroundColor: colors.redD, borderColor: colors.red }]}>
              <FinzyText style={{ color: colors.red }}>{error}</FinzyText>
            </View>
          ) : null}

          <PrimaryButton onPress={submit} style={styles.loginButton}>
            Entrar como Admin
          </PrimaryButton>

          <View style={styles.footer}>
            <Pressable onPress={() => router.replace('/login' as never)}>
              <FinzyText style={{ color: colors.blue, fontWeight: '700' }}>Voltar ao login</FinzyText>
            </Pressable>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 40,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  field: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  error: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
});
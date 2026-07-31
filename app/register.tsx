import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '@/services/auth';
import { Card, FinzyText, PrimaryButton } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';

export default function RegisterScreen() {
  const { colors } = useFinzyTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    setError('');
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Digite um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const user = register(name.trim(), email.trim(), password, phone.trim() || undefined);
    if (!user) {
      setError('E-mail já cadastrado.');
      return;
    }

    router.replace('/dashboard' as never);
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={styles.keyboard}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <FinzyText variant="title">
              finzy<FinzyText variant="title" style={{ color: colors.green }}>.</FinzyText>
            </FinzyText>
            <FinzyText style={{ color: colors.muted }}>Crie sua conta</FinzyText>
          </View>

          <View style={styles.field}>
            <FinzyText style={styles.label}>Nome completo</FinzyText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="João Silva"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
            />
          </View>

          <View style={styles.field}>
            <FinzyText style={styles.label}>E-mail</FinzyText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
            />
          </View>

          <View style={styles.field}>
            <FinzyText style={styles.label}>Telefone (opcional)</FinzyText>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+55 (11) 99999-9999"
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

          <View style={styles.field}>
            <FinzyText style={styles.label}>Confirmar senha</FinzyText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

          <PrimaryButton onPress={submit} style={styles.registerButton}>
            Criar conta
          </PrimaryButton>

          <View style={styles.footer}>
            <Pressable onPress={() => router.push('/login' as never)}>
              <FinzyText style={{ color: colors.muted }}>
                Já tem conta? <FinzyText style={{ color: colors.blue, fontWeight: '700' }}>Entrar</FinzyText>
              </FinzyText>
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
  registerButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
});
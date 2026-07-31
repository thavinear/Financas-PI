import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '@/components/AppShell';
import { Card, FinzyText, PrimaryButton } from '@/components/ui';
import { getCurrentUser, logout, updateCurrentUser } from '@/services/auth';
import { User } from '@/types';
import { memberSince } from '@/utils/format';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PerfilScreen() {
  const { colors } = useFinzyTheme();
  const { width } = useWindowDimensions();
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name ?? 'João Silva');
  const [email, setEmail] = useState(user?.email ?? 'joao@email.com');
  const [phone, setPhone] = useState(user?.phone ?? '+55 (11) 99999-9999');
  const [error, setError] = useState('');
  const activeUser = user ?? {
    id: 'u1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'JS',
    plan: 'Gratuito',
    createdAt: '2024-01-15',
    phone: '+55 (11) 99999-9999',
  };
  const stacked = width < 920;

  function openModal() {
    setName(activeUser.name);
    setEmail(activeUser.email);
    setPhone(activeUser.phone ?? '');
    setError('');
    setModalVisible(true);
  }

  function saveProfile() {
    if (!name.trim() || !email.trim()) {
      setError('Preencha nome e e-mail.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Digite um e-mail válido.');
      return;
    }

    const nextUser = updateCurrentUser({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setUser(nextUser);
    setModalVisible(false);
  }

  function signOut() {
    logout();
    router.replace('/login' as never);
  }

  return (
    <ProtectedRoute>
      <AppShell user={activeUser}>
        <View style={[styles.wrapper, stacked && styles.wrapperStacked]}>
          <View style={styles.aside}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatarHuge, { backgroundColor: colors.accent, borderColor: colors.bg }]}>
                <FinzyText style={styles.avatarText}>{activeUser.avatar}</FinzyText>
              </View>
              <Pressable onPress={openModal} style={[styles.editBadge, { backgroundColor: colors.surface2, borderColor: colors.borderMd }]}>
                <FinzyText>📷</FinzyText>
              </Pressable>
            </View>
            <FinzyText variant="title" style={styles.profileName}>{activeUser.name}</FinzyText>
            <FinzyText style={{ color: colors.muted }}>{memberSince(activeUser.createdAt)}</FinzyText>
            <View style={[styles.planBadge, { backgroundColor: colors.accentD, borderColor: colors.accent }]}>
              <FinzyText variant="label" style={{ color: colors.accent }}>Plano {activeUser.plan}</FinzyText>
            </View>
            <PrimaryButton variant="secondary" onPress={openModal} style={styles.editButton}>
              Editar Perfil
            </PrimaryButton>
          </View>

          <View style={styles.content}>
            <Card style={styles.profileCard}>
              <FinzyText variant="label" style={{ color: colors.accent, marginBottom: 25 }}>
                Sua Jornada Financeira
              </FinzyText>
              <View style={styles.statsGrid}>
                <Stat value="128" label="Transações" />
                <Stat value="12" label="Metas Batidas" color={colors.green} />
                <Stat value="450" label="Dias Ativo" color={colors.accent} />
              </View>
            </Card>

            <Card style={styles.profileCard}>
              <FinzyText variant="label" style={{ color: colors.accent, marginBottom: 25 }}>
                Informações da Conta
              </FinzyText>
              <View style={styles.infoGrid}>
                <Info label="E-mail" value={activeUser.email} />
                <Info label="Telefone" value={activeUser.phone ?? '+55 (11) 99999-9999'} />
                <Info label="Idioma" value="Português (BR)" />
                <Info label="Fuso Horário" value="Brasília (GMT-3)" />
              </View>
            </Card>

            <Pressable onPress={signOut}>
              <FinzyText style={{ color: colors.red, fontWeight: '800' }}>Sair da conta</FinzyText>
            </Pressable>
          </View>
        </View>

        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <View>
                  <FinzyText variant="title" style={{ fontSize: 20 }}>Editar perfil</FinzyText>
                  <FinzyText style={{ color: colors.muted }}>Atualize seus dados da conta.</FinzyText>
                </View>
                <Pressable onPress={() => setModalVisible(false)} style={[styles.close, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                  <FinzyText>x</FinzyText>
                </Pressable>
              </View>

              <View style={styles.modalAvatarRow}>
                <View style={[styles.preview, { backgroundColor: colors.accent }]}>
                  <FinzyText style={styles.previewText}>{activeUser.avatar}</FinzyText>
                </View>
                <PrimaryButton variant="secondary" onPress={() => undefined}>Escolher foto</PrimaryButton>
                <PrimaryButton variant="secondary" onPress={() => undefined}>Remover foto</PrimaryButton>
              </View>

              <FormField label="Nome" value={name} onChangeText={setName} />
              <FormField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <FormField label="Telefone" value={phone} onChangeText={setPhone} />

              {error ? (
                <View style={[styles.error, { backgroundColor: colors.redD, borderColor: colors.red }]}>
                  <FinzyText style={{ color: colors.red }}>{error}</FinzyText>
                </View>
              ) : null}

              <View style={styles.modalActions}>
                <PrimaryButton variant="secondary" onPress={() => setModalVisible(false)}>Cancelar</PrimaryButton>
                <PrimaryButton onPress={saveProfile}>Salvar perfil</PrimaryButton>
              </View>
            </View>
          </View>
        </Modal>
      </AppShell>
    </ProtectedRoute>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color?: string }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={[styles.statBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      <FinzyText variant="title" style={{ color: color ?? colors.text }}>{value}</FinzyText>
      <FinzyText variant="label" style={{ color: colors.muted }}>{label}</FinzyText>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={styles.infoField}>
      <FinzyText variant="small" style={{ color: colors.muted }}>{label}</FinzyText>
      <View style={[styles.infoValue, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
        <FinzyText>{value}</FinzyText>
      </View>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'email-address';
}) {
  const { colors } = useFinzyTheme();
  return (
    <View style={styles.formField}>
      <FinzyText variant="label" style={{ color: colors.muted }}>{label}</FinzyText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 40,
  },
  wrapperStacked: {
    flexDirection: 'column',
  },
  aside: {
    width: 320,
    maxWidth: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarHuge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 58,
    fontWeight: '900',
  },
  editBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  planBadge: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 20,
  },
  editButton: {
    marginTop: 30,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  profileCard: {
    padding: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statBox: {
    flex: 1,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  infoField: {
    flex: 1,
    minWidth: 190,
    gap: 6,
  },
  infoValue: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 520,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    marginBottom: 22,
  },
  close: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  preview: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  formField: {
    gap: 7,
    marginBottom: 14,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
  },
  error: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },
});
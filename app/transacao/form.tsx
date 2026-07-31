import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, FinzyText, PrimaryButton, Segmented, TextField } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { categoriesByType } from '@/services/categories';
import { getTransaction } from '@/services/transactions';
import { useTransactions } from '@/hooks/useTransactions';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { parseBRDate, toBRDate, todayISO } from '@/utils/format';
import { confirmAsync } from '@/utils/confirm';
import { TransactionType } from '@/types';

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const existing = useMemo(() => (id ? getTransaction(String(id)) : undefined), [id]);
  const { add, edit, remove } = useTransactions();
  const { colors } = useFinzyTheme();

  const [type, setType] = useState<TransactionType>(existing?.type ?? 'expense');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? categoriesByType(existing?.type ?? 'expense')[0]?.id ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount).replace('.', ',') : '');
  const [date, setDate] = useState(existing ? toBRDate(existing.date) : toBRDate(todayISO()));
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = categoriesByType(type);

  function changeType(nextType: TransactionType) {
    setType(nextType);
    const stillValid = categoriesByType(nextType).some((category) => category.id === categoryId);
    if (!stillValid) {
      setCategoryId(categoriesByType(nextType)[0]?.id ?? '');
    }
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const numericAmount = Number(amount.replace(/\./g, '').replace(',', '.'));

    if (!description.trim()) {
      nextErrors.description = 'Informe uma descrição.';
    }
    if (!categoryId) {
      nextErrors.category = 'Escolha uma categoria.';
    }
    if (!amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Informe um valor válido, maior que zero.';
    }
    if (!parseBRDate(date)) {
      nextErrors.date = 'Use o formato DD/MM/AAAA.';
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, numericAmount };
  }

  function submit() {
    const { valid, numericAmount } = validate();
    if (!valid) {
      return;
    }

    const isoDate = parseBRDate(date) as string;
    const input = {
      type,
      amount: numericAmount,
      categoryId,
      description: description.trim(),
      notes: notes.trim() || undefined,
      date: isoDate,
    };

    if (isEditing && existing) {
      edit(existing.id, input);
    } else {
      add(input);
    }

    router.back();
  }

  async function handleDelete() {
    if (!existing) return;
    const confirmed = await confirmAsync('Excluir transação?', `"${existing.description}" será removida permanentemente.`);
    if (confirmed) {
      remove(existing.id);
      router.back();
    }
  }

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ presentation: 'modal', headerShown: true, title: isEditing ? 'Editar transação' : 'Nova transação' }} />
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Card style={styles.card}>
              <Segmented
                value={type}
                onChange={changeType}
                options={[
                  { value: 'expense', label: '↑ Despesa' },
                  { value: 'income', label: '↓ Receita' },
                ]}
              />

              <View style={styles.field}>
                <FinzyText variant="label" style={{ color: colors.muted, marginBottom: 8 }}>
                  Categoria
                </FinzyText>
                <View style={styles.chips}>
                  {categories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => setCategoryId(category.id)}
                      style={[
                        styles.chip,
                        { borderColor: colors.border, backgroundColor: colors.surface2 },
                        categoryId === category.id && { backgroundColor: colors.accentD, borderColor: colors.accent },
                      ]}>
                      <FinzyText>{category.icon} {category.name}</FinzyText>
                    </Pressable>
                  ))}
                </View>
                {errors.category && (
                  <FinzyText variant="small" style={{ color: colors.red, marginTop: 4 }}>
                    {errors.category}
                  </FinzyText>
                )}
              </View>

              <TextField
                label="Descrição"
                placeholder="Ex: Supermercado, Salário..."
                value={description}
                onChangeText={setDescription}
                error={errors.description}
                style={styles.field}
              />

              <TextField
                label="Valor (R$)"
                placeholder="0,00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                error={errors.amount}
                style={styles.field}
              />

              <TextField
                label="Data"
                placeholder="DD/MM/AAAA"
                value={date}
                onChangeText={setDate}
                error={errors.date}
                style={styles.field}
              />

              <TextField
                label="Observações (opcional)"
                placeholder="Alguma nota sobre essa transação..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={[styles.field, styles.notesInput]}
              />

              <PrimaryButton onPress={submit} style={styles.submit}>
                {isEditing ? 'Salvar alterações' : 'Adicionar transação'}
              </PrimaryButton>

              {isEditing && (
                <PrimaryButton variant="secondary" onPress={handleDelete} style={{ borderColor: colors.red }}>
                  <FinzyText style={{ color: colors.red, fontWeight: '700' }}>Excluir transação</FinzyText>
                </PrimaryButton>
              )}

              <PrimaryButton variant="ghost" onPress={() => router.back()}>
                Cancelar
              </PrimaryButton>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, flexGrow: 1 },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: 4 },
  field: { marginTop: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  notesInput: { minHeight: 80 },
  submit: { marginTop: 26 },
});

import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { FinzyText, PrimaryButton } from '@/components/ui';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';

export default function NotFoundScreen() {
  const { colors } = useFinzyTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FinzyText variant="title">Página não encontrada</FinzyText>
      <Pressable onPress={() => router.replace('/' as never)}>
        <PrimaryButton style={{ marginTop: 20 }}>Ir para início</PrimaryButton>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
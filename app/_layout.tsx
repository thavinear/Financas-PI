import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FinzyThemeProvider, useFinzyTheme } from '@/hooks/useFinzyTheme';

function RootStack() {
  const { theme, colors } = useFinzyTheme();

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <FinzyThemeProvider>
      <RootStack />
    </FinzyThemeProvider>
  );
}

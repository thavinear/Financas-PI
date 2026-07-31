import { Alert, Platform } from 'react-native';

/** Cross-platform confirm dialog. Resolves true if the user confirms. */
export function confirmAsync(title: string, message?: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(typeof window !== 'undefined' ? window.confirm(message ? `${title}\n\n${message}` : title) : true);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

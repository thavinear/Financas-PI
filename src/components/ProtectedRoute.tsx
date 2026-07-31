import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { getCurrentUser } from '@/services/auth';
import { LoadingSpinner } from './ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.replace('/login' as never);
    }
  }, [user]);

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  return <>{children}</>;
}
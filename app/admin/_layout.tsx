import { useEffect } from 'react';
import { router } from 'expo-router';
import { isAdmin } from '@/services/auth';

export default function AdminLayout() {
  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/admin/login' as never);
    }
  }, []);

  return null;
}

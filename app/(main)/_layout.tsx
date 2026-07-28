import { Redirect, Stack, type Href } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function MainLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/login' as Href} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

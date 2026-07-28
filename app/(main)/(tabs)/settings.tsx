import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { colors, tokens } from '@/constants/theme';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as Href);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.hint}>
        Zalogowany jako: {user?.email ?? '—'} (mock). Pełne ustawienia później.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        onPress={handleLogout}>
        <LogOut size={18} color={colors.sidebarLogoutText} strokeWidth={2} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgContent,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logout: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: tokens.borderRadius,
  },
  logoutPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  logoutText: {
    color: colors.sidebarLogoutText,
    fontSize: 15,
    fontWeight: '500',
  },
});

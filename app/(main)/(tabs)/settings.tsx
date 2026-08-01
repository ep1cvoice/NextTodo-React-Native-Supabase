import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import {
  User,
  SlidersHorizontal,
  Zap,
  Trash2,
  LogOut,
  Plus,
  AlertTriangle,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useTasks } from '@/context/TasksContext';
import type { ThemeMode } from '@/constants/theme';
import { tokens } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SectionKey = 'profile' | 'preferences' | 'data' | 'productivity';

export default function SettingsScreen() {
  const { user, setUser, logout } = useAuth();
  const { theme, setTheme, colors } = useTheme();
  const { activeTasks, completedTasks, deleteAllActive, deleteAllCompleted } = useTasks();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [openSection, setOpenSection] = useState<SectionKey | null>('preferences');
  const [pomodoroTime, setPomodoroTime] = useState<string>(
    String(user?.settings?.pomodoroTime ?? 25)
  );
  const [pomodoroMsg, setPomodoroMsg] = useState('');
  const [pomodoroErr, setPomodoroErr] = useState('');

  const toggleSection = (key: SectionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as Href);
  };

  const handlePomodoroSave = () => {
    setPomodoroMsg('');
    setPomodoroErr('');
    const value = Number(pomodoroTime);
    if (!Number.isFinite(value) || value < 1 || value > 60) {
      setPomodoroErr('Time must be between 1 and 60 minutes');
      return;
    }
    setUser((prev) =>
      prev
        ? {
            ...prev,
            settings: { ...prev.settings, pomodoroTime: value },
          }
        : prev
    );
    setPomodoroMsg('Pomodoro time updated (local).');
  };

  const confirmDeleteAllActive = () => {
    if (activeTasks.length === 0) {
      Alert.alert('Nothing to delete', 'There are no active tasks.');
      return;
    }
    Alert.alert(
      'Delete all active tasks?',
      `This will remove ${activeTasks.length} active task(s).`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteAllActive },
      ]
    );
  };

  const confirmDeleteAllCompleted = () => {
    if (completedTasks.length === 0) {
      Alert.alert('Nothing to delete', 'There are no completed tasks.');
      return;
    }
    Alert.alert(
      'Delete all completed tasks?',
      `This will remove ${completedTasks.length} completed task(s).`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteAllCompleted },
      ]
    );
  };

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.panel}>
      <Text style={styles.pageTitle}>Settings</Text>
      <Text style={styles.signedIn}>
        Signed in as {user?.email ?? '—'} <Text style={styles.mockTag}>(mock)</Text>
      </Text>

      {/* PROFILE */}
      <View style={styles.section}>
        <Pressable
          style={[styles.sectionHeader, openSection === 'profile' && styles.sectionHeaderActive]}
          onPress={() => toggleSection('profile')}>
          <View style={styles.sectionHeaderStart}>
            <User
              size={22}
              color={openSection === 'profile' ? colors.sidebarItemActiveText : colors.textSecondary}
            />
            <Text
              style={[
                styles.sectionTitle,
                openSection === 'profile' && styles.sectionTitleActive,
              ]}>
              Profile
            </Text>
          </View>
          <Plus
            size={22}
            color={openSection === 'profile' ? colors.sidebarItemActiveText : colors.textSecondary}
            style={openSection === 'profile' ? styles.iconRotated : undefined}
          />
        </Pressable>
        {openSection === 'profile' && (
          <View style={styles.sectionBody}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.description}>{user?.username ?? '—'}</Text>
            <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
            <Text style={styles.description}>{user?.email ?? '—'}</Text>

            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
              onPress={() =>
                Alert.alert('Coming with Supabase', 'Change email / password after Auth is connected.')
              }>
              <Text style={styles.secondaryBtnText}>Change email / password</Text>
            </Pressable>

            <View style={styles.dangerZone}>
              <View style={styles.dangerHeader}>
                <AlertTriangle size={18} color={colors.red} />
                <Text style={styles.dangerTitle}>Danger zone</Text>
              </View>
              <Text style={styles.description}>Account delete will be available with Supabase Auth.</Text>
              <Pressable
                style={({ pressed }) => [styles.dangerBtn, pressed && styles.dangerBtnPressed]}
                onPress={() =>
                  Alert.alert('Coming with Supabase', 'Delete account requires real Auth backend.')
                }>
                <Text style={styles.dangerBtnText}>Delete account</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* PREFERENCES */}
      <View style={styles.section}>
        <Pressable
          style={[
            styles.sectionHeader,
            openSection === 'preferences' && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection('preferences')}>
          <View style={styles.sectionHeaderStart}>
            <SlidersHorizontal
              size={22}
              color={
                openSection === 'preferences' ? colors.sidebarItemActiveText : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                openSection === 'preferences' && styles.sectionTitleActive,
              ]}>
              Preferences
            </Text>
          </View>
          <Plus
            size={22}
            color={
              openSection === 'preferences' ? colors.sidebarItemActiveText : colors.textSecondary
            }
            style={openSection === 'preferences' ? styles.iconRotated : undefined}
          />
        </Pressable>
        {openSection === 'preferences' && (
          <View style={styles.sectionBody}>
            <Text style={styles.label}>Theme</Text>
            <Text style={styles.description}>Auto / Light / Dark</Text>
            <View style={styles.segment}>
              {themeOptions.map((opt) => {
                const active = theme === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setTheme(opt.value)}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* DATA */}
      <View style={styles.section}>
        <Pressable
          style={[styles.sectionHeader, openSection === 'data' && styles.sectionHeaderActive]}
          onPress={() => toggleSection('data')}>
          <View style={styles.sectionHeaderStart}>
            <Trash2
              size={22}
              color={openSection === 'data' ? colors.sidebarItemActiveText : colors.textSecondary}
            />
            <Text
              style={[styles.sectionTitle, openSection === 'data' && styles.sectionTitleActive]}>
              Data
            </Text>
          </View>
          <Plus
            size={22}
            color={openSection === 'data' ? colors.sidebarItemActiveText : colors.textSecondary}
            style={openSection === 'data' ? styles.iconRotated : undefined}
          />
        </Pressable>
        {openSection === 'data' && (
          <View style={styles.sectionBody}>
            <Text style={styles.description}>
              Bulk delete lives here (moved out of task lists).
            </Text>
            <Pressable
              style={({ pressed }) => [styles.dangerBtn, pressed && styles.dangerBtnPressed]}
              onPress={confirmDeleteAllActive}>
              <Trash2 size={16} color={colors.red} />
              <Text style={styles.dangerBtnText}>
                Delete all active ({activeTasks.length})
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.dangerBtn, pressed && styles.dangerBtnPressed]}
              onPress={confirmDeleteAllCompleted}>
              <Trash2 size={16} color={colors.red} />
              <Text style={styles.dangerBtnText}>
                Delete all completed ({completedTasks.length})
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* PRODUCTIVITY */}
      <View style={styles.section}>
        <Pressable
          style={[
            styles.sectionHeader,
            openSection === 'productivity' && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection('productivity')}>
          <View style={styles.sectionHeaderStart}>
            <Zap
              size={22}
              color={
                openSection === 'productivity' ? colors.sidebarItemActiveText : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                openSection === 'productivity' && styles.sectionTitleActive,
              ]}>
              Productivity
            </Text>
          </View>
          <Plus
            size={22}
            color={
              openSection === 'productivity' ? colors.sidebarItemActiveText : colors.textSecondary
            }
            style={openSection === 'productivity' ? styles.iconRotated : undefined}
          />
        </Pressable>
        {openSection === 'productivity' && (
          <View style={styles.sectionBody}>
            <Text style={styles.label}>Pomodoro</Text>
            <Text style={styles.description}>Focus duration (used later by timer)</Text>
            <View style={styles.pomodoroRow}>
              <TextInput
                value={pomodoroTime}
                onChangeText={(val) => {
                  if (val === '') return setPomodoroTime('');
                  if (/^\d{1,2}$/.test(val)) setPomodoroTime(val);
                }}
                keyboardType="number-pad"
                style={styles.pomodoroInput}
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.description}>min</Text>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                onPress={handlePomodoroSave}>
                <Text style={styles.primaryBtnText}>Set Time</Text>
              </Pressable>
            </View>
            {!!pomodoroMsg && <Text style={styles.successInfo}>{pomodoroMsg}</Text>}
            {!!pomodoroErr && <Text style={styles.errorInfo}>{pomodoroErr}</Text>}
          </View>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        onPress={handleLogout}>
        <LogOut size={18} color={colors.sidebarLogoutText} strokeWidth={2} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgContent,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
      alignItems: 'center',
    },
    panel: {
      width: '100%',
      maxWidth: 520,
      gap: 10,
    },
    pageTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    signedIn: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    mockTag: {
      color: colors.textMuted,
      fontSize: 13,
    },
    section: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: tokens.borderRadius,
      backgroundColor: colors.bgTodoItem,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionHeaderActive: {
      backgroundColor: colors.sidebarItemActiveBg,
    },
    sectionHeaderStart: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    sectionTitleActive: {
      color: colors.sidebarItemActiveText,
    },
    iconRotated: {
      transform: [{ rotate: '45deg' }],
    },
    sectionBody: {
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      padding: 16,
      gap: 8,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    segment: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 4,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      alignItems: 'center',
      backgroundColor: colors.bgSurface,
    },
    segmentBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    segmentText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    segmentTextActive: {
      color: '#fff',
    },
    secondaryBtn: {
      marginTop: 8,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.bgSurface,
      alignItems: 'center',
    },
    secondaryBtnPressed: {
      backgroundColor: colors.bgCardHover,
    },
    secondaryBtnText: {
      color: colors.textPrimary,
      fontWeight: '500',
      fontSize: 14,
    },
    dangerZone: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.35)',
      backgroundColor: 'rgba(239, 68, 68, 0.06)',
      gap: 8,
    },
    dangerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dangerTitle: {
      color: colors.red,
      fontWeight: '700',
      fontSize: 14,
    },
    dangerBtn: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    dangerBtnPressed: {
      backgroundColor: colors.sidebarLogoutHover,
    },
    dangerBtnText: {
      color: colors.red,
      fontWeight: '600',
      fontSize: 14,
    },
    pomodoroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 4,
    },
    pomodoroInput: {
      width: 64,
      height: 40,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 10,
      backgroundColor: colors.bgSurface,
      color: colors.textPrimary,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    primaryBtn: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },
    primaryBtnPressed: {
      backgroundColor: colors.primaryHover,
    },
    primaryBtnText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    successInfo: {
      color: colors.green,
      fontSize: 13,
      fontWeight: '500',
    },
    errorInfo: {
      color: colors.red,
      fontSize: 13,
      fontWeight: '500',
    },
    logout: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: tokens.borderRadius,
    },
    logoutPressed: {
      backgroundColor: colors.sidebarLogoutHover,
    },
    logoutText: {
      color: colors.sidebarLogoutText,
      fontSize: 15,
      fontWeight: '500',
    },
  });
}

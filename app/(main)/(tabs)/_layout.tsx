import { Tabs } from 'expo-router';
import { ListTodo, CheckCircle2, Settings } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: '700',
          color: colors.textPrimary,
        },
        headerStyle: {
          backgroundColor: colors.bgSurface,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgSurface,
          borderTopColor: colors.borderColor,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="active"
        options={{
          title: 'Active Tasks',
          tabBarLabel: 'Active',
          tabBarIcon: ({ color, size }) => <ListTodo size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed Tasks',
          tabBarLabel: 'Completed',
          tabBarIcon: ({ color, size }) => (
            <CheckCircle2 size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

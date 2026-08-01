import { View, StyleSheet } from 'react-native';
import ActiveTasks from '@/components/tasks/ActiveTasks';
import { tokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function ActiveTasksScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgContent }]}>
      <View style={styles.panel}>
        <ActiveTasks />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  panel: {
    flex: 1,
    width: '100%',
    maxWidth: tokens.contentMaxWidth,
    padding: 16,
    minHeight: 0,
  },
});

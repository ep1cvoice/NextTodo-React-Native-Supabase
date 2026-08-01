import { View, StyleSheet } from 'react-native';
import ActiveTasks from '@/components/tasks/ActiveTasks';
import { useTheme } from '@/context/ThemeContext';

export default function ActiveTasksScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgContent }]}>
      <ActiveTasks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

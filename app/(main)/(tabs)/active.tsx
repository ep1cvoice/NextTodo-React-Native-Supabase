import { View, StyleSheet } from 'react-native';
import ActiveTasks from '@/components/tasks/ActiveTasks';
import { colors } from '@/constants/theme';

export default function ActiveTasksScreen() {
  return (
    <View style={styles.container}>
      <ActiveTasks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgContent,
    padding: 16,
  },
});

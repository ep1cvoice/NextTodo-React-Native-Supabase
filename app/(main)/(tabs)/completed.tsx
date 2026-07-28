import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export default function CompletedTasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <Text style={styles.hint}>Skeleton — ukończone zadania w kolejnym kroku.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgContent,
    padding: 20,
    gap: 8,
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
});

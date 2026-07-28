import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export default function ActiveTasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Tasks</Text>
      <Text style={styles.hint}>Skeleton — lista zadań w kolejnym kroku (mocki).</Text>
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

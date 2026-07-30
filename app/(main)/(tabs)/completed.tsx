import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTasks } from '@/context/TasksContext';
import ToDoItem from '@/components/tasks/ToDoItem';
import { colors } from '@/constants/theme';

export default function CompletedTasksScreen() {
  const { completedTasks, toggleTask, deleteTask } = useTasks();

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        contentContainerStyle={[
          styles.listContent,
          completedTasks.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Search size={48} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No completed tasks</Text>
            <Text style={styles.emptyText}>Mark a task as done to see it here</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ToDoItem
            task={item}
            index={index}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgContent,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 40,
  },
  emptyIcon: {
    padding: 16,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTasks } from '@/context/TasksContext';
import { useTheme } from '@/context/ThemeContext';
import ToDoItem from '@/components/tasks/ToDoItem';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import type { AppColors } from '@/constants/theme';

export default function ActiveTasks() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { activeTasks, categories, tags, addTask, toggleTask, deleteTask } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.tasksList}
        contentContainerStyle={[
          styles.tasksContent,
          activeTasks.length === 0 && styles.tasksContentEmpty,
        ]}
        data={activeTasks}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Search size={68} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No active tasks</Text>
              <Text style={styles.emptyText}>Create your first task to get started</Text>
            </View>
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

      <View style={styles.activeFooter}>
        <CreateTaskButton onPress={() => setShowCreateModal(true)} />
      </View>

      <AddTaskModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAdd={addTask}
        categories={categories}
        tags={tags}
      />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 0,
    },
    tasksList: {
      flex: 1,
      minHeight: 0,
    },
    tasksContent: {
      paddingBottom: 10,
      flexGrow: 1,
    },
    tasksContentEmpty: {
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      gap: 12,
    },
    emptyIconWrap: {
      padding: 20,
      borderRadius: 999,
      backgroundColor: colors.primaryLight,
      borderWidth: 12,
      borderColor: colors.todoHighlight,
    },
    emptyTitle: {
      margin: 0,
      fontSize: 17,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    emptyText: {
      margin: 0,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
    activeFooter: {
      width: '100%',
      alignItems: 'center',
      paddingTop: 10,
    },
  });
}

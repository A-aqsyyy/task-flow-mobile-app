import { View, FlatList, StyleSheet } from 'react-native';
import TaskItem from '../../components/tasks/TaskItem';
import Header from '../../components/common/Header';
import TaskSummary from '../../components/home/TaskSummary';
import { useTasks } from '../../context/TaskContext';
import { useColors } from '../../context/useColors';

export default function HomeScreen() {
  const { tasks, toggleTask, deleteTask, editTask } = useTasks();
  const colors = useColors();
  const completed = tasks.filter((task) => task.done).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Tasks" />

      <TaskSummary completed={completed} total={tasks.length} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            title={item.title}
            done={item.done}
            day={item.day}
            onPress={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onEdit={(title) => editTask(item.id, title)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
});
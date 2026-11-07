import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import TaskItem from '../../components/tasks/TaskItem';
import FilterTabs, { Filter } from '../../components/tasks/FilterTabs';
import Header from '../../components/common/Header';
import { useTasks, DAYS, Day } from '../../context/TaskContext';
import { useColors } from '../../context/useColors';

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask, clearDone, editTask } =
    useTasks();
  const colors = useColors();
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [day, setDay] = useState<Day | undefined>(undefined);

  const handleAdd = () => {
    const title = text.trim();
    if (title === '') return;

    addTask(title, day);
    setText('');
  };

  const query = search.trim().toLowerCase();

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active' && task.done) return false;
    if (filter === 'done' && !task.done) return false;
    if (query !== '' && !task.title.toLowerCase().includes(query)) return false;
    return true;
  });

  const doneCount = tasks.filter((task) => task.done).length;

  const dayOptions: { key: Day | undefined; label: string }[] = [
    { key: undefined, label: 'No day' },
    ...DAYS.map((d) => ({ key: d, label: d })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="All Tasks" />

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Write a new task..."
          placeholderTextColor={colors.subtext}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayRow}
      >
        {dayOptions.map((option) => {
          const selected = option.key === day;
          return (
            <Pressable
              key={option.label}
              style={[
                styles.dayChip,
                { backgroundColor: selected ? '#3b82f6' : colors.card },
              ]}
              onPress={() => setDay(option.key)}
            >
              <Text
                style={{
                  color: selected ? '#ffffff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <TextInput
        style={[
          styles.search,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Search tasks..."
        placeholderTextColor={colors.subtext}
        value={search}
        onChangeText={setSearch}
      />

      <FilterTabs value={filter} onChange={setFilter} />

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subtext }]}>
            No tasks here.
          </Text>
        }
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

      {doneCount > 0 && (
        <Pressable style={styles.clearButton} onPress={clearDone}>
          <Text style={styles.clearText}>Clear {doneCount} done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dayRow: {
    flexGrow: 0,
    marginBottom: 12,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 24,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  clearText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';
import { useTasks, DAYS } from '../../context/TaskContext';
import { useColors } from '../../context/useColors';

// JS: Sunday = 0. Our DAYS list starts on Monday.
const todayKey = DAYS[(new Date().getDay() + 6) % 7];

export default function Calendar() {
  const { tasks } = useTasks();
  const colors = useColors();

  const sections = [
    ...DAYS.map((d) => ({
      label: d as string,
      items: tasks.filter((task) => task.day === d),
    })),
    { label: 'No day', items: tasks.filter((task) => !task.day) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="This Week" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map((section) => {
          const isToday = section.label === todayKey;
          return (
            <View
              key={section.label}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: isToday ? '#3b82f6' : 'transparent',
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.day, { color: colors.text }]}>
                  {section.label}
                  {isToday ? '  (Today)' : ''}
                </Text>
                <Text style={[styles.count, { color: colors.subtext }]}>
                  {section.items.length === 0
                    ? 'No tasks'
                    : `${section.items.length} task${section.items.length > 1 ? 's' : ''}`}
                </Text>
              </View>

              {section.items.map((task) => (
                <Text
                  key={task.id}
                  style={[
                    styles.taskText,
                    { color: task.done ? colors.subtext : colors.text },
                    task.done && styles.taskDone,
                  ]}
                >
                  • {task.title}
                </Text>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
  },
  taskText: {
    fontSize: 15,
    marginTop: 8,
  },
  taskDone: {
    textDecorationLine: 'line-through',
  },
});
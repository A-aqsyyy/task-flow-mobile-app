import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';
import { useTasks } from '../../context/TaskContext';
import { useColors } from '../../context/useColors';

export default function Progress() {
  const { tasks } = useTasks();
  const colors = useColors();

  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    { id: '1', label: 'Completed', value: completed },
    { id: '2', label: 'Pending', value: pending },
    { id: '3', label: 'Total', value: total },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Progress" />

      <View style={styles.row}>
        {stats.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.label, { color: colors.subtext }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.barBackground, { backgroundColor: colors.card }]}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>
      <Text style={[styles.percentText, { color: colors.text }]}>
        {percent}% done
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    paddingVertical: 24,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 4,
  },
  barBackground: {
    height: 14,
    borderRadius: 7,
    marginTop: 24,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  percentText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
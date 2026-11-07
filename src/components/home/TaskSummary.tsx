import { View, Text, StyleSheet } from 'react-native';

type Props = {
  completed: number;
  total: number;
};

export default function TaskSummary({ completed, total }: Props) {
  const message =
    total === 0
      ? 'No tasks yet. Add one on the Tasks tab.'
      : completed === total
      ? 'All done. Great work!'
      : `${completed} of ${total} tasks done`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: '#dbeafe',
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
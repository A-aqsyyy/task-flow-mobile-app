import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../context/useColors';

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
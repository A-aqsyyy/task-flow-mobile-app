import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '../../context/useColors';

export type Filter = 'all' | 'active' | 'done';

type Props = {
  value: Filter;
  onChange: (filter: Filter) => void;
};

const options: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

export default function FilterTabs({ value, onChange }: Props) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            style={[
              styles.tab,
              { backgroundColor: selected ? '#3b82f6' : colors.card },
            ]}
            onPress={() => onChange(option.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: selected ? '#ffffff' : colors.text },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
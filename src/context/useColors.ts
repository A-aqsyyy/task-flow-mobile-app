import { useColorScheme } from 'react-native';
import { useTheme } from './ThemeContext';

const light = {
  background: '#f2f2f2',
  card: '#e5e7eb',
  cardDone: '#bbf7d0',
  text: '#111827',
  subtext: '#6b7280',
  input: '#ffffff',
  border: '#d1d5db',
};

const dark = {
  background: '#111827',
  card: '#1f2937',
  cardDone: '#14532d',
  text: '#f9fafb',
  subtext: '#9ca3af',
  input: '#1f2937',
  border: '#374151',
};

export function useColors() {
  const systemScheme = useColorScheme();
  const { mode } = useTheme();

  const scheme = mode === 'auto' ? systemScheme : mode;
  return scheme === 'dark' ? dark : light;
}
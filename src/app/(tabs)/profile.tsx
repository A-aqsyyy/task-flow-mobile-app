import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/common/Header';
import { useTasks } from '../../context/TaskContext';
import { useColors } from '../../context/useColors';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { tasks, resetTasks } = useTasks();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const { session, signOut } = useAuth();
  const [name, setName] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Each account keeps its own saved name on this device
  const nameKey = `taskflow-name-${session?.user.id ?? 'guest'}`;

  const modes: { key: ThemeMode; label: string }[] = [
    { key: 'auto', label: 'Auto' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(nameKey);
        setName(saved ?? '');
      } catch (error) {
        console.warn('Could not load name', error);
      } finally {
        setLoaded(true);
      }
    };
    setLoaded(false);
    load();
  }, [nameKey]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(nameKey, name).catch((error) =>
      console.warn('Could not save name', error)
    );
  }, [name, loaded, nameKey]);

  const confirmReset = () => {
    Alert.alert(
      'Reset all data?',
      'This clears your tasks and your name. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetTasks();
            setName('');
          },
        },
      ]
    );
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const active = total - completed;

  const stats = [
    { id: '1', label: 'Total', value: total },
    { id: '2', label: 'Active', value: active },
    { id: '3', label: 'Done', value: completed },
  ];

  const initial = name.trim() === '' ? '?' : name.trim()[0].toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Profile" />

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <TextInput
          style={[
            styles.nameInput,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Type your name"
          placeholderTextColor={colors.subtext}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.email, { color: colors.subtext }]}>
          {session?.user.email ?? ''}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your tasks</Text>

      <View style={styles.row}>
        {stats.map((item) => (
          <View key={item.id} style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
      <View style={styles.row}>
        {modes.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.statCard,
              { backgroundColor: mode === item.key ? '#3b82f6' : colors.card },
            ]}
            onPress={() => setMode(item.key)}
          >
            <Text
              style={[
                styles.statLabel,
                { color: mode === item.key ? '#ffffff' : colors.text, marginTop: 0 },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.signOutButton} onPress={confirmSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>

      <Pressable style={styles.resetButton} onPress={confirmReset}>
        <Text style={styles.buttonText}>Reset all data</Text>
      </Pressable>
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
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nameInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  signOutButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 32,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
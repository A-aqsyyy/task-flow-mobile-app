import { Stack } from 'expo-router';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </TaskProvider>
    </ThemeProvider>
  );
}
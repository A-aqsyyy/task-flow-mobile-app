import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useColors } from '../context/useColors';

function RootNavigator() {
  const { session, loading } = useAuth();
  const colors = useColors();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <RootNavigator />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
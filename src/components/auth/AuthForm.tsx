import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/useColors';

type Props = {
  mode: 'login' | 'signup';
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ mode }: Props) {
  const isSignup = mode === 'signup';
  const { signIn, signUp } = useAuth();
  const colors = useColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [failures, setFailures] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const submit = async () => {
    setError(null);
    setInfo(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (isSignup) {
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Password needs 8+ characters with at least one letter and one number.');
        return;
      }
      if (password !== confirm) {
        setError('Passwords do not match.');
        return;
      }
    } else if (password === '') {
      setError('Enter your password.');
      return;
    }

    if (Date.now() < lockedUntil) {
      setError('Too many attempts. Please wait 30 seconds.');
      return;
    }

    setBusy(true);
    const result = isSignup
      ? await signUp(cleanEmail, password)
      : await signIn(cleanEmail, password);
    setBusy(false);

    if (result.error) {
      const next = failures + 1;
      if (next >= 5) {
        setLockedUntil(Date.now() + 30000);
        setFailures(0);
      } else {
        setFailures(next);
      }
      setError(result.error);
      return;
    }

    if (result.info) setInfo(result.info);
    // On success with a session, the root layout switches to the tabs by itself.
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>T</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {isSignup ? 'Create account' : 'Welcome back'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          {isSignup
            ? 'Sign up to keep your tasks safe.'
            : 'Sign in to see your tasks.'}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.input, borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Email"
            placeholderTextColor={colors.subtext}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                { backgroundColor: colors.input, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              textContentType={isSignup ? 'newPassword' : 'password'}
            />
            <Pressable
              style={styles.showButton}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>

          {isSignup && (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.input, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Confirm password"
              placeholderTextColor={colors.subtext}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <Pressable
            style={[styles.button, busy && styles.buttonBusy]}
            onPress={submit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignup ? 'Sign up' : 'Sign in'}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.subtext }}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Link href={(isSignup ? '/login' : '/signup') as any} style={styles.link}>
            {isSignup ? 'Sign in' : 'Sign up'}
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  passwordRow: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 64,
  },
  showButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 12,
    justifyContent: 'center',
  },
  showText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
    fontSize: 14,
  },
  info: {
    color: '#22c55e',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonBusy: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
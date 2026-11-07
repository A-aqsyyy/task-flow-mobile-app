

import 'react-native-get-random-values';
import * as aesjs from 'aes-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Encrypted session storage: the AES key lives in SecureStore,
// the encrypted session lives in AsyncStorage.
class LargeSecureStore {
  private async encrypt(key: string, value: string) {
    const encryptionKey = (globalThis as any).crypto.getRandomValues(
      new Uint8Array(256 / 8)
    );
    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1)
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async decrypt(key: string, value: string) {
    const keyHex = await SecureStore.getItemAsync(key);
    if (!keyHex) return null;
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(keyHex),
      new aesjs.Counter(1)
    );
    const decrypted = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    return aesjs.utils.utf8.fromBytes(decrypted);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(key, encrypted);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this.encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  throw new Error('Missing Supabase settings. Check your .env file.');
}

export const supabase = createClient(url, key, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh the session only while the app is open
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
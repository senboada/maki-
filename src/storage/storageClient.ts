import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageKey } from './storageKeys';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const storageClient = {
  async getString(key: StorageKey): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async setString(key: StorageKey, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getJson<T>(key: StorageKey): Promise<T | null> {
    const rawValue = await AsyncStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      await AsyncStorage.removeItem(key);
      return null;
    }
  },

  async setJson(key: StorageKey, value: JsonValue): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: StorageKey): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clearMakiData(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const makiKeys = keys.filter((key) => key.startsWith('maki-plus:'));

    if (makiKeys.length > 0) {
      await AsyncStorage.multiRemove(makiKeys);
    }
  }
};

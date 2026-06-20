import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { backendConfig, isSupabaseConfigured } from '../config/backend';

export const supabase = isSupabaseConfigured()
  ? createClient(backendConfig.supabaseUrl, backendConfig.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

export function getBackendMode() {
  return backendConfig.mode;
}

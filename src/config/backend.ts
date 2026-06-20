export type BackendMode = 'supabase' | 'local';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const backendConfig = {
  supabaseUrl,
  supabaseAnonKey,
  mode: supabaseUrl && supabaseAnonKey ? 'supabase' : 'local'
} satisfies {
  supabaseUrl: string;
  supabaseAnonKey: string;
  mode: BackendMode;
};

export function isSupabaseConfigured() {
  return backendConfig.mode === 'supabase';
}

import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppInput, ScreenContainer, TextLink } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation';
import { useAuth } from '../../providers';
import { colors, spacing, typography } from '../../theme';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, backendMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Ingresa correo y contrasena.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(email.trim(), password);

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
          <View style={styles.header}>
            <AnimalMascot kind="panda" size="lg" mood="happy" />
            <Text style={styles.title}>Maki+</Text>
            <Text style={styles.subtitle}>Ingreso para padres, madres o acudientes.</Text>
            <SoftFeedbackBubble
              message={backendMode === 'supabase' ? 'Backend Supabase activo' : 'Modo local activo'}
            />
          </View>

          <View style={styles.form}>
            <AppInput
              autoCapitalize="none"
              keyboardType="email-address"
              label="Correo"
              placeholder="tu-correo@email.com"
              value={email}
              onChangeText={setEmail}
            />
            <AppInput
              label="Contrasena"
              placeholder="Tu contrasena"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <AppButton
              icon="login-variant"
              title={loading ? 'Entrando...' : 'Iniciar sesion'}
              onPress={handleLogin}
            />
            <TextLink label="Crear cuenta" onPress={() => navigation.navigate('Register')} />
            <TextLink label="Olvide mi contrasena" onPress={() => navigation.navigate('ForgotPassword')} />
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl
  },
  header: {
    alignItems: 'center',
    gap: spacing.md
  },
  title: {
    ...typography.title,
    color: colors.text
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  },
  form: {
    gap: spacing.lg
  },
  error: {
    ...typography.caption,
    color: colors.secondaryDark,
    textAlign: 'center'
  }
});

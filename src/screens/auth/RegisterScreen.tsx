import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppInput, ScreenContainer, TextLink } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation';
import { useAuth } from '../../providers';
import { colors, spacing, typography } from '../../theme';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await register(email.trim(), password);

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
          <View style={styles.header}>
            <AnimalMascot kind="rabbit" size="lg" mood="celebrating" />
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Solo el acudiente crea y administra la cuenta.</Text>
          </View>

          <View style={styles.form}>
            <AppInput
              autoCapitalize="none"
              keyboardType="email-address"
              label="Correo del acudiente"
              placeholder="tu-correo@email.com"
              value={email}
              onChangeText={setEmail}
            />
            <AppInput
              label="Contrasena"
              placeholder="Minimo 6 caracteres"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <AppInput
              label="Confirmar contrasena"
              placeholder="Repite tu contrasena"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <AppButton
              icon="account-plus-outline"
              title={loading ? 'Creando...' : 'Crear cuenta'}
              onPress={handleRegister}
            />
            <TextLink label="Ya tengo cuenta" onPress={() => navigation.goBack()} />
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
    ...typography.heading,
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

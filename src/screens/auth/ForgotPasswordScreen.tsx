import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppInput, ScreenContainer, TextLink } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation';
import { useAuth } from '../../providers';
import { colors, spacing, typography } from '../../theme';

type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Ingresa tu correo.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await forgotPassword(email.trim());

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Si el correo existe, enviaremos instrucciones para recuperar la contrasena.');
    }

    setLoading(false);
  }

  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
          <View style={styles.header}>
            <AnimalMascot kind="owl" size="lg" mood="thinking" />
            <Text style={styles.title}>Recuperar contrasena</Text>
            <Text style={styles.subtitle}>Te ayudamos a volver a entrar.</Text>
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
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <SoftFeedbackBubble message={message} /> : null}
            <AppButton
              icon="email-fast-outline"
              title={loading ? 'Enviando...' : 'Enviar instrucciones'}
              onPress={handleSubmit}
            />
            <TextLink label="Volver" onPress={() => navigation.goBack()} />
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
    color: colors.text,
    textAlign: 'center'
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

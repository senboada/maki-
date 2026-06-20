import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, GameWorldBackground } from '../../components/graphics';
import { ScreenContainer } from '../../components/ui';
import { useAuth } from '../../providers';
import { colors, spacing, typography } from '../../theme';

export function LoadingScreen() {
  const { backendMode } = useAuth();

  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer scroll={false}>
        <View style={styles.content}>
          <AnimalMascot kind="turtle" size="lg" mood="thinking" />
          <View style={styles.copy}>
            <Text style={styles.title}>Preparando Maki+</Text>
            <Text style={styles.subtitle}>
              Modo {backendMode === 'supabase' ? 'Supabase' : 'local'} listo para jugar.
            </Text>
          </View>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl
  },
  copy: {
    alignItems: 'center',
    gap: spacing.sm
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
  }
});

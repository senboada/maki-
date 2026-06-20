import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground } from '../graphics';
import { AppButton, AppCard, ScreenContainer } from '../ui';
import { colors, spacing, typography } from '../../theme';

type ConsentDialogProps = {
  loading?: boolean;
  error?: string | null;
  onAccept: () => void;
};

export function ConsentDialog({ loading = false, error, onAccept }: ConsentDialogProps) {
  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        <View style={styles.content}>
          <AnimalMascot kind="turtle" size="lg" mood="happy" />
          <AppCard color={colors.surface}>
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons name="head-heart-outline" size={30} color={colors.primaryDark} />
                <Text style={styles.title}>Consentimiento</Text>
              </View>
              <Text style={styles.body}>
                Esta aplicacion esta disenada para ninos y ninas entre 4 y 10 anos.
                Como padre, madre o acudiente, confirmo que entiendo que Maki+ es
                una app educativa infantil y que soy responsable del acompanamiento
                del nino o nina durante su uso.
              </Text>
              <Text style={styles.safeText}>
                No pedimos fotos, ubicacion, telefono ni datos sensibles del nino.
              </Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <AppButton
                icon="check-decagram-outline"
                title={loading ? 'Guardando...' : 'Acepto y continuar'}
                onPress={onAccept}
              />
            </View>
          </AppCard>
        </View>
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.xl
  },
  cardContent: {
    gap: spacing.lg
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    ...typography.heading,
    color: colors.text
  },
  body: {
    ...typography.body,
    color: colors.textMuted
  },
  safeText: {
    ...typography.body,
    color: colors.primaryDark
  },
  error: {
    ...typography.caption,
    color: colors.secondaryDark,
    textAlign: 'center'
  }
});

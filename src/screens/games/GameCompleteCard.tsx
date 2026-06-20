import { StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, CelebrationStars } from '../../components/graphics';
import { AppButton, AppCard } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type GameCompleteCardProps = {
  correct: number;
  total: number;
  onHome: () => void;
  onReplay: () => void;
};

export function GameCompleteCard({ correct, onHome, onReplay, total }: GameCompleteCardProps) {
  return (
    <AppCard color={colors.surface}>
      <View style={styles.content}>
        <AnimalMascot kind="panda" size="md" mood="celebrating" />
        <Text style={styles.title}>Mision completada!</Text>
        <CelebrationStars count={Math.max(1, Math.min(5, correct))} />
        <Text style={styles.score}>Lograste {correct} de {total} estrellas.</Text>
        <AppButton icon="refresh" title="Jugar otra vez" onPress={onReplay} />
        <AppButton icon="home-heart" title="Volver al inicio" variant="soft" onPress={onHome} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.lg
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  score: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  }
});

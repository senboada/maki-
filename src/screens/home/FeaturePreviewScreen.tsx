import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, CelebrationStars, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { MainStackParamList } from '../../navigation';
import { colors, spacing, typography } from '../../theme';

type FeaturePreviewScreenProps = NativeStackScreenProps<MainStackParamList, 'FeaturePreview'>;

const featureContent = {
  practice: {
    title: 'Practicas',
    subtitle: 'Aqui elegiremos suma, resta, multiplicacion o division.',
    animal: 'owl' as const,
    icon: 'pencil-ruler' as const,
    next: 'Siguiente: selector de operacion y numero.'
  },
  games: {
    title: 'Juegos',
    subtitle: 'Aqui viviran los mini juegos con tesoros, claves y caminos.',
    animal: 'fox' as const,
    icon: 'controller-classic-outline' as const,
    next: 'Siguiente: menu visual de mini juegos.'
  }
} as const;

export function FeaturePreviewScreen({ navigation, route }: FeaturePreviewScreenProps) {
  const content = featureContent[route.params.feature];

  return (
    <GameWorldBackground variant={route.params.feature === 'practice' ? 'sky' : 'treasure'}>
      <ScreenContainer>
        <View style={styles.content}>
          <AnimalMascot kind={content.animal} size="lg" mood="happy" />
          <View style={styles.copy}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name={content.icon} size={30} color={colors.primaryDark} />
              <Text style={styles.title}>{content.title}</Text>
            </View>
            <Text style={styles.subtitle}>{content.subtitle}</Text>
          </View>

          <AppCard color={colors.surface}>
            <View style={styles.cardContent}>
              <CelebrationStars count={3} />
              <Text style={styles.cardTitle}>Vista preparada</Text>
              <Text style={styles.cardText}>{content.next}</Text>
            </View>
          </AppCard>

          <SoftFeedbackBubble message="La navegacion base ya esta funcionando" />

          <AppButton
            icon="arrow-left-circle-outline"
            title="Volver al inicio"
            variant="secondary"
            onPress={() => navigation.goBack()}
          />
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
  copy: {
    alignItems: 'center',
    gap: spacing.sm
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
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
  cardContent: {
    alignItems: 'center',
    gap: spacing.md
  },
  cardTitle: {
    ...typography.subheading,
    color: colors.text
  },
  cardText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  }
});

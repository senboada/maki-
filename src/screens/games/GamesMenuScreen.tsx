import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, spacing, typography } from '../../theme';
import { navigateToGame } from './gameHelpers';
import { gameContent, practiceGames } from '../practice/practiceContent';

type GamesMenuScreenProps = NativeStackScreenProps<AppStackParamList, 'GamesMenu'>;

export function GamesMenuScreen({ navigation }: GamesMenuScreenProps) {
  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer>
        <View style={styles.header}>
          <AnimalMascot kind="fox" size="lg" mood="celebrating" />
          <Text style={styles.title}>Juegos</Text>
          <Text style={styles.subtitle}>Elige una aventura. Las operaciones saldran mezcladas.</Text>
          <SoftFeedbackBubble message="Suma, resta, multiplicacion y division en modo sorpresa" />
        </View>

        <View style={styles.cards}>
          {practiceGames.map((gameType) => {
            const content = gameContent[gameType];

            return (
              <AppCard key={gameType} color={content.color}>
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <MaterialCommunityIcons name={content.icon} size={30} color={colors.text} />
                    <Text style={styles.cardTitle}>{content.title}</Text>
                  </View>
                  <Text style={styles.cardText}>{content.helper}</Text>
                  <Text style={styles.modeText}>Modo Juegos: operaciones mixtas</Text>
                  <AppButton
                    icon="play-circle-outline"
                    title="Iniciar aventura"
                    variant="soft"
                    onPress={() => navigateToGame(navigation, gameType, { mode: 'random' })}
                  />
                </View>
              </AppCard>
            );
          })}
        </View>
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl
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
  cards: {
    gap: spacing.lg,
    paddingBottom: spacing.xl
  },
  cardContent: {
    gap: spacing.md
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  cardTitle: {
    ...typography.subheading,
    color: colors.text
  },
  cardText: {
    ...typography.body,
    color: colors.textMuted
  },
  modeText: {
    ...typography.caption,
    color: colors.primaryDark
  }
});

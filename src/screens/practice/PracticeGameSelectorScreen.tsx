import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, spacing, typography } from '../../theme';
import { GameExitButton } from '../games/GameExitButton';
import { navigateToGame } from '../games/gameHelpers';
import { gameContent, operationContent, practiceGames } from './practiceContent';

type PracticeGameSelectorScreenProps = NativeStackScreenProps<AppStackParamList, 'PracticeGameSelector'>;

export function PracticeGameSelectorScreen({ navigation, route }: PracticeGameSelectorScreenProps) {
  const { operation, selectedNumber } = route.params;
  const operationInfo = operationContent[operation];

  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer>
        <GameExitButton label="Volver" onPress={() => navigation.goBack()} />
        <View style={styles.header}>
          <AnimalMascot kind="fox" size="lg" mood="celebrating" />
          <Text style={styles.title}>Elige un juego</Text>
          <Text style={styles.subtitle}>
            {operationInfo.title} con el numero {selectedNumber}
          </Text>
        </View>

        <View style={styles.cards}>
          {practiceGames.map((gameType) => {
            const content = gameContent[gameType];

            return (
              <AppCard key={gameType} color={content.color}>
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name={content.icon} size={28} color={colors.text} />
                    <Text style={styles.cardTitle}>{content.title}</Text>
                  </View>
                  <Text style={styles.cardText}>{content.helper}</Text>
                  <AppButton
                    icon="play-circle-outline"
                    title="Jugar"
                    variant="soft"
                    onPress={() =>
                      navigateToGame(navigation, gameType, {
                        mode: 'practice',
                        operation,
                        selectedNumber
                      })
                    }
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
  cardTitleRow: {
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
  }
});

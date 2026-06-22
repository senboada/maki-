import { useMemo } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble, type AnimalKind } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { useProfiles } from '../../providers';
import { colors, spacing, typography } from '../../theme';
import { GameExitButton } from './GameExitButton';
import { navigateToGame } from './gameHelpers';
import { gameContent, practiceGames } from '../practice/practiceContent';

type GamesMenuScreenProps = NativeStackScreenProps<AppStackParamList, 'GamesMenu'>;

const menuAnimals: AnimalKind[] = ['panda', 'fox', 'owl', 'turtle', 'rabbit', 'bird', 'dog'];

function pickMenuAnimal(seed: string) {
  const total = [...seed].reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return menuAnimals[total % menuAnimals.length] as AnimalKind;
}

export function GamesMenuScreen({ navigation }: GamesMenuScreenProps) {
  const { childProfile } = useProfiles();
  const animalSeed = childProfile?.id ?? childProfile?.name ?? 'games';
  const fallbackMenuAnimal = useMemo(() => pickMenuAnimal(animalSeed), [animalSeed]);
  const menuAnimal = childProfile?.avatarAnimal ?? fallbackMenuAnimal;

  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer>
        <GameExitButton label="Volver" onPress={() => navigation.goBack()} />
        <View style={styles.header}>
          <AnimalMascot kind={menuAnimal} size="lg" mood="celebrating" />
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

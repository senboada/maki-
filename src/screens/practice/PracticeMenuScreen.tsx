import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { AnimalMascot, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, spacing, typography } from '../../theme';
import { operationContent, operations } from './practiceContent';

type PracticeMenuScreenProps = NativeStackScreenProps<AppStackParamList, 'PracticeMenu'>;

export function PracticeMenuScreen({ navigation }: PracticeMenuScreenProps) {
  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        <View style={styles.header}>
          <AnimalMascot kind="owl" size="lg" mood="happy" />
          <Text style={styles.title}>Que quieres practicar?</Text>
          <Text style={styles.subtitle}>Elige una operacion y luego un numero para reforzar.</Text>
        </View>

        <View style={styles.grid}>
          {operations.map((operation) => {
            const content = operationContent[operation];

            return (
              <AppCard key={operation} color={content.color}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{content.title}</Text>
                  <Text style={styles.cardText}>{content.helper}</Text>
                  <AppButton
                    icon={content.icon}
                    title="Elegir"
                    variant="soft"
                    onPress={() => navigation.navigate('PracticeNumberSelector', { operation })}
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
  grid: {
    gap: spacing.lg,
    paddingBottom: spacing.xl
  },
  cardContent: {
    gap: spacing.md
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

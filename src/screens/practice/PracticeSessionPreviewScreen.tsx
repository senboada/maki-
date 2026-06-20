import { useMemo } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import { generatePracticeQuestions } from '../../domain/math';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { gameContent, operationContent } from './practiceContent';

type PracticeSessionPreviewScreenProps = NativeStackScreenProps<AppStackParamList, 'PracticeSessionPreview'>;

const totalQuestions = 5;

export function PracticeSessionPreviewScreen({ navigation, route }: PracticeSessionPreviewScreenProps) {
  const { gameType, operation, selectedNumber } = route.params;
  const operationInfo = operationContent[operation];
  const gameInfo = gameContent[gameType];
  const questions = useMemo(
    () => generatePracticeQuestions(operation, selectedNumber, totalQuestions),
    [operation, selectedNumber]
  );

  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer>
        <View style={styles.header}>
          <AnimalMascot kind="panda" size="lg" mood="celebrating" />
          <Text style={styles.title}>{gameInfo.title}</Text>
          <Text style={styles.subtitle}>
            {operationInfo.title} con el numero {selectedNumber}
          </Text>
          <SoftFeedbackBubble message="Las preguntas ya vienen del motor matematico" />
        </View>

        <AppCard color={colors.surface}>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name={gameInfo.icon} size={26} color={colors.primaryDark} />
              <Text style={styles.summaryTitle}>Sesion de practica lista</Text>
            </View>
            <Text style={styles.summaryText}>
              En la siguiente fase esta configuracion abrira el mini juego real. Por ahora puedes ver preguntas reales generadas para validar el flujo.
            </Text>
          </View>
        </AppCard>

        <View style={styles.questionList}>
          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionIndex}>Pregunta {index + 1}</Text>
              <Text style={styles.questionText}>{question.questionText} = ?</Text>
              <View style={styles.optionsRow}>
                {question.options.map((option) => (
                  <View key={option} style={styles.optionBubble}>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton
            icon="refresh"
            title="Elegir otro juego"
            variant="secondary"
            onPress={() => navigation.goBack()}
          />
          <AppButton
            icon="home-heart"
            title="Volver al inicio"
            variant="soft"
            onPress={() => navigation.popToTop()}
          />
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
  summary: {
    gap: spacing.md
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  summaryTitle: {
    ...typography.subheading,
    color: colors.text,
    flex: 1
  },
  summaryText: {
    ...typography.body,
    color: colors.textMuted
  },
  questionList: {
    gap: spacing.md,
    marginTop: spacing.xl
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md
  },
  questionIndex: {
    ...typography.caption,
    color: colors.primaryDark
  },
  questionText: {
    ...typography.subheading,
    color: colors.text
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  optionBubble: {
    minWidth: 48,
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.banana,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md
  },
  optionText: {
    ...typography.caption,
    color: colors.text
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingBottom: spacing.xl
  }
});

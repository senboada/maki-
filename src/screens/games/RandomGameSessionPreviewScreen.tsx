import { useMemo } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import { generateRandomMixedQuestions, type OperationType } from '../../domain/math';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { gameContent, operationContent } from '../practice/practiceContent';

type RandomGameSessionPreviewScreenProps = NativeStackScreenProps<AppStackParamList, 'RandomGameSessionPreview'>;

const totalQuestions = 6;

const operationMascots: Record<OperationType, string> = {
  addition: '+',
  subtraction: '-',
  multiplication: 'x',
  division: '/'
};

export function RandomGameSessionPreviewScreen({ navigation, route }: RandomGameSessionPreviewScreenProps) {
  const { gameType } = route.params;
  const gameInfo = gameContent[gameType];
  const questions = useMemo(() => generateRandomMixedQuestions(totalQuestions), [gameType]);

  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer>
        <View style={styles.header}>
          <AnimalMascot kind="fox" size="lg" mood="celebrating" />
          <Text style={styles.title}>{gameInfo.title}</Text>
          <Text style={styles.subtitle}>Aventura con operaciones mezcladas</Text>
          <SoftFeedbackBubble message="Las preguntas ya vienen del modo aleatorio" />
        </View>

        <AppCard color={colors.surface}>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name={gameInfo.icon} size={28} color={colors.primaryDark} />
              <Text style={styles.summaryTitle}>Juego listo</Text>
            </View>
            <Text style={styles.summaryText}>
              En la siguiente fase esta configuracion abrira el mini juego real. Por ahora validamos el flujo de Juegos con preguntas mixtas reales.
            </Text>
          </View>
        </AppCard>

        <View style={styles.questionList}>
          {questions.map((question, index) => {
            const operationInfo = operationContent[question.operation];

            return (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={[styles.operationBadge, { backgroundColor: operationInfo.color }]}>
                    <Text style={styles.operationBadgeText}>{operationMascots[question.operation]}</Text>
                  </View>
                  <Text style={styles.questionIndex}>Reto {index + 1}</Text>
                </View>
                <Text style={styles.questionText}>{question.questionText} = ?</Text>
                <View style={styles.optionsRow}>
                  {question.options.map((option) => (
                    <View key={option} style={styles.optionBubble}>
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
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
    color: colors.text
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
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  operationBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface
  },
  operationBadgeText: {
    ...typography.caption,
    color: colors.text
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

import { useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { DrawPath, type DrawPoint } from './DrawPath';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { createGameQuestions, getGameIntro } from './gameHelpers';

type MatchPairsGameScreenProps = NativeStackScreenProps<AppStackParamList, 'MatchPairsGame'>;

type BoardSize = {
  width: number;
  height: number;
};

const animals = ['panda', 'rabbit', 'owl', 'turtle', 'dog-side'] as const;

function shuffleNumbers(numbers: number[]) {
  return [...numbers].sort(() => Math.random() - 0.5);
}

export function MatchPairsGameScreen({ navigation, route }: MatchPairsGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params, 5), [route.params, runId]);
  const answers = useMemo(() => shuffleNumbers(questions.map((question) => question.correctAnswer)), [questions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedIndexes, setSolvedIndexes] = useState<number[]>([]);
  const [lockedLines, setLockedLines] = useState<Array<{ from: DrawPoint; to: DrawPoint }>>([]);
  const [dragPoints, setDragPoints] = useState<DrawPoint[]>([]);
  const [boardSize, setBoardSize] = useState<BoardSize>({ width: 0, height: 0 });
  const [feedback, setFeedback] = useState<string | null>(null);

  const isComplete = currentIndex >= questions.length;
  const currentQuestion = questions[currentIndex];

  const rowHeight = boardSize.height > 0 ? boardSize.height / 5 : 72;
  const operationPoint = { x: 74, y: rowHeight * currentIndex + rowHeight / 2 };
  const answerPoints = answers.map((_, index) => ({ x: Math.max(250, boardSize.width - 64), y: rowHeight * index + rowHeight / 2 }));

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setSolvedIndexes([]);
    setLockedLines([]);
    setDragPoints([]);
    setFeedback(null);
  }

  function validateRelease(point: DrawPoint) {
    if (!currentQuestion) {
      return;
    }

    const targetIndex = answerPoints.findIndex((target) => Math.hypot(point.x - target.x, point.y - target.y) < 58);

    if (targetIndex < 0) {
      setFeedback('Lleva la linea hasta una respuesta');
      setDragPoints([]);
      return;
    }

    const selectedAnswer = answers[targetIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setLockedLines((lines) => [...lines, { from: operationPoint, to: answerPoints[targetIndex] as DrawPoint }]);
      setSolvedIndexes((indexes) => [...indexes, currentIndex]);
      setFeedback('Pareja encontrada!');
      setDragPoints([]);
      setTimeout(() => setCurrentIndex((value) => value + 1), 500);
      return;
    }

    setFeedback('Casi, esa respuesta no es pareja');
    setDragPoints([]);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragPoints([operationPoint]);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setDragPoints((points) => [...points, { x: locationX, y: locationY }].slice(-80));
      },
      onPanResponderRelease: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        validateRelease({ x: locationX, y: locationY });
      }
    })
  ).current;

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <GameExitButton onPress={() => navigation.goBack()} />
        {isComplete ? (
          <GameCompleteCard correct={solvedIndexes.length} total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Encontrar la pareja</Text>
              <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              <SoftFeedbackBubble message="Arrastra desde el animal descubierto hasta su respuesta" />
            </View>

            {feedback ? <SoftFeedbackBubble message={feedback} tone={feedback.includes('Casi') ? 'tryAgain' : 'success'} /> : null}

            <AppCard color={colors.surface}>
              <View
                {...panResponder.panHandlers}
                style={styles.board}
                onLayout={(event) => setBoardSize(event.nativeEvent.layout)}
              >
                {lockedLines.map((line, index) => (
                  <DrawPath key={index} points={[line.from, line.to]} color={colors.success} strokeWidth={7} />
                ))}
                <DrawPath points={dragPoints} color={colors.primaryDark} strokeWidth={8} />

                <View style={styles.columnLeft}>
                  {questions.map((question, index) => {
                    const active = index === currentIndex;
                    const solved = solvedIndexes.includes(index);

                    return (
                      <View key={question.id} style={[styles.operationBubble, active && styles.activeBubble, solved && styles.solvedBubble]}>
                        {active || solved ? (
                          <Text style={styles.operationText}>{question.questionText}</Text>
                        ) : (
                          <MaterialCommunityIcons name={animals[index]} size={30} color={colors.text} />
                        )}
                      </View>
                    );
                  })}
                </View>

                <View style={styles.columnRight}>
                  {answers.map((answer) => (
                    <View key={answer} style={styles.answerBubble}>
                      <Text style={styles.answerText}>{answer}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </AppCard>
          </View>
        )}
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.lg
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted
  },
  board: {
    height: 430,
    position: 'relative'
  },
  columnLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-around'
  },
  columnRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-around'
  },
  operationBubble: {
    width: 142,
    minHeight: 58,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  activeBubble: {
    backgroundColor: colors.banana,
    borderColor: colors.secondary
  },
  solvedBubble: {
    backgroundColor: colors.mint,
    opacity: 0.72
  },
  operationText: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center'
  },
  answerBubble: {
    width: 92,
    height: 58,
    borderRadius: radius.xl,
    backgroundColor: colors.sky,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  answerText: {
    ...typography.subheading,
    color: colors.text
  }
});

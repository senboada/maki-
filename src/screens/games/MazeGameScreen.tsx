import { useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PanResponder, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { DrawPath, type DrawPoint } from './DrawPath';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { GameProgress } from './GameProgress';
import { createGameQuestions, getGameIntro } from './gameHelpers';

type MazeGameScreenProps = NativeStackScreenProps<AppStackParamList, 'MazeGame'>;

type BoardSize = {
  width: number;
  height: number;
};

const bubbleSize = 74;

export function MazeGameScreen({ navigation, route }: MazeGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params), [route.params, runId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [points, setPoints] = useState<DrawPoint[]>([]);
  const [boardSize, setBoardSize] = useState<BoardSize>({ width: 0, height: 0 });

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const answerOptions = currentQuestion?.options.slice(0, 3) ?? [];

  const answerTargets = useMemo(() => {
    const padding = spacing.lg;
    return [
      { x: boardSize.width - padding - bubbleSize / 2, y: padding + bubbleSize / 2 },
      { x: padding + bubbleSize / 2, y: boardSize.height - padding - bubbleSize / 2 },
      { x: boardSize.width - padding - bubbleSize / 2, y: boardSize.height - padding - bubbleSize / 2 }
    ];
  }, [boardSize]);

  function resetRound() {
    setPoints([]);
  }

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setCorrect(0);
    setFeedback(null);
    setPoints([]);
  }

  function validateRelease(point: DrawPoint) {
    if (!currentQuestion) {
      return;
    }

    const targetIndex = answerTargets.findIndex((target) => {
      const distance = Math.hypot(point.x - target.x, point.y - target.y);
      return distance < 58;
    });

    if (targetIndex < 0) {
      setFeedback('Lleva el camino hasta una respuesta');
      setTimeout(resetRound, 450);
      return;
    }

    const selectedAnswer = answerOptions[targetIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrect((value) => value + 1);
      setFeedback('Camino correcto!');
      setTimeout(() => {
        setCurrentIndex((value) => value + 1);
        resetRound();
      }, 650);
      return;
    }

    setFeedback('Ese camino no era, intenta otro');
    setTimeout(resetRound, 650);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setPoints([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setPoints((currentPoints) => [...currentPoints, { x: locationX, y: locationY }].slice(-80));
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
          <GameCompleteCard correct={correct} total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.header}>
              <AnimalMascot kind="turtle" size="md" mood="happy" />
              <Text style={styles.title}>Laberinto</Text>
              <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              <GameProgress current={currentIndex} total={questions.length} correct={correct} />
            </View>

            <AppCard color={colors.surface}>
              <View style={styles.questionBox}>
                <Text style={styles.question}>{currentQuestion?.questionText} = ?</Text>
                <Text style={styles.helper}>Traza con el dedo desde la tortuga hasta la respuesta.</Text>
              </View>
            </AppCard>

            {feedback ? <SoftFeedbackBubble message={feedback} tone={feedback.includes('correcto') ? 'success' : 'tryAgain'} /> : null}

            <View
              {...panResponder.panHandlers}
              style={styles.board}
              onLayout={(event) => setBoardSize(event.nativeEvent.layout)}
            >
              <View style={styles.crossHorizontal} />
              <View style={styles.crossVertical} />
              <DrawPath points={points} color={colors.primaryDark} strokeWidth={9} />

              <View style={[styles.cornerBubble, styles.startBubble]}>
                <MaterialCommunityIcons name="turtle" size={34} color={colors.text} />
              </View>

              {answerOptions.map((answer, index) => (
                <View key={`${answer}-${index}`} style={[styles.cornerBubble, cornerPositions[index]]}>
                  <Text style={styles.answerText}>{answer}</Text>
                </View>
              ))}
            </View>
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
    color: colors.text
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted
  },
  questionBox: {
    alignItems: 'center',
    gap: spacing.sm
  },
  question: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center'
  },
  helper: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  },
  board: {
    aspectRatio: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 4,
    borderColor: colors.surface,
    position: 'relative',
    overflow: 'hidden'
  },
  crossHorizontal: {
    position: 'absolute',
    left: 46,
    right: 46,
    top: '48%',
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.border
  },
  crossVertical: {
    position: 'absolute',
    top: 46,
    bottom: 46,
    left: '48%',
    width: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.border
  },
  cornerBubble: {
    position: 'absolute',
    width: bubbleSize,
    height: bubbleSize,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.banana,
    borderWidth: 3,
    borderColor: colors.surface,
    zIndex: 2
  },
  startBubble: {
    top: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.mint
  },
  answerText: {
    ...typography.subheading,
    color: colors.text
  }
});

const cornerPositions: ViewStyle[] = [
  {
    top: spacing.lg,
    right: spacing.lg
  },
  {
    bottom: spacing.lg,
    left: spacing.lg
  },
  {
    bottom: spacing.lg,
    right: spacing.lg
  }
];

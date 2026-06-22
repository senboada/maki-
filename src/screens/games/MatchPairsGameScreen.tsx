import { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { DrawPath, type DrawPoint } from './DrawPath';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { createUniqueAnswerGameQuestions, getGameIntro } from './gameHelpers';
import { useGameSessionRecorder } from './useGameSessionRecorder';

type MatchPairsGameScreenProps = NativeStackScreenProps<AppStackParamList, 'MatchPairsGame'>;

type BoardSize = {
  width: number;
  height: number;
};

type FeedbackState = {
  message: string;
  tone: 'success' | 'tryAgain';
} | null;

const animals = ['rabbit', 'rabbit', 'rabbit', 'rabbit', 'rabbit'] as const;
const operationBubbleWidth = 142;
const answerBubbleWidth = 92;

function shuffleNumbers(numbers: number[]) {
  return [...numbers].sort(() => Math.random() - 0.5);
}

export function MatchPairsGameScreen({ navigation, route }: MatchPairsGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createUniqueAnswerGameQuestions(route.params, 5), [route.params, runId]);
  const answers = useMemo(() => shuffleNumbers(questions.map((question) => question.correctAnswer)), [questions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedIndexes, setSolvedIndexes] = useState<number[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lockedLines, setLockedLines] = useState<Array<{ from: DrawPoint; to: DrawPoint }>>([]);
  const [dragPoints, setDragPoints] = useState<DrawPoint[]>([]);
  const [boardSize, setBoardSize] = useState<BoardSize>({ width: 0, height: 0 });
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [wrongLine, setWrongLine] = useState<{ from: DrawPoint; to: DrawPoint } | null>(null);
  const [animatedAnswerIndex, setAnimatedAnswerIndex] = useState<number | null>(null);
  const feedbackScale = useRef(new Animated.Value(0.8)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const boardShake = useRef(new Animated.Value(0)).current;
  const successPulse = useRef(new Animated.Value(1)).current;
  const revealAnim = useRef(new Animated.Value(1)).current;

  const isComplete = currentIndex >= questions.length;
  const currentQuestion = questions[currentIndex];
  const { finishSession, recordAnswer, resetRecorder } = useGameSessionRecorder({ gameType: 'match_pairs', params: route.params, totalQuestions: questions.length });

  const rowHeight = boardSize.height > 0 ? boardSize.height / 5 : 72;
  const operationPoint = { x: operationBubbleWidth, y: rowHeight * currentIndex + rowHeight / 2 };
  const answerAnchorPoints = answers.map((_, index) => ({ x: boardSize.width - answerBubbleWidth, y: rowHeight * index + rowHeight / 2 }));
  const answerTouchPoints = answers.map((_, index) => ({ x: boardSize.width - answerBubbleWidth / 2, y: rowHeight * index + rowHeight / 2 }));

  useEffect(() => {
    if (isComplete) {
      void finishSession({ correctAnswers: solvedIndexes.length });
    }
  }, [finishSession, isComplete, solvedIndexes.length]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    feedbackScale.setValue(0.8);
    feedbackOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(feedbackScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(feedbackOpacity, { duration: 180, toValue: 1, useNativeDriver: true })
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(feedbackOpacity, { duration: 180, toValue: 0, useNativeDriver: true }).start(() => {
        setFeedback(null);
      });
    }, 1600);

    return () => clearTimeout(timeout);
  }, [feedback, feedbackOpacity, feedbackScale]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    revealAnim.setValue(0);
    Animated.spring(revealAnim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
  }, [currentIndex, isComplete, revealAnim]);

  function animateSuccess(targetIndex: number) {
    setAnimatedAnswerIndex(targetIndex);
    successPulse.setValue(1);
    Animated.sequence([
      Animated.spring(successPulse, { toValue: 1.14, friction: 4, tension: 180, useNativeDriver: true }),
      Animated.spring(successPulse, { toValue: 1, friction: 5, tension: 130, useNativeDriver: true })
    ]).start(() => setAnimatedAnswerIndex(null));
  }

  function animateError(to: DrawPoint) {
    setWrongLine({ from: operationPoint, to });
    boardShake.setValue(0);
    Animated.sequence([
      Animated.timing(boardShake, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: -1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: 0, useNativeDriver: true })
    ]).start(() => setWrongLine(null));
  }

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setSolvedIndexes([]);
    setWrongAttempts(0);
    setLockedLines([]);
    setDragPoints([]);
    setFeedback(null);
    setIsDragging(false);
    setWrongLine(null);
    setAnimatedAnswerIndex(null);
    resetRecorder();
  }

  function validateRelease(point: DrawPoint) {
    if (!currentQuestion) {
      return;
    }

    const targetIndex = answerTouchPoints.findIndex((target) => Math.hypot(point.x - target.x, point.y - target.y) < 58);

    if (targetIndex < 0) {
      setFeedback({ message: 'Lleva la linea hasta una respuesta', tone: 'tryAgain' });
      animateError(point);
      setDragPoints([]);
      return;
    }

    const selectedAnswer = answers[targetIndex];

    if (selectedAnswer === undefined) {
      return;
    }

    recordAnswer(currentQuestion, selectedAnswer, selectedAnswer === currentQuestion.correctAnswer);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setLockedLines((lines) => [...lines, { from: operationPoint, to: answerAnchorPoints[targetIndex] as DrawPoint }]);
      setSolvedIndexes((indexes) => [...indexes, currentIndex]);
      setFeedback({ message: 'Pareja encontrada!', tone: 'success' });
      animateSuccess(targetIndex);
      setDragPoints([]);
      setTimeout(() => setCurrentIndex((value) => value + 1), 500);
      return;
    }

    setFeedback({ message: 'Casi, esa respuesta no es pareja', tone: 'tryAgain' });
    setWrongAttempts((value) => value + 1);
    animateError(answerAnchorPoints[targetIndex] as DrawPoint);
    setDragPoints([]);
  }

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        setWrongLine(null);
        setDragPoints([operationPoint]);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setDragPoints([operationPoint, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setIsDragging(false);
        validateRelease({ x: locationX, y: locationY });
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setDragPoints([]);
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true
    }),
    [answerAnchorPoints, answerTouchPoints, currentQuestion, operationPoint]
  );

  const boardTranslateX = boardShake.interpolate({ inputRange: [-1, 0, 1], outputRange: [-12, 0, 12] });

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer scrollEnabled={!isDragging}>
        {isComplete ? (
          <GameCompleteCard correct={solvedIndexes.length} extraAttempts={wrongAttempts} gameType="match_pairs" total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.topBar}>
              <GameExitButton onPress={() => navigation.goBack()} />
              <View style={styles.compactTitleBlock}>
                <Text style={styles.title}>Parejas</Text>
                <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{solvedIndexes.length}/{questions.length}</Text>
                <View style={styles.miniStars}>
                  {Array.from({ length: questions.length }).map((_, index) => (
                    <MaterialCommunityIcons
                      key={index}
                      name={index < solvedIndexes.length ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.secondaryDark}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.helpBubble}>
              <SoftFeedbackBubble message="Arrastra desde la operacion hasta su respuesta" />
            </View>

            <AppCard color={colors.surface}>
              <Animated.View style={{ transform: [{ translateX: boardTranslateX }] }}>
                <View
                  {...panResponder.panHandlers}
                  style={styles.board}
                  onLayout={(event) => setBoardSize(event.nativeEvent.layout)}
                >
                  {lockedLines.map((line, index) => (
                    <DrawPath key={index} points={[line.from, line.to]} color={colors.success} strokeWidth={7} />
                  ))}
                  {wrongLine ? <DrawPath points={[wrongLine.from, wrongLine.to]} color={colors.coral} strokeWidth={8} /> : null}
                  <DrawPath points={dragPoints} color={colors.primaryDark} strokeWidth={8} />

                  <View style={styles.columnLeft} pointerEvents="none">
                    {questions.map((question, index) => {
                      const active = index === currentIndex;
                      const solved = solvedIndexes.includes(index);
                      const operationContent = active ? (
                        <Animated.View style={{ opacity: revealAnim, transform: [{ scale: revealAnim }] }}>
                          <Text style={styles.operationText}>{question.questionText}</Text>
                        </Animated.View>
                      ) : (
                        <Text style={styles.operationText}>{question.questionText}</Text>
                      );

                      return (
                        <View key={question.id} style={[styles.operationBubble, active && styles.activeBubble, solved && styles.solvedBubble]}>
                          {active || solved ? operationContent : (
                            <MaterialCommunityIcons name={animals[index]} size={30} color={colors.text} />
                          )}
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.columnRight} pointerEvents="none">
                    {answers.map((answer, index) => {
                      const isAnimated = animatedAnswerIndex === index;

                      return (
                        <Animated.View
                          key={`${answer}-${index}`}
                          style={[
                            styles.answerBubble,
                            isAnimated && styles.successAnswer,
                            isAnimated && { transform: [{ scale: successPulse }] }
                          ]}
                        >
                          <Text style={styles.answerText}>{answer}</Text>
                        </Animated.View>
                      );
                    })}
                  </View>
                </View>
              </Animated.View>
            </AppCard>

            <View style={styles.feedbackSlot}>
              {feedback ? (
                <Animated.View style={{ opacity: feedbackOpacity, transform: [{ scale: feedbackScale }] }}>
                  <SoftFeedbackBubble message={feedback.message} tone={feedback.tone} />
                </Animated.View>
              ) : null}
            </View>
          </View>
        )}
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  compactTitleBlock: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center'
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted
  },
  progressPill: {
    minWidth: 88,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    gap: 2
  },
  progressText: {
    ...typography.caption,
    color: colors.primaryDark
  },
  miniStars: {
    flexDirection: 'row'
  },
  helpBubble: {
    alignItems: 'center'
  },
  feedbackSlot: {
    alignItems: 'center',
    minHeight: 58
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
    width: operationBubbleWidth,
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
    width: answerBubbleWidth,
    height: 58,
    borderRadius: radius.xl,
    backgroundColor: colors.sky,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  successAnswer: {
    backgroundColor: colors.mint,
    borderColor: colors.success
  },
  answerText: {
    ...typography.subheading,
    color: colors.text
  }
});

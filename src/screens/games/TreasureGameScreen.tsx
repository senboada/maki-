import { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, CelebrationStars, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { GameExitButton } from './GameExitButton';
import { createGameQuestions, getGameIntro } from './gameHelpers';
import type { MathQuestion } from '../../domain/math';

type TreasureGameScreenProps = NativeStackScreenProps<AppStackParamList, 'TreasureGame'>;

type PathChoice = {
  answer: number;
  x: number;
  y: number;
  midX: number;
  midY: number;
  runnerX: number;
  runnerY: number;
  curve: string;
};

type FeedbackState = {
  message: string;
  tone: 'success' | 'error';
} | null;

const sceneHeight = 430;
const defaultSceneWidth = 320;
const answerBubbleWidth = 58;
const answerBubbleGap = 14;
const answerBubbleTop = 122;
const treasureAnswerCount = 4;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createExtraAnswer(correctAnswer: number, usedAnswers: Set<number>) {
  let distance = 4;

  while (distance < 30) {
    const candidates = [correctAnswer - distance, correctAnswer + distance].filter((value) => value >= 0);
    const candidate = shuffle(candidates).find((value) => !usedAnswers.has(value));

    if (candidate !== undefined) {
      return candidate;
    }

    distance += 3;
  }

  let fallback = 0;

  while (usedAnswers.has(fallback)) {
    fallback += 1;
  }

  return fallback;
}

function getHorizontalAnswerX(sceneWidth: number, total: number, index: number) {
  const totalWidth = total * answerBubbleWidth + (total - 1) * answerBubbleGap;
  return (sceneWidth - totalWidth) / 2 + index * (answerBubbleWidth + answerBubbleGap);
}

function getRoadStart(sceneWidth: number) {
  return { x: sceneWidth / 2, y: 360 };
}

function getRunnerStart(sceneWidth: number) {
  return { x: sceneWidth / 2 - 36, y: 324 };
}

function createRoadCurve(sceneWidth: number, answerX: number, answerY: number, total: number, index: number) {
  const roadStart = getRoadStart(sceneWidth);
  const endX = answerX + answerBubbleWidth / 2;
  const endY = answerY + 46;
  const horizontalOffsets = [-105, -36, 36, 105];
  const horizontalBias = horizontalOffsets[index] ?? 0;
  const midX = roadStart.x + (endX - roadStart.x) * 0.48;
  const midY = 276 - Math.abs(horizontalBias) * 0.04;
  const controlOneX = roadStart.x + horizontalBias * 0.12;
  const controlOneY = 336;
  const controlTwoX = endX;
  const controlTwoY = endY + 72;

  return {
    curve: `M${roadStart.x} ${roadStart.y} C${controlOneX} ${controlOneY} ${midX} ${midY} ${midX} ${midY} C${controlTwoX} ${controlTwoY} ${endX} ${endY + 34} ${endX} ${endY}`,
    midX: midX - 34,
    midY: midY - 34,
    runnerX: endX - 36,
    runnerY: endY - 42
  };
}

function createTreasureChoices(question: MathQuestion, sceneWidth: number): PathChoice[] {
  const displayCount = treasureAnswerCount;
  const usedAnswers = new Set<number>();
  const answers = shuffle([question.correctAnswer, ...question.options.filter((option) => option !== question.correctAnswer)]);

  while (answers.length < displayCount) {
    const extraAnswer = createExtraAnswer(question.correctAnswer, new Set([...usedAnswers, ...answers]));
    answers.push(extraAnswer);
  }

  const selectedAnswers = shuffle([question.correctAnswer, ...answers.filter((answer) => answer !== question.correctAnswer)]).slice(0, displayCount);

  if (!selectedAnswers.includes(question.correctAnswer)) {
    selectedAnswers[0] = question.correctAnswer;
  }

  return selectedAnswers.map((answer, index) => {
    const x = getHorizontalAnswerX(sceneWidth, selectedAnswers.length, index);
    const y = answerBubbleTop;
    const road = createRoadCurve(sceneWidth, x, y, selectedAnswers.length, index);
    usedAnswers.add(answer);

    return {
      answer,
      x,
      y,
      midX: road.midX,
      midY: road.midY,
      runnerX: road.runnerX,
      runnerY: road.runnerY,
      curve: road.curve
    };
  });
}

export function TreasureGameScreen({ navigation, route }: TreasureGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params), [route.params, runId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCrash, setShowCrash] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [sceneWidth, setSceneWidth] = useState(defaultSceneWidth);

  const runnerX = useRef(new Animated.Value(getRunnerStart(defaultSceneWidth).x)).current;
  const runnerY = useRef(new Animated.Value(getRunnerStart(defaultSceneWidth).y)).current;
  const runnerScale = useRef(new Animated.Value(1)).current;
  const sceneScale = useRef(new Animated.Value(1)).current;
  const chestScale = useRef(new Animated.Value(0.7)).current;
  const feedbackScale = useRef(new Animated.Value(0.8)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length || showFinal;
  const choices = useMemo<PathChoice[]>(() => {
    if (!currentQuestion) {
      return [];
    }

    return createTreasureChoices(currentQuestion, sceneWidth);
  }, [currentQuestion, sceneWidth]);

  useEffect(() => {
    if (!isAnimating && !showFinal) {
      const runnerStart = getRunnerStart(sceneWidth);
      runnerX.setValue(runnerStart.x);
      runnerY.setValue(runnerStart.y);
    }
  }, [isAnimating, runnerX, runnerY, sceneWidth, showFinal]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    feedbackScale.setValue(0.8);
    feedbackOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(feedbackScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(feedbackOpacity, { duration: 180, toValue: 1, useNativeDriver: true })
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(feedbackOpacity, { duration: 180, toValue: 0, useNativeDriver: true }).start(() => {
        setFeedback(null);
      });
    }, 1400);

    return () => clearTimeout(timeout);
  }, [feedback, feedbackOpacity, feedbackScale]);

  function resetRunner() {
    const runnerStart = getRunnerStart(sceneWidth);
    runnerX.setValue(runnerStart.x);
    runnerY.setValue(runnerStart.y);
    runnerScale.setValue(1);
    sceneScale.setValue(1);
    setShowCrash(false);
  }

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setCorrect(0);
    setFeedback(null);
    setIsAnimating(false);
    setShowFinal(false);
    chestScale.setValue(0.7);
    resetRunner();
  }

  function animateFinal() {
    setShowFinal(true);
    setFeedback({ message: 'Tesoro encontrado!', tone: 'success' });
    Animated.loop(
      Animated.sequence([
        Animated.spring(chestScale, { toValue: 1.08, useNativeDriver: true }),
        Animated.spring(chestScale, { toValue: 0.96, useNativeDriver: true })
      ]),
      { iterations: 4 }
    ).start();
  }

  function goNextRound() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      animateFinal();
      return;
    }

    setCurrentIndex(nextIndex);
    setFeedback(null);
    resetRunner();
  }

  function animateWrong() {
    const runnerStart = getRunnerStart(sceneWidth);
    setShowCrash(true);
    setFeedback({ message: 'Ups! camino bloqueado', tone: 'error' });

    Animated.sequence([
      Animated.spring(runnerScale, { toValue: 0.88, useNativeDriver: true }),
      Animated.spring(runnerScale, { toValue: 1.08, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(runnerX, { toValue: runnerStart.x, useNativeDriver: true }),
        Animated.spring(runnerY, { toValue: runnerStart.y, useNativeDriver: true }),
        Animated.spring(runnerScale, { toValue: 1, useNativeDriver: true })
      ])
    ]).start(() => {
      setShowCrash(false);
      setIsAnimating(false);
    });
  }

  function animateCorrect() {
    setCorrect((value) => value + 1);
    setFeedback({ message: 'Buen camino!', tone: 'success' });

    Animated.sequence([
      Animated.parallel([
        Animated.spring(sceneScale, { toValue: 1.12, friction: 7, useNativeDriver: true }),
        Animated.spring(runnerScale, { toValue: 1.14, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.spring(sceneScale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(runnerScale, { toValue: 1, useNativeDriver: true })
      ])
    ]).start(() => {
      setIsAnimating(false);
      goNextRound();
    });
  }

  function choosePath(choice: PathChoice) {
    if (!currentQuestion || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setFeedback(null);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(runnerX, { duration: 360, toValue: choice.midX, useNativeDriver: true }),
        Animated.timing(runnerY, { duration: 360, toValue: choice.midY, useNativeDriver: true }),
        Animated.spring(runnerScale, { toValue: 1.08, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(runnerX, { duration: 360, toValue: choice.runnerX, useNativeDriver: true }),
        Animated.timing(runnerY, { duration: 360, toValue: choice.runnerY, useNativeDriver: true }),
        Animated.spring(runnerScale, { toValue: 1, useNativeDriver: true })
      ])
    ]).start(() => {
      if (choice.answer === currentQuestion.correctAnswer) {
        animateCorrect();
      } else {
        animateWrong();
      }
    });
  }

  return (
    <GameWorldBackground variant="treasure">
      <ScreenContainer scroll={false}>
        {isComplete ? (
          <TreasureFinalCelebration
            chestScale={chestScale}
            correct={correct}
            total={questions.length}
            onHome={() => navigation.popToTop()}
            onReplay={resetGame}
          />
        ) : (
          <View style={styles.content}>
            <View style={styles.topBar}>
              <GameExitButton onPress={() => navigation.goBack()} />
              <View style={styles.compactTitleBlock}>
                <Text style={styles.title}>Tesoro</Text>
                <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
                <View style={styles.miniStars}>
                  {Array.from({ length: questions.length }).map((_, index) => (
                    <MaterialCommunityIcons
                      key={index}
                      name={index < correct ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.secondaryDark}
                    />
                  ))}
                </View>
              </View>
            </View>

            <AppCard color={colors.surface}>
              <View style={styles.questionWrap}>
                <MaterialCommunityIcons name="map-marker-question-outline" size={24} color={colors.primaryDark} />
                <Text style={styles.question}>{currentQuestion?.questionText} = ?</Text>
              </View>
            </AppCard>

            <Animated.View style={[styles.scene, { transform: [{ scale: sceneScale }] }]}> 
              <LinearGradient
                colors={[colors.sky, colors.backgroundAlt, colors.mint]}
                style={styles.sceneBg}
                onLayout={(event) => setSceneWidth(event.nativeEvent.layout.width)}
              >
                <Svg pointerEvents="none" height="100%" style={StyleSheet.absoluteFill} width="100%">
                  <Rect fill="#BDE0FE" height="170" width={sceneWidth} x="0" y="0" />
                  <Circle cx={sceneWidth - 56} cy="56" fill="#FFE066" r="22" />
                  <Path d={`M0 176 C${sceneWidth * 0.17} 142 ${sceneWidth * 0.35} 150 ${sceneWidth * 0.5} 176 C${sceneWidth * 0.65} 146 ${sceneWidth * 0.84} 144 ${sceneWidth} 176 L${sceneWidth} 248 C${sceneWidth * 0.79} 222 ${sceneWidth * 0.66} 224 ${sceneWidth * 0.5} 248 C${sceneWidth * 0.34} 222 ${sceneWidth * 0.18} 224 0 248 Z`} fill="#76D99D" />
                  <Path d={`M0 218 C${sceneWidth * 0.2} 186 ${sceneWidth * 0.35} 196 ${sceneWidth * 0.5} 220 C${sceneWidth * 0.66} 190 ${sceneWidth * 0.82} 196 ${sceneWidth} 220 L${sceneWidth} 314 C${sceneWidth * 0.81} 286 ${sceneWidth * 0.65} 286 ${sceneWidth * 0.5} 314 C${sceneWidth * 0.35} 286 ${sceneWidth * 0.19} 286 0 314 Z`} fill="#A8E6CF" />
                  <Path d={`M0 280 C${sceneWidth * 0.22} 246 ${sceneWidth * 0.37} 258 ${sceneWidth * 0.5} 284 C${sceneWidth * 0.66} 252 ${sceneWidth * 0.84} 260 ${sceneWidth} 284 L${sceneWidth} 430 L0 430 Z`} fill="#BFEAB5" />
                  <Path d={`M0 352 C${sceneWidth * 0.22} 326 ${sceneWidth * 0.36} 330 ${sceneWidth * 0.5} 354 C${sceneWidth * 0.66} 326 ${sceneWidth * 0.84} 330 ${sceneWidth} 354 L${sceneWidth} 430 L0 430 Z`} fill="#D6F2C9" />
                  {choices.map((choice) => (
                    <Path key={`road-${choice.answer}`} d={choice.curve} fill="none" stroke="#7C858D" strokeLinecap="round" strokeWidth="24" />
                  ))}
                  {choices.map((choice) => (
                    <Path
                      key={`line-${choice.answer}`}
                      d={choice.curve}
                      fill="none"
                      stroke="#FFE066"
                      strokeDasharray="8 14"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />
                  ))}
                </Svg>

                <View style={[styles.startMarker, { left: getRoadStart(sceneWidth).x - 18 }]} />

                <View style={styles.choiceLayer}>
                  {choices.map((choice) => (
                    <Pressable
                      accessibilityRole="button"
                      disabled={isAnimating}
                      key={choice.answer}
                      onPress={() => choosePath(choice)}
                      style={[styles.choiceBubble, { left: choice.x, top: choice.y }]}
                    >
                      <Text style={styles.choiceText}>{choice.answer}</Text>
                    </Pressable>
                  ))}
                </View>

                {showCrash ? (
                  <View style={styles.crashBubble}>
                    <MaterialCommunityIcons name="pine-tree" size={28} color={colors.text} />
                  </View>
                ) : null}

                {feedback ? (
                  <Animated.View
                    style={[
                      styles.floatingFeedback,
                      feedback.tone === 'success' ? styles.feedbackSuccess : styles.feedbackError,
                      { opacity: feedbackOpacity, transform: [{ scale: feedbackScale }] }
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={feedback.tone === 'success' ? 'star-four-points' : 'alert-circle-outline'}
                      size={22}
                      color={colors.text}
                    />
                    <Text style={styles.feedbackText}>{feedback.message}</Text>
                  </Animated.View>
                ) : null}

                <Animated.View
                  style={[
                    styles.runner,
                    {
                      transform: [
                        { translateX: runnerX },
                        { translateY: runnerY },
                        { scale: runnerScale }
                      ]
                    }
                  ]}
                >
                  <AnimalMascot kind="fox" showBadge={false} size="sm" mood="celebrating" />
                </Animated.View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}
      </ScreenContainer>
    </GameWorldBackground>
  );
}

type TreasureFinalCelebrationProps = {
  chestScale: Animated.Value;
  correct: number;
  total: number;
  onHome: () => void;
  onReplay: () => void;
};

function TreasureFinalCelebration({ chestScale, correct, onHome, onReplay, total }: TreasureFinalCelebrationProps) {
  return (
    <View style={styles.finalWrap}>
      <AppCard color={colors.surface}>
        <View style={styles.finalContent}>
          <AnimalMascot kind="fox" showBadge={false} size="lg" mood="celebrating" />
          <Animated.View style={[styles.chest, { transform: [{ scale: chestScale }] }]}> 
            <MaterialCommunityIcons name="treasure-chest" size={82} color={colors.secondaryDark} />
          </Animated.View>
          <Text style={styles.finalTitle}>Encontraste el tesoro!</Text>
          <Text style={styles.finalText}>Ganaste {correct} de {total} estrellas en esta aventura.</Text>
          <CelebrationStars count={5} />
          <AppButton icon="refresh" title="Jugar otra vez" onPress={onReplay} />
          <AppButton icon="home-heart" title="Volver al inicio" variant="soft" onPress={onHome} />
        </View>
      </AppCard>
    </View>
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
  questionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  question: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  scene: {
    height: sceneHeight,
    minHeight: 360,
    borderRadius: radius.xl,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: colors.sky
  },
  sceneBg: {
    flex: 1,
    position: 'relative'
  },
  choiceLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },
  choiceBubble: {
    position: 'absolute',
    width: answerBubbleWidth,
    minHeight: 46,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  choiceText: {
    ...typography.subheading,
    color: colors.text
  },
  runner: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 4
  },
  startMarker: {
    position: 'absolute',
    top: getRunnerStart(defaultSceneWidth).y + 18,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    zIndex: 2
  },
  crashBubble: {
    position: 'absolute',
    bottom: 128,
    right: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.dangerSoft,
    borderWidth: 3,
    borderColor: colors.surface,
    padding: spacing.sm,
    zIndex: 3
  },
  floatingFeedback: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    zIndex: 5
  },
  feedbackSuccess: {
    backgroundColor: colors.mint
  },
  feedbackError: {
    backgroundColor: colors.dangerSoft
  },
  feedbackText: {
    ...typography.caption,
    color: colors.text
  },
  finalWrap: {
    flex: 1,
    justifyContent: 'center'
  },
  finalContent: {
    alignItems: 'center',
    gap: spacing.lg
  },
  chest: {
    width: 122,
    height: 122,
    borderRadius: radius.xl,
    backgroundColor: colors.banana,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surface
  },
  finalTitle: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  finalText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  }
});

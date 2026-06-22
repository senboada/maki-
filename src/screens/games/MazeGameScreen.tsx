import { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, PanResponder, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Line, Rect } from 'react-native-svg';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppCard, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { DrawPath, type DrawPoint } from './DrawPath';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { createGameQuestions, getGameIntro } from './gameHelpers';

type MazeGameScreenProps = NativeStackScreenProps<AppStackParamList, 'MazeGame'>;

type BoardSize = {
  width: number;
  height: number;
};

type MazeCell = {
  col: number;
  row: number;
};

type MazeAnswer = {
  value: number;
  cell: MazeCell;
};

type MazeWall = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type FeedbackState = {
  message: string;
  tone: 'success' | 'tryAgain';
} | null;

const columns = 7;
const rows = 10;
const bubbleSize = 48;
const startCell: MazeCell = { col: 0, row: 0 };
const topRightCell: MazeCell = { col: columns - 1, row: 0 };
const bottomLeftCell: MazeCell = { col: 0, row: rows - 1 };
const bottomRightCell: MazeCell = { col: columns - 1, row: rows - 1 };
const jungleIcons = ['leaf', 'ladybug', 'flower', 'paw', 'leaf-maple', 'bee-flower', 'sprout', 'butterfly'] as const;

const mazeConnections: Array<[MazeCell, MazeCell]> = [
  [{ col: 0, row: 0 }, { col: 0, row: 1 }],
  [{ col: 0, row: 1 }, { col: 1, row: 1 }],
  [{ col: 1, row: 1 }, { col: 2, row: 1 }],
  [{ col: 2, row: 1 }, { col: 2, row: 2 }],
  [{ col: 2, row: 2 }, { col: 3, row: 2 }],
  [{ col: 3, row: 2 }, { col: 3, row: 1 }],
  [{ col: 3, row: 1 }, { col: 4, row: 1 }],
  [{ col: 4, row: 1 }, { col: 5, row: 1 }],
  [{ col: 5, row: 1 }, { col: 6, row: 1 }],
  [{ col: 6, row: 1 }, { col: 6, row: 0 }],
  [{ col: 3, row: 2 }, { col: 3, row: 3 }],
  [{ col: 3, row: 3 }, { col: 2, row: 3 }],
  [{ col: 2, row: 3 }, { col: 1, row: 3 }],
  [{ col: 1, row: 3 }, { col: 1, row: 4 }],
  [{ col: 1, row: 4 }, { col: 2, row: 4 }],
  [{ col: 2, row: 4 }, { col: 3, row: 4 }],
  [{ col: 3, row: 4 }, { col: 3, row: 5 }],
  [{ col: 3, row: 5 }, { col: 2, row: 5 }],
  [{ col: 2, row: 5 }, { col: 2, row: 6 }],
  [{ col: 2, row: 6 }, { col: 1, row: 6 }],
  [{ col: 1, row: 6 }, { col: 0, row: 6 }],
  [{ col: 0, row: 6 }, { col: 0, row: 7 }],
  [{ col: 0, row: 7 }, { col: 1, row: 7 }],
  [{ col: 1, row: 7 }, { col: 1, row: 8 }],
  [{ col: 1, row: 8 }, { col: 0, row: 8 }],
  [{ col: 0, row: 8 }, { col: 0, row: 9 }],
  [{ col: 3, row: 5 }, { col: 4, row: 5 }],
  [{ col: 4, row: 5 }, { col: 5, row: 5 }],
  [{ col: 5, row: 5 }, { col: 5, row: 6 }],
  [{ col: 5, row: 6 }, { col: 6, row: 6 }],
  [{ col: 6, row: 6 }, { col: 6, row: 7 }],
  [{ col: 6, row: 7 }, { col: 5, row: 7 }],
  [{ col: 5, row: 7 }, { col: 5, row: 8 }],
  [{ col: 5, row: 8 }, { col: 6, row: 8 }],
  [{ col: 6, row: 8 }, { col: 6, row: 9 }],
  [{ col: 4, row: 1 }, { col: 4, row: 2 }],
  [{ col: 4, row: 2 }, { col: 5, row: 2 }],
  [{ col: 5, row: 2 }, { col: 5, row: 3 }],
  [{ col: 5, row: 3 }, { col: 6, row: 3 }],
  [{ col: 0, row: 2 }, { col: 1, row: 2 }],
  [{ col: 0, row: 4 }, { col: 0, row: 5 }],
  [{ col: 4, row: 4 }, { col: 5, row: 4 }],
  [{ col: 5, row: 4 }, { col: 6, row: 4 }],
  [{ col: 3, row: 7 }, { col: 4, row: 7 }],
  [{ col: 3, row: 7 }, { col: 3, row: 8 }],
  [{ col: 3, row: 8 }, { col: 2, row: 8 }],
  [{ col: 2, row: 8 }, { col: 2, row: 9 }],
  [{ col: 4, row: 8 }, { col: 4, row: 9 }]
];

function getCellKey(cell: MazeCell) {
  return `${cell.col},${cell.row}`;
}

function getConnectionKey(from: MazeCell, to: MazeCell) {
  return [getCellKey(from), getCellKey(to)].sort().join('|');
}

const connectionSet = new Set(mazeConnections.map(([from, to]) => getConnectionKey(from, to)));
const traversableCells = new Set(mazeConnections.flatMap(([from, to]) => [getCellKey(from), getCellKey(to)]));
const blockedCells = Array.from({ length: rows }).flatMap((_, row) => (
  Array.from({ length: columns }).map((__, col) => ({ col, row })).filter((cell) => !traversableCells.has(getCellKey(cell)))
));
const blockedDecorations = blockedCells.filter((_, index) => index % 2 === 0).slice(0, jungleIcons.length).map((cell, index) => ({
  cell,
  icon: jungleIcons[index] as (typeof jungleIcons)[number],
  color: index % 3 === 0 ? colors.secondaryDark : index % 3 === 1 ? colors.coral : colors.primaryDark
}));

function shuffleNumbers(numbers: number[]) {
  return [...numbers].sort(() => Math.random() - 0.5);
}

function areCellsEqual(first: MazeCell, second: MazeCell) {
  return first.col === second.col && first.row === second.row;
}

function areCellsConnected(first: MazeCell, second: MazeCell) {
  return areCellsEqual(first, second) || connectionSet.has(getConnectionKey(first, second));
}

function getCellCenter(cell: MazeCell, boardSize: BoardSize): DrawPoint {
  return {
    x: ((cell.col + 0.5) / columns) * boardSize.width,
    y: ((cell.row + 0.5) / rows) * boardSize.height
  };
}

function getCellAtPoint(point: DrawPoint, boardSize: BoardSize): MazeCell | null {
  if (boardSize.width <= 0 || boardSize.height <= 0) {
    return null;
  }

  const col = Math.floor((point.x / boardSize.width) * columns);
  const row = Math.floor((point.y / boardSize.height) * rows);

  if (col < 0 || col >= columns || row < 0 || row >= rows) {
    return null;
  }

  return { col, row };
}

function createMazeAnswers(correctAnswer: number, options: number[]): MazeAnswer[] {
  const answers = [correctAnswer, ...options.filter((option) => option !== correctAnswer)];

  while (answers.length < 3) {
    const candidate = correctAnswer + answers.length + 1;

    if (!answers.includes(candidate)) {
      answers.push(candidate);
    }
  }

  const selectedAnswers = shuffleNumbers(answers.slice(0, 3));
  const targets = [topRightCell, bottomLeftCell, bottomRightCell];

  return selectedAnswers.map((answer, index) => ({
    value: answer,
    cell: targets[index] as MazeCell
  }));
}

function createMazeWalls(): MazeWall[] {
  const walls: MazeWall[] = [];

  for (let col = 0; col <= columns; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      const leftCell = { col: col - 1, row };
      const rightCell = { col, row };
      const isOuterWall = col === 0 || col === columns;
      const isClosedWall = !isOuterWall && !areCellsConnected(leftCell, rightCell);

      if (isOuterWall || isClosedWall) {
        walls.push({ x1: col, y1: row, x2: col, y2: row + 1 });
      }
    }
  }

  for (let row = 0; row <= rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const topCell = { col, row: row - 1 };
      const bottomCell = { col, row };
      const isOuterWall = row === 0 || row === rows;
      const isClosedWall = !isOuterWall && !areCellsConnected(topCell, bottomCell);

      if (isOuterWall || isClosedWall) {
        walls.push({ x1: col, y1: row, x2: col + 1, y2: row });
      }
    }
  }

  return walls;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const mazeWalls = createMazeWalls();

export function MazeGameScreen({ navigation, route }: MazeGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params), [route.params, runId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [paintedCells, setPaintedCells] = useState<MazeCell[]>([]);
  const [wrongPath, setWrongPath] = useState<DrawPoint[]>([]);
  const [solvedPath, setSolvedPath] = useState<DrawPoint[]>([]);
  const [boardSize, setBoardSize] = useState<BoardSize>({ width: 0, height: 0 });
  const [animatedAnswerIndex, setAnimatedAnswerIndex] = useState<number | null>(null);
  const [isRunnerMoving, setIsRunnerMoving] = useState(false);
  const paintedCellsRef = useRef<MazeCell[]>([]);
  const feedbackScale = useRef(new Animated.Value(0.8)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const boardShake = useRef(new Animated.Value(0)).current;
  const successPulse = useRef(new Animated.Value(1)).current;
  const startPulse = useRef(new Animated.Value(1)).current;
  const runnerX = useRef(new Animated.Value(0)).current;
  const runnerY = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const answerOptions = useMemo(() => {
    if (!currentQuestion) {
      return [];
    }

    return createMazeAnswers(currentQuestion.correctAnswer, currentQuestion.options);
  }, [currentQuestion]);
  const paintedPath = paintedCells.map((cell) => getCellCenter(cell, boardSize));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.spring(startPulse, { toValue: 1.08, friction: 5, tension: 90, useNativeDriver: true }),
        Animated.spring(startPulse, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true })
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [startPulse]);

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
      Animated.timing(feedbackOpacity, { duration: 180, toValue: 0, useNativeDriver: true }).start(() => setFeedback(null));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [feedback, feedbackOpacity, feedbackScale]);

  function setPaintedPath(nextCells: MazeCell[]) {
    paintedCellsRef.current = nextCells;
    setPaintedCells(nextCells);
  }

  function resetRound() {
    paintedCellsRef.current = [];
    setPaintedCells([]);
    setWrongPath([]);
    setSolvedPath([]);
    setAnimatedAnswerIndex(null);
    setIsRunnerMoving(false);
  }

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setCorrect(0);
    setFeedback(null);
    resetRound();
  }

  function shakeBoard() {
    boardShake.setValue(0);
    Animated.sequence([
      Animated.timing(boardShake, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: -1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(boardShake, { duration: 55, toValue: 0, useNativeDriver: true })
    ]).start();
  }

  function animateSuccess(targetIndex: number, nextCells: MazeCell[]) {
    const route = nextCells.map((cell) => getCellCenter(cell, boardSize));
    const firstPoint = route[0];

    setSolvedPath(route);
    setAnimatedAnswerIndex(targetIndex);
    successPulse.setValue(1);

    if (!firstPoint) {
      return;
    }

    setIsRunnerMoving(true);
    runnerX.setValue(firstPoint.x - bubbleSize / 2);
    runnerY.setValue(firstPoint.y - bubbleSize / 2);

    if (route.length < 2) {
      setIsRunnerMoving(false);
      return;
    }

    Animated.sequence(route.slice(1).map((point) => (
      Animated.parallel([
        Animated.timing(runnerX, { duration: 150, toValue: point.x - bubbleSize / 2, useNativeDriver: true }),
        Animated.timing(runnerY, { duration: 150, toValue: point.y - bubbleSize / 2, useNativeDriver: true })
      ])
    ))).start(() => {
      Animated.sequence([
        Animated.spring(successPulse, { toValue: 1.16, friction: 4, tension: 180, useNativeDriver: true }),
        Animated.spring(successPulse, { toValue: 1, friction: 5, tension: 130, useNativeDriver: true })
      ]).start(() => {
        setTimeout(() => {
          setCurrentIndex((value) => value + 1);
          resetRound();
        }, 350);
      });
    });
  }

  function reachAnswer(cell: MazeCell, nextCells: MazeCell[]) {
    if (!currentQuestion) {
      return;
    }

    const targetIndex = answerOptions.findIndex((answer) => areCellsEqual(answer.cell, cell));

    if (targetIndex < 0) {
      return;
    }

    const selectedAnswer = answerOptions[targetIndex];

    if (!selectedAnswer) {
      return;
    }

    if (selectedAnswer.value === currentQuestion.correctAnswer) {
      setCorrect((value) => value + 1);
      setFeedback({ message: 'Camino correcto!', tone: 'success' });
      setPaintedPath([]);
      animateSuccess(targetIndex, nextCells);
      return;
    }

    Vibration.vibrate(60);
    setFeedback({ message: 'Esa salida no era, busca otra', tone: 'tryAgain' });
    setWrongPath(nextCells.map((pathCell) => getCellCenter(pathCell, boardSize)));
    setPaintedPath([]);
    shakeBoard();
    setTimeout(() => setWrongPath([]), 650);
  }

  function tryPaintCell(cell: MazeCell) {
    const currentCells = paintedCellsRef.current;

    if (currentCells.length === 0) {
      if (!areCellsEqual(cell, startCell)) {
        return;
      }

      setPaintedPath([startCell]);
      return;
    }

    const lastCell = currentCells[currentCells.length - 1] as MazeCell;

    if (areCellsEqual(cell, lastCell)) {
      return;
    }

    const previousCell = currentCells[currentCells.length - 2];

    if (previousCell && areCellsEqual(cell, previousCell)) {
      const nextCells = currentCells.slice(0, -1);
      setPaintedPath(nextCells);
      return;
    }

    if (!areCellsConnected(lastCell, cell)) {
      return;
    }

    const nextCells = [...currentCells, cell];
    setPaintedPath(nextCells);
    reachAnswer(cell, nextCells);
  }

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event) => {
        if (isRunnerMoving) {
          return;
        }

        const { locationX, locationY } = event.nativeEvent;
        const touchedCell = getCellAtPoint({ x: locationX, y: locationY }, boardSize);
        const currentCells = paintedCellsRef.current;

        if (!touchedCell) {
          return;
        }

        if (currentCells.length === 0 && !areCellsEqual(touchedCell, startCell)) {
          setFeedback({ message: 'Empieza desde el animal', tone: 'tryAgain' });
          return;
        }

        const lastCell = currentCells[currentCells.length - 1];

        if (lastCell && !areCellsEqual(touchedCell, lastCell) && !areCellsConnected(lastCell, touchedCell)) {
          setFeedback({ message: 'Continua desde tu camino', tone: 'tryAgain' });
          return;
        }

        tryPaintCell(touchedCell);
      },
      onPanResponderMove: (event) => {
        if (isRunnerMoving) {
          return;
        }

        const { locationX, locationY } = event.nativeEvent;
        const touchedCell = getCellAtPoint({ x: locationX, y: locationY }, boardSize);

        if (touchedCell) {
          tryPaintCell(touchedCell);
        }
      },
      onPanResponderRelease: () => undefined,
      onPanResponderTerminate: () => undefined,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true
    }),
    [answerOptions, boardSize, currentQuestion, isRunnerMoving]
  );

  const boardTranslateX = boardShake.interpolate({ inputRange: [-1, 0, 1], outputRange: [-12, 0, 12] });

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer scroll={false}>
        {isComplete ? (
          <GameCompleteCard correct={correct} total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.topBar}>
              <GameExitButton onPress={() => navigation.goBack()} />
              <View style={styles.compactTitleBlock}>
                <Text style={styles.title}>Laberinto</Text>
                <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{correct}/{questions.length}</Text>
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
              <View style={styles.questionPill}>
                <MaterialCommunityIcons name="gesture-tap-button" size={22} color={colors.primaryDark} />
                <Text style={styles.question}>{currentQuestion?.questionText} = ?</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reiniciar camino"
                  disabled={isRunnerMoving}
                  style={({ pressed }) => [styles.resetButton, pressed && !isRunnerMoving && styles.resetButtonPressed, isRunnerMoving && styles.resetButtonDisabled]}
                  onPress={resetRound}
                >
                  <MaterialCommunityIcons name="refresh" size={22} color={colors.text} />
                </Pressable>
              </View>
            </AppCard>

            <Animated.View style={[styles.boardWrap, { transform: [{ translateX: boardTranslateX }] }]}> 
              <View
                {...panResponder.panHandlers}
                style={styles.board}
                onLayout={(event) => setBoardSize(event.nativeEvent.layout)}
              >
                <Svg pointerEvents="none" height="100%" width="100%" viewBox={`0 0 ${columns} ${rows}`} preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
                  <Rect fill="#FFFBEA" height={rows} width={columns} x="0" y="0" />
                  {blockedCells.map((cell) => (
                    <Rect
                      key={`blocked-${cell.col}-${cell.row}`}
                      fill="#9BE28F"
                      height="0.82"
                      rx="0.12"
                      width="0.82"
                      x={cell.col + 0.09}
                      y={cell.row + 0.09}
                    />
                  ))}
                  {mazeWalls.map((wall, index) => (
                    <Line
                      key={index}
                      stroke="#26783A"
                      strokeLinecap="square"
                      strokeWidth="0.17"
                      x1={wall.x1}
                      x2={wall.x2}
                      y1={wall.y1}
                      y2={wall.y2}
                    />
                  ))}
                </Svg>

                {blockedDecorations.map((detail) => (
                  <MaterialCommunityIcons
                    key={`${detail.icon}-${detail.cell.col}-${detail.cell.row}`}
                    name={detail.icon}
                    size={18}
                    color={detail.color}
                    style={[styles.jungleIcon, getDetailStyle(detail.cell, boardSize)]}
                  />
                ))}

                <DrawPath points={solvedPath} color={colors.success} strokeWidth={10} />
                <DrawPath points={wrongPath} color={colors.coral} strokeWidth={10} />
                <DrawPath points={paintedPath} color={colors.primaryDark} strokeWidth={9} />

                <Animated.View style={[styles.cornerBubble, getBubbleStyle(startCell, boardSize), styles.startBubble, { transform: [{ scale: startPulse }] }]}>
                  {!isRunnerMoving ? <AnimalMascot kind="turtle" showBadge={false} size="sm" mood="happy" /> : null}
                </Animated.View>

                {isRunnerMoving ? (
                  <Animated.View style={[styles.runner, { transform: [{ translateX: runnerX }, { translateY: runnerY }] }]}> 
                    <AnimalMascot kind="turtle" showBadge={false} size="sm" mood="celebrating" />
                  </Animated.View>
                ) : null}

                {answerOptions.map((answer, index) => {
                  const isAnimated = animatedAnswerIndex === index;

                  return (
                    <Animated.View
                      key={`${answer.value}-${index}`}
                      style={[
                        styles.cornerBubble,
                        getBubbleStyle(answer.cell, boardSize),
                        styles.answerBubble,
                        isAnimated && styles.successBubble,
                        isAnimated && { transform: [{ scale: successPulse }] }
                      ]}
                    >
                      <Text style={styles.answerText}>{answer.value}</Text>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

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

function getBubbleStyle(cell: MazeCell, boardSize: BoardSize) {
  const center = getCellCenter(cell, boardSize);
  const inset = spacing.sm;

  return {
    left: clamp(center.x - bubbleSize / 2, inset, Math.max(inset, boardSize.width - bubbleSize - inset)),
    top: clamp(center.y - bubbleSize / 2, inset, Math.max(inset, boardSize.height - bubbleSize - inset))
  };
}

function getDetailStyle(cell: MazeCell, boardSize: BoardSize) {
  const center = getCellCenter(cell, boardSize);

  return {
    left: center.x - 9,
    top: center.y - 9
  };
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
  questionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 46,
    paddingVertical: spacing.xs
  },
  question: {
    ...typography.heading,
    flex: 1,
    color: colors.text,
    textAlign: 'center'
  },
  resetButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.banana,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetButtonPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: colors.secondary
  },
  resetButtonDisabled: {
    opacity: 0.5
  },
  boardWrap: {
    flex: 1,
    minHeight: 530,
    maxHeight: 640
  },
  board: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: '#FFFBEA',
    borderWidth: 4,
    borderColor: colors.surface,
    position: 'relative',
    overflow: 'hidden'
  },
  jungleIcon: {
    opacity: 0.46,
    position: 'absolute',
    zIndex: 1
  },
  runner: {
    position: 'absolute',
    width: bubbleSize,
    height: bubbleSize,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4
  },
  cornerBubble: {
    position: 'absolute',
    width: bubbleSize,
    height: bubbleSize,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    zIndex: 3
  },
  startBubble: {
    backgroundColor: colors.mint
  },
  answerBubble: {
    backgroundColor: colors.banana
  },
  successBubble: {
    backgroundColor: colors.mint,
    borderColor: colors.success
  },
  answerText: {
    ...typography.subheading,
    color: colors.text
  },
  feedbackSlot: {
    alignItems: 'center',
    minHeight: 58
  }
});

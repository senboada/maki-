import { useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { GameProgress } from './GameProgress';
import { createGameQuestions, getGameIntro } from './gameHelpers';

type PasswordGameScreenProps = NativeStackScreenProps<AppStackParamList, 'PasswordGame'>;

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'borrar', '0', 'ok'];

export function PasswordGameScreen({ navigation, route }: PasswordGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params), [route.params, runId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedValue, setTypedValue] = useState('');
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const unlockAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const answerLength = String(currentQuestion?.correctAnswer ?? '').length;

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setTypedValue('');
    setCorrect(0);
    setFeedback(null);
    unlockAnim.setValue(0);
  }

  function shakePhone() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(shakeAnim, { duration: 55, toValue: -1, useNativeDriver: true }),
      Animated.timing(shakeAnim, { duration: 55, toValue: 1, useNativeDriver: true }),
      Animated.timing(shakeAnim, { duration: 55, toValue: 0, useNativeDriver: true })
    ]).start();
  }

  function unlockPhone() {
    unlockAnim.setValue(0);
    Animated.timing(unlockAnim, { duration: 450, toValue: 1, useNativeDriver: true }).start(() => {
      setCurrentIndex((value) => value + 1);
      setTypedValue('');
      unlockAnim.setValue(0);
    });
  }

  function submitAnswer() {
    if (!currentQuestion) {
      return;
    }

    if (Number(typedValue) === currentQuestion.correctAnswer) {
      setCorrect((value) => value + 1);
      setFeedback('Telefono desbloqueado!');
      unlockPhone();
      return;
    }

    Vibration.vibrate(80);
    setFeedback('Ups, prueba otra vez');
    setTypedValue('');
    shakePhone();
  }

  function pressKey(key: string) {
    if (key === 'borrar') {
      setTypedValue((value) => value.slice(0, -1));
      return;
    }

    if (key === 'ok') {
      submitAnswer();
      return;
    }

    setTypedValue((value) => `${value}${key}`.slice(0, Math.max(4, answerLength)));
  }

  const phoneTranslateX = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-12, 0, 12] });
  const unlockTranslateY = unlockAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const unlockOpacity = unlockAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.15] });

  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        <GameExitButton onPress={() => navigation.goBack()} />
        {isComplete ? (
          <GameCompleteCard correct={correct} total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.header}>
              <AnimalMascot kind="panda" size="md" mood="thinking" />
              <Text style={styles.title}>Clave secreta</Text>
              <Text style={styles.subtitle}>{getGameIntro(route.params)}</Text>
              <GameProgress current={currentIndex} total={questions.length} correct={correct} />
            </View>

            <Animated.View style={[styles.phone, { transform: [{ translateX: phoneTranslateX }] }]}>
              <LinearGradient colors={[colors.lavender, colors.sky, colors.background]} style={styles.phoneScreen}>
                <View style={styles.dynamicIsland} />
                <Animated.View style={[styles.lockContent, { opacity: unlockOpacity, transform: [{ translateY: unlockTranslateY }] }]}>
                  <MaterialCommunityIcons name="lock-outline" size={42} color={colors.text} />
                  <Text style={styles.phoneTime}>Maki+</Text>
                  <Text style={styles.phoneQuestion}>{currentQuestion?.questionText}</Text>
                  <View style={styles.codeDots}>
                    {Array.from({ length: Math.max(answerLength, typedValue.length, 2) }).map((_, index) => (
                      <View key={index} style={[styles.codeDot, typedValue[index] && styles.codeDotFilled]} />
                    ))}
                  </View>
                </Animated.View>
              </LinearGradient>
            </Animated.View>

            {feedback ? <SoftFeedbackBubble message={feedback} tone={feedback.includes('Ups') ? 'tryAgain' : 'success'} /> : null}

            <View style={styles.keypad}>
              {keypad.map((key) => (
                <Pressable key={key} style={styles.key} onPress={() => pressKey(key)}>
                  {key === 'borrar' ? <MaterialCommunityIcons name="backspace-outline" size={24} color={colors.text} /> : null}
                  {key === 'ok' ? <MaterialCommunityIcons name="check" size={28} color={colors.text} /> : null}
                  {key !== 'borrar' && key !== 'ok' ? <Text style={styles.keyText}>{key}</Text> : null}
                </Pressable>
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
  phone: {
    alignSelf: 'center',
    width: 260,
    height: 360,
    borderRadius: 42,
    backgroundColor: colors.text,
    padding: 10
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 34,
    alignItems: 'center',
    overflow: 'hidden'
  },
  dynamicIsland: {
    width: 86,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    marginTop: spacing.sm
  },
  lockContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg
  },
  phoneTime: {
    ...typography.title,
    color: colors.text
  },
  phoneQuestion: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  codeDots: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  codeDot: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: 'transparent'
  },
  codeDotFilled: {
    backgroundColor: colors.text
  },
  keypad: {
    alignSelf: 'center',
    width: 270,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center'
  },
  key: {
    width: 72,
    height: 62,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  keyText: {
    ...typography.subheading,
    color: colors.text
  }
});

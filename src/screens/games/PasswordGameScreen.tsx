import { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GameWorldBackground } from '../../components/graphics';
import { ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { GameCompleteCard } from './GameCompleteCard';
import { GameExitButton } from './GameExitButton';
import { createGameQuestions, getGameIntro } from './gameHelpers';

type PasswordGameScreenProps = NativeStackScreenProps<AppStackParamList, 'PasswordGame'>;
type PhoneMode = 'locked' | 'unlocking' | 'home';
type FeedbackState = {
  message: string;
  tone: 'success' | 'tryAgain' | 'locked';
} | null;

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'borrar', '0', 'ok'];
const homeIcons = ['star-four-points', 'heart', 'gamepad-variant', 'trophy'] as const;
const maxAttempts = 3;
const lockoutSeconds = 5;

export function PasswordGameScreen({ navigation, route }: PasswordGameScreenProps) {
  const [runId, setRunId] = useState(0);
  const questions = useMemo(() => createGameQuestions(route.params), [route.params, runId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedValue, setTypedValue] = useState('');
  const [correct, setCorrect] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [phoneMode, setPhoneMode] = useState<PhoneMode>('locked');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const unlockAnim = useRef(new Animated.Value(0)).current;
  const homeOpacity = useRef(new Animated.Value(0)).current;
  const errorFlash = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const answerLength = String(currentQuestion?.correctAnswer ?? '').length;
  const passcodeLength = Math.max(4, answerLength);
  const isLocked = lockSeconds > 0;
  const isBusy = phoneMode !== 'locked' || isLocked;

  useEffect(() => {
    if (lockSeconds <= 0) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setLockSeconds((value) => {
        const nextValue = value - 1;

        if (nextValue <= 0) {
          setFailedAttempts(0);
          setFeedback(null);
          return 0;
        }

        setFeedback({ message: `Espera ${nextValue} segundos`, tone: 'locked' });
        return nextValue;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [lockSeconds]);

  function resetAnimations() {
    shakeAnim.setValue(0);
    unlockAnim.setValue(0);
    homeOpacity.setValue(0);
    errorFlash.setValue(0);
  }

  function resetGame() {
    setRunId((value) => value + 1);
    setCurrentIndex(0);
    setTypedValue('');
    setCorrect(0);
    setFailedAttempts(0);
    setLockSeconds(0);
    setFeedback(null);
    setPhoneMode('locked');
    resetAnimations();
  }

  function shakePhone() {
    shakeAnim.setValue(0);
    errorFlash.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeAnim, { duration: 55, toValue: 1, useNativeDriver: true }),
        Animated.timing(shakeAnim, { duration: 55, toValue: -1, useNativeDriver: true }),
        Animated.timing(shakeAnim, { duration: 55, toValue: 1, useNativeDriver: true }),
        Animated.timing(shakeAnim, { duration: 55, toValue: 0, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(errorFlash, { duration: 90, toValue: 1, useNativeDriver: true }),
        Animated.timing(errorFlash, { duration: 220, toValue: 0, useNativeDriver: true })
      ])
    ]).start();
  }

  function lockPhone() {
    setTypedValue('');
    setLockSeconds(lockoutSeconds);
    setFeedback({ message: `Espera ${lockoutSeconds} segundos`, tone: 'locked' });
  }

  function goNextChallenge() {
    setCurrentIndex((value) => value + 1);
    setTypedValue('');
    setFailedAttempts(0);
    setFeedback(null);
    setPhoneMode('locked');
    resetAnimations();
  }

  function unlockPhone() {
    setPhoneMode('unlocking');
    setFeedback({ message: 'Telefono desbloqueado!', tone: 'success' });
    unlockAnim.setValue(0);
    homeOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(unlockAnim, { duration: 430, toValue: 1, useNativeDriver: true }),
      Animated.timing(homeOpacity, { duration: 180, toValue: 1, useNativeDriver: true })
    ]).start(() => {
      setPhoneMode('home');
      setTimeout(goNextChallenge, 850);
    });
  }

  function submitAnswer() {
    if (!currentQuestion || isBusy || typedValue.length === 0) {
      return;
    }

    if (Number(typedValue) === currentQuestion.correctAnswer) {
      setCorrect((value) => value + 1);
      unlockPhone();
      return;
    }

    const nextAttempts = failedAttempts + 1;
    Vibration.vibrate(80);
    setFailedAttempts(nextAttempts);
    setFeedback({ message: nextAttempts >= maxAttempts ? 'Demasiados intentos' : 'Codigo incorrecto', tone: 'tryAgain' });
    setTypedValue('');
    shakePhone();

    if (nextAttempts >= maxAttempts) {
      setTimeout(lockPhone, 350);
    }
  }

  function pressKey(key: string) {
    if (isBusy) {
      return;
    }

    if (key === 'borrar') {
      if (feedback?.tone === 'tryAgain') {
        setFeedback(null);
        errorFlash.setValue(0);
      }
      setTypedValue((value) => value.slice(0, -1));
      return;
    }

    if (key === 'ok') {
      submitAnswer();
      return;
    }

    if (feedback?.tone === 'tryAgain') {
      setFeedback(null);
      errorFlash.setValue(0);
    }

    setTypedValue((value) => `${value}${key}`.slice(0, passcodeLength));
  }

  const phoneTranslateX = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-12, 0, 12] });
  const lockTranslateY = unlockAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -110] });
  const lockOpacity = unlockAnim.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 0.4, 0] });
  const keypadTranslateY = unlockAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 90] });
  const errorScale = errorFlash.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <GameWorldBackground variant="sky">
      <ScreenContainer>
        {isComplete ? (
          <GameCompleteCard correct={correct} total={questions.length} onHome={() => navigation.popToTop()} onReplay={resetGame} />
        ) : (
          <View style={styles.content}>
            <View style={styles.topBar}>
              <GameExitButton onPress={() => navigation.goBack()} />
              <View style={styles.compactTitleBlock}>
                <Text style={styles.title}>Clave</Text>
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

            <Animated.View style={[styles.phone, { transform: [{ translateX: phoneTranslateX }] }]}> 
              <LinearGradient colors={[colors.lavender, colors.sky, colors.background]} style={styles.phoneScreen}>
                <View style={styles.statusBar}>
                  <Text style={styles.statusTime}>9:41</Text>
                  <View style={styles.statusIcons}>
                    <MaterialCommunityIcons name="signal-cellular-3" size={14} color={colors.text} />
                    <MaterialCommunityIcons name="wifi" size={14} color={colors.text} />
                    <MaterialCommunityIcons name="battery-80" size={17} color={colors.text} />
                  </View>
                </View>
                <View style={styles.dynamicIsland} />

                <Animated.View style={[styles.lockContent, { opacity: lockOpacity, transform: [{ translateY: lockTranslateY }] }]}> 
                  <MaterialCommunityIcons name={isLocked ? 'timer-lock-outline' : 'lock-outline'} size={34} color={colors.text} />
                  <Text style={styles.phoneTime}>Maki+</Text>
                  <Text style={styles.phoneQuestion}>{currentQuestion?.questionText}</Text>
                  <View style={styles.codeDots}>
                    {Array.from({ length: passcodeLength }).map((_, index) => (
                      <Animated.View
                        key={index}
                        style={[
                          styles.codeDot,
                          typedValue[index] && styles.codeDotFilled,
                          feedback?.tone === 'tryAgain' && { transform: [{ scale: errorScale }] },
                          feedback?.tone === 'tryAgain' && styles.codeDotError
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.phoneFeedback, feedback?.tone === 'success' && styles.successText, feedback?.tone === 'locked' && styles.lockedText]}>
                    {feedback?.message ?? `${maxAttempts - failedAttempts} intentos antes del bloqueo`}
                  </Text>
                </Animated.View>

                <Animated.View style={[styles.homeScreen, { opacity: homeOpacity }]}> 
                  <Text style={styles.homeTitle}>Desbloqueado!</Text>
                  <View style={styles.homeGrid}>
                    {homeIcons.map((icon) => (
                      <View key={icon} style={styles.homeIcon}>
                        <MaterialCommunityIcons name={icon} size={26} color={colors.text} />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.homeCaption}>Siguiente reto...</Text>
                </Animated.View>

                <Animated.View style={[styles.keypad, { opacity: lockOpacity, transform: [{ translateY: keypadTranslateY }] }]}> 
                  {keypad.map((key) => (
                    <Pressable
                      accessibilityRole="button"
                      disabled={isBusy}
                      key={key}
                      style={({ pressed }) => [styles.key, pressed && !isBusy && styles.keyPressed, isBusy && styles.keyDisabled]}
                      onPress={() => pressKey(key)}
                    >
                      {key === 'borrar' ? <MaterialCommunityIcons name="backspace-outline" size={22} color={colors.text} /> : null}
                      {key === 'ok' ? <MaterialCommunityIcons name="check" size={26} color={colors.text} /> : null}
                      {key !== 'borrar' && key !== 'ok' ? <Text style={styles.keyText}>{key}</Text> : null}
                    </Pressable>
                  ))}
                </Animated.View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  content: {
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
  phone: {
    alignSelf: 'center',
    width: 310,
    height: 610,
    borderRadius: 48,
    backgroundColor: colors.text,
    padding: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 38,
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: spacing.md
  },
  statusBar: {
    width: '100%',
    minHeight: 32,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statusTime: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700'
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dynamicIsland: {
    position: 'absolute',
    top: spacing.sm,
    width: 84,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.text
  },
  lockContent: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm
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
    gap: spacing.sm,
    minHeight: 20
  },
  codeDot: {
    width: 17,
    height: 17,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: 'transparent'
  },
  codeDotFilled: {
    backgroundColor: colors.text
  },
  codeDotError: {
    borderColor: colors.coral,
    backgroundColor: colors.dangerSoft
  },
  phoneFeedback: {
    ...typography.caption,
    minHeight: 22,
    color: colors.textMuted,
    textAlign: 'center'
  },
  successText: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  lockedText: {
    color: colors.secondaryDark,
    fontWeight: '700'
  },
  homeScreen: {
    position: 'absolute',
    top: 72,
    left: spacing.md,
    right: spacing.md,
    bottom: 28,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.54)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg
  },
  homeTitle: {
    ...typography.heading,
    color: colors.text
  },
  homeGrid: {
    width: 174,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center'
  },
  homeIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeCaption: {
    ...typography.caption,
    color: colors.textMuted
  },
  keypad: {
    position: 'absolute',
    bottom: 22,
    width: 250,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center'
  },
  key: {
    width: 72,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.86)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  keyPressed: {
    backgroundColor: colors.banana,
    transform: [{ scale: 0.96 }]
  },
  keyDisabled: {
    opacity: 0.5
  },
  keyText: {
    ...typography.subheading,
    color: colors.text
  }
});

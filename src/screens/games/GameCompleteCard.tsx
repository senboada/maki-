import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, type AnimalKind } from '../../components/graphics';
import { AppButton, AppCard } from '../../components/ui';
import type { PracticeGameType } from '../../navigation';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type GameCompleteCardProps = {
  correct: number;
  extraAttempts?: number;
  total: number;
  gameType?: PracticeGameType;
  onHome: () => void;
  onReplay: () => void;
};

type ResultLevel = 'sparkly' | 'steady' | 'brave';

const resultContent: Record<ResultLevel, { animal: AnimalKind; title: string; message: string; badge: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  sparkly: {
    animal: 'fox',
    title: 'Aventura brillante!',
    message: 'Tu esfuerzo encendio muchas estrellas. Sigue asi, explorador!',
    badge: 'Fiesta de estrellas',
    icon: 'party-popper'
  },
  steady: {
    animal: 'rabbit',
    title: 'Muy buen camino!',
    message: 'Resolviste varios retos. Practicar un poco mas te hara aun mas fuerte.',
    badge: 'Gran avance',
    icon: 'star-four-points'
  },
  brave: {
    animal: 'turtle',
    title: 'Valiente intento!',
    message: 'Cada intento ayuda a aprender. Vamos otra vez con calma y alegria.',
    badge: 'Sigue intentando',
    icon: 'heart'
  }
};

function getResultLevel(correct: number, total: number): ResultLevel {
  const ratio = total > 0 ? correct / total : 0;

  if (ratio >= 0.8) {
    return 'sparkly';
  }

  if (ratio >= 0.5) {
    return 'steady';
  }

  return 'brave';
}

function getEarnedStars(correct: number, total: number) {
  if (total <= 0) {
    return 1;
  }

  return Math.max(1, Math.min(5, Math.ceil((correct / total) * 5)));
}

export function GameCompleteCard({ correct, extraAttempts = 0, gameType = 'treasure', onHome, onReplay, total }: GameCompleteCardProps) {
  const level = getResultLevel(correct, total);
  const content = resultContent[level];
  const earnedStars = getEarnedStars(correct, total);
  const mascotBounce = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.94)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const sparkleSpin = useRef(new Animated.Value(0)).current;
  const starScales = useRef(Array.from({ length: 5 }, () => new Animated.Value(0.72))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
      Animated.timing(cardOpacity, { duration: 220, toValue: 1, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.spring(mascotBounce, { toValue: 1.06, friction: 5, tension: 90, useNativeDriver: true }),
          Animated.spring(mascotBounce, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true })
        ])
      ),
      Animated.loop(Animated.timing(sparkleSpin, { duration: 2600, toValue: 1, useNativeDriver: true }))
    ]).start();

    Animated.stagger(110, starScales.map((scale, index) => (
      Animated.spring(scale, { toValue: index < earnedStars ? 1 : 0.86, friction: 5, tension: 130, useNativeDriver: true })
    ))).start();
  }, [cardOpacity, cardScale, earnedStars, mascotBounce, sparkleSpin, starScales]);

  const sparkleRotate = sparkleSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ opacity: cardOpacity, transform: [{ scale: cardScale }] }}>
      <AppCard color={colors.surface}>
        <View style={styles.content}>
          <View style={[styles.hero, level === 'sparkly' && styles.heroSparkly, level === 'brave' && styles.heroBrave]}>
            {level === 'sparkly' ? <ConfettiField rotate={sparkleRotate} /> : null}
            {level !== 'sparkly' ? <MotivationField level={level} /> : null}
            <GameCelebration gameType={gameType} level={level} mascotBounce={mascotBounce} rotate={sparkleRotate} />
          </View>

          <View style={styles.badge}>
            <MaterialCommunityIcons name={content.icon} size={20} color={colors.text} />
            <Text style={styles.badgeText}>{content.badge}</Text>
          </View>

          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>

          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, index) => {
              const active = index < earnedStars;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.starBubble,
                    active ? styles.starActive : styles.starSoft,
                    index === 2 && styles.starCenter,
                    { transform: [{ scale: starScales[index] as Animated.Value }] }
                  ]}
                >
                  <MaterialCommunityIcons name={active ? 'star-four-points' : 'star-four-points-outline'} size={index === 2 ? 25 : 21} color={colors.secondaryDark} />
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{correct}/{total}</Text>
            <Text style={styles.scoreText}>retos logrados</Text>
            {extraAttempts > 0 ? <Text style={styles.extraAttempts}>Intentos extra: {extraAttempts}</Text> : null}
          </View>

          <View style={styles.actions}>
            <AppButton icon="refresh" title="Jugar otra vez" onPress={onReplay} />
            <AppButton icon="home-heart" title="Volver al inicio" variant="soft" onPress={onHome} />
          </View>
        </View>
      </AppCard>
    </Animated.View>
  );
}

function ConfettiField({ rotate }: { rotate: Animated.AnimatedInterpolation<string> }) {
  const confetti = [
    { icon: 'star-four-points', left: 22, top: 18, color: colors.banana },
    { icon: 'heart', left: 74, top: 28, color: colors.coral },
    { icon: 'party-popper', left: 48, top: 4, color: colors.secondary },
    { icon: 'star', left: 10, top: 72, color: colors.secondaryDark },
    { icon: 'flower', left: 82, top: 78, color: colors.lavender }
  ] as const;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {confetti.map((item) => (
        <Animated.View key={`${item.icon}-${item.left}`} style={[styles.confetti, { left: `${item.left}%`, top: item.top, transform: [{ rotate }] }]}> 
          <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
        </Animated.View>
      ))}
    </View>
  );
}

function MotivationField({ level }: { level: ResultLevel }) {
  const icon = level === 'brave' ? 'heart-multiple' : 'star-shooting';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.softOrb, styles.softOrbLeft]}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primaryDark} />
      </View>
      <View style={[styles.softOrb, styles.softOrbRight]}>
        <MaterialCommunityIcons name="star-four-points" size={22} color={colors.secondaryDark} />
      </View>
    </View>
  );
}

function GameCelebration({ gameType, level, mascotBounce, rotate }: { gameType: PracticeGameType; level: ResultLevel; mascotBounce: Animated.Value; rotate: Animated.AnimatedInterpolation<string> }) {
  switch (gameType) {
    case 'treasure':
      return <TreasureCelebration mascotBounce={mascotBounce} rotate={rotate} />;
    case 'match_pairs':
      return <PairsCelebration mascotBounce={mascotBounce} />;
    case 'password':
      return <PasswordCelebration mascotBounce={mascotBounce} />;
    case 'maze':
      return <MazeCelebration level={level} mascotBounce={mascotBounce} />;
  }
}

function TreasureCelebration({ mascotBounce, rotate }: { mascotBounce: Animated.Value; rotate: Animated.AnimatedInterpolation<string> }) {
  return (
    <View style={styles.gameScene}>
      <Animated.View style={[styles.treasureGlow, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.chestWrap, { transform: [{ scale: mascotBounce }] }]}> 
        <MaterialCommunityIcons name="treasure-chest" size={74} color={colors.secondaryDark} />
        <View style={styles.chestSparkles}>
          <MaterialCommunityIcons name="star-four-points" size={22} color={colors.banana} />
          <MaterialCommunityIcons name="diamond-stone" size={22} color={colors.primaryDark} />
          <MaterialCommunityIcons name="star" size={20} color={colors.secondary} />
        </View>
      </Animated.View>
      <Text style={styles.sceneCaption}>Tesoro encontrado!</Text>
    </View>
  );
}

function PairsCelebration({ mascotBounce }: { mascotBounce: Animated.Value }) {
  return (
    <View style={styles.gameScene}>
      <View style={styles.heartsLayer}>
        <MaterialCommunityIcons name="heart" size={24} color={colors.coral} style={styles.heartLeft} />
        <MaterialCommunityIcons name="heart-multiple" size={28} color={colors.coral} style={styles.heartTop} />
        <MaterialCommunityIcons name="heart" size={22} color={colors.coral} style={styles.heartRight} />
      </View>
      <View style={styles.rabbitPair}>
        <Animated.View style={{ transform: [{ scale: mascotBounce }, { rotate: '-6deg' }] }}>
          <AnimalMascot kind="rabbit" showBadge={false} size="md" mood="celebrating" />
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: mascotBounce }, { rotate: '6deg' }] }}>
          <AnimalMascot kind="rabbit" showBadge={false} size="md" mood="celebrating" />
        </Animated.View>
      </View>
      <Text style={styles.sceneCaption}>Parejas felices!</Text>
    </View>
  );
}

function PasswordCelebration({ mascotBounce }: { mascotBounce: Animated.Value }) {
  const phoneRotate = mascotBounce.interpolate({ inputRange: [1, 1.06], outputRange: ['-2deg', '2deg'] });

  return (
    <View style={styles.gameScene}>
      <Animated.View style={[styles.miniPhone, { transform: [{ rotate: phoneRotate }] }]}> 
        <View style={styles.phoneIsland} />
        <View style={styles.phoneUnlockedScreen}>
          <MaterialCommunityIcons name="lock-open-variant" size={36} color={colors.primaryDark} />
          <Text style={styles.phoneUnlockedText}>Maki+</Text>
          <View style={styles.phoneApps}>
            <View style={styles.phoneAppDot} />
            <View style={styles.phoneAppDot} />
            <View style={styles.phoneAppDot} />
          </View>
        </View>
      </Animated.View>
      <Text style={styles.sceneCaption}>Celular desbloqueado!</Text>
    </View>
  );
}

function MazeCelebration({ level, mascotBounce }: { level: ResultLevel; mascotBounce: Animated.Value }) {
  return (
    <View style={styles.gameScene}>
      <View style={styles.exitSign}>
        <MaterialCommunityIcons name="sign-direction" size={28} color={colors.primaryDark} />
        <Text style={styles.exitText}>SALIDA</Text>
      </View>
      <View style={styles.mazeGround}>
        <View style={styles.mazePathLine} />
        <Animated.View style={{ transform: [{ scale: mascotBounce }] }}>
          <AnimalMascot kind="dog" showBadge={false} size="md" mood="celebrating" />
        </Animated.View>
      </View>
      <Text style={styles.sceneCaption}>Ayudaste a salir!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  hero: {
    width: '100%',
    minHeight: 176,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.soft
  },
  heroSparkly: {
    backgroundColor: colors.sky
  },
  heroBrave: {
    backgroundColor: colors.surfaceSoft
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.banana,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 2,
    borderColor: colors.surface
  },
  badgeText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800'
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  starBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface
  },
  starCenter: {
    width: 50,
    height: 50
  },
  starActive: {
    backgroundColor: colors.banana
  },
  starSoft: {
    backgroundColor: colors.surfaceSoft,
    opacity: 0.72
  },
  scoreCard: {
    minWidth: 148,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  scoreNumber: {
    ...typography.title,
    color: colors.primaryDark
  },
  scoreText: {
    ...typography.caption,
    color: colors.textMuted
  },
  extraAttempts: {
    ...typography.caption,
    color: colors.primaryDark,
    marginTop: 2
  },
  actions: {
    width: '100%',
    gap: spacing.md
  },
  confetti: {
    position: 'absolute'
  },
  softOrb: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  },
  softOrbLeft: {
    left: spacing.lg,
    top: spacing.lg
  },
  softOrbRight: {
    right: spacing.lg,
    bottom: spacing.lg
  },
  gameScene: {
    width: '100%',
    minHeight: 156,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sceneCaption: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
    marginTop: spacing.xs
  },
  treasureGlow: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.banana,
    opacity: 0.5
  },
  chestWrap: {
    width: 116,
    height: 104,
    borderRadius: radius.xl,
    backgroundColor: colors.banana,
    borderWidth: 4,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft
  },
  chestSparkles: {
    position: 'absolute',
    bottom: -12,
    flexDirection: 'row',
    gap: spacing.xs
  },
  heartsLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  heartLeft: {
    position: 'absolute',
    left: '20%',
    top: 24
  },
  heartTop: {
    position: 'absolute',
    alignSelf: 'center',
    top: 4
  },
  heartRight: {
    position: 'absolute',
    right: '20%',
    top: 34
  },
  rabbitPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginLeft: -spacing.lg
  },
  miniPhone: {
    width: 112,
    height: 146,
    borderRadius: 28,
    backgroundColor: colors.text,
    padding: 7,
    ...shadows.soft
  },
  phoneIsland: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    width: 40,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    zIndex: 2
  },
  phoneUnlockedScreen: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  phoneUnlockedText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '900'
  },
  phoneApps: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  phoneAppDot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.surface
  },
  exitSign: {
    position: 'absolute',
    top: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    zIndex: 2
  },
  exitText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '900'
  },
  mazeGround: {
    width: '72%',
    height: 112,
    borderRadius: radius.xl,
    backgroundColor: colors.mint,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg
  },
  mazePathLine: {
    position: 'absolute',
    width: '78%',
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.background
  }
});

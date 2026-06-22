import type { ComponentProps } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnimalCard, AnimalMascot, GameWorldBackground } from '../../components/graphics';
import { ScreenContainer } from '../../components/ui';
import type { ReinforcementTopic } from '../../domain/profiles';
import type { MainStackParamList } from '../../navigation';
import { useAuth, useProfiles } from '../../providers';
import { colors, radius, spacing, typography } from '../../theme';
import type { AnimalKind } from '../../components/graphics';

type WelcomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Welcome'>;
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const topicLabels: Record<ReinforcementTopic, { label: string; icon: IconName; color: string }> = {
  addition: { label: 'Suma', icon: 'plus-circle-outline', color: colors.sky },
  subtraction: { label: 'Resta', icon: 'minus-circle-outline', color: colors.surfaceSoft },
  multiplication: { label: 'Multiplicacion', icon: 'close-circle-outline', color: colors.banana },
  division: { label: 'Division', icon: 'division', color: colors.mint }
};

const homeAnimals: AnimalKind[] = ['panda', 'fox', 'owl', 'turtle', 'rabbit', 'bird', 'dog'];

function formatFirstName(name?: string) {
  const firstName = name?.trim().split(/\s+/)[0] ?? 'explorador';
  const normalizedName = firstName.toLocaleLowerCase('es-CO');

  return `${normalizedName.charAt(0).toLocaleUpperCase('es-CO')}${normalizedName.slice(1)}`;
}

function pickAnimal(seed: string, offset = 0) {
  const total = [...seed].reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return homeAnimals[(total + offset) % homeAnimals.length] as AnimalKind;
}

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { backendMode, logout } = useAuth();
  const { childProfile, clearChildProfileCelebration, justCompletedChildProfile } = useProfiles();
  const [menuVisible, setMenuVisible] = useState(false);
  const isSupabaseMode = backendMode === 'supabase';
  const childName = formatFirstName(childProfile?.name);
  const animalSeed = childProfile?.id ?? childName;
  const fallbackHeroAnimal = useMemo(() => pickAnimal(animalSeed), [animalSeed]);
  const heroAnimal = childProfile?.avatarAnimal ?? fallbackHeroAnimal;
  const gamesAnimal = useMemo(() => pickAnimal(animalSeed, 2), [animalSeed]);
  const practiceAnimal = useMemo(() => pickAnimal(animalSeed, 4), [animalSeed]);
  const topics = childProfile?.reinforcementTopics ?? [];
  const celebrationScale = useRef(new Animated.Value(0.8)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!justCompletedChildProfile) {
      return undefined;
    }

    celebrationScale.setValue(0.8);
    celebrationOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(celebrationScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(celebrationOpacity, { duration: 200, toValue: 1, useNativeDriver: true })
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(celebrationOpacity, { duration: 220, toValue: 0, useNativeDriver: true }).start(clearChildProfileCelebration);
    }, 2600);

    return () => clearTimeout(timeout);
  }, [celebrationOpacity, celebrationScale, clearChildProfileCelebration, justCompletedChildProfile]);

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>Maki+</Text>
            <Text style={styles.brandSubtitle}>Aprende jugando</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMenuVisible(true)}
            style={styles.avatarMenuButton}
          >
            <AnimalMascot kind={heroAnimal} showBadge={false} size="sm" mood="happy" />
          </Pressable>
        </View>

        {justCompletedChildProfile ? (
          <Animated.View style={[styles.celebrationCard, { opacity: celebrationOpacity, transform: [{ scale: celebrationScale }] }]}> 
            <View style={styles.celebrationIcons}>
              <MaterialCommunityIcons name="party-popper" size={28} color={colors.secondaryDark} />
              <AnimalMascot kind={heroAnimal} showBadge={false} size="sm" mood="celebrating" />
              <MaterialCommunityIcons name="star-four-points" size={28} color={colors.secondaryDark} />
            </View>
            <Text style={styles.celebrationTitle}>¡Perfil listo!</Text>
            <Text style={styles.celebrationText}>Ahora empieza la aventura de Maki+.</Text>
          </Animated.View>
        ) : null}

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <View style={[styles.backendPill, isSupabaseMode ? styles.backendSupabase : styles.backendLocal]}>
              <MaterialCommunityIcons
                name={isSupabaseMode ? 'cloud-check-outline' : 'cellphone-link'}
                size={16}
                color={colors.text}
              />
              <Text style={styles.backendText}>{isSupabaseMode ? 'Supabase local' : 'Modo local'}</Text>
            </View>

            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.greeting}>Hola, {childName}!</Text>
            <Text style={styles.subtitle}>Hoy podemos practicar con animales, estrellas y mini retos.</Text>

            <View style={styles.childMetaRow}>
              {childProfile?.age ? (
                <View style={styles.metaPill}>
                  <MaterialCommunityIcons name="cake-variant-outline" size={17} color={colors.primaryDark} />
                  <Text style={styles.metaText}>{childProfile.age} años</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.mascotWrap}>
            <AnimalMascot kind={heroAnimal} size="lg" mood="celebrating" />
          </View>
        </View>

        {topics.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temas para reforzar</Text>
            <View style={styles.topicRow}>
              {topics.map((topic) => (
                <TopicBadge key={topic} topic={topic} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Que quieres hacer?</Text>
          <View style={styles.cards}>
            <AnimalCard
              animal={gamesAnimal}
              color={colors.surfaceSoft}
              description="Entra a tesoros, claves y caminos con operaciones mezcladas."
              icon="controller-classic-outline"
              showBadge={false}
              title="Juegos"
              onPress={() => navigation.navigate('GamesMenu')}
            />
            <AnimalCard
              animal={practiceAnimal}
              color={colors.sky}
              description="Elige suma, resta, multiplicacion o division y refuerza un numero."
              icon="pencil-ruler"
              showBadge={false}
              title="Practicas"
              onPress={() => navigation.navigate('PracticeMenu')}
            />
          </View>
        </View>

      </ScreenContainer>
      <Modal transparent animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.profileMenu}>
            <AnimalMascot kind={heroAnimal} showBadge={false} size="sm" mood="happy" />
            <Text style={styles.menuTitle}>{childName}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <MaterialCommunityIcons name="account-heart-outline" size={22} color={colors.primaryDark} />
              <Text style={styles.menuItemText}>Perfil</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                void logout();
              }}
            >
              <MaterialCommunityIcons name="logout-variant" size={22} color={colors.primaryDark} />
              <Text style={styles.menuItemText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </GameWorldBackground>
  );
}

type TopicBadgeProps = {
  topic: ReinforcementTopic;
};

function TopicBadge({ topic }: TopicBadgeProps) {
  const config = topicLabels[topic];

  return (
    <View style={[styles.topicBadge, { backgroundColor: config.color }]}>
      <MaterialCommunityIcons name={config.icon} size={18} color={colors.text} />
      <Text style={styles.topicText}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginBottom: spacing.lg
  },
  brand: {
    ...typography.heading,
    color: colors.text
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textMuted
  },
  avatarMenuButton: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  heroCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  heroCopy: {
    flex: 1,
    gap: spacing.md
  },
  mascotWrap: {
    marginRight: -spacing.lg
  },
  backendPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.surface
  },
  backendSupabase: {
    backgroundColor: colors.mint
  },
  backendLocal: {
    backgroundColor: colors.warning
  },
  backendText: {
    ...typography.caption,
    color: colors.text
  },
  greeting: {
    ...typography.heading,
    color: colors.text
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted
  },
  childMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  metaText: {
    ...typography.caption,
    color: colors.text
  },
  section: {
    gap: spacing.md,
    marginTop: spacing.xl
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  topicText: {
    ...typography.caption,
    color: colors.text
  },
  cards: {
    gap: spacing.lg
  },
  celebrationCard: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.banana,
    padding: spacing.lg
  },
  celebrationIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  celebrationTitle: {
    ...typography.subheading,
    color: colors.text
  },
  celebrationText: {
    ...typography.caption,
    color: colors.text
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(47, 42, 74, 0.25)',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: spacing.lg
  },
  profileMenu: {
    width: 210,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm
  },
  menuTitle: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '900'
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md
  },
  menuItemText: {
    ...typography.caption,
    color: colors.text
  }
});

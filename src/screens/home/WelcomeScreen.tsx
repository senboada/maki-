import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnimalCard, AnimalMascot, CelebrationStars, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, AppCard, ScreenContainer } from '../../components/ui';
import type { ReinforcementTopic } from '../../domain/profiles';
import type { MainStackParamList } from '../../navigation';
import { useAuth, useProfiles } from '../../providers';
import { colors, radius, spacing, typography } from '../../theme';

type WelcomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Welcome'>;
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const topicLabels: Record<ReinforcementTopic, { label: string; icon: IconName; color: string }> = {
  addition: { label: 'Suma', icon: 'plus-circle-outline', color: colors.sky },
  subtraction: { label: 'Resta', icon: 'minus-circle-outline', color: colors.surfaceSoft },
  multiplication: { label: 'Multiplicacion', icon: 'close-circle-outline', color: colors.banana },
  division: { label: 'Division', icon: 'division', color: colors.mint }
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { backendMode, logout } = useAuth();
  const { childProfile } = useProfiles();
  const isSupabaseMode = backendMode === 'supabase';
  const childName = childProfile?.name ?? 'explorador';
  const topics = childProfile?.reinforcementTopics ?? [];

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
            onPress={() => void logout()}
            style={styles.logoutButton}
          >
            <MaterialCommunityIcons name="logout-variant" size={22} color={colors.text} />
          </Pressable>
        </View>

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

            <Text style={styles.greeting}>Hola, {childName}!</Text>
            <Text style={styles.subtitle}>Hoy podemos practicar con animales, estrellas y mini retos.</Text>

            <View style={styles.childMetaRow}>
              {childProfile?.age ? (
                <View style={styles.metaPill}>
                  <MaterialCommunityIcons name="cake-variant-outline" size={17} color={colors.primaryDark} />
                  <Text style={styles.metaText}>{childProfile.age} anos</Text>
                </View>
              ) : null}
              <View style={styles.metaPill}>
                <MaterialCommunityIcons name="star-four-points-outline" size={17} color={colors.primaryDark} />
                <Text style={styles.metaText}>Mision diaria</Text>
              </View>
            </View>
          </View>

          <View style={styles.mascotWrap}>
            <AnimalMascot kind="panda" size="lg" mood="celebrating" />
          </View>
        </View>

        <AppCard color={colors.surface}>
          <View style={styles.missionCard}>
            <MaterialCommunityIcons
              name="map-marker-star-outline"
              size={34}
              color={colors.secondaryDark}
            />
            <View style={styles.missionCopy}>
              <Text style={styles.missionTitle}>Mision de hoy</Text>
              <Text style={styles.missionText}>Elige una aventura y gana estrellas resolviendo operaciones.</Text>
            </View>
            <CelebrationStars count={3} />
          </View>
        </AppCard>

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
              animal="fox"
              color={colors.surfaceSoft}
              description="Entra a tesoros, claves y caminos con operaciones mezcladas."
              icon="controller-classic-outline"
              title="Juegos"
              onPress={() => navigation.navigate('GamesMenu')}
            />
            <AnimalCard
              animal="owl"
              color={colors.sky}
              description="Elige suma, resta, multiplicacion o division y refuerza un numero."
              icon="pencil-ruler"
              title="Practicas"
              onPress={() => navigation.navigate('PracticeMenu')}
            />
          </View>
        </View>

        <View style={styles.bottomActions}>
          <SoftFeedbackBubble message="Equivocarse tambien es parte de aprender" />
          <AppButton
            icon="rocket-launch-outline"
            title="Empezar con Practicas"
            onPress={() => navigation.navigate('PracticeMenu')}
          />
        </View>
      </ScreenContainer>
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
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border
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
  missionCard: {
    alignItems: 'center',
    gap: spacing.md
  },
  missionCopy: {
    alignItems: 'center',
    gap: spacing.xs
  },
  missionTitle: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center'
  },
  missionText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
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
  bottomActions: {
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingBottom: spacing.xl
  }
});

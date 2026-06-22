import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing } from '../../theme';
import type { ChildAvatarAnimal } from '../../domain/profiles';

export type AnimalKind = ChildAvatarAnimal;

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type AnimalMascotProps = {
  kind?: AnimalKind;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'thinking' | 'celebrating';
};

const animalConfig: Record<AnimalKind, { face: IconName; color: string; accent: string }> = {
  panda: { face: 'panda', color: colors.surface, accent: colors.sky },
  fox: { face: 'dog-side', color: colors.secondary, accent: colors.coral },
  owl: { face: 'owl', color: colors.lavender, accent: colors.banana },
  turtle: { face: 'turtle', color: colors.mint, accent: colors.primary },
  rabbit: { face: 'rabbit', color: colors.surfaceSoft, accent: colors.coral },
  bird: { face: 'bird', color: colors.sky, accent: colors.banana },
  dog: { face: 'dog-side', color: colors.banana, accent: colors.secondary }
};

const sizes = {
  sm: { wrap: 72, icon: 38 },
  md: { wrap: 112, icon: 62 },
  lg: { wrap: 156, icon: 90 }
} as const;

const moodMarks = {
  happy: 'Hi!',
  thinking: '?',
  celebrating: '+1'
} as const;

export function AnimalMascot({ kind = 'panda', showBadge = true, size = 'md', mood = 'happy' }: AnimalMascotProps) {
  const config = animalConfig[kind];
  const dimension = sizes[size];

  return (
    <View style={[styles.wrapper, { width: dimension.wrap, height: dimension.wrap }]}>
      <View style={[styles.ear, styles.leftEar, { backgroundColor: config.accent }]} />
      <View style={[styles.ear, styles.rightEar, { backgroundColor: config.accent }]} />
      <View style={[styles.face, { backgroundColor: config.color }]}>
        <MaterialCommunityIcons
          name={config.face}
          size={dimension.icon}
          color={colors.text}
        />
      </View>
      {showBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{moodMarks[mood]}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  face: {
    width: '82%',
    height: '82%',
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft
  },
  ear: {
    position: 'absolute',
    top: 8,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.surface
  },
  leftEar: {
    left: 16
  },
  rightEar: {
    right: 16
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: spacing.sm,
    minWidth: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.banana,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: colors.text,
    fontWeight: '900'
  }
});

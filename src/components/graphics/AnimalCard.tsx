import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AnimalKind, AnimalMascot } from './AnimalMascot';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type AnimalCardProps = {
  title: string;
  description: string;
  animal: AnimalKind;
  icon: IconName;
  color: string;
  onPress?: () => void;
};

export function AnimalCard({ title, description, animal, icon, color, onPress }: AnimalCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: color }, pressed && styles.pressed]}
    >
      <AnimalMascot kind={animal} size="sm" />
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 3,
    borderColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.soft
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  copy: {
    flex: 1,
    gap: spacing.sm
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    ...typography.subheading,
    color: colors.text
  },
  description: {
    ...typography.caption,
    color: colors.textMuted
  }
});

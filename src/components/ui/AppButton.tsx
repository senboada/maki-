import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing, typography } from '../../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'soft';
};

export function AppButton({ title, onPress, icon, variant = 'primary' }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed
      ]}
    >
      {icon ? (
        <View style={styles.iconBubble}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.primaryDark} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.button
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.secondary
  },
  soft: {
    backgroundColor: colors.surface
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    ...typography.button,
    color: colors.text
  }
});

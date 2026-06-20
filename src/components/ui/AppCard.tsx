import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '../../theme';

type AppCardProps = PropsWithChildren<{
  color?: string;
}>;

export function AppCard({ children, color = colors.surface }: AppCardProps) {
  return <View style={[styles.card, { backgroundColor: color }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.soft
  }
});

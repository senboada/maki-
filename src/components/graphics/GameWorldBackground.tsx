import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing } from '../../theme';

type GameWorldBackgroundProps = PropsWithChildren<{
  variant?: 'forest' | 'sky' | 'treasure';
}>;

const gradients = {
  forest: [colors.background, colors.backgroundAlt, colors.mint],
  sky: [colors.sky, colors.background, colors.surface],
  treasure: [colors.background, '#FFE7AF', colors.secondary]
} as const;

export function GameWorldBackground({ children, variant = 'forest' }: GameWorldBackgroundProps) {
  return (
    <LinearGradient colors={gradients[variant]} style={styles.container}>
      <View style={[styles.decor, styles.cloudOne]}>
        <MaterialCommunityIcons name="cloud" size={50} color={colors.surface} />
      </View>
      <View style={[styles.decor, styles.starOne]}>
        <MaterialCommunityIcons name="star" size={30} color={colors.banana} />
      </View>
      <View style={[styles.decor, styles.flowerOne]}>
        <MaterialCommunityIcons name="flower" size={36} color={colors.coral} />
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 0
  },
  decor: {
    position: 'absolute',
    opacity: 0.72
  },
  cloudOne: {
    top: spacing.xl,
    right: spacing.lg
  },
  starOne: {
    top: 116,
    left: spacing.xl
  },
  flowerOne: {
    bottom: 46,
    right: spacing['2xl']
  }
});

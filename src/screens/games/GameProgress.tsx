import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../theme';

type GameProgressProps = {
  current: number;
  total: number;
  correct: number;
};

export function GameProgress({ correct, current, total }: GameProgressProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Reto {Math.min(current + 1, total)} de {total}</Text>
      <View style={styles.stars}>
        {Array.from({ length: total }).map((_, index) => (
          <MaterialCommunityIcons
            key={index}
            name={index < correct ? 'star' : 'star-outline'}
            size={22}
            color={colors.secondaryDark}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.sm
  },
  text: {
    ...typography.caption,
    color: colors.primaryDark
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.xs
  }
});

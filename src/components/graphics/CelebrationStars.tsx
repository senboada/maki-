import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing } from '../../theme';

type CelebrationStarsProps = {
  count?: number;
};

export function CelebrationStars({ count = 5 }: CelebrationStarsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.starBubble, index % 2 === 0 && styles.large]}>
          <MaterialCommunityIcons name="star-four-points" size={20} color={colors.secondaryDark} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm
  },
  starBubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: colors.banana,
    alignItems: 'center',
    justifyContent: 'center'
  },
  large: {
    width: 42,
    height: 42
  }
});

import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../../theme';

type SoftFeedbackBubbleProps = {
  message: string;
  tone?: 'success' | 'tryAgain';
};

export function SoftFeedbackBubble({ message, tone = 'success' }: SoftFeedbackBubbleProps) {
  const icon = tone === 'success' ? 'party-popper' : 'heart-outline';
  const backgroundColor = tone === 'success' ? colors.mint : colors.dangerSoft;

  return (
    <View style={[styles.bubble, { backgroundColor }]}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.surface
  },
  message: {
    ...typography.body,
    color: colors.text
  }
});

import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type TextLinkProps = {
  label: string;
  onPress: () => void;
};

export function TextLink({ label, onPress }: TextLinkProps) {
  return (
    <Pressable accessibilityRole="button" hitSlop={spacing.md} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.body,
    color: colors.primaryDark,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});

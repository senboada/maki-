import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, GameWorldBackground, SoftFeedbackBubble } from '../../components/graphics';
import { AppButton, ScreenContainer } from '../../components/ui';
import type { AppStackParamList } from '../../navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { getPracticeNumberRange, operationContent } from './practiceContent';

type PracticeNumberSelectorScreenProps = NativeStackScreenProps<AppStackParamList, 'PracticeNumberSelector'>;

export function PracticeNumberSelectorScreen({ navigation, route }: PracticeNumberSelectorScreenProps) {
  const { operation } = route.params;
  const content = operationContent[operation];
  const numbers = getPracticeNumberRange(operation);

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <View style={styles.header}>
          <AnimalMascot kind="turtle" size="lg" mood="thinking" />
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name={content.icon} size={30} color={colors.primaryDark} />
            <Text style={styles.title}>{content.title}</Text>
          </View>
          <Text style={styles.subtitle}>Con que numero quieres practicar?</Text>
          <SoftFeedbackBubble message={content.helper} />
        </View>

        <View style={styles.numberGrid}>
          {numbers.map((number) => (
            <Pressable
              accessibilityRole="button"
              key={number}
              style={({ pressed }) => [styles.numberButton, pressed && styles.pressed]}
              onPress={() => navigation.navigate('PracticeGameSelector', { operation, selectedNumber: number })}
            >
              <Text style={styles.numberText}>{number}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <AppButton
            icon="arrow-left-circle-outline"
            title="Volver"
            variant="soft"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScreenContainer>
    </GameWorldBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center'
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center'
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center'
  },
  numberButton: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: colors.banana
  },
  numberText: {
    ...typography.subheading,
    color: colors.text
  },
  footer: {
    marginTop: spacing.xl,
    paddingBottom: spacing.xl
  }
});

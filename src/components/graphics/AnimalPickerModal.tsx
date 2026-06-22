import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ChildAvatarAnimal } from '../../domain/profiles';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AnimalMascot } from './AnimalMascot';

type AnimalPickerModalProps = {
  selectedAnimal: ChildAvatarAnimal;
  visible: boolean;
  onClose: () => void;
  onSelect: (animal: ChildAvatarAnimal) => void;
};

const animals: Array<{ label: string; value: ChildAvatarAnimal }> = [
  { label: 'Panda', value: 'panda' },
  { label: 'Zorro', value: 'fox' },
  { label: 'Búho', value: 'owl' },
  { label: 'Tortuga', value: 'turtle' },
  { label: 'Conejo', value: 'rabbit' },
  { label: 'Pájaro', value: 'bird' },
  { label: 'Perrito', value: 'dog' }
];

export function AnimalPickerModal({ onClose, onSelect, selectedAnimal, visible }: AnimalPickerModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Elige tu animal</Text>
            <Pressable accessibilityRole="button" style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Toca el compañero que quieres ver en tu perfil.</Text>

          <View style={styles.grid}>
            {animals.map((animal) => {
              const selected = animal.value === selectedAnimal;

              return (
                <Pressable
                  key={animal.value}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.animalOption, selected && styles.animalOptionSelected, pressed && styles.pressed]}
                  onPress={() => {
                    onSelect(animal.value);
                    onClose();
                  }}
                >
                  <AnimalMascot kind={animal.value} showBadge={false} size="sm" mood="celebrating" />
                  <Text style={styles.animalLabel}>{animal.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(47, 42, 74, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.soft
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    ...typography.subheading,
    color: colors.text
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center'
  },
  animalOption: {
    width: '29%',
    minWidth: 92,
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.sm
  },
  animalOptionSelected: {
    backgroundColor: colors.banana,
    borderColor: colors.secondary
  },
  pressed: {
    transform: [{ scale: 0.96 }]
  },
  animalLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800'
  }
});

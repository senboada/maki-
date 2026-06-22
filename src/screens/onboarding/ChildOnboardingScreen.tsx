import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, AnimalPickerModal, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppCard, AppInput, ScreenContainer } from '../../components/ui';
import type { ChildAvatarAnimal, ChildGender, ReinforcementTopic } from '../../domain/profiles';
import { useProfiles } from '../../providers';
import { colors, radius, spacing, typography } from '../../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const topicOptions: Array<{ label: string; value: ReinforcementTopic; icon: IconName }> = [
  { label: 'Suma', value: 'addition', icon: 'plus-circle-outline' },
  { label: 'Resta', value: 'subtraction', icon: 'minus-circle-outline' },
  { label: 'Multiplicacion', value: 'multiplication', icon: 'close-circle-outline' },
  { label: 'Division', value: 'division', icon: 'division' }
];

const genderOptions: Array<{ label: string; value: ChildGender }> = [
  { label: 'Niña', value: 'girl' },
  { label: 'Niño', value: 'boy' },
  { label: 'Prefiero no decirlo', value: 'prefer_not_to_say' }
];

export function ChildOnboardingScreen() {
  const { saveChildProfile } = useProfiles();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<ChildGender>('prefer_not_to_say');
  const [avatarAnimal, setAvatarAnimal] = useState<ChildAvatarAnimal>('rabbit');
  const [topics, setTopics] = useState<ReinforcementTopic[]>(['multiplication']);
  const [animalPickerVisible, setAnimalPickerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleTopic(topic: ReinforcementTopic) {
    setTopics((currentTopics) =>
      currentTopics.includes(topic)
        ? currentTopics.filter((currentTopic) => currentTopic !== topic)
        : [...currentTopics, topic]
    );
  }

  async function handleSave() {
    const parsedAge = Number(age);

    if (!name.trim()) {
      setError('Ingresa el nombre del niño o niña.');
      return;
    }

    if (!lastName.trim()) {
      setError('Ingresa el apellido del niño o niña.');
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge < 4 || parsedAge > 10) {
      setError('La edad debe estar entre 4 y 10 años.');
      return;
    }

    if (topics.length === 0) {
      setError('Selecciona al menos un tema para reforzar.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await saveChildProfile({
      name,
      lastName,
      age: parsedAge,
      gender,
      avatarAnimal,
      reinforcementTopics: topics
    });

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" onPress={() => setAnimalPickerVisible(true)}>
              <AnimalMascot kind={avatarAnimal} size="lg" mood="happy" />
            </Pressable>
            <Text style={styles.title}>Perfil del pequeño explorador</Text>
            <Text style={styles.subtitle}>Usaremos esto para personalizar la aventura. Toca el animal para cambiarlo.</Text>
          </View>

          <AppCard color={colors.surface}>
            <View style={styles.form}>
              <AppInput label="Nombre" placeholder="Ej: Manu" value={name} onChangeText={setName} />
              <AppInput label="Apellido" placeholder="Ej: Perez" value={lastName} onChangeText={setLastName} />
              <AppInput
                keyboardType="number-pad"
                label="Edad"
                maxLength={2}
                placeholder="4 a 10"
                value={age}
                onChangeText={setAge}
              />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genero</Text>
                <View style={styles.chips}>
                  {genderOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={gender === option.value}
                      onPress={() => setGender(option.value)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Que quiere reforzar?</Text>
                <View style={styles.topicGrid}>
                  {topicOptions.map((option) => (
                    <TopicChip
                      key={option.value}
                      icon={option.icon}
                      label={option.label}
                      selected={topics.includes(option.value)}
                      onPress={() => toggleTopic(option.value)}
                    />
                  ))}
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              <AppButton
                icon="heart-plus-outline"
                title={loading ? 'Guardando...' : 'Guardar perfil'}
                onPress={handleSave}
              />
            </View>
          </AppCard>
        </View>
      </ScreenContainer>
      <AnimalPickerModal
        selectedAnimal={avatarAnimal}
        visible={animalPickerVisible}
        onClose={() => setAnimalPickerVisible(false)}
        onSelect={setAvatarAnimal}
      />
    </GameWorldBackground>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

type TopicChipProps = ChipProps & {
  icon: IconName;
};

function TopicChip({ icon, label, selected, onPress }: TopicChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.topicChip, selected && styles.chipSelected]}
    >
      <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingVertical: spacing.xl
  },
  header: {
    alignItems: 'center',
    gap: spacing.md
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
  form: {
    gap: spacing.lg
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  chip: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 2,
    borderColor: colors.border
  },
  topicChip: {
    width: '47%',
    minHeight: 84,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 2,
    borderColor: colors.border
  },
  chipSelected: {
    backgroundColor: colors.banana,
    borderColor: colors.secondary
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center'
  },
  error: {
    ...typography.caption,
    color: colors.secondaryDark,
    textAlign: 'center'
  }
});

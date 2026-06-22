import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimalMascot, AnimalPickerModal, GameWorldBackground } from '../../components/graphics';
import { AppButton, AppCard, AppInput, ScreenContainer } from '../../components/ui';
import type { ChildAvatarAnimal, ChildGender, ReinforcementTopic } from '../../domain/profiles';
import type { AppStackParamList } from '../../navigation';
import { useAuth, useProfiles } from '../../providers';
import { colors, radius, spacing, typography } from '../../theme';

type ProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'Profile'>;
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const topicOptions: Array<{ label: string; value: ReinforcementTopic; icon: IconName }> = [
  { label: 'Suma', value: 'addition', icon: 'plus-circle-outline' },
  { label: 'Resta', value: 'subtraction', icon: 'minus-circle-outline' },
  { label: 'Multiplicación', value: 'multiplication', icon: 'close-circle-outline' },
  { label: 'División', value: 'division', icon: 'division' }
];

const genderOptions: Array<{ label: string; value: ChildGender }> = [
  { label: 'Niña', value: 'girl' },
  { label: 'Niño', value: 'boy' },
  { label: 'Prefiero no decirlo', value: 'prefer_not_to_say' }
];

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { changePassword } = useAuth();
  const { childProfile, updateChildProfile } = useProfiles();
  const [name, setName] = useState(childProfile?.name ?? '');
  const [lastName, setLastName] = useState(childProfile?.lastName ?? '');
  const [age, setAge] = useState(childProfile?.age ? String(childProfile.age) : '');
  const [gender, setGender] = useState<ChildGender>(childProfile?.gender ?? 'prefer_not_to_say');
  const [avatarAnimal, setAvatarAnimal] = useState<ChildAvatarAnimal>(childProfile?.avatarAnimal ?? 'rabbit');
  const [topics, setTopics] = useState<ReinforcementTopic[]>(childProfile?.reinforcementTopics ?? ['multiplication']);
  const [animalPickerVisible, setAnimalPickerVisible] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleTopic(topic: ReinforcementTopic) {
    setTopics((current) => current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]);
  }

  async function handleSaveProfile() {
    const parsedAge = Number(age);

    if (!name.trim() || !lastName.trim()) {
      setProfileMessage('Nombre y apellido son necesarios.');
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge < 4 || parsedAge > 10) {
      setProfileMessage('La edad debe estar entre 4 y 10 años.');
      return;
    }

    if (topics.length === 0) {
      setProfileMessage('Selecciona al menos un tema para reforzar.');
      return;
    }

    setLoading(true);
    setProfileMessage(null);
    const result = await updateChildProfile({ name, lastName, age: parsedAge, gender, avatarAnimal, reinforcementTopics: topics });
    setProfileMessage(result.error ?? 'Perfil actualizado con estrellas.');
    setLoading(false);
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Completa las tres contraseñas.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('La nueva contraseña no coincide.');
      return;
    }

    setLoading(true);
    setPasswordMessage(null);
    const result = await changePassword(currentPassword, newPassword);
    setPasswordMessage(result.error ?? 'Contraseña actualizada.');

    if (!result.error) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOpen(false);
    }

    setLoading(false);
  }

  return (
    <GameWorldBackground variant="forest">
      <ScreenContainer>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.backButtonSpacer} />
        </View>

        <AppCard color={colors.surface}>
          <View style={styles.form}>
            <Pressable accessibilityRole="button" style={styles.avatarButton} onPress={() => setAnimalPickerVisible(true)}>
              <AnimalMascot kind={avatarAnimal} size="lg" mood="celebrating" />
              <Text style={styles.avatarText}>Cambiar animal</Text>
            </Pressable>

            <AppInput label="Nombre" value={name} onChangeText={setName} />
            <AppInput label="Apellido" value={lastName} onChangeText={setLastName} />
            <AppInput keyboardType="number-pad" label="Edad" maxLength={2} value={age} onChangeText={setAge} />

            <Text style={styles.sectionTitle}>Género</Text>
            <View style={styles.chips}>{genderOptions.map((option) => <Chip key={option.value} label={option.label} selected={gender === option.value} onPress={() => setGender(option.value)} />)}</View>

            <Text style={styles.sectionTitle}>Prioridades</Text>
            <View style={styles.topicGrid}>{topicOptions.map((option) => <TopicChip key={option.value} icon={option.icon} label={option.label} selected={topics.includes(option.value)} onPress={() => toggleTopic(option.value)} />)}</View>

            {profileMessage ? <Text style={styles.message}>{profileMessage}</Text> : null}
            <AppButton icon="content-save-check" title={loading ? 'Guardando...' : 'Guardar perfil'} onPress={handleSaveProfile} />
          </View>
        </AppCard>

        <AppCard color={colors.surfaceSoft}>
          <Pressable accessibilityRole="button" style={styles.passwordHeader} onPress={() => setPasswordOpen((open) => !open)}>
            <View style={styles.passwordTitleRow}>
              <MaterialCommunityIcons name="lock-reset" size={24} color={colors.primaryDark} />
              <Text style={styles.passwordTitle}>Cambiar contraseña</Text>
            </View>
            <MaterialCommunityIcons name={passwordOpen ? 'chevron-up' : 'chevron-down'} size={26} color={colors.text} />
          </Pressable>
          {passwordOpen ? (
            <View style={styles.form}>
              <AppInput label="Contraseña actual" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
              <AppInput label="Nueva contraseña" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
              <AppInput label="Confirmar nueva contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
              {passwordMessage ? <Text style={styles.message}>{passwordMessage}</Text> : null}
              <AppButton icon="key-change" title="Actualizar contraseña" variant="secondary" onPress={handleChangePassword} />
            </View>
          ) : null}
        </AppCard>
      </ScreenContainer>
      <AnimalPickerModal selectedAnimal={avatarAnimal} visible={animalPickerVisible} onClose={() => setAnimalPickerVisible(false)} onSelect={setAvatarAnimal} />
    </GameWorldBackground>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}><Text style={styles.chipText}>{label}</Text></Pressable>;
}

function TopicChip({ icon, label, selected, onPress }: { icon: IconName; label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" style={[styles.topicChip, selected && styles.chipSelected]} onPress={onPress}><MaterialCommunityIcons name={icon} size={24} color={colors.text} /><Text style={styles.chipText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backButton: { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  backButtonSpacer: { width: 48 },
  title: { ...typography.heading, color: colors.text },
  form: { gap: spacing.lg },
  avatarButton: { alignItems: 'center', gap: spacing.sm },
  avatarText: { ...typography.caption, color: colors.primaryDark, fontWeight: '900' },
  sectionTitle: { ...typography.caption, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  chip: { minHeight: 44, borderRadius: radius.pill, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  topicChip: { width: '47%', minHeight: 84, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.banana, borderColor: colors.secondary },
  chipText: { ...typography.caption, color: colors.text, textAlign: 'center' },
  message: { ...typography.caption, color: colors.primaryDark, textAlign: 'center' },
  passwordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passwordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  passwordTitle: { ...typography.subheading, color: colors.text }
});

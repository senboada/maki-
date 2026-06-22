import type { ChildAvatarAnimal, ChildGender, ChildProfile, ReinforcementTopic, SaveChildProfileInput } from '../domain/profiles';
import { storageClient, storageKeys } from '../storage';
import { createLocalId } from '../utils/id';
import { fail, ok, type ServiceResult } from './serviceTypes';
import { supabase } from './supabaseClient';

type ChildProfileRow = {
  id: string;
  parent_id: string;
  name: string;
  last_name: string | null;
  age: number;
  gender: ChildGender | null;
  avatar_animal: ChildAvatarAnimal | null;
  reinforcement_topics: ReinforcementTopic[];
  created_at: string;
};

const defaultAvatarAnimal: ChildAvatarAnimal = 'rabbit';

function mapChildProfile(row: ChildProfileRow): ChildProfile {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    lastName: row.last_name ?? '',
    age: row.age,
    gender: row.gender,
    avatarAnimal: row.avatar_animal ?? defaultAvatarAnimal,
    reinforcementTopics: row.reinforcement_topics,
    createdAt: row.created_at
  };
}

export const childProfileService = {
  async getChildProfile(parentId: string): Promise<ServiceResult<ChildProfile | null>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('id,parent_id,name,last_name,age,gender,avatar_animal,reinforcement_topics,created_at')
        .eq('parent_id', parentId)
        .maybeSingle();

      if (error) {
        return fail(error.message);
      }

      return ok(data ? mapChildProfile(data as ChildProfileRow) : null);
    }

    const profile = await storageClient.getJson<ChildProfile & { avatarAnimal?: ChildAvatarAnimal; createdAt?: string }>(storageKeys.childProfile);

    return ok(profile?.parentId === parentId ? { ...profile, avatarAnimal: profile.avatarAnimal ?? defaultAvatarAnimal, createdAt: profile.createdAt ?? new Date(0).toISOString() } : null);
  },

  async saveChildProfile(parentId: string, input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: parentId,
          name: input.name.trim(),
          last_name: input.lastName.trim(),
          age: input.age,
          gender: input.gender,
          avatar_animal: input.avatarAnimal,
          reinforcement_topics: input.reinforcementTopics
        })
        .select('id,parent_id,name,last_name,age,gender,avatar_animal,reinforcement_topics,created_at')
        .single();

      if (error) {
        return fail(error.message);
      }

      return ok(mapChildProfile(data as ChildProfileRow));
    }

    const profile: ChildProfile = {
      id: createLocalId('child'),
      parentId,
      name: input.name.trim(),
      lastName: input.lastName.trim(),
      age: input.age,
      gender: input.gender,
      avatarAnimal: input.avatarAnimal,
      reinforcementTopics: input.reinforcementTopics,
      createdAt: new Date().toISOString()
    };

    await storageClient.setJson(storageKeys.childProfile, profile);
    return ok(profile);
  },

  async updateChildProfile(childId: string, input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('child_profiles')
        .update({
          name: input.name.trim(),
          last_name: input.lastName.trim(),
          age: input.age,
          gender: input.gender,
          avatar_animal: input.avatarAnimal,
          reinforcement_topics: input.reinforcementTopics
        })
        .eq('id', childId)
        .select('id,parent_id,name,last_name,age,gender,avatar_animal,reinforcement_topics,created_at')
        .single();

      if (error) {
        return fail(error.message);
      }

      return ok(mapChildProfile(data as ChildProfileRow));
    }

    const currentProfile = await storageClient.getJson<ChildProfile>(storageKeys.childProfile);

    if (!currentProfile || currentProfile.id !== childId) {
      return fail('No encontramos el perfil del niño o niña.');
    }

    const profile: ChildProfile = {
      ...currentProfile,
      name: input.name.trim(),
      lastName: input.lastName.trim(),
      age: input.age,
      gender: input.gender,
      avatarAnimal: input.avatarAnimal,
      reinforcementTopics: input.reinforcementTopics
    };

    await storageClient.setJson(storageKeys.childProfile, profile);
    return ok(profile);
  }
};

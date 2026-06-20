import type { ChildGender, ChildProfile, ReinforcementTopic, SaveChildProfileInput } from '../domain/profiles';
import { storageClient, storageKeys } from '../storage';
import { createLocalId } from '../utils/id';
import { fail, ok, type ServiceResult } from './serviceTypes';
import { supabase } from './supabaseClient';

type ChildProfileRow = {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  gender: ChildGender | null;
  reinforcement_topics: ReinforcementTopic[];
};

function mapChildProfile(row: ChildProfileRow): ChildProfile {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    reinforcementTopics: row.reinforcement_topics
  };
}

export const childProfileService = {
  async getChildProfile(parentId: string): Promise<ServiceResult<ChildProfile | null>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('id,parent_id,name,age,gender,reinforcement_topics')
        .eq('parent_id', parentId)
        .maybeSingle();

      if (error) {
        return fail(error.message);
      }

      return ok(data ? mapChildProfile(data as ChildProfileRow) : null);
    }

    return ok(await storageClient.getJson<ChildProfile>(storageKeys.childProfile));
  },

  async saveChildProfile(parentId: string, input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: parentId,
          name: input.name.trim(),
          age: input.age,
          gender: input.gender,
          reinforcement_topics: input.reinforcementTopics
        })
        .select('id,parent_id,name,age,gender,reinforcement_topics')
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
      age: input.age,
      gender: input.gender,
      reinforcementTopics: input.reinforcementTopics
    };

    await storageClient.setJson(storageKeys.childProfile, profile);
    return ok(profile);
  }
};

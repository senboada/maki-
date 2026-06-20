import type { ParentProfile } from '../domain/profiles';
import { storageClient, storageKeys } from '../storage';
import { createLocalId } from '../utils/id';
import { fail, ok, type ServiceResult } from './serviceTypes';
import { supabase } from './supabaseClient';

type ParentProfileRow = {
  id: string;
  user_id: string;
  email: string;
  consent_accepted: boolean;
  consent_accepted_at: string | null;
};

function mapParentProfile(row: ParentProfileRow): ParentProfile {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    consentAccepted: row.consent_accepted,
    consentAcceptedAt: row.consent_accepted_at
  };
}

export const parentProfileService = {
  async getParentProfile(userId: string): Promise<ServiceResult<ParentProfile | null>> {
    if (supabase) {
      const { data, error } = await supabase
        .from('parent_profiles')
        .select('id,user_id,email,consent_accepted,consent_accepted_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        return fail(error.message);
      }

      return ok(data ? mapParentProfile(data as ParentProfileRow) : null);
    }

    return ok(await storageClient.getJson<ParentProfile>(storageKeys.parentProfile));
  },

  async createParentProfile(userId: string, email: string): Promise<ServiceResult<ParentProfile>> {
    const existing = await this.getParentProfile(userId);

    if (existing.error) {
      return fail(existing.error);
    }

    if (existing.data) {
      return ok(existing.data);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('parent_profiles')
        .insert({ user_id: userId, email })
        .select('id,user_id,email,consent_accepted,consent_accepted_at')
        .single();

      if (error) {
        return fail(error.message);
      }

      return ok(mapParentProfile(data as ParentProfileRow));
    }

    const profile: ParentProfile = {
      id: createLocalId('parent'),
      userId,
      email,
      consentAccepted: false,
      consentAcceptedAt: null
    };

    await storageClient.setJson(storageKeys.parentProfile, profile);
    return ok(profile);
  },

  async acceptConsent(parentId: string): Promise<ServiceResult<ParentProfile>> {
    const acceptedAt = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('parent_profiles')
        .update({ consent_accepted: true, consent_accepted_at: acceptedAt })
        .eq('id', parentId)
        .select('id,user_id,email,consent_accepted,consent_accepted_at')
        .single();

      if (error) {
        return fail(error.message);
      }

      return ok(mapParentProfile(data as ParentProfileRow));
    }

    const profile = await storageClient.getJson<ParentProfile>(storageKeys.parentProfile);

    if (!profile) {
      return fail('No encontramos el perfil del acudiente.');
    }

    const updatedProfile = { ...profile, consentAccepted: true, consentAcceptedAt: acceptedAt };
    await storageClient.setJson(storageKeys.parentProfile, updatedProfile);
    return ok(updatedProfile);
  }
};

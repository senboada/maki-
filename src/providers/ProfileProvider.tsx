import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { ChildProfile, ParentProfile, SaveChildProfileInput } from '../domain/profiles';
import { childProfileService, parentProfileService, type ServiceResult, fail, ok } from '../services';
import { useAuth } from './AuthProvider';

type ProfileStatus = 'loading' | 'ready' | 'guest';

type ProfileContextValue = {
  status: ProfileStatus;
  parentProfile: ParentProfile | null;
  childProfile: ChildProfile | null;
  needsConsent: boolean;
  needsChildProfile: boolean;
  ensureParentProfile: () => Promise<ServiceResult<ParentProfile>>;
  acceptConsent: () => Promise<ServiceResult<ParentProfile>>;
  saveChildProfile: (input: SaveChildProfileInput) => Promise<ServiceResult<ChildProfile>>;
  refreshProfiles: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function getUserEmail(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  return 'email' in user && user.email ? user.email : '';
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const { status: authStatus, user } = useAuth();
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);

  async function ensureParentProfile(): Promise<ServiceResult<ParentProfile>> {
    if (!user) {
      return fail('Debes iniciar sesion primero.');
    }

    const email = getUserEmail(user);
    const result = await parentProfileService.createParentProfile(user.id, email);

    if (result.data) {
      setParentProfile(result.data);
    }

    return result;
  }

  async function refreshProfiles() {
    if (authStatus === 'loading') {
      setStatus('loading');
      return;
    }

    if (!user) {
      setParentProfile(null);
      setChildProfile(null);
      setStatus('guest');
      return;
    }

    setStatus('loading');

    const parentResult = await ensureParentProfile();

    if (!parentResult.data) {
      setStatus('ready');
      return;
    }

    const childResult = await childProfileService.getChildProfile(parentResult.data.id);

    setChildProfile(childResult.data ?? null);
    setStatus('ready');
  }

  async function acceptConsent(): Promise<ServiceResult<ParentProfile>> {
    const currentParent = parentProfile ?? (await ensureParentProfile()).data;

    if (!currentParent) {
      return fail('No encontramos el perfil del acudiente.');
    }

    const result = await parentProfileService.acceptConsent(currentParent.id);

    if (result.data) {
      setParentProfile(result.data);
    }

    return result;
  }

  async function saveChildProfile(input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    const currentParent = parentProfile ?? (await ensureParentProfile()).data;

    if (!currentParent) {
      return fail('No encontramos el perfil del acudiente.');
    }

    const result = await childProfileService.saveChildProfile(currentParent.id, input);

    if (result.data) {
      setChildProfile(result.data);
    }

    return result;
  }

  useEffect(() => {
    void refreshProfiles();
  }, [authStatus, user?.id]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      status,
      parentProfile,
      childProfile,
      needsConsent: Boolean(parentProfile && !parentProfile.consentAccepted),
      needsChildProfile: Boolean(parentProfile?.consentAccepted && !childProfile),
      ensureParentProfile,
      acceptConsent,
      saveChildProfile,
      refreshProfiles
    }),
    [childProfile, parentProfile, status]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider');
  }

  return context;
}

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
  updateChildProfile: (input: SaveChildProfileInput) => Promise<ServiceResult<ChildProfile>>;
  justCompletedChildProfile: boolean;
  clearChildProfileCelebration: () => void;
  refreshProfiles: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function getUserEmail(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  return 'email' in user && user.email ? user.email : user.id;
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const { status: authStatus, user } = useAuth();
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [justCompletedChildProfile, setJustCompletedChildProfile] = useState(false);

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
      setJustCompletedChildProfile(false);
      setStatus('guest');
      return;
    }

    setStatus('loading');
    setParentProfile(null);
    setChildProfile(null);

    const parentResult = await ensureParentProfile();

    if (!parentResult.data) {
      setParentProfile(null);
      setChildProfile(null);
      setStatus('ready');
      return;
    }

    const childResult = await childProfileService.getChildProfile(parentResult.data.id);

    setChildProfile(childResult.data ?? null);
    setStatus('ready');
  }

  async function acceptConsent(): Promise<ServiceResult<ParentProfile>> {
    const parentResult = parentProfile ? ok(parentProfile) : await ensureParentProfile();

    if (parentResult.error) {
      return fail(parentResult.error);
    }

    const currentParent = parentResult.data;

    if (!currentParent) {
      return fail('No pudimos preparar el perfil del acudiente. Intenta cerrar sesion e ingresar de nuevo.');
    }

    const result = await parentProfileService.acceptConsent(currentParent.id);

    if (result.data) {
      setParentProfile(result.data);
    }

    return result;
  }

  async function saveChildProfile(input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    const parentResult = parentProfile ? ok(parentProfile) : await ensureParentProfile();

    if (parentResult.error) {
      return fail(parentResult.error);
    }

    const currentParent = parentResult.data;

    if (!currentParent) {
      return fail('No pudimos preparar el perfil del acudiente. Intenta cerrar sesion e ingresar de nuevo.');
    }

    const result = await childProfileService.saveChildProfile(currentParent.id, input);

    if (result.data) {
      setChildProfile(result.data);
      setJustCompletedChildProfile(true);
    }

    return result;
  }

  async function updateChildProfile(input: SaveChildProfileInput): Promise<ServiceResult<ChildProfile>> {
    if (!childProfile) {
      return fail('No encontramos el perfil del niño o niña.');
    }

    const result = await childProfileService.updateChildProfile(childProfile.id, input);

    if (result.data) {
      setChildProfile(result.data);
    }

    return result;
  }

  function clearChildProfileCelebration() {
    setJustCompletedChildProfile(false);
  }

  useEffect(() => {
    void refreshProfiles();
  }, [authStatus, user?.id]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      status,
      parentProfile,
      childProfile,
      needsConsent: authStatus === 'authenticated' && status === 'ready' && (!parentProfile || !parentProfile.consentAccepted),
      needsChildProfile: authStatus === 'authenticated' && status === 'ready' && Boolean(parentProfile?.consentAccepted && !childProfile),
      ensureParentProfile,
      acceptConsent,
      saveChildProfile,
      updateChildProfile,
      justCompletedChildProfile,
      clearChildProfileCelebration,
      refreshProfiles
    }),
    [authStatus, childProfile, justCompletedChildProfile, parentProfile, status]
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

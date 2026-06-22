import type { User } from '@supabase/supabase-js';

import { storageClient, storageKeys } from '../storage';
import { createLocalId } from '../utils/id';
import { fail, ok, type ServiceResult } from './serviceTypes';
import { supabase } from './supabaseClient';

export type LocalAuthUser = {
  id: string;
  email: string;
};

export type AuthUser = User | LocalAuthUser;

type StoredLocalSession = {
  user: LocalAuthUser;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrio un error inesperado.';
}

export const authService = {
  async register(email: string, password: string): Promise<ServiceResult<AuthUser>> {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        return fail(error.message);
      }

      const user = data.user;

      if (!user) {
        return fail('No pudimos crear la cuenta. Intenta de nuevo.');
      }

      return ok(user);
    }

    const localUser = { id: createLocalId('local-user'), email };
    await storageClient.setJson(storageKeys.authSession, { user: localUser });

    return ok(localUser);
  },

  async login(email: string, password: string): Promise<ServiceResult<AuthUser>> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return fail(error.message);
      }

      if (!data.user) {
        return fail('No pudimos iniciar sesion. Revisa tus datos.');
      }

      return ok(data.user);
    }

    const localUser = { id: createLocalId('local-user'), email };
    await storageClient.setJson(storageKeys.authSession, { user: localUser });

    return ok(localUser);
  },

  async forgotPassword(email: string): Promise<ServiceResult<boolean>> {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return fail(error.message);
      }
    }

    return ok(true);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ServiceResult<boolean>> {
    if (!supabase) {
      return fail('Cambio de contraseña disponible al usar Supabase.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return fail(userError.message);
    }

    const email = userData.user?.email;

    if (!email) {
      return fail('No encontramos el correo de la cuenta.');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });

    if (signInError) {
      return fail('La contraseña actual no es correcta.');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      return fail(error.message);
    }

    return ok(true);
  },

  async logout(): Promise<ServiceResult<boolean>> {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return fail(error.message);
        }
      }

      await storageClient.remove(storageKeys.authSession);
      return ok(true);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    }

    const localSession = await storageClient.getJson<StoredLocalSession>(storageKeys.authSession);
    return localSession?.user ?? null;
  }
};

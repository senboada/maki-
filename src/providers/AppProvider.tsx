import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './AuthProvider';
import { ProfileProvider } from './ProfileProvider';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </ProfileProvider>
    </AuthProvider>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../providers';
import { LoadingScreen } from '../screens/system/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import type { RootStackParamList } from './navigationTypes';
import { hiddenHeaderOptions } from './screenOptions';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      {status === 'authenticated' ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

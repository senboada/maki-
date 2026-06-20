import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from '../screens/auth';
import type { AuthStackParamList } from './navigationTypes';
import { hiddenHeaderOptions } from './screenOptions';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors } from '../theme';

export const hiddenHeaderOptions = {
  headerShown: false,
  contentStyle: {
    backgroundColor: colors.background
  }
} satisfies NativeStackNavigationOptions;

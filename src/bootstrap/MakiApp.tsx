import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '../navigation';
import { AppProvider } from '../providers';

export function MakiApp() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

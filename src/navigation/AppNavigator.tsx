import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FeaturePreviewScreen, WelcomeScreen } from '../screens/home';
import {
  GamesMenuScreen,
  MatchPairsGameScreen,
  MazeGameScreen,
  PasswordGameScreen,
  RandomGameSessionPreviewScreen,
  TreasureGameScreen
} from '../screens/games';
import { ChildOnboardingScreen, ConsentScreen } from '../screens/onboarding';
import {
  PracticeGameSelectorScreen,
  PracticeMenuScreen,
  PracticeNumberSelectorScreen,
  PracticeSessionPreviewScreen
} from '../screens/practice';
import { useProfiles } from '../providers';
import { LoadingScreen } from '../screens/system';
import type { AppStackParamList } from './navigationTypes';
import { hiddenHeaderOptions } from './screenOptions';

const Stack = createNativeStackNavigator<AppStackParamList>();

const gameScreenOptions = {
  ...hiddenHeaderOptions,
  gestureEnabled: false
} as const;

export function AppNavigator() {
  const { needsChildProfile, needsConsent, status } = useProfiles();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      {needsConsent ? (
        <Stack.Screen name="Consent" component={ConsentScreen} />
      ) : needsChildProfile ? (
        <Stack.Screen name="ChildOnboarding" component={ChildOnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="FeaturePreview" component={FeaturePreviewScreen} />
          <Stack.Screen name="GamesMenu" component={GamesMenuScreen} />
          <Stack.Screen name="RandomGameSessionPreview" component={RandomGameSessionPreviewScreen} />
          <Stack.Screen name="TreasureGame" component={TreasureGameScreen} options={gameScreenOptions} />
          <Stack.Screen name="MatchPairsGame" component={MatchPairsGameScreen} options={gameScreenOptions} />
          <Stack.Screen name="PasswordGame" component={PasswordGameScreen} options={gameScreenOptions} />
          <Stack.Screen name="MazeGame" component={MazeGameScreen} options={gameScreenOptions} />
          <Stack.Screen name="PracticeMenu" component={PracticeMenuScreen} />
          <Stack.Screen name="PracticeNumberSelector" component={PracticeNumberSelectorScreen} />
          <Stack.Screen name="PracticeGameSelector" component={PracticeGameSelectorScreen} />
          <Stack.Screen name="PracticeSessionPreview" component={PracticeSessionPreviewScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

import type { OperationType } from '../domain/math';

export type PracticeGameType = 'treasure' | 'match_pairs' | 'password' | 'maze';

export type GameRouteParams = {
  mode: 'practice' | 'random';
  operation?: OperationType;
  selectedNumber?: number;
};

export type MainStackParamList = {
  Welcome: undefined;
  FeaturePreview: {
    feature: 'practice' | 'games';
  };
  Profile: undefined;
  PracticeMenu: undefined;
  PracticeNumberSelector: {
    operation: OperationType;
  };
  PracticeGameSelector: {
    operation: OperationType;
    selectedNumber: number;
  };
  PracticeSessionPreview: {
    operation: OperationType;
    selectedNumber: number;
    gameType: PracticeGameType;
  };
  GamesMenu: undefined;
  TreasureGame: GameRouteParams;
  MatchPairsGame: GameRouteParams;
  PasswordGame: GameRouteParams;
  MazeGame: GameRouteParams;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Consent: undefined;
  ChildOnboarding: undefined;
  Welcome: undefined;
  FeaturePreview: {
    feature: 'practice' | 'games';
  };
  Profile: undefined;
  PracticeMenu: undefined;
  PracticeNumberSelector: {
    operation: OperationType;
  };
  PracticeGameSelector: {
    operation: OperationType;
    selectedNumber: number;
  };
  PracticeSessionPreview: {
    operation: OperationType;
    selectedNumber: number;
    gameType: PracticeGameType;
  };
  GamesMenu: undefined;
  TreasureGame: GameRouteParams;
  MatchPairsGame: GameRouteParams;
  PasswordGame: GameRouteParams;
  MazeGame: GameRouteParams;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

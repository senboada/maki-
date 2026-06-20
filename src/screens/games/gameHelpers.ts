import { generatePracticeQuestions, generateRandomMixedQuestions, type MathQuestion } from '../../domain/math';
import type { GameRouteParams, PracticeGameType } from '../../navigation';

export const defaultGameQuestionCount = 5;

export function createGameQuestions(params: GameRouteParams, count = defaultGameQuestionCount): MathQuestion[] {
  if (params.mode === 'practice') {
    if (!params.operation || !params.selectedNumber) {
      throw new Error('Practice mode requires operation and selectedNumber.');
    }

    return generatePracticeQuestions(params.operation, params.selectedNumber, count);
  }

  return generateRandomMixedQuestions(count);
}

export function navigateToGame(
  navigation: {
    navigate: (screen: 'TreasureGame' | 'MatchPairsGame' | 'PasswordGame' | 'MazeGame', params: GameRouteParams) => void;
  },
  gameType: PracticeGameType,
  params: GameRouteParams
) {
  switch (gameType) {
    case 'treasure':
      navigation.navigate('TreasureGame', params);
      break;
    case 'match_pairs':
      navigation.navigate('MatchPairsGame', params);
      break;
    case 'password':
      navigation.navigate('PasswordGame', params);
      break;
    case 'maze':
      navigation.navigate('MazeGame', params);
      break;
  }
}

export function getGameIntro(params: GameRouteParams) {
  if (params.mode === 'practice') {
    return 'Practica enfocada';
  }

  return 'Operaciones mixtas';
}
